import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Utils } from '../utils/utils';
import { MessageService } from 'primeng/api';
import { Observer } from 'rxjs';
import { Inscricao } from './model/Inscricao';
import { InscricaoService } from './service/inscricao.service';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-inscricoes',
  templateUrl: './inscricoes.component.html',
  styleUrls: ['./inscricoes.component.css'],
  providers: [MessageService, Utils],
})
export class InscricoesComponent implements OnInit {
  loading: boolean = false;
  deleteInscricaoDialog: boolean = false;
  listaInscricoes: Inscricao[] = [];
  inscricao: Inscricao = {};

  @ViewChild('filter') filter!: ElementRef;


  constructor(
    private messageService: MessageService,
    private utils: Utils,
    private inscricaoService: InscricaoService
  ) {}

  ngOnInit(): void {
    this.atualizarListagem();
  }

  private atualizarListagem() {
    const observer: Observer<any> = {
      next: (response) => {
        this.listaInscricoes = response;
      },
      error: (err) => {
        const { ok, status, statusTesxt, url } = err;

        this.messageService.add({
          severity: 'error',
          summary: `Erro ao chamar o serviço: ${err.status}`,
          detail: `${err.statusText}`,
          life: 3000,
        });
      },
      complete: () => { },
    };

    this.inscricaoService.findAll().subscribe(observer);
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  registrarPresencaButton(row: Inscricao) {
    const observer: Observer<any> = {
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Presença registrada com sucesso!',
          detail: `A sua presença foi registrada no evento.`,
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

    this.inscricaoService.registrarPresenca(row).subscribe(observer);
  }

  gerarCertificadoButton(row: Inscricao) {
    const observer: Observer<any> = {
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Certificado gerado com sucesso!',
          detail: `Aguarde o recebimento do seu certificcado por email.`,
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

    this.inscricaoService.gerarCertificado(row).subscribe(observer);
  }


  cancelarInscricao(row: Inscricao) {
    this.deleteInscricaoDialog = true;
    this.inscricao = { ...row };
}

  confirmCancelamento() {
    const observer: Observer<any> = {
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Cancelamento registrado com sucesso!',
          detail: ``,
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
        this.deleteInscricaoDialog = false;
        this.inscricao = {};
        this.atualizarListagem();
      },
    };

    this.inscricaoService.cancelarInscricao(this.inscricao).subscribe(observer);
  }

}
