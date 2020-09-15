import { Component } from '@angular/core';

import { MovimientoService } from './services/movimiento.service';
import { Global } from './services/global';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [MovimientoService]
})
export class AppComponent {
  fecha = new Date();

  constructor(
    private _MovimientoService: MovimientoService
  ) {
  }//***** fin del constructor */

  ngOnInit() {
    var m = this.fecha.getMonth() + 1;

    for (var i = 0; i < 12; i++) Global.totalIngresosMes[i] = 0;
    for (var i = 0; i < 12; i++) Global.totalEgresosMes[i] = 0;
    for (var i = 0; i < m; i++) this.CargaTotIngEgrMes(i + 1);
    this.cargaSaldosIniciales();
  }//fin ngOnInit

  //****** Carga el total de ingresos y el total de egresos para cada mes */  
  CargaTotIngEgrMes(m) {
    var fechaMovimientos: string; var y = this.fecha.getFullYear();
    var ingresos = 0; var egresos = 0;
    fechaMovimientos = m + '-' + y;//arma el string de busqueda
    this._MovimientoService.searchMovimiento(fechaMovimientos).subscribe(
      response => {
        if (response.movimientos)
          for (var i = 0; i < response.movimientos.length; i++) {
            if (response.movimientos[i].obj_concepto.grupo == 'Ingresos')
              ingresos += response.movimientos[i].valor;
            else
              egresos += response.movimientos[i].valor;
          }
        Global.totalIngresosMes[m - 1] = ingresos;
        Global.totalEgresosMes[m - 1] = egresos;
      }
    );
  }
  //**** Carga datos para cálculo de saldos iniciales*/
  cargaSaldosIniciales() {
    for (var i = 0; i < 12; i++) Global.saldoInicialMes[i] = 0;
    var busqueda = this.fecha.getFullYear() + ';;Saldo Inicial';
    this._MovimientoService.searchMovFechaConcepto(busqueda).subscribe(
      response => {
        var indexMes: number;
        if (response.movimientos)
          for (var i = 0; i < response.movimientos.length; i++) {
            if (response.movimientos[i].fecha.length > 9)
              indexMes = Number(response.movimientos[i].fecha.substr(3, 2));
            else
              indexMes = Number(response.movimientos[i].fecha.substr(3, 1));
            Global.indiceSaldoInicial[i] = indexMes - 1;
            Global.saldoInicialMes[indexMes - 1] = response.movimientos[i].valor;
          }
      }
    );///fin search     
  }

}//fin de la clase
