import { Component, AfterViewInit, ViewChild, OnInit , EventEmitter, Output} from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';

import { ControllerComponent } from '../../../../core/controller/controller.component';




/******************IMPORTAR SERVICIOS*************** */


import { CompraService } from '../../service/compra.service';
//import { TipoMonedaService } from '../../mantenedores/service/tipo-moneda.Service';
import { TipoMonedaService } from '../../../mantenedores/service/tipo-moneda.service';
import { TipoCompraService } from '../../../mantenedores/service/tipo-compra.service';
import { MedioPagoService } from '../../../mantenedores/service/medio-pago.service';
import { LocalService } from '../../../mantenedores/service/local.service';
import { AlmacenService } from '../../../mantenedores/service/almacen.service';
import { UnidadMedidaService } from '../../../mantenedores/service/unidad-medida.service';
import { ProductoService } from '../../../mantenedores/service/producto.service';
import { TipoComprobanteService } from '../../../mantenedores/service/tipo-comprobante.service';
import { TipoCambioService } from '../../../mantenedores/service/tipo-cambio.service';
import { ReportePdfService } from '../../../../core/service/reporte-pdf.Service';
import { ReporteExcelService } from '../../../../core/service/reporte-excel.Service';
import { FormNewComprobanteComponent } from '../../../ventas/controller/comprobante/form-new-comprobante.component';
import { FormNewGuiaRemisionComponent } from '../../../mantenedores/controller/guia-remision/form-new-guia-remision.component';
import { FormFindProveedorComponent } from 'src/app/subSistemas/mantenedores/controller/proveedor/form-find-proveedor.component';


declare var $: any;
@Component({
        selector: 'form-find-compra',
        templateUrl: '../../view/compra/form-find-compra.component.html',
        providers: [TipoCambioService,TipoComprobanteService, ProductoService, TipoMonedaService, CompraService, ReporteExcelService,ReportePdfService, LocalService,
                AlmacenService, UnidadMedidaService, TipoCompraService, MedioPagoService]

})

export class FormFindCompraComponent extends ControllerComponent implements AfterViewInit {

        //****************OBTEJOS OBTENIDOS DEL FORMULARIO PROVEEDOR
        proveedorSelected: any;

        tiposComprobante: any[];
        tipoComprobanteSelected: any = null;
        serieComprobanteSelected: any = null;
        numeroComprobanteSelected: any = null;
        fechaComprobanteSelected: any = null;
        estadoSelected: string="";
        mediosPago: any[];
        medioPagoSelected: any;
        fechaInicio:any;
        fechaFin:any;
        locales: any[];
        localSelected: any;
        compras: any[];
        compraSelected: any;
        listaProductos: any[];
        tiposMoneda: any[];
        tipoMonedaSelected: any;

        subTotalSelected: string = "0";
        descuentosSelected: string = "0";
        montoTotalSelected:number = 0;
        igvPagarSelected: string = "0";
        idComprobanteSelected:any;

        panelEditarSelected: boolean = false;
        panelDetalleCompraSelected: boolean = false;

        panelCuentasPorCobrar:boolean=false;
        buttonSelected:boolean=false;
        seleccionarTodos:boolean=false;
        @Output() editarCompraAction = new EventEmitter();
        @Output() seleccionMultipleAction= new EventEmitter();
        @Output() variasFacturasAction= new EventEmitter();

        @ViewChild(FormFindProveedorComponent,{static: false}) formFindProveedor: FormFindProveedorComponent;

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
                

