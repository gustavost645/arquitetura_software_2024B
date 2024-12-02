import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Register } from '../model/register';
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root',
})
export class SignupService {

  private readonly API = environment.authUrl + '/register';

  private _registers: Register[] = []; // Lista de tags

  private registerSubject: BehaviorSubject<Register[]> = new BehaviorSubject(this._registers);

  get registers$(): Observable<Register[]> {
    return this.registerSubject.asObservable();
  }

  constructor(private httpClient: HttpClient, private router: Router) {}

  findAll(): Observable<any> {
    return this.httpClient.get<Register[]>(this.API);
  }

  findAllByUsuario(idUsuario: number): Observable<any> {
    //return this.httpClient.get<Tags[]>(`${this.API}/findAllByUser/${idUsuario}`);
    return this.httpClient.get<Register[]>(this.API);
  }

  findById(id: string): Observable<any> {
    return this.httpClient.get<Register>(`${this.API}/${id}`);
  }

  save(record: any): Observable<any> {
    if (record.id) {
      return this.update(record);
    }
    return this.create(record);
  }

  private create(data: any): Observable<any> {
    return this.httpClient.post<Register>(this.API, data);
  }

  private update(data: any): Observable<any> {
    return this.httpClient.post<Register>(this.API, data);
  }

  remove(id: string): Observable<any> {
    return this.httpClient.delete(`${this.API}/${id}`);
  }

  // Adicione este método para atualizar a lista de tags
  atualizarRegister(newsRegisters: Register[]) {
    this._registers = newsRegisters;
    this.registerSubject.next(this._registers);
  }

}
