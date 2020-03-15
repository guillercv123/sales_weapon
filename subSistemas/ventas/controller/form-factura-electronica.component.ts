import { Component, AfterViewInit, ViewChild, OnInit, Input } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';

import { ControllerComponent } from '../../../core/controller/controller.component';




/******************IMPORTAR SERVICIOS*************** */


import { FacturaElectronicaService } from '../service/factura-electronica.service';
import { ComprobanteElectronicoService } from '../service/comprobante-electronico.service';
import { FacturadorSunatService } from '../service/facturador-sunat.service';
import { VentaService } from '../service/venta.service';
import { CompraService } from '../../compras/service/compra.service';
import { ReportePdfService } from '../../../core/service/reporte-pdf.Service';
import { CategoriaComprobanteService } from '../../mantenedores/service/categoria-comprobante.service';
import { TipoComprobanteService } from '../../mantenedores/service/tipo-comprobante.service';
import { SerieComprobanteService } from '../../mantenedores/service/serie-comprobante.service';
import { MedioPagoService } from '../../mantenedores/service/medio-pago.service';
import { FormFindClienteComponent } from '../../mantenedores/controller/cliente/form-find-cliente.component';
import { ReporteExcelService } from '../../../core/service/reporte-excel.Service';


declare var $: any;
@Component({
        selector: 'form-factura-electronica',
        templateUrl: '../view/form-factura-electronica.component.html',
        providers: [ReporteExcelService,ComprobanteElectronicoService,FacturaElectronicaService,FacturadorSunatService, ReportePdfService, VentaService, CompraService, CategoriaComprobanteService, TipoComprobanteService, SerieComprobanteService, MedioPagoService]

})

export class FormFacturaElectronicaComponent extends ControllerComponent implements AfterViewInit {
        
        seleccionarTodos:boolean=false;
        listaComprobantesSeleccionados: any[];


        buscarPorGuia:boolean=false;
        tabsBuscadorGuiaRemisionActivated:boolean=false;
        
        series_numeros_guias:string="";
        //fechaSelected:any;
        fechaInicioSelected:any;
        fechaFinSelected:any;
        idCompraVentaBusqueda:number;
        categoriasComprobante: any[];
        tiposComprobante: any[];
        seriesComprobante: any[];
        mediosPago: any[];
        listaTipoNotaCredito: any[];
        listaTipoNotaDebito: any[];
        listaTipoFactura: any[];

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

        
        //**********RUTA DEL FACTURADOR SUNAT************/
        seleccionarTodosFacturador:boolean=false;

        ruta_facturador_sunat:string;
        ruta_facturador_sunat2:string;
        documentos_facturador: any[];
        documentos_facturador_selected:any[];

        numero_ruc_facturador:string;
        tipo_doc_tribu_facturador:string;
        serie_comprobante_facturador:string;
        numero_comprobante_facturador:string;

        //**************PAGINACION FACTURADOR SUNAT*************
        tamPaginaFacturador: number =10;
        inicioFacturador: number = 1;
        finFacturador: number = 10;
        totalListaFacturador:number;

     
      //***********COMPROBANTES ELECTRONICOS******************/
        seleccionarTodosCe:boolean=false; 
        panelGenerarNotaCreditoDebito:boolean=false;
        doc_electro_envidado:any;
        numero_ruc_facturador_ce:string;
        tipo_doc_tribu_facturador_ce:string;
        serie_comprobante_facturador_ce:string;
        numero_comprobante_facturador_ce:string;
        fecha_emision_ce:string;
        fecha_envio_ce:string;
        documentos_electronicos: any[];
        documentos_electronicos_selected:any[];
        notaCreditoSelected:boolean=true;

         //**************PAGINACION COMPROBANTE ELECTRONICO*************
         tamPaginaCe: number =10;
         inicioCe: number = 1;
         finCe: number = 10;
         totalListaCe:number;
         lista_locales:any[];


         @ViewChild(FormFindClienteComponent,{static: true}) formFindCliente: FormFindClienteComponent;

        constructor(
                public http: Http,
                public router: Router,
                public comprobanteElectronicoService:ComprobanteElectronicoService,
                public facturaElectronicaService: FacturaElectronicaService,
                public facturadorSunatService: FacturadorSunatService,
                public reportePdfService: ReportePdfService,
                public ventaService: VentaService,
                public compraService: CompraService,
                public categoriaComprobanteService: CategoriaComprobanteService,
                public tipoComprobanteService: TipoComprobanteService,
                public serieComprobanteService: SerieComprobanteService,
                public medioPagoService: MedioPagoService,
                public reporteExcelService: ReporteExcelService
        ) {
                super(router);

                this.panelEditarSelected = false;
        }




        ngOnInit() {
                this.IdsCompraVenta=new Array();
                this.IdsGuias=new Array();
                this.listaComprobantesSeleccionados= new Array();
                this.documentos_facturador_selected= new Array();
                this.documentos_electronicos_selected= new Array();
                //this.limpiarCampos();
                //this.listaProductos = new Array();
                
                this.lista_locales =  new Array();
                let array_almacen = JSON.parse(localStorage.getItem("almacen_start"));
                this.lista_locales.push(array_almacen);
        }

