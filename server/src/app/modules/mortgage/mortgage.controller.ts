import type { Request } from 'express';

import { Controller, Get, Post, Body, Param, Req } from '@nestjs/common';
import { MortgageService } from './mortgage.service';
import { CreateMortgageProfileDto } from './dto/mortgage-profile.dto';

@Controller('mortgage-profiles')
export class MortgageController {
  constructor(private readonly service: MortgageService) {}

  @Post()
  async create(
    @Req() req: Request,
    @Body() dto: CreateMortgageProfileDto
  ) {
    return this.service.create(req.mortgageUserId, dto);
  }

  @Get(':id')
  async getById(@Param('id') id: string, @Req() req: Request) {
    return this.service.getById(Number(id), req.mortgageUserId);
  }
}
