import { Injectable } from '@angular/core';
import { formatDate, DatePipe } from '@angular/common';
import { Cliente } from './cliente.js';
import { of, Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { map, catchError, tap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Injectable()
export class ClienteService {

private urlEndPoint:string = 'http://localhost:8080/api/clientes';
private httpHeaders = new HttpHeaders({'Content-type': 'application/json'})

  constructor(private http: HttpClient, private router: Router) { }

  getClientes(page: number): Observable<any> {
    return this.http.get(this.urlEndPoint + '/page/' + page).pipe(
      tap( (response:any) => {
      console.log('ClienteSerivce: tap1');
      (response.content as Cliente[]).forEach(cliente => {
        console.log(cliente.nombre);
      });
      }),
      map( (response:any) => {
        let clientes = response as Cliente[];
        (response.content as Cliente[]).map(cliente => {
            cliente.nombre = cliente.nombre.toUpperCase();
            // cliente.createAt = formatDate(cliente.createAt, 'dd-MM-yy', 'en-US'); Segunda forma de formatear una fecha
            // let datePipe = new DatePipe('es');
            // cliente.createAt = datePipe.transform(cliente.createAt, 'EEEE dd, MMMM yyyy')
            return cliente;
        });
        return response;
      }),
      tap(response => {
        console.log('ClienteService: tap2');
        (response.content as Cliente[]).forEach(cliente => {
          console.log(cliente.nombre);
        })
      })
    );
  }

  create(cliente: Cliente) : Observable<Cliente>{
    return this.http.post(this.urlEndPoint,cliente,{headers: this.httpHeaders}).pipe(
      map((response: any) => response.cliente as Cliente),
      catchError( e => {

        if(e.status == 400){
          return throwError(e);
        }

        console.error(e.error.mensaje);
        Swal.fire( e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

  getCliente(id): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        this.router.navigate(['/clientes']);
        console.error(e.error.mensaje, 'error');
        Swal.fire('Error al editar!', e.error.mensaje, 'error');
        return throwError(e);
      })
    )
  }

  update(cliente: Cliente): Observable<any>{
    return this.http.put<any>(`${this.urlEndPoint}/${cliente.id}`, cliente, {headers: this.httpHeaders}).pipe(
      catchError(e => {

        if(e.status == 400){
          return throwError(e);
        }


        this.router.navigate(['/clientes']);
        console.error(e.error.mensaje, 'error');
        Swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    )
  }

  delete(id: number): Observable<Cliente>{
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`, {headers: this.httpHeaders}).pipe(
      catchError(e => {
        this.router.navigate(['/clientes']);
        console.error(e.error.mensaje, 'error');
        Swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    )
  }

}
