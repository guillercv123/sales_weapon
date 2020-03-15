import { Component, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';

import { ControllerComponent } from '../../../core/controller/controller.component';




/******************IMPORTAR SERVICIOS*************** */


import { LocalService } from '../service/local.service';


import { Vista } from '../model/Vista';

declare var $: any;
@Component({
        selector: 'form-local',
        templateUrl: '../view/form-local.component.html',
        providers: [LocalService]

})

export class FormLocalComponent extends ControllerComponent implements AfterViewInit {


        //tipos_producto: any[];
        listaLocales: any[];



        idLocalSelected: string;
        nombreSelected: string;
        direccionSelected: string;
        telefonoSelected: string;
        ordenPresentacionSelected: number;
        //rucSelected:string;
        //representanteSelected:string;
        //telefonoSelected:string;
        //correoSelected:string;


        //************OBJETO ELEGIDO PARA EDITAR************
        beanSelected: any;

        //***********PANELES DE LOS MANTENEDORES***********

        panelEditarSelected: boolean = false;
        panelListaBeanSelected: boolean = true;


        constructor(
                public http: Http,
                public router: Router,
                public localService: LocalService
        ) {
                super(router);

                this.panelEditarSelected = false;
        }

        ngOnInit() {
                this.limpiarCampos();
        }


        ngAfterViewInit() {
                if (this.verificarTokenRpta(this.rutasMantenedores.FORM_LOCAL)) {
                        this.obtenerTiposProducto();
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
                if (this.tienePermisoPrintMsj(this.rutas.FORM_LOCAL, this.rutas.PANEL_EDITAR)) {
                        this.beanSelected = pro;

                        this.idLocalSelected = pro.id_local;
                        this.nombreSelected = pro.nombre;
                        this.direccionSelected = pro.direccion;
                        this.telefonoSelected = pro.telefono;
                        this.ordenPresentacionSelected = pro.orden_presentacion;


                        this.panelEditarSelected = true;
                        this.panelListaBeanSelected = false;
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
                        id_local: this.idLocalSelected,
                        nombre: this.nombreSelected,
                        direccion: this.direccionSelected,
                        telefono: this.telefonoSelected,
                        orden_presentacion: this.ordenPresentacionSelected
                });

                this.localService.buscarPaginacion(inicio, fin, tamPagina, parametros)
                        .subscribe(
                        data => {
                                this.listaLocales = data;

                                this.print(data);
                        },
                        error => this.msj = <any>error);
        }


        registrar() {
                if (this.tienePermisoPrintMsj(this.rutas.FORM_LOCAL, this.rutas.BUTTON_REGISTRAR)) {
                        let parametros = JSON.stringify({
                                nombre: this.nombreSelected,
                                direccion: this.direccionSelected,
                                telefono: this.telefonoSelected,
                                orden_presentacion: this.ordenPresentacionSelected
                        });
                        this.localService.registrar(parametros)
                                .subscribe(
                                data => {

                                        let rpta = data.rpta;
                                        this.print("rpta: " + rpta);
                                        if (rpta != null) {
                                                if (rpta == 1) {
                                                        this.mensajeCorrecto("LOCAL REGISTRADO");
                                                        this.limpiarCampos();
                                                } else {
                                                        this.mensajeInCorrecto("LOCAL NO REGISTRADO");
                                                }
                                        }

                                        this.obtenerTiposProducto();

                                },
                                error => this.msj = <any>error
                                );
                }
        }

        buscar() {
                if (this.tienePermisoPrintMsj(this.rutas.FORM_LOCAL, this.rutas.BUTTON_BUSCAR)) {
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
                        id_local: this.idLocalSelected,
                        nombre: this.nombreSelected,
                        direccion: this.direccionSelected,
                        telefono: this.telefonoSelected,
                        orden_presentacion: this.ordenPresentacionSelected
                });

                this.print("parametros total: " + parametros);
                this.localService.getTotalParametros(parametros)
                        .subscribe(
                        data => {
                                this.totalLista = data;
                                this.print("total:" + data);
                        },
                        error => this.msj = <any>error);
        }


        eliminar(bean) {

                if (this.tienePermisoPrintMsj(this.rutas.FORM_LOCAL, this.rutas.BUTTON_ELIMINAR)) {
                        if( confirm("Realmente Desea Eliminar ?")){
                        this.localService.eliminarLogico(bean.id_local)
                                .subscribe(
                                data => {
                                        this.obtenerTiposProducto();
                                        let rpta = data;
                                        if (rpta != null) {
                                                if (rpta == 1) {
                                                        this.mensajeCorrecto("LOCAL ELIMINADO CORRECTAMENTE");
                                                } else {
                                                        this.mensajeInCorrecto("LOCAL NO ELIMINADO");
                                                }

                                        }
                                },
                                error => this.msj = <any>error);
                        }
                }
        }




        editar() {

                if (this.tienePermisoPrintMsj(this.rutas.FORM_LOCAL, this.rutas.BUTTON_ACTUALIZAR)) {
                        let parametros = JSON.stringify({
                                nombre: this.nombreSelected,
                                direccion: this.direccionSelected,
                                telefono: this.telefonoSelected,
                                orden_presentacion: this.ordenPresentacionSelected
                        });

                        this.print("parametros: " + parametros);
                        this.localService.editar(parametros, this.beanSelected.id_local)
                                .subscribe(
                                data => {
                                        this.obtenerTiposProducto();
                                        let rpta = data.rpta;
                                        this.print("rpta: " + rpta);
                                        if (rpta != null) {
                                                if (rpta == 1) {
                                                        this.mensajeCorrecto("LOCAL MODIFICADO");
                                                } else {
                                                        this.mensajeInCorrecto("LOCAL NO MOFICADO");
                                                }
                                        }

                                },
                                error => this.msj = <any>error
                                );
                }

        }



        limpiarCampos() {
                this.idLocalSelected = null;
                this.nombreSelected = null;
                this.direccionSelected = null;
                this.telefonoSelected = null;
                this.ordenPresentacionSelected = null;
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

        cerrarModal() {
                //this.panelReferenciaSelected = false;
                //this.print("cerro el modal abierto");
        }
}