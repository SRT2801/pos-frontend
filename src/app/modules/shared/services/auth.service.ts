import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Role } from '../../core/enums/role.enum';
import { Permission } from '../../core/enums/permission.enum';
import { AuthResponse, StoreContext, UserInfo } from '../../core/interfaces/auth.interface';

@Injectable({ providedIn: 'root' })
export class AuthService {
  currentUser = signal<UserInfo | null>(null);
  currentStoreContext = signal<StoreContext | null>(null);
  userStores = signal<StoreContext[]>([]);

  isLoggedIn = computed(() => this.currentUser() !== null);

  userRoles = computed(() => {
    const context = this.currentStoreContext();
    const user = this.currentUser();
    const roles: string[] = [];

    if (user?.globalRole) {
      roles.push(user.globalRole);
    }

    if (context?.role) {
      roles.push(context.role);
    }
    return roles;
  });

  userPermissions = computed(() => {
    const context = this.currentStoreContext();
    return context ? context.permissions || [] : [];
  });

  constructor(private http: HttpClient) {
    this.hydrateAuth();
  }

  hydrateAuth() {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const storedUser = localStorage.getItem('currentUser');
        const storedContext = localStorage.getItem('currentStoreContext');
        const storedStores = localStorage.getItem('userStores');

        if (storedUser) this.currentUser.set(JSON.parse(storedUser));
        if (storedContext) this.currentStoreContext.set(JSON.parse(storedContext));
        if (storedStores) this.userStores.set(JSON.parse(storedStores));
      } catch (e) {
        console.error('Error parsing auth state from localStorage', e);
      }
    }
  }

  private setAuthData(response: AuthResponse) {
    this.currentUser.set(response.user);
    this.userStores.set(response.stores || []);

    const initialContext =
      response.currentContext || (response.stores?.length ? response.stores[0] : null);

    this.currentStoreContext.set(initialContext);

    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('currentUser', JSON.stringify(response.user));
      localStorage.setItem('userStores', JSON.stringify(response.stores || []));
      if (initialContext) {
        localStorage.setItem('currentStoreContext', JSON.stringify(initialContext));
        localStorage.setItem('storeId', initialContext.id);
      } else {
        localStorage.removeItem('currentStoreContext');
        localStorage.removeItem('storeId');
      }
    }
  }

  hasRole(allowedRoles: Role[] | Role): boolean {
    const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    const currentRoles = this.userRoles() as string[];
    return rolesArray.some((role) => currentRoles.includes(role as string));
  }

  hasPermission(allowedPermissions: Permission[] | Permission): boolean {
    const permissionsArray = Array.isArray(allowedPermissions)
      ? allowedPermissions
      : [allowedPermissions];
    const currentPermissions = this.userPermissions() as string[];
    return permissionsArray.some((permission) => currentPermissions.includes(permission as string));
  }

  register(user: { email: string; password: string }): Observable<any> {
    const url = `${environment.apiUrl}/auth/signup`;
    return this.http.post(url, user);
  }

  registerStore(user: {
    email: string;
    password: string;
    storeName: string;
    storeSlug: string;
  }): Observable<any> {
    const url = `${environment.apiUrl}/auth/register-store`;
    return this.http.post(url, user);
  }

  login(user: { email: string; password: string }): Observable<AuthResponse> {
    const url = `${environment.apiUrl}/auth/signin`;
    return this.http
      .post<AuthResponse>(url, user, { withCredentials: true })
      .pipe(tap((response) => this.setAuthData(response)));
  }

  logout(): Observable<any> {
    const url = `${environment.apiUrl}/auth/signout`;
    return this.http.post(url, {}, { withCredentials: true }).pipe(
      tap(() => {
        this.currentUser.set(null);
        this.currentStoreContext.set(null);
        this.userStores.set([]);
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.removeItem('currentUser');
          localStorage.removeItem('currentStoreContext');
          localStorage.removeItem('userStores');
          localStorage.removeItem('storeId');
        }
      }),
    );
  }

  refreshToken(): Observable<any> {
    const url = `${environment.apiUrl}/auth/refresh`;
    return this.http.post(url, {}, { withCredentials: true });
  }
}
