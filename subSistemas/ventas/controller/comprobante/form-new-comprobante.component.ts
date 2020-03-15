import { Component, AfterViewInit, ViewChild} from '@angular/core';
import { Http} from '@angular/http';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';

import { ControllerComponent } from '../../../../core/controller/controller.component';




/******************IMPORTAR SERVICIOS*************** */


import { ComprobanteService } from '../../service/comprobante.service';
import { VentaService } from '../../service/venta.service';
import { CompraService } from '../../../compras/service/compra.service';
import { ReportePdfService } from '../../../../core/service/reporte-pdf.Service';
import { CategoriaComprobanteService } from '../../../mantenedores/service/categoria-comprobante.service';
import { TipoComprobanteService } from '../../../mantenedores/service/tipo-comprobante.service';
import { SerieComprobanteService } from '../../../mantenedores/service/serie-comprobante.service';
import { MedioPagoService } from '../../../mantenedores/service/medio-pago.service';
import { FormFindGuiaRemisionComponent } from 'src/app/subSistemas/mantenedores/controller/guia-remision/form-find-guia-remision.component';


declare var $: any;
@Component({
        selector: 'form-new-comprobante',
        templateUrl: '../../view/comprobante/form-new-comprobante.component.html',
        providers: [ComprobanteService, ReportePdfService, VentaService, CompraService, CategoriaComprobanteService, TipoComprobanteService, SerieComprobanteService, MedioPagoService]

})

export class FormNewComprobanteComponent extends ControllerComponent implements AfterViewInit {
    
        simboloMonedaSelected:string='S/';
      
        nroOrdenSelected: number = null;
        nroOrdenEmpresaSelected: number = null;

        tieneComprobante: boolean = false;

        numeroCorrelativoSiguiente:number;
        fechaSelected:any;
        numeroSelected: any=null;
        serieSelected: any=null;
        categoriaComprobanteSelected: any = null;
        categoriasComprobante: any[];
        tipoComprobanteSelected: any = null;
        tiposComprobante: any[];
        seriesComprobante: any[];
        serieComprobanteSelected: any = null;
        medioPagoSelected: any = null;
        mediosPago: any[];
        idCompraVentaSelected: number;
        idCompraVentaTextoSelected: string="";
        idGuiasTextoSelected: string="";
        nroGuiaSelected: number = null;

        IdsCompraVenta:any[];
        IdsGuias:any[];

        buscarPorGuia:boolean=false;
        tabsBuscadorGuiaRemisionActivated:boolean=false;
        ventaSelected: any;
        compraSelected: any;
        comprobanteCompraActivated: boolean = false;
        idComprobanteSelected: any;
        series_numeros_guias:string="";

        listaProductos: any[] = null;

        @ViewChild(FormFindGuiaRemisionComponent,{static: true}) formFindGuiaRemision: FormFindGuiaRemisionComponent;


         //**************TIPOS MONEDA
         billete200: number = 0;
         billete100: number = 0;
         billete50: number = 0;
         billete20: number = 0;
         billete10: number = 0;
         billete5: number = 0;
         billete2: number = 0;
         billete1: number = 0;
         billete20cen: number = 0;
         billete10cen: number = 0;
         pago_efectivo: number = 0;
         pago_vuelto: number = 0;
         lista_locales:any[];
         montoTotalSelected: string = "0";
         subTotalSelected: string = "0";
         igvSelected: string = "0";
        completado1:boolean = false;
        constructor(
                public http: Http,
                public router: Router,
                public comprobanteService: ComprobanteService,
                public reportePdfService: ReportePdfService,
                public ventaService: VentaService,
                public compraService: CompraService,
                public categoriaComprobanteService: CategoriaComprobanteService,
                public tipoComprobanteService: TipoComprobanteService,
                public serieComprobanteService: SerieComprobanteService,
                public medioPagoService: MedioPagoService
        ) {
                super(router);

        }




        ngOnInit() {
                this.lista_locales =  new Array();
                this.IdsCompraVenta=new Array();
                this.IdsGuias=new Array();
                this.formFindGuiaRemision.buttonSelected=true;
                let array_almacen = JSON.parse(localStorage.getItem("almacen_start"));
                this.lista_locales.push(array_almacen);
             
                
             
        }


