import { Component, AfterViewInit, ViewChild, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';

import { ControllerComponent } from '../../../../core/controller/controller.component';




/******************IMPORTAR SERVICIOS*************** */


import { PersonaService } from '../../service/persona.service';
import { TipoDocumentoService } from '../../service/tipo-documento.service';
import { TipoPersonaService } from '../../service/tipo-persona.service';

declare var $: any;
@Component({
        selector: 'form-new-persona',
        templateUrl: '../../view/persona/form-new-persona.component.html',
        providers: [PersonaService, TipoDocumentoService, TipoPersonaService]

})

export class FormNewPersonaComponent extends ControllerComponent implements AfterViewInit, OnInit {

        tiposDocumento: any[];
        tiposPersona: any[];
        tipoDocumentoSelected: any;
        tipoPersonaSelected: any;

        idPersonaSelected: string;
        nombresSelected: string=null;
        apellidoPaternoSelected: string=null;
        apellidoMaternoSelected: string=null;
        numeroDocumentoSelected: string=null;
        direccionSelected: string=null;
        telefonoSelected: string=null;
        correoSelected: string=null;
        generoSelected: string = "M";
        generoVisible: boolean = false;
        isClienteSelected:boolean=false;
        isProveedorSelected:boolean=false;

        tituloPanel:string="Registro Personas";
        band:number = 0;
        checkClienteActivado:boolean=true;
        checkProveedorActivado:boolean=true;

        @Output() personaRegistrada = new EventEmitter();
        isModal:boolean=false;

        constructor(
                public http: Http,
                public router: Router,
                public personaService: PersonaService,
                public tipoPersonaService: TipoPersonaService,
                public tipoDocumentoService: TipoDocumentoService
        ) {
                super(router);

        }

        ngOnInit() {
                this.limpiarCampos();
                this.checkClienteActivado=true;
                this.checkProveedorActivado=true;

                this.tiposDocumento = JSON.parse(localStorage.getItem("lista_tipos_documento"));
                this.tiposPersona = JSON.parse(localStorage.getItem("lista_tipos_persona"));

                if(this.tiposDocumento!=null){
                        if(this.tiposDocumento.length>0){
                                this.tipoDocumentoSelected=this.tiposDocumento[0];
                        }
                }

                if(this.tiposPersona!=null){
                        if(this.tiposPersona.length>0){
                                this.tipoPersonaSelected=this.tiposPersona[0];
                        }
                }
                
                this.generoSelected='M';
        
        }

        ngAfterViewInit() {
                 if (this.verificarTokenRpta(this.rutasMantenedores.FORM_PERSONA)) {
                         /*this.obtenerTiposDocumento();
                         this.obtenerTiposPersona();*/
                         $("#botonRegistrarPersona").focus(); 
                       }
                    
                
        }


        obtenerTiposDocumento() {

                this.tipoDocumentoService.getAll()
                        .subscribe(
                        data => {//this.vistas = data;

                                this.tiposDocumento = data;
                        },
                        error => this.msj = <any>error);
        }


        obtenerTiposPersona() {

                this.tipoPersonaService.getAll()
                        .subscribe(
                        data => {//this.vistas = data;

                                this.tiposPersona = data;
                        },
                        error => this.msj = <any>error);
        }

        buscarSunat(){
                this.completado=true;
                this.personaService.buscarSunat(this.numeroDocumentoSelected)
                .subscribe(
                data => {
                        this.print(data);
                        if(data!=null){
                                this.nombresSelected=data.razon_social;
                                this.direccionSelected=data.direccion;
                                this.numeroDocumentoSelected=data.ruc;

                                this.validarExistePersona();
                                
                        }else{
                                this.mensajeAdvertencia("DATOS NO ENCONTRADOS, INTENTA NUEVAMENTE");
                        } 
                        this.completado=false;
                },
                error => {
                        this.completado=false;
                        this.msj = <any>error;
                }
                );
        }



        buscarReniec(){
                this.completado=true;
                this.personaService.buscarReniec(this.numeroDocumentoSelected)
                .subscribe(
                data => {
                        this.print(data);
                        if(data.nombres!=""){
                                this.nombresSelected=data.nombres;
                                this.apellidoPaternoSelected=data.apellido_paterno;
                                this.apellidoMaternoSelected=data.apellido_materno;
                                this.direccionSelected=data.direccion;
                                this.validarExistePersona();
                                
                        }else{
                                this.mensajeAdvertencia("DATOS NO ENCONTRADOS, INTENTA NUEVAMENTE");
                        } 
                        this.completado=false;
                },
                error => {
                        this.completado=false;
                        this.msj = <any>error;
                }
                );
        }

        



        buscarJNE(){
                this.completado=true;
                this.personaService.buscarJNE(this.numeroDocumentoSelected)
                .subscribe(
                data => {
                        this.print(data);
                        if(data!=null){
                                this.nombresSelected=data.nombres;
                                this.apellidoPaternoSelected=data.apellido_paterno;
                                this.apellidoMaternoSelected=data.apellido_materno;
                                this.direccionSelected="";
                                this.validarExistePersona();
                                
                        }else{
                                this.mensajeAdvertencia("DATOS NO ENCONTRADOS, INTENTA NUEVAMENTE");
                        } 
                        this.completado=false;
                },
                error => {
                        this.completado=false;
                        this.msj = <any>error;
                }
                );
        }

        limpiar() {
                this.limpiarCampos();
        }

        mostrarGenero() {
                let opt = this.tipoPersonaSelected.nombre;
                this.print("opt: "+opt);

                switch (opt) {
                        case 'PERSONA NATURAL':
                                this.generoVisible = false;
                                this.generoSelected=null
                                break;
                        case 'PERSONA JURIDICA':
                                this.generoVisible = false;
                                this.generoSelected=null
                                break;
                        case 'OTRO':
                                this.generoVisible = true;
                                this.generoSelected=null
                                
                                break;
                }




        }

        setBeanEditar(pro) {
                if (this.tienePermisoPrintMsj(this.rutas.FORM_PERSONA, this.rutas.PANEL_EDITAR)) {
                        //this.beanSelected = pro;
                        this.idPersonaSelected=pro.id_persona;
                        this.nombresSelected = pro.nombres;
                        this.apellidoPaternoSelected = pro.apellido_paterno;
                        this.apellidoMaternoSelected = pro.apellido_materno;
                        this.numeroDocumentoSelected = pro.numero_documento;
                        this.direccionSelected = pro.direccion;
                        this.telefonoSelected = pro.telefono;
                        this.correoSelected = pro.correo;

                        this.tipoDocumentoSelected = this.obtenerTipoDocumentoActual(pro.nombre_tipo_documento);
                        this.tipoPersonaSelected = this.obtenerTipoPersonactual(pro.nombre_tipo_persona);

                }
        }
        
         
        obtenerTipoDocumentoActual(nombreTipo: string) {
                let obj = null;
                let i;
                for (i = 0; i < this.tiposDocumento.length; i++) {
                        //this.print("this.tipos_producto[i].nombre"+this.tipos_producto[i].nombre+" , nombreTipo: " +nombreTipo);
                        if (this.tiposDocumento[i].nombre == nombreTipo) {
                                obj = this.tiposDocumento[i];
                                break;
                        }
                }
                return obj;
        }

        obtenerTipoPersonactual(nombreTipo: string) {
                let obj = null;
                let i;
                for (i = 0; i < this.tiposPersona.length; i++) {
                        //this.print("this.tipos_producto[i].nombre"+this.tipos_producto[i].nombre+" , nombreTipo: " +nombreTipo);
                        if (this.tiposPersona[i].nombre == nombreTipo) {
                                obj = this.tiposPersona[i];
                                break;
                        }
                }
                return obj;
        }



        guardar(){
                if(this.idPersonaSelected==null){
                        this.registrar();
                }else{
                        this.editar();
                }
        }


        registrar() {
               
                
                if(this.band==0){
                        this.band++;
                        this.print("band");
                        this.print(this.band);
                        let parbusqueda = JSON.stringify({
                                numero_documento:this.numeroDocumentoSelected == null ?'':this.numeroDocumentoSelected, 
                                nombres:this.nombresSelected == null ? '':this.nombresSelected
                        });
                        this.print("datos de busqueda persona");
                        this.print(parbusqueda);
                       
                        this.personaService.buscarPaginacion(1,10,10, parbusqueda).subscribe(
                        data =>{
                                let existeDocumento = data;
                                
                                this.print("data");
                                this.print(data);
                                let vali=false;
                                if(existeDocumento!=null){
                                        this.mensajeInCorrecto("PERSONA REGISTRADA");
                                }else{                   
                                        let vali=false;
                                        if(this.tipoPersonaSelected.nombre == 'OTRO'){
                                                this.numeroDocumentoSelected = null;
                                                
                                                vali=true;
                                        }else if(this.tipoDocumentoSelected!=null){
                                                let tam= this.numeroDocumentoSelected.length;
                                                        this.print("tam caracteres: "+tam);
                                                        if(this.tipoDocumentoSelected.nombre=='DNI'){
                                                                vali=tam==8?true:false;
                                                        }else if(this.tipoDocumentoSelected.nombre=='RUC'){
                                                                        vali=tam==11?true:false;
                                                                 
                                                        } 
        
                                              }else{
                                                        if(this.numeroDocumentoSelected ==null){
                                               
                                                        }else{
                                                                
                                                        let tam= this.numeroDocumentoSelected.length;
                                                        this.print("tam caracteres: "+tam);
                                                        if(this.tipoDocumentoSelected.nombre=='DNI'){
                                                                vali=tam==8?true:false;
                                                        }else   if(this.tipoDocumentoSelected.nombre=='RUC'){
                                                                        vali=tam==11?true:false;
                                                                
                                                        }      
                                                        
                                        }
                                                
        
                                }
        
                                        if (this.tienePermisoPrintMsj(this.rutas.FORM_PERSONA, this.rutas.BUTTON_REGISTRAR)) {
        
        
                                                if(vali){
                                                        let parametros = JSON.stringify({
                                                                nombres:this.nombresSelected == null ? null: this.nombresSelected.toUpperCase(),
                                                                apellido_paterno: this.apellidoPaternoSelected == null ? null:this.apellidoPaternoSelected.toUpperCase(),
                                                                apellido_materno: this.apellidoMaternoSelected == null ? null:this.apellidoMaternoSelected.toUpperCase(),
                                                                numero_documento: this.numeroDocumentoSelected == null ? null: this.numeroDocumentoSelected,
                                                                direccion: this.direccionSelected,
                                                                telefono: this.telefonoSelected,
                                                                correo: this.correoSelected,
                                                                id_tipo_persona: this.tipoPersonaSelected.id_tipo_persona,
                                                                id_tipo_documento: this.tipoDocumentoSelected.id_tipo_documento,
                                                                genero: this.generoSelected,
                                                                is_cliente:this.isClienteSelected,
                                                                is_proveedor:this.isProveedorSelected
                                                        });
                                                        this.personaService.registrar(parametros)
                                                                .subscribe(
                                                                data => {
                                                                        let rpta = data.rpta;
                                                                        this.print("rpta: " + rpta);
                                                                        if (rpta != null) {
                                                                                if (rpta == 1) {
                                                                                        this.mensajeCorrecto("PERSONA REGISTRADA");
        
                                                                                        this.limpiarCampos();
                                                                                        if(this.isModal){
                                                                                                this.personaRegistrada.emit({ bean: data });
                                                                                        }
                                                                                } else {
                                                                                        this.mensajeInCorrecto("PERSONA NO REGISTRADA");
                                                                                }
                                                                        }
                                                                
                                
                                                                },
                                                                error => this.msj = <any>error
                                                                );
                                                }
                                                else{
                                                        this.mensajeInCorrecto("CANTIDAD ERRONEA EN NRO. DOCUMENTO");
                                                }
        
                                        }
        
        
        
                  }
                        
                        });
        
                       
                }else{
                        
                        this.print(this.band);
                }
                
              
        }


        editar() {

                if (this.tienePermisoPrintMsj(this.rutas.FORM_PERSONA, this.rutas.BUTTON_ACTUALIZAR)) {
                        let parametros = JSON.stringify({
                                nombres: this.nombresSelected,
                                apellido_paterno: this.apellidoPaternoSelected,
                                apellido_materno: this.apellidoMaternoSelected,
                                numero_documento: this.numeroDocumentoSelected,
                                direccion: this.direccionSelected,
                                telefono: this.telefonoSelected,
                                correo: this.correoSelected,
                                id_tipo_persona: this.tipoPersonaSelected.id_tipo_persona,
                                id_tipo_documento: this.tipoDocumentoSelected.id_tipo_documento
                        });

                        this.print("parametros: " + parametros);
                        this.personaService.editar(parametros, this.idPersonaSelected)
                                .subscribe(
                                data => {
                                        let rpta = data.rpta;
                                        this.print("rpta: " + rpta);
                                        if (rpta != null) {
                                                if (rpta == 1) {
                                                        this.mensajeCorrecto("PERSONA MODIFICADA");
                                                } else {
                                                        this.mensajeInCorrecto("PERSONA NO MOFICADA");
                                                }

                                        }

       
                                },
                                error => this.msj = <any>error
                                );
                }

        }

        limpiarCampos() {
                this.idPersonaSelected=null;
                this.nombresSelected = null;
                this.apellidoPaternoSelected = null;
                this.apellidoMaternoSelected = null;
                this.numeroDocumentoSelected = null;
                this.direccionSelected = null;
                this.telefonoSelected = null;
                this.correoSelected = null;
               // this.tipoDocumentoSelected = null;
                this.tipoPersonaSelected = null;
                //this.isClienteSelected=false;
                //this.isProveedorSelected=false;
                this.tituloPanel="Registro Personas";
                this.band = 0;
        }


        

        validarExistePersona(){
                
                let parametros = JSON.stringify({
                                numero_documento: this.numeroDocumentoSelected,
                });
                


                this.personaService.buscarPaginacion(1,10,10, parametros)
                        .subscribe(
                        data => {
                                let personas = data;
                                this.print("personas: ");
                                this.print(personas);
                                if (!this.isArrayVacio(personas)) {
                                        this.mensajeInCorrectoSinCerrar("LA PERSONA YA ESTA REGISTRADO");
                                        this.cerrarModal("modalRegistroCliente");
                                }
                        },
                        error => this.msj = <any>error);

        }

}