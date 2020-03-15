import { Component, AfterViewInit, ViewChild, OnInit, Input } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';

import { ControllerComponent } from '../../../../core/controller/controller.component';




/******************IMPORTAR SERVICIOS*************** */


import { GuiaRemisionService } from '../../service/guia-remision.service';
import { VentaService } from '../../../ventas/service/venta.service';
import { CompraService } from '../../../compras/service/compra.service';
import { ReportePdfService } from '../../../../core/service/reporte-pdf.Service';
import { CategoriaComprobanteService } from '../../../mantenedores/service/categoria-comprobante.service';
import { TipoComprobanteService } from '../../../mantenedores/service/tipo-comprobante.service';
import { SerieComprobanteService } from '../../../mantenedores/service/serie-comprobante.service';
import { TipoMonedaService } from '../../../mantenedores/service/tipo-moneda.service';
import { UnidadMedidaService } from '../../../mantenedores/service/unidad-medida.service';
import { FormFindPersonaComponent } from '../persona/form-find-persona.component';
import { FormFindConductorVehiculoComponent } from '../conductor-vehiculo/form-find-conductor-vehiculo.component';

declare var $: any;
@Component({
        selector: 'form-new-guia-remision',
        templateUrl: '../../view/guia-remision/form-new-guia-remision.component.html',
        providers: [GuiaRemisionService, UnidadMedidaService, ReportePdfService, VentaService, CompraService, CategoriaComprobanteService, TipoComprobanteService, SerieComprobanteService, TipoMonedaService]

})

export class FormNewGuiaRemisionComponent extends ControllerComponent implements AfterViewInit {

        tieneComprobante: boolean = false;
        ventaSelected: any;
        compraSelected: any;
        guiasSelected: any;
        idGuiaRemisionSelected: any;
        idCompraVentaSelected: number;
        categoriaComprobanteSelected: any = null;
        categoriasComprobante: any[];
        unidades_medida: any[];
        comprobanteCompraActivated: boolean = false;

        tipoComprobanteSelected: any = null;
        tiposComprobante: any[];
        serieComprobanteSelected: any = null;
        seriesComprobante: any[];
        numeroCorrelativoSiguiente: number;
        serieSelected: any;
        numeroSelected: any;
        puntoPartidaSelected: any;
        puntoLlegadaSelected: any;
        fechaEmisionSelected: string = "";
        fechaInicioTrasladoSelected: any;
        motivoTrasladoSelected: any;
        nroOrdenSelected: any;
        referenciaClienteSelected: any;
        referenciaOrigenSelected: any;
        condicionesEntregaSelected: any;
        tipoMonedaSelected: any;
        tiposMoneda: any[];
        costoMinimoSelected: any;
        nombreConductorSelected: string;
        nombreEmpresaTransporte: string;
        nombrePersonaDestinatario: string;
        conductorSelected: any;
        personaEmpresaSelected: any;
        personaDestinatarioSelected: any;
        busquedaDestinatarioActivated: boolean = false;

        listaProductos: any[] = null;

        //**********MODAL PERSONA
        //activatedSelectedPer: boolean = true;


        //**********MODAL CONDUCTOR
        //activatedSelectedCondu: boolean = true;


        //**********MODAL PERSONA
        @ViewChild(FormFindPersonaComponent,{static: true}) formFindPersona: FormFindPersonaComponent;

        //**********MODAL CONDUCTOR
        @ViewChild(FormFindConductorVehiculoComponent,{static: true}) formFindConductor: FormFindConductorVehiculoComponent;


        constructor(
                public http: Http,
                public router: Router,
                public guiaRemisionService: GuiaRemisionService,
                public reportePdfService: ReportePdfService,
                public ventaService: VentaService,
                public compraService: CompraService,
                public categoriaComprobanteService: CategoriaComprobanteService,
                public tipoComprobanteService: TipoComprobanteService,
                public serieComprobanteService: SerieComprobanteService,
                public unidadMedidaService: UnidadMedidaService,
                public tipoMonedaService: TipoMonedaService
        ) {
                super(router);
        }




