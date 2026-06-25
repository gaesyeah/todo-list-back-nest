import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CurrentUserDto } from 'src/auth/current-user-dto';
import { TasksService } from './tasks.service';

@Injectable()
export class TaskOwnerGuard implements CanActivate {
  constructor(private readonly tasksService: TasksService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const request = ctx.switchToHttp().getRequest<{
      params: { id: string };
      user: CurrentUserDto;
    }>();

    const task = await this.tasksService.findOneById(request.params.id);

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task.userId === request.user.id;
  }
}
