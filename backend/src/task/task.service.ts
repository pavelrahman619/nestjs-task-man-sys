import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto, UpdateTaskDto } from './dto';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  async createTask(userId: string, dto: CreateTaskDto) {
    try {
      const task = await this.prisma.task.create({
        data: {
          title: dto.title,
          description: dto.description,
          status: dto.status || 'PENDING',
          userId: userId,
        },
      });

      return {
        success: true,
        data: task,
        message: 'Task created successfully',
      };
    } catch (error) {
      console.error('TaskService createTask error:', error);
      return {
        success: false,
        message: 'Failed to create task. Please try again later.',
      };
    }
  }

  async getUserTasks(userId: string) {
    try {
      const tasks = await this.prisma.task.findMany({
        where: {
          userId: userId,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return {
        success: true,
        data: tasks,
      };
    } catch (error) {
      console.error('TaskService getUserTasks error:', error);
      return {
        success: false,
        message: 'Failed to fetch tasks. Please try again later.',
      };
    }
  }

  async getTaskById(userId: string, taskId: string) {
    try {
      const task = await this.prisma.task.findFirst({
        where: {
          id: taskId,
          userId: userId,
        },
      });

      if (!task) {
        return {
          success: false,
          message: 'Task not found',
        };
      }

      return {
        success: true,
        data: task,
      };
    } catch (error) {
      console.error('TaskService getTaskById error:', error);
      return {
        success: false,
        message: 'Failed to fetch task. Please try again later.',
      };
    }
  }

  async updateTask(userId: string, taskId: string, dto: UpdateTaskDto) {
    try {
      const task = await this.prisma.task.findFirst({
        where: {
          id: taskId,
          userId: userId,
        },
      });

      if (!task) {
        return {
          success: false,
          message: 'Task not found',
        };
      }

      const updatedTask = await this.prisma.task.update({
        where: {
          id: taskId,
        },
        data: {
          title: dto.title,
          description: dto.description,
          status: dto.status,
        },
      });

      return {
        success: true,
        data: updatedTask,
        message: 'Task updated successfully',
      };
    } catch (error) {
      console.error('TaskService updateTask error:', error);
      return {
        success: false,
        message: 'Failed to update task. Please try again later.',
      };
    }
  }

  async deleteTask(userId: string, taskId: string) {
    try {
      const task = await this.prisma.task.findFirst({
        where: {
          id: taskId,
          userId: userId,
        },
      });

      if (!task) {
        return {
          success: false,
          message: 'Task not found',
        };
      }

      await this.prisma.task.delete({
        where: {
          id: taskId,
        },
      });

      return {
        success: true,
        message: 'Task deleted successfully',
      };
    } catch (error) {
      console.error('TaskService deleteTask error:', error);
      return {
        success: false,
        message: 'Failed to delete task. Please try again later.',
      };
    }
  }
}
