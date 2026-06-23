import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DevelopersModule } from './developers/developers.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [DevelopersModule, TasksModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
