import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';
import type { CurrentUserDto } from 'src/auth/types/current-user.type';
import { OwnerGuard } from 'src/common/guards/owner.guard';
import { Query } from 'src/http-query';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Query()
  findAllWithPagination(@Body() dto: PaginationDto) {
    return this.tasksService.findAllWithPagination(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAllByUser(@CurrentUser() user: CurrentUserDto) {
    return this.tasksService.findAllByUser(user);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @UseGuards(OwnerGuard((prisma) => prisma.task))
  findOneById(@Param('id') id: string) {
    return this.tasksService.findOneById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreateTaskDto, @CurrentUser() user: CurrentUserDto) {
    return this.tasksService.create(dto, user);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UseGuards(OwnerGuard((prisma) => prisma.task))
  updateById(@Param('id') id: string, @Body() dto: UpdateTaskDto) {
    return this.tasksService.updateById(id, dto);
  }

  @HttpCode(204)
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @UseGuards(OwnerGuard((prisma) => prisma.task))
  deleteById(@Param('id') id: string) {
    return this.tasksService.deleteById(id);
  }
}
