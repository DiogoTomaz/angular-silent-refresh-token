import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS } from "@angular/material/dialog";
import { MatFormFieldModule } from '@angular/material/form-field';
import { LoginDialogComponent } from './components/login-dialog/login-dialog.component';
import { SimpleDialogComponent } from "./components/simple-dialog/simple-dialog.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';

@NgModule({
    declarations: [    
        SimpleDialogComponent,
        LoginDialogComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatProgressSpinnerModule,
        MatInputModule,
    ],
    providers: [
        { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: true } }
    ],
    exports: [],
    entryComponents: [
        SimpleDialogComponent,
        LoginDialogComponent
    ]
  })
  export class SharedModule { }