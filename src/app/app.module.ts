import { AuthorizationInterceptor } from '@core/interceptors/authorization/authorization.interceptor';
import { BackEndInterceptor } from '@core/interceptors/back-end/back-end.interceptor';
import { SharedModule } from '@shared/shared.module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from '@shared/components/header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { UserNamePipe } from '@shared/pipes/user-name/user-name.pipe';

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        UserNamePipe,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        SharedModule,
        BrowserAnimationsModule,
        HttpClientModule,
    ],
    providers: [
        { provide: Window, useValue: window },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthorizationInterceptor,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: BackEndInterceptor,
            multi: true
        },
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
