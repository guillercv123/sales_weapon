import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';

import { ControllerComponent } from '../../../core/controller/controller.component';




/******************IMPORTAR SERVICIOS*************** */

import { PermisoService } from '../service/Permiso.Service';
import { VistaService } from '../service/Vista.Service';
import { PerfilService } from '../service/Perfil.Service';
import { UsuarioService } from '../service/Usuario.Service';
import { ReportePdfService } from '../../../core/service/reporte-pdf.Service';
import { ReporteExcelService } from '../../../core/service/reporte-excel.Service';


import { Vista } from '../model/Vista';

declare var $: any;
@Component({
        selector: 'form-usuario',
        templateUrl: '../view/form-usuario.component.html',
        providers: [ReportePdfService, ReporteExcelService, VistaService, PermisoService, PerfilService, UsuarioService]

})

export class FormUsuarioComponent extends ControllerComponent implements AfterViewInit {

        /*********VARIABLES PARA MOSTRAR U OCULTAR PANELES******* */
        PanelTransferencia: boolean = false;
        PanelListaDoc: boolean = true;
        /*************** */


        listaDocEncontrados: [any];
        listaDocAux: [any];
        nroDocInicial: string;
        nroDocFinal: string;

        listaPermisos: number[];

        /*************VISTA DEL SISTEMA************/
        //vistas:Vista[];


        /*********CAMPOS SERIES DOCUMENTOS***************** */


        vistas: Vista[];
        componentes: any[];


        unidadEntidades: any[];


        tieneSubSerie: boolean = false;
        textoSubSerie: boolean = false;

        textoSerie: boolean = true;
        tituloSerie: string;
        tituloSubSerie: string;



        unidadSelected: any;

        transferido: boolean = false;


        rpta: boolean = false;




        loginSelected: string;
        loginRefSelected: string;
        listaPerfil: any[];
        listaPerfilRef: any[];
        allSelected: boolean = false;
        usuarioModificar: any;
        loginModificar: any;
        panelReferenciaSelected: boolean = false;
        panelPermisosSelected: boolean = false;
        permisosModificar: any[];
        permisosUsuarioModificar: any[];


        /************CAMBIAR CONTRASEÑA*************/
        usuarioEncontrado: boolean = false;
        panelContrasenia: boolean = false;
        btnContrasenia: boolean = false;
        claveNueva: string;



        modificarRol: boolean = false;
        rolModificar: any;


        @ViewChild('myInput',{static: true})
        archivo: any;

        file: any;

        //*********CREACION DEL NUEVO ROL
        rolNombre: string;
        rolDescripcion: string;
        rolConfigurable: boolean = true;




        /*********DATOS MANTENEDOR USUARIO************/
        panelListaBeanSelected: boolean = true;

        claveSelected: any;
        idUsuarioSelected: any;
        empleadoSelected: any;
        listaUsuarios: any[];
        panelRolesSelected: boolean = false;
        beanSelected: any;
        panelEditarSelected: boolean = false;
        /***OBJETOS DEL FORMULARIO EMPLEADO*****/
        buttonSelectedActivatedEmple: boolean = true;

        /***OBJETOS DEL FORMULARIO ROL*****/
        buttonSelectedActivatedRol: boolean = true;
        rolSelected: any;

        constructor(
                public http: Http,
                public router: Router,
                public permisoService: PermisoService,
                public vistaService: VistaService,
                public perfilService: PerfilService,
                public usuarioService: UsuarioService,
                public reportePdfService: ReportePdfService,
                public reporteExcelService: ReporteExcelService
        ) {

                super(router);

                //this.obtenerUnidadEntidad();

        }


        ngAfterViewInit() {
                if (this.verificarTokenRpta(this.rutasMantenedores.FORM_MODIFICAR_USUARIO)) {
                        this.obtenerVistas();
                        this.obtenerUsuarios();
                }
        }

        onChange(event) {
                this.file = event.srcElement.files;
        }

        subir() {

                let creds = JSON.stringify({ datos: "diego flores" });
                this.usuarioService.guardarFilesMultiple(this.file, creds)
                        .subscribe(
                        data => {
                                /*let rpta=data.rpta;
                                this.print("rpta: "+rpta);
                                if(rpta!=null){
                                        if(rpta==1){
                                                this.mensajeCorrecto("DOCUMENTO REGISTRADO - ARCHIVO ADJUNTADO");
                                        }else{
                                                this.mensajeInCorrecto("ARCHIVO NO ADJUNTADO - DOCUMENTO NO REGISTRADO");
                                        }
                                }*/

                        },
                        error => this.msj = <any>error
                        );
        }




