
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment'
import { Inscricao } from '../model/Inscricao';


@Injectable({
  providedIn: 'root',
})
export class InscricaoService {

  private readonly API = environment.inscrictUrl;

  constructor(private httpClient: HttpClient) {}

  findAll(): Observable<any> {
    return this.httpClient.get<Inscricao[]>(this.API);
  }

  findById(id: string): Observable<any> {
    return this.httpClient.get<Inscricao>(`${this.API}/${id}`);
  }

  save(record: any): Observable<any> {
    if (record.id) {
      return this.update(record);
    }
    return this.create(record);
  }

  private create(data: any): Observable<any> {
    return this.httpClient.post<Inscricao>(this.API, data);
  }

  private update(data: any): Observable<any> {
    return this.httpClient.put<Inscricao>(`${this.API}/${data.id}`, data);
  }

  remove(id: string): Observable<any> {
    return this.httpClient.delete(`${this.API}/${id}`);
  }

  registrarPresenca(data: any): Observable<any>  {
    const {eventoId,usuarioId} = data;

    const presenca = {
      usuarioId,
      eventoId
    }

    return this.httpClient.post<Inscricao>(this.API +'/presenca', presenca);
  }

  gerarCertificado(data: any): Observable<any>  {
    const {eventoId,usuarioId} = data;

    const certificado = {
      usuarioId,
      eventoId
    }

    return this.httpClient.post<Inscricao>(this.API +'/certificado', certificado);
  }

  cancelarInscricao(data: any): Observable<any>  {
    const {eventoId,usuarioId} = data;

    const cancelar = {
      usuarioId,
      eventoId
    }

    return this.httpClient.post<Inscricao>(this.API +'/cancelar', cancelar);
  }

}