        ngOnInit() {
                //this.limpiarCampos();
                //this.listaProductos = new Array();
                //this.serieSelected=null;
                var f = new Date();
                this.fechaEmisionSelected = f.getFullYear() + "-" + this.completarCerosIzquierda(2, "" + (f.getMonth() + 1)) + "-" + this.completarCerosIzquierda(2, "" + f.getDate());
                this.fechaInicioTrasladoSelected = this.fechaEmisionSelected;

                this.formFindPersona.activatedSelected=true;
                this.formFindConductor.buttonSelected=true;
        }


        ngAfterViewInit() {
                if (this.verificarTokenRpta(this.rutasMantenedores.FORM_GUIA_REMISION)) {
                       
                        /*  this.obtenerUnidadesMedida();
                          this.obtenerCategoriasComprobante();
                          this.obtenerTipoMoneda();
                        */

                       this.categoriaComprobanteSelected = 'VENTA';
                       this.obtenerCategoriasComprobanteVenta();
                       //this.mostrarSeriesComprobante();
                       this.obtenerSeriesComprobanteByIdTipo(5);
                       this.obtenerUnidadesMedida() ;
                       this.obtenerTipoMoneda();


                }
        }





        mostrarTiposComprobante() {
                this.obtenerTiposComprobanteByIdCategoria(this.categoriaComprobanteSelected.id_categoria_comprobante);
                this.limpiarCampos();

                if (this.categoriaComprobanteSelected.nombre.toUpperCase() == "COMPRA") {
                        this.comprobanteCompraActivated = true;
                }

                if (this.categoriaComprobanteSelected.nombre.toUpperCase() == "VENTA") {
                        this.comprobanteCompraActivated = false;
                }
        }


        mostrarSeriesComprobante() {
                this.obtenerSeriesComprobanteByIdTipo(this.tipoComprobanteSelected.id_tipo_comprobante);

        }


        obtenerUnidadesMedida() {

                let parametros = JSON.stringify({
                        id_unidad_medida: null,
                        nombre: null,
                        orden_presentacion: null,
                        observacion: null,
                        simbolo: null,
                        is_para_comprobante: 2
                });

                this.unidadMedidaService.buscarPaginacion(1, 1000, 1000, parametros)
                        .subscribe(
                                data => {//this.vistas = data;
                                        this.print("Unidades de medida: ");
                                        this.print(data);
                                        this.unidades_medida = data;
                                        if (this.unidades_medida == null) {
                                                this.mensajeInCorrecto("Unidades de Medida tipo 2 VACIAS");
                                        }
                                },
                                error => this.msj = <any>error);
        }

        obtenerTipoMoneda() {

                this.tipoMonedaService.getAll()
                        .subscribe(
                                data => {//this.vistas = data;

                                        this.tiposMoneda = data;
                                },
                                error => this.msj = <any>error);
        }

        obtenerCategoriasComprobante() {

                this.categoriaComprobanteService.getAll()
                        .subscribe(
                                data => {//this.vistas = data;

                                        this.categoriasComprobante = data;
                                },
                                error => this.msj = <any>error);
        }

        obtenerCategoriasComprobanteVenta() {

                this.categoriaComprobanteService.getAllVenta()
                        .subscribe(
                                data => {//this.vistas = data;

                                        this.categoriasComprobante = data;
                                        this.categoriaComprobanteSelected = this.categoriasComprobante != null ? this.categoriasComprobante[0] : null;
                                        this.mostrarTiposComprobante();
                                },
                                error => this.msj = <any>error);
        }

        obtenerCategoriasComprobanteCompra() {

                this.categoriaComprobanteService.getAllCompra()
                        .subscribe(
                                data => {//this.vistas = data;

                                        this.categoriasComprobante = data;
                                        this.categoriaComprobanteSelected = this.categoriasComprobante != null ? this.categoriasComprobante[0] : null;
                                        this.mostrarTiposComprobante();
                                },
                                error => this.msj = <any>error);
        }



        obtenerTiposComprobanteByIdCategoria(id) {
                let parametros = JSON.stringify({
                        nombre: 'GUIA REMISION'
                });
                this.tipoComprobanteService.getByIdCategoriaParametros(parametros, id)
                        .subscribe(
                                data => {//this.vistas = data;

                                        this.tiposComprobante = data;
                                        this.tipoComprobanteSelected = this.tiposComprobante[0];
                                        this.mostrarSeriesComprobante();
                                },
                                error => this.msj = <any>error);
        }