        activarPanelReferencia() {

                if (this.tienePermisoPrintMsj(this.rutasMantenedores.FORM_MODIFICAR_USUARIO, this.rutasMantenedores.BUTTON_PANEL_REFERENCIA)) {
                        if (this.panelReferenciaSelected) {
                                this.panelReferenciaSelected = false;

                        } else {
                                this.panelReferenciaSelected = true;
                                this.abrirModal("modalPerfil");
                        }
                }
        }


        activarPanelPermisos() {
                //if(this.tienePermisoPrintMsj(this.rutas.FORM_MODIFICAR_USUARIO,this.rutas.BUTTON_PANEL_PERMISOS)){
                this.limpiarMensaje();

                if (this.panelPermisosSelected) {
                        this.panelPermisosSelected = false;
                        this.panelRolesSelected = true;
                } else {
                        this.panelPermisosSelected = true;
                        this.panelRolesSelected = false;
                }
                //}

        }


        activarPanelModi() {
                if (this.tienePermisoPrintMsj(this.rutasMantenedores.FORM_MODIFICAR_USUARIO, this.rutasMantenedores.BUTTON_AGREGAR_MODIFICAR)) {
                        this.activarPanelPermisos();
                        this.modificarRol = false;
                        this.limpiarComponentes();

                        let permisos;//=localStorage.getItem("permisos");
                        this.print("/*********PERMISOS ACTUALES A BUSCAR**************/");
                        this.print("usuario modificar:")
                        this.print(this.usuarioModificar)
                        this.permisoService.obtenerPermisosByLogin(this.usuarioModificar)
                                .subscribe(
                                data => {
                                        this.print(data);
                                        this.permisosModificar = data;

                                        this.print("/*********PERMISOS ACTUALES DEL MODIFICADO**************/");

                                        //var r = Object.keys(this.permisosModificar).map(key => this.permisosModificar[key])
                                        this.print(this.permisosModificar);

                                        this.verPermisos(this.permisosModificar);

                                },
                                error => {
                                        this.mensajeAdvertencia("NO TIENE PERMISOS ,PUEDE AGREGARLE NUEVOS!!");
                                        //this.limpiarMensaje();
                                        //this.mensajeAdvertencia("AG!!!!");

                                        //this.print("error:"+JSON.stringify(error)); 

                                }
                                );

                }

        }


        activarPanelModiRol(rol) {


                if (this.tienePermisoPrintMsj(this.rutasMantenedores.FORM_MODIFICAR_USUARIO, this.rutasMantenedores.BUTTON_AGREGAR_MODIFICAR)) {
                        this.activarPanelPermisos();
                        this.rolModificar = rol;
                        this.modificarRol = true;
                        this.limpiarComponentes();

                        let permisos;//=localStorage.getItem("permisos");
                        this.print("/*********PERMISOS ACTUALES A BUSCAR POR ROL**************/");
                        this.print("usuario modificar:")
                        this.print(this.usuarioModificar)
                        this.permisoService.obtenerPermisosByIdUsuarioRol(this.usuarioModificar, this.rolModificar.id_rol)
                                .subscribe(
                                data => {
                                        this.print(data);
                                        if (data != null) {
                                                this.permisosModificar = data.hashPermisos;
                                                this.permisosUsuarioModificar = data.permisos;
                                                this.print("/*********PERMISOS ACTUALES DEL MODIFICADO**************/");

                                                //var r = Object.keys(this.permisosModificar).map(key => this.permisosModificar[key])
                                                this.print(this.permisosModificar);

                                                this.verPermisos(this.permisosModificar);
                                        } else {
                                                this.mensajeAdvertencia("NO TIENE PERMISOS ,PUEDE AGREGARLE NUEVOS!!");
                                        }
                                },
                                error => {
                                        this.mensajeAdvertencia("NO TIENE PERMISOS ,PUEDE AGREGARLE NUEVOS!!");
                                        //this.limpiarMensaje();
                                        //this.mensajeAdvertencia("AG!!!!");

                                        //this.print("error:"+JSON.stringify(error)); 

                                }
                                );

                }

        }






        quitarPerfil(perfil: any) {

                if (this.tienePermisoPrintMsj(this.rutasMantenedores.FORM_MODIFICAR_USUARIO, this.rutasMantenedores.BUTTON_QUITAR_ROL)) {
                        this.print("/*******perfil elegido*******/");
                        this.print(perfil);

                        this.perfilService.eliminarRol(this.usuarioModificar, perfil.id_rol)
                                .subscribe(
                                data => {
                                        let rpta = data;
                                        if (rpta != null) {
                                                if (rpta == 1) {
                                                        this.buscarLoginSegundoPlano();
                                                        this.mensajeCorrecto("ROL ELIMINADO CORRECTAMENTE");
                                                } else {
                                                        this.mensajeInCorrecto("ROL NO ELIMINADO");
                                                }

                                        }
                                },
                                error => this.msj = <any>error);
                }

        }



