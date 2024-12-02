import { EventosService } from './service/eventos.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Utils } from '../utils/utils';
import { MessageService } from 'primeng/api';
import { Eventos } from './model/eventos';
import { Table } from 'primeng/table';
import { Observer } from 'rxjs';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css'],
  providers: [MessageService, Utils],
})
export class EventosComponent implements OnInit {
  loading: boolean = false;
  eventosDialog: boolean = false;
  listaEventos: Eventos[] = [];

  eventoEdit: Eventos = {};

  @ViewChild('filter') filter!: ElementRef;

  constructor(
    private messageService: MessageService,
    private utils: Utils,
    private eventosService: EventosService
  ) {}

  ngOnInit(): void {
    this.atualizarListagem();
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  registerButton(row: Eventos) {
    const observer: Observer<any> = {
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Inscrição realizada com sucesso!',
          detail: `A inscrição no evento foi concluída.`,
          life: 3000,
        });
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: `Erro ao chamar o serviço: ${err.status}`,
          detail: `${err.statusText}`,
          life: 3000,
        });
      },
      complete: () => {
        this.atualizarListagem();
      },
    };

    this.eventosService.efetuarInscricao(row).subscribe(observer);
  }

  verDetalhesButton(row: Eventos) {
    this.eventoEdit = { ...row };
    this.eventosDialog = true;
  }

  hideDialog(){
    this.eventosDialog=false;
    this.eventoEdit = {};
  }


  private atualizarListagem() {
    const observer: Observer<any> = {
      next: (response) => {
        this.listaEventos = response;
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: `Erro ao chamar o serviço: ${err.status}`,
          detail: `${err.statusText}`,
          life: 3000,
        });
      },
      complete: () => { },
    };

    this.eventosService.findAll().subscribe(observer);
  }
}
