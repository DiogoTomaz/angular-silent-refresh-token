import { TokenProviderService } from '@core/services/fake-services/token-provider.service';
import { Login } from '@shared/models/login';
import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpHeaders,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { isUser } from '@shared/models/user';
import { isToken } from '@shared/models/fake-token';
import { BaseInterceptor } from '../base.interceptor';
import { FileStorageService } from '@core/services/fake-services/file-storage.service';


@Injectable()
export class BackEndInterceptor extends BaseInterceptor {
    constructor(
        private readonly tokenProvider: TokenProviderService,
        private readonly fileStorage: FileStorageService
    ) {
        super();
    }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        const { url, method, headers, body } = request;
        // These would best be handled with a regex to ensure it's actually a match
        const isLoginUrl = url.endsWith('login') && method === 'POST';
        const isRenewUrl = url.endsWith('refresh') && method === 'POST';
        const isLogoutUrl = url.endsWith('logout') && method === 'POST';
        const isLoginRelatedUrl = isLoginUrl || isRenewUrl || isLogoutUrl;
        const isFilesRelatedUrl = url.startsWith('/files');

        if (isLoginRelatedUrl) {
            return this.handleAuthRequests(request, next);
        }

        if (isFilesRelatedUrl) {
            return this.handleFilesRequests(request, next);
        }

        return next.handle(request);
    }

    private handleAuthRequests(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { url, method, headers, body } = request;
        // These would best be handled with a regex to ensure it's actually a match
        const isLoginUrl = url.endsWith('login') && method === 'POST';
        const isRefreshUrl = url.endsWith('refresh') && method === 'POST';
        const isLogoutUrl = url.endsWith('logout') && method === 'POST';

        if (isLoginUrl) {
            const { username, password } = body as Login;
            const result = this.tokenProvider.attemptLogin(username, password);

            if(isUser(result)) {
                let headers = new HttpHeaders();
                headers = headers.set('Authorization', `Bearer ${result.accessToken}`);
                return this.ok(result, headers);
            }

            return this.unauthorized();
        }

        if (isRefreshUrl) {
            const accessToken = this.getAccessTokenFromAuthorizationHeader(headers);
            const result = this.tokenProvider.refreshToken(accessToken);

            if(isToken(result)) {
                let headers = new HttpHeaders();
                headers = headers.set('Authorization', `Bearer ${result.accessToken}`);
                return this.ok(result, headers);
            }

            return this.unauthorized();
        }

        if (isLogoutUrl) {
            const accessToken = this.getAccessTokenFromAuthorizationHeader(headers);
            const isLoggedOutSucessfully = this.tokenProvider.logout(accessToken);

            return isLoggedOutSucessfully ? this.ok() : this.unauthorized();
        }

        return next.handle(request);
    }

    private handleFilesRequests(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { url, method, headers, body } = request;

        const accessToken = this.getAccessTokenFromAuthorizationHeader(headers);
        if (!accessToken || !this.tokenProvider.isAuthorized(accessToken)) {
            return this.unauthorized();
        }

        // These would best be handled with a regex to ensure it's actually a match
        if (url.endsWith('upload') && method === 'POST') {
            const fileUpload = body as { file: File, username: string };
            const storedFile = this.fileStorage.storeFile(fileUpload.username, fileUpload.file);

            let httpHeaders = new HttpHeaders();
            httpHeaders = httpHeaders.set('Location', `files/${storedFile.id}`)

            return this.created(httpHeaders);
        }

        if (url.endsWith('list') && method === 'GET') {
            const filesListRegex = /^\/files\/(\w+)\/list$/;
            const match = url.match(filesListRegex);
            const username = match![1];
            const listOfFiles = this.fileStorage.getFiles(username);

            // We could improve this, to have pagination (content-range) and send 200/206
            return listOfFiles?.length > 0 ? this.ok(listOfFiles) : this.noContent();
        }

        return next.handle(request);
    }
}
