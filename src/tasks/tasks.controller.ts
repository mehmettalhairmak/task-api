import {
    Body,
    Controller,
    Get,
    Post,
    Param,
    ParseUUIDPipe,
    Patch,
    HttpCode,
    HttpStatus,
    Delete,
} from '@nestjs/common';
import { TasksService } from './tasks.service.js';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Tasks')
@Controller({
    path: 'tasks',
    version: '1',
})
export class TasksController {
    constructor(private readonly tasksService: TasksService) {}

    @Get()
    @ApiOperation({ summary: 'Get all tasks' })
    @ApiResponse({ status: 200, description: 'The task list was successfully retrieved.' })
    findAll() {
        return this.tasksService.findAll();
    }

    @Post()
    @ApiOperation({ summary: 'Create a new task' })
    @ApiResponse({ status: 201, description: 'The task was successfully created.' })
    @ApiResponse({ status: 400, description: 'Invalid input data.' })
    create(@Body() createTaskDto: CreateTaskDto) {
        return this.tasksService.create(createTaskDto);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a task by ID' })
    @ApiParam({
        name: 'id',
        description: 'The ID of the task to retrieve',
        type: 'string',
        format: 'uuid',
    })
    @ApiResponse({ status: 200, description: 'The task was successfully retrieved.' })
    @ApiResponse({ status: 404, description: 'Task not found.' })
    findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
        return this.tasksService.findOne(id);
    }

    //*
    @Patch(':id')
    @ApiOperation({ summary: 'Update a task by ID' })
    @ApiParam({
        name: 'id',
        description: 'The ID of the task to update',
        type: 'string',
        format: 'uuid',
    })
    @ApiBody({ type: UpdateTaskDto, description: 'The task data to update' })
    @ApiResponse({ status: 200, description: 'The task was successfully updated.' })
    @ApiResponse({ status: 400, description: 'Invalid input data.' })
    @ApiResponse({ status: 404, description: 'Task not found.' })
    update(
        @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
        @Body() UpdateTaskDto: UpdateTaskDto,
    ) {
        return this.tasksService.update(id, UpdateTaskDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete a task by ID' })
    @ApiParam({
        name: 'id',
        description: 'The ID of the task to delete',
        type: 'string',
        format: 'uuid',
    })
    @ApiResponse({ status: 204, description: 'The task was successfully deleted.' })
    @ApiResponse({ status: 404, description: 'Task not found.' })
    async remove(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
        await this.tasksService.remove(id);
    }
}
