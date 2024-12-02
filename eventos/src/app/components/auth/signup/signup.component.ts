import { Component, OnInit } from '@angular/core';
import { Observer } from 'rxjs';
import { Router } from '@angular/router';
import { Message, MessageService } from 'primeng/api';
import { LayoutService } from '../../layout/service/app.layout.service';
import { SignupService } from './service/signup.service';
import { Register } from './model/register';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  providers: [],
})
export class SignupComponent implements OnInit {
  constructor(
    public layoutService: LayoutService,
    private service: SignupService,
    private router: Router
  ) {}

  ngOnInit() {}

  register: Register = {};

  msgs: Message[] = [];

  singin() {
    if (
      !this.register.username ||
      !this.register.email ||
      !this.register.login ||
      !this.register.password
    ) {
      this.msgs = [
        {
          severity: 'error',
          summary: 'Erro',
          detail: 'Preencha todos os campos.',
        },
      ];
      return;
    }

    if (this.validarEmail(this.register.email)) {
      this.msgs = [
        {
          severity: 'error',
          summary: 'Erro',
          detail: 'E-mail inválido.',
        },
      ];
      return;
    }

    const observer: Observer<any> = {
      next: (res) => {
        this.router.navigate(['/']);
      },
      error: (err) => {
        const errorMessage = err.error ? err.error : 'Erro desconhecido';
        this.msgs = [
          {
            severity: 'error',
            summary: 'Erro',
            detail: errorMessage,
          },
        ];
      },
      complete: () => {},
    };
    this.service.save(this.register).subscribe(observer);
  }

  validarEmail(descricaoEmail: string) {
    // Expressão regular para validar o formato do e-mail
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Testar o e-mail com a expressão regular
    return !regexEmail.test(descricaoEmail);
  }
}
