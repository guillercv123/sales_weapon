import { Component, AfterViewInit, ViewChild, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';

import { ControllerComponent } from '../../../core/controller/controller.component';




/******************IMPORTAR SERVICIOS*************** */


import { PagoService } from '../service/pago.service';
import { TipoMonedaService } from '../../mantenedores/service/tipo-moneda.service';
import { ReportePdfService } from '../../../core/service/reporte-pdf.Service';
import { FormCompraComponent } from '../../compras/controller/form-compra.component';



declare var $: any;
@Component({
        selector: 'form-pago',
        templateUrl: '../view/form-pago.component.html',
        providers: [PagoService,TipoMonedaService,ReportePdfService]

})

export class FormPagoComponent extends ControllerComponent implements AfterViewInit {


        
        id_venta: any;
        saldo: any;
        abono: any;
        fecha_pago: any;
        concepto:any;
        id_pago:any;
        listaPagos: any[];

        nombreSelected: any;
        unidadEmpresaSelected: any;
        idCargoSelected: any;
        tiposMoneda: any[];
        tipoMonedaSelected: any;
        simboloMonedaSelected: any;
        idTipoMonedaSelected: any;

        //************OBJETO ELEGIDO PARA EDITAR************
        beanSelected: any;

        //***********PANELES DE LOS MANTENEDORES***********

        panelEditarSelected: boolean = false;
        panelListaBeanSelected: boolean = true;


        buttonSelectedActivatedUniEmpre: boolean = true;


        //************OBJETOS QUE SE TRANSMITIRAN**********/
        @Output() cargoSeleccionado = new EventEmitter();
        @Input() buttonSelectedActivated = false


        //*******************OBTENER DATOS DEL FORMULARIO DE COMPRAS*/
        @ViewChild(FormCompraComponent,{static: false}) formCompra: FormCompraComponent;


        constructor(
                public http: Http,
                public router: Router,
                public pagoService: PagoService,
                public tipoMonedaService:TipoMonedaService,
                public reportePdfService: ReportePdfService
        ) {
                super(router);

                this.panelEditarSelected = false;
        }


        ngOnInit() {
                this.limpiarCampos();
        }

        ngAfterViewInit() {
                if (this.verificarTokenRpta(this.rutasMantenedores.FORM_PAGO)) {
                        this.obtenerCargos();
                        this.obtenerTipoMoneda();
                }
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



        abrirPanelBuscar() {
                this.panelEditarSelected = false;
                this.panelListaBeanSelected = true;

        }

        abrirPanelRegistrar() {
                this.panelEditarSelected = false;
                this.panelListaBeanSelected = true;
        }

        abrirPanelEditar(pro) {
                if (this.tienePermisoPrintMsj(this.rutas.FORM_PAGO, this.rutas.PANEL_EDITAR)) {

                        this.beanSelected = pro;
                        this.concepto = pro.concepto;
                        this.saldo=pro.saldo;
                        this.abono=pro.abono;
                        this.fecha_pago=pro.fecha_pago.substr(0,10);
                        this.id_venta=pro.id_venta;
                        this.tipoMonedaSelected=this.obtenerTipoMonedaActualId(pro.id_tipo_moneda);
                        this.panelEditarSelected = true;
                        this.panelListaBeanSelected = false;

                }
        }


        regresar() {
                this.limpiarCampos();
                this.panelEditarSelected = false;
                this.panelListaBeanSelected = true;
        }


        obtenerCargos() {
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
                        id_venta: this.id_venta,
                        saldo: this.saldo,
                        abono: this.abono,
                        fecha_pago: this.fecha_pago,
                        concepto:this.concepto,
                        id_tipo_moneda:this.tipoMonedaSelected==null?null:this.tipoMonedaSelected.id_tipo_moneda
                });

                this.pagoService.buscarPaginacion(inicio, fin, tamPagina, parametros)
                        .subscribe(
                        data => {
                                this.listaPagos = data;

                                this.print(data);
                        },
                        error => this.msj = <any>error);
        }


        registrar() {

                if (this.tienePermisoPrintMsj(this.rutas.FORM_PAGO, this.rutas.BUTTON_REGISTRAR)) {
                        let parametros = JSON.stringify({
                                id_venta: this.id_venta,
                                saldo: this.saldo,
                                abono: this.abono,
                                fecha_pago: this.fecha_pago,
                                concepto:this.concepto,
                                id_tipo_moneda:this.tipoMonedaSelected==null?null:this.tipoMonedaSelected.id_tipo_moneda
                        });
                        this.pagoService.registrar(parametros)
                                .subscribe(
                                data => {
                                        let rpta = data.rpta;
                                        this.print("rpta: " + rpta);
                                        if (rpta != null) {
                                                if (rpta == 1) {
                                                        this.id_pago=data.id_pago;
                                                        this.mensajeCorrecto("PAGO REGISTRADO");
                                                        this.limpiarCampos();
                                                } else {
                                                        this.mensajeInCorrecto("PAGO NO REGISTRADO");
                                                }
                                        }

                                        this.obtenerCargos();

                                },
                                error => this.msj = <any>error
                                );
                }
        }


        imprimir(id_pago) {
               this.abrirModalPDfPorc
               // if (this.tienePermisoPrintMsj(this.rutas.FORM_PAGO, this.rutas.BUTTON_IMPRIMIR)) {
                        this.reportePdfService.obtenerPagoPdf(id_pago)
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
                //}

        }


        buscar() {
                if (this.tienePermisoPrintMsj(this.rutas.FORM_PAGO, this.rutas.BUTTON_BUSCAR)) {
                        this.getTotalLista();
                        this.seleccionarByPagina(this.inicio, this.fin, this.tamPagina);
                }
        }



        getTotalLista() {
                /*this.productoService.getTotal()
                        .subscribe(
                        data => {
                                this.totalLista = data;
                                this.print(data);
                        },
                        error => this.msj = <any>error);*/
                let parametros = JSON.stringify({
                        id_venta: this.id_venta,
                        saldo: this.saldo,
                        abono: this.abono,
                        fecha_pago: this.fecha_pago,
                        concepto:this.concepto,
                        id_tipo_moneda:this.tipoMonedaSelected==null?null:this.tipoMonedaSelected.id_tipo_moneda
                });

                this.print("parametros total: " + parametros);
                this.pagoService.getTotalParametros(parametros)
                        .subscribe(
                        data => {
                                this.totalLista = data;
                                this.print("total:" + data);
                        },
                        error => this.msj = <any>error);
        }


        eliminar(bean) {

                this.print(bean);
                if (this.tienePermisoPrintMsj(this.rutas.FORM_PAGO, this.rutas.BUTTON_ELIMINAR)) {
                        if( confirm("Realmente Desea Eliminar ?")){
                        this.pagoService.eliminarLogico(bean.id_pago)
                                .subscribe(
                                data => {
                                        this.obtenerCargos();
                                        let rpta = data;
                                        if (rpta != null) {
                                                if (rpta == 1) {
                                                        this.mensajeCorrecto("PAGO ELIMINADO CORRECTAMENTE");
                                                } else {
                                                        this.mensajeInCorrecto("PAGO NO ELIMINADO");
                                                }

                                        }
                                },
                                error => this.msj = <any>error);
                        }
                }
        }




        editar() {
                if (this.tienePermisoPrintMsj(this.rutas.FORM_PAGO, this.rutas.BUTTON_ACTUALIZAR)) {
                        let parametros = JSON.stringify({
                                id_venta: this.id_venta,
                                saldo: this.saldo,
                                abono: this.abono,
                                fecha_pago: this.fecha_pago,
                                concepto:this.concepto,
                                id_tipo_moneda:this.tipoMonedaSelected==null?null:this.tipoMonedaSelected.id_tipo_moneda
       
                        });

                        this.print("parametros: " + parametros);
                        this.pagoService.editar(parametros, this.beanSelected.id_pago)
                                .subscribe(
                                data => {
                                        this.obtenerCargos();
                                        let rpta = data.rpta;
                                        this.print("rpta: " + rpta);
                                        if (rpta != null) {
                                                if (rpta == 1) {
                                                        this.mensajeCorrecto("PAGO MODIFICADO");
                                                } else {
                                                        this.mensajeInCorrecto("PAGO NO MOFICADO");
                                                }
                                        }

                                },
                                error => this.msj = <any>error
                                );
                }

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



        limpiarCampos() {
                this.nombreSelected = null;
                this.unidadEmpresaSelected = null;
                this.idCargoSelected = null;
                this.id_pago=null;
                this.concepto=null;
                this.id_venta= null;
                this.saldo= null;
                this.abono= null;
                this.fecha_pago= null;
                this.tipoMonedaSelected=null;
        }

        elegirFila(lista, i) {
                this.marcar(lista, i);
        }

        abrirModalUnidadEmpresa() {
                this.abrirModal("modalUnidadEmpresa");
        }

        obtenerUnidadEmpresaDatosExternos(datos) {
                this.unidadEmpresaSelected = datos.bean;
                this.print("datos Empresa");
                this.print(datos);
                this.cerrarModal("modalUnidadEmpresa");

        }

        seleccionar(bean) {
                this.cargoSeleccionado.emit({ bean: bean });
        }
}