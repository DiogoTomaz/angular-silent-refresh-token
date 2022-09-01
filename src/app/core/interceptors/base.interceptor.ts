import { HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Observable, of, throwError } from "rxjs";
import { delay } from "rxjs/operators";

export abstract class BaseInterceptor implements HttpInterceptor {
    abstract intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>;
    
    public ok<T>(body?: T, headers?: HttpHeaders): Observable<HttpResponse<T>> {
        return of(new HttpResponse<T>({ status: 200, body, headers })).pipe(delay(800));
    }

    public noContent<T>(headers?: HttpHeaders): Observable<HttpResponse<T>> {
        return of(new HttpResponse<T>({ status: 204, headers })).pipe(delay(800));
    }

    public created<T>(headers?: HttpHeaders): Observable<HttpResponse<T>> {
        return of(new HttpResponse<T>({ status: 201, headers })).pipe(delay(800));
    }

    public unauthorized(): Observable<never> {
        const httpError = new HttpErrorResponse({ error: 'Unauthorized', status: 401 });
        return throwError(httpError).pipe(delay(800));
    }

    public getAccessTokenFromAuthorizationHeader(headers: HttpHeaders): string | null {
        const bearer = 'Bearer ';
        const authorizationHeader = headers.get('Authorization');

        return authorizationHeader ? authorizationHeader.substring(bearer.length) : null;
    }
}