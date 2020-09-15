import { Component, OnInit } from '@angular/core';
import {  ActivatedRoute } from '@angular/router';
import * as Chartist from 'chartist';


import { MovimientoService } from '../services/movimiento.service';
import { Movimiento } from '../models/movimiento';
import { Global } from  '../services/global';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [ MovimientoService]
})
export class DashboardComponent implements OnInit { 
  public movimientos: Movimiento[]; 
  fecha : Date = new Date();
  meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  GrafMeses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Agos", "Sep", "Oct", "Nov", "Dic"];
  mesActual : string ;
  numMesActual: number;
  selectedMeses: string;
  meseHabilitados = [];
/*** variables para gráficas */
  grafLow: number;
  grafHigh: number;
  grafExcLowHigh=100; 
  grafLabelMesHabilit=[];
  grafSeriesMesIngresos = [];
  grafSeriesMesEgresos = [];
  factorGraficas:number=1000;

//estos valores iniciales no son importantes, se pueden cambiar
  grafLowSaldo: number = 2500-100;
  grafHighSaldo: number = 5000+100;
  grafSeriesMesSaldos = [3500000, 4200000, 2500000, 3100000, 1500000, 150, 150, 150, 150, 150, 150, 150];


/**** variables saldos */
  saldoInicioAno:number;
  saldosIniciales:number=0;
  ingresosTotales:number= 0;
  egresosTotales:number = 0;
  saldoActual:number ;

