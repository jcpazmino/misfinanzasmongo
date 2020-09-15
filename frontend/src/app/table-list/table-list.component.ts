import { Component, OnInit, Input } from '@angular/core';
import swal from 'sweetalert';


import { MovimientoService } from '../services/movimiento.service';
import { GrupoService } from '../services/grupo.service';
import { SubgrupoService } from '../services/subgrupo.service';

import { Movimiento } from '../models/movimiento';
import { Grupo } from '../models/grupo';
import { Subgrupo} from '../models/subgrupo';

@Component({
  selector: 'app-table-list',
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.css'],
  providers: [SubgrupoService, MovimientoService, GrupoService]
})
export class TableListComponent implements OnInit {
  /*** recoge la información digitada en el formulario */
  @Input() selectedSubgrupo: string;
  @Input() selectedConcepto: string;
  @Input() selectedDescripcion: string;  
  @Input() selectedFecha: Date;
  @Input() selectedValue: number;

  minDate: Date;
  maxDate: Date;
  fechaActual: string;
  fechaMovimientos: string;
  nombreMeses: any = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
  mesActual: string;
  operacion: string = "Adicionar";
  grupoConcepto : string = "Egresos";
  id_movimiento : string;
  totalIngresosMes: number;
  totalEgresosMes: number;


  public subgrupos: Subgrupo[];
  public movimiento: Movimiento;
  public movimientos: Movimiento[];  
  public arrSubgrupos: string[];
  public arrConceptos: string[];


  constructor(
    private _GrupoService : GrupoService,
    private _SubgrupoService : SubgrupoService,
    private _MovimientoService: MovimientoService

  ) {
  //*** selecciona el primer y último día del mes actual */
    var date = new Date(), y = date.getFullYear(), m = date.getMonth(); 
    var mes=m+1;
    this.minDate = new Date(y, m, 1); 
    this.maxDate = new Date(y, m + 1, 0);    

  //********** Formatea la fecha en español */
    this.mesActual = this.nombreMeses[m];
    this.fechaActual = this.mesActual +' de '+ y;
    this.fechaMovimientos = mes+'-'+y;
    
  }

  ngOnInit() { 
    this.movimiento  = new Movimiento ('', '', { grupo : '', subgrupo : '', concepto : ''}, '', '', null);

    this.cargaValoresIniciales(); //carga valores para la captura de documentos   
    this.cargaMovimientos(); //carga la info de los movimientos fijos desde el backend
  }
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
        this.selectedFecha      = new Date();
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
//********* carga la info de los movimientos dada la fecha del mes (Ejemplo: 01-2020) */
  cargaMovimientos(){
    this.totalIngresosMes=0;this.totalEgresosMes=0;
  
    this._MovimientoService.searchMovimiento(this.fechaMovimientos).subscribe(
      response => {
        if(response.movimientos){
          this.movimientos = response.movimientos;
          for(var i=0; i<this.movimientos.length; i++){
            if(this.movimientos[i].obj_concepto.grupo=='Ingresos') 
              this.totalIngresosMes +=  this.movimientos[i].valor;
            else
              this.totalEgresosMes +=  this.movimientos[i].valor;
          }           
        }else{
          console.log(response.message)
        }
      },
      error => { 
        console.log(error); 
      }
    );  
  }//****** termina cargaMovimientos */  
/**** llama el método adecuado dependiendo de la operación que se esté realizando */
  llamaMetodo(){
    if(this.operacion=='Adicionar') this.saveMovimiento();
    else this.saveEditMovimiento();
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
    this.selectedConcepto   = this.arrConceptos[0];
  }//fin del método selecConceptos

/*** método para guardar los movimientos fijos */
  saveMovimiento(){
  /*** carga datos al objeto */
    this.movimiento.userid = 'misfinanzas.jcpazmino';
    this.movimiento.obj_concepto = { grupo : this.grupoConcepto, subgrupo : this.selectedSubgrupo, concepto : this.selectedConcepto};
    this.movimiento.detalle = this.selectedDescripcion; 
    var y = this.selectedFecha.getFullYear(), m = this.selectedFecha.getMonth()+1, d= this.selectedFecha.getDate(); 
    this.movimiento.fecha = d+'-'+m+'-'+y; 
    this.movimiento.valor = this.selectedValue;      
  /*** crear el documento en la base de datos */  
    this._MovimientoService.create(this.movimiento).subscribe(
      response => {
      /**** mensaje  */
        swal(
          'Movimiento creado',
          'en Movimientos',
          "success"
        );
        this.cargaValoresIniciales();
        this.cargaMovimientos(); //carga la info de los movimientos desde el backend
      },
      error => {
        console.log(error);
      }
    );  
  }
/*** método para mostrar la información qe se va a editar */
  editMovimiento(id){
    this.id_movimiento = id; //guarda el id para el momento de actualizar el documento
    this.operacion = "Editar";
    this._MovimientoService.getMovimiento(id).subscribe(
      response => {
        if(response.movimiento){
          this.selectedSubgrupo   = response.movimiento.obj_concepto.subgrupo;
          this.selecConceptos();
          this.selectedConcepto   = response.movimiento.obj_concepto.concepto;
          this.selectedDescripcion = response.movimiento.detalle; 
          var parts =response.movimiento.fecha.split('-');
          this.selectedFecha  = new Date(parts[2], parts[1] - 1, parts[0]);  
          this.selectedValue       = response.movimiento.valor;
        }
      },
      error => {
        console.log(error);
      }
    );    
  } 
  /*** método para guardar la información editada */
  saveEditMovimiento(){
    /*** carga datos al objeto */
    this.movimiento.userid = 'misfinanzas.jcpazmino';
    this.movimiento.obj_concepto = { grupo : this.grupoConcepto, subgrupo : this.selectedSubgrupo, concepto : this.selectedConcepto};
    this.movimiento.detalle = this.selectedDescripcion; 
    this.movimiento.valor = this.selectedValue;     
    var y = this.selectedFecha.getFullYear(), m = this.selectedFecha.getMonth()+1, d= this.selectedFecha.getDate(); 
    this.movimiento.fecha = d+'-'+m+'-'+y;      
  /*** crear el documento en la base de datos */  
    this._MovimientoService.update(this.id_movimiento, this.movimiento).subscribe(
      response => {
        /**** mensaje  */
        swal(
          'Movimiento actualizado',
          'en Movimientos',
          "success"
        );          
        this.cargaValoresIniciales();
        this.cargaMovimientos(); //carga la info de los movimientos fijos desde el backend
      },
      error => {
        /**** mensaje  */
        swal(
          'Error al actualizar',
          'en Movimientos',
          "error"
        ); 
      }
    ); 
  }
/*** método para borrar el registro seleccionado */
delMovimiento(id){
  swal({
    title: "Alerta de borrado!",
    text: "La información será borrada permanentemente!",
    icon: "warning",
    buttons: ["Cancelar", "Borrar"],
    dangerMode: true,
  })
  .then((willDelete) => {
    if (willDelete) {
      this._MovimientoService.delete(id).subscribe(
        response => {
          /**** mensaje  */
          swal(
            'Movimiento borrado',
            'de Movimientos',
            "success"
          );  
          this.cargaMovimientos(); //carga la info de los movimientos desde el backend
        },
        error => {
          /**** mensaje  */
          swal(
            'Error al borrar',
            'en Movimientos',
            "error"
          );
      });        
    } 
  });        
}
}//final de la clase
