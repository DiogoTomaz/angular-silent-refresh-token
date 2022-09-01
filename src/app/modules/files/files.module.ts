import { UploadComponent } from './components/upload/upload.component';
import { FileService } from '@core/services/file/file.service';
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FilesRoutingModule } from "./files-routing.module";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { ListComponent } from './components/list/list.component';

@NgModule({
    declarations: [
        UploadComponent,
        ListComponent
    ],
    imports: [
        CommonModule,
        FilesRoutingModule,
        MatProgressSpinnerModule,
        MatTableModule
    ],
    providers: [
        FileService,
    ],
  })
  export class FilesModule { }