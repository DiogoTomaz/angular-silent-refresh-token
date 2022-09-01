import { FileWithId } from './../fake-services/file-storage.service';
import { map, switchMap } from 'rxjs/operators';
import { AuthenticationService } from '@core/services/authentication/authentication.service';
import { EMPTY, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class FileService {
    username$: Observable<string> = EMPTY;

    constructor(
        private readonly httpClient: HttpClient,
        private readonly authService: AuthenticationService
    ) {
        this.username$ = this.authService.userAction$.pipe(
            map(ua => ua.user!.username)
        );
    }

    uploadFile(file: File): Observable<Object> {
        return this.username$.pipe(
            switchMap(username => {
                const fileUpload = { file, username };
                return this.httpClient.post('/files/upload', fileUpload);
            }));
    }

    getFiles(): Observable<FileWithId[]> {
        return this.authService.userAction$.pipe(
            map(ua => ua.user?.username),
            switchMap(username => this.httpClient.get<FileWithId[]>(`/files/${username}/list`))
        );
    }
}
