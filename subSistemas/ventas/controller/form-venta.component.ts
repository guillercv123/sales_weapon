import { Component, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';

import { ControllerComponent } from '../../../core/controller/controller.component';

import { FormFindVentaComponent } from './venta/form-find-venta.component';
import { FormNewVentaComponent } from './venta/form-new-venta.component';




/******************IMPORTAR SERVICIOS*************** */


declare var $: any;
@Component({
        selector: 'form-venta',
        templateUrl: '../view/form-venta.component.html',
        providers: []

})

export class FormVentaComponent extends ControllerComponent implements AfterViewInit {


        @ViewChild(FormFindVentaComponent,{static: false}) formFindVenta: FormFindVentaComponent;
        @ViewChild(FormNewVentaComponent,{static: false}) formNewVenta: FormNewVentaComponent;
        
        constructor( public http: Http, public router: Router) {
                super(router);
        }

        ngOnInit() {
               
        }


        ngAfterViewInit() {
                if (this.verificarTokenRpta(this.rutasMantenedores.FORM_VENTA)) {
                    
                }
        }

        editarVentaAction(data) {
                this.print("bean:");
                this.print(data);

                //this.panelEditarSelected = true;
                //this.formEditPersona.limpiarCampos();
                $('.nav-tabs a[href="#nuevoVenta"]').tab('show');
                this.formNewVenta.tituloPanel="Editando Venta: << Cliente: "+data.bean.nombres_cliente+" >>";
                this.formNewVenta.setBeanEditar(data.bean);
                this.formNewVenta.estadoModificacion = data.bean.estado;

        }

        refresar(){
                this.formFindVenta.obtenerVentas();
        }

}