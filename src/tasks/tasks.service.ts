import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';
import { randomUUID } from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity } from './entities/task.entity.js';
import { Repository } from 'typeorm';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(TaskEntity) private readonly taskRepository: Repository<TaskEntity>,
    ) {}

    async findAll(): Promise<TaskEntity[]> {
        return this.taskRepository.find();
    }

    async create(createTaskDto: CreateTaskDto): Promise<TaskEntity> {
        const task = this.taskRepository.create({
            title: createTaskDto.title,
            completed: false,
        });

        return this.taskRepository.save(task);
    }

    async findOne(id: string): Promise<TaskEntity> {
        const task = await this.taskRepository.findOneBy({ id });

        if (!task) {
            throw new NotFoundException(`Task with id "${id}" not found`);
        }

        return task;
    }

    async update(id: string, updateTaskDto: UpdateTaskDto): Promise<TaskEntity> {
        const task = await this.findOne(id);

        if (updateTaskDto.title !== undefined) {
            task.title = updateTaskDto.title;
        }

        if (updateTaskDto.completed !== undefined) {
            task.completed = updateTaskDto.completed;
        }

        return this.taskRepository.save(task);
    }

    async remove(id: string): Promise<void> {
        const task = await this.findOne(id);

        await this.taskRepository.remove(task);
    }
}
