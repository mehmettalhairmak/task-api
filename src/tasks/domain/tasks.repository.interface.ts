import { TaskEntity } from '../entities/task.entity.js';

export const TASK_REPOSITORY = Symbol('TASK_REPOSITORY');

export interface ITaskRepository {
    findAll(): Promise<TaskEntity[]>;
    findOne(id: string): Promise<TaskEntity | null>;
    create(data: Partial<TaskEntity>): Promise<TaskEntity>;
    update(id: string, data: Partial<TaskEntity>): Promise<TaskEntity | null>;
    delete(id: string): Promise<boolean>;
}
