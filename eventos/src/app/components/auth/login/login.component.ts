import { Component, OnInit } from '@angular/core';
import { LoginService } from './service/login.service';
import { Observer } from 'rxjs';
import { Router } from '@angular/router';
import { Message } from 'primeng/api';
import { LayoutService } from '../../layout/service/app.layout.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [],
})
export class LoginComponent implements OnInit {
  login!: string;
  password!: string;
  loading: boolean = false; // Variável para controlar a exibição do ícone de carga

  valCheck: string[] = ['remember'];
  msgs: Message[] = [];

  ngOnInit() {}

  constructor(
    public layoutService: LayoutService,
    private service: LoginService,
    private router: Router
  ) {}

  singin() {
    if (!this.login || !this.password || this.loading) {
      // Retorna se as credenciais estiverem em branco ou se o processo de login já estiver em andamento
      return;
    }

    // Define loading como true para exibir o ícone de carga
    this.loading = true;

    const observer: Observer<any> = {
      next: (res) => {
        if (res && res.token) {
          // Se o login for bem-sucedido, redireciona para a página de pedidos
          this.router.navigate(['/app/eventos']);
        } else {
          // Se as credenciais forem inválidas, exibe uma mensagem de erro
          this.msgs = [{ severity: 'error', summary: 'Erro', detail: 'Credenciais inválidas.' }];
        }
      },
      error: (err) => {
        // Em caso de erro durante o login, exibe uma mensagem de erro
        this.loading = false;
        this.msgs = [{ severity: 'error', summary: 'Erro', detail: 'Erro ao fazer login.' }];
      },
      complete: () => {
        // Define loading como false para ocultar o ícone de carga após o login
        this.loading = false;
      },
    };

    // Realiza a chamada para o serviço de login
    this.service.login(this.login, this.password).subscribe(observer);
  }
}
