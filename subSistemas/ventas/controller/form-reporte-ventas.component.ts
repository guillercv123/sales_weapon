import { Component, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';

import { ControllerComponent } from '../../../core/controller/controller.component';




/******************IMPORTAR SERVICIOS*************** */
import {VentaService} from './../service/venta.service';

import { ReporteExcelService } from '../../../core/service/reporte-excel.Service';

import { ReportePdfService } from '../../../core/service/reporte-pdf.Service';

import {SendEmailService} from '../../../core/service/sendEmail.service';
import { FormFindClienteComponent } from '../../mantenedores/controller/cliente/form-find-cliente.component';


declare var $: any;
@Component({
        selector: 'form-reporte-ventas',
        templateUrl: '../view/form-reporte-ventas.component.html',
        providers: [SendEmailService,VentaService,ReporteExcelService,ReportePdfService]

})

export class FormReporteVentasComponent extends ControllerComponent implements AfterViewInit {

        listaVentas:any[];

        idMarcaSelected: number;
        nombreSelected: string;
        observacionSelected: string;
        ordenPresentacionSelected: string;

        dateClient:string;
        AsuntoSelected:string;
        SendEmail:string;
        message:string;
        clienteSelected:any;

        //************OBJETO ELEGIDO PARA EDITAR************
        beanSelected: any;
        montoTotalSelected:number = 0;
        Loading:boolean=false;
        pro:any;
        id_comprobante:any;
        venta:any[];
        ventaSelected:any[];
        listaProductosDetalle:any[];
        detalle:any[];
        fechaInicioSelected:any;
        fechaFinSelected:any;
        buttonSelected: boolean=false;

        //***********PANELES DE LOS MANTENEDORES***********

        @ViewChild(FormFindClienteComponent,{static: true}) formFindCliente: FormFindClienteComponent;

        panelEditarSelected: boolean = false;
        panelListaBeanSelected: boolean = true;
        lista_locales:any[];

        constructor(
                public http: Http,
                public router: Router,
                public ventaService:VentaService,
                public reportePdfService: ReportePdfService,
                public reporteExcelService: ReporteExcelService,
                public sendEmailService:SendEmailService
        ) {
                super(router,reportePdfService,reporteExcelService);
                
                this.panelEditarSelected = false;
        }

        ngOnInit() {
                this.limpiarCampos();
                this.lista_locales =  new Array();
                let array_almacen = JSON.parse(localStorage.getItem("almacen_start"));
                this.lista_locales.push(array_almacen);
                this.formFindCliente.buttonSelectedActivated=true;
        }
        ngAfterViewInit() {
                if (this.verificarTokenRpta(this.rutasMantenedores.FORM_REPORTE_VENTA)) {
                       this.obtenerVentasPagadas();
                }
        }


        listaObjeto(ob){
            this.pro =ob.id_venta;
            this.venta = ob;
            this.id_comprobante = ob.id_comprobante;
        }

        imprimirComprobanteTicketera(){

                if (this.tienePermisoPrintMsj(this.rutas.FORM_COMPROBANTE, this.rutas.BUTTON_IMPRIMIR)) {
                        let id = this.lista_locales[0].id_local;
                        this.reportePdfService.obtenerComprobantePdTicketera(this.id_comprobante,id)
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

        imprimirComprobante() {

                if (this.tienePermisoPrintMsj(this.rutas.FORM_COMPROBANTE, this.rutas.BUTTON_IMPRIMIR)) {
                        let id = this.lista_locales[0].id_local;
        
                        this.reportePdfService.obtenerComprobantePdf(this.id_comprobante,id)
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
        

        
        
        buscarVenta() {
            if (this.tienePermisoPrintMsj(this.rutas.FORM_VENTA, this.rutas.BUTTON_VER_DETALLE)) {
                  
                    this.abrirModal("modalDetalleVenta");
                    this.print(this.pro);
                    this.ventaService.getVentaById(this.pro)
                            .subscribe(
                                    data => {
                                            this.listaProductosDetalle = data.detalle_venta;
                                            this.ventaSelected = data.venta;
                                           
                                    },
                                    error => this.msj = <any>error);
            }
    }

  



        obtenerVentasPagadas() {
                this.limpiarCampos();
                this.getTotalLista();
                //this.seleccionarByPagina(this.inicio, this.fin, this.tamPagina);
        }





        limpiar() {
                this.limpiarCampos();
                this.inicio = 1;
                this.fin = 50;
                this.tamPagina = 50;
                this.totalLista = null;
                this.getTotalLista();
                //this.seleccionarByPagina(this.inicio, this.fin, this.tamPagina);
        }


        EnviarEmail(){
                this.abrirModal("modalSendEmail");
        }

        enviar(){
                let parametros = JSON.stringify({
                        userEmail: this.SendEmail,
                        nombres:this.dateClient,
                        asunto:this.AsuntoSelected,
                        mensaje:this.message
                });

          this.sendEmailService.SendEmail(parametros)
                                .subscribe(
                                data => {
                                        this.print(data);
                                        let rpta = data;
                                        if (rpta != null) {
                                                if (rpta == 1) {
                                                        this.mensajeCorrecto("MENSAJE ENVIADO");
                                                } else {
                                                        this.mensajeInCorrecto("MENSAJE NO ELIMINADO");
                                                }

                                        }

                                },
                                error => this.msj = <any>error
                                );
                
        }

        abrirModalCliente() {
                this.abrirModal("modalCliente");
        }
        obtenerClienteDatosExternos(datos) {
                this.clienteSelected = datos.bean;
                this.print("datos Cliente");
                this.print(datos);
                this.cerrarModal("modalCliente");

        }

                

        seleccionarByPagina(inicio: any, fin: any, tamPagina: any) {
                let parametros = JSON.stringify({
                      fecha_inicio:this.fechaInicioSelected,
                      fecha_fin:this.fechaFinSelected,
                      id_cliente: this.clienteSelected == null ? null : this.clienteSelected.id_cliente,
                       
                });
                let id = this.lista_locales[0].id_local;               
                 
                this.ventaService.buscarVentasPagadas(inicio, fin, tamPagina, parametros,id)
                         .subscribe(
                         data => {
                             if(!data){
                                this.mensajeAdvertencia("No existen datos");
                             }else{
                                this.montoTotalSelected = 0;
                                  this.listaVentas = data;
                                  for (let i = 0; i < this.listaVentas.length; i++) {
                                          this.montoTotalSelected = this.round2(this.montoTotalSelected + this.listaVentas[i].monto_total);
                                  }
                                  this.Loading = false;
                             }
                                

                         },
                error => this.msj = <any>error);
        }

        buscar() {
                if (this.tienePermisoPrintMsj(this.rutas.FORM_MARCA, this.rutas.BUTTON_BUSCAR)) {
                        this.listaVentas =null;
                        this.totalLista = null;
                        this.Loading = true;
                        this.getTotalLista();
                        this.seleccionarByPagina(this.inicio, this.fin, this.tamPagina);
                }
        }



        getTotalLista() {
              
                let parametros = JSON.stringify({
                    fecha_inicio:this.fechaInicioSelected,
                    fecha_fin:this.fechaFinSelected
                });

                 this.ventaService.getTotalVentasPagadas(parametros)
                         .subscribe(
                         data => {
                                 this.totalLista = data;
                         },
                         error => this.msj = <any>error);
        }




        /*****************EXPORTACION DE EXCEL**************/
        exportarExcelDetalle(){
                this.completado = true;
                let ventasAux = this.listaVentas;
                        this.eliminarColumna(ventasAux,
                        ["is_editable","id_venta","estado_descripcion","sub_total","igv","monto_total","fecha","id_producto","codigo_tipo_comprobante","simbolo_tipo_moneda","observacion","nombre_medio_pago","codigo_tipo_documento_cliente","is_pagada","dias_credito","nombre_tipo_persona_cliente", "nombres_empleado", "apellido_paterno_empleado", "apellido_materno_empleado", "nombre_empleado_eliminado", "correo_cliente", "telefono_cliente", "direccion_cliente", "numero_documento_cliente", "nombre_tipo_documento_cliente", "apellido_materno_cliente", "apellido_paterno_cliente", "porc_igv", "nombre_tipo_moneda", "estado", "id_comprobante", "nro_comprobante", "id_cliente", "id_empleado", "id_tipo_moneda", "lista_productos", "id_almacen", "nro_documento", ""]);
                this.limpiarCampos();
                let parametros = JSON.stringify({
                        datos: ventasAux,
                        titulo: 'VENTAS',
                        subtitulo: 'VENTAS EN BASE DE DATOS'
                });
                this.exportarExcelFinal(parametros, "Reporte de ventas - generado el ");
                

        }




        limpiarCampos() {
        
            this.fechaFinSelected = null;
            this.fechaInicioSelected= null;
            this.montoTotalSelected = 0;
            this.listaVentas = null;
            this.clienteSelected = null;
           // this.seleccionarByPagina(this.inicio, this.fin, this.tamPagina);
            
        }

        




       
}