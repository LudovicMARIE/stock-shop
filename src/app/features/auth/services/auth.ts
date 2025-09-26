import { Injectable, signal, WritableSignal } from '@angular/core';
import { Observable, of, throwError, delay } from 'rxjs';
// import { Router } from '@angular/router';
import { LoginRequest, RegisterRequest, User } from '../models/user';

@Injectable({ providedIn: 'root' })
export class Auth {
  private _currentUser: WritableSignal<User | null> = signal<User | null>(null);
  public currentUser = this._currentUser.asReadonly();

  // Mock data - test users
  private users: User[] = [
    {
      id: 1,
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin',
    },
    {
      id: 2,
      name: 'Normal User',
      email: 'user@example.com',
      role: 'user',
    },
  ];

  // Mock data - password (in reality they should be hashed and securely stored)
  private passwords: Record<string, string> = {
    'admin@example.com': 'admin123',
    'user@example.com': 'user123',
  };

  constructor() {
    // Verify if there's a saved user in localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this._currentUser.set(JSON.parse(savedUser));
    }
  }

  login(credentials: LoginRequest): Observable<User> {
    const user = this.users.find((u) => u.email === credentials.email);
    const password = this.passwords[credentials.email];

    if (user && password === credentials.password) {
      // Simulate network delay
      return of(user).pipe(delay(500));
    } else {
      return throwError(() => new Error('Email ou mot de passe incorrect'));
    }
  }

  register(userData: RegisterRequest): Observable<User> {
    // Verify if email already exists
    const existingUser = this.users.find((u) => u.email === userData.email);
    if (existingUser) {
      return throwError(() => new Error('Cet email est déjà utilisé'));
    }

    // Create new user
    const newUser: User = {
      id: this.users.length + 1,
      name: userData.name,
      email: userData.email,
      role: 'user',
    };

    // Add to mock datas
    this.users.push(newUser);
    this.passwords[userData.email] = userData.password;

    // Simulate network delay
    return of(newUser).pipe(delay(500));
  }

  logout(): void {
    this._currentUser.set(null);
    localStorage.removeItem('currentUser');
  }

  getCurrentUser(): User | null {
    return this._currentUser();
  }

  isAdmin(): boolean {
    return this._currentUser()?.role === 'admin';
  }

  getAllUsers(): Observable<User[]> {
    return of(this.users).pipe(delay(300));
  }

  deleteUser(userId: number): Observable<void> {
    const index = this.users.findIndex((u) => u.id === userId);
    if (index !== -1) {
      this.users.splice(index, 1);
      return of(void 0).pipe(delay(300));
    }
    return throwError(() => new Error('Utilisateur non trouvé'));
  }

  getToken(): string | null {
    const user = this._currentUser();
    return user ? `mock-token-${user.id}` : null;
  }

  // Method to update the current user signal and localStorage
  setCurrentUser(user: User): void {
    this._currentUser.set(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  }
}
