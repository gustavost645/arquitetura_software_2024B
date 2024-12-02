import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './infra/service/auth-guard.service';
import { AppLayoutComponent } from './components/layout/app.layout.component';

const routes: Routes = [
  { path: '',
    redirectTo: '/auth/singin',
    pathMatch: 'full'
  },
  {
    path: 'app', component: AppLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {path: '', loadChildren: () =>import('./components/components.module').then((m) => m.ComponentsModule)},
    ],
  },
  { path: 'auth', loadChildren: () => import('./components/auth/auth.module').then(m => m.AuthModule) },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
      onSameUrlNavigation: 'reload',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
