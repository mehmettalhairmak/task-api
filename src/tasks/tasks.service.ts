import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';
import { TaskEntity } from './entities/task.entity.js';
import { TASK_REPOSITORY } from './domain/tasks.repository.interface.js';
import type { ITaskRepository } from './domain/tasks.repository.interface.js';

@Injectable()
export class TasksService {
    constructor(@Inject(TASK_REPOSITORY) private readonly taskRepository: ITaskRepository) {}

    async findAll(): Promise<TaskEntity[]> {
        return this.taskRepository.findAll();
    }

    async findOne(id: string): Promise<TaskEntity> {
        const task = await this.taskRepository.findOne(id);

        if (!task) {
            throw new NotFoundException(`Task with id "${id}" not found`);
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
        await this.findOne(id); // Ensure the task exists before updating
        return this.taskRepository.update(id, updateTaskDto);
    }

    async remove(id: string): Promise<void> {
        await this.findOne(id); // Ensure the task exists before removing
        return this.taskRepository.delete(id);
    }
}
