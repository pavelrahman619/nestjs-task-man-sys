import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto, UpdateTaskDto } from './dto';
import { JwtGuard, GetUser } from '../auth';

@Controller('tasks')
@UseGuards(JwtGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  async createTask(@GetUser() user: any, @Body() dto: CreateTaskDto) {
    return this.taskService.createTask(user.id, dto);
  }

  @Get()
  async getUserTasks(@GetUser() user: any) {
    return this.taskService.getUserTasks(user.id);
  }

  @Get(':id')
  async getTaskById(@GetUser() user: any, @Param('id') taskId: string) {
    return this.taskService.getTaskById(user.id, taskId);
  }

  @Put(':id')
  async updateTask(
    @GetUser() user: any,
    @Param('id') taskId: string,
    @Body() dto: UpdateTaskDto,
  ) {
    return this.taskService.updateTask(user.id, taskId, dto);
  }

  @Delete(':id')
  async deleteTask(@GetUser() user: any, @Param('id') taskId: string) {
    return this.taskService.deleteTask(user.id, taskId);
  }
}
