import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EventosComponent } from './eventos.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: EventosComponent }
	])],
	exports: [RouterModule]
})
export class EventosRoutingModule { }
