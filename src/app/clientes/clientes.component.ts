import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { CLIENTES } from './clientes.json';
import { ClienteService } from './cliente.service';
import Swal from 'sweetalert2'
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html'
})
export class ClientesComponent implements OnInit {

  clientes: Cliente[];

  constructor(private service: ClienteService) { }

  ngOnInit() {
    let page = 0;
    this.service.getClientes(page)
    .pipe(
      tap(response => {
            console.log('ClientesComponent: tap3');
            (response.content as Cliente[]).forEach(cliente => {
              console.log(cliente.nombre);
            });
      })
    ).subscribe(response => this.clientes = response.content as Cliente[]);
  }

  delete(cliente: Cliente): void{
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
        buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: 'Estas seguro?',
      text: "No podras revertir esta accion!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminarlo!',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.service.delete(cliente.id).subscribe(
          response => {
            this.clientes = this.clientes.filter(cli => cli !== cliente)
          }
        )
        swalWithBootstrapButtons.fire(
          'Eliminado!',
          `El cliente ${cliente.nombre} ${cliente.apellido} ah sido eliminado`,
          'success'
        )
      }
    })
  }

}
