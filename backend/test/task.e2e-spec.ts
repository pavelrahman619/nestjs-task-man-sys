import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { AuthService } from '../src/auth/auth.service';
import * as request from 'supertest';

describe('TaskController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let authService: AuthService;

  let userToken: string;
  let userId: string;
  let taskId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    prisma = app.get(PrismaService);
    authService = app.get(AuthService);

    await app.init();

    // Clean up database before tests
    await prisma.task.deleteMany();
    await prisma.user.deleteMany();

    // Create a test user and get token
    const signUpResult = await authService.signUp({
      email: 'test@example.com',
      password: 'testpassword',
      name: 'Test User',
    });

    userToken = signUpResult.data.access_token;
    userId = signUpResult.data.user.id;
  });

  afterAll(async () => {
    // Clean up database after tests
    await prisma.task.deleteMany();
    await prisma.user.deleteMany();
    await app.close();
  });

  describe('/tasks (POST)', () => {
    it('should create a new task', async () => {
      const createTaskDto = {
        title: 'Test Task',
        description: 'Test Description',
        status: 'PENDING',
      };

      const response = await request(app.getHttpServer())
        .post('/tasks')
        .set('Authorization', `Bearer ${userToken}`)
        .send(createTaskDto)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(createTaskDto.title);
      expect(response.body.data.description).toBe(createTaskDto.description);
      expect(response.body.data.status).toBe(createTaskDto.status);
      expect(response.body.data.userId).toBe(userId);

      // Store task ID for other tests
      taskId = response.body.data.id;
    });

    it('should fail to create task without authentication', async () => {
      const createTaskDto = {
        title: 'Test Task',
        description: 'Test Description',
      };

      await request(app.getHttpServer())
        .post('/tasks')
        .send(createTaskDto)
        .expect(401);
    });

    it('should fail to create task with invalid data', async () => {
      const createTaskDto = {
        title: '', // Invalid: empty title
        description: 'Test Description',
      };

      await request(app.getHttpServer())
        .post('/tasks')
        .set('Authorization', `Bearer ${userToken}`)
        .send(createTaskDto)
        .expect(400);
    });
  });

  describe('/tasks (GET)', () => {
    it('should get user tasks', async () => {
      const response = await request(app.getHttpServer())
        .get('/tasks')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    it('should fail to get tasks without authentication', async () => {
      await request(app.getHttpServer())
        .get('/tasks')
        .expect(401);
    });
  });

  describe('/tasks/:id (GET)', () => {
    it('should get task by id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/tasks/${taskId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(taskId);
    });

    it('should fail to get non-existent task', async () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';
      
      const response = await request(app.getHttpServer())
        .get(`/tasks/${nonExistentId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Task not found');
    });

    it('should fail to get task without authentication', async () => {
      await request(app.getHttpServer())
        .get(`/tasks/${taskId}`)
        .expect(401);
    });
  });

  describe('/tasks/:id (PUT)', () => {
    it('should update task', async () => {
      const updateTaskDto = {
        title: 'Updated Task Title',
        description: 'Updated Description',
        status: 'COMPLETED',
      };

      const response = await request(app.getHttpServer())
        .put(`/tasks/${taskId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(updateTaskDto)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(updateTaskDto.title);
      expect(response.body.data.description).toBe(updateTaskDto.description);
      expect(response.body.data.status).toBe(updateTaskDto.status);
    });

    it('should fail to update non-existent task', async () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';
      const updateTaskDto = {
        title: 'Updated Task Title',
      };

      const response = await request(app.getHttpServer())
        .put(`/tasks/${nonExistentId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(updateTaskDto)
        .expect(200);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Task not found');
    });

    it('should fail to update task without authentication', async () => {
      const updateTaskDto = {
        title: 'Updated Task Title',
      };

      await request(app.getHttpServer())
        .put(`/tasks/${taskId}`)
        .send(updateTaskDto)
        .expect(401);
    });
  });

  describe('/tasks/:id (DELETE)', () => {
    it('should fail to delete non-existent task', async () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';

      const response = await request(app.getHttpServer())
        .delete(`/tasks/${nonExistentId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Task not found');
    });

    it('should fail to delete task without authentication', async () => {
      await request(app.getHttpServer())
        .delete(`/tasks/${taskId}`)
        .expect(401);
    });

    it('should delete task', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/tasks/${taskId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Task deleted successfully');

      // Verify task is deleted
      const getResponse = await request(app.getHttpServer())
        .get(`/tasks/${taskId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(getResponse.body.success).toBe(false);
      expect(getResponse.body.message).toBe('Task not found');
    });
  });
});
