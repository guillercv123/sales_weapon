import { Component, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';

import { ControllerComponent } from '../../../core/controller/controller.component';




/******************IMPORTAR SERVICIOS*************** */



import { SunatTablaService } from '../service/sunat-tabla.service';
import { LibroCompraService } from '../service/libro-compra.service';
import { ReporteExcelService } from '../../../core/service/reporte-excel.Service';
import { FormFindCompraComponent } from '../../compras/controller/compra/form-find-compra.component';
import { TipoCambioService } from '../../mantenedores/service/tipo-cambio.service';
import { TipoMonedaService } from '../../mantenedores/service/tipo-moneda.service';
import { PagoService } from '../../ventas/service/pago.service';
import { LetraService } from '../../contabilidad/service/letra.service';
import { CompraService } from '../../compras/service/compra.service';
import { FormFindVentaComponent } from '../../ventas/controller/venta/form-find-venta.component';

declare var $: any;
@Component({
        selector: 'form-cuenta-cobrar-pagar',
        templateUrl: '../view/form-cuenta-cobrar-pagar.component.html',
        providers: [LetraService, PagoService, TipoMonedaService, TipoCambioService, SunatTablaService, LibroCompraService, ReporteExcelService]

})

export class FormCuentaCobrarPagarComponent extends ControllerComponent implements AfterViewInit {

        @ViewChild(FormFindCompraComponent,{static: false}) formFindCompra: FormFindCompraComponent;
        panelAmortizacion: boolean = false;
        listaComprasAmortizar: any;
        compraAmortizar: any;
        tiposMoneda: any[];
        tipoMonedaSelected: any;


        @ViewChild(FormFindVentaComponent,{static: false}) formFindVenta: FormFindVentaComponent;
        //panelAmortizacion: boolean = false;
        listaVentasAmortizar: any;
        ventaAmortizar: any;
        //tiposMoneda: any[];
        //tipoMonedaSelected: any;



        fecha: any;
        importe: any;
        tipo_cambio: any;
        tipo_moneda: any;
        cuenta_banco: any;
        cheque: any;
        nro_operacion: any;
        observacion: any;
        nro_letras: any;
        tipo_moneda_letra: any;
        lista_pagos: any[];




        nro_letra: any;
        nro_letra_unico: any;
        fecha_letra: any;
        nro_dias_letra: any;
        tipo_letra: any;
        banco_letra: any;
        importe_letra: any;
        importe_restante_letra: any;

        lista_pagos_letras: any[];

        constructor(
                public http: Http,
                public router: Router,
                public sunatTablaService: SunatTablaService,
                public libroCompraService: LibroCompraService,
                public reporteExcelService: ReporteExcelService,
                public tipoCambioService: TipoCambioService,
                public tipoMonedaService: TipoMonedaService,
                public pagoService: PagoService,
                public letraService: LetraService
        ) {
                super(router);
                //this.panelEditarSelected = false;

        }

        ngOnInit() {
                /*this.lista_detalle_libro = new Array();
                this.obtenerSunatTabla(2);
                this.obtenerSunatTabla(10);
                this.obtenerSunatTabla(11);
                */
                // this.formFindCompra.buttonSelected=true;
                this.lista_pagos = new Array();
        }


        ngAfterViewInit() {
                //this.obtenerLibrosCompras();
                let parametros = JSON.stringify({
                        medio_pago: 'CREDITO',
                });
                this.formFindCompra.buscarParametros(parametros);
                this.formFindCompra.formFindProveedor.buttonSelected = true;
                this.formFindCompra.mostrarTiposComprobanteCompra();
                this.formFindCompra.obtenerLocales();
                //this.formFindCompra.obtenerMediosPago();
                this.formFindCompra.obtenerMediosPagoByNombre('CREDITO');
                this.formFindCompra.buttonSelected = true;
                this.formFindCompra.obtenerTipoMoneda();
                this.obtenerTipoCambioActual();
                this.fecha = this.obtenerFechaActual();
                this.fecha_letra = this.obtenerFechaActual();
                this.obtenerTipoMoneda();



                this.formFindVenta.buscarParametros(parametros);
                //this.formFindVenta.formFindProveedor.buttonSelected=true;
                //this.formFindVenta.mostrarTiposComprobanteCompra();
                this.formFindVenta.obtenerLocales();

                this.formFindVenta.obtenerMediosPagoByNombre('CREDITO');
                this.formFindVenta.buttonSelected = true;
                //this.formFindVenta.obtenerTipoMoneda();
                //this.obtenerTipoCambioActual();
                //this.fecha=this.obtenerFechaActual();
                //this.fecha_letra=this.obtenerFechaActual();
                //this.obtenerTipoMoneda();

        }


        registrar() {

                let parametros = JSON.stringify({
                        lista_pagos: this.lista_pagos
                });
                this.pagoService.registrarMultiples(parametros)
                        .subscribe(
                                data => {
                                        let rpta = data.rpta;
                                        this.print("rpta: " + rpta);
                                        if (rpta != null) {
                                                if (rpta == 1) {
                                                        this.mensajeCorrectoSinCerrar("PAGO(S) REGISTRADO(S) CORRECTAMENTE");
                                                } else {
                                                        this.mensajeInCorrecto("PAGO(S) NO REGISTRADO(S) CORRECTAMENTE");

                                                }
                                        }

                                },
                                error => this.msj = <any>error
                        );

        }


        registrarLetras() {

                let parametros = JSON.stringify({
                        lista_pagos_letras: this.lista_pagos_letras
                });
                this.letraService.registrarMultiples(parametros)
                        .subscribe(
                                data => {
                                        let rpta = data.rpta;
                                        this.print("rpta: " + rpta);
                                        if (rpta != null) {
                                                if (rpta == 1) {
                                                        this.mensajeCorrectoSinCerrar("LETRA(S) REGISTRADO(S) CORRECTAMENTE");
                                                } else {
                                                        this.mensajeInCorrecto("LETRA(S) NO REGISTRADO(S) CORRECTAMENTE");

                                                }
                                                this.regresar();
                                        }

                                },
                                error => this.msj = <any>error
                        );

        }



        eliminarItem(i) {
                this.print("INDICE A ELIMINAR: " + i);
                this.lista_pagos.splice(i, 1);
                let total_amortizado = this.sumarTotalAmortizacion();
                this.compraAmortizar.saldo = this.compraAmortizar.monto_total - total_amortizado;
        }

        eliminarItemLetra(i) {
                this.print("INDICE A ELIMINAR: " + i);
                this.lista_pagos_letras.splice(i, 1);
                let total_amortizado = this.sumarTotalAmortizacion();
                this.compraAmortizar.saldo = this.compraAmortizar.monto_total - total_amortizado;
                this.autodividirImporte();
        }

        obtenerTipoMoneda() {

                this.tipoMonedaService.getAll()
                        .subscribe(
                                data => {//this.vistas = data;

                                        this.tiposMoneda = data;
                                        if (this.tiposMoneda != null) {
                                                if (this.tiposMoneda.length > 0) {
                                                        this.tipo_moneda_letra = this.tiposMoneda[0];
                                                }
                                        }

                                },
                                error => this.msj = <any>error);
        }


        obtenerTipoCambioActual() {
                let fecha_actual = this.obtenerFechaActual();
                let para = JSON.stringify({
                        id_tipo_cambio: null,
                        fecha: fecha_actual,
                        precio_compra: null,
                        precio_venta: null
                });

                this.tipoCambioService.buscarPaginacion(1, 1, 10, para)
                        .subscribe(
                                data => {
                                        let listaTipoCambio = data;
                                        if (!this.isArrayVacio(listaTipoCambio)) {
                                                this.tipo_cambio = listaTipoCambio[0].precio_venta;
                                        }

                                },
                                error => this.msj = <any>error);
        }

        agregar() {

                if (this.ventaAmortizar != null) {

                        this.lista_pagos.push(
                                {
                                        fecha: this.fecha,
                                        importe: this.importe,
                                        tipo_cambio: this.tipo_cambio,
                                        tipo_moneda: this.tipo_moneda,
                                        cuenta_banco: this.cuenta_banco,
                                        cheque: this.cheque,
                                        nro_operacion: this.nro_operacion,
                                        observacion: this.observacion,
                                        abono: this.importe,
                                        concepto: 'FACTURA',
                                        tipo_pago: 'AMORTIZACION',
                                        id_compra_venta: this.ventaAmortizar.id_venta,
                                        tipo_compra_venta: 'VENTA'
                                }

                        );

                        let total_amortizado = this.sumarTotalAmortizacion();
                        this.ventaAmortizar.saldo = this.ventaAmortizar.monto_total - total_amortizado;

                } else {

                        this.lista_pagos.push(
                                {
                                        fecha: this.fecha,
                                        importe: this.importe,
                                        tipo_cambio: this.tipo_cambio,
                                        tipo_moneda: this.tipo_moneda,
                                        cuenta_banco: this.cuenta_banco,
                                        cheque: this.cheque,
                                        nro_operacion: this.nro_operacion,
                                        observacion: this.observacion,
                                        abono: this.importe,
                                        concepto: 'FACTURA',
                                        tipo_pago: 'AMORTIZACION',
                                        id_compra_venta: this.compraAmortizar.id_compra,
                                        tipo_compra_venta: 'COMPRA'
                                }

                        );

                        let total_amortizado = this.sumarTotalAmortizacion();
                        this.compraAmortizar.saldo = this.compraAmortizar.monto_total - total_amortizado;

                }
                this.cerrarModal("modalAmortizacion");
        }

        sumarTotalAmortizacion() {
                let total_amortizado = 0;
                for (let i = 0; i < this.lista_pagos.length; i++) {
                        total_amortizado += this.lista_pagos[i].importe;
                }

                return total_amortizado;
        }


        cambiarTipoMoneda() {
                for (let i = 0; i < this.lista_pagos_letras.length; i++) {
                        this.lista_pagos_letras[i].id_tipo_moneda = this.tipo_moneda_letra.id_tipo_moneda;
                        this.lista_pagos_letras[i].tipo_moneda = this.tipo_moneda_letra.nombre;
                }
        }


        abrirModalAmortizacion() {
                this.abrirModal("modalAmortizacion");


                if (this.ventaAmortizar != null) {
                        this.importe = this.ventaAmortizar.monto_total;
                } else {
                        this.importe = this.compraAmortizar.monto_total;
                }
        }

        abrirModalNroLetras() {
                this.abrirModalPorc("modalNroLetras", 30);
                
                if(this.ventaAmortizar!=null){
                        this.importe = this.ventaAmortizar.monto_total;
                }else{
                        this.importe = this.compraAmortizar.monto_total;
                }
                
        }




        regresar() {

                if (this.ventaAmortizar != null) {
                        this.panelAmortizacion = false;
                        this.listaComprasAmortizar = null;
                        this.compraAmortizar = null;
                        this.lista_pagos = new Array();
                        this.lista_pagos_letras = new Array();
                        $("#panel-ventas").show();
                        $("#panel-ventas-amortizacion").hide();
                        $("#panel-ventas-letras").hide();
                } else {

                        this.panelAmortizacion = false;
                        this.listaComprasAmortizar = null;
                        this.compraAmortizar = null;
                        this.lista_pagos = new Array();
                        this.lista_pagos_letras = new Array();
                        $("#panel-compras").show();
                        $("#panel-amortizacion").hide();
                        $("#panel-letras").hide();
                }

        }



        seleccionMultipleAction(datos) {
                this.ventaAmortizar=null;
                this.listaVentasAmortizar= new Array();
                

                this.print("DATOS EXTERNOS: ");
                this.print(datos);
                this.panelAmortizacion = true;
                this.listaComprasAmortizar = datos.bean;

                if (this.listaComprasAmortizar != null) {
                        if (this.listaComprasAmortizar.length > 0) {
                                this.compraAmortizar = this.listaComprasAmortizar[0];
                        }
                }

                if (this.compraAmortizar.saldo > 0) {
                        $("#panel-compras").hide();
                        $("#panel-amortizacion").show();
                        $("#panel-letras").hide();
                } else {
                        this.mensajeInCorrecto("COMPRA NO PRESENTA DEUDA");
                }

        }



        cajearVariasFacturas(datos) {
                this.ventaAmortizar=null;
                this.listaVentasAmortizar= new Array();

                
                this.print("DATOS EXTERNOS VARIAS LETRAS: ");
                this.print(datos);
                this.panelAmortizacion = true;
                this.listaComprasAmortizar = datos.bean;

                if (this.listaComprasAmortizar != null) {
                        if (this.listaComprasAmortizar.length > 0) {
                                this.compraAmortizar = this.listaComprasAmortizar[0];
                        }
                }

                if (this.compraAmortizar.saldo > 0) {
                        $("#panel-compras").hide();
                        $("#panel-amortizacion").hide();
                        $("#panel-letras").show();

                } else {
                        this.mensajeInCorrecto("COMPRA NO PRESENTA DEUDA");
                }

                this.abrirModalNroLetras();

        }

        aceptar() {
                if (this.ventaAmortizar != null) {

                        this.cerrarModal("modalNroLetras");
                        this.lista_pagos_letras = new Array();

                        let ids_compras_ventas = "";

                        for (let j = 0; j < this.listaVentasAmortizar.length; j++) {
                                ids_compras_ventas += "" + this.listaVentasAmortizar[j].id_venta + ",";
                        }

                        ids_compras_ventas = ids_compras_ventas.substr(0, ids_compras_ventas.length - 1);

                        for (let i = 0; i < this.nro_letras; i++) {

                                this.lista_pagos_letras.push(
                                        {
                                                nro_letra: null,
                                                nro_letra_unico: null,
                                                fecha_letra: this.obtenerFechaActual(),
                                                fecha_vencimiento: this.obtenerFechaActual(),
                                                nro_dias_letra: 0,
                                                tipo_letra: null,
                                                banco_letra: null,
                                                importe_letra: this.round2(this.importe / this.nro_letras),
                                                id_compra_venta: this.listaVentasAmortizar.length == 1 ? this.ventaAmortizar.id_venta : null,
                                                tipo_compra_venta: 'VENTA',
                                                id_tipo_moneda: this.tipo_moneda_letra.id_tipo_moneda,
                                                tipo_moneda: this.tipo_moneda_letra.nombre,
                                                id_proveedor: this.ventaAmortizar.id_cliente,
                                                proveedor: this.ventaAmortizar.nombres_cliente,
                                                ruc_proveedor: this.ventaAmortizar.numero_documento_cliente,
                                                ids_compras_ventas: ids_compras_ventas
                                        }

                                );

                        }

                } else {
                        this.cerrarModal("modalNroLetras");
                        this.lista_pagos_letras = new Array();

                        let ids_compras_ventas = "";

                        for (let j = 0; j < this.listaComprasAmortizar.length; j++) {
                                ids_compras_ventas += "" + this.listaComprasAmortizar[j].id_compra + ",";
                        }

                        ids_compras_ventas = ids_compras_ventas.substr(0, ids_compras_ventas.length - 1);

                        for (let i = 0; i < this.nro_letras; i++) {

                                this.lista_pagos_letras.push(
                                        {
                                                nro_letra: null,
                                                nro_letra_unico: null,
                                                fecha_letra: this.obtenerFechaActual(),
                                                fecha_vencimiento: this.obtenerFechaActual(),
                                                nro_dias_letra: 0,
                                                tipo_letra: null,
                                                banco_letra: null,
                                                importe_letra: this.round2(this.importe / this.nro_letras),
                                                id_compra_venta: this.listaComprasAmortizar.length == 1 ? this.compraAmortizar.id_compra : null,
                                                tipo_compra_venta: 'COMPRA',
                                                id_tipo_moneda: this.tipo_moneda_letra.id_tipo_moneda,
                                                tipo_moneda: this.tipo_moneda_letra.nombre,
                                                id_proveedor: this.compraAmortizar.id_proveedor,
                                                proveedor: this.compraAmortizar.nombres_proveedor,
                                                ruc_proveedor: this.compraAmortizar.ruc_proveedor,
                                                ids_compras_ventas: ids_compras_ventas
                                        }

                                );

                        }
                }

        }

        autodividirImporte() {
                for (let i = 0; i < this.lista_pagos_letras.length; i++) {
                        this.lista_pagos_letras[i].importe_letra = this.round2(this.importe / this.lista_pagos_letras.length);
                }

        }


        calcularFechaVencimiento(obj, i) {
                let fecha = new Date(this.lista_pagos_letras[i].fecha_letra);
                this.print("fecha: " + fecha);
                fecha.setDate(fecha.getDate() + this.lista_pagos_letras[i].nro_dias_letra + 1);
                this.lista_pagos_letras[i].fecha_vencimiento = this.convertirFechaMysql(fecha);
                this.print("fecha despues: " + fecha);

        }



        //*******************OBTENER VENTAS PARA LETRAS********************
        seleccionMultipleVentaAction(datos) {

                this.compraAmortizar=null;
                this.listaComprasAmortizar= new Array();

                this.print("DATOS EXTERNOS: ");
                this.print(datos);
                this.panelAmortizacion = true;
                this.listaVentasAmortizar = datos.bean;

                if (this.listaVentasAmortizar != null) {
                        if (this.listaVentasAmortizar.length > 0) {
                                this.ventaAmortizar = this.listaVentasAmortizar[0];
                        }
                }

                this.print("SALDO VENTA: ");
                this.print(this.ventaAmortizar.saldo);
                if (this.ventaAmortizar.saldo > 0) {
                        $("#panel-ventas").hide();
                        $("#panel-ventas-amortizacion").show();
                        $("#panel-ventas-letras").hide();
                } else {
                        this.mensajeInCorrecto("VENTA NO PRESENTA DEUDA");
                }

        }



        cajearVariasFacturasVenta(datos) {

                this.compraAmortizar=null;
                this.listaComprasAmortizar= new Array();

                this.print("DATOS EXTERNOS VARIAS LETRAS: ");
                this.print(datos);
                this.panelAmortizacion = true;
                this.listaVentasAmortizar = datos.bean;

                if (this.listaVentasAmortizar != null) {
                        if (this.listaVentasAmortizar.length > 0) {
                                this.ventaAmortizar = this.listaVentasAmortizar[0];
                        }
                }

                if (this.ventaAmortizar.saldo > 0) {
                        $("#panel-ventas").hide();
                        $("#panel-ventas-amortizacion").hide();
                        $("#panel-ventas-letras").show();

                } else {
                        this.mensajeInCorrecto("VENTA NO PRESENTA DEUDA");
                }

                this.abrirModalNroLetras();

        }

        aceptarVenta() {
                this.cerrarModal("modalNroLetras");
                this.lista_pagos_letras = new Array();

                let ids_compras_ventas = "";

                for (let j = 0; j < this.listaComprasAmortizar.length; j++) {
                        ids_compras_ventas += "" + this.listaComprasAmortizar[j].id_compra + ",";
                }

                ids_compras_ventas = ids_compras_ventas.substr(0, ids_compras_ventas.length - 1);

                for (let i = 0; i < this.nro_letras; i++) {

                        this.lista_pagos_letras.push(
                                {
                                        nro_letra: null,
                                        nro_letra_unico: null,
                                        fecha_letra: this.obtenerFechaActual(),
                                        fecha_vencimiento: this.obtenerFechaActual(),
                                        nro_dias_letra: 0,
                                        tipo_letra: null,
                                        banco_letra: null,
                                        importe_letra: this.round2(this.importe / this.nro_letras),
                                        id_compra_venta: this.listaComprasAmortizar.length == 1 ? this.compraAmortizar.id_compra : null,
                                        tipo_compra_venta: 'COMPRA',
                                        id_tipo_moneda: this.tipo_moneda_letra.id_tipo_moneda,
                                        tipo_moneda: this.tipo_moneda_letra.nombre,
                                        id_proveedor: this.compraAmortizar.id_proveedor,
                                        proveedor: this.compraAmortizar.nombres_proveedor,
                                        ruc_proveedor: this.compraAmortizar.ruc_proveedor,
                                        ids_compras_ventas: ids_compras_ventas
                                }

                        );

                }

        }
}