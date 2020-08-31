import { Component, OnInit } from '@angular/core';
import { Cliente } from '../cliente';
import { ClienteService } from '../cliente.service';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'detalle-cliente',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {
  cliente: Cliente;   
  titulo: string = "Detalle del cliente";
  fotoSeleccionada: File;
  progreso:number = 0;

  constructor(private clienteService: ClienteService,
     private ActivatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.ActivatedRoute.paramMap.subscribe(params =>{
      let id:number = +params.get('id');
      if(id){
        this.clienteService.getCliente(id).subscribe(cliente =>{
          this.cliente = cliente;
        });
      }
    });
  }

  seleccionarFoto(event){
    this.fotoSeleccionada = event.target.files[0];
    this.progreso = 0;
    console.log(this.fotoSeleccionada);
    if(this.fotoSeleccionada.type.indexOf('image') < 0){
      Swal.fire('Error selecionar imagen: ', 'El archivo debe ser del tipoi imagen', 'error');
      this.fotoSeleccionada = null;
    }
  }

  subiFoto(){
    if (!this.fotoSeleccionada) {
      Swal.fire('Error Upload: ', 'Debe seleccionar una foto', 'error');
    } else {
        this.clienteService.subirFoto(this.fotoSeleccionada, this.cliente.id)
      .subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progreso = Math.round((event.loaded/event.total)*100);
        } else if (event.type === HttpEventType.Response) {
          let response: any = event.body;
          this.cliente = response.cliente as Cliente; 
          Swal.fire('La foto se ha subido completamente',response.mensaje, 'success');
        }
       // this.cliente = cliente;
       
      });
    }
  }

}
