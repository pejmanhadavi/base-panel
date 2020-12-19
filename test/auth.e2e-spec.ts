import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';

import * as mongoose from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../src/modules/auth/auth.module';
import { UsersModule } from '../src/modules/users/users.module';
import { AuthSignInDto } from '../src/modules/auth/dto/auth-signIn.dto';
import { AuthSignUpDto } from '../src/modules/auth/dto/auth-signUp.dto';
import { GenerateFakeDataService } from '../src/generate-data/generate-fake-data.service';
import { GenerateDataModule } from '../src/generate-data/generate-data.module';
import { CreateRoleDto } from '../src/modules/auth/dto/createRole.dto';
import permissions from '../src/constants/permissions.constant';
import { AdminLogsModule } from '../src/modules/admin-logs/admin-logs.module';

describe('AuthController', () => {
  let app: INestApplication;
  // let generateDataService: GenerateFakeDataService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        GenerateDataModule,
        AuthModule,
        AdminLogsModule,
        UsersModule,
        ConfigModule,
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

  describe('Authentication', () => {
    let userByEmail, userByPhoneNumber, unverifiedUser, verifiedUser;
    let forgotPassword;
    const user1 = { email: 'user@email.com', password: '12345678' };
    const user2 = { phoneNumber: '09123456789', password: '12345678' };
    const user3 = { email: 'reza@gmail.com', password: 'password' };

    beforeEach(async () => {
      userByEmail = await request(app.getHttpServer()).post('/auth/signup').send(user1);

      userByPhoneNumber = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(user2);

      unverifiedUser = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(user3);

      verifiedUser = await request(app.getHttpServer())
        .post('/auth/verify-email')
        .send({ email: user3.email, token: unverifiedUser.body.verificationCode });

      forgotPassword = await request(app.getHttpServer())
        .post('/auth/forgot-password')
        .send({ email: user3.email });
    });

    it('should throw Unauthorize exception if user is not verified', async () => {
      await request(app.getHttpServer())
        .post('/auth/signin')
        .send(user1)
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should verify the user by email and returns accessToken and refresh access token', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/verify-email')
        .send({ email: user1.email, token: userByEmail.body.verificationCode })
        .expect(HttpStatus.OK);

      const res2 = await request(app.getHttpServer())
        .post('/auth/refresh-token')
        .set('Authorization', `Bearer ${response.body.accessToken}`)
        .send({ refreshToken: response.body.refreshToken })
        .expect(HttpStatus.OK);

      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
      expect(res2.body).toHaveProperty('accessToken');
    });

    it('should verify the user by phoneNumber and returns accessToken and refreshToken', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/verify-phone-number')
        .send({
          phoneNumber: user2.phoneNumber,
          token: userByPhoneNumber.body.verificationCode,
        })
        .expect(HttpStatus.OK);
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
    });

    it('should logIn the user and return accessToken', async () => {
      const res2 = await request(app.getHttpServer())
        .post('/auth/signIn')
        .send(user3)
        .expect(HttpStatus.OK);

      expect(res2.body).toHaveProperty('accessToken');
    });

    it('should send forgotPassword request and return forgot password token', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/forgot-password')
        .send({ email: user3.email })
        .expect(HttpStatus.CREATED);
      expect(response.body).toHaveProperty('forgotPasswordToken');
    });

    it('should verify forgot password and change the password', async () => {
      await request(app.getHttpServer())
        .post('/auth/forgot-password-verify')
        .send({ token: forgotPassword.body.forgotPasswordToken })
        .expect(HttpStatus.OK);

      await request(app.getHttpServer())
        .post('/auth/reset-password')
        .send({ email: user3.email, password: 'newPassword' })
        .expect(HttpStatus.CREATED);
    });
  });

  describe('CRUD Role', () => {
    let superAdmin, role;
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
    });
    it('should create new role and return it', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/roles')
        .send({ name: 'newRole', permissions: [permissions.CREATE_USER] })
        .set('Authorization', `Bearer ${superAdmin.body.accessToken}`)
        .expect(HttpStatus.CREATED);
    });

    it('should get all roles', async () => {
      await request(app.getHttpServer())
        .get('/auth/roles')
        .set('Authorization', `Bearer ${superAdmin.body.accessToken}`)
        .expect(HttpStatus.OK);
    });

    it('should get a role by the id', async () => {
      await request(app.getHttpServer())
        .get(`/auth/roles/${role.body._id}`)
        .set('Authorization', `Bearer ${superAdmin.body.accessToken}`)
        .expect(HttpStatus.OK);
    });

    it('should update the role ', async () => {
      await request(app.getHttpServer())
        .patch(`/auth/roles/${role.body._id}`)
        .send({
          name: 'newRoleName',
          permissions: [permissions.UPDATE_ROLE, permissions.READ_USER],
        })
        .set('Authorization', `Bearer ${superAdmin.body.accessToken}`)
        .expect(HttpStatus.CREATED);
    });

    it('should delete the role', async () => {
      await request(app.getHttpServer())
        .delete(`/auth/roles/${role.body._id}`)
        .set('Authorization', `Bearer ${superAdmin.body.accessToken}`)
        .expect(HttpStatus.NO_CONTENT);
    });
  });

  afterAll(async () => {
    // await mongoose.connection.db.dropDatabase();
    await app.close();
  });
});
