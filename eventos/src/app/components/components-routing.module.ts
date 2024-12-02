import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '../infra/service/auth-guard.service';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'eventos', loadChildren: () =>import('./eventos/eventos.module').then((m) => m.EventosModule), canActivate: [AuthGuard] },
      { path: 'inscricoes', loadChildren: () =>import('./inscricoes/inscricoes.module').then((m) => m.InscricoesModule), canActivate: [AuthGuard] },
      { path: 'profile', loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule), canActivate: [AuthGuard]  },
      { path: '**', redirectTo: '/notFound'}
    ]),
  ],
  exports: [RouterModule],
})
export class ComponentsRoutingModule {}
