import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  public modal: boolean = false;

  constructor() { }

  abrirModal(){
    alert("Abriendo modal")
    this.modal = true;
  }

  cerrarModal(){
    this.modal = false;
  }
}
