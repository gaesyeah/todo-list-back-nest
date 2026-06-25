import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CurrentUserDto } from 'src/auth/current-user-dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly repository: Repository<Task>,
  ) {}

  async create(dto: CreateTaskDto, user: CurrentUserDto) {
    const existingTask = await this.repository.findOneBy({
      name: dto.name,
      userId: user.id,
    });
    if (existingTask) {
      throw new ConflictException(`Task ${dto.name} already exists`);
    }

    const task = this.repository.create({ userId: user.id, ...dto });
    return this.repository.save(task);
  }

  findAllByUser(user: CurrentUserDto) {
    return this.repository.find({ where: { userId: user.id } });
  }

  async findOneById(id: string) {
    const task = await this.repository.findOneBy({ id });
    if (!task) {
      throw new NotFoundException(`Task ${id} not found`);
    }

    return task;
  }

  async updateById(id: string, dto: UpdateTaskDto) {
    const task = await this.repository.findOneBy({ id });

    if (!task) {
      throw new NotFoundException(`Task ${id} not found`);
    }

    const existingTask = await this.repository.findOneBy({ name: dto.name });
    if (existingTask && existingTask.id !== id) {
      throw new ConflictException(`Task ${dto.name} already exists`);
    }

    this.repository.merge(task, dto);
    return this.repository.save(task);
  }

  async deleteById(id: string) {
    const task = await this.repository.findOneBy({ id });
    if (!task) {
      throw new NotFoundException(`Task ${id} not found`);
    }

    return this.repository.remove(task);
  }
}