        ngAfterViewInit() {
                if (this.verificarTokenRpta(this.rutasMantenedores.FORM_COMPROBANTE)) {
                       
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


        obtenerMediosPago() {

                this.medioPagoService.getAll()
                        .subscribe(
                        data => {//this.vistas = data;

                                this.mediosPago = data;
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

        setBeanBuscar(bean:any) {
                this.print("bean");
                this.print(bean);
                this.idCompraVentaSelected= bean.id_venta;
                this.print("ids:");
                this.print(this.idCompraVentaSelected);

                this.buscarVenta();
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
                                numero: this.ventaSelected == null?this.numeroSelected:this.numeroCorrelativoSiguiente,
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
                                ids_compras_ventas:this.IdsCompraVenta==null?null:this.IdsCompraVenta.length==0?null:this.IdsCompraVenta,
                                ids_guias: this.IdsGuias==null?null:this.IdsGuias.length==0?null:this.IdsGuias,
                                series_numeros_guias:this.series_numeros_guias

                        });

                


                        this.comprobanteService.registrar(parametros)
                                .subscribe(
                                data => {

                                        let rpta = data.rpta;
                                        this.print("rpta: " + rpta);
                                        if (rpta != null) {
                                                if (rpta == 1) {
                                                        this.mensajeCorrecto("ID COMPROBANTE: " + data.id_comprobante + " REGISTRADO CORRECTAMENTE", " NUMERO COMPROBANTE: " + data.numero);
                                                        //this.limpiarCampos();
                                                        this.completado = true;
                                                        this.idComprobanteSelected = data.id_comprobante;
                                                        this.tieneComprobante = true;
                                                        this.print("codigo de venta");
                                                        let id_venta = this.idCompraVentaSelected.toString();
                                                        
                                                        this.imprimirTicketera(this.idComprobanteSelected);
                                                        
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


        limpiarCampos() {

                
                this.buscarPorGuia=false;
                this.tieneComprobante=false;
                this.fechaSelected=null;
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

                this.series_numeros_guias="";
                this.idGuiasTextoSelected="";
  

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

        /*********OBTENER DATOS DE LA GUIA DE REMISION*********/

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

        imprimirComprobanteTicketera() {
                if (this.tienePermisoPrintMsj(this.rutas.FORM_COMPROBANTE, this.rutas.BUTTON_IMPRIMIR)) {
                        
                let id = this.lista_locales[0].id_local;
                        this.reportePdfService.obtenerComprobantePdTicketera(this.idComprobanteSelected,id)
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

        imprimirTicketera(id_comprobante) {
                
                if (this.tienePermisoPrintMsj(this.rutas.FORM_COMPROBANTE, this.rutas.BUTTON_IMPRIMIR)) {
                      this.print(id_comprobante);
                                            
                let id = this.lista_locales[0].id_local;
                        this.reportePdfService.obtenerComprobantePdTicketera(id_comprobante,id)
                                .subscribe(
                                data => {
                                        if (data._body.size == 0) {
                                                this.mensajeInCorrecto("DOCUMENTO DIGITALIZADO NO ENCONTRADO - HA SIDO ELIMINADO ARCHIVO ADJUNTO");
                                        } else {
                                                //this.abrirPDF(data._body);
                                                if(this.rutas.IMPRESION_MODAL=='true'){
                                                        this.abrirDocumentoModalId(data._body,'mostrarPrincipalPDF');
                                                        this.abrirModalPDfPorc("modalPrincipalPDF", 90);
                                                       // this.completado = false;
                                                }else{
                                                        this.abrirPDF(data._body); 
                                                        this.completado = false;
                                                } 
                                        }


                                },
                                error => this.msj = <any>error
                                );
                }

        }

        EnviarEmail(){
        this.abrirModal("modalSendEmail");

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

        imprimirComprobanteBlanco() {

                if (this.tienePermisoPrintMsj(this.rutas.FORM_COMPROBANTE, this.rutas.BUTTON_IMPRIMIR)) {
                        this.reportePdfService.obtenerComprobanteBlancoPdf(this.idComprobanteSelected)
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


        imprimirComprobanteA4() {

                if (this.tienePermisoPrintMsj(this.rutas.FORM_COMPROBANTE, this.rutas.BUTTON_IMPRIMIR)) {
                        this.reportePdfService.obtenerComprobantePdfA4(this.idComprobanteSelected)
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


        abrirModalGuiaRemision(){
                this.abrirModal('modalBuscadorGuiaRemision');
                this.formFindGuiaRemision.obtenerTipoMoneda();
                this.formFindGuiaRemision.obtenerCategoriasComprobante();
                this.formFindGuiaRemision.obtenerGuiasRemision();
               
        }

        pagar() {
             this.registrar();
        }


        agregarMoneda(cantidad, tipo) {
                this.print("tipo: " + tipo);
                if (tipo == 'billete200') { this.billete200 = this.billete200 + cantidad; }
                if (tipo == 'billete100') { this.billete100 = this.billete100 + cantidad; }
                if (tipo == 'billete50') { this.billete50 = this.billete50 + cantidad; }
                if (tipo == 'billete20') { this.billete20 = this.billete20 + cantidad; }
                if (tipo == 'billete10') { this.billete10 = this.billete10 + cantidad; }
                if (tipo == 'billete5') { this.billete5 = this.billete5 + cantidad; }
                if (tipo == 'billete2') { this.billete2 = this.billete2 + cantidad; }
                if (tipo == 'billete1') { this.billete1 = this.billete1 + cantidad; }
                if (tipo == 'billete20cen') { this.billete20cen = this.billete20cen + cantidad; }
                if (tipo == 'billete10cen') { this.billete10cen = this.billete10cen + cantidad; }
                this.calcularPagos();
        }

        calcularPagos() {

                this.pago_efectivo =
                        this.round2((this.billete200 * 200) +
                                (this.billete100 * 100) +
                                (this.billete50 * 50) +
                                (this.billete20 * 20) +
                                (this.billete10 * 10) +
                                (this.billete5 * 5) +
                                (this.billete2 * 2) +
                                (this.billete1 * 1) +
                                (this.billete20cen * 0.20) +
                                (this.billete10cen * 0.10));


                this.pago_vuelto = this.round2(this.pago_efectivo - parseFloat(this.montoTotalSelected));

        }

        limpiarPago() {
                this.pago_efectivo = 0;
                this.pago_vuelto = 0;

                this.billete200 = 0;
                this.billete100 = 0;
                this.billete50 = 0;
                this.billete20 = 0;
                this.billete10 = 0;
                this.billete5 = 0;
                this.billete2 = 0;
                this.billete1 = 0;
                this.billete20cen = 0;
                this.billete10cen = 0;
        }
}