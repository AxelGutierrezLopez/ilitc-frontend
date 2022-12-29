import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseMensaje } from '../models/responseMensaje';
import { Cliente } from '../models/cliente';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  tipoURL = '/api/cliente';

  constructor(private httpClient: HttpClient) { }

  public list(): Observable<Cliente[]> {
    return this.httpClient.get<Cliente[]>(this.tipoURL);
  }

  public getById(id_cliente: number): Observable<Cliente> {
    return this.httpClient.get<Cliente>(this.tipoURL + `/${id_cliente}`);
  }

  public create(cliente: Cliente): Observable<ResponseMensaje> {
    return this.httpClient.post<ResponseMensaje>(this.tipoURL, cliente);
  }

  public update(id_cliente: number, cliente: Cliente): Observable<ResponseMensaje> {
    return this.httpClient.put<ResponseMensaje>(this.tipoURL + `/${id_cliente}`, cliente);
  }

  public delete(id_cliente: number): Observable<any> {
    return this.httpClient.delete<any>(this.tipoURL + `/${id_cliente}`);
  }
}
