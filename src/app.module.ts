import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { HttpQueryModule } from './http-query';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HttpQueryModule,
    PrismaModule,
    TasksModule,
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}
