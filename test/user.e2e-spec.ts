import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { UserService } from '@this/modules/user/services/user.service';
import { AppModule } from '@this/app.module';
import { mockUserService } from './mocks/user/user.service.mock';

describe('UserModule', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(UserService)
      .useValue(mockUserService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST: /users', () => {
    beforeEach(() => {
      jest.spyOn(mockUserService, 'create');
    });

    it('should return OK', async () => {
      await request(app.getHttpServer())
        .post('/users')
        .send({
          name: 'John Doe',
          email: 'john.doe@example.com',
        })
        .expect(201, {
          id: 1,
          name: 'John Doe',
          email: 'john.doe@example.com',
        });
    });
  });

  describe('GET: /users/:id', () => {
    beforeEach(() => {
      jest.spyOn(mockUserService, 'one');
    });

    it('should return OK', async () => {
      await request(app.getHttpServer()).get('/users/1').expect(200, {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com',
      });
    });
  });
});
