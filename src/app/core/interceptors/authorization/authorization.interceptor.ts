import { AuthenticationService } from '@core/services/authentication/authentication.service';
import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, switchMap, catchError, take } from 'rxjs/operators';

@Injectable()
export class AuthorizationInterceptor implements HttpInterceptor {

    constructor(
        private readonly authService: AuthenticationService
    ) { }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        if (!request.headers.get('Authorization')) {
            const user = this.authService.getUser();
            // If the user is still logged in, make sure we supply the auth header
            if (user) {
                request = this.getNewRequestWithAuthHeader(request, user.accessToken);
            }

            // In the event of a 401, we silently refresh the token
            return next.handle(request).pipe(
                catchError(error => {
                    const user = this.authService.getUser();
                    if (user && error instanceof HttpErrorResponse && error.status === 401) {
                        return this.authService.refreshToken().pipe(
                            switchMap(token => next.handle(this.getNewRequestWithAuthHeader(request, token.accessToken)))
                        )
                    }

                    return throwError(error);
                })
            )
        }

        return next.handle(request);
    }

    private getNewRequestWithAuthHeader<T>(originalRequest: HttpRequest<T>, accessToken: string): HttpRequest<T> {
        return originalRequest.clone({ setHeaders: { 'Authorization': `Bearer ${accessToken}` } });
    }
}
