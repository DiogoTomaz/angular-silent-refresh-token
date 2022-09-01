import { Login } from '@shared/models/login';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, EMPTY, Observable, of, throwError, timer } from 'rxjs';
import { AuthenticationAction } from 'src/app/shared/models/authentication-action';
import { User } from 'src/app/shared/models/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, filter, map, take, tap, switchMap } from 'rxjs/operators';
import { UserToken } from '@shared/models/user-token';
import { isPast } from 'date-fns';
import { getAuthHeader } from '../services.helper';

const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private readonly userActionSubject$ = new BehaviorSubject<AuthenticationAction>(AuthenticationAction.NoUser());
  public readonly userAction$ = this.userActionSubject$.asObservable();

  constructor(
    @Inject(Window) private window: Window,
    private readonly httpClient: HttpClient
  ) { }

  login(login: Login): Observable<boolean> {
    return this.httpClient.post<UserToken>('/login', login).pipe(
      take(1),
      catchError(error => of(null)),
      tap(user => {
        if(user) {
          this.storeUser(user);
          this.userActionSubject$.next(AuthenticationAction.LoggedIn(user));
          //this.setAutoLogOut(user.expiresAt);
        }
      }),
      map(user => !!user)
    );
  }

  logout(): Observable<boolean> {
    const user = this.getUser();
    if(!user) {
      throw throwError('Attempt to log out when no user exists');
    }

    return this.httpClient.post<User>('/logout', user).pipe(
      take(1),
      map(_ => true),
      catchError(_ => of(false)),
      tap(isLoggedOut => {
        if(isLoggedOut) {
          this.userActionSubject$.next(AuthenticationAction.LoggedOut(user));
          this.window.sessionStorage.clear();
        }
      })
    )    
  }

  refreshToken(): Observable<UserToken> {
    return this.httpClient.post<UserToken>('/refresh', null).pipe(
        tap(newToken => {
            this.storeUser(newToken);
            this.userActionSubject$.next(AuthenticationAction.LoggedIn(newToken));
            //this.setAutoLogOut(newToken.expiresAt);
        })
    )
  }

  public getUser(): UserToken | null {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }
    return null;  
  }  

  private storeUser(user: UserToken): void {
    this.window.sessionStorage.removeItem(USER_KEY);
    this.window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  private setAutoLogOut(expireAt: number): void {
    const expireIn = expireAt - new Date().getTime();
    timer(expireIn).pipe(
      switchMap(_ => this.userAction$),
      filter(ua => ua?.status === 'LoggedIn' && !!ua?.user?.expiresAt && isPast(ua.user.expiresAt)),
      switchMap(_ => this.logout()),
      take(1)
    ).subscribe();
  }
}
