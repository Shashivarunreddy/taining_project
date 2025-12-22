import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserRole } from '../models/model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userSub = new BehaviorSubject<{
    loggedIn: boolean;
    role: UserRole | null;
  }>({
    loggedIn: false,
    role: null,
  });

  user$ = this.userSub.asObservable();

  constructor() {
    const raw = localStorage.getItem('auth');
    if (raw) {
      try {
        this.userSub.next(JSON.parse(raw));
      } catch {
        localStorage.removeItem('auth');
      }
    }
  }

  isLoggedIn(): boolean {
    return this.userSub.value.loggedIn;
  }

  getUserRole(): UserRole | null {
    return this.userSub.value.role;
  }

  login(role: UserRole) {
    const state = { loggedIn: true, role };
    this.userSub.next(state);
    localStorage.setItem('auth', JSON.stringify(state));
  }

  logout() {
    this.userSub.next({ loggedIn: false, role: null });
    localStorage.removeItem('auth');
  }
}
