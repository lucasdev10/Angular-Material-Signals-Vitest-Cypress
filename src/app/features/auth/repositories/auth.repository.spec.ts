import { TestBed } from '@angular/core/testing';
import { HttpService } from '@app/core/http/http';
import { EUserRole, IUser } from '@app/features/user/models/user.model';
import { Utils } from '@app/shared/utils/utils';
import moment from 'moment';
import { firstValueFrom, of } from 'rxjs';
import { AuthRepository } from './auth.repository';

describe('AuthRepository', () => {
  let repository: AuthRepository;
  let http: HttpService<{}>;

  let users: IUser[] = [
    {
      id: Utils.generateId(),
      email: 'admin@admin.com',
      password: 'admin123',
      fullName: 'Admin User',
      role: EUserRole.ADMIN,
      createdAt: moment('2026-01-01').unix(),
      updatedAt: moment('2026-01-01').unix(),
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({}).compileComponents();

    repository = TestBed.inject(AuthRepository);
    http = TestBed.inject(HttpService);

    vi.spyOn(http, 'get').mockReturnValue(of(users));
  });

  it('should login correctly', async () => {
    const credentials = {
      email: 'admin@admin.com',
      password: 'admin123',
    };

    const response = await firstValueFrom(repository.login(credentials));

    expect(response.token).toBe(`mock-jwt-token-${response.user.id}`);
  });

  it('should return error with e-mail invalid', async () => {
    const credentials = {
      email: 'admin2@admin2.com',
      password: 'admin123',
    };

    const callLogin = firstValueFrom(repository.login(credentials));

    await expect(async () => await callLogin).rejects.toThrowError('Invalid email or password');
  });

  it('should validate token correctly', async () => {
    const response = await firstValueFrom(
      repository.validateToken(`mock-jwt-token-${users[0].id}`),
    );

    expect(response).toBeTruthy();
  });
});
