import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';

import * as mongoose from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../src/modules/auth/auth.module';
import { UsersModule } from '../src/modules/users/users.module';
import { GenerateFakeDataService } from '../src/generate-data/generate-fake-data.service';
import { GenerateDataModule } from '../src/generate-data/generate-data.module';
import { CreateRoleDto } from '../src/modules/auth/dto/createRole.dto';
import permissions from '../src/constants/permissions.constant';
import { AdminLogsModule } from '../src/modules/admin-logs/admin-logs.module';

describe('UsersService', () => {
  let app: INestApplication;
  // let generateDataService: GenerateFakeDataService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        GenerateDataModule,
        AuthModule,
        UsersModule,
        ConfigModule,
        AdminLogsModule,
        MongooseModule.forRoot(process.env.MONGO_URI_TEST, {}),
      ],
    }).compile();

    // generateDataService = moduleFixture.get<GenerateFakeDataService>(
    //   GenerateFakeDataService,
    // );
    await mongoose.connect(process.env.MONGO_URI_TEST);
    await mongoose.connection.db.dropDatabase();
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('Users', () => {
    let superAdmin, role, user;
    let createRoleDto: CreateRoleDto;
    beforeEach(async () => {
      createRoleDto = {
        name: 'role',
        permissions: [permissions.CREATE_USER, permissions.UPDATE_USER],
      };

      superAdmin = await request(app.getHttpServer())
        .post('/auth/signin')
        .send({ email: 'superadmin@superadmin.me', password: '12345678' });

      role = await request(app.getHttpServer())
        .post('/auth/roles')
        .send(createRoleDto)
        .set('Authorization', `Bearer ${superAdmin.body.accessToken}`)
        .expect(HttpStatus.CREATED);

      // user = await request(app.getHttpServer())
      //   .post('/users')
      //   .send({ email: 'newUser@mail.com', password: 'password', roles: [role.body._id] })
      //   .set('Authorization', `Bearer ${superAdmin.body.accessToken}`)
      //   .expect(HttpStatus.CREATED);
    });

    it('should return all users', async () => {
      // const res = await request(app.getHttpServer())
      //   .get('/auth/users')
      //   .set('Authorization', `Bearer ${superAdmin.body.accessToken}`)
      //   .expect(HttpStatus.OK);
      // console.log(superAdmin.body);
      // console.log(role.body);
      // console.log(user.body);
    });

    // it('should return all users', async () => {
    //   const res = await request(app.getHttpServer())
    //     .get('/auth/users')
    //     .set('Authorization', `Bearer ${superAdmin.body.accessToken}`)
    //     .expect(HttpStatus.OK);
    // });

    // it('should return the user by the entered id', async () => {
    //   const res = await request(app.getHttpServer())
    //     .get(`/auth/users/${user.body._id}`)
    //     .set('Authorization', `Bearer ${superAdmin.body.accessToken}`)
    //     .expect(HttpStatus.OK);
    //   expect(res.body).toHaveProperty('email', 'newUser@mail.com');
    // });
  });

  afterAll(async () => {
    // await mongoose.connection.db.dropDatabase();
    await app.close();
  });
});
