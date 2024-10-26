import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ChargingStationService } from './charging-station.service';
import { CreateChargingStationDto } from './dto/create-charging-station.dto';
import { UpdateChargingStationDto } from './dto/update-charging-station.dto';
import { VeryWeaklyAuthenticatedGuard } from 'src/shared/guards/very-weakly-authenticated.guard';
import { CompanyAdminGuard } from 'src/shared/guards/company-admin.guard';

@Controller('charging-station')
export class ChargingStationController {
  constructor(private readonly chargingStationService: ChargingStationService) {}

  @Post()
  @UseGuards(VeryWeaklyAuthenticatedGuard, CompanyAdminGuard)
  create(@Body() createChargingStationDto: CreateChargingStationDto) {
    return this.chargingStationService.create(createChargingStationDto);
  }

  @Get()
  @UseGuards(VeryWeaklyAuthenticatedGuard)
  findAll() {
    return this.chargingStationService.findAll();
  }

  @Get(':id')
  @UseGuards(VeryWeaklyAuthenticatedGuard)
  findOne(@Param('id') id: string) {
    return this.chargingStationService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(VeryWeaklyAuthenticatedGuard, CompanyAdminGuard)
  update(@Param('id') id: string, @Body() updateChargingStationDto: UpdateChargingStationDto) {
    return this.chargingStationService.update(+id, updateChargingStationDto);
  }

  @Delete(':id')
  @UseGuards(VeryWeaklyAuthenticatedGuard, CompanyAdminGuard)
  remove(@Param('id') id: string) {
    return this.chargingStationService.remove(+id);
  }
}
