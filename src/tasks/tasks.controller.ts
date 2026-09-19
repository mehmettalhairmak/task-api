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

@Controller('tasks')
export class TasksController {
    constructor(private readonly tasksService: TasksService) {}

    @Get()
    findAll() {
        return this.tasksService.findAll();
    }

    @Post()
    create(@Body() createTaskDto: CreateTaskDto) {
        return this.tasksService.create(createTaskDto);
    }

    @Get(':id')
    findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
        return this.tasksService.findOne(id);
    }

    @Patch(':id')
    update(
        @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
        @Body() UpdateTaskDto: UpdateTaskDto,
    ) {
        return this.tasksService.update(id, UpdateTaskDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
        await this.tasksService.remove(id);
    }
}
