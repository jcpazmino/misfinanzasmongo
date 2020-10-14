import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import * as bcrypt from 'bcryptjs';

import { UsuarioService } from '../services/usuario.service';
import { Usuario } from '../models/usuario';
import { Global } from '../services/global';

const saltRounds = 10;

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
  providers: [UsuarioService]
})
export class UserProfileComponent implements OnInit {
  /*** recoge la información digitada en el formulario */
  @Input() frm_nombres: string;
  @Input() frm_apellidos: string;
  @Input() frm_telefono: string;
  @Input() frm_acercaMi: string;
  @Input() frm_clave: string;
  @Input() frm_conClave: string;
  @Input() frm_urlFoto: string;

  UsuarioId: string;
  public usuario: Usuario;
  titulo: string="Actualizar clave de usuario";
  titulo1: string="Actualizar datos básicos del usuario";
  titulo2: string="Actualizar imagen de usuario";
  claveAnterior:string;
  parametrosClave: string = "Debe digitar: entre 6 y 20 caracteres, contener al menos: un número, una letra mayúscula y una minúscula";

  srcResult:string;
  files: Array<File>;

  constructor(
    private _UsuarioService: UsuarioService,
    private _route: ActivatedRoute,
    private _router: Router
  ) { }

  ngOnInit() {
    this.UsuarioId = "5f651d551e6d9a2cf0772014";//temporal, luego se debe obtener cuando se haga el login
    this.usuario = new Usuario('', '', '', '', '', '', '', '', '', '', null);

    this.getUsuarioId(this.UsuarioId);
  }

  //**** carga la información del usuario */
  getUsuarioId(usuarioId) {
    this._UsuarioService.getUsuarioId(usuarioId).subscribe(
      response => {
        if (response.usuario) {
          //console.log(response.usuario)
          this.usuario = response.usuario;
          this.frm_nombres = response.usuario.nombres;
          this.frm_apellidos = response.usuario.apellidos;
          this.frm_telefono = response.usuario.telefono;
          this.frm_acercaMi = response.usuario.acercaMi;
          this.claveAnterior = response.usuario.clave;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  actDatosBasicos() {
    var flag_actualizar:boolean= false;
    if(this.usuario.nombres!=this.frm_nombres) flag_actualizar=true;
    else if(this.usuario.apellidos!=this.frm_apellidos) flag_actualizar=true;
    else if(this.usuario.telefono!=this.frm_telefono) flag_actualizar=true;
    else if(this.usuario.acercaMi!=this.frm_acercaMi) flag_actualizar=true;
    if(flag_actualizar){
      this.usuario.nombres=this.frm_nombres;
      this.usuario.apellidos=this.frm_apellidos;
      this.usuario.telefono=this.frm_telefono;
      this.usuario.acercaMi=this.frm_acercaMi;
      console.log(this.usuario)

      this._UsuarioService. actualizar(this.UsuarioId, this.usuario).subscribe(
        response => {
          swal({
            title: this.titulo1,
            text: response.message,
            icon: response.status
          });
        },
        error => {
          swal({
            title: this.titulo1,
            text: error.error.message,
            icon: error.error.status
          });
        }
      )
    }

  }
// patronValidacion:  verificar una contraseña entre 6 y 20 caracteres que contengan al menos un dígito numérico , 
//                    una letra mayúscula y una minúscula
  actClave() {
    var flag_actualizar:boolean= false;
    var patronValidacion=  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
//*********** comparar la clave anterior y la clave actual a ver si son la misma ***********/
  /*   
    const resultPassword = bcrypt.compareSync(claveEnc, this.claveAnterior);
    console.log(this.claveAnterior+', '+claveEnc);
  */
  //******* validación de clave */
  
    if(this.frm_clave!=undefined && this.frm_conClave==this.frm_clave ){
      if(this.frm_clave.match(patronValidacion)) flag_actualizar=true;
      else
        swal({
          title: this.titulo,
          text: "La clave no cumple con los requisitos",
          icon: "error"
        });        
    }else{
      if(this.frm_clave==undefined )
      swal({
        title: this.titulo,
        text: this.parametrosClave,
        icon: "error"
      });
      else if(this.frm_conClave!=this.frm_clave )
        swal({
          title: this.titulo,
          text: "La clave y su confirmación deben ser iguales",
          icon: "error"
        });
    }  
  //*******actualizar clave en BD */ 
    if(flag_actualizar){
      var claveEnc = bcrypt.hashSync(this.frm_clave, saltRounds);// encriptar la clave
      this._UsuarioService. actualizarclave(this.UsuarioId, claveEnc).subscribe(
        response => {
          swal({
            title: this.titulo,
            text: response.message,
            icon: response.status
          });
          this.frm_conClave=this.frm_clave='';
        },
        error => {
          swal({
            title: this.titulo,
            text: error.error.message,
            icon: error.error.status
          });
        }
      )
    }     
  }
  onFileSelected(event){
    this.files = event.target.files; 
    //console.log(this.files[0].name)
  }
  onSubmit(){
    let formData = new FormData();
    formData.append("uploads[]", this.files[0], this.files[0].name);
    
    this._UsuarioService.subirfoto(this.UsuarioId, formData).subscribe(
      response => {
        swal({
          title: this.titulo2,
          text: response.message,
          icon: response.status
        });
      },
      error => {
        swal({
          title: this.titulo2,
          text: error.error.message,
          icon: error.error.status
        });
      }
    )
  } 
}
