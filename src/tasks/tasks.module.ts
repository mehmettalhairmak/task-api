import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller.js';
import { TasksService } from './tasks.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskEntity } from './entities/task.entity.js';
import { TypeOrmTaskRepository } from './infrastructure/typeorm-tasks.repository.js';

@Module({
    imports: [TypeOrmModule.forFeature([TaskEntity])],
    controllers: [TasksController],
    providers: [
        TasksService,
        {
            provide: 'TASK_REPOSITORY',
            useClass: TypeOrmTaskRepository,
        },
    ],
})
export class TasksModule {}
