import { Injectable, signal, computed } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { Observable, catchError, map, of, switchMap, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Role } from '../../core/enums/role.enum';
import { Permission } from '../../core/enums/permission.enum';
import { AuthResponse, StoreContext, UserInfo } from '../../core/interfaces/auth.interface';
import { BYPASS_AUTH_RECOVERY } from '../../core/http/interceptors/error.interceptor';

@Injectable({ providedIn: 'root' })
export class AuthService {
  currentUser = signal<UserInfo | null>(null);
  currentStoreContext = signal<StoreContext | null>(null);
  userStores = signal<StoreContext[]>([]);
  private readonly activeStoreKey = 'activeStoreId';

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

  constructor(private http: HttpClient) {}

  restoreSession(): Observable<boolean> {
    return this.fetchMe().pipe(
      tap((response) => this.setAuthData(response)),
      map(() => true),
      catchError(() =>
        this.refreshToken(true).pipe(
          switchMap(() => this.fetchMe()),
          tap((response) => this.setAuthData(response)),
          map(() => true),
          catchError(() => {
            this.clearAuthData();
            return of(false);
          }),
        ),
      ),
    );
  }

  private setAuthData(response: AuthResponse) {
    const normalized = this.normalizeAuthResponse(response);
    this.currentUser.set(normalized.user);
    this.userStores.set(normalized.stores || []);

    const initialContext =
      normalized.currentContext || (normalized.stores?.length ? normalized.stores[0] : null);

    this.currentStoreContext.set(initialContext);

    this.persistActiveStoreId(initialContext?.id ?? null);
  }

  private clearAuthData() {
    this.currentUser.set(null);
    this.currentStoreContext.set(null);
    this.userStores.set([]);
    this.persistActiveStoreId(null);
  }

  private fetchMe(): Observable<AuthResponse> {
    const url = `${environment.apiUrl}/auth/me`;
    return this.http.get<AuthResponse>(url, {
      withCredentials: true,
      context: new HttpContext().set(BYPASS_AUTH_RECOVERY, true),
    });
  }

  private normalizeAuthResponse(response: AuthResponse): AuthResponse {
    const stores = response.stores || [];
    const requestedStoreId = response.user?.storeId;
    const persistedStoreId = this.getStoredStoreId();
    const selectedStore =
      response.currentContext ||
      stores.find((store) => store.id === requestedStoreId) ||
      stores.find((store) => store.id === persistedStoreId) ||
      stores[0] ||
      null;

    return {
      ...response,
      currentContext: selectedStore,
    };
  }

  private persistActiveStoreId(storeId: string | null) {
    if (typeof window === 'undefined' || !window.sessionStorage) {
      return;
    }

    if (storeId) {
      sessionStorage.setItem(this.activeStoreKey, storeId);
      return;
    }

    sessionStorage.removeItem(this.activeStoreKey);
  }

  private getStoredStoreId(): string | null {
    if (typeof window === 'undefined' || !window.sessionStorage) {
      return null;
    }

    return sessionStorage.getItem(this.activeStoreKey);
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
        this.clearAuthData();
      }),
    );
  }

  refreshToken(bypassInterceptor = false): Observable<any> {
    const url = `${environment.apiUrl}/auth/refresh`;
    return this.http.post(
      url,
      {},
      {
        withCredentials: true,
        context: bypassInterceptor ? new HttpContext().set(BYPASS_AUTH_RECOVERY, true) : undefined,
      },
    );
  }
}