        agregarRoles() {
                if (this.tienePermisoPrintMsj(this.rutasMantenedores.FORM_MODIFICAR_USUARIO, this.rutasMantenedores.BUTTON_AGREGAR_ROL)) {
                        let permisos = new Array();
                        let rolesNuevos = new Array();
                        let idUsuario = this.usuarioModificar;

                        if (this.listaPerfilRef != null) {
                                let i;
                                for (i = 0; i < this.listaPerfilRef.length; i++) {
                                        if (this.listaPerfilRef[i].selected) {
                                                permisos.push(this.listaPerfilRef[i]);
                                        }
                                }
                        }





                        this.print("/*****ROLES SELECCIONADOS******/");
                        this.print(permisos);
                        if (this.listaPerfil != null) {

                                let i;
                                for (i = 0; i < permisos.length; i++) {
                                        let j;
                                        let enc = false;
                                        for (j = 0; j < this.listaPerfil.length; j++) {
                                                if (this.listaPerfil[j].id_rol == permisos[i].id_rol) {
                                                        enc = true;
                                                }
                                        }

                                        if (!enc) {
                                                rolesNuevos.push(permisos[i]);
                                        }
                                }
                        }

                        this.print("/*****PERMISOS FINALES ROLES SELECCIONADOS******/");

                        this.print("idUsuario:" + idUsuario);
                        if (this.listaPerfil == null) {

                                this.print(permisos);
                                this.registrarPerfil(permisos, idUsuario);
                        } else {
                                this.print(rolesNuevos);
                                this.registrarPerfil(rolesNuevos, idUsuario);

                        }


                }

        }



        registrarPerfil(roles: any, idUsuario: any) {

                if (this.tienePermisoPrintMsj(this.rutasMantenedores.FORM_MODIFICAR_USUARIO, this.rutasMantenedores.BUTTON_BUSCAR)) {

                        let creds = JSON.stringify({ roles: roles, id_usuario: idUsuario });

                        this.perfilService.registrar(creds)
                                .subscribe(
                                data => {
                                        let rpta = data;
                                        if (rpta != null) {
                                                if (rpta == 1) {
                                                        this.buscarLoginSegundoPlano();
                                                        this.mensajeCorrecto("PERFIL AGREGADO CORRECTAMENTE");

                                                } else {
                                                        this.mensajeInCorrecto("ERROR AL AGREGAR PERFIL");
                                                }

                                        }

                                },
                                error => this.msj = <any>error
                                );
                }

        }

        selectAllPerRef() {
                if (this.listaPerfilRef != null) {
                        let i;
                        for (i = 0; i < this.listaPerfilRef.length; i++) {
                                this.listaPerfilRef[i].selected = this.allSelected;
                        }
                }
        }


        cambiarContrasenia() {
                if (this.tienePermisoPrintMsj(this.rutasMantenedores.FORM_MODIFICAR_USUARIO, this.rutasMantenedores.BUTTON_CAMBIAR_CLAVE)) {
                        let creds = JSON.stringify({ clave: this.claveNueva });

                        this.usuarioService.modificarClave(creds, this.usuarioModificar)
                                .subscribe(
                                data => {
                                        let rpta = data;
                                        if (rpta != null) {
                                                if (rpta) {
                                                        this.mensajeCorrecto("ACTUALIZACIÓN DE CLAVE CORRECTA");
                                                        this.panelContrasenia = false;
                                                        this.btnContrasenia = false;

                                                } else {
                                                        this.mensajeInCorrecto("ACTUALIZACIÓN DE CLAVE INCORRECTA");
                                                }

                                        } else {
                                                this.mensajeInCorrecto("ERROR DE CONSULTA");
                                        }
                                        this.print(data);
                                },
                                error => {
                                        let msj = "ERROR: Login - ";
                                        msj += error.statusText;
                                        this.mensajeInCorrecto(msj);
                                }
                                );
                }
                //error =>  this.msj = <any>error);
        }




