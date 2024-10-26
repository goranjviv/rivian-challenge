import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Not, Repository } from 'typeorm';
import { encodeVeryWeakAuthToken } from 'src/shared/helpers';
import { UserType } from 'src/shared/enums';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {
    this.createDefaultUsers();
  }

  // quick hack to prepopulate the users table
  async createDefaultUsers() {
    const defaultAdmin = await this.userRepo.findOne({
      where: {
        email: "admin@rivian.com"
      }
    });

    if (!defaultAdmin) {
      await this.userRepo.save({
        userType: UserType.CompanyAdmin,
        email: "admin@rivian.com",
        travelDistanceKm: 50,
        fullName: "Admin Rivianovic"
      } as Partial<User>);
    }

    const defaultEmployee1 = await this.userRepo.findOne({
      where: {
        email: "employee1@rivian.com"
      }
    });

    if (!defaultEmployee1) {
      await this.userRepo.save({
        userType: UserType.Employee,
        email: "employee1@rivian.com",
        travelDistanceKm: 66,
        fullName: "Employee Prvi Employkovic"
      } as Partial<User>);
    }

    const defaultEmployee2 = await this.userRepo.findOne({
      where: {
        email: "employee2@rivian.com"
      }
    });

    if (!defaultEmployee2) {
      await this.userRepo.save({
        userType: UserType.Employee,
        email: "employee2@rivian.com",
        travelDistanceKm: 188,
        fullName: "Employee Drugi Employkovic"
      } as Partial<User>);
    }
  }

  async login(email: string) {
    const user = await this.userRepo.findOne({
      where: {
        email
      }
    });

    if (!user) {
      throw new UnauthorizedException('Bad email');
    }

    return {
      user,
      token: encodeVeryWeakAuthToken(user.email, user.id)
    };
  }

  async throwConflictIfEmailTaken(email: string, idToExclude?: number) {
    const excludeIdQueryPart = idToExclude ? {
      id: Not(idToExclude)
    } : undefined;

    const userWithEmail = await this.userRepo.findOne({
      where: {
        email,
        ...excludeIdQueryPart
      }
    });

    if (userWithEmail) {
      throw new ConflictException('Email already taken');
    }
  }

  async create(createUserDto: CreateUserDto) {
    await this.throwConflictIfEmailTaken(createUserDto.email);

    return this.userRepo.save(createUserDto);
  }

  async findAll() {
    return this.userRepo.find();
  }

  async findOne(id: number) {
    return this.userRepo.findOneOrFail({
      where: {
        id
      }
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.email) {
      await this.throwConflictIfEmailTaken(updateUserDto.email, id);
    }

    const user = await this.userRepo.findOneOrFail({
      where: {
        id
      }
    });

    const updatedUser = {
      ...user,
      ...updateUserDto
    };

    return this.userRepo.save(updatedUser);
  }

  async remove(id: number) {
    const user = await this.userRepo.findOneOrFail({
      where: {
        id
      }
    });

    await this.userRepo.delete({ id });

    return user;
  }
}
