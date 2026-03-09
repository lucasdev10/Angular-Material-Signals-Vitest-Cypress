import { TestBed } from '@angular/core/testing';
import { HttpService } from '@app/core/http/http';
import { Utils } from '@app/shared/utils/utils';
import moment from 'moment';
import { of } from 'rxjs';
import { EUserRole, ICreateUserDto, IUpdateUserDto, IUser } from '../models/user.model';
import { UserRepository } from './user.repository';

describe('UserRepository', () => {
  let repository: UserRepository;
  let httpService: HttpService<IUser>;

  const mockUser: IUser = {
    id: Utils.generateId(),
    email: 'test@test.com',
    password: 'password123',
    fullName: 'Test User',
    role: EUserRole.USER,
    createdAt: moment().unix(),
    updatedAt: moment().unix(),
  };

  const mockUsers: IUser[] = [mockUser];

  beforeEach(() => {
    TestBed.configureTestingModule({});
    repository = TestBed.inject(UserRepository);
    httpService = TestBed.inject(HttpService);
  });

  it('should be created', () => {
    expect(repository).toBeTruthy();
  });

  it('should find all users', async () => {
    vi.spyOn(httpService, 'get').mockReturnValue(of(mockUsers));

    repository.findAll().subscribe((users) => {
      expect(users).toEqual(mockUsers);
      expect(httpService.get).toHaveBeenCalledWith('users');
    });
  });

  it('should find user by id', async () => {
    vi.spyOn(httpService, 'getById').mockReturnValue(of(mockUser));

    repository.findById(mockUser.id).subscribe((user) => {
      expect(user).toEqual(mockUser);
      expect(httpService.getById).toHaveBeenCalledWith('users', mockUser.id);
    });
  });

  it('should create user', async () => {
    const createDto: ICreateUserDto = {
      email: 'new@test.com',
      password: 'password123',
      fullName: 'New User',
      role: EUserRole.USER,
    };

    vi.spyOn(httpService, 'post').mockReturnValue(of(mockUser));

    repository.create(createDto).subscribe((user) => {
      expect(user).toEqual(mockUser);
      expect(httpService.post).toHaveBeenCalledWith(
        'users',
        expect.objectContaining({
          email: createDto.email,
          fullName: createDto.fullName,
          role: createDto.role,
          createdAt: expect.any(Number),
          updatedAt: expect.any(Number),
        }),
      );
    });
  });

  it('should update user', async () => {
    const updateDto: IUpdateUserDto = {
      fullName: 'Updated User',
      email: 'updated@test.com',
    };

    const updatedUser = { ...mockUser, ...updateDto };
    vi.spyOn(httpService, 'put').mockReturnValue(of(updatedUser));

    repository.update(mockUser.id, updateDto).subscribe((user) => {
      expect(user).toEqual(updatedUser);
      expect(httpService.put).toHaveBeenCalledWith(
        'users',
        mockUser.id,
        expect.objectContaining({
          fullName: updateDto.fullName,
          email: updateDto.email,
          updatedAt: expect.any(Number),
        }),
      );
    });
  });

  it('should delete user', async () => {
    vi.spyOn(httpService, 'delete').mockReturnValue(of(undefined));

    repository.delete(mockUser.id).subscribe(() => {
      expect(httpService.delete).toHaveBeenCalledWith('users', mockUser.id);
    });
  });
});