        buscarLogin(login) {
                this.usuarioEncontrado = false;
                this.limpiarMensaje();
                if (this.tienePermisoPrintMsj(this.rutasMantenedores.FORM_MODIFICAR_USUARIO, this.rutasMantenedores.BUTTON_BUSCAR)) {

                        this.perfilService.obtenerByLogin(login)
                                .subscribe(
                                data => {
                                        //this.print(/*******lista de perfiles******/);
                                        //this.print(data.listaPerfiles);
                                        this.listaPerfil = null;
                                        if (data != null) {
                                                if (data.hasOwnProperty('listaPerfiles')) {
                                                        this.listaPerfil = data.listaPerfiles;

                                                        //this.usuarioModificar = data.usuario.id_usuario;
                                                        //this.print("usuarioModificar");
                                                        //this.print(this.usuarioModificar);
                                                        this.loginModificar = data.usuario.ulogin;

                                                        if (this.listaPerfil.length == 0) {
                                                                this.mensajeAdvertencia("USUARIO NO TIENE PERMISOS -  PUEDE ASIGNARLE PERMISOS !!!!");
                                                                //this.panelContrasenia=false;
                                                                //this.usuarioEncontrado=false; 
                                                        } else {
                                                                //this.panelContrasenia = true;
                                                                this.usuarioEncontrado = true;
                                                                //this.btnContrasenia = false;
                                                                //this.mensajeCorrecto("USUARIO ENCONTRADO :) !!!");
                                                        }
                                                }
                                        } else {
                                                this.mensajeInCorrecto("USUARIO NO ENCONTRADO :( !!!");
                                        }
                                        this.print(data);
                                },
                                error => {
                                        this.panelContrasenia = false;
                                        this.usuarioEncontrado = false;
                                        this.btnContrasenia = false;
                                        this.listaPerfil = null;
                                        let msj = "ERROR: Login - ";
                                        msj += error.statusText;
                                        this.mensajeInCorrecto(msj);
                                }
                                );
                        //error =>  this.msj = <any>error);
                }
        }


        buscarLoginSegundoPlano() {
                this.usuarioEncontrado = false;
                if (this.tienePermisoPrintMsj(this.rutasMantenedores.FORM_MODIFICAR_USUARIO, this.rutasMantenedores.BUTTON_BUSCAR)) {

                        this.perfilService.obtenerByLogin(this.loginSelected)
                                .subscribe(
                                data => {
                                        //this.print(/*******lista de perfiles******/);
                                        //this.print(data.listaPerfiles);
                                        this.listaPerfil = null;
                                        if (data != null) {
                                                if (data.hasOwnProperty('listaPerfiles')) {
                                                        this.listaPerfil = data.listaPerfiles;

                                                        this.usuarioModificar = data.usuario.id_usuario;
                                                        //this.print("usuarioModificar");
                                                        //this.print(this.usuarioModificar);
                                                        this.loginModificar = data.usuario.ulogin;

                                                        if (this.listaPerfil.length == 0) {
                                                                //this.mensajeAdvertencia("USUARIO NO TIENE PERMISOS -  PUEDE ASIGNARLE PERMISOS !!!!");
                                                                //this.panelContrasenia=false;
                                                                //this.usuarioEncontrado=false; 
                                                        } else {
                                                                this.panelContrasenia = true;
                                                                this.usuarioEncontrado = true;
                                                                this.btnContrasenia = false;
                                                                //this.mensajeCorrecto("USUARIO ENCONTRADO :) !!!");  
                                                        }

                                                }
                                        }
                                        this.print(data);
                                },
                                error => {
                                        this.panelContrasenia = false;
                                        this.usuarioEncontrado = false;
                                        this.btnContrasenia = false;
                                        this.listaPerfil = null;
                                        let msj = "ERROR:";
                                        msj += error.statusText;
                                        this.mensajeInCorrecto(msj);
                                }
                                );
                        //error =>  this.msj = <any>error);
                }
        }


        activarPanelClave() {
                if (this.tienePermisoPrintMsj(this.rutasMantenedores.FORM_MODIFICAR_USUARIO, this.rutasMantenedores.PANEL_CAMBIAR_CLAVE)) {
                        if (this.btnContrasenia) {
                                this.btnContrasenia = false;
                        } else {
                                this.btnContrasenia = true;
                        }
                } else {
                        this.btnContrasenia = false;
                }
        }


        buscarRoles() {
                if (this.tienePermisoPrintMsj(this.rutasMantenedores.FORM_MODIFICAR_USUARIO, this.rutasMantenedores.BUTTON_BUSCAR_ROL)) {
                        this.perfilService.obtenerByLogin(this.loginRefSelected)
                                .subscribe(
                                data => {
                                        let res = data;
                                        if (res == null) {
                                                this.mensajeInCorrecto("USUARIO NO TIENE ROLES :( !!!");
                                        } else {
                                                this.listaPerfilRef = res.listaPerfiles;
                                        }
                                        this.print("/*********ROLES REFERENCIA************/");
                                        this.print(this.listaPerfilRef);
                                },
                                error => this.msj = <any>error);
                }
        }