        obtenerSeriesComprobanteByIdTipo(id) {

                this.serieComprobanteService.getByIdTipo(id)
                        .subscribe(
                                data => {//this.vistas = data;

                                        this.seriesComprobante = data;
                                },
                                error => this.msj = <any>error);
        }





        imprimirGuiaRemision() {

                if (this.tienePermisoPrintMsj(this.rutas.FORM_GUIA_REMISION, this.rutas.BUTTON_IMPRIMIR)) {
                        this.reportePdfService.obtenerGuiaRemisionPdf(this.idGuiaRemisionSelected)
                                .subscribe(
                                        data => {
                                                if (data._body.size == 0) {
                                                        this.mensajeInCorrecto("DOCUMENTO DIGITALIZADO NO ENCONTRADO - HA SIDO ELIMINADO ARCHIVO ADJUNTO");
                                                } else {

                                                        this.abrirDocumentoModalId(data._body, 'mostrarPrincipalPDF');
                                                        this.abrirModalPDfPorc("modalPrincipalPDF", 90);
                                                }

                                        },
                                        error => this.msj = <any>error
                                );
                }

        }

        buscarCompraVenta() {

                if (this.idCompraVentaSelected != null) {
                        if (this.categoriaComprobanteSelected != null) {
                                this.print("nombre: " + this.categoriaComprobanteSelected.nombre)
                                if (this.categoriaComprobanteSelected.nombre.toUpperCase() == "COMPRA") {
                                        this.buscarCompra();

                                }
                                if (this.categoriaComprobanteSelected.nombre.toUpperCase() == "VENTA") {
                                        this.buscarVenta();
                                }
                        }
                } else {
                        this.mensajeInCorrectoSinCerrar("DEBE ELEGIR CATEGORIA ANTES DE BUSCAR");
                }
        }

        agregarUnidadMedidaPeso() {
                let i;
                for (i = 0; i < this.listaProductos.length; i++) {
                        this.listaProductos[i].id_unidad_medida_peso = this.unidades_medida[0].id_unidad_medida;
                }

        }

        buscarCompra() {

                this.compraService.getCompraById(this.idCompraVentaSelected)
                        .subscribe(
                                data => {
                                        this.listaProductos = data.detalle_compra;
                                        this.agregarUnidadMedidaPeso();
                                        this.compraSelected = data.compra;
                                        this.guiasSelected = data.guiaRemision;
                                        this.ventaSelected = null;
                                        if (this.compraSelected != null) {

                                                this.idGuiaRemisionSelected = this.guiasSelected.length > 0 ? this.guiasSelected[0].id_guia_remision : null;

                                                if (this.idGuiaRemisionSelected != null) {
                                                        this.tieneComprobante = true;
                                                        this.mensajeCorrectoSinCerrar("COMPRA YA TIENE GUIA REMISION GENERADA ", "ID GUIA GENERADA: " + this.idGuiaRemisionSelected);
                                                } else {
                                                        this.tieneComprobante = false;
                                                        this.mensajeCorrecto("COMPRA ENCONTRADA - PUEDE GENERAR GUIA");
                                                }

                                                let usuario = this.obtenerUsuario()
                                                this.puntoLlegadaSelected = usuario.direccion_empresa;

                                        } else {
                                                this.mensajeInCorrecto("COMPRA NO EXISTE");
                                        }

                                        this.print(data);
                                },
                                error => this.msj = <any>error);
        }



        buscarVenta() {

                this.ventaService.getVentaById(this.idCompraVentaSelected)
                        .subscribe(
                                data => {
                                        this.listaProductos = data.detalle_venta;
                                        this.agregarUnidadMedidaPeso();
                                        this.ventaSelected = data.venta;
                                        this.guiasSelected = data.guiaRemision;
                                        this.compraSelected = null;
                                        if (this.ventaSelected != null) {

                                                this.idGuiaRemisionSelected = this.guiasSelected.length > 0 ? this.guiasSelected[0].id_guia_remision : null;

                                                if (this.idGuiaRemisionSelected != null) {
                                                        this.tieneComprobante = true;
                                                        this.mensajeCorrecto("VENTA YA TIENE GUIA REMISION GENERADA ", "ID GUIA GENERADA: " + this.idGuiaRemisionSelected);

                                                } else {
                                                        this.tieneComprobante = false;
                                                        this.mensajeCorrecto("VENTA ENCONTRADA - PUEDE GENERAR GUIA");
                                                }


                                                let usuario = this.obtenerUsuario()
                                                this.puntoPartidaSelected = usuario.direccion_empresa;
                                                this.puntoLlegadaSelected = this.ventaSelected.direccion_cliente;
                                        } else {
                                                this.mensajeInCorrecto("VENTA NO EXISTE");
                                        }

                                        this.print(data);
                                },
                                error => this.msj = <any>error);
        }




