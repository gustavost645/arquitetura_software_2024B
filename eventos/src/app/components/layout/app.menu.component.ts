import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';

@Component({
  selector: 'app-menu',
  templateUrl: './app.menu.component.html',
})
export class AppMenuComponent implements OnInit {
  model: any[] = [];

  constructor(public layoutService: LayoutService) {}

  ngOnInit() {
    this.model = [
      {
        label: 'Cadastro',
        items: [
          { label: 'Eventos',
            icon: 'pi pi-fw pi-home',
            routerLink: ['eventos']
          },
          {
            label: 'Minhas Inscrições',
            icon: 'pi pi-fw pi-book',
            routerLink: ['inscricoes'],
          },
        ],
      },
      {
        label: 'Aluno',
        items: [
          {
            label: 'Perfil',
            icon: 'pi pi-fw pi-clone',
            routerLink: ['profile'],
          },
        ],
      },
    ];
  }
}
