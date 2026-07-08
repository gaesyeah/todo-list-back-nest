import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { Task } from 'src/generated/prisma/client';

export class CreateTaskDto implements Pick<
  Task,
  'name' | 'description' | 'completed'
> {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsBoolean()
  completed: boolean;
}
