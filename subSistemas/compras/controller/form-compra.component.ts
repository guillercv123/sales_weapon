import { Component, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';

import { ControllerComponent } from '../../../core/controller/controller.component';




/******************IMPORTAR SERVICIOS*************** */


import { CompraService } from '../service/compra.service';
//import { TipoMonedaService } from '../../mantenedores/service/tipo-moneda.Service';
import { TipoMonedaService } from '../../mantenedores/service/tipo-moneda.service';
import { TipoCompraService } from '../../mantenedores/service/tipo-compra.service';
import { MedioPagoService } from '../../mantenedores/service/medio-pago.service';
import { LocalService } from '../../mantenedores/service/local.service';
import { AlmacenService } from '../../mantenedores/service/almacen.service';
import { UnidadMedidaService } from '../../mantenedores/service/unidad-medida.service';
import { ProductoService } from '../../mantenedores/service/producto.service';
import { TipoComprobanteService } from '../../mantenedores/service/tipo-comprobante.service';
import { TipoCambioService } from '../../mantenedores/service/tipo-cambio.service';
import { ReportePdfService } from '../../../core/service/reporte-pdf.Service';
import { ReporteExcelService } from '../../../core/service/reporte-excel.Service';
import { FormNewComprobanteComponent } from '../../ventas/controller/comprobante/form-new-comprobante.component';
import { FormNewGuiaRemisionComponent } from '../../mantenedores/controller/guia-remision/form-new-guia-remision.component';
import { FormFindCompraComponent } from './compra/form-find-compra.component';
import { FormNewCompraComponent } from './compra/form-new-compra.component';


declare var $: any;
@Component({
        selector: 'form-compra',
        templateUrl: '../view/form-compra.component.html',
        providers: [TipoCambioService,TipoComprobanteService, ProductoService, TipoMonedaService, CompraService, ReporteExcelService,ReportePdfService, LocalService,
                AlmacenService, UnidadMedidaService, TipoCompraService, MedioPagoService]

})

export class FormCompraComponent extends ControllerComponent implements AfterViewInit {

        id_compra_busqueda:number;
        fechaInicio:any;
        fechaFin:any;


        estadoSelected: string;
        unidades_medida: any[];
        almacenes: any[];
        almacenSelected: any;

        percepcionSelected:number=0;
        retencionSelected:number=0;
        detraccionSelected:number=0;


        locales: any[];
        localSelected: any;


        tiposMoneda: any[];
        tipoMonedaSelected: any;

        tiposCompra: any[];
        tipoCompraSelected: any;

        mediosPago: any[];
        medioPagoSelected: any;




        listaProductos: any[];
        listaProductosOriginalIgv: any[];
        listaProductosOriginal: any[];
        listaProductosEliminados: any[];
        listaProductosInsertados: any[];
        listaProductosActualizados: any[];
        compraSelected: any;

        listaProductosDetalle: any[];

        compras: any[];

        simboloMonedaSelected: any;
        idTipoMonedaSelected: any;
        fechaSelected: any;
        igvSelected: any = 0.18;
        tipoCambioSelected: string = null;

        //************OBJETO ELEGIDO PARA EDITAR************
        beanSelected: any;


        //***********PANELES DE LOS MANTENEDORES***********
        panelEditarSelected: boolean = false;
        panelListaBeanSelected: boolean = true;
        busquedaMarcadaChecked: boolean = false;
        panelDetalleCompraSelected: boolean = false;


        //****************OBTEJOS OBTENIDOS DEL FORMULARIO PRODUCTO
        beanSelectedExterno: any;
        idProductoSelected: number;

        buttonSelectedActivatedPro: boolean = true;
        buttonEliminarActivatedPro: boolean = false;
        buttonEditarActivatedPro: boolean = false;


        //****************OBTEJOS OBTENIDOS DEL FORMULARIO CLIENTE
        proveedorSelected: any;

        buttonSelectedActivatedCli: boolean = true;
        buttonEliminarActivatedCli: boolean = false;
        buttonEditarActivatedCli: boolean = false;



        //****************OBTEJOS OBTENIDOS DEL FORMULARIO PROVEEDOR
        activatedSelectedProve: boolean = true;




        panelRegistroSelected: boolean = false;

        subTotalSelected: string = "0";
        descuentosSelected: string = "0";
        montoTotalSelected: string = "0";
        igvPagarSelected: string = "0";
        //netoPagarSelected: string = "0";
        montoBrutoSelected: string = "0";
        incluyeIgvSelected: boolean = false;
        diasCreditoSelected: number = 10;

        idCompraSelected: number;

        ventaRealizada: boolean = false;


        /*********DATOS FORMULARIO PRODUCTO*********/
        activatedSelectedPro: boolean = true;

        //@ViewChild(FormComprobanteComponent) formComprobante: FormComprobanteComponent;
        @ViewChild(FormNewComprobanteComponent,{static: false}) formComprobante: FormNewComprobanteComponent;
        @ViewChild(FormNewGuiaRemisionComponent,{static: false}) formGuiaRemision: FormNewGuiaRemisionComponent;
        tabsComprobanteActivated: boolean = false;
        tabsGuiaRemisionActivated: boolean = false;



        /*************VARIBLES PARA EL AUTOCOMPLETADO***/
        //lista_autocompletado: any;
        indiceLista: any = -1;
        //eleccion_autocompletado_selected: boolean = false;
        tamanio_lista_mostrar: number = 100;


        /*********BUSQUEDA DE PRODUCTOS MULTIPLE************/
        //listaProductos: any[];
        cantidadCeldas: number = 1;


        //*************DATOS DE GUIA
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

        //***********DATOS DEL COMPROBANTE COMPRA*********/
        tiposComprobante: any[];
        tipoComprobanteSelected: any = null;
        serieComprobanteSelected: any = null;
        numeroComprobanteSelected: any = null;
        fechaComprobanteSelected: any = null;
        id_comprobante: any = null;



        
        @ViewChild(FormFindCompraComponent,{static: false}) formFindCompra: FormFindCompraComponent;
        @ViewChild(FormNewCompraComponent,{static: false}) formNewCompra: FormNewCompraComponent;

        constructor(
                public http: Http,
                public router: Router,
                public compraService: CompraService,
                public reportePdfService: ReportePdfService,
                public reporteExcelService: ReporteExcelService,
                public tipoMonedaService: TipoMonedaService,
                public tipoCompraService: TipoCompraService,
                public medioPagoService: MedioPagoService,
                public localService: LocalService,
                public almacenService: AlmacenService,
                public unidadMedidaService: UnidadMedidaService,
                public productoService: ProductoService,
                public tipoComprobanteService: TipoComprobanteService,
                public tipoCambioService: TipoCambioService
        ) {
                super(router, reportePdfService, reporteExcelService);

                this.panelEditarSelected = false;
        }




        ngOnInit() {
              
            
        }


        ngAfterViewInit() {
                if (this.verificarTokenRpta(this.rutasMantenedores.FORM_COMPRA)) {
                        this.formNewCompra.obtenerTipoCambioActual();
                        this.formNewCompra.mostrarTiposComprobanteCompra();
                        this.formNewCompra.obtenerTipoMoneda();
                        this.formNewCompra.obtenerLocales();
                        this.formNewCompra.obtenerTipoCompra();
                        this.formNewCompra.obtenerMediosPago();
                        this.formNewCompra.obtenerUnidadesMedida();
                        this.formFindCompra.formFindProveedor.buttonSelected=true;

                        setTimeout(()=>{  
                                this.formFindCompra.tiposComprobante= this.formNewCompra.tiposComprobante;
                                this.formFindCompra.mediosPago= this.formNewCompra.mediosPago;
                                this.formFindCompra.locales= this.formNewCompra.locales;
                                this.formFindCompra.tiposMoneda= this.formNewCompra.tiposMoneda;
                        }, 4000);

                        this.formFindCompra.obtenerCompras();
                }
        }


        obtenerTipoCambioActual(){
                let fecha_actual= this.obtenerFechaActual();
                let para = JSON.stringify({
                        id_tipo_cambio: null,
                        fecha:fecha_actual,
                        precio_compra: null,
                        precio_venta: null
                });

                this.tipoCambioService.buscarPaginacion(1, 1, 10, para)
                        .subscribe(
                                data => {
                                        let listaTipoCambio = data;
                                        if(!this.isArrayVacio(listaTipoCambio)){
                                                this.tipoCambioSelected=listaTipoCambio[0].precio_venta;
                                        }
                                       
                                },
                                error => this.msj = <any>error);
        }

        autocompletarCerosSerie(event: any){

                if(this.serieComprobanteSelected!=null){
                        if(this.serieComprobanteSelected!=""){
                                let serie=this.completarCerosIzquierda(4,""+parseInt(this.serieComprobanteSelected));
                                this.serieComprobanteSelected=serie;
                        }
                }
               
        }

        
        validarSiComprobanteExiste(){

                let para = JSON.stringify({
                        id_proveedor: null,
                        estado: 1,
                        id_tipo_comprobante: null,
                        serie_comprobante: this.serieComprobanteSelected,
                        numero_comprobante: this.numeroComprobanteSelected,
                        fecha_comprobante: null

                });

                this.compraService.buscarPaginacion(1, 10, 10, para)
                        .subscribe(
                                data => {
                                        let compras = data;
                                        this.print("compras: ");
                                        this.print(compras);
                                        if (!this.isArrayVacio(compras)) {
                                                this.mensajeInCorrectoSinCerrar("EL COMPROBANTE DE COMPRA YA ESTA REGISTRADO");
                                        }

                                        this.print(data);
                                },
                                error => this.msj = <any>error);
        }



        buscarComprobante(event: any){
                        this.validarSiComprobanteExiste();
        }


        autocompletarCerosNumero(event: any){

                //  tecla flecha arriba     :  38
                //  tecla flecha abajo      :  40
                //  tecla enter             :  13
                //  tecla barra espaciadora : 32
                //  tecla escape            : 27


                if (event.keyCode == 13) {
                        this.validarSiComprobanteExiste();
                }



                if(this.numeroComprobanteSelected!=null){
                        if(this.numeroComprobanteSelected!=""){
                                let numero=this.completarCerosIzquierda(8,""+parseInt(this.numeroComprobanteSelected));
                                this.numeroComprobanteSelected=numero;
                        }
                }
                
     
        }

        mostrarTiposComprobanteCompra() {
                this.obtenerTiposComprobanteByIdCategoria(1);

                /*if (this.categoriaComprobanteSelected.nombre.toUpperCase() == "COMPRA") {
                        this.comprobanteCompraActivated = true;
                }

                if (this.categoriaComprobanteSelected.nombre.toUpperCase() == "VENTA") {
                        this.comprobanteCompraActivated = false;
                }*/
        }


        obtenerTiposComprobanteByIdCategoria(id) {

                this.tipoComprobanteService.getByIdCategoria(id)
                        .subscribe(
                                data => {//this.vistas = data;

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


        obtenerLocalActual(nombreTipo: string) {
                let obj = null;
                let i;
                for (i = 0; i < this.locales.length; i++) {
                        //this.print("this.tipos_producto[i].nombre"+this.tipos_producto[i].nombre+" , nombreTipo: " +nombreTipo);
                        if (this.locales[i].nombre == nombreTipo) {
                                obj = this.locales[i];
                                break;
                        }
                }
                return obj;
        }

        obtenerAlmacenActual(nombreTipo: string) {
                let obj = null;
                let i;
                for (i = 0; i < this.almacenes.length; i++) {
                        //this.print("this.tipos_producto[i].nombre"+this.tipos_producto[i].nombre+" , nombreTipo: " +nombreTipo);
                        if (this.almacenes[i].nombre == nombreTipo) {
                                obj = this.almacenes[i];
                                break;
                        }
                }
                return obj;
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


        obtenerAlmaceneByIdLocalEditar(id) {

                this.almacenService.getByIdLocal(id)
                        .subscribe(
                                data => {//this.vistas = data;

                                        this.almacenes = data;
                                        this.almacenSelected = this.obtenerAlmacenActual(this.beanSelectedExterno.nombre_almacen);
                                },
                                error => this.msj = <any>error);
        }

        iniciarProductosMultiples() {
                //this.listaProductos = new Array();
                this.agregarProductoMultiple(this.cantidadCeldas);

        }


        eliminarListaMultiple(i) {
                this.print("INDICE A ELIMINAR: " + i);
                this.listaProductos.splice(i, 1)
        }

        agregarProductoMultiple(cantidad) {

                if (cantidad > 0) {
                        let i;
                        for (i = 0; i < cantidad; i++) {
                                let p = {
                                        id_detalle_compra: null,
                                        nombre: "",
                                        lista_autocompletado: null,
                                        eleccion_autocompletado_selected: false,
                                        lista_autocompletado_codigo: null,
                                        lista_autocompletado_codigo_selected: false,
                                        id_producto: null,
                                        precio: 1,
                                        precio_igv: 1 * 1.18,
                                        precio_referencia: 1,
                                        cantidad: 1,
                                        id_unidad_medida: 1,
                                        nombre_tipo_producto: "",
                                        nombre_unidad_medida: "",
                                        nombre_aplicacion: "",
                                        medida_a: "",
                                        medida_b: "",
                                        medida_c: "",
                                        medida_d: "",
                                        descripcion: "",
                                        nuevo: true,
                                        porc_desc1: 0,
                                        porc_desc2: 0,
                                        porc_desc3: 0,
                                        porc_desc4: 0,
                                        desc1: 0,
                                        desc2: 0,
                                        desc3: 0,
                                        desc4: 0,
                                        porc_gana1: 10,
                                        porc_gana2: 15,
                                        porc_gana3: 20,
                                        porc_gana4: 30,
                                        id_unidad_medida_peso: this.unidades_medida[0].id_unidad_medida,
                                        peso: 1,
                                        codigo: null,
                                        codigo_barra: null
                                }

                                this.print("pro: ");
                                this.print(p);
                                this.listaProductos.push(p);

                                this.activarPrecioIgv();
                        }
                }
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
                                },
                                error => this.msj = <any>error);
        }


        /*obtenerUnidadesMedida() {

                this.unidadMedidaService.getAll()
                        .subscribe(
                        data => {//this.vistas = data;

                                this.unidades_medida = data;
                        },
                        error => this.msj = <any>error);
        }*/


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

                if (this.tienePermisoPrintMsj(this.rutas.FORM_COMPRA, this.rutas.PANEL_EDITAR)) {


                }
        }

        regresar() {
                this.limpiarCampos();

                this.panelEditarSelected = false;
                this.panelListaBeanSelected = true;
                this.panelDetalleCompraSelected = false;
                $('.nav-tabs a[href="#buscarCompra"]').tab('show');
        }




        obtenerCompras() {
                this.getTotalLista();
                this.limpiarCampos();
                this.seleccionarByPagina(this.inicio, this.fin, this.tamPagina);

                /*this.productoService.getAll()
                        .subscribe(
                        data => {//this.vistas = data;

                                this.listaProductos = data;
                        },
                        error => this.msj = <any>error);*/
        }

        obtenerTipoMoneda() {

                this.tipoMonedaService.getAll()
                        .subscribe(
                                data => {//this.vistas = data;

                                        this.tiposMoneda = data;
                                },
                                error => this.msj = <any>error);
        }

        obtenerTipoCompra() {

                this.tipoCompraService.getAll()
                        .subscribe(
                                data => {//this.vistas = data;

                                        this.tiposCompra = data;
                                        if (this.tiposCompra != null) {
                                                this.tipoCompraSelected = this.tiposCompra[0];
                                        }
                                },
                                error => this.msj = <any>error);
        }

        obtenerMediosPago() {

                this.medioPagoService.getAll()
                        .subscribe(
                                data => {//this.vistas = data;

                                        this.mediosPago = data;
                                        if (this.mediosPago != null) {
                                                this.medioPagoSelected = this.mediosPago[0];
                                        }
                                },
                                error => this.msj = <any>error);
        }


        obtenerLocales() {

                this.localService.getAll()
                        .subscribe(
                                data => {//this.vistas = data;

                                        this.locales = data;
                                },
                                error => this.msj = <any>error);
        }


        /*
        obtenerCompras() {
                this.getTotalLista();
                this.limpiarCampos();
                this.seleccionarByPagina(this.inicio, this.fin, this.tamPagina);
        }*/

        mostrarAlmacen() {
                this.obtenerAlmaceneByIdLocal(this.localSelected.id_local);

        }


        obtenerAlmaceneByIdLocal(id) {

                this.almacenService.getByIdLocal(id)
                        .subscribe(
                                data => {//this.vistas = data;

                                        this.almacenes = data;
                                },
                                error => this.msj = <any>error);
        }



        seleccionarByPagina(inicio: any, fin: any, tamPagina: any) {
                let parametros = JSON.stringify({
                        id_proveedor: this.proveedorSelected == null ? null : this.proveedorSelected.id_proveedor,
                        estado: this.estadoSelected == "" ? null : this.estadoSelected,
                        id_tipo_comprobante: this.tipoComprobanteSelected == null ? null : this.tipoComprobanteSelected.id_tipo_comprobante,
                        serie_comprobante: this.serieComprobanteSelected,
                        numero_comprobante: this.numeroComprobanteSelected,
                        fecha_comprobante: this.fechaComprobanteSelected,
                        fecha_inicio:this.fechaInicio,
                        fecha_fin:this.fechaFin,
                        id_local:this.localSelected!=null?this.localSelected.id_local:null,
                        medio_pago: this.medioPagoSelected != null ? this.medioPagoSelected.nombre : null,
                        id_medio_pago: this.medioPagoSelected == null ? null : this.medioPagoSelected.id_medio_pago,
                                                                                        
                });

                let user = this.obtenerUsuario();
                this.compraService.buscarPaginacion(inicio, fin, tamPagina, parametros)
                        .subscribe(
                                data => {
                                        this.compras = data;
                                        /*if(this.listaProductos.length>0){
                                                this.fin=this.listaProductos[this.listaProductos.length-1].correlativoDoc;
                                        }*/
                                        this.print(data);
                                },
                                error => this.msj = <any>error);
        }



        teclaEnter(event: any) {
                //console.log("tecla: "+event);
                //console.log("code: "+event.keyCode);
                if (event.keyCode == 13) {
                        //this.autocompletado=true;
                        this.buscar();
                        return false;
                }
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
                $('.nav-tabs a[href="#comprobanteCompra"]').tab('show');
                this.formComprobante.obtenerCategoriasComprobanteCompra();
                this.formComprobante.idCompraVentaSelected = this.idCompraSelected != null ? this.idCompraSelected : null;
                this.print("idVEntaCompra:" + this.formComprobante.idCompraVentaSelected);
        }


        generarGuiaRemision() {
                $('.nav-tabs a[href="#guiaRemision"]').tab('show');
                this.formGuiaRemision.obtenerCategoriasComprobanteCompra();
                this.formGuiaRemision.idCompraVentaSelected = this.idCompraSelected != null ? this.idCompraSelected : null;
        }

        registrar() {

                if (this.tienePermisoPrintMsj(this.rutas.FORM_COMPRA, this.rutas.BUTTON_REGISTRAR)) {

                        /*******BUSCAR SI YA ESTA REGISTRADO EL COMPROBANTE DE COMPRA*******/
                        let para = JSON.stringify({
                                id_proveedor: null,
                                estado: 1,
                                id_tipo_comprobante: null,
                                serie_comprobante: this.serieComprobanteSelected,
                                numero_comprobante: this.numeroComprobanteSelected,
                                fecha_comprobante: null

                        });

                        this.compraService.buscarPaginacion(1, 10, 10, para)
                                .subscribe(
                                        data => {
                                                let compras = data;
                                                if (this.isArrayVacio(compras)) {


                                                        let user = this.obtenerUsuario();

                                                        let miRuc = user.ruc_empresa;
                                                        let mi_id_persona_empresa = user.id_persona_empresa;
                                                        this.print("mi_id_persona_empresa: " + mi_id_persona_empresa);

                                                        let cliente = user.nombre_empresa;
                                                        let emisor = this.proveedorSelected.nombre;


                                                        let f = new Date();
                                                        let parametros = JSON.stringify({
                                                                id_proveedor: this.proveedorSelected.id_proveedor == null ? null : this.proveedorSelected.id_proveedor,
                                                                monto_total: parseFloat(this.montoTotalSelected),
                                                                sub_total: parseFloat(this.subTotalSelected),
                                                                igv_calc: parseFloat(this.igvPagarSelected),
                                                                descuento: parseFloat(this.descuentosSelected),
                                                                bruto: parseFloat(this.montoBrutoSelected),
                                                                id_empleado: user.id_empleado,
                                                                id_tipo_moneda: this.tipoMonedaSelected.id_tipo_moneda,
                                                                id_almacen: this.almacenSelected.id_almacen,
                                                                fecha: this.fechaSelected + " " + f.getHours() + ":" + f.getMinutes() + ":" + f.getSeconds(),
                                                                igv: parseFloat(this.igvSelected),
                                                                tipo_cambio: parseFloat(this.tipoCambioSelected),
                                                                lista_productos: this.listaProductos,
                                                                inc_igv: this.incluyeIgvSelected ? 1 : 0,
                                                                medio_pago: this.medioPagoSelected != null ? this.medioPagoSelected.nombre : null,
                                                                dias_credito: this.diasCreditoSelected,
                                                                id_tipo_compra: this.tipoCompraSelected != null ? this.tipoCompraSelected.id_tipo_compra : null,

                                                                id_conta_configuracion_cuenta: this.tipoCompraSelected != null ? 
                                                                
                                                                (this.tipoCompraSelected.hasOwnProperty('id_conta_configuracion_cuenta')?this.tipoCompraSelected.id_conta_configuracion_cuenta:null): null,
                                                                percepcion:this.percepcionSelected,
                                                                retencion:this.retencionSelected,
                                                                detraccion:this.detraccionSelected,


                                                                //DATOS GUIA DE REMISION 
                                                                id_serie_comprobante: null,
                                                                nombre_categoria_comprobante: 'COMPRA',
                                                                serie_guia: this.serieGuiaSelected,
                                                                numero_guia: this.numeroGuiaSelected,
                                                                ruc_emisor: this.proveedorSelected.ruc,
                                                                ruc_destinatario: miRuc,
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
                                                                tipo_guia: 'COMPRA',
                                                                id_tipo_moneda_costo: this.tipoMonedaCostoSelected == null ? null : this.tipoMonedaCostoSelected.id_tipo_moneda,
                                                                emisor: emisor,

                                                                //DATOS DE COMPROBANTE COMPRA
                                                                id_tipo_comprobante: this.tipoComprobanteSelected == null ? null : this.tipoComprobanteSelected.id_tipo_comprobante,
                                                                serie_comprobante: this.serieComprobanteSelected,
                                                                numero_comprobante: this.numeroComprobanteSelected,
                                                                fecha_comprobante: this.fechaComprobanteSelected,
                                                                id_medio_pago: this.medioPagoSelected == null ? null : this.medioPagoSelected.id_medio_pago,
                                                                ruc_receptor: miRuc,
                                                                cliente: cliente,
                                                                telefono: this.proveedorSelected.telefono,
                                                                direccion: user.direccion_empresa
                                                        });

                                                        this.compraService.registrar(parametros)
                                                                .subscribe(
                                                                        data => {
                                                                                this.idCompraSelected = data.id_compra
                                                                                let rpta = data.rpta;
                                                                                this.print("rpta: " + rpta);
                                                                                if (rpta != null) {
                                                                                        if (rpta == 1) {

                                                                                                this.mensajeCorrectoSinCerrar("COMPRA REGISTRADA CORRECTAMENTE  - COD :" + this.idCompraSelected);

                                                                                        } else {
                                                                                                this.mensajeInCorrecto("COMPRA NO REGISTRADA");

                                                                                        }
                                                                                }

                                                                        },
                                                                        error => this.msj = <any>error
                                                                );



                                                }else{
                                                        this.mensajeAdvertencia("EL COMPROBANTE DE COMPRA YA ESTA REGISTRADO");
                                                }

                                                this.print(data);
                                        },
                                        error => this.msj = <any>error);
                }
        }

        buscar() {

                if (this.tienePermisoPrintMsj(this.rutas.FORM_COMPRA, this.rutas.BUTTON_BUSCAR)) {
                        this.getTotalLista();
                        this.seleccionarByPagina(this.inicio, this.fin, this.tamPagina);
                }
        }


        limpiar() {
                this.limpiarCampos();
                this.inicio = 1;
                this.fin = 10;
                this.tamPagina = 10;
                this.getTotalLista();
                this.seleccionarByPagina(this.inicio, this.fin, this.tamPagina);
        }


        eliminar(bean) {

                if (this.tienePermisoPrintMsj(this.rutas.FORM_COMPRA, this.rutas.BUTTON_ELIMINAR)) {
                        let user = this.obtenerUsuario();
                        if (confirm("Realmente Desea Eliminar ?")) {
                                this.compraService.eliminarLogicoEmpleado(bean.id_compra, user.id_empleado)
                                        .subscribe(
                                                data => {
                                                        this.obtenerCompras();
                                                        let rpta = data;
                                                        if (rpta != null) {
                                                                if (rpta == 1) {
                                                                        this.mensajeCorrecto("COMPRA ELIMINADA CORRECTAMENTE");
                                                                } else {
                                                                        this.mensajeInCorrecto("COMPRA NO ELIMINADA");
                                                                }

                                                        }
                                                },
                                                error => this.msj = <any>error);
                        }
                }
        }





        editar() {


                if (this.tienePermisoPrintMsj(this.rutas.FORM_COMPRA, this.rutas.BUTTON_ACTUALIZAR)) {

                        this.obtenerProductosInsertados();
                        this.obtenerProductosActualizados();

                        this.print("lista ORIGINAL: ");
                        this.print(this.listaProductosOriginal);
                        this.print("lista insertados: ");
                        this.print(this.listaProductosInsertados);
                        this.print("lista actualizados: ");
                        this.print(this.listaProductosActualizados);
                        this.print("lista eliminados: ");
                        this.print(this.listaProductosEliminados);


                        
                        let user = this.obtenerUsuario();

                        let miRuc = user.ruc_empresa;
                        let mi_id_persona_empresa = user.id_persona_empresa;
                        this.print("mi_id_persona_empresa: " + mi_id_persona_empresa);

                        let cliente = user.nombre_empresa;
                        let emisor = this.proveedorSelected.nombre;


                        let f = new Date();

                        let parametros = JSON.stringify({


                                id_proveedor: this.proveedorSelected.id_proveedor == null ? null : this.proveedorSelected.id_proveedor,
                                monto_total: parseFloat(this.montoTotalSelected),
                                sub_total: parseFloat(this.subTotalSelected),
                                igv_calc: parseFloat(this.igvPagarSelected),
                                descuento: parseFloat(this.descuentosSelected),
                                bruto: parseFloat(this.montoBrutoSelected),
                                id_empleado: user.id_empleado,
                                id_tipo_moneda: this.tipoMonedaSelected.id_tipo_moneda,
                                id_almacen: this.almacenSelected.id_almacen,
                                fecha: this.fechaSelected + " " + f.getHours() + ":" + f.getMinutes() + ":" + f.getSeconds(),
                                igv: parseFloat(this.igvSelected),
                                tipo_cambio: parseFloat(this.tipoCambioSelected),
                                inc_igv: this.incluyeIgvSelected ? 1 : 0,
                                medio_pago: this.medioPagoSelected != null ? this.medioPagoSelected.nombre : null,
                                dias_credito: this.diasCreditoSelected,
                                id_tipo_compra: this.tipoCompraSelected != null ? this.tipoCompraSelected.id_tipo_compra : null,
                                percepcion:this.percepcionSelected,
                                retencion:this.retencionSelected,
                                detraccion:this.detraccionSelected,

                                //DATOS GUIA DE REMISION 
                                id_serie_comprobante: null,
                                nombre_categoria_comprobante: 'COMPRA',
                                serie_guia: this.serieGuiaSelected,
                                numero_guia: this.numeroGuiaSelected,
                                ruc_emisor: this.proveedorSelected.ruc,
                                ruc_destinatario: miRuc,
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
                                tipo_guia: 'COMPRA',
                                id_tipo_moneda_costo: this.tipoMonedaCostoSelected == null ? null : this.tipoMonedaCostoSelected.id_tipo_moneda,
                                emisor: emisor,
                                
                                id_guia_remision:this.id_guia_remision,

                                //DATOS DE COMPROBANTE COMPRA
                                id_tipo_comprobante: this.tipoComprobanteSelected == null ? null : this.tipoComprobanteSelected.id_tipo_comprobante,
                                serie_comprobante: this.serieComprobanteSelected,
                                numero_comprobante: this.numeroComprobanteSelected,
                                fecha_comprobante: this.fechaComprobanteSelected,
                                id_medio_pago: this.medioPagoSelected == null ? null : this.medioPagoSelected.id_medio_pago,
                                ruc_receptor: miRuc,
                                cliente: cliente,
                                telefono: this.proveedorSelected.telefono,
                                direccion: user.direccion_empresa,
                                id_comprobante:this.id_comprobante,

                                lista_productos: this.listaProductosActualizados,
                                lista_producto_eliminados: this.listaProductosEliminados,
                                lista_producto_insertados: this.listaProductosInsertados
                        });






                        this.compraService.editar(parametros, this.beanSelectedExterno.id_compra)
                                .subscribe(
                                        data => {
                                                this.obtenerCompras();
                                                let rpta = data.rpta;
                                                this.print("rpta: " + rpta);
                                                if (rpta != null) {
                                                        if (rpta) {
                                                                this.mensajeCorrecto("COMPRA MODIFICADA CORRECTAMENTE");
                                                        } else {
                                                                this.mensajeInCorrecto("COMPRA  NO MODIFICADA");
                                                        }
                                                }

                                        },
                                        error => this.msj = <any>error
                                );

                }
        }

        obtenerProductosInsertados() {
                let j;
                for (j = 0; j < this.listaProductos.length; j++) {
                        if (this.listaProductos[j].id_detalle_compra == null) {
                                this.listaProductosInsertados.push(this.listaProductos[j]);
                        }
                }
        }

        obtenerProductosActualizados() {
                let j;
                for (j = 0; j < this.listaProductos.length; j++) {
                        if (this.listaProductos[j].id_detalle_compra != null) {
                                this.listaProductosActualizados.push(this.listaProductos[j]);
                        }
                }
        }





        limpiarCampos() {
                this.medioPagoSelected=null;
                this.id_compra_busqueda= null;
                this.fechaInicio= null;
                this.fechaFin= null;
                this.localSelected!= null;
                
                this.beanSelectedExterno = null;
                this.panelRegistroSelected = false;
                this.proveedorSelected = null;
                this.listaProductos = new Array();
                this.simboloMonedaSelected = null;
                this.subTotalSelected = "0";
                this.descuentosSelected = "0";
                this.montoTotalSelected = "0";
                this.igvPagarSelected = "0";
                this.montoBrutoSelected = "0";
                this.incluyeIgvSelected = false;

                this.tipoComprobanteSelected = null;
                this.serieComprobanteSelected = null;
                this.numeroComprobanteSelected = null;
                this.fechaComprobanteSelected = null;

                this.numeroGuiaSelected=null;
                this.serieGuiaSelected=null;
                this.fechaEmisionSelected=null;
                this.fechaInicioTrasladoSelected=null;
                
                this.estadoSelected = "";
                this.listaProductosEliminados = new Array();
                this.listaProductosInsertados = new Array();
                this.listaProductosActualizados = new Array();

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




        getTotalLista() {
                /*this.productoService.getTotal()
                        .subscribe(
                        data => {
                                this.totalLista = data;
                                console.log(data);
                        },
                        error => this.msj = <any>error);*/
                let parametros = JSON.stringify({
                        id_proveedor: this.proveedorSelected == null ? null : this.proveedorSelected.id_proveedor,
                        estado: this.estadoSelected == "" ? null : this.estadoSelected,
                        id_tipo_comprobante: this.tipoComprobanteSelected == null ? null : this.tipoComprobanteSelected.id_tipo_comprobante,
                        serie_comprobante: this.serieComprobanteSelected,
                        numero_comprobante: this.numeroComprobanteSelected,
                        fecha_comprobante: this.fechaComprobanteSelected,
                        fecha_inicio:this.fechaInicio,
                        fecha_fin:this.fechaFin,
                        id_local:this.localSelected!=null?this.localSelected.id_local:null,
                        medio_pago: this.medioPagoSelected != null ? this.medioPagoSelected.nombre : null,
                        id_medio_pago: this.medioPagoSelected == null ? null : this.medioPagoSelected.id_medio_pago,
                                                                                        
                });

                this.print("parametros total: " + parametros);
                this.compraService.getTotalParametros(parametros)
                        .subscribe(
                                data => {
                                        this.totalLista = data;
                                        this.print("total:" + data);
                                },
                                error => this.msj = <any>error);
        }



        //**********ACCIONES PARAR FORMULARIO PRODUCTO********
        abrirModalCatalogoCompra() {
                //this.cerrarPanelRegistrar();
                this.abrirModal("modalCatalogoCompra");
                //this.panelListaBeanSelectedPer = true;
        }

        abrirModalProducto() {
                //this.cerrarPanelRegistrar();
                this.abrirModal("modalProducto2");
                //this.panelListaBeanSelectedPer = true;
        }

        //**********ACCIONES PARAR FORMULARIO Cliente********
        abrirModalProveedor() {
                this.abrirModal("modalProveedor2");
        }



        //**********METODO QUE OBTIENE LOS DATOS EXTERNOS 
        obtenerDatosExternos(datos) {
                this.beanSelectedExterno = datos.bean;
                this.idProductoSelected = this.beanSelectedExterno.id_producto;
                this.cerrarModal("modalCatalogoCompra");
                this.print("DATOS EXTERNOS: ");
                this.print(datos);
                this.abrirPanelRegistrar();
                this.beanSelectedExterno.cantidad = 1;
                this.beanSelectedExterno.id_unidad_medida = this.unidades_medida[0].id_unidad_medida;

                this.listaProductos.push(this.beanSelectedExterno);
                this.sumarTotalProductos();
        }


        sumarTotalProductos() {

                let total = 0;
                let subTotal = 0;
                let descuentos = 0;
                for (let i = 0; i < this.listaProductos.length; i++) {
                        this.listaProductos[i].id_tipo_moneda = this.tipoMonedaSelected == null ? null : this.tipoMonedaSelected.id_tipo_moneda;
                        total = total + (this.incluyeIgvSelected ? this.round2(this.listaProductos[i].precio_igv * this.listaProductos[i].cantidad) : this.round2(this.listaProductos[i].precio * this.listaProductos[i].cantidad));
                        subTotal = subTotal + this.round2(this.listaProductos[i].sub_total);



                        if (this.listaProductos[i].porc_desc1 > 0) {
                                descuentos = descuentos + this.round2(this.listaProductos[i].desc1);
                        }

                        if (this.listaProductos[i].porc_desc2 > 0) {
                                descuentos = descuentos + this.round2(this.listaProductos[i].desc2);
                        }

                        if (this.listaProductos[i].porc_desc3 > 0) {
                                descuentos = descuentos + this.round2(this.listaProductos[i].desc3);
                        }

                        if (this.listaProductos[i].porc_desc4 > 0) {
                                descuentos = descuentos + this.round2(this.listaProductos[i].desc4);
                        }



                        if (i == 0) {
                                this.simboloMonedaSelected = this.listaProductos[i].nombre_simbolo_moneda;
                                this.idTipoMonedaSelected = this.listaProductos[i].id_tipo_moneda;
                        }

                }
                //this.montoTotalSelected=total; 

                if (!this.incluyeIgvSelected) {
                        this.print("sumando SIN INC IGV");
                        this.montoBrutoSelected = "" + this.round2(total);
                        this.subTotalSelected = "" + this.round2(subTotal);
                        //this.descuentosSelected = "" + this.round2(descuentos);
                        this.montoBrutoSelected = this.completar_ceros_derecha("" + this.montoBrutoSelected, 2);
                        this.subTotalSelected = this.completar_ceros_derecha("" + this.subTotalSelected, 2);


                        this.descuentosSelected = "" + this.round2(total - subTotal);
                        this.descuentosSelected = this.completar_ceros_derecha("" + this.descuentosSelected, 2);

                        let igv_pagar = this.round2(subTotal * this.igvSelected);
                        this.igvPagarSelected = "" + igv_pagar;
                        this.igvPagarSelected = this.completar_ceros_derecha("" + this.igvPagarSelected, 2);
                        this.montoTotalSelected = "" + this.round2(subTotal + igv_pagar);
                        this.montoTotalSelected = this.completar_ceros_derecha("" + this.montoTotalSelected, 2);

                } else if (this.incluyeIgvSelected) {
                        this.print("sumando INC IGV");
                        this.montoTotalSelected = "" + this.round2(subTotal);
                        this.montoTotalSelected = this.completar_ceros_derecha("" + this.montoTotalSelected, 2);

                        let sub = this.round2(subTotal / 1.18);
                        this.subTotalSelected = "" + sub;
                        this.subTotalSelected = this.completar_ceros_derecha("" + this.subTotalSelected, 2);

                        this.montoBrutoSelected = "" + this.round2(total);
                        this.montoBrutoSelected = this.completar_ceros_derecha("" + this.montoBrutoSelected, 2);

                        this.descuentosSelected = "" + this.round2(total - subTotal);
                        this.descuentosSelected = this.completar_ceros_derecha("" + this.descuentosSelected, 2);

                        let igv_pagar = this.round2(subTotal - sub);
                        this.igvPagarSelected = "" + igv_pagar;
                        this.igvPagarSelected = this.completar_ceros_derecha("" + this.igvPagarSelected, 2);


                }
        }



        calcularPrecioIgv() {
                this.print("calcular igv: " + this.incluyeIgvSelected);
                if (this.incluyeIgvSelected == true) {
                        this.print("calcular precio inc el igv:");
                        for (let i = 0; i < this.listaProductos.length; i++) {
                                //this.listaProductos[i].incluye_igv=true;
                                this.listaProductos[i].precio = this.round2(this.listaProductos[i].precio_igv / 1.18);
                        }
                }

                if (this.incluyeIgvSelected == false) {
                        this.print("calcular precio sin el igv:");
                        for (let i = 0; i < this.listaProductos.length; i++) {
                                //this.listaProductos[i].incluye_igv=true;
                                this.listaProductos[i].precio_igv = this.round2(this.listaProductos[i].precio * 1.18);
                        }
                }
        }

        calcularPrecioIgvIndividual(i) {
                this.print("calcular igv: " + this.incluyeIgvSelected);

                if (this.incluyeIgvSelected == true) {
                        this.print("calcular precio inc el igv:");
                        this.listaProductos[i].precio = this.round2(this.listaProductos[i].precio_igv / 1.18);
                }

                if (this.incluyeIgvSelected == false) {
                        this.print("calcular precio sin el igv:");
                        this.listaProductos[i].precio_igv = this.round2(this.listaProductos[i].precio * 1.18);
                }
        }


        activarPrecioIgv() {
                /*if(this.incluyeIgvSelected){
                        this.incluyeIgvSelected=false;
                }else{
                        if(!this.incluyeIgvSelected){
                                this.incluyeIgvSelected=true;
                        }
                }*/

                for (let i = 0; i < this.listaProductos.length; i++) {
                        this.calcularPorcDescTotal(i);
                }
        }

        calcularConDesc(i: any) {
                this.print("descuento directo");
                let res_desc = this.listaProductos[i].desc;
                let calc = ((res_desc * 100) / this.listaProductos[i].precio);
                let porc_desc = res_desc > 0 ? this.round2(calc) : 100;
                this.listaProductos[i].porc_desc = porc_desc;
                this.listaProductos[i].precio = this.round2(this.listaProductos[i].precio - this.listaProductos[i].desc);

                this.sumarTotalProductos();

        }

        calcularPorcDesc(i: any) {
                this.print("descuento por porcentaje");
                let desc = this.round2((this.listaProductos[i].precio * this.listaProductos[i].porc_desc) / 100.00);
                this.listaProductos[i].desc = desc;
                this.listaProductos[i].precio = this.round2(this.listaProductos[i].precio - this.listaProductos[i].desc);


                this.sumarTotalProductos();
        }


        calcularPorcDescKeyPress(event: any, i: any) {

                //  tecla flecha arriba     :  38
                //  tecla flecha abajo      :  40
                //  tecla enter             :  13
                //  tecla barra espaciadora : 32
                //  tecla escape            : 27

                if (event.keyCode == 13) {
                        this.calcularPorcDescTotal(i);
                }


        }

        calcularPorcDescTotal(i: any) {

                this.print("descuento por porcentaje");

                this.calcularPrecioIgvIndividual(i);

                this.listaProductos[i].sub_total = this.incluyeIgvSelected ? this.listaProductos[i].precio_igv * this.listaProductos[i].cantidad : this.listaProductos[i].precio * this.listaProductos[i].cantidad;

                if (this.listaProductos[i].porc_desc1 > 0) {

                        /*this.listaProductos[i].desc1_uni=this.incluyeIgvSelected?
                                        (this.listaProductos[i].precio_igv * this.listaProductos[i].porc_desc1)/ 100.00:
                                        (this.listaProductos[i].precio * this.listaProductos[i].porc_desc1)/ 100.00;

                        if(this.incluyeIgvSelected){
                                this.listaProductos[i].precio_igv_desc=this.round2(this.listaProductos[i].precio_igv - this.listaProductos[i].desc1_uni);
                        }else{
                                this.listaProductos[i].precio_desc=this.round2(this.listaProductos[i].precio - this.listaProductos[i].desc1_uni); 
                        }*/

                        this.listaProductos[i].desc1_uni = (this.listaProductos[i].precio * this.listaProductos[i].porc_desc1) / 100.00;
                        this.listaProductos[i].precio_desc = this.round2(this.listaProductos[i].precio - this.listaProductos[i].desc1_uni);




                        this.listaProductos[i].desc1 = (this.listaProductos[i].sub_total * this.listaProductos[i].porc_desc1) / 100.00;
                        this.listaProductos[i].sub_total1 = this.listaProductos[i].sub_total - this.listaProductos[i].desc1;
                        this.listaProductos[i].sub_total = this.listaProductos[i].sub_total1;
                }

                if (this.listaProductos[i].porc_desc2 > 0 && this.listaProductos[i].porc_desc1 > 0) {

                        this.listaProductos[i].desc2_uni = (this.listaProductos[i].precio_desc * this.listaProductos[i].porc_desc2) / 100.00;
                        this.listaProductos[i].precio_desc = this.round2(this.listaProductos[i].precio_desc - this.listaProductos[i].desc2_uni);


                        this.listaProductos[i].desc2 = (this.listaProductos[i].sub_total1 * this.listaProductos[i].porc_desc2) / 100.00;
                        this.listaProductos[i].sub_total2 = this.listaProductos[i].sub_total1 - this.listaProductos[i].desc2;
                        this.listaProductos[i].sub_total = this.listaProductos[i].sub_total2;
                }


                if (this.listaProductos[i].porc_desc3 > 0 && this.listaProductos[i].porc_desc2 > 0 && this.listaProductos[i].porc_desc1 > 0) {

                        this.listaProductos[i].desc3_uni = (this.listaProductos[i].precio_desc * this.listaProductos[i].porc_desc3) / 100.00;
                        this.listaProductos[i].precio_desc = this.round2(this.listaProductos[i].precio_desc - this.listaProductos[i].desc3_uni);


                        this.listaProductos[i].desc3 = (this.listaProductos[i].sub_total2 * this.listaProductos[i].porc_desc3) / 100.00;
                        this.listaProductos[i].sub_total3 = this.listaProductos[i].sub_total2 - this.listaProductos[i].desc3;
                        this.listaProductos[i].sub_total = this.listaProductos[i].sub_total3;
                }

                if (this.listaProductos[i].porc_desc4 > 0 && this.listaProductos[i].porc_desc3 > 0 && this.listaProductos[i].porc_desc2 > 0 && this.listaProductos[i].porc_desc1 > 0) {

                        this.listaProductos[i].desc4_uni = (this.listaProductos[i].precio_desc * this.listaProductos[i].porc_desc4) / 100.00;
                        this.listaProductos[i].precio_desc = this.round2(this.listaProductos[i].precio_desc - this.listaProductos[i].desc4_uni);


                        this.listaProductos[i].desc4 = (this.listaProductos[i].sub_total3 * this.listaProductos[i].porc_desc4) / 100.00;
                        this.listaProductos[i].sub_total4 = this.listaProductos[i].sub_total3 - this.listaProductos[i].desc4;
                        this.listaProductos[i].sub_total = this.listaProductos[i].sub_total4;
                }


                this.listaProductos[i].sub_total = this.round2(this.listaProductos[i].sub_total);
                this.listaProductos[i].sub_total = this.completar_ceros_derecha("" + this.listaProductos[i].sub_total, 2);

                this.sumarTotalProductos();
        }


        calcularPorcDesc1(i: any) {

                this.print("descuento por porcentaje");
                this.listaProductos[i].sub_total = this.listaProductos[i].precio * this.listaProductos[i].cantidad;
                let desc = this.round2((this.listaProductos[i].sub_total * this.listaProductos[i].porc_desc1) / 100.00);
                this.listaProductos[i].desc1 = desc;
                this.listaProductos[i].sub_total = this.round2(this.listaProductos[i].sub_total - this.listaProductos[i].desc1);

                this.sumarTotalProductos();
        }

        calcularPorcDesc2(i: any) {

                if (this.listaProductos[i].porc_desc1 > 0) {
                        this.calcularPorcDesc1(i);

                        this.print("descuento por porcentaje");
                        let desc = this.round2((this.listaProductos[i].sub_total * this.listaProductos[i].porc_desc2) / 100.00);
                        this.listaProductos[i].desc2 = desc;
                        this.listaProductos[i].sub_total = this.round2(this.listaProductos[i].sub_total - this.listaProductos[i].desc2);

                        this.sumarTotalProductos();

                }

        }

        calcularPorcDesc3(i: any) {

                if (this.listaProductos[i].porc_desc1 > 0 && this.listaProductos[i].porc_desc2 > 0) {
                        this.calcularPorcDesc1(i);

                        this.print("descuento por porcentaje");
                        let desc = this.round2((this.listaProductos[i].precio * this.listaProductos[i].porc_desc3) / 100.00);
                        this.listaProductos[i].desc3 = desc;
                        this.listaProductos[i].precio = this.round2(this.listaProductos[i].precio - this.listaProductos[i].desc3);

                        this.sumarTotalProductos();
                }
        }

        calcularPorcDesc4(i: any) {
                this.print("descuento por porcentaje");
                let desc = this.round2((this.listaProductos[i].precio * this.listaProductos[i].porc_desc4) / 100.00);
                this.listaProductos[i].desc = desc;
                this.listaProductos[i].precio = this.round2(this.listaProductos[i].precio - this.listaProductos[i].desc);


                this.sumarTotalProductos();
        }


        obtenerProveedorDatosExternos(datos) {
                this.proveedorSelected = datos.bean;
                this.print("datos Proveedor");
                this.print(datos);
                this.cerrarModal("modalProveedor2");


        }
        /*obtenerClienteDatosExternos(datos) {
                this.clienteSelected=datos.bean;
                console.log("datos Cliente");
                console.log(datos);
                this.cerrarModal("modalCliente");

        }*/


        obtenerDatosProducto(datos) {
                this.beanSelectedExterno = datos.bean;
                this.idProductoSelected = this.beanSelectedExterno.id_producto;
                //this.listaClientes.splice(0,this.listaClientes.length);
                //this.listaClientes.push(datos.bean)
                //this.listaClientes=datos.bean;
                //this.cerrarModal("modalProducto2");
                this.print("DATOS EXTERNOS: ");
                this.print(datos);
                this.abrirPanelRegistrar();
                this.beanSelectedExterno.precio = 1;
                this.beanSelectedExterno.precio_referencia = 1;
                this.beanSelectedExterno.id_detalle_compra = null;
                this.beanSelectedExterno.cantidad = 1;
                this.print("unidad medida: ");
                this.print(this.unidades_medida);
                this.beanSelectedExterno.id_unidad_medida = this.unidades_medida[0].id_unidad_medida;
                this.listaProductos.push(this.beanSelectedExterno);
                this.sumarTotalProductos();
                this.mensajeCorrecto("PRODUCTO AGREGADO CORRECTAMENTE");
        }


        eliminarCarrito(i) {
                this.print("INDICE A ELIMINAR: " + i);
                this.listaProductos.splice(i, 1)
                this.sumarTotalProductos();
        }


        eliminarCarritoEditar(i) {
                this.print("INDICE A ELIMINAR: " + i);

                if (this.listaProductos[i].id_detalle_compra != null) {
                        this.listaProductosEliminados.push(this.listaProductos[i]);
                }
                this.listaProductos.splice(i, 1)
                this.sumarTotalProductos();
        }



        buscarCompra(obj) {
                if (this.tienePermisoPrintMsj(this.rutas.FORM_COMPRA, this.rutas.BUTTON_VER_DETALLE)) {
                        this.panelDetalleCompraSelected = true;
                        this.compraService.getCompraById(obj.id_compra)
                                .subscribe(
                                        data => {
                                                this.listaProductosDetalle = data.detalle_compra;
                                                this.compraSelected = data.compra;

                                                this.proveedorSelected = {
                                                        id_proveedor: this.compraSelected.id_proveedor,
                                                        nombre: this.compraSelected.nombres_proveedor,
                                                        representante: this.compraSelected.nombres_representante,
                                                        ruc: this.compraSelected.ruc_proveedor,
                                                        correo: this.compraSelected.correo_proveedor,
                                                        telefono: this.compraSelected.telefono_proveedor
                                                };

                                                this.montoTotalSelected = this.compraSelected.monto_total;

                                                this.tipoMonedaSelected = this.obtenerTipoMonedaActualId(this.compraSelected.id_tipo_moneda);
                                                this.localSelected = this.obtenerLocalActual(this.compraSelected.nombre_local);
                                                this.obtenerAlmaceneByIdLocalEditar(this.localSelected.id_local);
                                                this.fechaSelected = this.compraSelected.fecha_compra.substr(0, 10);
                                                this.print("fecha: " + this.fechaSelected);
                                                this.igvSelected = this.compraSelected.igv_lista_precio;
                                                this.tipoCambioSelected = this.compraSelected.tipo_cambio;
                                                this.listaProductos = data.detalle_compra;
                                                //this.incluyeIgvSelected=this.compraSelected.inc_igv;


                                                this.incluyeIgvSelected = this.compraSelected.inc_igv == '0' ? false : true;
                                                this.activarPrecioIgv();
                                                this.print(data);

                                        },
                                        error => this.msj = <any>error);
                }
        }


        obtenerTipoComprobanteActual(nombreTipo: string) {
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


        obtenerTipoCompraActual(id: string) {
                let obj = null;
                let i;
                for (i = 0; i < this.tiposCompra.length; i++) {
                        if (this.tiposCompra[i].id_tipo_compra == id) {
                                obj = this.tiposCompra[i];
                                break;
                        }
                }
                return obj;
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

        obtenerMedioPagoActualNombre(nombre: string) {
                let obj = null;
                let i;
                for (i = 0; i < this.mediosPago.length; i++) {
                        if (this.mediosPago[i].nombre == nombre) {
                                obj = this.mediosPago[i];
                                break;
                        }
                }
                return obj;
        }



    
        regresarListaCompras() {
                this.panelDetalleCompraSelected = false;
        }


        obtenerUnidadMedidaActual(nombreTipo: string) {
                let obj = null;
                let i;
                for (i = 0; i < this.unidades_medida.length; i++) {
                        //this.print("this.tipos_producto[i].nombre"+this.tipos_producto[i].nombre+" , nombreTipo: " +nombreTipo);
                        if (this.unidades_medida[i].nombre == nombreTipo) {
                                obj = this.unidades_medida[i];
                                break;
                        }
                }
                return obj;
        }


        //***********MANEJO DEL AUTOCOMPLETADO************


        teclaKeyPressAutocomplete(event: any, indice: any) {

                if (!this.listaProductos[indice].eleccion_autocompletado_selected && event.keyCode == 13) {
                        this.listaProductos[indice].lista_autocompletado = null;
                        this.listaProductos[indice].eleccion_autocompletado_selected = false;
                        this.indiceLista = -1;
                        this.buscar();
                        return false;
                }

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
                if (event.keyCode == 38 || event.keyCode == 40 || event.keyCode == 32 || event.keyCode == 13) {

                        //************MANEJO DE TECLAS AUTOCOMPLETADO*********
                        //************FLECHA HACIA ARRIBA************
                        if (event.keyCode == 38) {

                                let lista = [];
                                lista = $('.lista-diego2 li');

                                //$('.lista-diego2 li').each(function(indice, elemento) {
                                //this.print('El elemento con el índice '+indice+' contiene '+$(elemento).text());
                                //});
                                if (lista.length >= 0) {

                                        this.indiceLista = this.indiceLista == -1 ? lista.length - 1 : this.indiceLista;
                                        if (this.indiceLista >= 0) {
                                                this.indiceLista--;
                                                this.indiceLista = this.indiceLista == -1 ? lista.length - 1 : this.indiceLista;

                                                $('.lista-diego2 li').removeClass();
                                                $(lista[this.indiceLista]).addClass("seleccionado");
                                        }

                                }




                                this.print("PRESIONASTE TECLA HACIA ARRIBA UP")
                                this.print("tamaño: " + $('.lista-diego2 li'));
                                this.print("tam:" + lista.length);
                                this.print("indice:" + this.indiceLista);

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

                                this.print("PRESIONASTE TECLA HACIA ABAJO UP")
                                this.print("tamaño: " + $('.lista-diego2 li'));
                                this.print("tam:" + lista.length);
                                this.print("indice:" + this.indiceLista);

                        }


                }
        }


        teclaKeyUpAutocomplete(event: any, indice: any) {

                //  tecla flecha arriba     :  38
                //  tecla flecha abajo      :  40
                //  tecla enter             :  13
                //  tecla barra espaciadora : 32
                //  tecla escape            : 27

                //var pos = $("#tbCompracelda"+indice).position();
                //var off =  $("#tbCompracelda"+indice).offset();
                //alert("POS Y: " + pos.top + " X: " + pos.left + "tbListaPro"+indice);
                //alert("OFF Y: " + off.top + " X: " + off.left + "tbListaPro"+indice);
                //$("#tbListaPro"+indice).css("position", "fixed");
                //$("#tbListaPro"+indice).css("top", "0px");
                //$("#tbListaPro"+indice).css("top", "20px");

                //$("#tbListaPro"+indice).attr('style','position:fixed, top:0px ,left:20px');


                if (event.keyCode != 38 && event.keyCode != 40 && event.keyCode != 13 && event.keyCode != 27) {
                        this.listaNulaAutocompletado();
                        this.listaProductos[indice].activo = true;
                        this.buscarAutocompletado(indice);
                }

                if (event.keyCode == 27) {
                        this.indiceLista = -1;
                        this.listaProductos[indice].lista_autocompletado = null;
                        this.listaProductos[indice].eleccion_autocompletado_selected = false;
                }
        }



        elegirProducto(producto: any, indice: any) {
                if (producto != null) {
                        this.print(producto);
                        this.indiceLista = -1;
                        this.listaProductos[indice].nombre = producto.nombre;

                        this.listaProductos[indice].id_producto = producto.id_producto;
                        this.listaProductos[indice].id_unidad_medida = producto.id_unidad_medida;
                        this.listaProductos[indice].nombre_tipo_producto = producto.nombre_tipo_producto;
                        //this.listaProductos[indice].unidad_medida=this.obtenerUnidadMedidaActual(producto.nombre_unidad_medida);
                        this.listaProductos[indice].nombre_marca = producto.nombre_marca;
                        this.listaProductos[indice].nombre_unidad_medida = producto.nombre_unidad_medida;
                        this.listaProductos[indice].id_unidad_medida = this.unidades_medida.length > 0 ? this.unidades_medida[0].id_unidad_medida : null;
                        this.listaProductos[indice].nombre_aplicacion = producto.nombre_aplicacion;
                        this.listaProductos[indice].medida_a = producto.medida_a;
                        this.listaProductos[indice].medida_b = producto.medida_b;
                        this.listaProductos[indice].medida_c = producto.medida_c;
                        this.listaProductos[indice].medida_d = producto.medida_d;
                        this.listaProductos[indice].descripcion = producto.descripcion;
                        this.listaProductos[indice].codigo = producto.codigo;




                        this.listaProductos[indice].lista_autocompletado = null;
                        this.listaProductos[indice].eleccion_autocompletado_selected = false;
                        this.sumarTotalProductos();

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
                        this.buscar();
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
                this.productoService.buscarPaginacion(inicio, fin, tamPagina, parametros)
                        .subscribe(
                                data => {
                                        this.listaProductos[indice].lista_autocompletado = data;
                                        this.listaProductos[indice].eleccion_autocompletado_selected = true;

                                        /*if(this.listaProductos.length>0){
                                                this.fin=this.listaProductos[this.listaProductos.length-1].correlativoDoc;
                                        }*/

                                        this.print("lista autocompletado: ");
                                        this.print(data);

                                        //var pos = $("#tbCompracelda"+indice).position();
                                        //alert("POS Y: " + pos.top + " X: " + pos.left +" Y1: " + pos.bottom + " X1: " + pos.right +" tbListaPro"+indice);
                                        //alert("OFF Y: " + off.top + " X: " + off.left +" Y1: " + off.bottom + " X1: " + off.right +" tbListaPro"+indice);
                                        //$("#tbListaPro"+indice).css("position", "fixed");
                                        //$("#tbListaPro"+indice).css("top", "0px");
                                        //$("#tbListaPro"+indice).css("top", "20px");

                                        //$("#tbListaPro"+indice).attr('style',"position:fixed; top:"+(off.top-148)+"px ;left:"+off.left+"px");


                                        /*
                                        var off =  $("#tbCompracelda"+indice).offset(); 
                                        $("#tbListaPro"+indice).attr('style',"position:fixed; top:"+(60)+"% ;left:"+off.left+"px");
                                */
                                },
                                error => this.msj = <any>error);
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

                this.productoService.buscarPaginacion(inicio, fin, tamPagina, parametros)
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








        editarCompraAction(data) {
                this.print("bean:");
                this.print(data);

                //this.panelEditarSelected = true;
                //this.formEditPersona.limpiarCampos();
                $('.nav-tabs a[href="#nuevoCompra"]').tab('show');
                this.formNewCompra.tituloPanel="Editando Compra: << Id: "+data.bean.id_compra+" , Proveedor: "+data.bean.nombres_proveedor+" >>";
                this.formNewCompra.setBeanEditar(data.bean);

        }

}