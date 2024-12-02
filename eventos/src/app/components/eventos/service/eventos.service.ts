
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment'
import { Eventos } from '../model/eventos';
import { Inscricao } from '../../inscricoes/model/Inscricao';
import { LoginService } from '../../auth/login/service/login.service';


@Injectable({
  providedIn: 'root',
})
export class EventosService {

  private readonly API = environment.eventsUrl;
  private readonly inscriaoAPI = environment.inscrictUrl;

  constructor(private httpClient: HttpClient,
    private loginService: LoginService) {}

  findAll(): Observable<any> {
    return this.httpClient.get<Eventos[]>(this.API);
  }

  findById(id: string): Observable<any> {
    return this.httpClient.get<Eventos>(`${this.API}/${id}`);
  }

  save(record: any): Observable<any> {
    if (record.id) {
      return this.update(record);
    }
    return this.create(record);
  }

  private create(data: any): Observable<any> {
    return this.httpClient.post<Eventos>(this.API, data);
  }

  private update(data: any): Observable<any> {
    return this.httpClient.put<Eventos>(`${this.API}/${data.id}`, data);
  }

  remove(id: string): Observable<any> {
    return this.httpClient.delete(`${this.API}/${id}`);
  }

  efetuarInscricao(data: any): Observable<any> {
    const{id:eventoId} = data;

    const usuarioLogado = this.loginService.getUserSessionView();

    const inscricaoData = {
      usuarioId:usuarioLogado.id, eventoId, presente:false
    }

    return this.httpClient.post<Inscricao>(this.inscriaoAPI, inscricaoData)
  }
}
