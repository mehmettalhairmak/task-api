import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller.js';
import { TasksService } from './tasks.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskEntity } from './entities/task.entity.js';

@Module({
    imports: [TypeOrmModule.forFeature([TaskEntity])],
    controllers: [TasksController],
    providers: [TasksService],
})
export class TasksModule {}