        registrar() {
                if (this.tienePermisoPrintMsj(this.rutas.FORM_GUIA_REMISION, this.rutas.BUTTON_REGISTRAR)) {
                        let usuario = this.obtenerUsuario()
                        let miRuc = usuario.ruc_empresa;
                        let mi_id_persona_empresa = usuario.id_persona_empresa;
                        this.print("mi_id_persona_empresa: " + mi_id_persona_empresa);

                        let cliente = "";
                        if (this.ventaSelected != null) {
                                cliente = this.ventaSelected.nombres_cliente + " " + this.ventaSelected.apellido_paterno_cliente + " " + this.ventaSelected.apellido_materno_cliente;
                        } else {
                                cliente = usuario.nombre_empresa;
                        }

                        let emisor = "";
                        if (this.ventaSelected != null) {
                                emisor = usuario.nombre_empresa;
                        } else {
                                emisor = this.compraSelected.nombres_proveedor;
                        }

                        let user = this.obtenerUsuario();

                        let parametros = JSON.stringify({

                                id_serie_comprobante: this.serieComprobanteSelected == null ? null : this.serieComprobanteSelected.id_serie_comprobante,
                                nombre_categoria_comprobante: this.categoriaComprobanteSelected.nombre.toUpperCase(),
                                serie: this.serieComprobanteSelected == null ? this.serieSelected : this.serieComprobanteSelected.numero,
                                numero: this.numeroSelected,
                                ruc_emisor: this.ventaSelected == null ? this.compraSelected.ruc_proveedor : miRuc,
                                ruc_destinatario: this.ventaSelected == null ? miRuc : this.ventaSelected.numero_documento_cliente,
                                punto_partida: this.puntoPartidaSelected,
                                punto_llegada: this.puntoLlegadaSelected,
                                fecha_emision: this.fechaEmisionSelected,
                                fecha_inicio_traslado: this.fechaInicioTrasladoSelected,
                                costo_minimo: this.costoMinimoSelected,
                                id_persona_destinatario: this.ventaSelected == null ? mi_id_persona_empresa : this.ventaSelected.id_persona,
                                id_persona_empresa_transporte: this.personaEmpresaSelected == null ? null : this.personaEmpresaSelected.id_persona,
                                id_conductor_vehiculo: this.conductorSelected == null ? null : this.conductorSelected.id_conductor_vehiculo,
                                motivo_traslado: this.motivoTrasladoSelected,
                                nro_orden: this.nroOrdenSelected,
                                referencia_cliente: this.referenciaClienteSelected,
                                referencia_origen: this.referenciaOrigenSelected,
                                condiciones_entrega: this.condicionesEntregaSelected,
                                tipo_guia: this.categoriaComprobanteSelected.nombre.toUpperCase(),
                                id_comprobante: this.ventaSelected == null ? this.compraSelected.id_comprobante : this.ventaSelected.id_comprobante,

                                id_tipo_moneda: this.tipoMonedaSelected == null ? null : this.tipoMonedaSelected.id_tipo_moneda,
                                id_compra_venta: this.idCompraVentaSelected,
                                lista_productos: this.listaProductos,
                                emisor: emisor
                        });


                        this.guiaRemisionService.registrar(parametros)
                                .subscribe(
                                        data => {

                                                let rpta = data.rpta;
                                                this.print("rpta: " + rpta);
                                                if (rpta != null) {
                                                        if (rpta == 1) {
                                                                this.mensajeCorrecto("ID GUIA REMISION: " + data.id_guia_remision + " REGISTRADO CORRECTAMENTE", " NUMERO GUIA: " + data.numero);
                                                                //this.limpiarCampos();
                                                               
                                                                this.idGuiaRemisionSelected = data.id_guia_remision;
                                                                this.imprimirGuiaRemision();
                                                                
                                                                this.tieneComprobante = true;
                                                                //this.buscarComprobante(data.id_comprobante);
                                                        } else {
                                                                this.mensajeInCorrecto("GUIA REMISION NO REGISTRADO");
                                                        }
                                                }

                                                //this.obtenerCatalogoVenta();

                                        },
                                        error => this.msj = <any>error
                                );
                }
        }



