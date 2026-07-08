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

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() dto: CreateTaskDto, @CurrentUser() user: CurrentUserDto) {
    return this.tasksService.create(dto, user);
  }

  @Get()
  findAllByUser(@CurrentUser() user: CurrentUserDto) {
    return this.tasksService.findAllByUser(user);
  }

  @Get(':id')
  @UseGuards(OwnerGuard(TasksService))
  findOneById(@Param('id') id: string) {
    return this.tasksService.findOneById(id);
  }

  @Patch(':id')
  @UseGuards(OwnerGuard(TasksService))
  updateById(@Param('id') id: string, @Body() dto: UpdateTaskDto) {
    return this.tasksService.updateById(id, dto);
  }

  @HttpCode(204)
  @Delete(':id')
  @UseGuards(OwnerGuard(TasksService))
  deleteById(@Param('id') id: string) {
    return this.tasksService.deleteById(id);
  }
}
