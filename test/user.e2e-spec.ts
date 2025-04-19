// test/user.e2e-spec.ts
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaClient } from '@prisma/client';
import { UserDto } from '../src/modules/user/dtos/user.dto';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaClient;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    await app.init();

    // instancia e conecta o PrismaClient manualmente
    prisma = new PrismaClient();
    await prisma.$connect();

    // limpa a tabela de usuários
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await app.close();
    await prisma.$disconnect();
  });

  describe('/POST users', () => {
    it('should create a user and return 201 + body', async () => {
      const payload: UserDto = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'Abcd1234!',
      };

      const res = await request(app.getHttpServer())
        .post('/users')
        .send(payload)
        .expect(201);

      expect(res.body).toEqual({
        id: expect.any(String),
        email: payload.email,
        name: payload.name,
      });
    });
  });

  describe('/GET users/:id', () => {
    let userId: string;

    beforeAll(async () => {
      const user = await prisma.user.create({
        data: { email: 'foo@bar.com', name: 'Foo Bar', password: 'Xyz987!' },
      });
      userId = user.id;
    });

    it('should return 200 + user data', async () => {
      const res = await request(app.getHttpServer())
        .get(`/users/${userId}`)
        .expect(200);

      expect(res.body).toEqual({
        id: userId,
        email: 'foo@bar.com',
        name: 'Foo Bar',
      });
    });
  });

  describe('/GET users (paginate)', () => {
    beforeAll(async () => {
      await prisma.user.createMany({
        data: [
          { email: 'a@a.com', name: 'A', password: 'Pwd1!' },
          { email: 'b@b.com', name: 'B', password: 'Pwd2!' },
          { email: 'c@c.com', name: 'C', password: 'Pwd3!' },
        ],
      });
    });

    it('should return paginated list with metadata', async () => {
      const res = await request(app.getHttpServer())
        .get('/users')
        .query({ page: 1, limit: 2 })
        .expect(200);

      // Assert the new shape:
      expect(res.body).toMatchObject({
        items: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            email: expect.any(String),
            name: expect.any(String),
          }),
        ]),
        total: expect.any(Number),
        page: 1,
        limit: 2,
      });

      // E garanta exatamente 2 itens no array:
      expect(res.body.items).toHaveLength(2);
    });
  });
});