        verPermisos(permisos: any) {

                this.print("/***********PERMISOS ACTUALES*****************/");
                this.print(permisos);

                if (permisos != null) {

                        this.print("tam-permisos: " + permisos.length);
                        let j;
                        for (j = 0; j < this.vistas.length; j++) {
                                let permisoVista = permisos[this.vistas[j].vista];
                                let permisoFijoVista = this.componentes[this.vistas[j].vista];

                                if (permisoVista != null) {
                                        this.print("vista: " + this.vistas[j].vista);

                                        let i;
                                        for (i = 0; i < permisoVista.length; i++) {

                                                let k;
                                                for (k = 0; k < permisoFijoVista.length; k++) {
                                                        //this.componentes[this.vistas[j].vista][k].selected=false;
                                                        this.print("permisoVista: " + permisoVista[i] + " permisoFijoVista: " + permisoFijoVista[k].componente);
                                                        if (permisoVista[i] == permisoFijoVista[k].componente) {

                                                                this.print("son iguales");
                                                                this.print("tienePermisoAntes: " + this.componentes[this.vistas[j].vista][k].selected);
                                                                this.componentes[this.vistas[j].vista][k].selected = true;
                                                                this.print("objeto: ");
                                                                this.print(this.componentes[this.vistas[j].vista][k]);
                                                                this.print("tienePermisoDespues: " + this.componentes[this.vistas[j].vista][k].selected);
                                                                break;
                                                        }
                                                }


                                        }
                                }
                        }
                }


        }


        limpiarComponentes() {
                let j;
                for (j = 0; j < this.vistas.length; j++) {
                        let permisoVista = this.componentes[this.vistas[j].vista];

                        if (permisoVista != null) {
                                this.print("vista: " + this.vistas[j].vista);
                                let i;
                                for (i = 0; i < permisoVista.length; i++) {
                                        this.componentes[this.vistas[j].vista][i].selected = false;
                                }
                        }
                }
        }



        guardar() {

                let listaPerm = new Array();
                for (let j = 0; j < this.vistas.length; j++) {
                        let permisoVista = this.componentes[this.vistas[j].vista];
                        for (let k = 0; k < permisoVista.length; k++) {
                                if (permisoVista[k].selected) {
                                        //listaPerm.push(this.componentes[this.vistas[j].vista][k].idComponente);
                                        listaPerm.push(this.componentes[this.vistas[j].vista][k].id_detalle_view);
                                }

                        }
                }



                this.print("permisos modificados:");
                this.print(this.permisosUsuarioModificar);

                this.print("permisos activados:");
                this.print(listaPerm);

                let listaPermEliminados = new Array();
                let listaPermAgregados = new Array();

                if (this.permisosUsuarioModificar != null) {
                        let k = 0;

                        for (let i = 0; i < this.permisosUsuarioModificar.length; i++) {
                                let e = false;
                                for (let j = 0; j < listaPerm.length; j++) {
                                        //this.print("comparando:"+this.permisosUsuarioModificar[i]+"->"+listaPerm[j]);
                                        if (this.permisosUsuarioModificar[i] == listaPerm[j]) {
                                                e = true;
                                        }
                                }

                                if (!e) {
                                        listaPermEliminados[k] = this.permisosUsuarioModificar[i];
                                        k++;
                                }
                        }

                        this.print("permisos eliminados:");
                        this.print(listaPermEliminados);

                        //[1,2,3] permisosUsuarioModificar
                        //[1,2,3,4,5,6] listaPerm
                        k = 0;
                        for (let i = 0; i < listaPerm.length; i++) {
                                let e = false;
                                for (let j = 0; j < this.permisosUsuarioModificar.length; j++) {
                                        //this.print("comparando:"+this.permisosUsuarioModificar[i]+"->"+listaPerm[j]);
                                        if (listaPerm[i] == this.permisosUsuarioModificar[j]) {
                                                e = true;
                                        }
                                }

                                if (!e) {
                                        listaPermAgregados[k] = listaPerm[i];
                                        k++;
                                }
                        }

                        this.print("permisos agregados:");
                        this.print(listaPermAgregados);
                } else {
                        listaPermAgregados = listaPerm;
                }

                let parametros = JSON.stringify({ listaPermAgregados: listaPermAgregados, listaPermEliminados: listaPermEliminados, id_rol: this.rolModificar.id_rol });

                this.permisoService.actualizarPermisosRol(parametros, this.usuarioModificar)
                        .subscribe(
                        data => {
                                this.rpta = data
                                if (this.rpta != null) {
                                        if (this.rpta) {
                                                this.print("ACTUALIZACON CORRECTA");
                                                this.mensajeCorrecto("ACTUALIZACIÓN CORRECTA");
                                                //this.buscar();
                                                this.buscarLoginSegundoPlano();
                                        } else {
                                                this.mensajeInCorrecto("ACTUALIZACIÓN  INCORRECTA");
                                        }

                                } else {
                                        this.mensajeInCorrecto("ERROR DE CONSULTA");
                                }
                        },
                        error => this.msj = <any>error
                        );



                this.print(listaPerm);


        }


