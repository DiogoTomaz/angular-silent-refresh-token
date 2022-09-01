import { UserToken } from './../../models/user-token';
import { LoginDialogComponent } from '@shared/components/login-dialog/login-dialog.component';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subject, EMPTY, timer, of } from 'rxjs';
import { filter, map, retry, switchMap, takeUntil, tap } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/core/services/authentication/authentication.service';
import { AuthenticationAction, AuthenticationStatus } from '@shared/models/authentication-action';
import { Router } from '@angular/router';
import { SimpleDialogComponent, SimpleDialogData } from '@shared/components/simple-dialog/simple-dialog.component';

@Component({
  selector: 'code-invaders-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit, OnDestroy {
  public userActionChange$!: Observable<AuthenticationAction>;
  public tokenExpiresIn$!: Observable<number>;
  public authenticationStatus = AuthenticationStatus;

  private unsubscribe = new Subject();
  private userSessionExpiresAt: number = 0;

  constructor(
    private readonly authService: AuthenticationService,
    private readonly dialog: MatDialog,
    private readonly router: Router,
  ) { }

  ngOnInit(): void {
    this.userActionChange$ = this.authService.userAction$.pipe(
      takeUntil(this.unsubscribe),
    );

    this.userActionChange$.pipe(
      takeUntil(this.unsubscribe),
      map(ua => ua.status === 'LoggedIn' ? ua.user!.expiresAt : 0)
    ).subscribe(expiresAt => 
      this.userSessionExpiresAt = expiresAt
    );

    this.tokenExpiresIn$ = timer(1, 1000).pipe(
      switchMap(_ => {
        const currentTime = new Date().getTime();
        if(this.userSessionExpiresAt && this.userSessionExpiresAt > currentTime) {
          return of(Math.round((this.userSessionExpiresAt - currentTime) / 1000));
        }

        return EMPTY;
      })
    );
  }

  ngOnDestroy(): void {
      this.unsubscribe.next();
  }

  logout(): void {
    this.authService.logout().pipe(
      takeUntil(this.unsubscribe),
    ).subscribe(
      _ => this.router.navigate(['']),
      error => {
        const data: SimpleDialogData = {
          type: 'error',
          title: 'Error',
          message: error
        };
        this.dialog.open(SimpleDialogComponent, { data });
      },
    );
  }

  login(): void {
    const dialogRef = this.dialog.open(LoginDialogComponent);

    dialogRef.componentInstance.loginClicked.pipe(
      takeUntil(this.unsubscribe),
      tap(_ => dialogRef.componentInstance.isLoading = true),
      switchMap(login => this.authService.login(login)),
    ).subscribe(isLoginSuccessfull => {
      dialogRef.componentInstance.isLoading = false;
      dialogRef.componentInstance.isLoginSuccessfull = isLoginSuccessfull;

      if(isLoginSuccessfull) {
        dialogRef.close();
      }      
    })
  }
}
