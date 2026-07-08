import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CurrentUserDto } from 'src/auth/types/current-user.type';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllWithPagination(dto: PaginationDto) {
    return this.prisma.extended.task.paginate({
      ...dto,
      orderBy: { createdAt: 'desc' },
    });
  }

  findAllByUser(user: CurrentUserDto) {
    return this.prisma.task.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOneById(id: string) {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task) {
      throw new NotFoundException(`Task ${id} not found`);
    }

    return task;
  }

  async create(dto: CreateTaskDto, user: CurrentUserDto) {
    const existingTask = await this.prisma.task.findUnique({
      where: { name_userId: { name: dto.name, userId: user.id } },
    });
    if (existingTask) {
      throw new ConflictException(`Task ${dto.name} already exists`);
    }

    return this.prisma.task.create({ data: { userId: user.id, ...dto } });
  }

  async updateById(id: string, dto: UpdateTaskDto) {
    const task = await this.prisma.task.findUnique({ where: { id } });

    if (!task) {
      throw new NotFoundException(`Task ${id} not found`);
    }

    if (dto.name) {
      const existingTask = await this.prisma.task.findUnique({
        where: { name_userId: { name: dto.name, userId: task.userId } },
      });

      if (existingTask && existingTask.id !== id) {
        throw new ConflictException(`Task ${dto.name} already exists`);
      }
    }

    return this.prisma.task.update({ where: { id }, data: dto });
  }

  async deleteById(id: string) {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task) {
      throw new NotFoundException(`Task ${id} not found`);
    }

    return this.prisma.task.delete({ where: { id } });
  }
}