        selectPermiso(vi: any, compo: any, i: any, j: any) {
                this.print("vista: " + vi);
                this.print("componente: " + compo);
                this.print("indice: " + i);
                this.print("indice: " + j);
                if (this.componentes[this.vistas[i].vista][j].selected) {
                        this.componentes[this.vistas[i].vista][j].selected = false;

                } else {
                        this.componentes[this.vistas[i].vista][j].selected = true;
                }


        }



        obtenerVistasHashMap(vistas: any, componentes: any): any {

                let hashcomponentes = {};

                /******** CREAR UN ARRAY DE ARRAYS**********************/
                let i;
                for (i = 0; i < vistas.length; i++) {
                        hashcomponentes[vistas[i].vista] = new Array();
                }


                /**************LLENAR EL ARRAY CON LOS componentes DADOS***************/
                let antes = componentes[0].vista;
                let j = 0;
                for (i = 0; i < componentes.length; i++) {
                        if (antes != componentes[i].vista) {
                                antes = componentes[i].vista;
                                j = 0;
                        }
                        hashcomponentes[componentes[i].vista][j] = componentes[i].componente;
                        j++;
                }


                return hashcomponentes;
        }





        /*obtenerSeries(){
       
               this.documentoService.obtenerSeries()
                               .subscribe( 
                                       data=> {this.serieDocumentos = data;
                                       this.print(data);     
                                       },
                                       error =>  this.msj = <any>error);
        }*/

        obtenerVistas() {

                this.vistaService.seleccionarTodos()
                        .subscribe(
                        data => {//this.vistas = data;

                                this.vistas = data.vistas;
                                         /*this.print("vistas ori:  ");
                                         this.print(data.vistas);
                                         this.print("componentes ori:  ");
                                         this.print(data.componentes);
                                         */let hasMap = this.obtenervistasHash(data.vistas, data.componentes);
                                this.componentes = hasMap;



                                /*
                                                                         this.print("vistas:  ");
                                                                         this.print(this.vistas);
                                                                         this.print("componentes:  ");
                                                                         this.print(this.componentes);
                                                                         this.print("hashMap:" + JSON.stringify(hasMap));
                                                                      
                                                                         this.print("componente form");
                                
                                                                         this.print(hasMap['FORM_registrarPerfil_DOCUMENTO']);
                                                                         this.print(this.componentes['FORM_registrarPerfil_DOCUMENTO']);
                                
                                
                                                                        this.print(data);    
                                
                                                                        this.print(JSON.stringify(data));     */
                        },
                        error => this.msj = <any>error);
        }



        obtenerUnidadEntidad() {

                /* this.unidadEntidadService.obtenerUnidades()
                                 .subscribe( 
                                         data=> {this.unidadEntidades = data;
                                         this.print(data);     
                                         },
                                         error =>  this.msj = <any>error);
          */
        }




        private obtenervistasHash(vistas: any, componentes: any): any {

                let hashcomponentes = {};

                /******** CREAR UN ARRAY DE ARRAYS**********************/
                let i;
                for (i = 0; i < vistas.length; i++) {
                        hashcomponentes[vistas[i].vista] = new Array();
                }


                /**************LLENAR EL ARRAY CON LOS componentes DADOS***************/
                let antes = componentes[0].vista;
                let j = 0;
                for (i = 0; i < componentes.length; i++) {
                        if (antes != componentes[i].vista) {
                                antes = componentes[i].vista;
                                j = 0;
                        }
                        hashcomponentes[componentes[i].vista][j] = componentes[i];
                        j++;
                }


                return hashcomponentes;
        }

