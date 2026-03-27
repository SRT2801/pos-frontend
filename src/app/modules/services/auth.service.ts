import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Role } from '../core/enums/role.enum';
import { Permission } from '../core/enums/permission.enum';
import { AuthResponse, StoreContext, UserInfo } from '../core/interfaces/auth.interface';

@Injectable({ providedIn: 'root' })
export class AuthService {
  currentUser = signal<UserInfo | null>(null);
  currentStoreContext = signal<StoreContext | null>(null);
  userStores = signal<StoreContext[]>([]);


  isLoggedIn = computed(() => this.currentUser() !== null);


  userRoles = computed(() => {
    const context = this.currentStoreContext();
    return context ? [context.role] : [];
  });

  userPermissions = computed(() => {
    const context = this.currentStoreContext();
    return context ? context.permissions : [];
  });

  constructor(private http: HttpClient) {}

 
  loadProfile(): Observable<AuthResponse> {
    const url = `${environment.apiUrl}/auth/me`;
    return this.http
      .get<AuthResponse>(url, { withCredentials: true })
      .pipe(tap((response) => this.setAuthData(response)));
  }


  private setAuthData(response: AuthResponse) {
    this.currentUser.set(response.user);
    this.userStores.set(response.stores || []);
    this.currentStoreContext.set(response.currentContext || null);
  }

  hasRole(allowedRoles: Role[] | Role): boolean {
    const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    const currentRoles = this.userRoles();
    return rolesArray.some((role) => currentRoles.includes(role));
  }

  hasPermission(allowedPermissions: Permission[] | Permission): boolean {
    const permissionsArray = Array.isArray(allowedPermissions)
      ? allowedPermissions
      : [allowedPermissions];
    const currentPermissions = this.userPermissions();
    return permissionsArray.some((permission) => currentPermissions.includes(permission));
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
      }),
    );
  }

  refreshToken(): Observable<any> {
    const url = `${environment.apiUrl}/auth/refresh`;
    return this.http.post(url, {}, { withCredentials: true });
  }
}
