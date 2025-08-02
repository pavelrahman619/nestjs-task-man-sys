import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { CreateTaskDto, UpdateTaskDto, TaskStatus } from './dto';
import { JwtGuard } from '../auth';

describe('TaskController', () => {
  let controller: TaskController;
  let service: TaskService;

  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    name: 'Test User',
  };

  const mockTask = {
    id: 'task-123',
    title: 'Test Task',
    description: 'Test Description',
    status: TaskStatus.PENDING,
    userId: 'user-123',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockTaskService: Record<string, jest.Mock> = {
    createTask: jest.fn(),
    getUserTasks: jest.fn(),
    getTaskById: jest.fn(),
    updateTask: jest.fn(),
    deleteTask: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        {
          provide: TaskService,
          useValue: mockTaskService,
        },
      ],
    })
      .overrideGuard(JwtGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<TaskController>(TaskController);
    service = module.get<TaskService>(TaskService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createTask', () => {
    it('should create a task successfully', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'New Task',
        description: 'New Description',
        status: TaskStatus.PENDING as TaskStatus,
      };

      const expectedResult = {
        success: true,
        data: mockTask,
        message: 'Task created successfully',
      };

      mockTaskService.createTask.mockResolvedValue(expectedResult);

      const result = await controller.createTask(mockUser, createTaskDto);

      expect(service.createTask).toHaveBeenCalledWith(
        mockUser.id,
        createTaskDto,
      );
      expect(result).toEqual(expectedResult);
    });

    it('should handle create task failure', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'New Task',
      };

      const expectedResult = {
        success: false,
        message: 'Failed to create task. Please try again later.',
      };

      mockTaskService.createTask.mockResolvedValue(expectedResult);

      const result = await controller.createTask(mockUser, createTaskDto);

      expect(service.createTask).toHaveBeenCalledWith(
        mockUser.id,
        createTaskDto,
      );
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getUserTasks', () => {
    it('should get user tasks successfully', async () => {
      const expectedResult = {
        success: true,
        data: [mockTask],
      };

      mockTaskService.getUserTasks.mockResolvedValue(expectedResult);

      const result = await controller.getUserTasks(mockUser);

      expect(service.getUserTasks).toHaveBeenCalledWith(mockUser.id);
      expect(result).toEqual(expectedResult);
    });

    it('should handle get user tasks failure', async () => {
      const expectedResult = {
        success: false,
        message: 'Failed to fetch tasks. Please try again later.',
      };

      mockTaskService.getUserTasks.mockResolvedValue(expectedResult);

      const result = await controller.getUserTasks(mockUser);

      expect(service.getUserTasks).toHaveBeenCalledWith(mockUser.id);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getTaskById', () => {
    it('should get task by id successfully', async () => {
      const taskId = 'task-123';
      const expectedResult = {
        success: true,
        data: mockTask,
      };

      mockTaskService.getTaskById.mockResolvedValue(expectedResult);

      const result = await controller.getTaskById(mockUser, taskId);

      expect(service.getTaskById).toHaveBeenCalledWith(mockUser.id, taskId);
      expect(result).toEqual(expectedResult);
    });

    it('should handle task not found', async () => {
      const taskId = 'non-existent-task';
      const expectedResult = {
        success: false,
        message: 'Task not found',
      };

      mockTaskService.getTaskById.mockResolvedValue(expectedResult);

      const result = await controller.getTaskById(mockUser, taskId);

      expect(service.getTaskById).toHaveBeenCalledWith(mockUser.id, taskId);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('updateTask', () => {
    it('should update task successfully', async () => {
      const taskId = 'task-123';
      const updateTaskDto: UpdateTaskDto = {
        title: 'Updated Task',
        status: TaskStatus.COMPLETED as TaskStatus,
      };

      const expectedResult = {
        success: true,
        data: { ...mockTask, ...updateTaskDto },
        message: 'Task updated successfully',
      };

      mockTaskService.updateTask.mockResolvedValue(expectedResult);

      const result = await controller.updateTask(
        mockUser,
        taskId,
        updateTaskDto,
      );

      expect(service.updateTask).toHaveBeenCalledWith(
        mockUser.id,
        taskId,
        updateTaskDto,
      );
      expect(result).toEqual(expectedResult);
    });

    it('should handle update task failure', async () => {
      const taskId = 'task-123';
      const updateTaskDto: UpdateTaskDto = {
        title: 'Updated Task',
      };

      const expectedResult = {
        success: false,
        message: 'Task not found',
      };

      mockTaskService.updateTask.mockResolvedValue(expectedResult);

      const result = await controller.updateTask(
        mockUser,
        taskId,
        updateTaskDto,
      );

      expect(service.updateTask).toHaveBeenCalledWith(
        mockUser.id,
        taskId,
        updateTaskDto,
      );
      expect(result).toEqual(expectedResult);
    });
  });

  describe('deleteTask', () => {
    it('should delete task successfully', async () => {
      const taskId = 'task-123';
      const expectedResult = {
        success: true,
        message: 'Task deleted successfully',
      };

      mockTaskService.deleteTask.mockResolvedValue(expectedResult);

      const result = await controller.deleteTask(mockUser, taskId);

      expect(service.deleteTask).toHaveBeenCalledWith(mockUser.id, taskId);
      expect(result).toEqual(expectedResult);
    });

    it('should handle delete task failure', async () => {
      const taskId = 'non-existent-task';
      const expectedResult = {
        success: false,
        message: 'Task not found',
      };

      mockTaskService.deleteTask.mockResolvedValue(expectedResult);

      const result = await controller.deleteTask(mockUser, taskId);

      expect(service.deleteTask).toHaveBeenCalledWith(mockUser.id, taskId);
      expect(result).toEqual(expectedResult);
    });
  });
});
