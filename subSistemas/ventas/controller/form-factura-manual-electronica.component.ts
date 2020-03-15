import { Component, AfterViewInit, ViewChild, OnInit, Input } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';

import { ControllerComponent } from '../../../core/controller/controller.component';




/******************IMPORTAR SERVICIOS*************** */


import { FacturaManualElectronicaService } from '../service/factura-manual-electronica.service';
import { VentaService } from '../service/venta.service';
import { CompraService } from '../../compras/service/compra.service';
import { ReportePdfService } from '../../../core/service/reporte-pdf.Service';
import { CategoriaComprobanteService } from '../../mantenedores/service/categoria-comprobante.service';
import { TipoComprobanteService } from '../../mantenedores/service/tipo-comprobante.service';
import { SerieComprobanteService } from '../../mantenedores/service/serie-comprobante.service';
import { MedioPagoService } from '../../mantenedores/service/medio-pago.service';
import { FormFindClienteComponent } from '../../mantenedores/controller/cliente/form-find-cliente.component';


declare var $: any;
@Component({
        selector: 'form-factura-manual-electronica',
        templateUrl: '../view/form-factura-manual-electronica.component.html',
        providers: [FacturaManualElectronicaService, ReportePdfService, VentaService, CompraService, CategoriaComprobanteService, TipoComprobanteService, SerieComprobanteService, MedioPagoService]

})

export class FormFacturaManualElectronicaComponent extends ControllerComponent implements AfterViewInit {
        
        seleccionarTodos:boolean=false;
        listaComprobantesSeleccionados: any[];


        buscarPorGuia:boolean=false;
        tabsBuscadorGuiaRemisionActivated:boolean=false;
        
        series_numeros_guias:string="";
        fechaSelected:any;
        idCompraVentaBusqueda:number;
        categoriasComprobante: any[];
        tiposComprobante: any[];
        seriesComprobante: any[];
        mediosPago: any[];

        categoriaComprobanteSelected: any = null;
        tipoComprobanteSelected: any = null;
        serieComprobanteSelected: any = null;
        medioPagoSelected: any = null;

        numeroSelected: any=null;
        serieSelected: any=null;
        nroGuiaSelected: number = null;
        nroOrdenSelected: number = null;
        nroOrdenEmpresaSelected: number = null;
        idComprobanteSelected: any;

        listaProductos: any[] = null;

        listaComprobantes: any[];

        tieneComprobante: boolean = false;

        numeroCorrelativoSiguiente:number;

        //************OBJETO ELEGIDO PARA EDITAR************
        //beanSelected: any;


        //***********PANELES DE LOS MANTENEDORES***********
        panelEditarSelected: boolean = false;
        panelListaBeanSelected: boolean = true;
        //busquedaMarcadaChecked: boolean = false;




        //****************OBTEJOS OBTENIDOS DEL FORMULARIO PRODUCTO
        //beanSelectedExterno: any;
        //idProductoSelected: number;

        //buttonSelectedActivatedPro: boolean = true;
        //buttonEliminarActivatedPro: boolean = false;
        //buttonEditarActivatedPro: boolean = false;


        //****************OBTEJOS OBTENIDOS DEL FORMULARIO CLIENTE
        ventaSelected: any;
        compraSelected: any;

        //buttonSelectedActivatedCli: boolean = true;
        //buttonEliminarActivatedCli: boolean = false;
        //buttonEditarActivatedCli: boolean = false;



        //****************OBTEJOS OBTENIDOS DEL FORMULARIO PROVEEDOR
        //activatedSelectedProve: boolean = true;




        panelRegistroSelected: boolean = false;

        comprobanteCompraActivated: boolean = false;
        @Input() tabsActivated: boolean = true;

        idCompraVentaSelected: number;
        idCompraVentaTextoSelected: string="";
        idGuiasTextoSelected: string="";

        IdsCompraVenta:any[];
        IdsGuias:any[];


        /****MODAL CLIENTE*******/
        buttonSelectedActivatedCli: boolean = true;
        buttonEliminarActivatedCli: boolean = false;
        buttonEditarActivatedCli: boolean = false;


