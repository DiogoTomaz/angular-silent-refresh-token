import { Observable, EMPTY } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { FileService } from '@core/services/file/file.service';
import { FileWithId } from '@core/services/fake-services/file-storage.service';

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
    files$: Observable<FileWithId[]> = EMPTY;
    displayedColumns: string[]  = ['id', 'name', 'size', 'type'];

    constructor(private readonly fileService: FileService) { }

    ngOnInit(): void {
        this.files$ = this.fileService.getFiles();
    }
}