                /*this.obtenerTipoMoneda();
                this.obtenerLocales();
                this.obtenerCompras();
                this.obtenerUnidadesMedida();
                this.obtenerTipoCompra();
                this.obtenerMediosPago();
                this.obtenerTipoCambioActual();
                this.mostrarTiposComprobanteCompra();
                */
               
        }


        ngAfterViewInit() {
                if (this.verificarTokenRpta(this.rutasMantenedores.FORM_COMPRA)) {
                        this.print("cargo find compra");
                      
                }
        }


        obtenerTipoMoneda() {

                this.tipoMonedaService.getAll()
                        .subscribe(
                                data => {//this.vistas = data;

                                        this.tiposMoneda = data;
                                },
                                error => this.msj = <any>error);
        }

        selectAll(){
                if(this.compras!=null){
                        let i;
                        for(i=0;i<this.compras.length;i++){
                        this.compras[i].selected=this.seleccionarTodos; 
                        }
                }
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


        abrirPanelEditar(bean) {
                if (this.tienePermisoPrintMsj(this.rutas.FORM_COMPRA, this.rutas.PANEL_EDITAR)) {
                        this.editarCompraAction.emit({ bean: bean });
                }
        }

        regresar() {
                this.limpiarCampos();

                this.panelEditarSelected = false;
                this.panelDetalleCompraSelected = false;
                $('.nav-tabs a[href="#buscarCompra"]').tab('show');
        }


        imprimirComprobanteA4() {

                if (this.tienePermisoPrintMsj(this.rutas.FORM_COMPROBANTE, this.rutas.BUTTON_IMPRIMIR)) {
                        this.reportePdfService.obtenerComprobantePdfA4compra(this.idComprobanteSelected)
                                .subscribe(
                                data => {
                                        if (data._body.size == 0) {
                                                this.mensajeInCorrecto("DOCUMENTO DIGITALIZADO NO ENCONTRADO - HA SIDO ELIMINADO ARCHIVO ADJUNTO");
                                        } else {
                                                //this.abrirPDF(data._body);
                                                if(this.rutas.IMPRESION_MODAL=='true'){
                                                        this.abrirDocumentoModalId(data._body,'mostrarPrincipalPDF');
                                                        this.abrirModalPDfPorc("modalPrincipalPDF", 90);
                                                }else{
                                                        this.abrirPDF(data._body);
                                                } 
                                        }


                                },
                                error => this.msj = <any>error
                                );
                }

        }

        obtenerCompras() {
                this.getTotalLista();
                this.limpiarCampos();
                //this.seleccionarByPagina(this.inicio, this.fin, this.tamPagina);

                /*this.productoService.getAll()
                        .subscribe(
                        data => {//this.vistas = data;

                                this.listaProductos = data;
                        },
                        error => this.msj = <any>error);*/
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

        obtenerMediosPagoByNombre(nombre) {
                
                this.panelCuentasPorCobrar=true;
                let parametros = JSON.stringify({
                        nombre: nombre,
                       
                });
                this.medioPagoService.buscarPaginacion(1, 100, 100, parametros)
                        .subscribe(
                        data => {
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


        getTotalListaParametros(parametros) {

                this.print("parametros total: " + parametros);
                this.compraService.getTotalParametros(parametros)
                        .subscribe(
                                data => {
                                        this.totalLista = data;
                                        this.print("total:" + data);
                                },
                                error => this.msj = <any>error);
        }
        
        seleccionarByPaginaParametros(inicio: any, fin: any, tamPagina: any,parametros) {
 
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


        getTotalLista() {

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
                        id_tipo_moneda:this.tipoMonedaSelected==null?null:this.tipoMonedaSelected.id_tipo_moneda                                                 
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
                        id_tipo_moneda:this.tipoMonedaSelected==null?null:this.tipoMonedaSelected.id_tipo_moneda                                                 
                
                });

                let user = this.obtenerUsuario();
                this.compraService.buscarPaginacion(inicio, fin, tamPagina, parametros)
                        .subscribe(
                                data => {
                                        this.compras = data;
                                        /*if(this.listaProductos.length>0){
                                                this.fin=this.listaProductos[this.listaProductos.length-1].correlativoDoc;
                                        }*/
                                        if(this.compras!=null){
                                            this.montoTotalSelected = 0;
                                        for (let i = 0; i < this.compras.length; i++) {
                                                this.montoTotalSelected = this.round2(this.montoTotalSelected + this.compras[i].monto_total);
                                        }
                                        this.print(data);     
                                        }else{
                                                this.mensajeAdvertencia("No existen compras");
                                        }

                                       
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
        //        this.formComprobante.obtenerCategoriasComprobanteCompra();
          //      this.formComprobante.idCompraVentaSelected = this.idCompraSelected != null ? this.idCompraSelected : null;
           //     this.print("idVEntaCompra:" + this.formComprobante.idCompraVentaSelected);
        }


        generarGuiaRemision() {
                $('.nav-tabs a[href="#guiaRemision"]').tab('show');
             //   this.formGuiaRemision.obtenerCategoriasComprobanteCompra();
              //  this.formGuiaRemision.idCompraVentaSelected = this.idCompraSelected != null ? this.idCompraSelected : null;
        }

    
        buscar() {

                if (this.tienePermisoPrintMsj(this.rutas.FORM_COMPRA, this.rutas.BUTTON_BUSCAR)) {
                        this.getTotalLista();
                        this.seleccionarByPagina(this.inicio, this.fin, this.tamPagina);
                }
        }

        buscarParametros(parametros) {
                        this.getTotalListaParametros(parametros);
                        this.seleccionarByPaginaParametros(this.inicio, this.fin, this.tamPagina,parametros);
        }

        limpiar() {
                this.limpiarCampos();
                this.inicio = 1;
                this.fin = 10;
                this.tamPagina = 10;
                this.getTotalLista();
             //   this.seleccionarByPagina(this.inicio, this.fin, this.tamPagina);
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




        limpiarCampos() {
                if(!this.panelCuentasPorCobrar){
                        this.medioPagoSelected=null;
                }
                
                this.localSelected=null;
                this.tipoMonedaSelected=null;
                this.fechaInicio= null;
                this.fechaFin= null;
                this.localSelected!= null;
                
                this.proveedorSelected = null;
                this.listaProductos = new Array();

                this.tipoComprobanteSelected = null;
                this.serieComprobanteSelected = null;
                this.numeroComprobanteSelected = null;
                this.fechaComprobanteSelected = null;

                this.estadoSelected = "";
                this.compras = null;
        }

        elegirFila(lista, i) {
                this.marcar(lista, i);
        }


        




        //**********ACCIONES PARAR FORMULARIO Cliente********
        abrirModalProveedor() {
                this.abrirModal("modalProveedor2");
                this.formFindProveedor.obtenerProveedores();
        }



        obtenerProveedorDatosExternos(datos) {
                this.proveedorSelected = datos.bean;
                this.print("datos Proveedor");
                this.print(datos);
                this.cerrarModal("modalProveedor2");


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


        buscarCompra(obj) {
                if (this.tienePermisoPrintMsj(this.rutas.FORM_COMPRA, this.rutas.BUTTON_VER_DETALLE)) {
                        this.panelDetalleCompraSelected = true;
                        this.idComprobanteSelected = obj.id_compra;
                        this.compraService.getCompraById(obj.id_compra)
                                .subscribe(
                                        data => {
                                                //this.listaProductosDetalle = data.detalle_compra;
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

                                                //this.tipoMonedaSelected = this.obtenerTipoMonedaActualId(this.compraSelected.id_tipo_moneda);
                                                //this.localSelected = this.obtenerLocalActual(this.compraSelected.nombre_local);
                                                //this.obtenerAlmaceneByIdLocalEditar(this.localSelected.id_local);
                                                //this.fechaSelected = this.compraSelected.fecha_compra.substr(0, 10);
                                                //this.print("fecha: " + this.fechaSelected);
                                                //this.igvSelected = this.compraSelected.igv_lista_precio;
                                                //this.tipoCambioSelected = this.compraSelected.tipo_cambio;
                                                this.listaProductos = data.detalle_compra;
                                                

                                                //this.incluyeIgvSelected = this.compraSelected.inc_igv == '0' ? false : true;
                                                //this.activarPrecioIgv();
                                                this.calcularSubTotal();
                                                this.print(data);

                                        },
                                        error => this.msj = <any>error);
                }
        }


        calcularSubTotal(){
                for (let i = 0; i < this.listaProductos.length; i++) {
                        this.listaProductos[i].sub_total=this.round2(this.listaProductos[i].precio*this.listaProductos[i].cantidad);
                }
        }
       

        regresarListaCompras() {
                this.panelDetalleCompraSelected = false;
        }




        //***********MANEJO DEL AUTOCOMPLETADO************

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




        seleccionarMultiple(){
                let comprasSeleccionadas= new Array();
                if(this.compras!=null){
                        var tam=this.compras.length;
                        if(tam>0)
                        {
                                for(let i=0;i<tam;i++){
                                        if(this.compras[i].selected){
                                                comprasSeleccionadas.push(this.compras[i]);
                                        }   
                                }
                        }
                }

                this.seleccionMultipleAction.emit({ bean: comprasSeleccionadas });
        }

        cajearVariasFacturas(){
                let comprasSeleccionadas= new Array();
                if(this.compras!=null){
                        var tam=this.compras.length;
                        if(tam>0)
                        {
                                for(let i=0;i<tam;i++){
                                        if(this.compras[i].selected){
                                                comprasSeleccionadas.push(this.compras[i]);
                                        }   
                                }
                        }
                }

                this.variasFacturasAction.emit({ bean: comprasSeleccionadas });
        }


                /*****************EXPORTACION DE EXCEL Y PDF DETALLE**************/
                exportarExcelDetalle() {
                        this.completado=true;
                        let ventasAux=this.compras.slice();
                        this.eliminarColumna(ventasAux,
                                ["is_editable","nombre_tipo_persona_cliente","nombres_empleado","apellido_paterno_empleado",
                                "apellido_materno_empleado","nombre_empleado_eliminado","correo_cliente","telefono_cliente",
                                "direccion_cliente","numero_documento_cliente","nombre_tipo_documento_cliente",
                                "apellido_materno_cliente","apellido_paterno_cliente","porc_igv","nombre_tipo_moneda",
                                "estado","id_comprobante","nro_comprobante","id_cliente","id_empleado","id_tipo_moneda",
                                "lista_productos","id_almacen","nro_documento","",
                                "nombres_representante","apellido_paterno_representante","apellido_materno_representante",
                                "nombre_tipo_documento_representante","nombre_tipo_persona_representante",
                                "numero_documento_representante","direccion_representante","telefono_representante",
                                "nombres_cliente",
                                "lista_producto_eliminados","lista_producto_insertados"
                                ]);
        
                        let parametros = JSON.stringify({
                                datos: ventasAux,
                                titulo: 'COMPRAS',
                                subtitulo: 'COMPRAS EN BASE DE DATOS'
                        });
        
                        this.exportarExcelFinal(parametros, "reporte Compras - generado el ");
        
                }
        
        
                exportarPdfDetalle() {
                        this.completado=true;
                        //this.eliminarColumna(this.listaClientes, ["estado_cliente", "fecha_baja", "observacion", "id_tipo_persona", "id_tipo_documento", "estado"]);
                        let ventasAux=this.compras.slice();
        

                        this.eliminarColumna(ventasAux,
                                ["is_editable","nombre_tipo_persona_cliente","nombres_empleado","apellido_paterno_empleado",
                                "apellido_materno_empleado","nombre_empleado_eliminado","correo_cliente","telefono_cliente",
                                "direccion_cliente","numero_documento_cliente","nombre_tipo_documento_cliente",
                                "apellido_materno_cliente","apellido_paterno_cliente","porc_igv","nombre_tipo_moneda",
                                "estado","id_comprobante","nro_comprobante","id_cliente","id_empleado","id_tipo_moneda",
                                "lista_productos","id_almacen","nro_documento","",
                                "nombres_representante","apellido_paterno_representante","apellido_materno_representante",
                                "nombre_tipo_documento_representante","nombre_tipo_persona_representante",
                                "numero_documento_representante","direccion_representante","telefono_representante",
                                "nombres_cliente",
                                "lista_producto_eliminados","lista_producto_insertados"
                                ]);
                        let parametros = JSON.stringify({
                                datos: ventasAux,
                                titulo: 'COMPRAS',
                                subtitulo: 'COMPRAS EN BASE DE DATOS'
                        });
        
                        this.exportarPdfFinalIdModal(parametros,"modalPDFCompra","mostrarCompraPDF");
        
        
        
                }



}