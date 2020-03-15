import { Component, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';

import { ControllerComponent } from '../../../core/controller/controller.component';

import { FormFindCajaComponent } from './caja/form-find-caja.component';
import { FormNewComprobanteComponent } from './comprobante/form-new-comprobante.component';




/******************IMPORTAR SERVICIOS*************** */


declare var $: any;
@Component({
        selector: 'form-caja',
        templateUrl: '../view/form-caja.component.html',
        providers: []

})

export class FormCajaComponent extends ControllerComponent implements AfterViewInit {


        @ViewChild(FormFindCajaComponent,{static: false}) formFindCaja: FormFindCajaComponent;
        @ViewChild(FormNewComprobanteComponent,{static: false}) formNewComprobante: FormNewComprobanteComponent;
        
        constructor( public http: Http, public router: Router) {
                super(router);
        }

        ngOnInit() {
               
        }


        ngAfterViewInit() {
                if (this.verificarTokenRpta(this.rutasMantenedores.FORM_CAJA)) {
                        this.formNewComprobante.obtenerCategoriasComprobanteVenta();
                        this.formNewComprobante.obtenerMediosPago();
                }
        }

        // editarVentaAction(data) {
        //         this.print("bean:");
        //         this.print(data);

        //         //this.panelEditarSelected = true;
        //         //this.formEditPersona.limpiarCampos();
        //         $('.nav-tabs a[href="#nuevoVenta"]').tab('show');
        //         this.formNewVenta.tituloPanel="Editando Venta: << Cliente: "+data.bean.nombres_cliente+" >>";
        //         this.formNewVenta.setBeanEditar(data.bean);

        // }

        pagarVentaAction(data) {
                this.print("bean:");
                this.print(data);

                //this.panelEditarSelected = true;
                //this.formEditPersona.limpiarCampos();
                $('.nav-tabs a[href="#comprobanteVenta"]').tab('show');
                //this.formNewVenta.tituloPanel="Editando Venta: << Cliente: "+data.bean.nombres_cliente+" >>";
                
                this.formNewComprobante.setBeanBuscar(data.bean);
           

        }
        refrescar(){
                this.formFindCaja.obtenerVentas();
        }

}