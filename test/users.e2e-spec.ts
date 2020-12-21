import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import * as mongoose from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../src/modules/auth/auth.module';
import { UsersModule } from '../src/modules/users/users.module';
import { GenerateDataModule } from '../src/generate-data/generate-data.module';
import { CreateRoleDto } from '../src/modules/auth/dto/createRole.dto';
import permissions from '../src/constants/permissions.constant';
import { AdminLogsModule } from '../src/modules/admin-logs/admin-logs.module';
import { CreateUserDto } from 'src/modules/users/dto/createUserDto.dto';
import sequencePlugin from '../src/common/plugins/sequence.plugin';
import { UpdateUserDto } from 'src/modules/users/dto/updateUserDto';

describe('UsersService', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        GenerateDataModule,
        AuthModule,
        UsersModule,
        ConfigModule,
        AdminLogsModule,
        MongooseModule.forRootAsync({
          useFactory: async () => ({
            uri: process.env.MONGO_URI_TEST,
            useCreateIndex: true,
            useNewUrlParser: true,
            connectionFactory: (connection) => {
              connection.plugin(sequencePlugin);
              return connection;
            },
          }),
        }),
      ],
    }).compile();

    await mongoose.connect(process.env.MONGO_URI_TEST);
    await mongoose.connection.db.dropDatabase();
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('Users', () => {
    let superAdmin, role, user;
    let invalidMongoId = '5fde9d94cfcf421370a94a90';
    let createRoleDto: CreateRoleDto;
    let createUserDto: CreateUserDto;
    let updateUserDto: UpdateUserDto;
    beforeEach(async () => {
      createRoleDto = {
        name: 'role',
        permissions: [permissions.CREATE_USER, permissions.UPDATE_USER],
      };

      createUserDto = { email: 'reza@gmail.com', password: 'password', verified: true };
      updateUserDto = { email: 'updated@gmail.com' };

      superAdmin = await request(app.getHttpServer())
        .post('/auth/signin')
        .send({ email: 'superadmin@superadmin.me', password: '12345678' });

      role = await request(app.getHttpServer())
        .post('/auth/roles')
        .send(createRoleDto)
        .set('Authorization', `Bearer ${superAdmin.body.accessToken}`)
        .expect(HttpStatus.CREATED);

      user = await request(app.getHttpServer())
        .post('/users')
        .send({ roles: [role.body._id], ...createUserDto })
        .set('Authorization', `Bearer ${superAdmin.body.accessToken}`)
        .expect(HttpStatus.CREATED);
    });

    describe('getAllUsers', () => {
      it('should throw an exception if the user is not super admin', async () => {
        await request(app.getHttpServer()).get('/users').expect(HttpStatus.UNAUTHORIZED);
      });

      it('should return all users', async () => {
        await request(app.getHttpServer())
          .get('/users')
          .set('Authorization', `Bearer ${superAdmin.body.accessToken}`)
          .expect(HttpStatus.OK);
      });
    });

    describe('getUserById', () => {
      it('should throw an exception if the user is not super admin', async () => {
        await request(app.getHttpServer())
          .get(`/users/${user.body._id}`)
          .expect(HttpStatus.UNAUTHORIZED);
      });

      it('should throw NotFoundException if not found any user with the given id', async () => {
        const res = await request(app.getHttpServer())
          .get(`/users/${invalidMongoId}`)
          .set('Authorization', `Bearer ${superAdmin.body.accessToken}`)
          .expect(HttpStatus.NOT_FOUND);
      });

      it('should return the user by the entered id', async () => {
        const res = await request(app.getHttpServer())
          .get(`/users/${user.body._id}`)
          .set('Authorization', `Bearer ${superAdmin.body.accessToken}`)
          .expect(HttpStatus.OK);

        expect(res.body).toHaveProperty('email', createUserDto.email);
      });
    });

    describe('createUser', () => {
      it('should throw an exception if the user is not super admin', async () => {
        await request(app.getHttpServer())
          .post('/users')
          .send(createUserDto)
          .expect(HttpStatus.UNAUTHORIZED);
      });

      it('should throw an exception if the entered roles are invalid', async () => {
        await request(app.getHttpServer())
          .post('/users')
          .send({
            roles: [invalidMongoId],
            email: 'newUser@gmail.com',
            password: 'password',
          })
          .set('Authorization', `Bearer ${superAdmin.body.accessToken}`)
          .expect(HttpStatus.BAD_REQUEST);
      });

      // note: this test suite works jest when the previous user has been verified
      it('should throw and exception if the user has already exists', async () => {
        await request(app.getHttpServer())
          .post('/users')
          .send({ email: 'reza@gmail.com', password: '12345678' })
          .set('Authorization', `Bearer ${superAdmin.body.accessToken}`)
          .expect(HttpStatus.BAD_REQUEST);
      });

      it('should create the user and return it', async () => {
        const res = await request(app.getHttpServer())
          .post('/users')
          .send({
            roles: [role.body._id],
            email: 'new@gmail.com',
            password: 'password',
          })
          .set('Authorization', `Bearer ${superAdmin.body.accessToken}`)
          .expect(HttpStatus.CREATED);

        expect(res.body).toHaveProperty('email', 'new@gmail.com');
      });
    });

    describe('updateUser', () => {
      it('should throw an exception if the user is not super admin', async () => {
        await request(app.getHttpServer())
          .patch(`/users/${user.body._id}`)
          .send(updateUserDto)
          .expect(HttpStatus.UNAUTHORIZED);
      });

      it('should throw an exception if the user not found with the given id', async () => {
        await request(app.getHttpServer())
          .patch(`/users/${invalidMongoId}`)
          .send(updateUserDto)
          .set('Authorization', `Bearer ${superAdmin.body.accessToken}`)
          .expect(HttpStatus.NOT_FOUND);
      });

      it('should throw an exception if the entered role id is not a mongodb id', async () => {
        await request(app.getHttpServer())
          .patch(`/users/${user.body._id}`)
          .send({ roles: ['1234'], ...updateUserDto })
          .set('Authorization', `Bearer ${superAdmin.body.accessToken}`)
          .expect(HttpStatus.BAD_REQUEST);
      });

      it('should throw an exception if the entered roles are invalid', async () => {
        await request(app.getHttpServer())
          .patch(`/users/${user.body._id}`)
          .send({ roles: [invalidMongoId], ...updateUserDto })
          .set('Authorization', `Bearer ${superAdmin.body.accessToken}`)
          .expect(HttpStatus.BAD_REQUEST);
      });

      it('should throw an exception if the entered email has already exists', async () => {
        await request(app.getHttpServer())
          .patch(`/users/${user.body._id}`)
          .send({ roles: [invalidMongoId], email: createUserDto.email })
          .set('Authorization', `Bearer ${superAdmin.body.accessToken}`)
          .expect(HttpStatus.BAD_REQUEST);
      });

      it('should update the user and return new changes information', async () => {
        const res = await request(app.getHttpServer())
          .patch(`/users/${user.body._id}`)
          .send({ roles: [role.body._id], ...updateUserDto })
          .set('Authorization', `Bearer ${superAdmin.body.accessToken}`)
          .expect(HttpStatus.CREATED);

        expect(res.body).toHaveProperty('email', updateUserDto.email);
      });
    });
    describe('deleteUser', () => {
      it('should throw an exception if the user is not super admin', async () => {
        await request(app.getHttpServer())
          .delete(`/users/${user.body._id}`)
          .expect(HttpStatus.UNAUTHORIZED);
      });

      it('should throw notFound exception if not found user by the given id', async () => {
        await request(app.getHttpServer())
          .delete(`/users/${invalidMongoId}`)
          .set('Authorization', `Bearer ${superAdmin.body.accessToken}`)
          .expect(HttpStatus.NOT_FOUND);
      });

      it('should delete the user', async () => {
        await request(app.getHttpServer())
          .delete(`/users/${user.body._id}`)
          .set('Authorization', `Bearer ${superAdmin.body.accessToken}`)
          .expect(HttpStatus.NO_CONTENT);
      });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
