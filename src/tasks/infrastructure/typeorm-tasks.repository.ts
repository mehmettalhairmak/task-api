import { Injectable } from '@nestjs/common';
import { ITaskRepository } from '../domain/tasks.repository.interface.js';
import { TaskEntity } from '../entities/task.entity.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TypeOrmTaskRepository implements ITaskRepository {
    constructor(@InjectRepository(TaskEntity) private readonly repo: Repository<TaskEntity>) {}

    async findAll(): Promise<TaskEntity[]> {
        return this.repo.find();
    }

    async findOne(id: string): Promise<TaskEntity | null> {
        return this.repo.findOneBy({ id });
    }

    async create(data: Partial<TaskEntity>): Promise<TaskEntity> {
        const entity = this.repo.create(data);
        return this.repo.save(entity);
    }

    async update(id: string, data: Partial<TaskEntity>): Promise<TaskEntity | null> {
        const updatedResult = await this.repo.update(id, data);

        if (updatedResult.affected === 0) {
            return null;
        }

        return this.repo.findOneBy({ id });
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.repo.delete(id);
        return (result.affected ?? 0) > 0;
    }
}
