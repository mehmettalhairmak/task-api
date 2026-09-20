import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateTaskDto } from './create-task.dto.js';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
    @ApiProperty({
        description: 'Indicates whether the task is completed',
        example: false,
        required: false,
    })
    @IsOptional()
    @IsBoolean()
    completed?: boolean;
}
