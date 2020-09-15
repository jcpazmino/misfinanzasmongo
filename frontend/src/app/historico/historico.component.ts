import { Component, OnInit, Input} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert';


import { MovimientoService } from '../services/movimiento.service';

import { Movimiento } from '../models/movimiento';
import { Subgrupo} from '../models/subgrupo';
import { Global } from  '../services/global';

@Component({
  selector: 'app-historico',
  templateUrl: './historico.component.html',
  styleUrls: ['./historico.component.css'],
  providers: [MovimientoService]
})
export class HistoricoComponent implements OnInit {
  @Input() selectedMeses: string;


  fecha : Date = new Date();
  meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  mesActual : string ;
  fechaMovimientos: string;
  numMesActual: number;
  meseHabilitados = [];  
  saldoInicialAno: number= 0;  
  saldoInicial: number;
  saldoFinal: number;
  ingresos: number;
  egresos: number; 
  
  ingresosMes: number[];
  egresosMes = [];
  
  public subgrupos: Subgrupo[];
  public movimientos: Movimiento[];  
  public arrSubgrupos: string[];
  public arrConceptos: string[];

//**** ojo--> private _router: Router--- es necesario para el llamado (change)="cargaMovimientos()" */
  constructor(
    private _MovimientoService: MovimientoService,
    private _router: Router
  ) {   
    
  } 
  ngOnInit() {
  //**** Hablita los meses para el resumen */
    this.numMesActual = this.fecha.getMonth();
    this.mesActual = this.meses[this.numMesActual]; 
    for (var i = 0; i < this.numMesActual; i++) {
      this.meseHabilitados[i] = this.meses[i]; 
    }
  /**** Realiza el cálculos de los saldos iniciales */
    for (var i = 0; i < this.numMesActual; i++) {
      if(Global.saldoInicialMes[i]==0 && i>0)
        Global.saldoInicialMes[i]=Global.saldoInicialMes[i-1]+Global.totalIngresosMes[i-1]
                                  -Global.totalEgresosMes[i-1];
    }    

    this.selectedMeses = this.meseHabilitados[0];//mes inicial para mostrar información 
    this.cargaMovimientos(); //carga la info de los movimientos fijos desde el backend  
  }//fin ngOnInit 

//********* carga la info de los movimientos fijos desde el backend */
  cargaMovimientos(){
    this.ingresos = 0; this.egresos = 0; var globalSaldoInicial=0;
    var m = this.meses.indexOf(this.selectedMeses)+1; 
    var y = this.fecha.getFullYear();   
    this.fechaMovimientos = m+'-'+y;//arma el string de busqueda
    this._MovimientoService.searchMovimiento(this.fechaMovimientos).subscribe(
      response => {
          this.movimientos = response.movimientos; 
          for(var i=0;i<this.movimientos.length;i++){
            if(this.movimientos[i].obj_concepto.grupo=='Ingresos')
              this.ingresos += this.movimientos[i].valor; 
            else
              this.egresos += this.movimientos[i].valor;
          }
        /**** Verifica si en el mes hay saldo inicial para restarlo de los ingresos */
        if( Global.indiceSaldoInicial.includes(m-1))
          globalSaldoInicial= Global.saldoInicialMes[m-1];
        else 
          globalSaldoInicial= 0;
        //*** si el saldo del mes en el que estoy es mayor a cero */
          if(Global.saldoInicialMes[m-1]>0) this.saldoInicial=Global.saldoInicialMes[m-1];
          else{
          //**** si estoy trabajando en un mes después de enero */
            if(m>1) this.saldoInicial=Global.saldoInicialMes[m-2] + Global.totalIngresosMes[m-2]
                                      - Global.totalEgresosMes[m-2] - globalSaldoInicial;
            else this.saldoInicial=0;
            Global.saldoInicialMes[m-1] = this.saldoInicial;
          }
          this.saldoFinal   = this.saldoInicial + this.ingresos - this.egresos;  

      },
      error => {        
        this.movimientos= [];
        swal( 'No hay datos para el mes consultado', 'en Movimientos', "success" ); 
      }
    );  
  }//****** termina cargaMovimientos */  

}// fin de la clase
