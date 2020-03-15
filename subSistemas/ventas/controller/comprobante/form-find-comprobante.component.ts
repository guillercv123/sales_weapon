import { Component, AfterViewInit, ViewChild} from '@angular/core';
import { Http} from '@angular/http';
import { Router } from '@angular/router';

import { ControllerComponent } from '../../../../core/controller/controller.component';




/******************IMPORTAR SERVICIOS*************** */


import { ComprobanteService } from '../../service/comprobante.service';
import { ReportePdfService } from '../../../../core/service/reporte-pdf.Service';
import { CategoriaComprobanteService } from '../../../mantenedores/service/categoria-comprobante.service';
import { TipoComprobanteService } from '../../../mantenedores/service/tipo-comprobante.service';
import { MedioPagoService } from '../../../mantenedores/service/medio-pago.service';
import { FormFindClienteComponent } from 'src/app/subSistemas/mantenedores/controller/cliente/form-find-cliente.component';


declare var $: any;
@Component({
        selector: 'form-find-comprobante',
        templateUrl: '../../view/comprobante/form-find-comprobante.component.html',
        providers: [ComprobanteService, ReportePdfService,CategoriaComprobanteService, 
                TipoComprobanteService,MedioPagoService]

})

export class FormFindComprobanteComponent extends ControllerComponent implements AfterViewInit {
       
        idCompraVentaBusqueda:any=null;
        categoriaComprobanteSelected: any = null;
        categoriasComprobante: any[];
        tiposComprobante: any[];
        tipoComprobanteSelected: any = null;
        numeroSelected: any=null;
        serieSelected: any=null;
        medioPagoSelected: any = null;
        mediosPago: any[];
        fechaSelected:any=null;
        clienteSelected: any=null;
        comprobanteCompraActivated: boolean = false;

        idComprobanteSelected: any=null;
        listaComprobantes: any[];

       /****MODAL CLIENTE*******/
       //buttonSelectedActivatedCli: boolean = true;
       //buttonEliminarActivatedCli: boolean = false;
       //buttonEditarActivatedCli: boolean = false;
       lista_locales :any[];
        //***************CRUD COMPROBANTES
        @ViewChild(FormFindClienteComponent,{static: true}) formFindCliente: FormFindClienteComponent;


        constructor(
                public http: Http,
                public router: Router,
                public comprobanteService: ComprobanteService,
                public reportePdfService: ReportePdfService,
                public categoriaComprobanteService: CategoriaComprobanteService,
                public tipoComprobanteService: TipoComprobanteService,
                public medioPagoService: MedioPagoService,
               // public serieComprobanteService:SerieComprobanteService
        ) {
                super(router);

             
        }




        ngOnInit() {
               /* this.obtenerCategoriasComprobante();
                this.obtenerMediosPago();
                this.obtenerComprobantes();*/
                this.lista_locales =  new Array();
                this.formFindCliente.buttonSelectedActivated=true;
                let array_almacen = JSON.parse(localStorage.getItem("almacen_start"));
                this.lista_locales.push(array_almacen);
        }


        ngAfterViewInit() {
                if (this.verificarTokenRpta(this.rutasMantenedores.FORM_COMPROBANTE)) {
                       
                        this.formFindCliente.obtenerClientes();
                        
                }
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
                this.limpiarCampos();
                this.getTotalLista();
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
                                        this.abrirDocumentoModalId(data._body,'mostrarPrincipalPDF');
                                        this.abrirModalPDfPorc("modalPrincipalPDF", 90);
                                }
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


        imprimirBlanco(id_comprobante) {
                
                if (this.tienePermisoPrintMsj(this.rutas.FORM_COMPROBANTE, this.rutas.BUTTON_IMPRIMIR)) {
                        this.reportePdfService.obtenerComprobanteBlancoPdf(id_comprobante)
                                .subscribe(
                                data => {
                                        if (data._body.size == 0) {
                                                this.mensajeInCorrecto("DOCUMENTO DIGITALIZADO NO ENCONTRADO - HA SIDO ELIMINADO ARCHIVO ADJUNTO");
                                        } else {
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



        imprimir(id_comprobante) {
                
                if (this.tienePermisoPrintMsj(this.rutas.FORM_COMPROBANTE, this.rutas.BUTTON_IMPRIMIR)) {
                        
                let id = this.lista_locales[0].id_local;
                        this.reportePdfService.obtenerComprobantePdf(id_comprobante,id)
                                .subscribe(
                                data => {
                                        if (data._body.size == 0) {
                                                this.mensajeInCorrecto("DOCUMENTO DIGITALIZADO NO ENCONTRADO - HA SIDO ELIMINADO ARCHIVO ADJUNTO");
                                        } else {
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


        imprimir_invertido(id_comprobante) {
                
                if (this.tienePermisoPrintMsj(this.rutas.FORM_COMPROBANTE, this.rutas.BUTTON_IMPRIMIR)) {
                        this.reportePdfService.obtenerComprobantePdf2(id_comprobante)
                                .subscribe(
                                data => {
                                        if (data._body.size == 0) {
                                                this.mensajeInCorrecto("DOCUMENTO DIGITALIZADO NO ENCONTRADO - HA SIDO ELIMINADO ARCHIVO ADJUNTO");
                                        } else {
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


        
        imprimirTicketera(id_comprobante) {
                
                if (this.tienePermisoPrintMsj(this.rutas.FORM_COMPROBANTE, this.rutas.BUTTON_IMPRIMIR)) {
                        
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
                                                }else{
                                                        this.abrirPDF(data._body);
                                                } 
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


        eliminar(bean) {


                if (this.tienePermisoPrintMsj(this.rutas.FORM_COMPROBANTE, this.rutas.BUTTON_ELIMINAR)) {

                        if( confirm("Realmente Desea Eliminar ?")){
                        let parametros = JSON.stringify({
                                comprobante:bean
                        });

                        this.comprobanteService.eliminarLogicoComprobante(parametros)
                                .subscribe(
                                data => {
                                        this.obtenerComprobantes();
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
                }
        }





        limpiarCampos() {
                this.idCompraVentaBusqueda=null;
                this.categoriaComprobanteSelected=null;
                this.tipoComprobanteSelected=null;
                this.numeroSelected=null;
                this.serieSelected=null;
                this.medioPagoSelected=null;
                this.fechaSelected=null;
                this.clienteSelected=null;
                this.idComprobanteSelected=null;
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
                this.comprobanteService.buscarPaginacion(inicio, fin, tamPagina, parametros)
                        .subscribe(
                        data => {
                                this.listaComprobantes = data;
                                this.print(data);
                        },
                        error => this.msj = <any>error);
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
                this.comprobanteService.getTotalParametros(parametros)
                        .subscribe(
                        data => {
                                this.totalLista = data;
                                this.print("total:" + data);
                        },
                        error => this.msj = <any>error);
        }



        /*********OBTENER DATOS DEL CLIENTE*********/

        abrirModalCliente() {
                this.abrirModal("modalClienteCom");
        }

        obtenerClienteDatosExternos(datos) {
                this.clienteSelected = datos.bean;
                this.print("datos Cliente");
                this.print(datos);
                this.cerrarModal("modalClienteCom");

        }


     
}