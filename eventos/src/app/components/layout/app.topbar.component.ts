import { Component, ElementRef, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";
import { TooltipModule } from 'primeng/tooltip';

import { UserModel } from './../auth/login/model/user.model';
import { LoginService } from '../auth/login/service/login.service';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
    styleUrls: ['./app.topbar.compent.scss']
})
export class AppTopBarComponent {

    items!: MenuItem[];

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    user: UserModel | null = null;

    constructor(public layoutService: LayoutService, private service: LoginService, private TooltipModule: TooltipModule) {
      this.user = this.service.getUser();

    }

    logout() {
      this.service.logout();
    }

}