        abrirVentanaRol() {
                let user = this.obtenerUsuario();
                let login = this.loginSelected;

                var hoy = new Date();
                var dd = hoy.getDate();
                var mm = hoy.getMonth() + 1; //hoy es 0!
                var yyyy = hoy.getFullYear();

                var dd1 = "" + dd;
                var mm1 = "" + mm;
                if (dd < 10) { dd1 = '0' + dd; }
                if (mm < 10) { mm1 = '0' + mm; }

                let pos = login.indexOf("@");
                if (pos >= 0) {
                        login = login.substr(0, pos);

                }

                this.rolNombre = "ROL-" + login.toUpperCase() + "-" + dd1 + '-' + mm1 + '-' + yyyy;
                this.rolDescripcion = "ROL CREADO PARA EL USUARIO: " + user.nombres;
                this.abrirModal("modalRol");
        }

        crearRol() {

                let parametros = JSON.stringify({
                        nombre: this.rolNombre,
                        descripcion: this.rolDescripcion,
                        configurable: this.rolConfigurable == true ? 1 : 0,
                        id_usuario: this.usuarioModificar
                });



                this.usuarioService.crearNuevoRol(parametros)
                        .subscribe(
                        data => {
                                this.rpta = data
                                if (this.rpta != null) {
                                        if (this.rpta) {

                                                this.mensajeCorrecto("CREACION CORRECTA");
                                                this.buscarLoginSegundoPlano();
                                        } else {
                                                this.mensajeInCorrecto("CREACION  INCORRECTA");
                                        }

                                } else {
                                        this.mensajeInCorrecto("ERROR DE CONSULTA");
                                }
                        },
                        error => this.msj = <any>error
                        );
        }


        elegirFila(lista, i) {
                this.marcar(lista, i);
        }



        activarBuscarDoc(event) {

                //this.success=false;
                //this.successModal=false;
                //if(!this.tienePermiso(this.rutas.FORM_NUEVO_MENSAJE,this.rutas.BUTTON_BUSCAR_PERSONA)) {
                //               this.mensajeInCorrecto("USTED NO TIENE PERMISO PARA ESTA ACCION");
                //event.stopPropagation();
                //       }
        }

        cerrarModalRef() {
                this.panelReferenciaSelected = false;
                //this.print("cerro el modal abierto");
        }

        obtenerUsuarios() {
                this.getTotalLista();

                this.limpiarCampos();
                this.seleccionarByPagina(this.inicio, this.fin, this.tamPagina);
        }



        limpiar() {
                this.limpiarCampos();
                this.inicio = 1;
                this.fin = 10;
                this.tamPagina = 10;
                this.getTotalLista();
                this.seleccionarByPagina(this.inicio, this.fin, this.tamPagina);
        }

        limpiarCampos() {
                this.idUsuarioSelected = null;
                this.loginSelected = null;
                this.claveSelected = null;
                this.empleadoSelected = null;
        }

        registrar() {

                let parametros = JSON.stringify({
                        ulogin: this.loginSelected,
                        clave: this.claveSelected,
                        id_empleado: this.empleadoSelected == null ? null : this.empleadoSelected.id_empleado
                });
                this.usuarioService.registrar(parametros)
                        .subscribe(
                        data => {

                                let rpta = data;

                                if (rpta != null) {
                                        if (rpta == 1) {
                                                this.mensajeCorrecto("USUARIO REGISTRADO");
                                                this.limpiarCampos();
                                        } else {
                                                this.mensajeInCorrecto("USUARIO NO REGISTRADO");
                                        }
                                }

                                this.obtenerUsuarios();

                        },
                        error => this.msj = <any>error
                        );
        }


        eliminar(bean) {
                if( confirm("Realmente Desea Eliminar ?")){
                this.usuarioService.eliminarLogico(bean.id_usuario)
                        .subscribe(
                        data => {
                                this.obtenerUsuarios();
                                let rpta = data;
                                if (rpta != null) {
                                        if (rpta == 1) {
                                                this.mensajeCorrecto("USUARIO ELIMINADO CORRECTAMENTE");
                                        } else {
                                                this.mensajeInCorrecto("USUARIO NO ELIMINADO");
                                        }

                                }
                        },
                        error => this.msj = <any>error);
                }
        }

        editar() {

                let parametros = JSON.stringify({
                        ulogin: this.loginSelected,
                        clave: this.claveSelected,
                        id_empleado: this.empleadoSelected == null ? null : this.empleadoSelected.id_empleado
                });

                this.print("parametros: " + parametros);
                this.usuarioService.editar(parametros, this.beanSelected.id_usuario)
                        .subscribe(
                        data => {
                                this.obtenerUsuarios();
                                let rpta = data.rpta;
                                this.print("rpta: " + rpta);
                                if (rpta != null) {
                                        if (rpta == 1) {
                                                this.mensajeCorrecto("USUARIO MODIFICADO");
                                        } else {
                                                this.mensajeInCorrecto("USUARIO NO MOFICADO");
                                        }
                                }

                        },
                        error => this.msj = <any>error
                        );

        }


