import { AuthGuard } from '@core/guards/auth/auth.guard';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'files',
    loadChildren: () => import('./modules/files/files.module').then(m => m.FilesModule),
    canLoad: [AuthGuard]
  }  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
