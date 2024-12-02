import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { InscricoesComponent } from './inscricoes.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: InscricoesComponent }
	])],
	exports: [RouterModule]
})
export class InscricoesRoutingModule { }