        /**********PROPIEDADES DE COMPROBANTE************/
        beanSelected: any;
        id_comprobante: any;
        tipo_comprobante: any;
        serie: any;
        numero: any;
        fecha: any;
        monto_total: any;
        nro_orden: any;
        nro_guia_remision: any;
        fecha_emision: any;
        sub_total: any;
        igv: any;
        porc_igv: any;
        ruc_emisor: any;
        ruc_receptor: any;
        clienteSelected: any;
        telefono: any;
        direccion: any;
        tipo_moneda: any;
        medio_pago: any;
        id_empleado: any;
        lista_locales:any[];


        @ViewChild(FormFindClienteComponent,{static: true}) formFindCliente: FormFindClienteComponent;
        constructor(
                public http: Http,
                public router: Router,
                public facturaManualElectronicaService: FacturaManualElectronicaService,
                public reportePdfService: ReportePdfService,
                public ventaService: VentaService,
                public compraService: CompraService,
                public categoriaComprobanteService: CategoriaComprobanteService,
                public tipoComprobanteService: TipoComprobanteService,
                public serieComprobanteService: SerieComprobanteService,
                public medioPagoService: MedioPagoService
        ) {
                super(router);

                this.panelEditarSelected = false;
        }




        ngOnInit() {
                this.IdsCompraVenta=new Array();
                this.IdsGuias=new Array();
                this.listaComprobantesSeleccionados= new Array();
                this.lista_locales =  new Array();
                let array_almacen = JSON.parse(localStorage.getItem("almacen_start"));
                this.lista_locales.push(array_almacen);
                //this.limpiarCampos();
                //this.listaProductos = new Array();
        }

        ngAfterViewInit() {
                if (this.verificarTokenRpta(this.rutasMantenedores.FORM_COMPROBANTE)) {
                        //this.getTotalLista();
                        //this.obtenerCatalogoVenta();
                        //this.seleccionarByPagina(this.inicio,this.fin,this.tamPagina);   
                        this.obtenerCategoriasComprobante();
                        this.obtenerMediosPago();
                        this.obtenerComprobantes();
                        this.formFindCliente.buttonSelectedActivated=true;    
                }
        }


        selectAll(){
                if(this.listaComprobantes!=null){
                        let i;
                        for(i=0;i<this.listaComprobantes.length;i++){
                        this.listaComprobantes[i].selected=this.seleccionarTodos; 
                        }
                }
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
                this.print(pro);
                //this.beanSelected = pro;
                /*this.tipoProSelected = this.obtenerTipoActual(pro.nombre_tipo_producto);
                this.uniMediSelected = this.obtenerUnidadMedidaActual(pro.nombre_unidad_medida);
                this.apliSelected = this.obtenerAplicacionActual(pro.nombre_aplicacion);
                
                this.nombreSelected = pro.nombre;
                this.medidaA = pro.medida_a;
                this.medidaB = pro.medida_b;
                this.medidaC = pro.medida_c;
                this.medidaD = pro.medida_d;
                this.descripcion = pro.descripcion;
                */
                //this.beanSelectedExterno = pro;

                this.beanSelected = pro;

                this.id_comprobante = pro.id_comprobante;
                this.tipo_comprobante = pro.tipo_comprobante;
                this.serie = pro.serie;
                this.numero = pro.numero;
                this.fecha = pro.fecha == null ? null : pro.fecha.substr(0, 10);
                this.monto_total = pro.monto_total;
                this.nro_orden = pro.nro_orden;
                this.nro_guia_remision = pro.nro_guia_remision;
                this.fecha_emision = pro.fecha_emision == null ? null : pro.fecha_emision.substr(0, 10);
                this.sub_total = pro.sub_total;
                this.igv = pro.igv;
                this.porc_igv = pro.porc_igv;
                this.ruc_emisor = pro.ruc_emisor;
                this.ruc_receptor = pro.ruc_receptor;

                this.clienteSelected = {
                        direccion: pro.direccion,
                        nombres: pro.cliente,
                        telefono: pro.telefono,
                        numero_documento: pro.ruc_receptor
                }
                //this.cliente= pro.cliente;
                this.telefono = pro.telefono;
                this.direccion = pro.direccion;
                this.tipo_moneda = pro.tipo_moneda;
                this.medio_pago = pro.medio_pago;
                this.id_empleado = pro.id_empleado;


                this.panelEditarSelected = true;
                this.panelListaBeanSelected = false;
        }


