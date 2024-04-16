import {Test, TestingModule} from '@nestjs/testing';
import {ExpensesService} from './expenses.service';
import {Helper} from '../../app.helper';
import {UsersService} from '../../users/service/users.service';
import {MailerModule, MailerService} from '@nestjs-modules/mailer';
import {Expenses} from '../entity/expenses.entity';
import {Column, JoinColumn, OneToOne, Repository} from 'typeorm';
import {Users} from '../../users/entity/user.entity';
import {getRepositoryToken} from '@nestjs/typeorm';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {HandlebarsAdapter} from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import {CreateExpensesDto} from '../dto/create-expenses.dto';
import {HttpException, HttpStatus} from '@nestjs/common';

describe('ExpensesService', () => {
  let expensesService: ExpensesService;
  let usersService: UsersService;
  let expensesRepository: Repository<Expenses>;
  let usersRepository: Repository<Users>;
  let mailerService: MailerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
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
        UsersService,
        ExpensesService,
        {
          provide: getRepositoryToken(Expenses),
          useValue: {
            // find: jest.fn().mockResolvedValue(userArray),
            // findOneBy: jest.fn().mockResolvedValue(oneUser),
            save: jest.fn().mockResolvedValue({
              id: 1,
              created_at: "2024-04-10",
              date_occurrence: new Date(),
              description: "Teste",
              amount: 10.10,
              userOwnerId: 1
            } as Expenses),
            // remove: jest.fn(),
            // delete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Users),
          useValue: {
            // find: jest.fn().mockResolvedValue(userArray),
            findOneBy: (userId: any) => {
              if (userId.id === 1) {
                return jest.fn().mockResolvedValue({
                  id: 1,
                  created_at: "2024-04-14",
                  username: "pedro@onfly.com.br",
                  password: "description test"
                } as Users)
              } else {
                return null
              }
            },
            // save: jest.fn().mockResolvedValue(oneUser),
            // remove: jest.fn(),
            // delete: jest.fn(),
          },
        },
        Helper
      ]
    }).compile();

    expensesService = module.get<ExpensesService>(ExpensesService);
    mailerService = module.get<MailerService>(MailerService);
    usersService = module.get<UsersService>(UsersService);
    expensesRepository = module.get<Repository<Expenses>>(getRepositoryToken(Expenses));
    usersRepository = module.get<Repository<Users>>(getRepositoryToken(Users));
  });

  it('should be defined', () => {
    expect(expensesService).toBeDefined();
    expect(usersService).toBeDefined();
  });

  it('should create', async () => {

    jest.spyOn(mailerService, 'sendMail').mockImplementation(() => new Promise(function (resolve, reject) {
      resolve(true)
    }));

    const resultado = await expensesService.create({description: "expense description", amount: 13.13, userId: 1, dateOccurrence: "2024-04-10"} as CreateExpensesDto)
    expect(resultado.id).toBe(1)
  });

  it('should not create due to user', async () => {

    jest.spyOn(mailerService, 'sendMail').mockImplementation(() => new Promise(function (resolve, reject) {
      resolve(true)
    }));

    await expect(expensesService.create({description: "expense description", amount: 13.13, userId: 2, dateOccurrence: "2024-04-10"} as CreateExpensesDto))
        .rejects.toEqual(new HttpException('User not found!', HttpStatus.BAD_REQUEST))
  });

  it('should not create due to date future', async () => {

    jest.spyOn(mailerService, 'sendMail').mockImplementation(() => new Promise(function (resolve, reject) {
      resolve(true)
    }));

    await expect(expensesService.create({description: "expense description", amount: 13.13, userId: 1, dateOccurrence: "2025-04-10"} as CreateExpensesDto))
        .rejects.toEqual(new HttpException('Data não pode ser no futuro.', HttpStatus.BAD_REQUEST))
  });

});
