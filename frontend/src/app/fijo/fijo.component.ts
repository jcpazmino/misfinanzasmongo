import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import swal from 'sweetalert';

import { SubgrupoService } from '../services/subgrupo.service';
import { GrupoService } from '../services/grupo.service';
import { FijoService } from '../services/fijo.service';
import { MovimientoService } from '../services/movimiento.service';
import { Grupo } from '../models/grupo';
import { Subgrupo} from '../models/subgrupo';
import { Fijo } from '../models/fijo';
import { Movimiento } from '../models/movimiento';
import { Global } from  '../services/global';

@Component({
  selector: 'app-fijo',
  templateUrl: './fijo.component.html',
  styleUrls: ['./fijo.component.scss'],
  providers: [SubgrupoService, FijoService, MovimientoService, GrupoService]
})

export class FijoComponent implements OnInit {
/*** recoge la información digitada en el formulario */
  @Input() selectedSubgrupo: string;
  @Input() selectedConcepto: string;
  @Input() selectedDescripcion: string;
  @Input() selectedValue: number; 

  fechaActual: string;
  nombreMeses: any = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
  mesActual: string;
  operacion: string = "Adicionar";
  id_fijo : string;
  grupoConcepto : string = "Egresos";
  totalIngresosMes: number;
  totalEgresosMes: number;

  public subgrupos: Subgrupo[];//utilizado para crear la lisya de subgrupos
  public fijos: Fijo[];//cargar movimientos fijos desde la base de datos
  public fijo: Fijo;
  public movimiento: Movimiento;//utilizado para convertir un movimiento fijo a movimiento 
  public arrConceptos: string[]; //utilizado para crear la lista de conceptos
  public url:string;

  constructor(
    private _GrupoService : GrupoService,
    private _SubgrupoService : SubgrupoService, 
    private _FijoService: FijoService,
    private _MovimientoService: MovimientoService,
    private _route: ActivatedRoute,
    private _router: Router
  ) {

    
  }

  ngOnInit() {
  //*** selecciona el primer y último día del mes actual */
  var date = new Date(), y = date.getFullYear(), m = date.getMonth(); 

//********** Formatea la fecha en español */
  this.mesActual = this.nombreMeses[m];
  this.fechaActual = this.mesActual +' de '+ y;
//******** */
    this.fijo  = new Fijo ('', '', { grupo : '', subgrupo : '', concepto : ''}, '', null);
    this.movimiento  = new Movimiento ('', '', { grupo : '', subgrupo : '', concepto : ''}, '', '', null);
    this.url= Global.url; 

    this.cargaValoresIniciales(); //carga valores para la captura de documentos
    this.cargaFijos(); //carga la info de los movimientos fijos desde el backend
  
  }//fin ngOnInit

