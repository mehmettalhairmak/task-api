import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';
import { TaskEntity } from './entities/task.entity.js';
import { TASK_REPOSITORY } from './domain/tasks.repository.interface.js';
import type { ITaskRepository } from './domain/tasks.repository.interface.js';
import { TaskNotFoundException } from '../common/exceptions/task-not-found.exception.js';

@Injectable()
export class TasksService {
    constructor(@Inject(TASK_REPOSITORY) private readonly taskRepository: ITaskRepository) {}

    async findAll(): Promise<TaskEntity[]> {
        return this.taskRepository.findAll();
    }

    async findOne(id: string): Promise<TaskEntity> {
        const task = await this.taskRepository.findOne(id);

        if (!task) {
            throw new TaskNotFoundException(id);
        }

        return task;
    }

    async create(createTaskDto: CreateTaskDto): Promise<TaskEntity> {
        return this.taskRepository.create({
            title: createTaskDto.title,
            completed: false,
        });
    }

    async update(id: string, updateTaskDto: UpdateTaskDto): Promise<TaskEntity> {
        const updatedTask = await this.taskRepository.update(id, updateTaskDto);

        if (!updatedTask) {
            throw new TaskNotFoundException(id);
        }

        return updatedTask;
    }

    async remove(id: string): Promise<void> {
        const deleted = await this.taskRepository.delete(id);

        if (!deleted) {
            throw new TaskNotFoundException(id);
        }
    }
}
