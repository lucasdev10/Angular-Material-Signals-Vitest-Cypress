import { TestBed } from '@angular/core/testing';
import { Utils } from '@app/shared/utils/utils';
import moment from 'moment';
import { delay, of, throwError } from 'rxjs';
import { EUserRole, ICreateUserDto, IUpdateUserDto, IUser } from '../models/user.model';
import { UserRepository } from '../repositories/user.repository';
import { UserStore } from './user.store';

describe('UserStore', () => {
  let service: UserStore;
  let repository: UserRepository;

  const userId = Utils.generateId();
  const users: IUser[] = [
    {
      id: userId,
      email: 'admin@admin.com',
      password: 'admin123',
      fullName: 'Admin User',
      role: EUserRole.ADMIN,
      createdAt: moment('2026-01-01').unix(),
      updatedAt: moment('2026-01-01').unix(),
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({});
    repository = TestBed.inject(UserRepository);

    // Mock findAll to return users
    vi.spyOn(repository, 'findAll').mockReturnValue(of(users));

    // Create service after mocking
    service = TestBed.inject(UserStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call loadUsers correctly and update states', async () => {
    await vi.waitFor(() => {
      expect(service.users().length).toBeGreaterThan(0);
      expect(service.hasError()).toBe(false);
    });
  });

  it('should call loadUsers with error and update states', async () => {
    vi.spyOn(repository, 'findAll').mockReturnValue(
      throwError(() => new Error('Failed to load users')),
    );

    service.loadUsers();

    await vi.waitFor(() => {
      expect(service.hasError()).toBe(true);
      expect(service.error()).toBe('Failed to load users');
    });
  });

  it('should verify loading update status after loadUsers', async () => {
    vi.spyOn(repository, 'findAll').mockReturnValue(of(users).pipe(delay(100)));

    service.loadUsers();

    expect(service.isLoading()).toBe(true);

    await vi.waitFor(() => {
      expect(service.isLoading()).toBe(false);
    });
  });

  it('should create user correctly', async () => {
    const userDto: ICreateUserDto = {
      email: 'user@email.com',
      fullName: 'User Name',
      password: '123456',
      role: EUserRole.USER,
    };

    const newUser: IUser = {
      ...userDto,
      id: Utils.generateId(),
      createdAt: moment().unix(),
      updatedAt: moment().unix(),
    };

    vi.spyOn(repository, 'create').mockReturnValue(of(newUser));

    service.createUser(userDto);

    await vi.waitFor(() => {
      expect(service.loading()).toBe('success');
      const user = service.users().find((u) => u.email === userDto.email);
      expect(user).toBeTruthy();
    });
  });

  it('should handle create user error', async () => {
    const userDto: ICreateUserDto = {
      email: 'user@email.com',
      fullName: 'User Name',
      password: '123456',
      role: EUserRole.USER,
    };

    vi.spyOn(repository, 'create').mockReturnValue(
      throwError(() => new Error('Failed to create user')),
    );

    service.createUser(userDto);

    await vi.waitFor(() => {
      expect(service.loading()).toBe('error');
      expect(service.error()).toBe('Failed to create user');
    });
  });

  it('should load user by id correctly', async () => {
    const user = users[0];
    vi.spyOn(repository, 'findById').mockReturnValue(of(user));

    service.loadUserById(user.id);

    await vi.waitFor(() => {
      expect(service.selectedUser()).toEqual(user);
      expect(service.loading()).toBe('success');
    });
  });

  it('should handle load user by id error', async () => {
    vi.spyOn(repository, 'findById').mockReturnValue(
      throwError(() => new Error('Failed to load user')),
    );

    service.loadUserById('invalid-id');

    await vi.waitFor(() => {
      expect(service.loading()).toBe('error');
      expect(service.error()).toBe('Failed to load user');
    });
  });

  it('should update user correctly', async () => {
    // Wait for initial load
    await vi.waitFor(() => {
      expect(service.users().length).toBeGreaterThan(0);
    });

    const updateDto: IUpdateUserDto = {
      fullName: 'Updated Name',
    };

    const updatedUser: IUser = {
      ...users[0],
      ...updateDto,
      updatedAt: moment().unix(),
    };

    vi.spyOn(repository, 'update').mockReturnValue(of(updatedUser));

    service.updateUser(userId, updateDto);

    await vi.waitFor(() => {
      expect(service.loading()).toBe('success');
      const user = service.users().find((u) => u.id === userId);
      expect(user?.fullName).toBe(updateDto.fullName);
    });
  });

  it('should handle update user error', async () => {
    const updateDto: IUpdateUserDto = {
      fullName: 'Updated Name',
    };

    vi.spyOn(repository, 'update').mockReturnValue(
      throwError(() => new Error('Failed to update user')),
    );

    service.updateUser(userId, updateDto);

    await vi.waitFor(() => {
      expect(service.loading()).toBe('error');
      expect(service.error()).toBe('Failed to update user');
    });
  });

  it('should delete user correctly', async () => {
    // Wait for initial load
    await vi.waitFor(() => {
      expect(service.users().length).toBeGreaterThan(0);
    });

    vi.spyOn(repository, 'delete').mockReturnValue(of(undefined));

    service.deleteUser(userId);

    await vi.waitFor(() => {
      expect(service.loading()).toBe('success');
      const user = service.users().find((u) => u.id === userId);
      expect(user).toBeUndefined();
    });
  });

  it('should handle delete user error', async () => {
    vi.spyOn(repository, 'delete').mockReturnValue(
      throwError(() => new Error('Failed to delete user')),
    );

    service.deleteUser(userId);

    await vi.waitFor(() => {
      expect(service.loading()).toBe('error');
      expect(service.error()).toBe('Failed to delete user');
    });
  });

  it('should set filters correctly', () => {
    const filters = { search: 'admin' };
    service.setFilters(filters);

    expect(service.filters()).toEqual(filters);
  });

  it('should clear filters correctly', () => {
    service.setFilters({ search: 'admin' });
    service.clearFilters();

    expect(service.filters()).toEqual({});
  });

  it('should filter users by search term', async () => {
    // Wait for initial load
    await vi.waitFor(() => {
      expect(service.users().length).toBeGreaterThan(0);
    });

    service.setFilters({ search: 'admin' });

    const filtered = service.filteredUsers();
    expect(filtered.length).toBe(1);
    expect(filtered[0].email).toBe('admin@admin.com');
  });

  it('should return empty array when search does not match', async () => {
    // Wait for initial load
    await vi.waitFor(() => {
      expect(service.users().length).toBeGreaterThan(0);
    });

    service.setFilters({ search: 'nonexistent' });

    const filtered = service.filteredUsers();
    expect(filtered.length).toBe(0);
  });

  it('should compute user count correctly', async () => {
    // Wait for initial load
    await vi.waitFor(() => {
      expect(service.users().length).toBeGreaterThan(0);
    });

    expect(service.userCount()).toBe(1);
  });

  it('should compute filtered user count correctly', async () => {
    // Wait for initial load
    await vi.waitFor(() => {
      expect(service.users().length).toBeGreaterThan(0);
    });

    service.setFilters({ search: 'admin' });
    expect(service.filteredUserCount()).toBe(1);
  });

  it('should clear error correctly', async () => {
    vi.spyOn(repository, 'findAll').mockReturnValue(throwError(() => new Error('Error')));
    service.loadUsers();

    await vi.waitFor(() => {
      expect(service.hasError()).toBe(true);
    });

    service.clearError();
    expect(service.hasError()).toBe(false);
    expect(service.error()).toBeNull();
  });
});
