import { Component, OnInit } from '@angular/core';
import { Utils } from '../utils/utils';
import { MessageService } from 'primeng/api';
import { Profile } from './model/profile';
import { ProfileService } from './service/profile.service';
import { Observer } from 'rxjs';
import { LoginService } from '../auth/login/service/login.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [MessageService, Utils],
})
export class ProfileComponent implements OnInit {
  register: Profile = {};

  constructor(
    private messageService: MessageService,
    private utils: Utils,
    private profileService: ProfileService,
    private loginService:LoginService
  ) {}

  ngOnInit(): void {
    const observer: Observer<any> = {
      next: (response) => {
        this.register = response;
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
      complete: () => {

      },
    };
    const usuario = this.loginService.getUserSessionView();
    const id = usuario.id;

    this.profileService.findById(id as unknown as string).subscribe(observer);

  }

  alterar() {
    const observer: Observer<any> = {
      next: (response) => {
        this.register = response;
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Registro alterado com sucesso',
          life: 3000,
        });
      },
      error: (err) => {
        const { ok, status, statusTesxt, url } = err;
        console.log(err);

        this.messageService.add({
          severity: 'error',
          summary: `Erro ao alterar profile ${err.status}`,
          detail: `${err.statusText}`,
          life: 3000,
        });
        console.error('Erro ao chamar o serviço:', err);
      },
      complete: () => {},
    };
    this.profileService.save(this.register).subscribe(observer);

  }
}