        regresar() {
                this.limpiarCampos();
                //this.panelEditarSelected = false;
                this.panelRolesSelected = false;
                this.panelListaBeanSelected = true;
        }

        regresarEditar() {
                this.limpiarCampos();
                //this.panelEditarSelected = false;
                this.panelRolesSelected = false;
                this.panelListaBeanSelected = true;
                this.panelEditarSelected = false;
        }





        abrirPanelEditar(pro) {
                this.beanSelected = pro;
                this.loginSelected = pro.ulogin;
                this.claveSelected = pro.clave;

                this.print("bean");
                this.print(pro);
                this.empleadoSelected = {
                        id_empleado: pro.id_empleado,
                        nombre_empleado:
                        (pro.nombres == null ? " " : pro.nombres) + " " +
                        (pro.apellido_paterno == null ? "" : pro.apellido_paterno) + " " +
                        (pro.apellido_materno == null ? "" : pro.apellido_materno)
                };

                this.claveSelected = pro.clave;



                /*

                this.nombreSelected = pro.nombre;
                this.ordenPresentacionSelected=pro.orden_presentacion;
                this.idAlmacenSelected= pro.id_almacen;
                this.direccionSelected= pro.direccion;
                this.telefonoSelected= pro.telefono;
                this.localSelected= this.obtenerLocalActual(pro.id_local);
*/

                this.panelEditarSelected = true;
                this.panelListaBeanSelected = false;
        }


        abrirPanelEditarRoles(pro) {
                this.usuarioModificar = pro.id_usuario;
                this.loginSelected = pro.ulogin;
                this.buscarLogin(pro.ulogin);
                this.panelRolesSelected = true;
                this.panelListaBeanSelected = false;
        }


        buscar() {
                this.getTotalLista();
                this.seleccionarByPagina(this.inicio, this.fin, this.tamPagina);
        }

        getTotalLista() {

                let parametros = JSON.stringify({
                        id_usuario: this.idUsuarioSelected,
                        ulogin: this.loginSelected,
                        id_empleado: this.empleadoSelected == null ? null : this.empleadoSelected.id_empleado
                });

                this.print("parametros total: " + parametros);
                this.usuarioService.getTotalParametros(parametros)
                        .subscribe(
                        data => {
                                this.totalLista = data;
                                this.print("total:" + data);
                        },
                        error => this.msj = <any>error);
        }

        seleccionarByPagina(inicio: any, fin: any, tamPagina: any) {
                let parametros = JSON.stringify({
                        id_usuario: this.idUsuarioSelected,
                        ulogin: this.loginSelected,
                        id_empleado: this.empleadoSelected == null ? null : this.empleadoSelected.id_empleado
                });

                this.usuarioService.buscarPaginacion(inicio, fin, tamPagina, parametros)
                        .subscribe(
                        data => {
                                this.listaUsuarios = data;

                                this.print(data);
                        },
                        error => this.msj = <any>error);
        }

        //**********ACCIONES PARAR FORMULARIO EMPLEADO********
        abrirModalEmpleado() {
                this.abrirModal("modalEmpleado");
        }


        obtenerEmpleadoDatosExternos(datos) {
                this.empleadoSelected = datos.bean;
                this.print("datos Empleado");
                this.print(datos);
                this.cerrarModal("modalEmpleado");

        }


        //**********ACCIONES PARAR FORMULARIO ROL********
        abrirModalRol() {
                this.abrirModal("modalFormuRol");
        }


        obtenerRolDatosExternos(datos) {
                this.rolSelected = datos.bean;
                this.print("datos Rol");
                this.print(datos);
                this.cerrarModal("modalFormuRol");
                this.abrirModal("modalRolAgregar");
        }


        guardarRol() {

                let idUsuario = this.usuarioModificar;
                let roles = Array();
                roles.push({
                        id_rol:this.rolSelected.id_rol
                });
                let creds = JSON.stringify({ roles: roles, id_usuario: idUsuario });

                this.perfilService.registrar(creds)
                        .subscribe(
                        data => {
                                let rpta = data;
                                if (rpta != null) {
                                        if (rpta == 1) {
                                                this.buscarLoginSegundoPlano();
                                                this.mensajeCorrecto("PERFIL AGREGADO CORRECTAMENTE");
                                                this.cerrarModal("modalRolAgregar")
                                        } else {
                                                this.mensajeInCorrecto("ERROR AL AGREGAR PERFIL");
                                        }

                                }

                        },
                        error => this.msj = <any>error
                        );
        }

}