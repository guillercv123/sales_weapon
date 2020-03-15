import { Component, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';

import { ControllerComponent } from '../../../core/controller/controller.component';




/******************IMPORTAR SERVICIOS*************** */


import { SerieComprobanteService } from '../service/serie-comprobante.service';
import { CategoriaComprobanteService } from '../service/categoria-comprobante.service';
import { TipoComprobanteService } from '../service/tipo-comprobante.service';

import { Vista } from '../model/Vista';

declare var $: any;
@Component({
        selector: 'form-serie-comprobante',
        templateUrl: '../view/form-serie-comprobante.component.html',
        providers: [SerieComprobanteService, CategoriaComprobanteService, TipoComprobanteService]

})

export class FormSerieComprobanteComponent extends ControllerComponent implements AfterViewInit {


        categoriasComprobante: any[];
        tiposComprobante: any[];

        categoriaComprobanteSelected: any;


        listaComprobante: any[];

        idSerieComprobanteSelected: number;
        numeroSelected: number;
        tipoComprobanteSelected: any;
        observacionSelected: string;
        ordenPresentacionSelected: number;


        //************OBJETO ELEGIDO PARA EDITAR************
        beanSelected: any;

        //***********PANELES DE LOS MANTENEDORES***********

        panelEditarSelected: boolean = false;
        panelListaBeanSelected: boolean = true;


        constructor(
                public http: Http,
                public router: Router,
                public serieComprobanteService: SerieComprobanteService,
                public categoriaComprobanteService: CategoriaComprobanteService,
                public tipoComprobanteService: TipoComprobanteService
        ) {
                super(router);

                this.panelEditarSelected = false;
        }


        ngOnInit() {
                this.limpiarCampos();
        }


        ngAfterViewInit() {
                if (this.verificarTokenRpta(this.rutasMantenedores.FORM_SERIE_COMPROBANTE)) {
                        this.obtenerCategoriasComprobanteVenta();
                        this.obtenerSeriesComprobante();
                }
        }

        obtenerSeriesComprobante() {
                this.getTotalLista();
                this.limpiarCampos();
                this.seleccionarByPagina(this.inicio, this.fin, this.tamPagina);
        }


        obtenerCategoriasComprobanteVenta() {

                this.categoriaComprobanteService.getAllVenta()
                        .subscribe(
                        data => {

                                this.categoriasComprobante = data;
                                this.categoriaComprobanteSelected = this.categoriasComprobante != null ? this.categoriasComprobante[0] : null;
                                this.obtenerTiposComprobanteByIdCategoria(this.categoriaComprobanteSelected.id_categoria_comprobante);
                        },
                        error => this.msj = <any>error);
        }



        obtenerTiposComprobanteByIdCategoria(id) {

                this.tipoComprobanteService.getByIdCategoria(id)
                        .subscribe(
                        data => {//this.vistas = data;

                                this.tiposComprobante = data;
                        },
                        error => this.msj = <any>error);
        }



        abrirPanelBuscar() {
                this.panelEditarSelected = false;
                this.panelListaBeanSelected = true;

        }

        abrirPanelRegistrar() {
                this.panelEditarSelected = false;
                this.panelListaBeanSelected = true;
        }

        obtenerTipoActual(nombreTipo: string) {
                let obj = null;
                let i;
                for (i = 0; i < this.tiposComprobante.length; i++) {
                        //this.print("this.tipos_producto[i].nombre"+this.tipos_producto[i].nombre+" , nombreTipo: " +nombreTipo);
                        if (this.tiposComprobante[i].nombre == nombreTipo) {
                                obj = this.tiposComprobante[i];
                                break;
                        }
                }
                return obj;
        }

        abrirPanelEditar(pro) {
                if (this.tienePermisoPrintMsj(this.rutas.FORM_SERIE_COMPROBANTE, this.rutas.PANEL_EDITAR)) {
                        this.beanSelected = pro;

                        this.idSerieComprobanteSelected = pro.id_serie_comprobante;
                        this.numeroSelected = pro.numero;
                        this.tipoComprobanteSelected = this.obtenerTipoActual(pro.nombre_tipo_comprobante);
                        this.ordenPresentacionSelected = pro.orden_presentacion;
                        this.observacionSelected = pro.observacion;

                        this.panelEditarSelected = true;
                        this.panelListaBeanSelected = false;
                }
        }


        regresar() {
                this.limpiarCampos();
                this.panelEditarSelected = false;
                this.panelListaBeanSelected = true;
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
                        id_serie_comprobante: this.idSerieComprobanteSelected,
                        numero: this.numeroSelected,
                        id_tipo_comprobante: this.tipoComprobanteSelected == null ? null : this.tipoComprobanteSelected.id_tipo_comprobante,
                        observacion: this.observacionSelected,
                        orden_presentacion: this.ordenPresentacionSelected
                });

                this.serieComprobanteService.buscarPaginacion(inicio, fin, tamPagina, parametros)
                        .subscribe(
                        data => {
                                this.listaComprobante = data;

                                this.print(data);
                        },
                        error => this.msj = <any>error);
        }


        registrar() {

                if (this.tienePermisoPrintMsj(this.rutas.FORM_SERIE_COMPROBANTE, this.rutas.BUTTON_REGISTRAR)) {
                        let parametros = JSON.stringify({
                                numero: this.numeroSelected,
                                id_tipo_comprobante: this.tipoComprobanteSelected.id_tipo_comprobante,
                                observacion: this.observacionSelected,
                                orden_presentacion: this.ordenPresentacionSelected
                        });
                        this.serieComprobanteService.registrar(parametros)
                                .subscribe(
                                data => {

                                        let rpta = data.rpta;
                                        this.print("rpta: " + rpta);
                                        if (rpta != null) {
                                                if (rpta == 1) {
                                                        this.mensajeCorrecto("SERIE COMPROBANTE REGISTRADA");
                                                        this.limpiarCampos();
                                                } else {
                                                        this.mensajeInCorrecto("SERIE COMPROBANTE NO REGISTRADA");
                                                }
                                                this.obtenerSeriesComprobante();
                                        }


                                },
                                error => this.msj = <any>error
                                );
                }
        }

        buscar() {
                if (this.tienePermisoPrintMsj(this.rutas.FORM_SERIE_COMPROBANTE, this.rutas.BUTTON_BUSCAR)) {
                        this.getTotalLista();
                        this.seleccionarByPagina(this.inicio, this.fin, this.tamPagina);
                }
        }



        getTotalLista() {

                let parametros = JSON.stringify({
                        id_serie_comprobante: this.idSerieComprobanteSelected,
                        numero: this.numeroSelected,
                        id_tipo_comprobante: this.tipoComprobanteSelected == null ? null : this.tipoComprobanteSelected.id_tipo_comprobante,
                        observacion: this.observacionSelected,
                        orden_presentacion: this.ordenPresentacionSelected
                });

                this.print("parametros total: " + parametros);
                this.serieComprobanteService.getTotalParametros(parametros)
                        .subscribe(
                        data => {
                                this.totalLista = data;
                                this.print("total:" + data);
                        },
                        error => this.msj = <any>error);
        }


        eliminar(bean) {
                if (this.tienePermisoPrintMsj(this.rutas.FORM_SERIE_COMPROBANTE, this.rutas.BUTTON_ELIMINAR)) {
                        if( confirm("Realmente Desea Eliminar ?")){
                        this.serieComprobanteService.eliminarLogico(bean.id_serie_comprobante)
                                .subscribe(
                                data => {

                                        let rpta = data;
                                        if (rpta != null) {
                                                if (rpta == 1) {
                                                        this.mensajeCorrecto("SERIE COMPROBANTE ELIMINADA CORRECTAMENTE");
                                                } else {
                                                        this.mensajeInCorrecto("SERIE COMPROBANTE NO ELIMINADA");
                                                }
                                                this.obtenerSeriesComprobante();
                                        }
                                },
                                error => this.msj = <any>error);
                        }
                }
        }




        editar() {

                if (this.tienePermisoPrintMsj(this.rutas.FORM_SERIE_COMPROBANTE, this.rutas.BUTTON_ACTUALIZAR)) {
                        let parametros = JSON.stringify({
                                numero: this.numeroSelected,
                                id_tipo_comprobante: this.tipoComprobanteSelected.id_tipo_comprobante,
                                observacion: this.observacionSelected,
                                orden_presentacion: this.ordenPresentacionSelected
                        });

                        this.print("parametros: " + parametros);
                        this.serieComprobanteService.editar(parametros, this.beanSelected.id_serie_comprobante)
                                .subscribe(
                                data => {

                                        let rpta = data.rpta;
                                        this.print("rpta: " + rpta);
                                        if (rpta != null) {
                                                if (rpta) {
                                                        this.mensajeCorrecto("SERIE COMPROBANTE MODIFICADA");
                                                } else {
                                                        this.mensajeInCorrecto("SERIE COMPROBANTE NO MOFICADA");
                                                }
                                                this.obtenerSeriesComprobante();
                                        }

                                },
                                error => this.msj = <any>error
                                );
                }

        }



        limpiarCampos() {
                this.idSerieComprobanteSelected = null;
                this.numeroSelected = null;
                this.tipoComprobanteSelected = null;
                this.observacionSelected = null;
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