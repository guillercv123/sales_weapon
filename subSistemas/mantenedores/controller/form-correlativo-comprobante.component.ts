import { Component, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';

import { ControllerComponent } from '../../../core/controller/controller.component';




/******************IMPORTAR SERVICIOS*************** */


import { CorrelativoComprobanteService } from '../service/correlativo-comprobante.service';
import { SerieComprobanteService } from '../service/serie-comprobante.service';
import { CategoriaComprobanteService } from '../service/categoria-comprobante.service';
import { TipoComprobanteService } from '../service/tipo-comprobante.service';

import { Vista } from '../model/Vista';

declare var $: any;
@Component({
        selector: 'form-correlativo-comprobante',
        templateUrl: '../view/form-correlativo-comprobante.component.html',
        providers: [CorrelativoComprobanteService, SerieComprobanteService, CategoriaComprobanteService, TipoComprobanteService]

})

export class FormCorrelativoComprobanteComponent extends ControllerComponent implements AfterViewInit {



        listaCorrelativos: any[];
        categoriasComprobante: any[];
        tiposComprobante: any[];
        seriesComprobante: any[];


        categoriaComprobanteSelected: any;
        numeroSelected: any;
        observacionSelected: any;
        serieComprobanteSelected: any;
        tipoComprobanteSelected
        idCorrelativoSelected: any;

        //************OBJETO ELEGIDO PARA EDITAR************
        beanSelected: any;

        //***********PANELES DE LOS MANTENEDORES***********

        panelEditarSelected: boolean = false;
        panelListaBeanSelected: boolean = true;


        constructor(
                public http: Http,
                public router: Router,
                public correlativoComprobanteService: CorrelativoComprobanteService,
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
                if (this.verificarTokenRpta(this.rutasMantenedores.FORM_CORRELATIVO_COMPROBANTE)) {
                        this.obtenerCorrelativosComprobante();
                        this.obtenerCategoriasComprobanteVenta();
                }
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

                this.tipoComprobanteService.getByIdCategoriaTotal(id)
                        .subscribe(
                        data => {//this.vistas = data;

                                this.tiposComprobante = data;
                        },
                        error => this.msj = <any>error);
        }

        mostrarSeriesComprobante() {
                this.serieComprobanteSelected = null;
                this.obtenerSeriesComprobanteByIdTipo(this.tipoComprobanteSelected.id_tipo_comprobante);

        }

        obtenerSeriesComprobanteByIdTipo(id) {

                this.serieComprobanteService.getByIdTipo(id)
                        .subscribe(
                        data => {//this.vistas = data;

                                this.seriesComprobante = data;

                                if (this.panelEditarSelected) {
                                        this.serieComprobanteSelected = this.obtenerSerieActual(this.beanSelected.numero_serie);
                                }
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

        abrirPanelEditar(pro) {
                if (this.tienePermisoPrintMsj(this.rutas.FORM_CORRELATIVO_COMPROBANTE, this.rutas.PANEL_EDITAR)) {
                        this.panelEditarSelected = true;
                        this.panelListaBeanSelected = false;

                        this.beanSelected = pro;
                        this.numeroSelected = pro.numero;
                        this.observacionSelected = pro.observacion;
                        this.tipoComprobanteSelected = this.obtenerTipoActual(pro.nombre_tipo_comprobante);
                        this.obtenerSeriesComprobanteByIdTipo(this.tipoComprobanteSelected.id_tipo_comprobante);
                }

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


        obtenerSerieActual(numero: string) {
                let obj = null;
                let i;
                for (i = 0; i < this.seriesComprobante.length; i++) {
                        //this.print("this.tipos_producto[i].nombre"+this.seriesComprobante[i].nombre+" , nombreTipo: " +numero);
                        if (this.seriesComprobante[i].numero == numero) {
                                obj = this.seriesComprobante[i];
                                break;
                        }
                }
                return obj;
        }


        regresar() {
                this.limpiarCampos();
                this.panelEditarSelected = false;
                this.panelListaBeanSelected = true;
        }


        obtenerCorrelativosComprobante() {
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
                        id_correlativo_comprobante: this.idCorrelativoSelected,
                        numero: this.numeroSelected,
                        id_serie_comprobante: this.serieComprobanteSelected == null ? null : this.serieComprobanteSelected.id_serie_comprobante,
                        id_tipo_comprobante: this.tipoComprobanteSelected == null ? null : this.tipoComprobanteSelected.id_tipo_comprobante,
                        observacion: this.observacionSelected
                });

                this.correlativoComprobanteService.buscarPaginacion(inicio, fin, tamPagina, parametros)
                        .subscribe(
                        data => {
                                this.listaCorrelativos = data;

                                this.print(data);
                        },
                        error => this.msj = <any>error);
        }


        registrar() {

                if (this.tienePermisoPrintMsj(this.rutas.FORM_CORRELATIVO_COMPROBANTE, this.rutas.BUTTON_REGISTRAR)) {
                        let parametros = JSON.stringify({
                                numero: this.numeroSelected,
                                id_serie_comprobante: this.serieComprobanteSelected == null ? null : this.serieComprobanteSelected.id_serie_comprobante,
                                observacion: this.observacionSelected

                        });
                        this.correlativoComprobanteService.registrar(parametros)
                                .subscribe(
                                data => {

                                        let rpta = data.rpta;
                                        this.print("rpta: " + rpta);
                                        if (rpta != null) {
                                                if (rpta == 1) {
                                                        this.mensajeCorrecto("CORRELATIVO REGISTRADO");
                                                        this.limpiarCampos();
                                                } else {
                                                        this.mensajeInCorrecto(" CORRELATIVO NO REGISTRADO");
                                                }
                                        }

                                        this.obtenerCorrelativosComprobante();

                                },
                                error => this.msj = <any>error
                                );
                }
        }

        buscar() {
                if (this.tienePermisoPrintMsj(this.rutas.FORM_CORRELATIVO_COMPROBANTE, this.rutas.BUTTON_BUSCAR)) {
                        this.getTotalLista();
                        this.seleccionarByPagina(this.inicio, this.fin, this.tamPagina);
                }
        }



        getTotalLista() {

                let parametros = JSON.stringify({
                        id_correlativo_comprobante: this.idCorrelativoSelected,
                        numero: this.numeroSelected,
                        id_tipo_comprobante: this.tipoComprobanteSelected == null ? null : this.tipoComprobanteSelected.id_tipo_comprobante,
                        id_serie_comprobante: this.serieComprobanteSelected == null ? null : this.serieComprobanteSelected.id_serie_comprobante,
                        observacion: this.observacionSelected
                });

                this.print("parametros total: " + parametros);
                this.correlativoComprobanteService.getTotalParametros(parametros)
                        .subscribe(
                        data => {
                                this.totalLista = data;
                                this.print("total:" + data);
                        },
                        error => this.msj = <any>error);
        }


        eliminar(bean) {
                if (this.tienePermisoPrintMsj(this.rutas.FORM_CORRELATIVO_COMPROBANTE, this.rutas.BUTTON_ELIMINAR)) {
                        if( confirm("Realmente Desea Eliminar ?")){
                        this.correlativoComprobanteService.eliminarLogico(bean.id_correlativo_comprobante)
                                .subscribe(
                                data => {
                                        this.obtenerCorrelativosComprobante();
                                        let rpta = data;
                                        if (rpta != null) {
                                                if (rpta == 1) {
                                                        this.mensajeCorrecto("CORRELATIVO ELIMINADO CORRECTAMENTE");
                                                } else {
                                                        this.mensajeInCorrecto("CORRELATIVO NO ELIMINADO");
                                                }

                                        }
                                },
                                error => this.msj = <any>error);
                        }
                }
        }




        editar() {

                if (this.tienePermisoPrintMsj(this.rutas.FORM_CORRELATIVO_COMPROBANTE, this.rutas.BUTTON_ACTUALIZAR)) {
                        let parametros = JSON.stringify({
                                numero: this.numeroSelected,
                                id_serie_comprobante: this.serieComprobanteSelected == null ? null : this.serieComprobanteSelected.id_serie_comprobante,
                                observacion: this.observacionSelected,
                        });

                        this.print("parametros: " + parametros);
                        this.correlativoComprobanteService.editar(parametros, this.beanSelected.id_correlativo_comprobante)
                                .subscribe(
                                data => {
                                        this.obtenerCorrelativosComprobante();
                                        let rpta = data.rpta;
                                        this.print("rpta: " + rpta);
                                        if (rpta != null) {
                                                if (rpta == 1) {
                                                        this.mensajeCorrecto("CORRELATIVO MODIFICADO");
                                                } else {
                                                        this.mensajeInCorrecto("CORRELATIVO NO MOFICADO");
                                                }
                                        }

                                },
                                error => this.msj = <any>error
                                );
                }

        }



        limpiarCampos() {
                this.numeroSelected = null;
                this.observacionSelected = null;
                this.serieComprobanteSelected = null;
                this.idCorrelativoSelected = null;
                this.tipoComprobanteSelected = null;
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