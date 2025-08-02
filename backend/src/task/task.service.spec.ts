import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto, UpdateTaskDto, TaskStatus } from './dto';

describe('TaskService', () => {
  let service: TaskService;
  let prismaService: PrismaService;

  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    name: 'Test User',
  };

  const mockTask = {
    id: 'task-123',
    title: 'Test Task',
    description: 'Test Description',
    status: 'PENDING' as const,
    userId: 'user-123',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPrismaService = {
    task: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createTask', () => {
    it('should create a task successfully', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'New Task',
        description: 'New Description',
        status: TaskStatus.PENDING,
      };

      mockPrismaService.task.create.mockResolvedValue(mockTask);

      const result = await service.createTask(mockUser.id, createTaskDto);

      expect(prismaService.task.create).toHaveBeenCalledWith({
        data: {
          title: createTaskDto.title,
          description: createTaskDto.description,
          status: createTaskDto.status,
          userId: mockUser.id,
        },
      });

      expect(result).toEqual({
        success: true,
        data: mockTask,
        message: 'Task created successfully',
      });
    });

    it('should create a task with default status when status not provided', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'New Task',
        description: 'New Description',
      };

      mockPrismaService.task.create.mockResolvedValue(mockTask);

      const result = await service.createTask(mockUser.id, createTaskDto);

      expect(prismaService.task.create).toHaveBeenCalledWith({
        data: {
          title: createTaskDto.title,
          description: createTaskDto.description,
          status: 'PENDING',
          userId: mockUser.id,
        },
      });

      expect(result.success).toBe(true);
    });

    it('should handle create task error', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'New Task',
      };

      mockPrismaService.task.create.mockRejectedValue(
        new Error('Database error'),
      );

      const result = await service.createTask(mockUser.id, createTaskDto);

      expect(result).toEqual({
        success: false,
        message: 'Failed to create task. Please try again later.',
      });
    });
  });

  describe('getUserTasks', () => {
    it('should get user tasks successfully', async () => {
      const mockTasks = [mockTask];
      mockPrismaService.task.findMany.mockResolvedValue(mockTasks);

      const result = await service.getUserTasks(mockUser.id);

      expect(prismaService.task.findMany).toHaveBeenCalledWith({
        where: {
          userId: mockUser.id,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      expect(result).toEqual({
        success: true,
        data: mockTasks,
      });
    });

    it('should handle get user tasks error', async () => {
      mockPrismaService.task.findMany.mockRejectedValue(
        new Error('Database error'),
      );

      const result = await service.getUserTasks(mockUser.id);

      expect(result).toEqual({
        success: false,
        message: 'Failed to fetch tasks. Please try again later.',
      });
    });
  });

  describe('getTaskById', () => {
    it('should get task by id successfully', async () => {
      const taskId = 'task-123';
      mockPrismaService.task.findFirst.mockResolvedValue(mockTask);

      const result = await service.getTaskById(mockUser.id, taskId);

      expect(prismaService.task.findFirst).toHaveBeenCalledWith({
        where: {
          id: taskId,
          userId: mockUser.id,
        },
      });

      expect(result).toEqual({
        success: true,
        data: mockTask,
      });
    });

    it('should handle task not found', async () => {
      const taskId = 'non-existent-task';
      mockPrismaService.task.findFirst.mockResolvedValue(null);

      const result = await service.getTaskById(mockUser.id, taskId);

      expect(result).toEqual({
        success: false,
        message: 'Task not found',
      });
    });

    it('should handle get task by id error', async () => {
      const taskId = 'task-123';
      mockPrismaService.task.findFirst.mockRejectedValue(
        new Error('Database error'),
      );

      const result = await service.getTaskById(mockUser.id, taskId);

      expect(result).toEqual({
        success: false,
        message: 'Failed to fetch task. Please try again later.',
      });
    });
  });

  describe('updateTask', () => {
    it('should update task successfully', async () => {
      const taskId = 'task-123';
      const updateTaskDto: UpdateTaskDto = {
        title: 'Updated Task',
        status: TaskStatus.COMPLETED,
      };

      const updatedTask = { ...mockTask, ...updateTaskDto };

      mockPrismaService.task.findFirst.mockResolvedValue(mockTask);
      mockPrismaService.task.update.mockResolvedValue(updatedTask);

      const result = await service.updateTask(
        mockUser.id,
        taskId,
        updateTaskDto,
      );

      expect(prismaService.task.findFirst).toHaveBeenCalledWith({
        where: {
          id: taskId,
          userId: mockUser.id,
        },
      });

      expect(prismaService.task.update).toHaveBeenCalledWith({
        where: {
          id: taskId,
        },
        data: {
          title: updateTaskDto.title,
          description: updateTaskDto.description,
          status: updateTaskDto.status,
        },
      });

      expect(result).toEqual({
        success: true,
        data: updatedTask,
        message: 'Task updated successfully',
      });
    });

    it('should handle task not found during update', async () => {
      const taskId = 'non-existent-task';
      const updateTaskDto: UpdateTaskDto = {
        title: 'Updated Task',
      };

      mockPrismaService.task.findFirst.mockResolvedValue(null);

      const result = await service.updateTask(
        mockUser.id,
        taskId,
        updateTaskDto,
      );

      expect(result).toEqual({
        success: false,
        message: 'Task not found',
      });

      expect(prismaService.task.update).not.toHaveBeenCalled();
    });

    it('should handle update task error', async () => {
      const taskId = 'task-123';
      const updateTaskDto: UpdateTaskDto = {
        title: 'Updated Task',
      };

      mockPrismaService.task.findFirst.mockRejectedValue(
        new Error('Database error'),
      );

      const result = await service.updateTask(
        mockUser.id,
        taskId,
        updateTaskDto,
      );

      expect(result).toEqual({
        success: false,
        message: 'Failed to update task. Please try again later.',
      });
    });
  });

  describe('deleteTask', () => {
    it('should delete task successfully', async () => {
      const taskId = 'task-123';

      mockPrismaService.task.findFirst.mockResolvedValue(mockTask);
      mockPrismaService.task.delete.mockResolvedValue(mockTask);

      const result = await service.deleteTask(mockUser.id, taskId);

      expect(prismaService.task.findFirst).toHaveBeenCalledWith({
        where: {
          id: taskId,
          userId: mockUser.id,
        },
      });

      expect(prismaService.task.delete).toHaveBeenCalledWith({
        where: {
          id: taskId,
        },
      });

      expect(result).toEqual({
        success: true,
        message: 'Task deleted successfully',
      });
    });

    it('should handle task not found during delete', async () => {
      const taskId = 'non-existent-task';

      mockPrismaService.task.findFirst.mockResolvedValue(null);

      const result = await service.deleteTask(mockUser.id, taskId);

      expect(result).toEqual({
        success: false,
        message: 'Task not found',
      });

      expect(prismaService.task.delete).not.toHaveBeenCalled();
    });

    it('should handle delete task error', async () => {
      const taskId = 'task-123';

      mockPrismaService.task.findFirst.mockRejectedValue(
        new Error('Database error'),
      );

      const result = await service.deleteTask(mockUser.id, taskId);

      expect(result).toEqual({
        success: false,
        message: 'Failed to delete task. Please try again later.',
      });
    });
  });
});
