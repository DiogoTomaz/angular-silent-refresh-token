import { SimpleDialogComponent, SimpleDialogData } from '@shared/components/simple-dialog/simple-dialog.component';
import { AuthenticationService } from '@core/services/authentication/authentication.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanLoad, Route, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad, CanActivateChild {
  private readonly isAuthenticated$: Observable<boolean>;
  constructor(private readonly dialog: MatDialog, authService: AuthenticationService) {
    this.isAuthenticated$ = authService.userAction$.pipe(
      map(ua => ua && ua.status === 'LoggedIn' && !!ua.user),
      tap(isAuthorized => {
        if(!isAuthorized) {
          const data: SimpleDialogData = {
            type: 'warning',
            title: 'Warning',
            message: 'Not authorized to access route'
          };
          this.dialog.open(SimpleDialogComponent, { data });
        }
      })
    )
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.isAuthenticated$;
  }
  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.isAuthenticated$
  }
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.isAuthenticated$;
  }

}
