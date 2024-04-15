import { Test, TestingModule } from '@nestjs/testing';
import { ExpensesController } from './expenses.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Helper } from '../app.helper';
import { ExpensesService } from './service/expenses.service';
import { Expenses } from './entity/expenses.entity';
import { ExpensesRepository } from './service/expenses.service.spec';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Users } from '../users/entity/user.entity';
import { UsersRepository } from '../auth/auth.controller.spec';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

describe('ExpensesController', () => {
  let controller: ExpensesController;
  let jwtService: JwtService;
  let helper: Helper;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MailerModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: async(configService: ConfigService) => ({
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
              from:'"nest-modules" <modules@nestjs.com>',
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
        }),
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
        ConfigModule.forRoot({
          isGlobal: true,
        })

      ],
      providers: [
        ExpensesService,
        Helper,
        {
          provide: getRepositoryToken(Expenses),
          useClass: ExpensesRepository
        },
        {
          provide: getRepositoryToken(Users),
          useClass: UsersRepository
        }
      ],
      controllers: [ExpensesController],
    }).compile();

    controller = module.get<ExpensesController>(ExpensesController);
    jwtService = module.get<JwtService>(JwtService);
    helper = await module.resolve(Helper);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
