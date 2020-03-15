import { Component, AfterViewInit, ViewChild, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';

import { ControllerComponent } from '../../../core/controller/controller.component';




/******************IMPORTAR SERVICIOS*************** */


import { TipoCambioService } from '../service/tipo-cambio.service';


import { Vista } from '../model/Vista';

declare var $: any;
@Component({
        selector: 'form-tipo-cambio',
        templateUrl: '../view/form-tipo-cambio.component.html',
        providers: [TipoCambioService]

})

export class FormTipoCambioComponent extends ControllerComponent implements AfterViewInit {



        id_tipo_cambio: any;
        fecha: any;
        precio_compra: any;
        precio_venta: any;
        listaTipoCambio: any[];

        //************OBJETO ELEGIDO PARA EDITAR************
        beanSelected: any;

        //***********PANELES DE LOS MANTENEDORES***********

        panelEditarSelected: boolean = false;
        panelListaBeanSelected: boolean = true;


        buttonSelectedActivatedUniEmpre: boolean = true;


        //************OBJETOS QUE SE TRANSMITIRAN**********/
        @Output() cargoSeleccionado = new EventEmitter();
        @Input() buttonSelectedActivated = false

        constructor(
                public http: Http,
                public router: Router,
                public tipoCambioService: TipoCambioService
        ) {
                super(router);

                this.panelEditarSelected = false;
        }


        ngOnInit() {
                this.limpiarCampos();
        }

        ngAfterViewInit() {
                if (this.verificarTokenRpta(this.rutasMantenedores.FORM_TIPO_CAMBIO)) {
                        this.obtenerCargos();
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
                if (this.tienePermisoPrintMsj(this.rutas.FORM_TIPO_CAMBIO, this.rutas.PANEL_EDITAR)) {

                        this.beanSelected = pro;

                        this.fecha = pro.fecha.substr(0, 10);
                        this.precio_compra = pro.precio_compra;
                        this.precio_venta = pro.precio_venta;

                        this.panelEditarSelected = true;
                        this.panelListaBeanSelected = false;
                }
        }


        regresar() {
                this.limpiarCampos();
                this.panelEditarSelected = false;
                this.panelListaBeanSelected = true;
        }


        obtenerCargos() {
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
                        id_tipo_cambio: this.id_tipo_cambio,
                        fecha: this.fecha,
                        precio_compra: this.precio_compra,
                        precio_venta: this.precio_venta
                });

                this.tipoCambioService.buscarPaginacion(inicio, fin, tamPagina, parametros)
                        .subscribe(
                                data => {
                                        this.listaTipoCambio = data;

                                        this.print(data);
                                },
                                error => this.msj = <any>error);
        }


        registrar() {

                if (this.tienePermisoPrintMsj(this.rutas.FORM_TIPO_CAMBIO, this.rutas.BUTTON_REGISTRAR)) {

                        let para = JSON.stringify({
                                id_tipo_cambio: null,
                                fecha: this.fecha,
                                precio_compra: null,
                                precio_venta: null
                        });

                        this.tipoCambioService.buscarPaginacion(1, 1, 10, para)
                                .subscribe(
                                        data => {
                                                let listaTipoCambio = data;

                                                if (this.isArrayVacio(listaTipoCambio)) {
                                                        let parametros = JSON.stringify({
                                                                fecha: this.fecha,
                                                                precio_compra: this.precio_compra,
                                                                precio_venta: this.precio_venta
                                                        });
                                                        this.tipoCambioService.registrar(parametros)
                                                                .subscribe(
                                                                        data => {

                                                                                let rpta = data.rpta;
                                                                                this.print("rpta: " + rpta);
                                                                                if (rpta != null) {
                                                                                        if (rpta == 1) {
                                                                                                this.mensajeCorrecto("TIPO  CAMBIO REGISTRADO");
                                                                                                this.limpiarCampos();
                                                                                        } else {
                                                                                                this.mensajeInCorrecto("TIPO CAMBIO NO REGISTRADO");
                                                                                        }
                                                                                }

                                                                                this.obtenerCargos();

                                                                        },
                                                                        error => this.msj = <any>error
                                                                );
                                                }else{
                                                        this.mensajeAdvertencia("TIPO DE CAMBIO YA ESTA REGISTRADO");
                                                }

                                                this.print(data);
                                        },
                                        error => this.msj = <any>error);
                }
        }

        buscar() {
                if (this.tienePermisoPrintMsj(this.rutas.FORM_TIPO_CAMBIO, this.rutas.BUTTON_BUSCAR)) {
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
                        id_tipo_cambio: this.id_tipo_cambio,
                        fecha: this.fecha,
                        precio_compra: this.precio_compra,
                        precio_venta: this.precio_venta
                });

                this.print("parametros total: " + parametros);
                this.tipoCambioService.getTotalParametros(parametros)
                        .subscribe(
                                data => {
                                        this.totalLista = data;
                                        this.print("total:" + data);
                                },
                                error => this.msj = <any>error);
        }


        eliminar(bean) {

                if (this.tienePermisoPrintMsj(this.rutas.FORM_TIPO_CAMBIO, this.rutas.BUTTON_ELIMINAR)) {
                        if (confirm("Realmente Desea Eliminar ?")) {
                                this.tipoCambioService.eliminarLogico(bean.id_tipo_cambio)
                                        .subscribe(
                                                data => {
                                                        this.obtenerCargos();
                                                        let rpta = data;
                                                        if (rpta != null) {
                                                                if (rpta == 1) {
                                                                        this.mensajeCorrecto("TIPO CAMBIO ELIMINADO CORRECTAMENTE");
                                                                } else {
                                                                        this.mensajeInCorrecto("TIPO CAMBIO NO ELIMINADO");
                                                                }

                                                        }
                                                },
                                                error => this.msj = <any>error);
                        }
                }
        }




        editar() {
                if (this.tienePermisoPrintMsj(this.rutas.FORM_TIPO_CAMBIO, this.rutas.BUTTON_ACTUALIZAR)) {
                        let parametros = JSON.stringify({
                                fecha: this.fecha,
                                precio_compra: this.precio_compra,
                                precio_venta: this.precio_venta
                        });

                        this.print("parametros: " + parametros);
                        this.tipoCambioService.editar(parametros, this.beanSelected.id_tipo_cambio)
                                .subscribe(
                                        data => {
                                                this.obtenerCargos();
                                                let rpta = data.rpta;
                                                this.print("rpta: " + rpta);
                                                if (rpta != null) {
                                                        if (rpta == 1) {
                                                                this.mensajeCorrecto("TIPO CAMBIO MODIFICADO");
                                                        } else {
                                                                this.mensajeInCorrecto("TIPO CAMBIO NO MOFICADO");
                                                        }
                                                }

                                        },
                                        error => this.msj = <any>error
                                );
                }

        }



        limpiarCampos() {
                this.id_tipo_cambio = null;
                this.fecha = null;
                this.precio_compra = null;
                this.precio_venta = null;
        }

        elegirFila(lista, i) {
                this.marcar(lista, i);
        }

        abrirModalUnidadEmpresa() {
                this.abrirModal("modalUnidadEmpresa");
        }

        obtenerUnidadEmpresaDatosExternos(datos) {
                //this.unidadEmpresaSelected = datos.bean;
                this.print("datos Empresa");
                this.print(datos);
                this.cerrarModal("modalUnidadEmpresa");

        }

        seleccionar(bean) {
                this.cargoSeleccionado.emit({ bean: bean });
        }
}