import { UserModel } from './../model/user.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';
import { Usuario } from '../model/usuario.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LoginService {

  private readonly API = environment.authUrl + '/login';
  private readonly TOKEN_KEY = 'auth_token';
  private user : UserModel| null = null;

  constructor(private httpClient: HttpClient, private router: Router) {}

  login(userlogin: string, password: string): Observable<any> {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const credentials = {
      email: userlogin,
      password: password,
    };

    return this.httpClient.post<any>(this.API, credentials, { headers: headers }).pipe(
      map((response) => {
        if (response && response.token) {
          localStorage.setItem(this.TOKEN_KEY, response.token);

          const { userId, username, email } = response;

          this.setUser({id: userId, username, email});

        }
        return response;
      }),
      catchError((error) => {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem('userData');
        return throwError(error);
      })
    );
  }

  isAuthenticated(): boolean {
    // Verifique se o token está presente e não está expirado
    const token = localStorage.getItem(this.TOKEN_KEY);
    const verif = ( token !== null && !this.isTokenExpired(token));
    if(verif == false){
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem('userData');
    }

    return  verif;
  }

  private isTokenExpired(token: string): boolean {
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      return true; // Token JWT malformatado
    }

    const payload = JSON.parse(atob(tokenParts[1])); // Decodifique a parte do payload em Base64

    // Verifique a data de expiração do token
    const currentTime = Math.floor(Date.now() / 1000); // em segundos
    return payload.exp < currentTime;
  }


  logout(): void {
    // Remova o token do armazenamento seguro quando o usuário fizer logout
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem('userData');
    const token = localStorage.getItem(this.TOKEN_KEY);
    if(token == null){
      this.router.navigate(['/']);
    }
  }

  setUser(user: UserModel) {
    localStorage.setItem('userData', JSON.stringify(user));
    this.user = user;
  }

  getUser() {
    const savedUserJson = localStorage.getItem('userData');

    if (savedUserJson) {
      this.user = JSON.parse(savedUserJson);
    }
    return this.user;
  }

  getUserSessionView() : Usuario {
    const userModel =  this.getUser() as UserModel
    const usuario: Usuario = {
      id: userModel.id,
      nome: userModel.username,
      email: userModel.email,
    };
    return usuario;
  }
}
