import { Injectable } from "@angular/core";
import { uuid } from 'short-uuid';

export type FileWithId = { file: File, id: string };

@Injectable({
    providedIn: 'root'
})
export class FileStorageService {
    private readonly fileCache = new Map<string, FileWithId[]>();

    storeFile(username: string, file: File): FileWithId {
        const fileToStore: FileWithId = { file, id: uuid() };
        
        const userCachedFiles = this.fileCache.get(username);

        if(userCachedFiles) {
            userCachedFiles.push(fileToStore);            
        } else {
            this.fileCache.set(username, [fileToStore]);
        }

        return fileToStore;
    }

    getFiles(username: string): FileWithId[] {
        return this.fileCache.get(username) ?? [];
    }
}