        ngAfterViewInit() {
                this.formFindCliente.buttonSelectedActivated=true;    
                let config=this.obtenerConfiguracionFacturador();

                this.ruta_facturador_sunat=config.servidor_facturacion;
                
                this.print("ruta_facturador: " +this.ruta_facturador_sunat);

                let frame=  "<iframe id='frame_facturador'  src='"+this.ruta_facturador_sunat+"'"
               +" marginwidth='0' marginheight='0' name='ventana_facturador' scrolling='no' border='0' " 
               +" frameborder='0' width='100%' height='8000'> "
               +" </iframe>";

                $("#facturador_panel").html(frame);
             


                this.ruta_facturador_sunat2=config.servidor_facturacion2;
                
                this.print("ruta_facturador2: " +this.ruta_facturador_sunat2);

                let frame2=  "<iframe id='frame_facturador2'  src='"+this.ruta_facturador_sunat2+"'"
               +" marginwidth='0' marginheight='0' name='ventana_facturador' scrolling='no' border='0' " 
               +" frameborder='0' width='100%' height='8000'> "
               +" </iframe>";

                $("#facturador_comprobantes_panel").html(frame2);
             


                if (this.verificarTokenRpta(this.rutasVentas.FORM_FACTURACION_ELECTRONICA)) {
                        //this.getTotalLista();
                        //this.obtenerCatalogoVenta();
                        //this.seleccionarByPagina(this.inicio,this.fin,this.tamPagina);   
                        this.obtenerCategoriasComprobanteVenta();
                        //this.obtenerMediosPago();
                        this.obtenerComprobantes();
                        //this.buscarDocumentosFacturador();
                        this.buscarComprobantesElectronicos();

                        this.obtenerTipoNotaCredito();
                        this.obtenerTipoNotaDebito();
                        this.obtenerTipoFactura();
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

        selectAllCe(){
                if(this.documentos_electronicos!=null){
                        let i;
                        for(i=0;i<this.documentos_electronicos.length;i++){
                        this.documentos_electronicos[i].selected=this.seleccionarTodosCe; 
                        }
                }
        }

        selectAllFacturador(){
                if(this.documentos_facturador!=null){
                        let i;
                        for(i=0;i<this.documentos_facturador.length;i++){
                        this.documentos_facturador[i].selected=this.seleccionarTodosFacturador; 
                        }
                }
        }


        //****************FUNCIONES FACTURADOR******************/
  

        limpiar_buscar_facturador(){
                this.numero_ruc_facturador=null;
                this.tipo_doc_tribu_facturador=null;
                this.serie_comprobante_facturador=null;
                this.numero_comprobante_facturador=null;
                this.documentos_facturador_selected= new Array();
                this.buscarDocumentosFacturador();
        }




        buscarDocumentosFacturador(){
                this.getTotalListaFacturador();
                this.seleccionarByPaginaFacturador(this.inicioFacturador, this.finFacturador, this.tamPaginaFacturador);
        }


        seleccionarByPaginaFacturador(inicio: any, fin: any, tamPagina: any) {
                let user=this.obtenerUsuario();
                let parametros = JSON.stringify({
                        numero_ruc_facturador:this.numero_ruc_facturador,
                        tipo_doc_tribu_facturador:this.tipo_doc_tribu_facturador,
                        serie_comprobante_facturador:this.serie_comprobante_facturador,
                        numero_comprobante_facturador:this.numero_comprobante_facturador,
                        id_empresa: user.id_empresa
                });

                
                this.facturadorSunatService.buscarDocumentosPaginacion(inicio, fin, tamPagina, parametros)
                        .subscribe(
                        data => {
                                this.documentos_facturador = data;
                                this.print("Documentos Facturador: ");
                                this.print(data);
                        },
                        error => this.msj = <any>error);
        }



        
        getTotalListaFacturador() {
                let user = this.obtenerUsuario();
                let parametros = JSON.stringify({
                        numero_ruc_facturador:this.numero_ruc_facturador,
                        tipo_doc_tribu_facturador:this.tipo_doc_tribu_facturador,
                        serie_comprobante_facturador:this.serie_comprobante_facturador,
                        numero_comprobante_facturador:this.numero_comprobante_facturador,
                        id_empresa: user.id_empresa
                });

                this.print("parametros total: " + parametros);
                this.facturadorSunatService.getTotalDocumentosParametros(parametros)
                        .subscribe(
                        data => {
                                this.totalListaFacturador = data;
                                this.print("total:" + data);
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


        /*obtenerMediosPago() {

                this.medioPagoService.getAll()
                        .subscribe(
                        data => {//this.vistas = data;

                                this.mediosPago = data;
                        },
                        error => this.msj = <any>error);
        }*/



        obtenerComprobantes() {
                this.getTotalLista();
                this.limpiarCampos();
                this.seleccionarByPagina(this.inicio, this.fin, this.tamPagina);
        }


        /*obtenerCategoriasComprobante() {

                this.categoriaComprobanteService.getAll()
                        .subscribe(
                        data => {//this.vistas = data;

                                this.categoriasComprobante = data;
                        },
                        error => this.msj = <any>error);
        }*/

        elegirNotaCredito(){
                this.notaCreditoSelected=true;
        }

        elegirNotaDebito(){
                this.notaCreditoSelected=false;
        }

        obtenerTipoNotaCredito() {

                this.facturadorSunatService.getAllTipoNotaCredito()
                        .subscribe(
                        data => {//this.vistas = data;

                                this.listaTipoNotaCredito = data;
                        },
                        error => this.msj = <any>error);
        }
 
        obtenerTipoNotaDebito() {

                this.facturadorSunatService.getAllTipoNotaDebito()
                        .subscribe(
                        data => {//this.vistas = data;

                                this.listaTipoNotaDebito = data;
                        },
                        error => this.msj = <any>error);
        }
           
        obtenerTipoFactura() {

                this.facturadorSunatService.getAllTipoFactura()
                        .subscribe(
                        data => {//this.vistas = data;

                                this.listaTipoFactura = data;
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

                this.print("tipos de comprobante:");
                this.print(this.tipoComprobanteSelected);
                let parametros = JSON.stringify({
                        id_categoria_comprobante: this.categoriaComprobanteSelected==null?null:this.categoriaComprobanteSelected.id_categoria_comprobante,
                        serie:  this.serieSelected ,
                        numero: this.numeroSelected,
                        tipos_comprobantes:this.tipoComprobanteSelected,
                        id_tipo_comprobante: this.tipoComprobanteSelected==null?null:this.tipoComprobanteSelected.id_tipo_comprobante,
                        //id_medio_pago: this.medioPagoSelected==null?null:this.medioPagoSelected.id_medio_pago,
                        //fecha: this.fechaSelected,
                        fecha_inicio:this.fechaInicioSelected,
                        fecha_fin:this.fechaFinSelected,
                        id_compra_venta:this.idCompraVentaBusqueda,
                        //id_cliente:this.clienteSelected==null?null:this.clienteSelected.id_cliente
                });

                let user = this.obtenerUsuario();
                this.facturaElectronicaService.buscarPaginacion(inicio, fin, tamPagina, parametros)
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

                if (this.tienePermisoPrintMsj(this.rutasVentas.FORM_FACTURACION_ELECTRONICA, this.rutas.BUTTON_IMPRIMIR)) {
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
                
                if (this.tienePermisoPrintMsj(this.rutasVentas.FORM_FACTURACION_ELECTRONICA, this.rutas.BUTTON_IMPRIMIR)) {
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
                
                if (this.tienePermisoPrintMsj(this.rutasVentas.FORM_FACTURACION_ELECTRONICA, this.rutas.BUTTON_IMPRIMIR)) {
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

                if (this.tienePermisoPrintMsj(this.rutasVentas.FORM_FACTURACION_ELECTRONICA, this.rutas.BUTTON_IMPRIMIR)) {
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

                this.facturaElectronicaService.getComprobanteById(id)
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

        
        regresarComprobanteElectronicos(){
                this.panelGenerarNotaCreditoDebito=false;
        }

        abrir_panel_nota_credito(obj){
                this.panelGenerarNotaCreditoDebito=true;
                this.doc_electro_envidado=obj;
                this.print(this.doc_electro_envidado);

        }


        generar_archivo_txt_nota_credito_debito() {
                this.documentos_electronicos_selected= new Array();
                this.print(this.doc_electro_envidado);
                
                if (this.tienePermisoPrintMsj(this.rutas.FORM_FACTURACION_ELECTRONICA, this.rutas.BUTTON_REGISTRAR)) {
                        this.completado=true;
                        this.documentos_electronicos_selected.push(this.doc_electro_envidado);
                                         


                        let user=this.obtenerUsuario();
                                
                        let parametros = JSON.stringify({
                                lista_comprobantes:this.documentos_electronicos_selected,
                                id_empresa: user.id_empresa
                
                        });
                        //this.print("parametros:");
                        //this.print(parametros);

                        this.facturaElectronicaService.generar_archivo_txt_nota_credito_debito(parametros)
                                .subscribe(
                                data => {

                                        let rpta = data.rpta;
                                        this.print("rpta: " + rpta);
                                        if (rpta != null) {
                                                if (rpta == 1) {
                                                        this.mensajeCorrectoSinCerrar("ARCHIVOS GENERADOS CORRECTAMENTE");
                                                        
                                                        /*//****************REPLICAR LOS ARCHIVOS GENERADOS A LA BASE DE DATOS*************   
                                                        this.facturaElectronicaService.insertar_comprobantes_generados(parametros)
                                                        .subscribe(
                                                        data => {},
                                                        error => this.msj = <any>error
                                                        );*/


                                                } else {
                                                        this.mensajeInCorrecto("ERROR AL GENERAR LOS ARCHIVOS");
                                                }
                                        }

                                        this.limpiarCamposMultiple();
                                        this.completado=false;
                                },
                                error => {
                                        this.msj = <any>error; 
                                        this.completado=false;
                                        }
                                );
                }
        }




        generar_archivo_txt() {
                
                if (this.tienePermisoPrintMsj(this.rutas.FORM_FACTURACION_ELECTRONICA, this.rutas.BUTTON_REGISTRAR)) {
                        this.completado=true;
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

                        let user=this.obtenerUsuario();
                                
                        let parametros = JSON.stringify({
                                lista_comprobantes:this.listaComprobantesSeleccionados,
                                id_empresa: user.id_empresa
                
                        });
                        //this.print("parametros:");
                        //this.print(parametros);

                        this.facturaElectronicaService.generar_archivo_txt(parametros)
                                .subscribe(
                                data => {

                                        let rpta = data.rpta;
                                        this.print("rpta: " + rpta);
                                        if (rpta != null) {
                                                if (rpta == 1) {
                                                        this.mensajeCorrectoSinCerrar("ARCHIVOS GENERADOS CORRECTAMENTE");
                                                        
                                                        /****************REPLICAR LOS ARCHIVOS GENERADOS A LA BASE DE DATOS*************/        
                                                        this.facturaElectronicaService.insertar_comprobantes_generados(parametros)
                                                        .subscribe(
                                                        data => {},
                                                        error => this.msj = <any>error
                                                        );


                                                } else {
                                                        this.mensajeInCorrecto("ERROR AL GENERAR LOS ARCHIVOS");
                                                }
                                        }

                                        this.limpiarCamposMultiple();
                                        this.completado=false;
                                },
                                error => {this.msj = <any>error;
                                this.completado=false;}
                                );
                }
        }



        
        sincronizar() {
                this.completado=true;
                this.facturaElectronicaService.sincronizar(null)
                        .subscribe(
                        data => {
                                let archivos= data.archivos;
                                

                                      let i=0;
                                      let intervalo=setInterval(()=> {
                                                let parametros = JSON.stringify({
                                                        archivo:archivos[i]
                                        
                                                });

                                                this.facturaElectronicaService.descargar(parametros)
                                                .subscribe(
                                                data => {
                                                        this.descargarFileName(data, archivos[i]);
                                                        i++;
                                                        //setTimeout(function() {}, 3000);

                                                        if(archivos.length==i){
                                                                clearInterval(intervalo);
                                                                this.completado=false;
                                                                this.mensajeCorrecto("ARCHIVOS DESCARGADOS CORRECTAMENTE");
                                                        }
                                                },
                                                error => this.msj = <any>error
                                                );

                                        },2000); 

                                      
                                        /*for(let i=0;i<archivos.length;i++){
                                               
                                                let parametros = JSON.stringify({
                                                       archivo:archivos[i]
                                        
                                                });

                                                this.facturaElectronicaService.descargar(parametros)
                                                .subscribe(
                                                data => {
                                                        this.descargarFileName(data._body, archivos[i]);
                                                        //setTimeout(function() {}, 3000);
                                                },
                                                error => this.msj = <any>error
                                                );
                                              
                                        }*/

                        },
                        error => {this.msj = <any>error;
                                this.completado=false;
                        }
                        );
        }


        eliminar_files() {
                this.completado=true;
                this.facturaElectronicaService.eliminar_files(null)
                        .subscribe(
                        data => {
                                let rpta= data.rpta;

                                if(rpta){
                                        this.mensajeCorrectoSinCerrar("ARCHIVOS ELIMINADOS CORRECTAMENTE");
                                }else{
                                        this.mensajeCorrectoSinCerrar("ERROR AL ELIMINAR ARCHIVOS");
                                }
                                this.completado=false;
                                /*let archivos= data.archivos;
                                
                                        for(let i=0;i<archivos.length;i++){
                                               
                                                let parametros = JSON.stringify({
                                                       archivo:archivos[i]
                                        
                                                });

                                                this.facturaElectronicaService.descargar(parametros)
                                                .subscribe(
                                                data => {
                                                        this.descargarFileName(data._body, archivos[i]);

                                                },
                                                error => this.msj = <any>error
                                                );
                                        }*/

                        },
                        error => {
                                this.msj = <any>error;
                                this.completado=false;
                        }
                        );
        }


        generar_archivo_txt_baja(obj) {

                this.completado=true;
                        if(this.documentos_electronicos!=null){
                                /*var tam=this.documentos_electronicos.length;
                                if(tam>0)
                                {
                                        for(let i=0;i<tam;i++){
                                                if(this.documentos_electronicos[i].selected){
                                                        this.documentos_electronicos_selected.push(this.documentos_electronicos[i]);
                                                }   
                                        }
                                }*/
                                this.documentos_electronicos_selected.push(obj);
                                 
                        }

                        let user=this.obtenerUsuario();
                                
                        let parametros = JSON.stringify({
                                lista_comprobantes:this.documentos_electronicos_selected,
                                id_empresa: user.id_empresa
                
                        });
                        this.print("parametros:");
                        this.print(parametros);

                        this.facturaElectronicaService.generar_archivo_txt_baja(parametros)
                                .subscribe(
                                data => {
                                        let comunicacion= data.comunicacion_baja;
                                        let rpta = data.rpta;
                                        this.print("rpta: " + rpta);
                                        if (rpta != null) {
                                                if (rpta == 1) {
                                                        this.mensajeCorrectoSinCerrar("ARCHIVOS GENERADOS CORRECTAMENTE");
                                                        
                                                        let lista= new Array();
                                                        lista.push(comunicacion);
                                                        let parametros_comunicacion = JSON.stringify({
                                                                lista_comprobantes:lista,
                                                                id_empresa: user.id_empresa
                                                        });

                                                        
                                                        /****************REPLICAR LOS ARCHIVOS GENERADOS A LA BASE DE DATOS*************/        
                                                        this.facturaElectronicaService.insertar_comprobantes_generados(parametros_comunicacion)
                                                        .subscribe(
                                                        data => {},
                                                        error => this.msj = <any>error
                                                        );



                                                } else {
                                                        this.mensajeInCorrecto("ERROR AL GENERAR LOS ARCHIVOS");
                                                }
                                        }
                                        this.completado=false;
                                        //this.limpiarCamposMultiple();
                                },
                                error => {this.msj = <any>error; this.completado=false;}
                                );
                
        }




        eliminar(bean) {

                //if (this.tienePermisoPrintMsj(this.rutas.FORM_ALMACEN, this.rutas.BUTTON_ELIMINAR)) {
                       
                        if( confirm("Realmente Desea Eliminar ?")){
                       
                        this.facturaElectronicaService.eliminarLogico(bean.id_comprobante_electronico)
                                .subscribe(
                                data => {
                                        this.buscarComprobantesElectronicos();
                                        let rpta = data;
                                        if (rpta != null) {
                                                if (rpta == 1) {
                                                        this.mensajeCorrecto("COMPROBANTE ELIMINADO CORRECTAMENTE");
                                                } else {
                                                        this.mensajeInCorrecto("COMPROBANTE NO ELIMINADO");
                                                }

                                        }
                                },
                                error => this.msj = <any>error);
                        }
                //}
        }



        generarXml(){

                this.completado=true;
                if(this.documentos_facturador!=null){
                        var tam=this.documentos_facturador.length;
                        if(tam>0)
                        {
                                for(let i=0;i<tam;i++){
                                        if(this.documentos_facturador[i].selected){
                                                this.documentos_facturador_selected.push(this.documentos_facturador[i]);
                                        }   
                                }
                        }
                }

               
                let config=this.obtenerConfiguracionFacturador();
/*
                let result=this.facturadorSunatService.generarXml(this.documentos_facturador_selected  ,config.servidor_facturacion)
                
                

                setTimeout(()=>{   
                        this.mensajeCorrecto("PROCESAMIENTO FINALIZADO");
                        this.buscarDocumentosFacturador();
                   }, 5000);*/
               

                   let registros=0;
                   let tam2=this.documentos_facturador_selected.length;
                   this.print("tam: "+tam);
                   for(let i=0;i<tam2;i++){
                           let obj=this.documentos_facturador_selected[i];
                           let parametros = JSON.stringify({
                                   num_ruc: obj.NUM_RUC,
                                   tip_docu:obj.TIP_DOCU,
                                   num_docu: obj.NUM_DOCU         
                           });
           
                           
                        this.facturadorSunatService.generarXml(parametros,config.servidor_facturacion)
                        .subscribe(
                        data => {
                                this.print("resultado genera xml: ");
                                this.print(data);
                                this.mensajeCorrecto("comprobante: "+obj.NUM_RUC+obj.TIP_DOCU+obj.NUM_DOCU+" - estado: "+
                                data.validacion+" "+data.mensaje);
                                this.buscarDocumentosFacturador();
                                this.completado=false;
                        },
                        error => this.msj = <any>error
                        );

                           /*//let options = this.getOptions();
                           this.http.post(ruta+"/api/GenerarComprobante.htm", parametros, null)
                                   .subscribe(
                                   data => {
                                           let result=data.json();
                                           let res=result._body;
                                           this.print("resultado xml");
                                           console.log(result);
                                           registros++;
                                   },
                                   error => {}
                                   );*/
                                   
                   }


        }


        enviarXml(){
                this.completado=true;

                if(this.documentos_facturador!=null){
                        var tam=this.documentos_facturador.length;
                        if(tam>0)
                        {
                                for(let i=0;i<tam;i++){
                                        if(this.documentos_facturador[i].selected){
                                                this.documentos_facturador_selected.push(this.documentos_facturador[i]);
                                        }   
                                }
                        }
                }

                
                let user=this.obtenerUsuario();
                                
                let parametros_insercion = JSON.stringify({
                        lista_comprobantes:this.documentos_facturador_selected,
                        id_empresa: user.id_empresa
        
                });


               
                let config=this.obtenerConfiguracionFacturador();

                   let registros=0;
                   let tam2=this.documentos_facturador_selected.length;
                   this.print("tam: "+tam);
                   for(let i=0;i<tam2;i++){
                           let obj=this.documentos_facturador_selected[i];
                           let parametros = JSON.stringify({
                                   num_ruc: obj.NUM_RUC,
                                   tip_docu:obj.TIP_DOCU,
                                   num_docu: obj.NUM_DOCU         
                           });
           
                           
                        this.facturadorSunatService.enviarXml(parametros,config.servidor_facturacion)
                        .subscribe(
                        data => {
                                this.print("resultado enviar xml: ");
                                this.print(data);
                                this.mensajeCorrecto("comprobante: "+obj.NUM_RUC+obj.TIP_DOCU+obj.NUM_DOCU+" - estado: "+
                                data.validacion+" "+data.mensaje);
                                this.buscarDocumentosFacturador();
                                this.completado=false;

                                 /****************REPLICAR LOS ARCHIVOS GENERADOS A LA BASE DE DATOS*************/        
                                this.facturaElectronicaService.insertar_comprobantes_generados(parametros_insercion)
                                                        .subscribe(
                                                        data => {},
                                                        error => this.msj = <any>error
                                                        );

                        },
                        error => this.msj = <any>error
                        );

                }

        }


        generarPdfFacturador(){

                this.completado=true;
                if(this.documentos_facturador!=null){
                        var tam=this.documentos_facturador.length;
                        if(tam>0)
                        {
                                for(let i=0;i<tam;i++){
                                        if(this.documentos_facturador[i].selected){
                                                this.documentos_facturador_selected.push(this.documentos_facturador[i]);
                                        }   
                                }
                        }
                }

                let config=this.obtenerConfiguracionFacturador();

                let registros=0;
                let tam2=this.documentos_facturador_selected.length;
                this.print("tam: "+tam);
                for(let i=0;i<tam2;i++){
                        let obj=this.documentos_facturador_selected[i];
                        let parametros = JSON.stringify({
                                num_ruc: obj.NUM_RUC,
                                tip_docu:obj.TIP_DOCU,
                                num_docu: obj.NUM_DOCU         
                        });
        
                        
                     this.facturadorSunatService.genearPdfFacturador(parametros,config.servidor_facturacion)
                     .subscribe(
                     data => {
                             this.print("resultado generar PDF xml: ");
                             this.print(data);
                             this.mensajeCorrecto("comprobante: "+obj.NUM_RUC+obj.TIP_DOCU+obj.NUM_DOCU+" - estado: "+
                             data.validacion+" "+data.mensaje);
                             this.buscarDocumentosFacturador();
                             this.completado=false;
                     },
                     error => this.msj = <any>error
                     );

             }

        }


        eliminarBandejaFacturador() {

                this.completado=true;
                let config=this.obtenerConfiguracionFacturador();
                        this.facturadorSunatService.eliminarBandeja(config.servidor_facturacion)
                                .subscribe(
                                data => {
                                        
                                        this.facturadorSunatService.actualizarBandeja(config.servidor_facturacion)
                                        .subscribe(
                                        data => {
                                                this.buscarDocumentosFacturador();
                                                this.mensajeCorrecto("Bandeja eliminado correctamente "+
                                        data.validacion+" "+data.mensaje);
                                                this.completado=false;
                                        },
                                        error => this.msj = <any>error
                                        );
    
                                       
                                },
                                error => this.msj = <any>error
                                );
       
        }

        actualizarBandejaFacturador(){
                this.completado=true;
                let config=this.obtenerConfiguracionFacturador();
                        this.facturadorSunatService.actualizarBandeja(config.servidor_facturacion)
                                .subscribe(
                                data => {                                      
                                        this.buscarDocumentosFacturador();
                                        this.mensajeCorrecto("Bandeja actualizada correctamente "+
                                        data.validacion+" "+data.mensaje);
                                        this.completado=false;         
                                },
                                error => this.msj = <any>error
                                );

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



        //**********ACCIONES PARAR FORMULARIO Cliente********
        abrirModalCliente() {
                this.abrirModal("modalClienteCom");
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
                this.fechaInicioSelected=null;
                this.fechaFinSelected=null;
                //this.idCompraVentaSelected=null;
                this.idCompraVentaTextoSelected="";
                this.idCompraVentaSelected=null;


        }
        

        elegirFila(lista, i) {
                this.marcar(lista, i);
        }
        
        elegirFilaFacturador(lista, i) {
                this.marcar(lista, i);
        }

        elegirFilaComprobantes(lista, i) {
                this.marcar(lista, i);
        }


        getTotalLista() {
                let parametros = JSON.stringify({
                        id_categoria_comprobante: this.categoriaComprobanteSelected==null?null:this.categoriaComprobanteSelected.id_categoria_comprobante,
                        serie:  this.serieSelected ,
                        numero: this.numeroSelected,
                        tipos_comprobantes:this.tipoComprobanteSelected,
                        id_tipo_comprobante: this.tipoComprobanteSelected==null?null:this.tipoComprobanteSelected.id_tipo_comprobante,
                        //id_medio_pago: this.medioPagoSelected==null?null:this.medioPagoSelected.id_medio_pago,
                        //fecha: this.fechaSelected,
                        fecha_inicio:this.fechaInicioSelected,
                        fecha_fin:this.fechaFinSelected,
                        id_compra_venta:this.idCompraVentaBusqueda,
                        //id_cliente:this.clienteSelected==null?null:this.clienteSelected.id_cliente
                });

                this.print("parametros total: " + parametros);
                this.facturaElectronicaService.getTotalParametros(parametros)
                        .subscribe(
                        data => {
                                this.totalLista = data;
                                this.print("total:" + data);
                        },
                        error => this.msj = <any>error);
        }

            /*****************EXPORTACION DE EXCEL**************/
            exportarExcelDetalle(){
                this.completado = true;
                let ventasAux = this.listaComprobantes;
               
               
                        this.eliminarColumna(ventasAux,
                        ["id_comprobante","id_categoria_comprobante","id_tipo_comprobante",
                        "id_compra_venta","ids_compras_ventas","is_unificado","ids_guias","series_numeros_guias","id_serie_comprobante",
                        "simbolo_tipo_moneda","nombre_categoria_comprobante","id_medio_pago","id_empleado",
                        "is_pagada","nro_orden","nro_guia_remision", "id_venta", "id_tipo_moneda", "ruc_emisor", "total_descuentos",
                         "codigo_tipo_tributo_tri", "selected", "nombre_medio_pago","codigo_domicilio_fiscal",
                         "nro_orden_empresa","emisor","estado","lista_productos","telefono","ce_existe",
                         "ce_observacion","ce_estado","tipo_documento_tributario","id_guia_remision",
                         "nro_guia_generada","serie","numero","codigo_adicional_monto_letras","nombre_tipo_moneda",
                         "total_anticipos","importe_total_venta","tipo_moneda","sumatoria_tributos",
                         "monto_tributo_item_tri","base_imponible_tri","nombre_tributo_tri","codigo_tributo_igv_tri",
                         "customizacion_documento","version_ubl","sumatoria_otros_cargos","porc_igv","igv","tipo_operacion","fecha_vencimiento",
                        "tipo_documento","razon_social","hora_emision_electronica","monto_total","direccion",
                        "fecha_emision","fecha","sub_total","ruc_receptor","total_valor_venta"]);
               
                let parametros = JSON.stringify({
                        datos: ventasAux,
                        titulo: 'VENTAS',
                        subtitulo: 'VENTAS EN BASE DE DATOS'
                });
              
                this.exportarExcelFinal(parametros, "Reporte de ventas - generado el ");
                
                this.limpiarBuscar();
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


        presionarRefrescarSunat(){

                let btn1=$("#frame_facturador").contents().find("#btnRefrescar");
                btn1.click();  
                this.print("btnRefrescar");

                this.facturaElectronicaService.actualizarBandeja(null)
                .subscribe(
                data => {
                        //$("#facturador2").html(data);
                },
                error => this.msj = <any>error);

        }
        
        presionarGenerarPdfSunat(){
                
                let btn2=$("#frame_facturador").contents().find("#btnVisorCdp");
                btn2.click();  

                this.print("btnVisorCdp");
        }

        presionarLimpiarSunat(){

                
                this.facturaElectronicaService.limpiarBandeja(null)
                .subscribe(
                data => {
                        //$("#facturador2").html(data);
                },
                error => this.msj = <any>error);

                var iframe = document.getElementById('frame_facturador');
                this.print("facturador:");
                this.print(iframe);

                var iframejs = $("#frame_facturador");
                this.print("facturador js:"); 
                this.print(iframejs);


                var btn=iframejs.children().children().children().children();
                this.print("btn js:"); 
                this.print(btn);

                this.print($("#frame_facturador").html());

                let btn3=$("#frame_facturador").contents().find("#presionarLimpiar");
               // this.print( $("#frame_facturador")[0].contentWindow.myDummyFunction().html());
                this.print($("#frame_facturador").contents().find("#presionarLimpiar").html());
                this.print(btn3);
                btn3.click();  
                this.print("presionarLimpiar");
        }







        //**************COMPROBANTES ELECTRONICOS**************/
        buscarComprobantesElectronicos(){
                this.getTotalListaComprobantesElectronicos();
                this.seleccionarByPaginaComprobantesElectronicos(this.inicioCe, this.finCe, this.tamPaginaCe);
        }


        limpiar_buscar_comprobantes_electronicos(){
                this.numero_ruc_facturador_ce=null;
                this.tipo_doc_tribu_facturador_ce=null;
                this.serie_comprobante_facturador_ce=null;
                this.numero_comprobante_facturador_ce=null;
                this.fecha_emision_ce=null;
                this.fecha_envio_ce=null;
                this.documentos_electronicos_selected= new Array();

                this.buscarComprobantesElectronicos();
        }

        seleccionarByPaginaComprobantesElectronicos(inicio: any, fin: any, tamPagina: any) {
                let parametros = JSON.stringify({
                        numero_ruc_facturador_ce:this.numero_ruc_facturador_ce,
                        tipo_doc_tribu_facturador_ce: this.tipo_doc_tribu_facturador_ce,
                        serie_comprobante_facturador_ce:this.serie_comprobante_facturador_ce,
                        numero_comprobante_facturador_ce:this.numero_comprobante_facturador_ce,
                        fecha_emision_ce:this.fecha_emision_ce,
                        fecha_envio_ce:this.fecha_envio_ce
                });

                let user = this.obtenerUsuario();
                this.comprobanteElectronicoService.buscarPaginacion(inicio, fin, tamPagina, parametros)
                        .subscribe(
                        data => {
                                this.documentos_electronicos = data;
                                this.print("Documentos Electronicos: ");
                                this.print(data);
                        },
                        error => this.msj = <any>error);
        }



        
        getTotalListaComprobantesElectronicos() {
             
                let parametros = JSON.stringify({
                        numero_ruc_facturador_ce:this.numero_ruc_facturador_ce,
                        tipo_doc_tribu_facturador_ce: this.tipo_doc_tribu_facturador_ce,
                        serie_comprobante_facturador_ce:this.serie_comprobante_facturador_ce,
                        numero_comprobante_facturador_ce:this.numero_comprobante_facturador_ce,
                        fecha_emision_ce:this.fecha_emision_ce,
                        fecha_envio_ce:this.fecha_envio_ce
                });

                this.print("parametros total: " + parametros);
                this.comprobanteElectronicoService.getTotalParametros(parametros)
                        .subscribe(
                        data => {
                                this.totalListaCe = data;
                                this.print("total:" + data);
                        },
                        error => this.msj = <any>error);
        }


        //**************PAGINACION FACTURADOR*************
        paginaSiguienteFacturador() {

                if (this.finFacturador < this.totalListaFacturador) {
                        /***********PAGINACION DOCUMENTOS***********/
                        this.inicioFacturador = this.inicioFacturador + this.tamPaginaFacturador;
                        this.finFacturador = (this.inicioFacturador + this.tamPaginaFacturador) - 1;
                        if (this.finFacturador > this.totalListaFacturador) {
                                this.finFacturador = this.totalListaFacturador;
                                this.inicioFacturador = this.finFacturador - this.tamPaginaFacturador + 1;
                                if (this.inicioFacturador <= 0) {
                                        this.inicioFacturador = 1;
                                }
                        }

                        this.print("inicio: " + this.inicioFacturador + " fin: " + this.finFacturador + " tamPagina: " + this.tamPaginaFacturador);
                        this.seleccionarByPaginaFacturador(this.inicioFacturador, this.finFacturador, this.tamPaginaFacturador);

                }
                this.print("/***************FIN PAGINA SIGUIENTE***************/\n\n");
        }


        paginaAnteriorFacturador() {

                this.print("inicio: " + this.inicioFacturador + " fin: " + this.finFacturador + " tamPagina: " + this.tamPaginaFacturador);
                //if (this.inicio>10){
                /***********PAGINACION DOCUMENTOS***********/
                this.inicioFacturador = this.inicioFacturador - this.tamPaginaFacturador;
                if (this.inicioFacturador <= 0) {
                        this.inicioFacturador = 1;
                }
                this.finFacturador = (this.inicioFacturador + this.tamPaginaFacturador) - 1;

                if (this.finFacturador > this.totalListaFacturador) {
                        this.finFacturador = this.totalListaFacturador;
                }

                this.print("inicio: " + this.inicioFacturador + " fin: " + this.finFacturador + " tamPagina: " + this.tamPaginaFacturador);
                this.seleccionarByPaginaFacturador(this.inicioFacturador, this.finFacturador, this.tamPaginaFacturador);
                //}
                this.print("/***************FIN PAGINA REGRESAR***************/\n\n");
        }


        //**************PAGINACION COMPROBANTE ELECTRONICO*************
        paginaSiguienteCe() {

                if (this.finCe < this.totalListaCe) {
                        /***********PAGINACION DOCUMENTOS***********/
                        this.inicioCe = this.inicioCe + this.tamPaginaCe;
                        this.finCe = (this.inicioCe + this.tamPaginaCe) - 1;
                        if (this.finCe > this.totalListaCe) {
                                this.finCe = this.totalListaCe;
                                this.inicioCe = this.finCe - this.tamPaginaCe + 1;
                                if (this.inicioCe <= 0) {
                                        this.inicioCe = 1;
                                }
                        }

                        this.print("inicio: " + this.inicioCe + " fin: " + this.finCe + " tamPagina: " + this.tamPaginaCe);
                        this.seleccionarByPaginaComprobantesElectronicos(this.inicioCe, this.finCe, this.tamPaginaCe);

                }
                this.print("/***************FIN PAGINA SIGUIENTE***************/\n\n");
        }


        paginaAnteriorCe() {

                this.print("inicio: " + this.inicioCe + " fin: " + this.finCe + " tamPagina: " + this.tamPaginaCe);
                //if (this.inicio>10){
                /***********PAGINACION DOCUMENTOS***********/
                this.inicioCe = this.inicioCe - this.tamPaginaCe;
                if (this.inicioCe <= 0) {
                        this.inicioCe = 1;
                }
                this.finCe = (this.inicioCe + this.tamPaginaCe) - 1;

                if (this.finCe > this.totalListaCe) {
                        this.finCe = this.totalListaCe;
                }

                this.print("inicio: " + this.inicioCe + " fin: " + this.finCe + " tamPagina: " + this.tamPaginaCe);
                this.seleccionarByPaginaComprobantesElectronicos(this.inicioCe, this.finCe, this.tamPaginaCe);
                //}
                this.print("/***************FIN PAGINA REGRESAR***************/\n\n");
        }


       
}