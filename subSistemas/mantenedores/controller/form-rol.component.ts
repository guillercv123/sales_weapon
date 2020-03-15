import { Component, AfterViewInit,ViewChild, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';

import { ControllerComponent } from '../../../core/controller/controller.component';




/******************IMPORTAR SERVICIOS*************** */


import { RolService } from '../service/rol.service';
import { PermisoService } from '../service/Permiso.Service';
import { VistaService } from '../service/Vista.Service';

import { Vista } from '../model/Vista';

declare var $: any;
@Component({
        selector: 'form-rol',
        templateUrl: '../view/form-rol.component.html',
        providers: [RolService, PermisoService, VistaService]

})

export class FormRolComponent extends ControllerComponent implements AfterViewInit {

        listaRoles: any[];

        idRolSelected: string;
        nombreSelected: string;
        descripcionSelected: string;
        uloginSelected: string;
        configurableSelected: boolean = false;


        //************OBJETO ELEGIDO PARA EDITAR************
        beanSelected: any;

        //***********PANELES DE LOS MANTENEDORES***********

        panelEditarSelected: boolean = false;
        panelListaBeanSelected: boolean = true;



        /***********PARA MODIFICAR PERMISOS*********/
        vistas: Vista[];
        componentes: any[];

        permisosModificar: any[];
        permisosUsuarioModificar: any[];


        //************OBJETOS QUE SE TRANSMITIRAN**********/
        @Output() rolSeleccionado = new EventEmitter();
        @Input() buttonSelectedActivated = false;

        constructor(
                public http: Http,
                public router: Router,
                public rolService: RolService,
                public permisoService: PermisoService,
                public vistaService: VistaService
        ) {
                super(router);

                this.panelEditarSelected = false;
        }

        ngOnInit() {
                this.limpiarCampos();
        }


        ngAfterViewInit() {
                if (this.verificarTokenRpta(this.rutasMantenedores.FORM_ROL)) {
                        this.obtenerTiposProducto();
                        this.obtenerVistas();
                }
        }

        obtenerVistas() {

                this.vistaService.seleccionarTodos()
                        .subscribe(
                        data => {//this.vistas = data;

                                this.vistas = data.vistas;
                                let hasMap = this.obtenervistasHash(data.vistas, data.componentes);
                                this.componentes = hasMap;

                        },
                        error => this.msj = <any>error);
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



        private limpiarSeleccionVistas(): any {
                this.print("componentes: ");
                this.print(this.componentes);
                let j;
                for (j = 0; j < this.vistas.length; j++) {
                        let permisoFijoVista = this.componentes[this.vistas[j].vista];

                        let i;
                        for (i = 0; i < permisoFijoVista.length; i++) {
                                permisoFijoVista[i].selected = false;

                        }

                }
        }


        abrirPanelBuscar() {
                this.panelEditarSelected = false;
                this.panelListaBeanSelected = true;

        }

        abrirPanelRegistrar() {
                this.panelEditarSelected = false;
                this.panelListaBeanSelected = true;
        }

        abrirPanelEditar(pro) {
                if (this.tienePermisoPrintMsj(this.rutas.FORM_ROL, this.rutas.PANEL_EDITAR)) {
                        this.beanSelected = pro;

                        this.idRolSelected = pro.id_local;
                        this.nombreSelected = pro.nombre;
                        this.descripcionSelected = pro.descripcion;
                        this.uloginSelected = pro.ulogin;
                        this.configurableSelected = pro.configurable;

                        this.panelEditarSelected = true;
                        this.panelListaBeanSelected = false;

                        this.obtenerPermisosRol(this.beanSelected);
                }
        }


        obtenerPermisosRol(rol) {
                this.limpiarSeleccionVistas();
                this.permisoService.obtenerPermisosByIdUsuarioRol(rol.id_usuario, rol.id_rol)
                        .subscribe(
                        data => {
                                this.print(data);
                                if (data != null) {
                                        this.permisosModificar = data.hashPermisos;
                                        this.permisosUsuarioModificar = data.permisos;
                                        //this.print("/*********PERMISOS ACTUALES DEL MODIFICADO**************");
                                        this.print(this.permisosModificar);

                                        this.verPermisos(this.permisosModificar);
                                } else {
                                        this.mensajeAdvertencia("NO TIENE PERMISOS ,PUEDE AGREGARLE NUEVOS!!");
                                }
                        },
                        error => {
                                this.mensajeAdvertencia("NO TIENE PERMISOS ,PUEDE AGREGARLE NUEVOS!!");
                        }
                        );


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


        regresar() {
                this.limpiarCampos();
                this.panelEditarSelected = false;
                this.panelListaBeanSelected = true;
        }


        obtenerTiposProducto() {
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


        seleccionarByPagina(inicio: any, fin: any, tamPagina: any) {
                let parametros = JSON.stringify({
                        id_rol: this.idRolSelected,
                        nombre: this.nombreSelected,
                        descripcion: this.descripcionSelected,
                        ulogin: this.uloginSelected
                });

                this.rolService.buscarPaginacion(inicio, fin, tamPagina, parametros)
                        .subscribe(
                        data => {
                                this.listaRoles = data;

                                this.print(data);
                        },
                        error => this.msj = <any>error);
        }


        registrar() {
                if (this.tienePermisoPrintMsj(this.rutas.FORM_ROL, this.rutas.BUTTON_REGISTRAR)) {
                        let parametros = JSON.stringify({
                                nombre: this.nombreSelected,
                                descripcion: this.descripcionSelected,
                                ulogin: this.uloginSelected,
                                configurable: this.configurableSelected == true ? 1 : 0,
                        });
                        this.rolService.registrar(parametros)
                                .subscribe(
                                data => {

                                        let rpta = data.rpta;
                                        this.print("rpta: " + rpta);
                                        if (rpta != null) {
                                                if (rpta == 1) {
                                                        this.mensajeCorrecto("ROL REGISTRADO");
                                                        this.limpiarCampos();
                                                } else {
                                                        this.mensajeInCorrecto("ROL NO REGISTRADO");
                                                }
                                        }

                                        this.obtenerTiposProducto();

                                },
                                error => this.msj = <any>error
                                );
                }
        }

        buscar() {
                if (this.tienePermisoPrintMsj(this.rutas.FORM_ROL, this.rutas.BUTTON_BUSCAR)) {
                        this.getTotalLista();
                        this.seleccionarByPagina(this.inicio, this.fin, this.tamPagina);
                }
        }



        getTotalLista() {
                /*this.productoService.getTotal()
                        .subscribe(
                        data => {
                                this.totalLista = data;
                                this.print(data);
                        },
                        error => this.msj = <any>error);*/
                let parametros = JSON.stringify({
                        id_rol: this.idRolSelected,
                        nombre: this.nombreSelected,
                        descripcion: this.descripcionSelected,
                        ulogin: this.uloginSelected
                });

                this.print("parametros total: " + parametros);
                this.rolService.getTotalParametros(parametros)
                        .subscribe(
                        data => {
                                this.totalLista = data;
                                this.print("total:" + data);
                        },
                        error => this.msj = <any>error);
        }


        eliminar(bean) {

                if (this.tienePermisoPrintMsj(this.rutas.FORM_ROL, this.rutas.BUTTON_ELIMINAR)) {
                        if( confirm("Realmente Desea Eliminar ?")){
                        this.rolService.eliminar(bean.id_rol)
                                .subscribe(
                                data => {
                                        this.obtenerTiposProducto();
                                        let rpta = data;
                                        if (rpta != null) {
                                                if (rpta == 1) {
                                                        this.mensajeCorrecto("ROL ELIMINADO CORRECTAMENTE");
                                                } else {
                                                        this.mensajeInCorrecto("ROL NO ELIMINADO");
                                                }

                                        }
                                },
                                error => this.msj = <any>error);
                        }
                }
        }




        editar() {

                if (this.tienePermisoPrintMsj(this.rutas.FORM_ROL, this.rutas.BUTTON_ACTUALIZAR)) {



                        /*****************OBTENER PERMISOS QUE SE AGREGARAN Y QUITARAN******************/
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



                        let parametros = JSON.stringify({
                                nombre: this.nombreSelected,
                                descripcion: this.descripcionSelected,
                                configurable: this.configurableSelected == true ? 1 : 0,
                                listaPermAgregados: listaPermAgregados,
                                listaPermEliminados: listaPermEliminados,
                        });


                        this.rolService.editar(parametros, this.beanSelected.id_rol)
                                .subscribe(
                                data => {
                                        this.obtenerTiposProducto();
                                        let rpta = data.rpta;
                                        this.print("rpta: " + rpta);
                                        if (rpta != null) {
                                                if (rpta == 1) {
                                                        this.mensajeCorrecto("ROL MODIFICADO");
                                                } else {
                                                        this.mensajeInCorrecto("ROL NO MODIFICADO");
                                                }
                                        }

                                },
                                error => this.msj = <any>error
                                );

                }

        }



        limpiarCampos() {
                this.idRolSelected = null;
                this.nombreSelected = null;
                this.descripcionSelected = null;
                this.uloginSelected = null;
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

        seleccionar(bean) {
                this.rolSeleccionado.emit({ bean: bean });
        }
}