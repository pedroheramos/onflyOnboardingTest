import { Test, TestingModule } from '@nestjs/testing';
import { ExpensesService } from './expenses.service';
import { UsersRepository } from '../../auth/auth.controller.spec';
import { Helper } from '../../app.helper';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Users } from '../../users/entity/user.entity';
import { Expenses } from '../entity/expenses.entity';
import { MailerModule, MailerService } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { JwtService } from '@nestjs/jwt';


export const ExpensesRepository = jest.fn(() => ({
  metadata: {
    columns: [],
    relations: [],
  },
}));

describe('ExpensesService', () => {
  let service: ExpensesService;
  let mailerService: MailerService

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
        })
      ],
      providers: [
        ExpensesService,
        {
          provide: getRepositoryToken(Users),
          useClass: UsersRepository
        },
        {
          provide: getRepositoryToken(Expenses),
          useClass: ExpensesRepository
        },
        Helper
      ]
    }).compile();

    service = module.get<ExpensesService>(ExpensesService);
    mailerService = module.get(MailerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