  //********* carga valores iniciales desde el backend */
cargaValoresIniciales(){
  this._SubgrupoService.getSubgrupos().subscribe(
    response => {
      if(response.subgrupos){
      //*** deposita la información traida de la base de datos */
        this.subgrupos = response.subgrupos;
      //*** ordenar las descripciones ascendentemente */
        this.subgrupos.sort((a,b) => a.descripcion.localeCompare(b.descripcion));
      //*** recoge y ordena los conceptos del primer subgrupo */
        this.arrConceptos = this.subgrupos[0].conceptos;
        this.arrConceptos.sort((a,b) => a.localeCompare(b));
      //********* Inicializa variables */
        this.selectedSubgrupo   = this.subgrupos[0].descripcion;
        this.selectedConcepto   = this.arrConceptos[0];
        this.selectedValue      = null;
        this.operacion          = "Adicionar";
        this.selectedDescripcion = '';
      //**** carga el grupo (ingresos o egresos) al que pertenece el subgrupo  */
        this.selgrupo(this.subgrupos[0]._id);
      }
    },
    error => {
      console.log(error);
    }
  );//****** termina de cargar la información de los subgrupos */    
}
//**** carga el grupo al cual pertenece el subgrupo seleccionado */
selgrupo(idSubgrupo){
  this._GrupoService.searchGrupo(idSubgrupo).subscribe(
    response => {
      this.grupoConcepto = response.grupos[0].descripcion; 
    },
    error => {
      console.log(error);
    }
  ); 
}
//********* carga la info de los movimientos fijos desde el backend */
cargaFijos(){ 
  this.totalIngresosMes=0;this.totalEgresosMes=0;
   
  this._FijoService.getFijos().subscribe(
    response => {
      if(response.fijos){
        this.fijos = response.fijos;
        for(var i=0; i<this.fijos.length; i++){
          if(this.fijos[i].obj_concepto.grupo=='Ingresos') 
            this.totalIngresosMes +=  this.fijos[i].valor;
          else
            this.totalEgresosMes +=  this.fijos[i].valor;
        } 
      }
    },
    error => {
      console.log(error);
    }
  );  //****** termina de cargar la información */  
}
/*** Llama el método a ejecutar dependiendo del valor de la operación */
llamaMetodo(){
  if(this.operacion=='Adicionar') this.saveMovFijo();
  else this.saveEditFijo();
}
/*** método para modificar el select de conceptos, dependiendo del subgrupo seleccionado */
  selecConceptos(){
    var i:number;
    for(i=0; i<this.subgrupos.length; i++)
      if(this.selectedSubgrupo==this.subgrupos[i].descripcion){
        this.selgrupo(this.subgrupos[i]._id);
        break;
      }
    this.arrConceptos = this.subgrupos[i].conceptos;  
    this.arrConceptos.sort((a,b) => a.localeCompare(b));  
    this.selectedConcepto   = this.arrConceptos[0];
  }//fin del método selecConceptos

/*** método para mostrar la información qe se va a editar */
  editFijo(id){
    this.id_fijo = id;
    this.operacion = "Editar";
    this._FijoService.getFijo(id).subscribe(
      response => {
        if(response.fijo){
          this.grupoConcepto      = response.fijo.obj_concepto.grupo;
          this.selectedSubgrupo   = response.fijo.obj_concepto.subgrupo;
          this.selecConceptos();
          this.selectedConcepto   = response.fijo.obj_concepto.concepto;
          this.selectedDescripcion = response.fijo.detalle;
          this.selectedValue       = response.fijo.valor;
        }
      },
      error => {
        console.log(error);
      }
    );    
  }
/*** método para guardar los movimientos fijos */
saveMovFijo(){
  /*** carga datos al objeto */
    this.fijo.userid = 'misfinanzas.jcpazmino';
    this.fijo.obj_concepto = { grupo : this.grupoConcepto, subgrupo : this.selectedSubgrupo, concepto : this.selectedConcepto};
    this.fijo.detalle = this.selectedDescripcion; 
    this.fijo.valor = this.selectedValue;      
  /*** crear el documento en la base de datos */  
    this._FijoService.create(this.fijo).subscribe(
      response => {
      /**** mensaje  */
        swal(
          'Movimiento creado',
          'en Movimientos Fijos',
          "success"
        );
        this.cargaValoresIniciales();
        this.cargaFijos(); //carga la info de los movimientos fijos desde el backend
      },
      error => {
        console.log(error);
      }
    );  
}  
/*** método para guardar la información editada */
  saveEditFijo(){
  /*** carga datos al objeto */
    this.fijo.userid = 'misfinanzas.jcpazmino';
    this.fijo.obj_concepto = { grupo : this.grupoConcepto, subgrupo : this.selectedSubgrupo, concepto : this.selectedConcepto};
    this.fijo.detalle = this.selectedDescripcion; 
    this.fijo.valor = this.selectedValue;      
  /*** crear el documento en la base de datos */  
    this._FijoService.update(this.id_fijo, this.fijo).subscribe(
      response => {
        /**** mensaje  */
        swal(
          'Movimiento actualizado',
          'en Movimientos Fijos',
          "success"
        );          
        this.cargaValoresIniciales();
        this.cargaFijos(); //carga la info de los movimientos fijos desde el backend
      },
      error => {
        /**** mensaje  */
        swal(
          'Error al actualizar',
          'en Movimientos Fijos',
          "error"
        ); 
      }
    );  
  }
/*** método para borrar el registro seleccionado */
  delFijo(id){
    swal({
      title: "Alerta de borrado!",
      text: "La información será borrada permanentemente!",
      icon: "warning",
      buttons: ["Cancelar", "Borrar"],
      dangerMode: true,
    })
    .then((willDelete) => {
      if (willDelete) {
        this._FijoService.delete(id).subscribe(
          response => {
            /**** mensaje  */
            swal(
              'Movimiento borrado',
              'de Movimientos Fijos',
              "success"
            );  
            this.cargaFijos(); //carga la info de los movimientos fijos desde el backend
          },
          error => {
            /**** mensaje  */
            swal(
              'Error al borrar',
              'en Movimientos Fijos',
              "error"
            );
        });        
      } 
    });        
  }
/*** método para convertir un movimiento fijo en un movimiento del mes */
  actFijo(id){
    var date = new Date(), y = date.getFullYear(), m = date.getMonth()+1, d= date.getDate();
    var fecha = d+'-'+m+'-'+y;
    this._FijoService.getFijo(id).subscribe(
      response => {
      /*** se encontro el documento en fijo y se cargará al documento a crear */   
        if(response.fijo){
        /*** cargar la información al objeto */
          this.movimiento.userid = response.fijo.userid;
          this.movimiento.obj_concepto.grupo   = response.fijo.obj_concepto.grupo;
          this.movimiento.obj_concepto.subgrupo   = response.fijo.obj_concepto.subgrupo;
          this.movimiento.obj_concepto.concepto   = response.fijo.obj_concepto.concepto;
          this.movimiento.fecha = fecha;
          this.movimiento.detalle = response.fijo.detalle;
          this.movimiento.valor   = response.fijo.valor;
        /*** crear el documento en la base de datos */  
          this._MovimientoService.create(this.movimiento).subscribe(
            response => {
              /**** mensaje  */
              swal(
                'Movimiento activado',
                'en Movimientos',
                "success"
              );        
            },
            error => {
              console.log(error);
            }
          );         
        }        
      },
      error => {
        console.log(error);
      }
    );         
  }//fin del método actFijo
}

