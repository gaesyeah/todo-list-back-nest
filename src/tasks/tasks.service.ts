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

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly repository: Repository<Task>,
  ) {}

  async create(dto: CreateTaskDto) {
    const existingTask = await this.repository.findOneBy({ name: dto.name });
    if (existingTask) {
      throw new ConflictException(`Task ${dto.name} already exists`);
    }

    const task = this.repository.create(dto);
    return this.repository.save(task);
  }

  findAll() {
    return this.repository.find();
  }

  async findOne(id: string) {
    const task = await this.repository.findOneBy({ id });
    if (!task) {
      throw new NotFoundException(`Task ${id} not found`);
    }

    return task;
  }

  async update(id: string, dto: UpdateTaskDto) {
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

  async remove(id: string) {
    const task = await this.repository.findOneBy({ id });
    if (!task) {
      throw new NotFoundException(`Task ${id} not found`);
    }

    return this.repository.remove(task);
  }
}
