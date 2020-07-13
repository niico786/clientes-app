import { Component, OnInit, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'paginator-nav',
  templateUrl: './paginator.component.html',
})
export class PaginatorComponent implements OnInit, OnChanges {

  @Input() paginador: any;

  paginas: number[];

  desde: number;

  hasta: number;

  constructor() { }

  ngOnInit (){

  }

  ngOnChanges(): void {

    // Caluclo el desde buscando el valor minimo entre
    //  el maximo entre 1 (que es el minimo que puede tomar la pagina) y la pagina actual - 4 ,
    //  y el total de paginas - 5
     this.desde = Math.min(Math.max(1, this.paginador.number-4), this.paginador.totalPages-5);
     // Calculo el hasta buscando el maximo valor entre
     // el minimo entre el total de paginas(que es el maximo valor que puede tomar una pagina) y la pagina actual + 4
      // y el 6
     this.hasta = Math.max(Math.min(this.paginador.totalPages, this.paginador.number+4), 6);

    if(this.paginador.totalPages > 5){
      this.paginas = new Array(this.hasta - this.desde + 1).fill(0).map((_valor, indice) => indice + this.desde  );
    } else {
      this.paginas = new Array(this.paginador.totalPages).fill(this.paginador.totalPages).map((_valor, indice) => indice + 1);
    }
  }

}
