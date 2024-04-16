import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ExpensesModule } from '../src/expenses/expenses.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateExpensesDto } from '../src/expenses/dto/create-expenses.dto';
import { UsersModule } from '../src/users/users.module';
import { DatabaseModule } from '../src/database/database.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule, MailerService } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ExpensesResponseDto } from '../src/expenses/dto/expenses-response.dto';
import { ValidationPipe } from '@nestjs/common';

describe('Expenses - /expenses (e2e)', () => {
  const createExpensesDto: CreateExpensesDto = {
    amount: 13.14,
    dateOccurrence: "2024-04-14",
    description: "pedro@onfly.com.br",
    userId: 1
  };
  let app: INestApplication;

  let mailerService: MailerService;
  let jwtService: JwtService;
  const auth_token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInVzZXJuYW1lIjoicGVkcm9Ab25mbHkuY29tLmJyIiwiaWF0IjoxNzEzMzAxOTM2LCJleHAiOjE3MTM2NjE5MzZ9.ashNF_KLuEf8afuGflCVOkgw-V5QPlJdJOa39zOzU3M';


  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.registerAsync({
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => ({
            secret: configService.get('CONSTANT_SECRET_ENCRYPTER'),
            signOptions: {
              expiresIn: 3600,
            },
          }),
          inject: [ConfigService],
          global: true
        }),
        DatabaseModule,
        UsersModule,
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: async (configService: ConfigService) => {
            // async configuration options
            return {
              type: 'postgres',
              host: configService.get('DB_HOST'),
              port: configService.get('DB_PORT'),
              username: configService.get('DB_USERNAME'),
              password: configService.get('DB_PASSWORD'),
              database: configService.get('DB_NAME'),
              entities: [
                __dirname + '/../**/*.entity{.ts,.js}',
              ],
              logging: true
            };
          },
        }),
        ExpensesModule,
        MailerModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => ({
            transport: {
              host: configService.get('MAIL_HOST'),
              port: configService.get('MAIL_PORT'),
              secure: true, // upgrade later with STARTTLS
              auth: {
                user: configService.get('MAIL_USER'),
                pass: configService.get('MAIL_PASS'),
              },
            },
            defaults: {
              from: '"nest-modules" <modules@nestjs.com>',
            },
            template: {
              dir: process.cwd() + '/templates/',
              adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
              options: {
                strict: true,
              },
            },
          }),
          inject: [ConfigService],
        })
      ],
      providers: [
        JwtService
      ]
    }).compile();

    mailerService = module.get<MailerService>(MailerService);
    jwtService = module.get<JwtService>(JwtService);
    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  it('Get all expenses [GET /expenses]', () => {
    return request(app.getHttpServer())
      .get('/expenses')
      .set({ Authorization: auth_token })
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeDefined();
        expect(body.length).toBeGreaterThanOrEqual(0);
      });
  });

  const sendPayload = {
    "description": "teste1",
    "amount": 13.13,
    "userId": 1,
    "dateOccurrence": "2024-04-12"
  } as CreateExpensesDto
  it('Create an expense [POST /expenses]', () => {
    return request(app.getHttpServer())
      .post('/expenses')
      .set({ Authorization: auth_token })
      .send(sendPayload)
      .expect(201)
      .then(({ body }) => {
        console.log(body)
        expect(body.description).toEqual('teste1');
      });
  });

  const sendWrongPayload1 = {
    description: "teste1",
    amount: 13.13,
    userId: 1,
    dateOccurrence: "2025-04-12"
  } as CreateExpensesDto
  it('Souldnt Create an expense due to future date [POST /expenses]', () => {
    return request(app.getHttpServer())
      .post('/expenses')
      .set({ Authorization: auth_token })
      .send(sendWrongPayload1)
      .expect(400)
      .then(({ body }) => {
        console.log(body)
        expect(body).toBeDefined();
        expect(body.message).toEqual('Data não pode ser no futuro.');
      });
  });

  const sendWrongPayload2 = {
    description: "testLorem ipsum dolor sit amet, consectetur adipiscing elit. Cras sed dui facilisis, dapibus est at, consectetur elit. Orci varius natoque penatibus et magnis dis parturient montes, nascetur nec.e1",
    amount: -13.13,
    userId: 1,
    dateOccurrence: "2023-04-12"
  } as CreateExpensesDto
  it('Souldnt Create an expense due to description > 190 & amount negative [POST /expenses]', () => {
    return request(app.getHttpServer())
      .post('/expenses')
      .set({ Authorization: auth_token })
      .send(sendWrongPayload2)
      .expect(400)
      .then(({ body }) => {
        console.log(body)
        expect(body).toBeDefined();
        expect(body.message.length).toBeGreaterThanOrEqual(1);
        expect(body.message[0]).toEqual('description must be shorter than or equal to 190 characters');
        expect(body.message[1]).toEqual('Valor não pode ser negativo');
      });
  });

  afterAll(async () => {
    await app.close();
  });
});