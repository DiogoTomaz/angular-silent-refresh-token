import { ListComponent } from './components/list/list.component';
import { AuthGuard } from '@core/guards/auth/auth.guard';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UploadComponent } from './components/upload/upload.component';

const routes: Routes = [
    {
      path: '',
      canActivateChild: [AuthGuard],
      children: [
        {
           path: 'upload',
           component: UploadComponent
        },
        {
          path: 'list',
          component: ListComponent
        }
      ]
    }  
  ];
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class FilesRoutingModule { }