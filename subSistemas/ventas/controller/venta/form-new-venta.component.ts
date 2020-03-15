import { Component, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';
import { switchMap, debounceTime } from "rxjs/operators";

import { ControllerComponent } from '../../../../core/controller/controller.component';




/******************IMPORTAR SERVICIOS*************** */


import { VentaService } from '../../service/venta.service';
import { TipoMonedaService } from '../../../mantenedores/service/tipo-moneda.service';
import { ProductoService } from '../../../mantenedores/service/producto.service';
import { CatalogoVentaService } from '../../../mantenedores/service/catalogo-venta.service';
import { FormComprobanteComponent } from '../form-comprobante.component';
import { UnidadMedidaService } from '../../../mantenedores/service/unidad-medida.service';
import { StockService } from '../../../mantenedores/service/stock.service';
import { FormCatalogoVentaComponent } from '../../../mantenedores/controller/form-catalogo-venta.component';
import { FormGuiaRemisionComponent } from '../../../mantenedores/controller/form-guia-remision.component';
import { FormCotizacionComponent } from '../../../ventas/controller/form-cotizacion.component';
import { ReportePdfService } from '../../../../core/service/reporte-pdf.Service';
import { ReporteExcelService } from '../../../../core/service/reporte-excel.Service';
import { LocalService } from '../../../mantenedores/service/local.service';
import { MedioPagoService } from '../../../mantenedores/service/medio-pago.service';
import { ClienteService } from '../../../mantenedores/service/cliente.service';
import { CotizacionService } from '../../service/cotizacion.service';
import { CategoriaComprobanteService } from '../../../mantenedores/service/categoria-comprobante.service';
import { TipoComprobanteService } from '../../../mantenedores/service/tipo-comprobante.service';
import { SerieComprobanteService } from '../../../mantenedores/service/serie-comprobante.service';
import { FormFindClienteComponent } from 'src/app/subSistemas/mantenedores/controller/cliente/form-find-cliente.component';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { FormNewPersonaComponent } from 'src/app/subSistemas/mantenedores/controller/persona/form-new-persona.component';
import {PorcentajeService} from 'src/app/subSistemas/mantenedores/service/porcentaje.service';
import {TipoCambioService} from 'src/app/subSistemas/mantenedores/service/tipo-cambio.service';
declare var $: any;
@Component({
        selector: 'form-new-venta',
        templateUrl: '../../view/venta/form-new-venta.component.html',
        providers: [TipoCambioService,PorcentajeService,ProductoService, CategoriaComprobanteService, TipoComprobanteService, SerieComprobanteService, CotizacionService, ClienteService, MedioPagoService, TipoMonedaService, VentaService, ReportePdfService, ReporteExcelService, UnidadMedidaService, StockService, LocalService]

})

export class FormNewVentaComponent extends ControllerComponent implements AfterViewInit {

        unidadMedidaSelected: any;
        registro_actualizacion: boolean = false;
        tituloPanel: string = "Registro de Ventas";

        //id_venta_busqueda:number;
        //fechaInicio:any;
        //fechaFin:any;
        is_pagada: boolean = false;
        is_no_pagada: boolean = false;
        fecha_pago: any;
        observacion: any;
        medioPagoSelected: any = null;
        mediosPago: any[];

        estadoSelected: string;
        unidades_medida: any[];
        tiposMoneda: any[];
        tipoMonedaSelected: any;
        precioS:number;
        listaProductos: any[];
        lista_locales:any[];
        MIN:number;
        //ventas: any[];

        type_prom:number;
        type_compra: number;
        type_venta: number;

        lista_stock: any[];
        lista_ultimas_ventas: any[];
        simboloMonedaSelected: any;
        idTipoMonedaSelected: any;

        indiceSeleccionado: number;
        PorcentajeIncorrecto:boolean = false;

        //************OBJETO ELEGIDO PARA EDITAR************
        beanSelected: any;


        //***********PANELES DE LOS MANTENEDORES***********
        panelEditarSelected: boolean = false;
        panelListaBeanSelected: boolean = true;
        busquedaMarcadaChecked: boolean = false;
        datalistProduct:any[];

        ActiveMoneda:boolean = true;
        StockProducto:any;



        //****************OBTEJOS OBTENIDOS DEL FORMULARIO PRODUCTO
        beanSelectedExterno: any;
        idProductoSelected: number;

        buttonSelectedActivatedPro: boolean = true;
        buttonEliminarActivatedPro: boolean = false;
        buttonEditarActivatedPro: boolean = false;

        panelEditarVentaSelected: boolean = false;
        panelDetalleVentaSelected: boolean = false;
        listaProductosDetalle: any[];
        ventaSelected: any;
        ActiveSelect:any;

        //****************OBTEJOS OBTENIDOS DEL FORMULARIO CLIENTE
        clienteSelected: any = {
                numero_documento: null,
                nombres: null,
                apellido_paterno: null,
                apellido_materno: null
        }


        buttonSelectedActivatedCli: boolean = true;
        buttonEliminarActivatedCli: boolean = false;
        buttonEditarActivatedCli: boolean = false;



        //****************OBTEJOS OBTENIDOS DEL FORMULARIO PROVEEDOR
        activatedSelectedProve: boolean = true;




        panelRegistroSelected: boolean = false;
        valid:boolean= true;

        montoTotalSelected: string = "0";
        subTotalSelected: string = "0";
        igvSelected: string = "0";
        idVentaSelected: number;

        ventaRealizada: boolean = false;

        panelListaCatalogoVenta: boolean = false;
        panelListaCatalogoVentaDerecha: boolean = true;

        estiloTablaDerechaCatalogo: string = "col-md-8 quitar-borde";
        estiloBusquedaCatalogo: string = "col-md-4 quitar-borde";

        colMd2Catalogo: string = "col-md-12";
        colMd4Catalogo: string = "col-md-12";
        col1Md2Catalogo: string = "col-md-4";
        campoOcultoVenta = true;

        @ViewChild(FormCatalogoVentaComponent,{static: true}) formCatalogoVentaComponent: FormCatalogoVentaComponent;
        @ViewChild(FormCotizacionComponent,{static: true}) formCotizacionComponent: FormCotizacionComponent;

        tabsComprobanteActivated: boolean = false;
        tabsGuiaRemisionActivated: boolean = false;

        precioCorrecto: boolean = true;
        clavePermiso: string;
        indObjSeleccionadoClave: any;

        almacenesUsuario: any[];
        almacenUsuarioSelected: any;

        incluyeIgvSelected: boolean = true;
        cantidadCeldas: number = 1;

        /***OBJETOS DEL FORMULARIO EMPLEADO*****/
        buttonSelectedActivatedEmple: boolean = true;
        empleadoSelected: any;


        /*****OBJETOS LOCALES**********/
        locales: any[];
        localSelected: any;
        precio:any[];

        /*************VARIBLES PARA EL AUTOCOMPLETADO***/
        indiceLista: any = -1;
        tamanio_lista_mostrar: number = 100;
        precioDescu:any;
        tipoCambio:any[];

        /*****************GENERAR COMPROBANTE*****************/
        categoriaComprobanteSelected: any = null;
        tipoComprobanteSelected: any = null;
        serieComprobanteSelected: any = null;
        numeroCorrelativoSiguiente: number;
        categoriasComprobante: any[];
        tiposComprobante: any[];
        seriesComprobante: any[];
        fechaSelected: any;
        porcentaje1:number;
        estadoModificacion :number = 1;

        /************GENERAR GUIA*************/
        serieGuiaSelected: any;
        numeroGuiaSelected: any;

        puntoPartidaSelected: any;
        puntoLlegadaSelected: any;
        fechaEmisionSelected: any;
        fechaInicioTrasladoSelected: any;
        motivoTrasladoSelected: any;
        nroOrdenSelected: any;
        referenciaClienteSelected: any;
        referenciaOrigenSelected: any;
        condicionesEntregaSelected: any;
        tipoMonedaCostoSelected: any;
        costoMinimoSelected: any;
        id_guia_remision: any = null;
        diasCreditoSelected: number;

        checkGenerarGuia: boolean = false;
        checkGenerarComprobante: boolean = false;

        id_producto_busqueda: any;
        idComprobanteSelected: any;



        @ViewChild(FormFindClienteComponent,{static: true}) formFindCliente: FormFindClienteComponent;
        @ViewChild(FormNewPersonaComponent,{static: true}) formNewPersona: FormNewPersonaComponent;

        ActiveGrupo:boolean=true;

        searchField: FormControl;
        coolForm: FormGroup;

        lastkeydown1: number = 0;
        lastkeydown2: number = 0;
        inactivo: boolean = false;

        tamTexto: any[];

        nombresSelected: string;
        numeroDocSelected: string;
        lista_autocompletado_cliente: any[];

        lista_productos_data: any[] = [];
        userList1: any[] = [];

        lista_clientes_data: any[] = [];
        lista_clientes_nombres_autocompletada: any[] = null;
        lista_clientes_nro_doc_autocompletada: any[] = null;

        constructor(
                private fb: FormBuilder,
                public http: Http,
                public router: Router,
                public ventaService: VentaService,
                public reportePdfService: ReportePdfService,
                public reporteExcelService: ReporteExcelService,
                public tipoMonedaService: TipoMonedaService,
                public unidadMedidaService: UnidadMedidaService,
                public stockService: StockService,
                public localService: LocalService,
                public medioPagoService: MedioPagoService,
                public clienteService: ClienteService,
                public cotizacionService: CotizacionService,
                public catalogoVentaService: CatalogoVentaService,
                public categoriaComprobanteService: CategoriaComprobanteService,
                public tipoComprobanteService: TipoComprobanteService,
                public serieComprobanteService: SerieComprobanteService,
                public productoService: ProductoService,
                public porcentajeService:PorcentajeService,
                public tipoCambioService:TipoCambioService
        ) {
                super(router, reportePdfService, reporteExcelService);



                /************BUSQUEDA DE AUTOCOMPLETADO , TODOS LOS PRODUCTOS************/

                this.obtenerTodosClientes();
                this.obtenerTodosProductosPrecio();
                this.obtenerPorcentaje();
                this.obtenerTipodeCambio();
                


                this.valid = true;
                this.panelEditarSelected = false;

              
        }




        ngOnInit() {
                this.limpiarCampos();
                this.listaProductos = new Array();
                this.lista_locales = new Array();
                this.obtenerCategoriasComprobanteVenta();

                this.tiposMoneda = JSON.parse(localStorage.getItem("lista_tipos_moneda"));
                this.unidades_medida = JSON.parse(localStorage.getItem("lista_unidades_medida"));
                this.locales = JSON.parse(localStorage.getItem("lista_locales"));
                this.mediosPago = JSON.parse(localStorage.getItem("lista_medios_pago"));
                let almacenSesion = JSON.parse(localStorage.getItem("almacen_start"));
                this.lista_locales.push(almacenSesion);
            


                if (this.tiposMoneda != null) {
                        this.tipoMonedaSelected = this.tiposMoneda[0];
                        this.simboloMonedaSelected = this.tipoMonedaSelected.simbolo;
                        this.idTipoMonedaSelected = this.tipoMonedaSelected.id_tipo_moneda;
                }

                if (this.unidades_medida) {
                        this.unidadMedidaSelected = this.unidades_medida[0];
                }

                
                this.tamPagina = 100;
                this.fin = 100;
                
                this.almacenesUsuario = this.lista_locales;
                this.almacenUsuarioSelected = this.almacenesUsuario != null ? this.almacenesUsuario[0] : null;

                this.formFindCliente.buttonSelectedActivated = true;
                this.formCotizacionComponent.isModal = true;
                this.formCatalogoVentaComponent.isModal = true;
                this.formNewPersona.isModal = true;

                
                //this.formNewPersona.checkClienteActivado=true;
                this.formNewPersona.isClienteSelected = true;
             
            
               
        }


        ngAfterViewInit() {
                this.tamTexto = new Array();
                 if (this.verificarTokenRpta(this.rutasMantenedores.FORM_VENTA)) {
                         //this.formFindCliente.obtenerClientes();
                         $("#buttonClienteRegistro").focus();
                 }
                
                }

        abrirPanelComprobante() {

                if (this.medioPagoSelected == null) {
                        this.obtenerMediosPago();
                }

                if (this.fechaSelected == null) {
                        this.fechaSelected = this.obtenerFechaActual();
                        this.print("*************FECHA_ACTUAL:");
                        this.print(this.fechaSelected);
                }


        }


        obtenerPorcentaje(){
                this.porcentajeService.getAll().subscribe(
                        data=>{
                                this.porcentaje1 = data[0].porcentaje;
                        }
                );
        }
        obtenerCategoriasComprobanteVenta() {

                this.categoriaComprobanteService.getAllVenta()
                        .subscribe(
                                data => {

                                        this.categoriasComprobante = data;
                                        this.categoriaComprobanteSelected = this.categoriasComprobante != null ? this.categoriasComprobante[0] : null;
                                        this.mostrarTiposComprobante();
                                },
                                error => this.msj = <any>error);
        }

        mostrarTiposComprobante() {
                this.obtenerTiposComprobanteByIdCategoria(this.categoriaComprobanteSelected.id_categoria_comprobante);
                this.limpiarCampos();

              
        }

        obtenerTiposComprobanteByIdCategoria(id) {

                this.tipoComprobanteService.getByIdCategoria(id)
                        .subscribe(
                                data => {
                                        this.tiposComprobante = data;
                                        this.print("tipos comprobante: ");
                                        this.print(this.tiposComprobante);
                                        let i;
                                        for (i = 0; i < this.tiposComprobante.length; i++) {
                                                if (this.tiposComprobante[i].nombre == 'GUIA REMISION') {
                                                        this.tiposComprobante.splice(i, 1);
                                                }
                                        }


                                },
                                error => this.msj = <any>error);
        }

        mostrarSeriesComprobante() {
                this.obtenerSeriesComprobanteByIdTipo(this.tipoComprobanteSelected.id_tipo_comprobante);

        }


        mostrarSeriesComprobanteEditar(id_serie_comprobante) {

                this.serieComprobanteService.getByIdTipo(this.tipoComprobanteSelected.id_tipo_comprobante)
                        .subscribe(
                                data => {//this.vistas = data;

                                        this.seriesComprobante = data;

                                        if (this.seriesComprobante != null) {

                                                this.serieComprobanteSelected = this.obtenerSerieComprobanteActualEditar(id_serie_comprobante);
                                                /*if(this.seriesComprobante.length>0){
                                                        this.serieComprobanteSelected=this.seriesComprobante[0];
                                                        this.mostrarCorrelativoSerie();
                                                }*/
                                        }

                                },
                                error => this.msj = <any>error);
        }

        obtenerSeriesComprobanteByIdTipo(id) {

                this.serieComprobanteService.getByIdTipo(id)
                        .subscribe(
                                data => {//this.vistas = data;

                                        this.seriesComprobante = data;

                                        if (this.seriesComprobante != null) {
                                                if (this.seriesComprobante.length > 0) {
                                                        this.serieComprobanteSelected = this.seriesComprobante[0];
                                                        this.mostrarCorrelativoSerie();
                                                }
                                        }

                                },
                                error => this.msj = <any>error);
        }



        mostrarCorrelativoSerie() {
                this.tipoComprobanteService.getCorrelativoByIdSerie(this.serieComprobanteSelected.id_serie_comprobante)
                        .subscribe(
                                data => {//this.vistas = data;

                                        this.numeroCorrelativoSiguiente = data;
                                },
                                error => this.msj = <any>error);
        }


        obtenerLocales() {
                this.localService.getAll()
                        .subscribe(
                                data => {
                                        this.locales = data;

                                        this.print(data);
                                },
                                error => this.msj = <any>error);
        }

        obtenerMediosPago() {

                this.medioPagoService.getAll()
                        .subscribe(
                                data => {//this.vistas = data;

                                        this.mediosPago = data;
                                        if (this.mediosPago != null) {
                                                if (this.mediosPago.length > 0) {
                                                        this.medioPagoSelected = this.mediosPago[0];
                                                }
                                        }
                                },
                                error => this.msj = <any>error);
        }

        verStock(obj) {

                this.abrirModal("modalStockProductoVenta");

                this.stockService.getDetalleById(obj.id_producto)
                        .subscribe(
                                data => {
                                        this.lista_stock = data;
                                },
                                error => this.msj = <any>error);
        }

        // verUltimasVentas(obj, indice) {

        //         this.abrirModal("modalUltimasVentas");
        //         this.indiceSeleccionado = indice;
        //         let parametros = JSON.stringify({
        //                 id_producto: obj.id_producto,
        //                 id_cliente: this.clienteSelected != null ? this.clienteSelected.id_cliente : null
        //         });

        //         this.ventaService.getUltimasVentas(parametros)
        //                 .subscribe(
        //                         data => {
        //                                 this.lista_ultimas_ventas = data;
        //                                 this.print("ultimas ventas: " + parametros);
        //                                 this.print(this.lista_ultimas_ventas);
        //                         },
        //                         error => this.msj = <any>error);
        // }



        seleccionarUltimaVenta(obj, indice) {
                this.cerrarModal("modalUltimasVentas");
                this.listaProductos[this.indiceSeleccionado].precio_venta = obj.precio;

        }



        obtenerUnidadesMedida() {

                let parametros = JSON.stringify({
                        id_unidad_medida: null,
                        nombre: null,
                        orden_presentacion: null,
                        observacion: null,
                        simbolo: null,
                        is_para_comprobante: 1
                });

                this.unidadMedidaService.buscarPaginacion(1, 1000, 1000, parametros)
                        .subscribe(
                                data => {//this.vistas = data;

                                        this.unidades_medida = data;
                                        if (this.unidades_medida) {
                                                this.unidadMedidaSelected = this.unidades_medida[0];
                                        }
                                },
                                error => this.msj = <any>error);
        }

        abrirPanelBuscar() {

                this.panelEditarSelected = false;
                this.panelListaBeanSelected = true;

        }

        abrirPanelRegistrar() {
                //this.panelEditarSelected = false;
                //this.panelListaBeanSelected = true;

                this.panelRegistroSelected = true;
        }

        abrirPanelEditar(pro) {
                if (this.tienePermisoPrintMsj(this.rutas.FORM_VENTA, this.rutas.PANEL_EDITAR)) {
                        this.print(pro);

                        this.beanSelected = pro;

                        this.fecha_pago = pro.fecha_pago == null ? null : pro.fecha_pago.substr(0, 10);
                        this.observacion = pro.observacion;
                        this.print(this.fecha_pago);
                        this.is_pagada = pro.is_pagada;

                        this.panelEditarSelected = true;
                        this.panelListaBeanSelected = false;
                }
        }


        obtenerMedioPagoActual(id: string) {
                let obj = null;
                let i;
                for (i = 0; i < this.mediosPago.length; i++) {
                        if (this.mediosPago[i].id_medio_pago == id) {
                                obj = this.mediosPago[i];
                                break;
                        }
                }
                return obj;
        }


        obtenerTipoComprobanteActualEditar(id_tipo_comprobante: number) {
                let obj = null;
                let i;
                for (i = 0; i < this.tiposComprobante.length; i++) {
                        //this.print("this.tipos_producto[i].nombre"+this.tipos_producto[i].nombre+" , nombreTipo: " +nombreTipo);
                        if (this.tiposComprobante[i].id_tipo_comprobante == id_tipo_comprobante) {
                                obj = this.tiposComprobante[i];

                                break;
                        }
                }
                return obj;
        }


        obtenerSerieComprobanteActualEditar(id_serie_comprobante: string) {
                let obj = null;
                let i;
                for (i = 0; i < this.seriesComprobante.length; i++) {
                        //this.print("this.tipos_producto[i].nombre"+this.tipos_producto[i].nombre+" , nombreTipo: " +nombreTipo);
                        if (this.seriesComprobante[i].id_serie_comprobante == id_serie_comprobante) {
                                obj = this.seriesComprobante[i];
                                break;
                        }
                }
                return obj;
        }

        //abrirPanelEditarVenta(pro) {
        setBeanEditar(pro) {
                this.idComprobanteSelected = null;
                this.registro_actualizacion = true;
                if (this.tienePermisoPrintMsj(this.rutas.FORM_VENTA, this.rutas.PANEL_EDITAR)) {

                        this.idVentaSelected = pro.id_venta;
                        this.panelEditarVentaSelected = true;
                        this.panelListaBeanSelected = false;
                        this.ventaService.getVentaById(pro.id_venta)
                                .subscribe(
                                        data => {
                                                this.listaProductos = data.detalle_venta;
                                                this.ventaSelected = data.venta;

                                                this.incluyeIgvSelected = this.ventaSelected.inc_igv;
                                                this.tipoMonedaSelected = this.obtenerTipoMonedaActualId(this.ventaSelected.id_tipo_moneda);
                                                this.almacenUsuarioSelected = this.obtenerAlmacenActualId(this.ventaSelected.id_almacen);
                                                let comprobante = data.comprobante;

                                                if (comprobante != null) {
                                                        this.checkGenerarComprobante = true;
                                                        this.tipoComprobanteSelected = this.obtenerTipoComprobanteActualEditar(comprobante.id_tipo_comprobante);
                                                        this.mostrarSeriesComprobanteEditar(comprobante.id_serie_comprobante);
                                                        this.numeroCorrelativoSiguiente = comprobante.numero;
                                                        this.medioPagoSelected = this.obtenerMedioPagoActual(comprobante.id_medio_pago);
                                                        this.fechaSelected = comprobante.fecha;

                                                }

                                                this.clienteSelected = {
                                                        id_cliente: this.ventaSelected.id_cliente,
                                                        nombres: this.ventaSelected.nombres_cliente,
                                                        numero_documento: this.ventaSelected.numero_documento_cliente,
                                                        direccion: this.ventaSelected.direccion_cliente,
                                                        apellido_paterno: "",
                                                        apellido_materno: ""
                                                }

                                                this.montoTotalSelected = this.ventaSelected.monto_total;
                                                this.subTotalSelected = this.ventaSelected.sub_total;
                                                this.igvSelected = this.ventaSelected.igv;

                                               

                                                this.print(data);
                                        },
                                        error => this.msj = <any>error);

                }
        }


        regresar() {
                this.limpiarCampos();

                this.panelEditarSelected = false;
                this.panelListaBeanSelected = true;
        }






        obtenerTipoMoneda() {

                this.tipoMonedaService.getAll()
                        .subscribe(
                                data => {//this.vistas = data;

                                        this.tiposMoneda = data;
                                        if (this.tiposMoneda != null) {
                                                this.tipoMonedaSelected = this.tiposMoneda[0];
                                                this.simboloMonedaSelected = this.tipoMonedaSelected.simbolo;
                                                this.idTipoMonedaSelected = this.tipoMonedaSelected.id_tipo_moneda;
                                        }
                                },
                                error => this.msj = <any>error);
        }






        mostrarImagen(pro) {
                this.beanSelected = pro;
                this.abrirModal("modalImagenProducto");

        }


        reportePDf() {

                let parametros = JSON.stringify({ idUsuario: 12 });
                this.reportePdfService.generarFacturaPdf(parametros)
                        .subscribe(
                                data => {
                                        if (data._body.size == 0) {
                                                this.mensajeInCorrecto("DOCUMENTO DIGITALIZADO NO ENCONTRADO - HA SIDO ELIMINADO ARCHIVO ADJUNTO");
                                        } else {

                                                //this.abrirPDF(data._body);
                                                this.abrirDocumentoModal(data._body);
                                                this.abrirModalPDf("modalPDF");
                                        }

                                        //let rutaFile = data.json().rutaFile;
                                        //let nameFile = data.json().nameFile;

                                        //if (rutaFile != null && nameFile != null) {
                                        //this.abrirModal();
                                        //this.abrirPDFModalFileServer(rutaFile, "mostrarPDF");
                                        //setTimeout(() => { this.reporteService.eliminarFileServer(nameFile).subscribe(); }, 2000);
                                        //}
                                },
                                error => this.msj = <any>error
                        );

        }


        generarComprobante() {
                $('.nav-tabs a[href="#comprobanteVenta"]').tab('show');
                //this.formComprobante.obtenerCategoriasComprobanteVenta();
                //this.formComprobante.idCompraVentaSelected = this.idVentaSelected;

        }

        generarGuiaRemision() {
                $('.nav-tabs a[href="#guiaRemision"]').tab('show');
                //this.formGuiaRemision.obtenerCategoriasComprobanteVenta();
                //this.formGuiaRemision.idCompraVentaSelected = this.idVentaSelected;
        }


        guardar() {

                this.print("id venta: " + this.idVentaSelected);        
                if (this.idVentaSelected == null) {
                        this.registrar();
                        this.print("REGISTRANDO VENTA");
                } else {
                        this.editarVenta();
                        this.print("EDITANDO VENTA");
                }
        }


        registrar() {

                if (this.tienePermisoPrintMsj(this.rutas.FORM_VENTA, this.rutas.BUTTON_REGISTRAR)) {
                        
                       
                        let user = this.obtenerUsuario();
                        let miRuc = user.ruc_empresa;
                        let mi_id_persona_empresa = user.id_persona_empresa;
                        this.print("mi_id_persona_empresa: " + mi_id_persona_empresa);

                        let cliente = this.clienteSelected.nombres + " " + this.clienteSelected.apellido_paterno + " " + this.clienteSelected.apellido_materno;
                        let emisor = user.nombre_empresa;


                        let f = new Date();
                        this.print("this.listaProductos: ")
                        this.print(this.listaProductos);
                        let parametros = JSON.stringify({
                                is_actualizacion: this.registro_actualizacion,
                                id_venta: this.idVentaSelected,
                                id_cliente: this.clienteSelected.id_cliente,
                                monto_total: this.montoTotalSelected,
                                sub_total: this.subTotalSelected,
                                igv: this.igvSelected,
                                id_empleado: user.id_empleado,
                                id_tipo_moneda: this.idTipoMonedaSelected,
                                lista_productos: this.listaProductos,
                                id_almacen: this.almacenUsuarioSelected == null ? null : this.almacenUsuarioSelected.id_local,
                                is_pagada: this.is_pagada == true ? 1 : 0,
                                fecha_pago: null,
                                emisor: emisor,
                                inc_igv: this.incluyeIgvSelected == true ? 1 : 0,
                                dias_credito: this.diasCreditoSelected,
                                medio_pago: this.medioPagoSelected != null ? this.medioPagoSelected.nombre : null,

                                nombre_categoria_comprobante: 'VENTA',
                                serie_guia: this.serieGuiaSelected,
                                numero_guia: this.numeroGuiaSelected,
                                ruc_emisor: miRuc,
                                ruc_destinatario: this.clienteSelected.numero_documento,
                                punto_partida: this.puntoPartidaSelected,
                                punto_llegada: this.puntoLlegadaSelected,
                                fecha_emision: this.fechaEmisionSelected,
                                fecha_inicio_traslado: this.fechaInicioTrasladoSelected,
                                costo_minimo: this.costoMinimoSelected,
                                id_persona_destinatario: mi_id_persona_empresa,
                                id_persona_empresa_transporte: null,
                                id_conductor_vehiculo: null,
                                motivo_traslado: this.motivoTrasladoSelected,
                                nro_orden: this.nroOrdenSelected,
                                referencia_cliente: this.referenciaClienteSelected,
                                referencia_origen: this.referenciaOrigenSelected,
                                condiciones_entrega: this.condicionesEntregaSelected,
                                tipo_guia: 'VENTA',
                                id_tipo_moneda_costo: this.tipoMonedaCostoSelected == null ? null : this.tipoMonedaCostoSelected.id_tipo_moneda,


                                //DATOS DE COMPROBANTE VENTA
                                id_tipo_comprobante: this.tipoComprobanteSelected == null ? null : this.tipoComprobanteSelected.id_tipo_comprobante,
                                serie_comprobante: this.serieComprobanteSelected == null ? null : this.serieComprobanteSelected.numero,
                                numero_comprobante: this.numeroCorrelativoSiguiente,
                                fecha_comprobante: this.fechaSelected,
                                id_serie_comprobante: this.serieComprobanteSelected == null ? null : this.serieComprobanteSelected.id_serie_comprobante,
                                id_medio_pago: this.medioPagoSelected == null ? null : this.medioPagoSelected.id_medio_pago,
                                nombre_medio_pago:  this.medioPagoSelected != null ?this.medioPagoSelected.nombre:null,

                                ruc_receptor: this.clienteSelected.numero_documento,


                                cliente: cliente,
                                telefono: this.clienteSelected.telefono,
                                direccion: this.clienteSelected.direccion,

                                checkGenerarComprobante: this.checkGenerarComprobante,
                                checkGenerarGuia: this.checkGenerarGuia
                        });





                        this.print(parametros);


                        this.ventaService.registrar(parametros)
                                .subscribe(
                                        data => {
                                                this.idVentaSelected = data.id_venta
                                                this.idComprobanteSelected = data.id_comprobante;
                                                let rpta = data.rpta;
                                                
                                                if (rpta != null) {
                                                        if (rpta == 1) {
                                                                //this.ventaRealizada=true;

                                                                if (this.registro_actualizacion) {
                                                                        this.mensajeCorrecto("VENTA ACTUALIZADA CORRECTAMENTE");
                                                                } else {
                                                                        this.mensajeCorrectoSinCerrar("VENTA REGISTRADA CORRECTAMENTE  - COD :" + this.idVentaSelected);
                                                                        this.limpiar();
                                                                        //this.obtenerTodosProductosPrecio();
                                                                }
                                                                //this.imprimirComprobante2();
                                                                //this.limpiarCampos();
                                                        } else {
                                                                if (this.registro_actualizacion) {
                                                                        this.mensajeInCorrecto("VENTA NO ACTUALIZADA ");
                                                                } else {
                                                                        this.mensajeInCorrecto("VENTA NO REGISTRADA FALTAN INGRESAR DATOS A LA VENTA");
                                                                }
                                                                //this.ventaRealizada=false;
                                                        }
                                                }

                                                //this.obtenerVentas();

                                        },
                                        error => this.msj = <any>error
                                );
                } else {
                        this.mensajeInCorrecto("LOS PRECIOS DE VENTA SON ERRONEOS");
                }
                //}
        }


        eliminar_insertar() {

                if (this.tienePermisoPrintMsj(this.rutas.FORM_VENTA, this.rutas.BUTTON_ELIMINAR)) {

                        let user = this.obtenerUsuario();
                        if (confirm("Realmente Desea Actualizar?")) {
                                this.ventaService.eliminarLogicoEmpleado(this.idVentaSelected + "", user.id_empleado)
                                        .subscribe(
                                                data => {

                                                        let rpta = data;
                                                        if (rpta != null) {
                                                                if (rpta == 1) {
                                                                        this.registrar();
                                                                } else {
                                                                        this.mensajeInCorrecto("VENTA NO ACTUALIZADA");
                                                                }

                                                        }
                                                },
                                                error => this.msj = <any>error);
                        }
                }
        }


        editarVenta() {


                if (this.tienePermisoPrintMsj(this.rutas.FORM_VENTA, this.rutas.BUTTON_ACTUALIZAR)) {

                        if(this.estadoModificacion == 1){
                                let user = this.obtenerUsuario();

                                                        let parametros = JSON.stringify({
                                                        id_cliente: this.clienteSelected.id_cliente,      
                                                        id_empleado: user.id_empleado,
                                                        igv: this.igvSelected,
                                                        inc_igv: this.incluyeIgvSelected == true ? 1 : 0,
                                                        id_almacen: this.almacenUsuarioSelected == null ? null : this.almacenUsuarioSelected.id_local,
                                                        id_tipo_moneda: this.idTipoMonedaSelected,
                                                        monto_total: this.montoTotalSelected,
                                                        sub_total: this.subTotalSelected,
                                                        lista_productos: this.listaProductos
                                                        });

                                         this.ventaService.updateVenta(this.idVentaSelected,parametros).subscribe(
                                 data=>{
                                         let rpta = data.rpta;
                                         this.limpiarCampos();
                                         this.print("rpta: " + rpta);
                                         if (rpta != null) {
                                                 if (rpta == 1) {
                                                         this.mensajeCorrecto("VENTA MODIFICADO");
                                                 } else {
                                                         this.mensajeInCorrecto("VENTA NO MOFICADO");
                                                 }
                                         }
                                 }
                         );                  

                        }else{

                             this.eliminar_insertar();   
                        }
                        
                
                       
                        
                      
                        
                }
                        
        }

        limpiar() {
                this.limpiarCampos();
                this.inicio = 1;
                this.fin = 10;
                this.tamPagina = 10;
                this.PorcentajeIncorrecto = false;
                this.valid = true;
                this.estadoModificacion=1;

        }

        limpiarBusqueda() {
                this.limpiarCamposBusqueda();
                this.inicio = 1;
                this.fin = 10;
                this.tamPagina = 10;

        }





        editar() {

                if (this.tienePermisoPrintMsj(this.rutas.FORM_VENTA, this.rutas.BUTTON_ACTUALIZAR)) {
                        let parametros = JSON.stringify({
                                is_pagada: this.is_pagada == true ? 1 : 0,
                                fecha_pago: this.fecha_pago,
                                observacion: this.observacion
                        });
                        this.ventaService.editar(parametros, this.beanSelected.id_venta)
                                .subscribe(
                                        data => {

                                                let rpta = data.rpta;
                                                this.print("rpta: " + rpta);
                                                if (rpta != null) {
                                                        if (rpta) {
                                                                this.mensajeCorrecto("VENTA MODIFICADA");
                                                        } else {
                                                                this.mensajeInCorrecto("ERROR AL MODIFICAR");
                                                        }
                                                }

                                        },
                                        error => this.msj = <any>error
                                );
                }
        }





        limpiarCampos() {
                this.registro_actualizacion = false;
                this.tituloPanel = "Registro de Ventas";
                this.ventaSelected = null;
                this.idVentaSelected = null;
                this.listaProductos = null;
                this.idComprobanteSelected = null;

                this.medioPagoSelected = null;
                this.fecha_pago = null;
                this.is_pagada = null;
                this.beanSelectedExterno = null;
                this.panelRegistroSelected = false;
                this.clienteSelected = {
                        numero_documento: null,
                        nombres: null,
                        apellido_paterno: null,
                        apellido_materno: null
                }
                this.listaProductos = new Array();
                this.simboloMonedaSelected = null;
                this.montoTotalSelected = "0";
                this.subTotalSelected = "0";
                this.igvSelected = "0";
                this.idVentaSelected = null;
                this.estadoSelected = "";
                this.localSelected = null;
                this.empleadoSelected = null;

                this.tipoComprobanteSelected = null;
                this.serieComprobanteSelected = null;
                this.medioPagoSelected = null;
                this.numeroCorrelativoSiguiente = null;
                this.fechaSelected = null;

                this.numeroGuiaSelected = null;
                this.serieGuiaSelected = null;
                this.fechaEmisionSelected = null;
                this.fechaInicioTrasladoSelected = null;

                this.checkGenerarComprobante = false;
                this.checkGenerarGuia = false;
                this.estadoModificacion == 1;

        }

        limpiarCamposBusqueda() {

                this.medioPagoSelected = null;
                this.fecha_pago = null;
                this.is_pagada = null;
                this.is_no_pagada = null;
                this.beanSelectedExterno = null;
                this.panelRegistroSelected = false;
                this.clienteSelected = {
                        numero_documento: null,
                        nombres: null,
                        apellido_paterno: null,
                        apellido_materno: null
                }
                this.listaProductos = new Array();
                this.simboloMonedaSelected = null;
                this.montoTotalSelected = "0";
                this.subTotalSelected = "0";
                this.igvSelected = "0";
                this.idVentaSelected = null;
                this.estadoSelected = "";
                this.localSelected = null;
                this.empleadoSelected = null;
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






        //**********ACCIONES PARAR FORMULARIO PRODUCTO********
        abrirModalCatalogoVenta() {
                this.formCatalogoVentaComponent.limpiarCampos();
                //this.cerrarPanelRegistrar();
                this.abrirModalPorc("modalCatalogoVenta", 90);
                this.formCatalogoVentaComponent.clienteSelected = this.clienteSelected;
                this.formCatalogoVentaComponent.busquedaClienteVenta = true;
                this.formCatalogoVentaComponent.checkPorCliente = false;
                this.formCatalogoVentaComponent.clienteVentaSelected = this.clienteSelected;
                this.formCatalogoVentaComponent.buscar();
                /*this.print("id_cliente_transmitido ori");
                this.print(this.clienteSelected);
                this.print("id_cliente_transmitido");
                this.print(this.formCatalogoVentaComponent.clienteSelected);*/

                //this.panelListaBeanSelectedPer = true;
        }


        //**********ACCIONES PARAR FORMULARIO Cliente********
        abrirModalCliente() {


                if (this.formFindCliente.listaClientes == null) {
                        this.formFindCliente.obtenerClientes();
                }

                this.abrirModal("modalClienteNewVenta");

                let obj = $("#modalClienteNewVentaPnl").find("input#nroDocClienteBusqueda");
                this.print("inpus nro doc: ");
                this.print(obj);

                let obj2 = $("#modalClienteNewVentaPnl input#nroDocClienteBusqueda");
                this.print("input nro doc 2*****: ");
                this.print(obj2);

                obj[0].focus();
                obj2[0].focus();
        }


        personaRegistrada(datos) {
                this.cerrarModal("modalRegistroCliente");
                this.print("PERSONA REGISTRADA: ");
                this.print(datos);
                let id_persona = datos.bean.id_persona;
                this.print("id_persona: " + id_persona);
                let parametros = JSON.stringify({
                        id_persona: id_persona
                });

                this.clienteService.buscarPaginacion(1, 10, 10, parametros)
                        .subscribe(
                                data => {
                                        let clientes=data;
                                        if(clientes!=null){
                                                this.clienteSelected=clientes[0];
                                                this.obtenerTodosClientes();
                                        }
                                        this.print("CLIENTE ENCONTRADO: ");
                                        this.print(clientes);

                                },
                                error => this.msj = <any>error);

        }


        abrirModalRegistroPersona() {
               
                this.abrirModal("modalRegistroCliente");

                this.formNewPersona.isClienteSelected = true;
                //this.formNewPersona.obtenerTiposDocumento();
                //this.formNewPersona.obtenerTiposPersona();
                this.formNewPersona.numeroDocumentoSelected = this.clienteSelected.numero_documento;

                if (this.clienteSelected != null) {
                        if(this.clienteSelected.numero_documento == null){

                        }else{                                
                        if (this.clienteSelected.numero_documento.length == 8) {
                                this.formNewPersona.buscarReniec();
                        } else if (this.clienteSelected.numero_documento.length > 8) {
                                this.formNewPersona.buscarSunat();
                        }


                        }

                }
        }


        abrirModalCotizacion() {

                this.abrirModal("modalCotizacion");
                $('.nav-tabs a[href="#buscarCotizacion"]').tab('show');
                $('#tabNuevoCotizacion').hide();
                this.formCotizacionComponent.buttonSelectedActivated = true;

        }
        



        //**********METODO QUE OBTIENE LOS DATOS EXTERNOS 
        obtenerDatosExternos(datos) {
                this.beanSelectedExterno = datos.bean;
                this.idProductoSelected = this.beanSelectedExterno.id_producto;
                //this.cerrarModal("modalCatalogoVenta");
                this.print("DATOS EXTERNOS: ");
                this.print(datos);
                this.abrirPanelRegistrar();
                this.beanSelectedExterno.precio_original = this.beanSelectedExterno.precio;

                if (this.beanSelectedExterno.tiene_precio_especial) {

                        this.beanSelectedExterno.precio_venta = this.beanSelectedExterno.precio_especial;
                        this.beanSelectedExterno.precio = this.beanSelectedExterno.precio_especial;
                        /*this.beanSelectedExterno.porc1= 0;
                        this.beanSelectedExterno.porc2= 0;
                        this.beanSelectedExterno.porc3= 0;
                        this.beanSelectedExterno.porc4= 0;
                        this.beanSelectedExterno.costo_incluido=0;

                        this.beanSelectedExterno.porc1_dolar= 0;
                        this.beanSelectedExterno.porc2_dolar= 0;
                        this.beanSelectedExterno.porc3_dolar= 0;
                        this.beanSelectedExterno.porc4_dolar= 0;
                        this.beanSelectedExterno.costo_incluido_dolar= 0;*/

                } else {
                        this.beanSelectedExterno.precio_venta = this.beanSelectedExterno.porc4;
                        this.beanSelectedExterno.precio = this.beanSelectedExterno.porc4;
                }

                this.beanSelectedExterno.desc = 0;
                this.beanSelectedExterno.porc_desc = 0;
                this.beanSelectedExterno.id_unidad_medida = this.unidades_medida[0].id_unidad_medida;
                this.beanSelectedExterno.tiene_permiso_exceder = false;
                this.beanSelectedExterno.tiene_permiso_muestra = false;
                this.beanSelectedExterno.tipo_moneda = this.tipoMonedaSelected;
                this.beanSelectedExterno.cantidad = 1;
                this.beanSelectedExterno.sub_total = this.beanSelectedExterno.precio_venta * this.beanSelectedExterno.cantidad;

                this.print("datos de productos");
                this.print(this.beanSelectedExterno);

                if (!this.existeProducto(this.beanSelectedExterno)) {
                        this.listaProductos.push(this.beanSelectedExterno);
                }

                //this.sumarTotalProductos();
                this.calcularIgv();
                this.mensajeCorrecto("PRODUCTO AGREGADO CORRECTAMENTE");
        }


        existeProducto(bean) {
                let rpta = false;
                for (let i = 0; i < this.listaProductos.length; i++) {

                        if (this.listaProductos[i].id_catalogo_venta == bean.id_catalogo_venta) {
                                rpta = true;
                                break;
                        }


                }
                return rpta;
        }


        activarPermiso(indice) {
                this.indObjSeleccionadoClave = indice;
                this.listaProductos[this.indObjSeleccionadoClave].tiene_permiso_exceder = false;
                this.listaProductos[this.indObjSeleccionadoClave].tiene_permiso_muestra = false;

                this.abrirModalPorc("modalClavePermiso", 50);



        }

        aceptarClave() {
                if (this.clavePermiso == "20259402") {
                        this.listaProductos[this.indObjSeleccionadoClave].tiene_permiso_exceder = true;
                        this.listaProductos[this.indObjSeleccionadoClave].tiene_permiso_muestra = true;
                } else {
                        this.mensajeInCorrecto("CLAVE ERRONEA");
                        this.listaProductos[this.indObjSeleccionadoClave].tiene_permiso_exceder = false;
                        this.listaProductos[this.indObjSeleccionadoClave].tiene_permiso_muestra = false;
                }
                this.cerrarModal("modalClavePermiso");
                this.clavePermiso = null;
        }


   validarPrecio(obj) {
                
        this.calcularIgv();
                        if (obj.tipo_moneda.nombre == "DOLARES") {
                                if(obj.precio_venta >= obj.porc3_dolar){
                                      this.PorcentajeIncorrecto = false;
                                        this.valid = true;
                                }else{
                                       
                                        this.mensajeInCorrecto("EL PRECIO DE VENTA TIENE  UN DESCUENTO DE "+obj.porcentaje + "% "+
                                        "Descuento minimo es:"+obj.porc3_dolar);
                                        this.PorcentajeIncorrecto = true;
                                        this.valid = false;
                                }
                        } else {
                                this.print("minu a descontar");
                                this.print(this.MIN);
                                if(obj.precio_venta >= obj.porc3){
                                         this.PorcentajeIncorrecto = false;
                                        this.valid = true;
                                }else{
                                       
                                        this.mensajeInCorrecto("EL PRECIO DE VENTA TIENE  UN DESCUENTO DE "+obj.porcentaje + "% "+
                                        "EL PRECIO MINIMO ES:"+this.round2(obj.porc3));
                                        this.valid = false;
                                        this.PorcentajeIncorrecto = true;
                                }
                        }

                        
                
        }



        validarPreciosTotal() {
                for (let i = 0; i < this.listaProductos.length; i++) {
                        let obj = this.listaProductos[i];
                        if (obj.tipo_moneda.nombre == "DOLARES") {
                                this.precioCorrecto = true;
                        } else {
                                if (obj.porc4 == null) {
                                        if ((obj.precio_venta < obj.porc1 || obj.precio_venta > obj.porc2) && obj.tiene_permiso_exceder == false) {
                                                this.precioCorrecto = false;
                                                break;
                                        } else {
                                                this.precioCorrecto = true;
                                        }

                                } else {
                                        if ((obj.precio_venta < obj.costo_incluido || obj.precio_venta > obj.porc4) && obj.tiene_permiso_exceder == false) {
                                                this.precioCorrecto = false;
                                                break;
                                        } else {
                                                this.precioCorrecto = true;
                                        }
                                }
                        }
                }

        }

        



      

        sumarTotalProductos() {
               
                let compra = this.tipoCambio[0].precio_compra;
                let venta = this.tipoCambio[0].precio_venta;
                let prom = (compra/2 + venta/2);
              

                this.print("sumar productos");
                    this.print(this.listaProductos);
                    this.print(this.idTipoMonedaSelected);
           
                     
                    let total = 0;
              
                for (let i = 0; i < this.listaProductos.length; i++) {
                        this.listaProductos[i].id_tipo_moneda = this.tipoMonedaSelected == null ? null : this.tipoMonedaSelected.id_tipo_moneda;
                        
                        
                        let desc = this.listaProductos[i].hasOwnProperty('desc') ? this.listaProductos[i].desc : 0;
                        this.listaProductos[i].precio = this.listaProductos[i].precio_venta - desc;
                        this.listaProductos[i].sub_total = this.round2(this.listaProductos[i].precio * this.listaProductos[i].cantidad);
                        total = total + this.listaProductos[i].sub_total;
                        this.listaProductos[i].id_tipo_moneda = this.listaProductos[i].tipo_moneda.id_tipo_moneda;
                        
               
                       
                }


                this.montoTotalSelected = "" + this.round2(total);
                this.montoTotalSelected = this.completar_ceros_derecha("" + this.montoTotalSelected, 2);    

               
               this.obtenerTipoMonedaGeneral(this.tipoMonedaSelected);    
        }

        ActiveButton(){
                this.ActiveGrupo = true;
        }


        obtenerTipoMonedaGeneral(pro) {
                
                let compra = this.tipoCambio[0].precio_compra;
                let venta = this.tipoCambio[0].precio_venta;
                let prom = (compra/2 + venta/2);

                this.simboloMonedaSelected = pro.simbolo;
                this.idTipoMonedaSelected = pro.id_tipo_moneda;

              
                //this.calcularIgv();

                        let rpta = false;
                        for (let i = 0; i < this.listaProductos.length; i++) {
                                this.listaProductos[i].tipo_moneda = pro;
                                this.listaProductos[i].id_tipo_moneda = pro.id_tipo_moneda;
                                //this.listaProductos[i].precio_venta = pro.precio_venta/3.44;
                        }
                          
                        return rpta
              
              
        
               


        }

    


        obtenerClienteDatosExternos(datos) {
                this.clienteSelected = datos.bean;
                this.print("datos Cliente");
                this.print(datos);
                this.cerrarModal("modalClienteNewVenta");

        }


        eliminarCarrito(i) {
                this.print("INDICE A ELIMINAR: " + i);
                this.listaProductos.splice(i, 1)
                //this.sumarTotalProductos();
                this.calcularIgv();
        }



        buscarVenta(obj) {
                if (this.tienePermisoPrintMsj(this.rutas.FORM_VENTA, this.rutas.BUTTON_VER_DETALLE)) {
                        this.panelDetalleVentaSelected = true;
                        this.ventaService.getVentaById(obj.id_venta)
                                .subscribe(
                                        data => {
                                                this.listaProductosDetalle = data.detalle_venta;
                                                this.ventaSelected = data.venta;
                                                this.print(data);
                                        },
                                        error => this.msj = <any>error);
                }
        }

        regresarListaVentas() {
                this.panelDetalleVentaSelected = false;
                this.panelEditarVentaSelected = false;
        }



        calcularIgv() {

                
                this.sumarTotalProductos();
               

                if (this.incluyeIgvSelected == true) {
                        this.montoTotalSelected = "" + this.round2(parseFloat(this.montoTotalSelected));
                        this.subTotalSelected = "" + this.round2(parseFloat(this.montoTotalSelected) / 1.18);
                        this.igvSelected = "" + this.round2(parseFloat(this.montoTotalSelected) - parseFloat(this.subTotalSelected));

                        this.montoTotalSelected = this.completar_ceros_derecha(this.montoTotalSelected, 2);
                        this.subTotalSelected = this.completar_ceros_derecha(this.subTotalSelected, 2);
                        this.igvSelected = this.completar_ceros_derecha(this.igvSelected, 2);
                }
                if (this.incluyeIgvSelected == false) {
                        this.subTotalSelected = "" + this.round2(parseFloat(this.montoTotalSelected));
                        this.montoTotalSelected = "" + this.round2(parseFloat(this.subTotalSelected) * 1.18);
                        this.igvSelected = "" + this.round2(parseFloat(this.montoTotalSelected) - parseFloat(this.subTotalSelected));

                        this.montoTotalSelected = this.completar_ceros_derecha(this.montoTotalSelected, 2);
                        this.subTotalSelected = this.completar_ceros_derecha(this.subTotalSelected, 2);
                        this.igvSelected = this.completar_ceros_derecha(this.igvSelected, 2);
                }

        }






        /*************OBTENER DATOS DE LA COTIZACION*****************/

        obtenerDatosCotizacion(datos) {
                //this.empleadoSelected = datos.bean;
                this.buscarClienteSegundoPlano(datos.bean.id_cliente);
                this.buscarDetalleCotizacionSegundoPlano(datos.bean);
                this.print("datos Cotizacion");
                this.print(datos);
                this.cerrarModal("modalCotizacion");
        }

        buscarClienteSegundoPlano(id) {
                let parametros = JSON.stringify({ id_cliente: id });
                this.clienteService.buscarPaginacion(1, 10, 10, parametros)
                        .subscribe(
                                data => {
                                        let lista = data;
                                        if (lista != null) {
                                                if (lista.length > 0) {
                                                        this.clienteSelected = lista[0];
                                                }
                                        }

                                        this.print(data);
                                },
                                error => this.msj = <any>error);
        }

        obtenerTipoMonedaActualId(id) {
                let obj = null;
                let i;
                for (i = 0; i < this.tiposMoneda.length; i++) {
                        //this.print("this.tipos_producto[i].nombre"+this.tipos_producto[i].nombre+" , nombreTipo: " +nombreTipo);
                        if (this.tiposMoneda[i].id_tipo_moneda == id) {
                                obj = this.tiposMoneda[i];
                                break;
                        }
                }
                return obj;
        }

        obtenerAlmacenActualId(id) {
                let obj = null;
                let i;
                for (i = 0; i < this.almacenesUsuario.length; i++) {
                        //this.print("this.tipos_producto[i].nombre"+this.tipos_producto[i].nombre+" , nombreTipo: " +nombreTipo);
                        if (this.almacenesUsuario[i].id_local == id) {
                                obj = this.almacenesUsuario[i];
                                break;
                        }
                }
                return obj;
        }


        buscarDetalleCotizacionSegundoPlano(obj) {
                this.tipoMonedaSelected = this.obtenerTipoMonedaActualId(obj.id_tipo_moneda);
                this.incluyeIgvSelected = obj.incluye_igv;
                this.cotizacionService.getDetalleCotizacionById(obj.id_cotizacion)
                        .subscribe(
                                data => {
                                        this.listaProductos = data;
                                        this.obtenerTipoMonedaGeneral(this.tipoMonedaSelected);
                                        this.calcularIgv();
                                        this.print("lista de productos cotizacion");
                                        this.print(data);
                                },
                                error => this.msj = <any>error);

        }




        agregarProductoMultiple(cantidad) {

                if (cantidad > 0) {
                        let i;
                        for (i = 0; i < cantidad; i++) {
                                        let p = {
                                                andamio: null,
                                                app_imagen: null,
                                                cantidad: null,
                                                carpeta_imagen: null,
                                                columna: null,
                                                costo_incluido: null,
                                                costo_incluido_dolar: null,
                                                costo_incluido_dolar_sinigv: null,
                                                costo_incluido_sinigv: null,
                                                desc: 0,
                                                descripcion: null,
                                                estado: null,
                                                fecha: null,
                                                fecha_baja: null,
                                                fila: null,
                                                gana_porc1: null,
                                                gana_porc2: null,
                                                gana_porc3: null,
                                                gana_porc4: null,
                                                host_imagen: null,
                                                id_almacen: null,
                                                id_aplicacion: null,
                                                id_catalogo_venta: null,
                                                id_cliente: null,
                                                id_local: null,
                                                id_marca: null,
                                                id_producto: null,
                                                id_proveedor: null,
                                                id_tipo_moneda: null,
                                                id_tipo_moneda_compra: null,
                                                id_tipo_moneda_pb: null,
                                                id_tipo_moneda_pr: null,
                                                id_tipo_producto: null,
                                                id_unidad_medida: this.unidadMedidaSelected.id_unidad_medida,
                                                igv: 0.18,
                                                maximo: null,
                                                medida_a: null,
                                                medida_a_mayor: null,
                                                medida_a_menor: null,
                                                medida_b: null,
                                                medida_b_mayor: null,
                                                medida_b_menor: null,
                                                medida_c: null,
                                                medida_c_mayor: null,
                                                medida_c_menor: null,
                                                medida_d: null,
                                                medida_d_mayor: null,
                                                medida_d_menor: null,
                                                medida_e: null,
                                                medida_e_mayor: null,
                                                medida_e_menor: null,
                                                medida_f: null,
                                                nombre: null,
                                                nombre_almacen: null,
                                                nombre_aplicacion: "",
                                                nombre_cliente: "",
                                                nombre_imagen: "",
                                                nombre_local: null,
                                                nombre_marca: null,
                                                nombre_proveedor: null,
                                                nombre_simbolo_moneda: "S/",
                                                nombre_simbolo_moneda_pb: "S/",
                                                nombre_simbolo_moneda_pr: "S/",
                                                nombre_tipo_moneda: "SOLES",
                                                nombre_tipo_producto: null,
                                                nombre_unidad_medida: this.unidadMedidaSelected.nombre,
                                                orden: 1,
                                                order_by: null,
                                                porc1: null,
                                                porc1_dolar: null,
                                                porc1_dolar_sinigv: null,
                                                porc1_sinigv: null,
                                                porc2: null,
                                                porc2_dolar: null,
                                                porc2_dolar_sinigv: null,
                                                porc2_sinigv: null,
                                                porc3: null,
                                                porc3_dolar: null,
                                                porc3_dolar_sinigv: null,
                                                porc3_sinigv: null,
                                                porc4: null,
                                                porc4_dolar: null,
                                                porc4_dolar_sinigv: null,
                                                porc4_sinigv: null,
                                                porc_desc: null,
                                                precio: null,
                                                precio_base: null,
                                                precio_compra: null,
                                                precio_especial: null,
                                                precio_especial_soles: null,
                                                precio_original: null,
                                                precio_referencia: null,
                                                precio_venta: null,
                                                ruta_imagen: null,
                                                sub_total: null,
                                                tiene_permiso_exceder: false,
                                                tiene_permiso_muestra: false,
                                                tiene_precio_especial: false,
                                                tipo_cambio: 5,
                                                nuevo: false,
                                                tipo_moneda: {
                                                        estado: null,
                                                        id_tipo_moneda: null,
                                                        nombre: "SOLES",
                                                        observacion: null,
                                                        orden_presentacion: 1,
                                                        simbolo: "S/"
                                                },
                                                id_unidad_medida_peso: this.unidades_medida[0].id_unidad_medida,
                                                peso: 1,
                                        }

                                this.print("pro: ");
                                this.print(p);
                                this.listaProductos.push(p);

                                // this.activarPrecioIgv();
                        }
                }
        }


        //***********MANEJO DEL AUTOCOMPLETADO************


        teclaKeyPressAutocomplete(event: any, indice: any) {

          
                if (this.listaProductos[indice].eleccion_autocompletado_selected && event.keyCode == 13) {
                        this.elegirProducto(this.listaProductos[indice].lista_autocompletado[this.indiceLista], indice);
                }


                if (event.keyCode == 27) {
                        this.listaProductos[indice].lista_autocompletado = null;
                        this.indiceLista = -1;
                        this.listaProductos[indice].eleccion_autocompletado_selected = false;
                }


        }


        teclaKeyDownAutocomplete(event: any, indice: any) {
                this.lastkeydown1 = event.timeStamp;
                let textoBusqueda = this.listaProductos[indice].nombre;
                let tamBusqueda = textoBusqueda == null ? 0 : textoBusqueda.length;
              
                this.tamTexto.push(tamBusqueda);


                if (event.keyCode == 38 || event.keyCode == 40 || event.keyCode == 32 || event.keyCode == 13) {

                        
                        if (event.keyCode == 38) {

                                let lista = [];
                                lista = $('.lista-diego2 li');

                                
                                if (lista.length >= 0) {

                                        this.indiceLista = this.indiceLista == -1 ? lista.length - 1 : this.indiceLista;
                                        if (this.indiceLista >= 0) {
                                                this.indiceLista--;
                                                this.indiceLista = this.indiceLista == -1 ? lista.length - 1 : this.indiceLista;

                                                $('.lista-diego2 li').removeClass();
                                                $(lista[this.indiceLista]).addClass("seleccionado");
                                        }

                                }





                        }

                        //******************FLECHA HACI ABAJO***************** 
                        if (event.keyCode == 40) {

                                let lista = [];
                                lista = $('.lista-diego2 li');
                                if (lista.length > 0) {
                                        //$(lista[this.indiceLista]).addClass( "seleccionado" );
                                        this.print("condicion: " + this.indiceLista + "tam:" + (lista.length - 1));
                                        if (this.indiceLista <= lista.length - 1) {
                                                this.indiceLista++
                                                $('.lista-diego2 li').removeClass();
                                                $(lista[this.indiceLista]).addClass("seleccionado");
                                        }

                                        if (this.indiceLista == lista.length) {
                                                this.indiceLista = 0;
                                                $('.lista-diego2 li').removeClass();
                                                $(lista[this.indiceLista]).addClass("seleccionado");
                                        }


                                }

                               

                        }


                }
        }


        teclaKeyUpAutocomplete(event: any, indice: any) {

               
                let tiempo = event.timeStamp;
            
                let textoBusqueda = this.listaProductos[indice].nombre;
                let tamBusqueda = textoBusqueda.length;
                

                let tamUltimo = this.tamTexto.length;

                setTimeout(() => {    //<<<---    using ()=> syntax
                        this.print("tamUltimo: " + tamUltimo);
                        this.print("tamTexto Array: " + this.tamTexto.length);
                        if (tamUltimo == this.tamTexto.length) {
                                if (tamBusqueda > 2) {
                                        this.print("/*******************BUSCAR EL AUTOCOMPLETADO");
                                        this.print("buscar");
                                        this.listaNulaAutocompletado();
                                        this.listaProductos[indice].activo = true;
                                        this.buscarAutocompletado(indice);
                                }

                        }
                }, 200);




                if (event.keyCode == 27 || tamBusqueda < 2) {
                        this.indiceLista = -1;
                        this.listaProductos[indice].lista_autocompletado = null;
                        this.listaProductos[indice].eleccion_autocompletado_selected = false;
                }
        }



        elegirProducto(producto: any, indice: any) {
                
                if (producto != null) {
                       
                        this.precioS = producto.precio_venta;
                        this.indiceLista = -1;
                        this.agregarProductoCatalogo(producto, indice);
                        this.listaProductos[indice].lista_autocompletado = null;
                        this.listaProductos[indice].eleccion_autocompletado_selected = false;
                      

                }
        }





        limpiarItemLista(indice: any) {
                if (indice >= 0) {

                        this.listaProductos[indice].nombre = null;
                        this.listaProductos[indice].id_producto = null;
                        this.listaProductos[indice].id_unidad_medida = null;
                        this.listaProductos[indice].nombre_tipo_producto = null;
                        this.listaProductos[indice].nombre_marca = null;
                        this.listaProductos[indice].nombre_unidad_medida = null;
                        this.listaProductos[indice].id_unidad_medida = null;
                        this.listaProductos[indice].nombre_aplicacion = null;
                        this.listaProductos[indice].medida_a = null;
                        this.listaProductos[indice].medida_b = null;
                        this.listaProductos[indice].medida_c = null;
                        this.listaProductos[indice].medida_d = null;
                        this.listaProductos[indice].descripcion = null;
                        this.listaProductos[indice].lista_autocompletado = null;
                        this.listaProductos[indice].eleccion_autocompletado_selected = false;


                }
        }

        buscarAutocompletado(indice) {
                let nombre = this.listaProductos[indice].nombre;

                this.indiceLista = -1;
                if (nombre != "") {
                        this.seleccionarByPaginaAutocompletado(1, this.tamanio_lista_mostrar, this.tamanio_lista_mostrar, indice);
                } else {
                        this.listaProductos[indice].lista_autocompletado = null;
                        //this.buscar();
                }
        }

        listaNulaAutocompletado() {
                let i;
                for (i = 0; i < this.listaProductos.length; i++) {
                        this.listaProductos[i].activo = false;
                }
        }


        seleccionarByPaginaAutocompletado(inicio: any, fin: any, tamPagina: any, indice: any) {

                let nombre = this.listaProductos[indice].nombre;
                nombre = nombre.replace(/\*/g, '%');
                this.print("texto a buscar: " + nombre);

                let parametros = JSON.stringify({
                        nombre: nombre
                });

                let user = this.obtenerUsuario();
                this.catalogoVentaService.buscarPaginacionAutocompletado(inicio, fin, tamPagina, parametros)
                        .subscribe(
                                data => {
                                        this.listaProductos[indice].lista_autocompletado = data;
                                        this.listaProductos[indice].eleccion_autocompletado_selected = true;


                                        this.print("lista autocompletado: ");
                                        this.print(data);

                                      
                                },
                                error => this.msj = <any>error);
        }


        //**********METODO QUE OBTIENE LOS DATOS EXTERNOS 
        agregarProductoCatalogo(beanSelected, indice) {
           

                this.idProductoSelected = beanSelected.id_producto;
              
                beanSelected.precio_original = beanSelected.precio;
                

                if (beanSelected.tiene_precio_especial) {

                        beanSelected.precio_venta = beanSelected.precio_especial;
                        beanSelected.precio = beanSelected.precio_especial;
                      

                } else {

                        if (beanSelected.gana_porc4 != null) {
                                beanSelected.precio_venta = beanSelected.gana_porc4;
                                beanSelected.precio = beanSelected.gana_porc4;
                        } else if (beanSelected.gana_porc3 != null) {
                                beanSelected.precio_venta = beanSelected.gana_porc3;
                                beanSelected.precio = beanSelected.gana_porc3;
                        } else if (beanSelected.gana_porc2 != null) {
                                beanSelected.precio_venta = beanSelected.gana_porc2;
                                beanSelected.precio = beanSelected.gana_porc2;
                        } else if (beanSelected.gana_porc1 != null) {
                                beanSelected.precio_venta = beanSelected.gana_porc1;
                                beanSelected.precio = beanSelected.gana_porc1;
                        } else {
                                beanSelected.precio_venta = 1;
                                beanSelected.precio = 1;
                        }

                }

                beanSelected.desc = 0;
                beanSelected.porc_desc = 0;
                beanSelected.id_unidad_medida = this.unidades_medida[0].id_unidad_medida;
                beanSelected.tiene_permiso_exceder = false;
                beanSelected.tiene_permiso_muestra = false;
                beanSelected.tipo_moneda = this.tipoMonedaSelected;
                beanSelected.cantidad = 1;
                beanSelected.sub_total = beanSelected.precio_venta * beanSelected.cantidad;

                beanSelected.id_unidad_medida_peso = this.unidades_medida[0].id_unidad_medida;
                beanSelected.peso = 1;

           
                
               
                
                let id_local =  this.almacenUsuarioSelected.id_local;
                
           
                this.productoService.getStockByIdProducto(beanSelected.id_producto,id_local).subscribe(
                        data=>{
                                let total = data;
                                this.print("STOCK DEL PRODUCTO");
                                this.print(total);
                                if(total<=0){

                                        this.listaProductos[indice] = null;
                                        let p = {
                                                andamio: null,
                                                app_imagen: null,
                                                cantidad: null,
                                                carpeta_imagen: null,
                                                columna: null,
                                                costo_incluido: null,
                                                costo_incluido_dolar: null,
                                                costo_incluido_dolar_sinigv: null,
                                                costo_incluido_sinigv: null,
                                                desc: 0,
                                                descripcion: null,
                                                estado: null,
                                                fecha: null,
                                                fecha_baja: null,
                                                fila: null,
                                                gana_porc1: null,
                                                gana_porc2: null,
                                                gana_porc3: null,
                                                gana_porc4: null,
                                                host_imagen: null,
                                                id_almacen: null,
                                                id_aplicacion: null,
                                                id_catalogo_venta: null,
                                                id_cliente: null,
                                                id_local: null,
                                                id_marca: null,
                                                id_producto: null,
                                                id_proveedor: null,
                                                id_tipo_moneda: null,
                                                id_tipo_moneda_compra: null,
                                                id_tipo_moneda_pb: null,
                                                id_tipo_moneda_pr: null,
                                                id_tipo_producto: null,
                                                id_unidad_medida: this.unidadMedidaSelected.id_unidad_medida,
                                                igv: 0.18,
                                                maximo: null,
                                                medida_a: null,
                                                medida_a_mayor: null,
                                                medida_a_menor: null,
                                                medida_b: null,
                                                medida_b_mayor: null,
                                                medida_b_menor: null,
                                                medida_c: null,
                                                medida_c_mayor: null,
                                                medida_c_menor: null,
                                                medida_d: null,
                                                medida_d_mayor: null,
                                                medida_d_menor: null,
                                                medida_e: null,
                                                medida_e_mayor: null,
                                                medida_e_menor: null,
                                                medida_f: null,
                                                nombre: null,
                                                nombre_almacen: null,
                                                nombre_aplicacion: "",
                                                nombre_cliente: "",
                                                nombre_imagen: "",
                                                nombre_local: null,
                                                nombre_marca: null,
                                                nombre_proveedor: null,
                                                nombre_simbolo_moneda: "S/",
                                                nombre_simbolo_moneda_pb: "S/",
                                                nombre_simbolo_moneda_pr: "S/",
                                                nombre_tipo_moneda: "SOLES",
                                                nombre_tipo_producto: null,
                                                nombre_unidad_medida: this.unidadMedidaSelected.nombre,
                                                orden: 1,
                                                order_by: null,
                                                porc1: null,
                                                porc1_dolar: null,
                                                porc1_dolar_sinigv: null,
                                                porc1_sinigv: null,
                                                porc2: null,
                                                porc2_dolar: null,
                                                porc2_dolar_sinigv: null,
                                                porc2_sinigv: null,
                                                porc3: null,
                                                porc3_dolar: null,
                                                porc3_dolar_sinigv: null,
                                                porc3_sinigv: null,
                                                porc4: null,
                                                porc4_dolar: null,
                                                porc4_dolar_sinigv: null,
                                                porc4_sinigv: null,
                                                porc_desc: null,
                                                precio: null,
                                                precio_base: null,
                                                precio_compra: null,
                                                precio_especial: null,
                                                precio_especial_soles: null,
                                                precio_original: null,
                                                precio_referencia: null,
                                                precio_venta: null,
                                                ruta_imagen: null,
                                                sub_total: null,
                                                tiene_permiso_exceder: false,
                                                tiene_permiso_muestra: false,
                                                tiene_precio_especial: false,
                                                tipo_cambio: 5,
                                                nuevo: false,
                                                tipo_moneda: {
                                                        estado: null,
                                                        id_tipo_moneda: null,
                                                        nombre: "SOLES",
                                                        observacion: null,
                                                        orden_presentacion: 1,
                                                        simbolo: "S/"
                                                },
                                                id_unidad_medida_peso: this.unidades_medida[0].id_unidad_medida,
                                                peso: 1,
                                        };
                                        this.listaProductos[indice] = p;
                                      
                                        this.mensajeInCorrecto("ESTE PRODUCTO NO TIENE STOCK:"+beanSelected.nombre.toUpperCase() + " EN ESTE LOCAL");
                                }else{

                                if (!this.existeProducto(beanSelected)) {
                                                if(this.idTipoMonedaSelected == 1){
                                                     this.listaProductos[indice] = beanSelected; 
                                                     this.CalcularMaxDescuento(this.listaProductos[indice].precio_venta);     
                                                }else{
                                                        this.listaProductos[indice] = beanSelected; 
                                                        this.listaProductos[indice].precio_venta =  this.listaProductos[indice].precio_referencia;
                                                        this.CalcularMaxDescuento(this.listaProductos[indice].precio_venta);
                                                }
                                                
                                           
                                   }else{
                                           
                                           this.listaProductos[indice] = null;
                                           let p = {
                                                   andamio: null,
                                                   app_imagen: null,
                                                   cantidad: null,
                                                   carpeta_imagen: null,
                                                   columna: null,
                                                   costo_incluido: null,
                                                   costo_incluido_dolar: null,
                                                   costo_incluido_dolar_sinigv: null,
                                                   costo_incluido_sinigv: null,
                                                   desc: 0,
                                                   descripcion: null,
                                                   estado: null,
                                                   fecha: null,
                                                   fecha_baja: null,
                                                   fila: null,
                                                   gana_porc1: null,
                                                   gana_porc2: null,
                                                   gana_porc3: null,
                                                   gana_porc4: null,
                                                   host_imagen: null,
                                                   id_almacen: null,
                                                   id_aplicacion: null,
                                                   id_catalogo_venta: null,
                                                   id_cliente: null,
                                                   id_local: null,
                                                   id_marca: null,
                                                   id_producto: null,
                                                   id_proveedor: null,
                                                   id_tipo_moneda: null,
                                                   id_tipo_moneda_compra: null,
                                                   id_tipo_moneda_pb: null,
                                                   id_tipo_moneda_pr: null,
                                                   id_tipo_producto: null,
                                                   id_unidad_medida: this.unidadMedidaSelected.id_unidad_medida,
                                                   igv: 0.18,
                                                   maximo: null,
                                                   medida_a: null,
                                                   medida_a_mayor: null,
                                                   medida_a_menor: null,
                                                   medida_b: null,
                                                   medida_b_mayor: null,
                                                   medida_b_menor: null,
                                                   medida_c: null,
                                                   medida_c_mayor: null,
                                                   medida_c_menor: null,
                                                   medida_d: null,
                                                   medida_d_mayor: null,
                                                   medida_d_menor: null,
                                                   medida_e: null,
                                                   medida_e_mayor: null,
                                                   medida_e_menor: null,
                                                   medida_f: null,
                                                   nombre: null,
                                                   nombre_almacen: null,
                                                   nombre_aplicacion: "",
                                                   nombre_cliente: "",
                                                   nombre_imagen: "",
                                                   nombre_local: null,
                                                   nombre_marca: null,
                                                   nombre_proveedor: null,
                                                   nombre_simbolo_moneda: "S/",
                                                   nombre_simbolo_moneda_pb: "S/",
                                                   nombre_simbolo_moneda_pr: "S/",
                                                   nombre_tipo_moneda: "SOLES",
                                                   nombre_tipo_producto: null,
                                                   nombre_unidad_medida: this.unidadMedidaSelected.nombre,
                                                   orden: 1,
                                                   order_by: null,
                                                   porc1: null,
                                                   porc1_dolar: null,
                                                   porc1_dolar_sinigv: null,
                                                   porc1_sinigv: null,
                                                   porc2: null,
                                                   porc2_dolar: null,
                                                   porc2_dolar_sinigv: null,
                                                   porc2_sinigv: null,
                                                   porc3: null,
                                                   porc3_dolar: null,
                                                   porc3_dolar_sinigv: null,
                                                   porc3_sinigv: null,
                                                   porc4: null,
                                                   porc4_dolar: null,
                                                   porc4_dolar_sinigv: null,
                                                   porc4_sinigv: null,
                                                   porc_desc: null,
                                                   precio: null,
                                                   precio_base: null,
                                                   precio_compra: null,
                                                   precio_especial: null,
                                                   precio_especial_soles: null,
                                                   precio_original: null,
                                                   precio_referencia: null,
                                                   precio_venta: null,
                                                   ruta_imagen: null,
                                                   sub_total: null,
                                                   tiene_permiso_exceder: false,
                                                   tiene_permiso_muestra: false,
                                                   tiene_precio_especial: false,
                                                   tipo_cambio: 5,
                                                   nuevo: false,
                                                   tipo_moneda: {
                                                           estado: null,
                                                           id_tipo_moneda: null,
                                                           nombre: "SOLES",
                                                           observacion: null,
                                                           orden_presentacion: 1,
                                                           simbolo: "S/"
                                                   },
                                                   id_unidad_medida_peso: this.unidades_medida[0].id_unidad_medida,
                                                   peso: 1,
                                           };
                                           this.listaProductos[indice] = p;
                                         
                                           this.mensajeInCorrecto("Este producto ya ha sido seleccionado");
                                   }
                                   this.datalistProduct = this.listaProductos;
                                   //this.sumarTotalProductos();
                                   this.calcularIgv();

                                }

                            
                     
                });
               
                
                //this.mensajeCorrecto("PRODUCTO AGREGADO CORRECTAMENTE");
        }

        CalcularMaxDescuento(precio_venta){

                let MinDescuent = (precio_venta*this.porcentaje1)/100;
                this.MIN = precio_venta - MinDescuent;

        }

        obtenerTipodeCambio(){
                this.tipoCambioService.getAllLatest().subscribe(
                        data=>{
                                this.tipoCambio = data;               
                })
        }




        //*************************IMPRESION DE COMPROBANTES
        // imprimirComprobante() {

        //         if (this.tienePermisoPrintMsj(this.rutas.FORM_COMPROBANTE, this.rutas.BUTTON_IMPRIMIR)) {
        //                 this.reportePdfService.obtenerComprobantePdf(this.idComprobanteSelected)
        //                         .subscribe(
        //                                 data => {
        //                                         if (data._body.size == 0) {
        //                                                 this.mensajeInCorrecto("DOCUMENTO DIGITALIZADO NO ENCONTRADO - HA SIDO ELIMINADO ARCHIVO ADJUNTO");
        //                                         } else {


        //                                                 if (this.rutas.IMPRESION_MODAL == 'true') {
        //                                                         this.abrirDocumentoModalId(data._body, 'mostrarPrincipalPDF');
        //                                                         this.abrirModalPDfPorc("modalPrincipalPDF", 90);
        //                                                 } else {
        //                                                         this.abrirPDF(data._body);
        //                                                 }



        //                                         }


        //                                 },
        //                                 error => this.msj = <any>error
        //                         );
        //         }

        // }


        imprimirComprobante2() {

                if (this.tienePermisoPrintMsj(this.rutas.FORM_COMPROBANTE, this.rutas.BUTTON_IMPRIMIR)) {
                        this.reportePdfService.obtenerComprobantePdf2(this.idComprobanteSelected)
                                .subscribe(
                                        data => {
                                                if (data._body.size == 0) {
                                                        this.mensajeInCorrecto("DOCUMENTO DIGITALIZADO NO ENCONTRADO - HA SIDO ELIMINADO ARCHIVO ADJUNTO");

                                                } else {
                                                        if (this.rutas.IMPRESION_MODAL == 'true') {
                                                                this.abrirDocumentoModalId(data._body, 'mostrarPrincipalPDF');
                                                                this.abrirModalPDfPorc("modalPrincipalPDF", 90);
                                                        } else {
                                                                this.abrirPDF(data._body);
                                                        }
                                                        setTimeout(() => {
                                                                $("#print").click();
                                                        }, 2000);

                                                }


                                        },
                                        error => this.msj = <any>error
                                );
                }

        }



        imprimirComprobanteBlanco() {
                if (this.tienePermisoPrintMsj(this.rutas.FORM_COMPROBANTE, this.rutas.BUTTON_IMPRIMIR)) {
                        this.reportePdfService.obtenerComprobanteBlancoPdf(this.idComprobanteSelected)
                                .subscribe(
                                        data => {
                                                if (data._body.size == 0) {
                                                        this.mensajeInCorrecto("DOCUMENTO DIGITALIZADO NO ENCONTRADO - HA SIDO ELIMINADO ARCHIVO ADJUNTO");
                                                } else {
                                                        if (this.rutas.IMPRESION_MODAL == 'true') {
                                                                this.abrirDocumentoModalId(data._body, 'mostrarPrincipalPDF');
                                                                this.abrirModalPDfPorc("modalPrincipalPDF", 90);
                                                        } else {
                                                                this.abrirPDF(data._body);
                                                        }
                                                }


                                        },
                                        error => this.msj = <any>error
                                );
                }

        }


        // imprimirComprobanteTicketera() {
        //         if (this.tienePermisoPrintMsj(this.rutas.FORM_COMPROBANTE, this.rutas.BUTTON_IMPRIMIR)) {
                        
        //                 this.reportePdfService.obtenerComprobantePdTicketera(this.idComprobanteSelected)
        //                         .subscribe(
        //                                 data => {
        //                                         if (data._body.size == 0) {
        //                                                 this.mensajeInCorrecto("DOCUMENTO DIGITALIZADO NO ENCONTRADO - HA SIDO ELIMINADO ARCHIVO ADJUNTO");
        //                                         } else {
        //                                                 if (this.rutas.IMPRESION_MODAL == 'true') {
        //                                                         this.abrirDocumentoModalId(data._body, 'mostrarPrincipalPDF');
        //                                                         this.abrirModalPDfPorc("modalPrincipalPDF", 90);
        //                                                 } else {
        //                                                         this.abrirPDF(data._body);
        //                                                 }
        //                                         }


        //                                 },
        //                                 error => this.msj = <any>error
        //                         );
        //         }

        // }


        imprimirBlanco(id_comprobante) {

                if (this.tienePermisoPrintMsj(this.rutas.FORM_COMPROBANTE, this.rutas.BUTTON_IMPRIMIR)) {
                        this.reportePdfService.obtenerComprobanteBlancoPdf(id_comprobante)
                                .subscribe(
                                        data => {
                                                if (data._body.size == 0) {
                                                        this.mensajeInCorrecto("DOCUMENTO DIGITALIZADO NO ENCONTRADO - HA SIDO ELIMINADO ARCHIVO ADJUNTO");
                                                } else {
                                                        if (this.rutas.IMPRESION_MODAL == 'true') {
                                                                this.abrirDocumentoModalId(data._body, 'mostrarPrincipalPDF');
                                                                this.abrirModalPDfPorc("modalPrincipalPDF", 90);
                                                        } else {
                                                                this.abrirPDF(data._body);
                                                        }
                                                }


                                        },
                                        error => this.msj = <any>error
                                );
                }

        }



        // imprimir(id_comprobante) {

        //         if (this.tienePermisoPrintMsj(this.rutas.FORM_COMPROBANTE, this.rutas.BUTTON_IMPRIMIR)) {
        //                 this.reportePdfService.obtenerComprobantePdf(id_comprobante)
        //                         .subscribe(
        //                                 data => {
        //                                         if (data._body.size == 0) {
        //                                                 this.mensajeInCorrecto("DOCUMENTO DIGITALIZADO NO ENCONTRADO - HA SIDO ELIMINADO ARCHIVO ADJUNTO");
        //                                         } else {

        //                                                 if (this.rutas.IMPRESION_MODAL == 'true') {
        //                                                         this.abrirDocumentoModalId(data._body, 'mostrarPrincipalPDF');
        //                                                         this.abrirModalPDfPorc("modalPrincipalPDF", 90);
        //                                                 } else {
        //                                                         this.abrirPDF(data._body);
        //                                                 }
        //                                         }


        //                                 },
        //                                 error => this.msj = <any>error
        //                         );
        //         }

        // }

        imprimirA4(id_comprobante) {

                if (this.tienePermisoPrintMsj(this.rutas.FORM_COMPROBANTE, this.rutas.BUTTON_IMPRIMIR)) {
                        this.reportePdfService.obtenerComprobantePdfA4(id_comprobante)
                                .subscribe(
                                        data => {
                                                if (data._body.size == 0) {
                                                        this.mensajeInCorrecto("DOCUMENTO DIGITALIZADO NO ENCONTRADO - HA SIDO ELIMINADO ARCHIVO ADJUNTO");
                                                } else {
                                                        //this.abrirPDF(data._body);

                                                        if (this.rutas.IMPRESION_MODAL == 'true') {
                                                                this.abrirDocumentoModalId(data._body, 'mostrarPrincipalPDF');
                                                                this.abrirModalPDfPorc("modalPrincipalPDF", 90);
                                                        } else {
                                                                this.abrirPDF(data._body);
                                                        }
                                                }


                                        },
                                        error => this.msj = <any>error
                                );
                }

        }


        imprimirComprobanteA4() {

                if (this.tienePermisoPrintMsj(this.rutas.FORM_COMPROBANTE, this.rutas.BUTTON_IMPRIMIR)) {
                        this.reportePdfService.obtenerComprobantePdfA4(this.idComprobanteSelected)
                                .subscribe(
                                        data => {
                                                if (data._body.size == 0) {
                                                        this.mensajeInCorrecto("DOCUMENTO DIGITALIZADO NO ENCONTRADO - HA SIDO ELIMINADO ARCHIVO ADJUNTO");
                                                } else {
                                                        if (this.rutas.IMPRESION_MODAL == 'true') {
                                                                this.abrirDocumentoModalId(data._body, 'mostrarPrincipalPDF');
                                                                this.abrirModalPDfPorc("modalPrincipalPDF", 90);
                                                        } else {
                                                                this.abrirPDF(data._body);
                                                        }
                                                }


                                        },
                                        error => this.msj = <any>error
                                );
                }

        }

        buscarProductoSwitchMap(event: any, indice: any) {

        }


        //************BUSCAR POR CODIGO DE PRODUCTO 


        buscarPorCodigoProducto(event: any, indice: any) {


                if (event.keyCode == 13) {
                        this.print("presionar enter");
                        this.buscarByCodigo(1, 10, 10, indice);
                }




        }




        buscarByCodigo(inicio: any, fin: any, tamPagina: any, indice: any) {

                let codigo = this.listaProductos[indice].codigo;

                let parametros = JSON.stringify({
                        codigo: codigo
                });

                this.catalogoVentaService.buscarPaginacion(inicio, fin, tamPagina, parametros)
                        .subscribe(
                                data => {
                                        this.limpiarItemLista(indice);
                                        let productos = data;

                                        if (productos != null) {
                                                if (productos.length > 0) {

                                                        this.elegirProducto(productos[0], indice);
                                                } else {
                                                        this.mensajeAdvertencia("PRODUCTO NO ENCONTRADO");
                                                }
                                        } else {
                                                this.mensajeAdvertencia("PRODUCTO NO ENCONTRADO");
                                        }

                                },
                                error => this.msj = <any>error);
        }

        elegirPrecio(j, valor) {
                this.listaProductos[j].precio_venta = valor;
                this.calcularIgv();
        }


        searchFromArray(arr, regex) {
                this.print("array: ");
                this.print(arr);
                this.print("regex");
                this.print(regex);
                let matches = [], i;
                for (i = 0; i < arr.length; i++) {
                        if (arr[i].nombre.match(regex)) {
                                matches.push(arr[i]);
                        }
                }
                return matches;
        };





        obtenerTodosClientes() {
                let parametros = JSON.stringify({});

                this.clienteService.buscarPaginacion(1, 100000, 100000, parametros)
                        .subscribe(
                                data => {
                                        Object.assign(this.lista_clientes_data, data);
                                        this.print("lista COMPLETA DE CLIENTES: ");
                                        this.print(data);
                                },
                                error => this.msj = <any>error);
        }

        obtenerTodosProductosPrecio() {
                let parametros = JSON.stringify({});

                this.catalogoVentaService.buscarPaginacion(1, 100000, 100000, parametros)
                        .subscribe(
                                data => {
                                        Object.assign(this.lista_productos_data, data);
                                        this.print("lista COMPLETA DE PRODUCTOS: ");
                                        this.print(data);


                                },
                                error => this.msj = <any>error);
        }



        autocompletarProductoNombre($event, j) {
                let textoBuscar = this.listaProductos[j].nombre;
                let tamCadena = textoBuscar == null ? 0 : textoBuscar.length;

                if (tamCadena > 2 && this.listaProductos[j].nuevo == false) {
                        if ($event.timeStamp - this.lastkeydown1 > 200) {

                                let patron = textoBuscar.toUpperCase();;
                                patron = patron.replace(/\*/g, '.+');

                                var reg = new RegExp(patron, "g");
                                this.print("reg: " + reg);
                                this.listaProductos[j].lista_autocompletado = this.lista_productos_data.filter(bean => bean.nombre.match(reg));
                                this.listaProductos[j].eleccion_autocompletado_selected = true;
                                this.print("lista");
                                this.print(this.listaProductos[j].lista_autocompletado);

                        }
                } else {
                        this.listaProductos[j].lista_autocompletado = null;
                }
        }


        autocompletarClienteNombre($event) {
                //let userId = (<HTMLInputElement>document.getElementById('userIdFirstWay')).value;
                let textoBuscar = this.clienteSelected.nombres;
                let tamCadena = textoBuscar == null ? 0 : textoBuscar.length;

                if (tamCadena > 2) {
                        if ($event.timeStamp - this.lastkeydown1 > 200) {

                                let patron = textoBuscar.toUpperCase();
                                patron = patron.replace(/\*/g, '.+');

                                var reg = new RegExp(patron, "g");
                                this.print("reg: " + reg);

                                this.lista_clientes_nombres_autocompletada = this.lista_clientes_data.filter(bean => bean.nombres.match(reg));

                                this.print("lista");
                                this.print(this.lista_clientes_nombres_autocompletada);

                                if(this.lista_clientes_nombres_autocompletada.length==0){
                                        this.lista_clientes_nombres_autocompletada = null;
                                }

                        }
                } else {
                        this.lista_clientes_nombres_autocompletada = null;
                }
        }

        autocompletarClienteNroDoc(event) {
                //let userId = (<HTMLInputElement>document.getElementById('userIdFirstWay')).value;
                let textoBuscar = this.clienteSelected.numero_documento;
                let tamCadena = textoBuscar == null ? 0 : textoBuscar.length;

                if (tamCadena > 2) {
                        if (event.timeStamp - this.lastkeydown1 > 200) {

                                let patron = textoBuscar.toUpperCase();
                                patron = patron.replace(/\*/g, '.+');

                                var reg = new RegExp(patron, "g");
                                this.print("reg: " + reg);

                                this.lista_clientes_nro_doc_autocompletada = this.lista_clientes_data.filter(bean => bean.numero_documento.match(reg));

                                this.print("lista");
                                this.print(this.lista_clientes_nro_doc_autocompletada);

                                if(this.lista_clientes_nro_doc_autocompletada.length==0){
                                        this.lista_clientes_nro_doc_autocompletada = null;
                                }

                        }
                } else {
                        this.lista_clientes_nro_doc_autocompletada = null;
                }

                if(event.keyCode==13){
                        this.abrirModalRegistroPersona();
                }
        }

        elegirListaCliente(bean: any) {
                if (bean != null) {
                        this.clienteSelected = bean;
                        this.print(bean);
                        this.lista_clientes_nro_doc_autocompletada = null;
                        this.lista_clientes_nombres_autocompletada = null;
                }
        }

}