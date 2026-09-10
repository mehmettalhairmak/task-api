import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';
import { randomUUID } from 'crypto';

type Task = {
    id: string;
    title: string;
    completed: boolean;
};

@Injectable()
export class TasksService {
    private readonly tasks: Task[] = [];

    findAll() {
        return this.tasks;
    }

    create(createTaskDto: CreateTaskDto): Task {
        const task: Task = {
            id: randomUUID(),
            title: createTaskDto.title,
            completed: false,
        };

        this.tasks.push(task);
        return task;
    }

    findOne(id: string): Task {
        const task = this.tasks.find((task) => task.id === id);

        if (!task) {
            throw new NotFoundException(`Task with id "${id}" not found`);
        }

        return task;
    }

    update(id: string, updateTaskDto: UpdateTaskDto): Task {
        const task = this.findOne(id);

        if (updateTaskDto.title !== undefined) {
            task.title = updateTaskDto.title;
        }

        if (updateTaskDto.completed !== undefined) {
            task.completed = updateTaskDto.completed;
        }

        return task;
    }

    remove(id: string): void {
        const task = this.findOne(id);
        const taskIndex = this.tasks.indexOf(task);

        this.tasks.splice(taskIndex, 1);
    }
}
