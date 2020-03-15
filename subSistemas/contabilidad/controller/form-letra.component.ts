import { Component, AfterViewInit, ViewChild, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';

import { ControllerComponent } from '../../../core/controller/controller.component';




/******************IMPORTAR SERVICIOS*************** */


import { LetraService } from '../service/letra.service';
import { TipoCambioService } from '../../mantenedores/service/tipo-cambio.service';
import { TipoMonedaService } from '../../mantenedores/service/tipo-moneda.service';
import { PagoService } from '../../ventas/service/pago.service';


declare var $: any;
@Component({
        selector: 'form-letra',
        templateUrl: '../view/form-letra.component.html',
        providers: [PagoService,TipoCambioService,TipoMonedaService,LetraService]

})

export class FormLetraComponent extends ControllerComponent implements AfterViewInit {


       
        tiposMoneda: any[];
        letras: any[];
        lista_pagos: any[];
        letraAmortizar: any;
        importe:any;
      //  num_doc:number;
        num_docSelect:number
        fecha: any;
        tipo_cambio: any;
        tipo_moneda: any;
        cuenta_banco: any;
        cheque: any;
        nro_operacion: any;
        observacion: any;
        nro_letras:any;
        tipo_moneda_letra:any;
        NumeroNotificaciones:number = 0;
        CadenaPreMessage:string = "";
        letraPagar:any[];

        constructor(
                public http: Http,
                public router: Router,
                public letraService: LetraService,
                public tipoCambioService: TipoCambioService,
                public tipoMonedaService: TipoMonedaService,
                public pagoService: PagoService,
        ) {
                super(router);

            
        }
      

        ngOnInit() {
                this.limpiarCampos();
                let day_letra = JSON.parse(localStorage.getItem("dias_letra"));
                
                this.letraPagar.push(day_letra);
        }

        ngAfterViewInit() {
                if (this.verificarTokenRpta(this.rutasMantenedores.FORM_CARGO)) {
                        this.obtenerLetras();

                        this.obtenerTipoCambioActual();
                        this.fecha=this.obtenerFechaActual();
                        this.obtenerTipoMoneda();
                }
        }

   

        obtenerTipoCambioActual() {
                let fecha_actual = this.obtenerFechaActual();
                let para = JSON.stringify({
                        id_tipo_cambio: null,
                        num_doc: fecha_actual,
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


        obtenerTipoMoneda() {

                this.tipoMonedaService.getAll()
                        .subscribe(
                                data => {//this.vistas = data;

                                        this.tiposMoneda = data;
                                        if(this.tiposMoneda!=null){
                                                if(this.tiposMoneda.length>0){
                                                        this.tipo_moneda_letra=this.tiposMoneda[0];
                                                }
                                        }
                                        
                                },
                                error => this.msj = <any>error);
        }


        limpiarCampos(){
                this.lista_pagos= new Array();
                this.num_docSelect= null;

        }





        obtenerLetras() {
                this.getTotalLista();
                this.limpiarCampos();
                this.seleccionarByPagina(this.inicio, this.fin, this.tamPagina);
        }



        amortizar(obj){

                this.letraAmortizar=obj;

                if(this.letraAmortizar.saldo>0){
                        $("#panel-amortizacion").show();
                        $("#panel-letras").hide();
                }else{
                        this.mensajeInCorrecto("LETRA NO PRESENTA DEUDA");
                }
        }

        regresar() {
                this.letraAmortizar = null;
                this.lista_pagos=new Array();
                $("#panel-amortizacion").hide();
                $("#panel-letras").show();
        }

        abrirModalAmortizacion() {
                this.abrirModal("modalAmortizacion");
                this.importe=this.letraAmortizar.importe;
        }


        registrar() {

                let parametros = JSON.stringify({
                        lista_pagos:this.lista_pagos,
                        is_pago_letra:true
                });
                this.pagoService.registrarMultiples(parametros)
                        .subscribe(
                        data => {
                                let rpta = data.rpta;
                                this.print("rpta: " + rpta);
                                if (rpta != null) {
                                        if (rpta == 1) {
                                                this.mensajeCorrectoSinCerrar("PAGO(S) REGISTRADO(S) CORRECTAMENTE");
                                            //    this.CalcularDias();


                                        } else {
                                                this.mensajeInCorrecto("PAGO(S) NO REGISTRADO(S) CORRECTAMENTE");

                                        }
                                        this.regresar();
                                }

                        },
                        error => this.msj = <any>error
                        );
        
}



        agregar() {
               
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
                                abono:this.importe,
                                concepto:'LETRA',
                                tipo_pago:'AMORTIZACION',
                                id_compra_venta:this.letraAmortizar.id_compra,
                                tipo_compra_venta:'COMPRA',
                                id_letra:this.letraAmortizar.id_letra
                        }

                );

                let total_amortizado=this.sumarTotalAmortizacion();
                this.letraAmortizar.saldo=this.letraAmortizar.importe-total_amortizado;
               
                this.cerrarModal("modalAmortizacion");
        }

        sumarTotalAmortizacion(){
                let total_amortizado=0;
                for(let i=0; i< this.lista_pagos.length;i++){
                        total_amortizado += this.lista_pagos[i].importe;
                }

                return total_amortizado;
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
                        num_doc:this.num_docSelect
                });

                this.letraService.buscarPaginacion(inicio, fin, tamPagina, parametros)
                        .subscribe(
                        data => {
                                this.letras = data;

                                this.print(data);
                        },
                        error => this.msj = <any>error);
        }




        buscar() {
                if (this.tienePermisoPrintMsj(this.rutas.FORM_CARGO, this.rutas.BUTTON_BUSCAR)) {
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
                     
                });

                this.print("parametros total: " + parametros);
                this.letraService.getTotalParametros(parametros)
                        .subscribe(
                        data => {
                                this.totalLista = data;
                                this.print("total:" + data);
                        },
                        error => this.msj = <any>error);
        }


        eliminar(bean) {

                if (this.tienePermisoPrintMsj(this.rutas.FORM_CARGO, this.rutas.BUTTON_ELIMINAR)) {
                        if( confirm("Realmente Desea Eliminar ?")){
                        this.letraService.eliminarLogico(bean.id_aplicacion)
                                .subscribe(
                                data => {
                                        this.obtenerLetras();
                                        let rpta = data;
                                        if (rpta != null) {
                                                if (rpta == 1) {
                                                        this.mensajeCorrecto("APLICACION ELIMINADO CORRECTAMENTE");
                                                } else {
                                                        this.mensajeInCorrecto("APLICACION NO ELIMINADO");
                                                }

                                        }
                                },
                                error => this.msj = <any>error);
                        }
                }
        }





        elegirFila(lista, i) {
                this.marcar(lista, i);
        }

        abrirModalUnidadEmpresa() {
                this.abrirModal("modalUnidadEmpresa");
        }

}