        mostrarCorrelativoSerie() {
                this.tipoComprobanteService.getCorrelativoByIdSerie(this.serieComprobanteSelected.id_serie_comprobante)
                        .subscribe(
                                data => {//this.vistas = data;

                                        this.numeroCorrelativoSiguiente = data;
                                },
                                error => this.msj = <any>error);
        }


        limpiarCampos() {
                this.numeroCorrelativoSiguiente = null;
                this.ventaSelected = null;
                this.compraSelected = null;
                this.listaProductos = null;
                //this.categoriaComprobanteSelected=null;
                this.tipoComprobanteSelected = null;
                this.serieComprobanteSelected = null;
                this.nroOrdenSelected = null;
                this.serieSelected = null;
                this.numeroSelected = null;
                //this.idCompraVentaSelected=null;

                this.idGuiaRemisionSelected = null;
                this.serieSelected = null;
                this.numeroSelected = null;
                this.puntoPartidaSelected = null;
                this.puntoLlegadaSelected = null;


                var f = new Date();
                this.fechaEmisionSelected = f.getFullYear() + "-" + this.completarCerosIzquierda(2, "" + (f.getMonth() + 1)) + "-" + this.completarCerosIzquierda(2, "" + f.getDate());
                this.fechaInicioTrasladoSelected = this.fechaEmisionSelected;

                this.costoMinimoSelected = null;
                this.personaEmpresaSelected = null;
                this.conductorSelected = null;

                this.nombreConductorSelected = null;
                this.nombreEmpresaTransporte = null;
                this.motivoTrasladoSelected = null;
                this.nroOrdenSelected = null;
                this.referenciaClienteSelected = null;
                this.referenciaOrigenSelected = null;
                this.condicionesEntregaSelected = null;

        }









        //**********ACCIONES PARAR FORMULARIO PERSONA********
        abrirModalPersonaDestinatario() {
                this.busquedaDestinatarioActivated = true;
                this.abrirModal("modalPersona2NewGuia");
        }


        //**********ACCIONES PARAR FORMULARIO PERSONA********
        abrirModalPersona() {
                this.busquedaDestinatarioActivated = false;
                this.abrirModal("modalPersona2NewGuia");
                this.formFindPersona.obtenerPersonas();
               
        }

        //**********METODO QUE OBTIENE LOS DATOS EXTERNOS PERSONA *****
        obtenerDatosPersonaExterna(datos) {

                if (this.busquedaDestinatarioActivated) {
                        this.personaDestinatarioSelected = datos.bean;
                        this.nombrePersonaDestinatario = this.personaDestinatarioSelected.nombres + " " + this.personaDestinatarioSelected.apellido_paterno + " " + this.personaDestinatarioSelected.apellido_materno;
                } else {
                        this.personaEmpresaSelected = datos.bean;
                        this.nombreEmpresaTransporte = this.personaEmpresaSelected.nombres + " " + this.personaEmpresaSelected.apellido_paterno + " " + this.personaEmpresaSelected.apellido_materno;
                }

                this.cerrarModal("modalPersona2NewGuia");
                this.print("DATOS EXTERNOS: ");
                this.print(datos);
        }



        //**********ACCIONES PARAR FORMULARIO CONDUCTOR********
        abrirModalConductor() {
                this.abrirModal("modalConductorGuia");
                this.formFindConductor.obtenerConductores();
        }

        //**********METODO QUE OBTIENE LOS DATOS EXTERNOS Conductor *****
        obtenerDatosConductorExterna(datos) {
                this.conductorSelected = datos.bean;
                this.nombreConductorSelected = this.conductorSelected.conductor;

                this.cerrarModal("modalConductorGuia");
                this.print("DATOS EXTERNOS: ");
                this.print(datos);
        }

}