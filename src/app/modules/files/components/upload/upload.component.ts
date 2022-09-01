import { catchError, takeUntil } from 'rxjs/operators';
import { FileService } from './../../../../core/services/file/file.service';
import { ChangeDetectionStrategy, Component, OnDestroy } from "@angular/core";
import { EMPTY, Subject } from 'rxjs';

@Component({
    selector: 'code-invaders-upload',
    templateUrl: './upload.component.html',
    styleUrls: ['./upload.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UploadComponent implements OnDestroy {
    constructor(private readonly fileService: FileService) {}
    file: File | null = null;
    isUploadingInProgress$ = new Subject<boolean>();

    private unsubscribe = new Subject();

    ngOnDestroy(): void {
        this.unsubscribe.next();
    }

    onFileSelected(e: Event | undefined): void {
        const inputElement = e?.target as HTMLInputElement;
        if (inputElement && inputElement.files?.length) {            
            this.file = inputElement.files[0];
            
            this.isUploadingInProgress$.next(true);
            
            this.fileService.uploadFile(this.file).pipe(
                takeUntil(this.unsubscribe),
                catchError(_ => {
                    this.isUploadingInProgress$.next(false);
                    return EMPTY;
                })
            ).subscribe(_ => this.isUploadingInProgress$.next(false));
        }
    }
}