import { NgModule } from '@angular/core';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';

import { BrowserModule } from '@angular/platform-browser';
import { TooltipModule } from 'primeng/tooltip';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from './infra/interceptors/jwt.interceptor';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppLayoutModule } from './components/layout/app.layout.module';
import { LoadingInterceptor } from './infra/interceptors/loading.interceptor';
import { LoadingComponent } from './components/loading/loading.component';
import { LoadingService } from './components/loading/service/loading.service';
import localePtBr from '@angular/common/locales/pt';
import { IntegerOnlyDirective } from './infra/diretive/integer-only.directive';

registerLocaleData(localePtBr);

@NgModule({
  declarations: [AppComponent, LoadingComponent, IntegerOnlyDirective],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    AppLayoutModule,
    TooltipModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true,
    },
    LoadingService,
    { provide: LOCALE_ID, useValue: 'pt-BR' },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