        regresar() {
                this.limpiarCampos();

                this.panelEditarSelected = false;
                this.panelListaBeanSelected = true;
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


        obtenerMediosPago() {

                this.medioPagoService.getAll()
                        .subscribe(
                        data => {//this.vistas = data;

                                this.mediosPago = data;
                        },
                        error => this.msj = <any>error);
        }



        obtenerComprobantes() {
                this.getTotalLista();
                this.limpiarCampos();
                this.seleccionarByPagina(this.inicio, this.fin, this.tamPagina);
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

                this.tipoComprobanteService.getByIdCategoria(id)
                        .subscribe(
                        data => {//this.vistas = data;

                                this.tiposComprobante = data;
                                this.print("tipos comprobante: ");
                                this.print(this.tiposComprobante );
                                let i;
                                for(i=0;i<this.tiposComprobante.length;i++){
                                        if(this.tiposComprobante[i].nombre=='GUIA REMISION'){
                                                this.tiposComprobante.splice(i,1);
                                        }
                                }
                        

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

        mostrarCorrelativoSerie(){
                this.tipoComprobanteService.getCorrelativoByIdSerie(this.serieComprobanteSelected.id_serie_comprobante)
                .subscribe(
                data => {//this.vistas = data;

                        this.numeroCorrelativoSiguiente=data;
                },
                error => this.msj = <any>error);
        }

        obtenerCatalogoVenta() {
                this.getTotalLista();
                this.limpiarCampos();
                this.seleccionarByPagina(this.inicio, this.fin, this.tamPagina);
        }


        seleccionarByPagina(inicio: any, fin: any, tamPagina: any) {
                let parametros = JSON.stringify({
                        id_categoria_comprobante: this.categoriaComprobanteSelected==null?null:this.categoriaComprobanteSelected.id_categoria_comprobante,
                        serie:  this.serieSelected ,
                        numero: this.numeroSelected,
                        id_tipo_comprobante: this.tipoComprobanteSelected==null?null:this.tipoComprobanteSelected.id_tipo_comprobante,
                        id_medio_pago: this.medioPagoSelected==null?null:this.medioPagoSelected.id_medio_pago,
                        fecha: this.fechaSelected,
                        id_compra_venta:this.idCompraVentaBusqueda,
                        id_cliente:this.clienteSelected==null?null:this.clienteSelected.id_cliente
                });

                let user = this.obtenerUsuario();
                this.facturaManualElectronicaService.buscarPaginacion(inicio, fin, tamPagina, parametros)
                        .subscribe(
                        data => {
                                this.listaComprobantes = data;
                                this.print(data);
                        },
                        error => this.msj = <any>error);
        }



        teclaEnter(event: any) {
                //this.print("tecla: "+event);
                //this.print("code: "+event.keyCode);
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

        imprimirComprobante() {

                if (this.tienePermisoPrintMsj(this.rutas.FORM_COMPROBANTE, this.rutas.BUTTON_IMPRIMIR)) {
                        let id = this.lista_locales[0].id_local;
                 
                        this.reportePdfService.obtenerComprobantePdf(this.idComprobanteSelected,id)
                                .subscribe(
                                data => {
                                        if (data._body.size == 0) {
                                                this.mensajeInCorrecto("DOCUMENTO DIGITALIZADO NO ENCONTRADO - HA SIDO ELIMINADO ARCHIVO ADJUNTO");
                                        } else {

                                                this.abrirDocumentoModal(data._body);
                                                this.abrirModalPDfPorc("modalPDF", 90);
                                        }


                                },
                                error => this.msj = <any>error
                                );
                }

        }



        imprimir(id_comprobante) {
                
                if (this.tienePermisoPrintMsj(this.rutas.FORM_COMPROBANTE, this.rutas.BUTTON_IMPRIMIR)) {
                        let id = this.lista_locales[0].id_local;
                 
                        this.reportePdfService.obtenerComprobantePdf(id_comprobante,id)
                                .subscribe(
                                data => {
                                        if (data._body.size == 0) {
                                                this.mensajeInCorrecto("DOCUMENTO DIGITALIZADO NO ENCONTRADO - HA SIDO ELIMINADO ARCHIVO ADJUNTO");
                                        } else {
                                                this.abrirDocumentoModal(data._body);
                                                this.abrirModalPDfPorc("modalPDF", 90);
                                        }


                                },
                                error => this.msj = <any>error
                                );
                }

        }

        imprimirA4(id_comprobante) {
                
                if (this.tienePermisoPrintMsj(this.rutas.FORM_COMPROBANTE, this.rutas.BUTTON_IMPRIMIR)) {
                        this.reportePdfService.obtenerComprobantePdfA4(id_comprobante)
                                .subscribe(
                                data => {
                                        if (data._body.size == 0) {
                                                this.mensajeInCorrecto("DOCUMENTO DIGITALIZADO NO ENCONTRADO - HA SIDO ELIMINADO ARCHIVO ADJUNTO");
                                        } else {
                                                //this.abrirPDF(data._body);
                                                this.abrirDocumentoModal(data._body);
                                                this.abrirModalPDfPorc("modalPDF", 90);
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

                                                this.abrirDocumentoModal(data._body);
                                                this.abrirModalPDfPorc("modalPDF", 90);
                                        }


                                },
                                error => this.msj = <any>error
                                );
                }

        }


        buscarCompraVenta() {
                if (this.categoriaComprobanteSelected != null) {
                        this.print("nombre: " + this.categoriaComprobanteSelected.nombre)
                        if (this.categoriaComprobanteSelected.nombre.toUpperCase() == "COMPRA") {
                                this.buscarCompra();

                        }
                        if (this.categoriaComprobanteSelected.nombre.toUpperCase() == "VENTA") {
                                this.buscarVenta();
                        }
                }
        }

        buscarComprasVentas() {

                this.IdsCompraVenta= this.idCompraVentaTextoSelected.split(",");
                this.print("ids:");
                this.print(this.IdsCompraVenta);





                if (this.categoriaComprobanteSelected != null) {
                        this.print("nombre: " + this.categoriaComprobanteSelected.nombre)
                        if (this.categoriaComprobanteSelected.nombre.toUpperCase() == "COMPRA") {
                                this.buscarCompras();

                        }
                        if (this.categoriaComprobanteSelected.nombre.toUpperCase() == "VENTA") {
                                this.buscarVentas();
                        }
                }
        }


        buscarCompra() {

                this.compraService.getCompraById(this.idCompraVentaSelected)
                        .subscribe(
                        data => {
                                this.listaProductos = data.detalle_compra;
                                this.compraSelected = data.compra;
                                this.ventaSelected = null;
                                if (this.compraSelected != null) {
                                        if (this.compraSelected.estado == 1) {
                                                if (this.compraSelected.id_comprobante != null) {
                                                        this.tieneComprobante = true;
                                                        this.idComprobanteSelected = this.compraSelected.id_comprobante;
                                                        this.mensajeCorrectoSinCerrar("COMPRA YA TIENE COMPROBANTE GENERADO ", "ID COMPROBANTE GENERADO: " + this.idComprobanteSelected);
                                                } else {
                                                        this.tieneComprobante = false;
                                                        this.mensajeCorrecto("COMPRA ENCONTRADA - PUEDE GENERAR COMPROBANTE");
                                                }
                                        }else{
                                                this.mensajeInCorrecto("COMPRA ESTA ELIMINADA");
                                                this.limpiarCampos();
                                        }
                                } else {
                                        this.mensajeInCorrecto("COMPRA NO EXISTE");
                                }

                                this.print(data);
                        },
                        error => this.msj = <any>error);
        }

        buscarCompras() {

                let parametros = JSON.stringify({
                        ids_compra_venta: this.IdsCompraVenta                        
                });

                this.compraService.getCompraByIds(parametros)
                .subscribe(
                        data => {
                                this.listaProductos = data.detalle_compra;
                                this.compraSelected = data.compra;
                                this.ventaSelected = null;
                                let guias_remision=data.guiaRemision;
                                
                                this.series_numeros_guias="";
                                this.idGuiasTextoSelected="";
                                let i;
                                for(i=0;i<guias_remision.length;i++){
                                        if(i==0){
                                                this.series_numeros_guias+=guias_remision[i].serie+"-"+guias_remision[i].numero;
                                                this.idGuiasTextoSelected+=guias_remision[i].id_guia_remision;
                                        }else{
                                                this.series_numeros_guias+=","+guias_remision[i].serie+"-"+guias_remision[i].numero;
                                                this.idGuiasTextoSelected+=","+guias_remision[i].id_guia_remision;
                                        }

                                }

                                if (this.compraSelected != null) {
                                        if (this.compraSelected.id_comprobante != null) {
                                                this.tieneComprobante = true;
                                                this.idComprobanteSelected = this.compraSelected.id_comprobante;
                                                this.mensajeCorrectoSinCerrar("COMPRA YA TIENE COMPROBANTE GENERADO ", "ID COMPROBANTE GENERADO: " + this.idComprobanteSelected);
                                        } else {
                                                this.tieneComprobante = false;
                                                this.mensajeCorrecto("COMPRA ENCONTRADA - PUEDE GENERAR COMPROBANTE");
                                        }
                                } else {
                                        this.mensajeInCorrecto("COMPRA NO EXISTE");
                                }

                                this.print(data);

                                this.print("numeros_guias");
                                this.print(this.series_numeros_guias);
                
                                this.IdsGuias= this.idGuiasTextoSelected.split(",");
                                this.print("ids guias:");
                                this.print(this.IdsGuias);
                        },
                        error => this.msj = <any>error);
        }



        buscarVenta() {



                this.ventaService.getVentaById(this.idCompraVentaSelected)
                        .subscribe(
                        data => {
                                this.listaProductos = data.detalle_venta;
                                this.ventaSelected = data.venta;
                                this.compraSelected = null;
                                if (this.ventaSelected != null) {
                                        if (this.ventaSelected.estado ==1) {
                                                if (this.ventaSelected.id_comprobante != null) {
                                                        this.tieneComprobante = true;
                                                        this.idComprobanteSelected = this.ventaSelected.id_comprobante;
                                                        this.mensajeCorrectoSinCerrar("VENTA YA TIENE COMPROBANTE GENERADO ", "ID COMPROBANTE GENERADO: " + this.idComprobanteSelected);
                                                } else {
                                                        this.tieneComprobante = false;
                                                        this.mensajeCorrecto("VENTA ENCONTRADA - PUEDE GENERAR COMPROBANTE");
                                                }
                                        }else{
                                                this.mensajeInCorrecto("VENTA HA SIDO ELIMINADA");
                                                this.limpiarCampos();
                                        }
                                } else {
                                        this.mensajeInCorrecto("VENTA NO EXISTE");
                                }

                                this.print(data);
                        },
                        error => this.msj = <any>error);
        }

        buscarVentas() {
              
                let parametros = JSON.stringify({
                        ids_compra_venta: this.IdsCompraVenta                        
                });
                
                this.ventaService.getVentaByIds(parametros)
                        .subscribe(
                        data => {
                                this.listaProductos = data.detalle_venta;
                                this.ventaSelected = data.venta;
                                this.compraSelected = null;
                                let guias_remision=data.guiaRemision;
                                
                                this.series_numeros_guias="";
                                this.idGuiasTextoSelected="";
                                let i;
                                for(i=0;i<guias_remision.length;i++){
                                        if(i==0){
                                                this.series_numeros_guias+=guias_remision[i].serie+"-"+guias_remision[i].numero;
                                                this.idGuiasTextoSelected+=guias_remision[i].id_guia_remision;
                                        }else{
                                                this.series_numeros_guias+=","+guias_remision[i].serie+"-"+guias_remision[i].numero;
                                                this.idGuiasTextoSelected+=","+guias_remision[i].id_guia_remision;
                                        }

                                }

                                if (this.ventaSelected != null) {
                                        if (this.ventaSelected.id_comprobante != null) {
                                                this.tieneComprobante = true;
                                                this.idComprobanteSelected = this.ventaSelected.id_comprobante;
                                                this.mensajeCorrectoSinCerrar("VENTA YA TIENE COMPROBANTE GENERADO ", "ID COMPROBANTE GENERADO: " + this.idComprobanteSelected);
                                        } else {
                                                this.tieneComprobante = false;
                                                this.mensajeCorrecto("VENTA ENCONTRADA - PUEDE GENERAR COMPROBANTE");
                                        }
                                } else {
                                        this.mensajeInCorrecto("VENTA NO EXISTE");
                                }

                                this.print(data);

                                this.print("numeros_guias");
                                this.print(this.series_numeros_guias);
                
                                this.IdsGuias= this.idGuiasTextoSelected.split(",");
                                this.print("ids guias:");
                                this.print(this.IdsGuias);
                        },
                        error => this.msj = <any>error);
        }




        buscarComprobante(id) {

                this.facturaManualElectronicaService.getComprobanteById(id)
                        .subscribe(
                        data => {
                                /*this.listaProductos=data.detalle_venta;
                                this.ventaSelected=data.venta;
                                if(this.ventaSelected!=null){
                                        if(this.ventaSelected.id_comprobante!=null){
                                                        this.mensajeCorrectoSinCerrar("VENTA YA TIENE COMPROBANTE GENERADO");
                                        }
                                }else{
                                        this.mensajeInCorrecto("VENTA NO EXISTE");
                                }*/

                                //this.print(data);
                        },
                        error => this.msj = <any>error);
        }



        generarComprobante() {
                $('.nav-tabs a[href="#comprobanteVenta"]').tab('show')
        }


        generar_archivo_txt() {

                if (this.tienePermisoPrintMsj(this.rutas.FORM_FACTURACION_ELECTRONICA, this.rutas.BUTTON_REGISTRAR)) {

                        if(this.listaComprobantes!=null){
                                var tam=this.listaComprobantes.length;
                                if(tam>0)
                                {
                                        for(let i=0;i<tam;i++){
                                                if(this.listaComprobantes[i].selected){
                                                        this.listaComprobantesSeleccionados.push(this.listaComprobantes[i]);
                                                }   
                                        }
                                }
                        }


                        let parametros = JSON.stringify({
                                lista_comprobantes:this.listaComprobantesSeleccionados        
                        });
                        //this.print("parametros:");
                        //this.print(parametros);

                        this.facturaManualElectronicaService.generar_archivo_txt(parametros)
                                .subscribe(
                                data => {

                                        let rpta = data.rpta;
                                        this.print("rpta: " + rpta);
                                        if (rpta != null) {
                                                if (rpta == 1) {
                                                        this.mensajeCorrectoSinCerrar("ARCHIVOS GENERADOS CORRECTAMENTE");
                                                } else {
                                                        this.mensajeInCorrecto("ERROR AL GENERAR LOS ARCHIVOS");
                                                }
                                        }

                                        this.limpiarCamposMultiple();
                                },
                                error => this.msj = <any>error
                                );
                }
        }



        registrar() {

                if (this.tienePermisoPrintMsj(this.rutas.FORM_COMPROBANTE, this.rutas.BUTTON_REGISTRAR)) {

                        let usuario = this.obtenerUsuario()
                        let miRuc = usuario.ruc_empresa;
                        this.print(usuario);
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
                                //this.print("compra: ");
                                //this.print(this.compraSelected);
                               emisor = this.compraSelected.nombres_proveedor;    
                        }

                        let user = this.obtenerUsuario();

                        let parametros = JSON.stringify({
                                nombre_categoria_comprobante: this.categoriaComprobanteSelected.nombre.toUpperCase(),
                                serie: this.serieComprobanteSelected == null ? this.serieSelected : this.serieComprobanteSelected.numero,
                                numero: this.numeroSelected,
                                monto_total: this.ventaSelected == null ? this.compraSelected.monto_total : this.ventaSelected.monto_total,
                                sub_total: this.ventaSelected == null ? this.compraSelected.sub_total : this.ventaSelected.sub_total,
                                igv: this.ventaSelected == null ? this.compraSelected.igv : this.ventaSelected.igv,
                                id_tipo_comprobante: this.tipoComprobanteSelected.id_tipo_comprobante,
                                id_serie_comprobante: this.serieComprobanteSelected == null ? null : this.serieComprobanteSelected.id_serie_comprobante,
                                id_medio_pago: this.medioPagoSelected.id_medio_pago,
                                nombre_medio_pago: this.medioPagoSelected.nombre,
                                id_empleado: user.id_empleado,
                                nro_orden: this.nroOrdenSelected,
                                nro_orden_empresa: this.nroOrdenEmpresaSelected,
                                nro_guia_remision: this.nroGuiaSelected,
                                lista_productos: this.listaProductos,
                                id_compra_venta: this.ventaSelected == null ? this.compraSelected.id_compra_venta : this.ventaSelected.id_compra_venta,
                                id_tipo_moneda: this.ventaSelected == null ? this.compraSelected.id_tipo_moneda : this.ventaSelected.id_tipo_moneda,
                                ruc_emisor: this.ventaSelected == null ? this.compraSelected.ruc_proveedor : miRuc,
                                ruc_receptor: this.ventaSelected == null ? miRuc : this.ventaSelected.numero_documento_cliente,
                                cliente: cliente,
                                telefono: this.ventaSelected == null ? this.compraSelected.telefono_proveedor : this.ventaSelected.telefono_cliente,
                                //direccion: this.ventaSelected == null ? this.compraSelected.direccion_proveedor : this.ventaSelected.direccion_cliente,
                                direccion: this.ventaSelected == null ? usuario.direccion_empresa : this.ventaSelected.direccion_cliente,
                                fecha: this.compraSelected != null ? this.fechaSelected : null,
                                emisor:emisor,
                                id_guia_remision: this.ventaSelected == null ? this.compraSelected.id_guia_remision : this.ventaSelected.id_guia_remision,
                                nro_guia_generada: this.ventaSelected == null ? this.compraSelected.nro_guia_generada : this.ventaSelected.nro_guia_generada,
                                ids_compras_ventas:this.IdsCompraVenta.length==0?null:this.IdsCompraVenta,
                                ids_guias: this.IdsGuias.length==0?null:this.IdsGuias,
                                series_numeros_guias:this.series_numeros_guias

                        });

                        //this.print("parametros:");
                        //this.print(parametros);


                        this.facturaManualElectronicaService.registrar(parametros)
                                .subscribe(
                                data => {

                                        let rpta = data.rpta;
                                        this.print("rpta: " + rpta);
                                        if (rpta != null) {
                                                if (rpta == 1) {
                                                        this.mensajeCorrectoSinCerrar("ID COMPROBANTE: " + data.id_comprobante + " REGISTRADO CORRECTAMENTE", " NUMERO COMPROBANTE: " + data.numero);
                                                        //this.limpiarCampos();
                                                        this.idComprobanteSelected = data.id_comprobante;
                                                        this.tieneComprobante = true;
                                                        //this.buscarComprobante(data.id_comprobante);
                                                } else {
                                                        this.mensajeInCorrecto("COMPROBANTE NO REGISTRADO");
                                                }
                                        }

                                        //this.obtenerCatalogoVenta();

                                        this.limpiarCamposMultiple();
                                },
                                error => this.msj = <any>error
                                );
                }
        }

        buscar() {
                if (this.tienePermisoPrintMsj(this.rutas.FORM_COMPROBANTE, this.rutas.BUTTON_BUSCAR)) {
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


        limpiarBuscar() {
                this.limpiarCamposBuscar();
                this.inicio = 1;
                this.fin = 10;
                this.tamPagina = 10;
                this.getTotalLista();
                this.seleccionarByPagina(this.inicio, this.fin, this.tamPagina);
        }


        eliminar(bean) {


                if (this.tienePermisoPrintMsj(this.rutas.FORM_COMPROBANTE, this.rutas.BUTTON_ELIMINAR)) {

                        if( confirm("Realmente Desea Eliminar ?")){
                        let parametros = JSON.stringify({
                                comprobante:bean
                        });

                        this.facturaManualElectronicaService.eliminarLogicoComprobante(parametros)
                                .subscribe(
                                data => {
                                        this.obtenerCatalogoVenta();
                                        let rpta = data;
                                        if (rpta != null) {
                                                if (rpta == 1) {
                                                        this.mensajeCorrecto("COMPROBANTE ELIMINADO CORRECTAMENTE");
                                                } else {
                                                        this.mensajeInCorrecto("COMPROBANT NO ELIMINADO");
                                                }

                                        }
                                },
                                error => this.msj = <any>error);
                        }
                      /*this.comprobanteService.eliminarLogico(bean.id_comprobante)
                                .subscribe(
                                data => {
                                        this.obtenerCatalogoVenta();
                                        let rpta = data;
                                        if (rpta != null) {
                                                if (rpta == 1) {
                                                        this.mensajeCorrecto("COMPROBANTE ELIMINADO CORRECTAMENTE");
                                                } else {
                                                        this.mensajeInCorrecto("COMPROBANT NO ELIMINADO");
                                                }

                                        }
                                },
                                error => this.msj = <any>error);*/
                }
        }


        //**********ACCIONES PARAR FORMULARIO Cliente********
        abrirModalCliente() {
                this.abrirModal("modalClienteCom");
        }



        editar() {


                let parametros = JSON.stringify({

                });
                this.facturaManualElectronicaService.editar(parametros, 1)
                        .subscribe(
                        data => {
                                this.obtenerCatalogoVenta();
                                let rpta = data.rpta;
                                this.print("rpta: " + rpta);
                                if (rpta != null) {
                                        if (rpta) {
                                                this.mensajeCorrecto("PRODUCTO MODIFICADO DEL CATALOGO VENTAS");
                                        } else {
                                                this.mensajeInCorrecto(" PRODUCTO NO MOFICADO DEL CATALOGO VENTAS");
                                        }
                                }

                        },
                        error => this.msj = <any>error
                        );

        }






        limpiarCampos() {
                this.listaComprobantesSeleccionados= new Array();
                this.ventaSelected = null;
                this.compraSelected = null;
                this.listaProductos = null;
                this.numeroCorrelativoSiguiente=null;
                //this.categoriaComprobanteSelected=null;
                this.tipoComprobanteSelected = null;
                this.serieComprobanteSelected = null;
                this.medioPagoSelected = null;
                this.nroGuiaSelected = null;
                this.nroOrdenSelected = null;
                this.serieSelected = null;
                this.numeroSelected = null;
                
                this.IdsCompraVenta=new Array();
                this.IdsGuias=new Array();
                //this.idCompraVentaTextoSelected="";
                //this.idCompraVentaSelected=null;

        }
        limpiarCamposMultiple() {
                this.IdsCompraVenta=null;
                this.IdsGuias=null;
                this.series_numeros_guias=null;
                this.series_numeros_guias="";
                this.idGuiasTextoSelected="";
        
        }
      


        limpiarCamposBuscar() {
                this.listaComprobantesSeleccionados= new Array();
                this.clienteSelected=null;
                this.idCompraVentaBusqueda=null;
                this.ventaSelected = null;
                this.compraSelected = null;
                this.listaProductos = null;
                this.categoriaComprobanteSelected=null;
                this.tipoComprobanteSelected = null;
                this.serieComprobanteSelected = null;
                this.medioPagoSelected = null;
                this.nroGuiaSelected = null;
                this.nroOrdenSelected = null;
                this.serieSelected = null;
                this.numeroSelected = null;
                //this.idCompraVentaSelected=null;
                this.idCompraVentaTextoSelected="";
                this.idCompraVentaSelected=null;


        }
        

        elegirFila(lista, i) {
                this.marcar(lista, i);
        }



        getTotalLista() {
                let parametros = JSON.stringify({
                        id_categoria_comprobante: this.categoriaComprobanteSelected==null?null:this.categoriaComprobanteSelected.id_categoria_comprobante,
                        serie:  this.serieSelected ,
                        numero: this.numeroSelected,
                        id_tipo_comprobante: this.tipoComprobanteSelected==null?null:this.tipoComprobanteSelected.id_tipo_comprobante,
                        id_medio_pago: this.medioPagoSelected==null?null:this.medioPagoSelected.id_medio_pago,
                        fecha: this.fechaSelected,
                        id_compra_venta:this.idCompraVentaBusqueda,
                        id_cliente:this.clienteSelected==null?null:this.clienteSelected.id_cliente
                });

                this.print("parametros total: " + parametros);
                this.facturaManualElectronicaService.getTotalParametros(parametros)
                        .subscribe(
                        data => {
                                this.totalLista = data;
                                this.print("total:" + data);
                        },
                        error => this.msj = <any>error);
        }



        /*********OBTENER DATOS DEL CLIENTE*********/
        obtenerClienteDatosExternos(datos) {
                this.clienteSelected = datos.bean;
                this.print("datos Cliente");
                this.print(datos);
                this.cerrarModal("modalClienteCom");

        }


        obtenerGuiaRemisionExterna(datos){
                this.print("guia remision seleccionada: ");
                this.print(datos.bean);
                 
                let sub=this.idCompraVentaTextoSelected.split(",");
                
                
                if(sub.length=1){
                        sub.length=sub[0]==""?0:sub.length;
                }

                /*let sub2=this.series_numeros_guias.split(",");
               
                if(sub2.length=1){
                        sub2.length=sub2[0]==""?0:sub2.length;
                }

                if(sub2.length>0){
                        this.series_numeros_guias +=","+datos.bean.serie+"-"+datos.bean.numero;
                        this.idGuiasTextoSelected+=","+datos.bean.id_guia_remision;
                }else{
                        this.series_numeros_guias +=datos.bean.serie+"-"+datos.bean.numero;
                        this.idGuiasTextoSelected+=datos.bean.id_guia_remision;

                }*/
               
                if(sub.length>0){
                        this.idCompraVentaTextoSelected +=","+datos.bean.id_compra_venta;
                }else{
                        this.idCompraVentaTextoSelected +=datos.bean.id_compra_venta;
                }

                this.mensajeCorrecto("Compra/Venta Agregada Correctamente");
        }
}