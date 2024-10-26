import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDto } from 'src/user/dto/login.dto';
import { VeryWeaklyAuthenticatedGuard } from 'src/shared/guards/very-weakly-authenticated.guard';
import { CompanyAdminGuard } from 'src/shared/guards/company-admin.guard';
import { AuthUser } from 'src/shared/decorators/auth-user.decorator';
import { User } from 'src/user/entities/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.userService.login(loginDto.email);
  }

  @Get('me')
  @UseGuards(VeryWeaklyAuthenticatedGuard)
  getMe(@AuthUser() user: User) {
    return user;
  }

  @Post()
  @UseGuards(VeryWeaklyAuthenticatedGuard, CompanyAdminGuard)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @UseGuards(VeryWeaklyAuthenticatedGuard, CompanyAdminGuard)
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @UseGuards(VeryWeaklyAuthenticatedGuard, CompanyAdminGuard)
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(VeryWeaklyAuthenticatedGuard, CompanyAdminGuard)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(VeryWeaklyAuthenticatedGuard, CompanyAdminGuard)
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