  constructor(
    private _route: ActivatedRoute,  
    private _MovimientoService: MovimientoService
  ) {
  }//***** fin del constructor */

//******* inicio del OnInit */
  ngOnInit() {
    this.numMesActual = this.fecha.getMonth();
    this.mesActual = this.meses[this.numMesActual];
  /*** habilita los meses para las gráficas */
    for(var i=0;i<this.numMesActual;i++){
      this.grafLabelMesHabilit[i] = this.GrafMeses[i];
    }  
    //**** Hablita los meses para el resumen */
    var m = this.fecha.getMonth()+1; 
    var i:number;
    for (i = 0; i <= m; i++) {
      this.meseHabilitados[i] = this.meses[i]; 
    }   
    
 //******** clases propias del componente */       
    this.saldoInicioAno=Global.saldoInicialMes[0];
    this.getTotalSaldosIniciales(this.fecha.getFullYear());
    this.getTotalFechaGrupoIng(this.fecha.getFullYear());
    this.getTotalFechaGrupoEgr(this.fecha.getFullYear());
  /****  Datos para las gráficas */
    this.grafLow  = Global.totalIngresosMes[0];
    this.grafHigh = Global.totalIngresosMes[0]; 
    for(var i=0; i<this.numMesActual; i++){
      this.grafSeriesMesIngresos[i]=Global.totalIngresosMes[i]/this.factorGraficas;
      if(this.grafLow>Global.totalIngresosMes[i]) this.grafLow=Global.totalIngresosMes[i];
      if(this.grafHigh<Global.totalIngresosMes[i]) this.grafHigh=Global.totalIngresosMes[i];
    }
    for(var i=0; i<this.numMesActual; i++){
      this.grafSeriesMesEgresos[i]=Global.totalEgresosMes[i]/this.factorGraficas; 
      if(this.grafLow>Global.totalEgresosMes[i]) this.grafLow=Global.totalEgresosMes[i];
      if(this.grafHigh<Global.totalEgresosMes[i]) this.grafHigh=Global.totalEgresosMes[i];
    }
    this.grafLow  = this.grafLow/this.factorGraficas-this.grafExcLowHigh;
    this.grafHigh  = this.grafHigh/this.factorGraficas+this.grafExcLowHigh;

    this.genGrafIngEgr();
    this.genGrafSaldosMes(); 
  }//final OnInit
/**** extrae de la BD los totales por grupo (Ingresos-Egresos) */
getTotalSaldosIniciales(fecha){
  this.saldosIniciales=0;
  var busqueda = fecha+';;'+'Saldo Inicial';
  this._MovimientoService.searchMovFechaConcepto(busqueda).subscribe(
    response => {
      for(var i=0; i<response.movimientos.length;i++)
        this.saldosIniciales+=response.movimientos[i].valor;
    }
  ); 
}
getTotalFechaGrupoIng(fecha){
  this.ingresosTotales=0;
  var busqueda = fecha+';;'+'Ingresos';
  this._MovimientoService.searchMovFechaGrupo(busqueda).subscribe(
    response => {
      if(response.movimientos)
        for(var i=0; i<response.movimientos.length;i++)
          this.ingresosTotales+=response.movimientos[i].valor;
    }
  ); 
}
getTotalFechaGrupoEgr(fecha){
  this.egresosTotales=0;
  var busqueda = fecha+';;'+'Egresos';
  this._MovimientoService.searchMovFechaGrupo(busqueda).subscribe(
    response => {
      if(response.movimientos)
        for(var i=0; i<response.movimientos.length;i++)
          this.egresosTotales +=response.movimientos[i].valor;
        this.saldoActual= this.saldoInicioAno+this.ingresosTotales
                          -this.saldosIniciales-this.egresosTotales;
    }
  ); 
}
//******** genera la gráfica de ingresos vs. egresos */
  genGrafIngEgr(){
  /*  valores para gráfica de ingresos vs. Egresos   */
    const dataGrafIngEg: any = {
      labels: this.grafLabelMesHabilit,
      series: [ this.grafSeriesMesIngresos, this.grafSeriesMesEgresos ]
    };
    const optionsGrafIngEg: any = {
      lineSmooth: Chartist.Interpolation.cardinal({
          tension: 0
      }),
      low: this.grafLow,
      high: this.grafHigh, 
      chartPadding: { top: 0, right: 0, bottom: 0, left: 0},
    }

    var GRAFingresosVSegresos = new Chartist.Line('#ingresosVSegresos', dataGrafIngEg, optionsGrafIngEg);

    this.startAnimationForLineChart(GRAFingresosVSegresos);  
  }
//**** genera la gráfica de saldo final mensual */
  genGrafSaldosMes(){
    var GrafSaldosFinales=[]; var saldoMesAnterior:number; var SaldoFinalMesAnt:number=0;
  /**** Calcula los saldos basado en la información alojada en GLOBAL */
    for(var i=0;i<this.numMesActual;i++){
      if(i==0) GrafSaldosFinales[i] = (Global.saldoInicialMes[i] + Global.totalIngresosMes[i] 
                              - Global.totalEgresosMes[i])/this.factorGraficas;
      else{//Meses de febrero en adelante
        GrafSaldosFinales[i] = (Global.saldoInicialMes[i] + Global.totalIngresosMes[i] 
                              - Global.totalEgresosMes[i])/this.factorGraficas;
        if(Global.saldoInicialMes[i]==0) GrafSaldosFinales[i] += saldoMesAnterior;
      }
      saldoMesAnterior = GrafSaldosFinales[i]; 
    }
  /**** Cálcula el mínimo y el máximo del rango */
    var grafLowSaldo = GrafSaldosFinales[0]; var grafHighSaldo= GrafSaldosFinales[0];
    for(var i=0; i<GrafSaldosFinales.length; i++){
      if(grafLowSaldo>GrafSaldosFinales[i]) grafLowSaldo=GrafSaldosFinales[i];
      if(grafHighSaldo<GrafSaldosFinales[i]) grafHighSaldo=GrafSaldosFinales[i];
    }
    grafLowSaldo=grafLowSaldo-this.grafExcLowHigh;
    grafHighSaldo=grafHighSaldo+this.grafExcLowHigh;
  /**** Define valores y grafica */
    const dataGrafSaldos: any = {
        labels: this.grafLabelMesHabilit,
        series: [ GrafSaldosFinales ]
    };

    const optionsGrafSaldos: any = {
        lineSmooth: Chartist.Interpolation.cardinal({
            tension: 0
        }),
        low: grafLowSaldo,
        high: grafHighSaldo, 
        chartPadding: { top: 0, right: 0, bottom: 0, left: 0}
    }

    var GrafSaldosMes = new Chartist.Line('#GrafSaldosMes', dataGrafSaldos, optionsGrafSaldos);

  // start animation for the Completed Tasks Chart - Line Chart
    this.startAnimationForLineChart(GrafSaldosMes);
  }


//*************** métodos utilizandos en las gráficas */

startAnimationForLineChart(chart){
  let seq: any, delays: any, durations: any;
  seq = 0;
  delays = 80;
  durations = 500;

  chart.on('draw', function(data) {
    if(data.type === 'line' || data.type === 'area') {
      data.element.animate({
        d: {
          begin: 600,
          dur: 700,
          from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
          to: data.path.clone().stringify(),
          easing: Chartist.Svg.Easing.easeOutQuint
        }
      });
    } else if(data.type === 'point') {
          seq++;
          data.element.animate({
            opacity: {
              begin: seq * delays,
              dur: durations,
              from: 0,
              to: 1,
              easing: 'ease'
            }
          });
      }
  });

  seq = 0;
};
startAnimationForBarChart(chart){
  let seq2: any, delays2: any, durations2: any;

  seq2 = 0;
  delays2 = 80;
  durations2 = 500;
  chart.on('draw', function(data) {
    if(data.type === 'bar'){
        seq2++;
        data.element.animate({
          opacity: {
            begin: seq2 * delays2,
            dur: durations2,
            from: 0,
            to: 1,
            easing: 'ease'
          }
        });
    }
  });

  seq2 = 0;
};



}//fin de la clase