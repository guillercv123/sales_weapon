import { Component, AfterViewInit, ViewChild, OnInit, Input } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';

import { ControllerComponent } from '../../../core/controller/controller.component';
import { FormFindComprobanteComponent } from './comprobante/form-find-comprobante.component';
import { FormNewComprobanteComponent } from './comprobante/form-new-comprobante.component';




/******************IMPORTAR SERVICIOS*************** */


declare var $: any;
@Component({
        selector: 'form-comprobante',
        templateUrl: '../view/form-comprobante.component.html',
        providers: []

})

export class FormComprobanteComponent extends ControllerComponent implements AfterViewInit {


        //***************CRUD COMPROBANTES
        @ViewChild(FormFindComprobanteComponent,{static: false}) formFindComprobante: FormFindComprobanteComponent;
        @ViewChild(FormNewComprobanteComponent,{static: false}) formNewComprobante: FormNewComprobanteComponent;
       
        @Input() tabsActivated: boolean = true;

        constructor(
                public http: Http,
                public router: Router,              
        ) {
                super(router);
        }




        ngOnInit() {
              
              
        }


        ngAfterViewInit() {
                if (this.verificarTokenRpta(this.rutasMantenedores.FORM_COMPROBANTE)) {
                        this.formFindComprobante.obtenerCategoriasComprobante();
                        this.formFindComprobante.obtenerMediosPago();
                        this.formFindComprobante.obtenerComprobantes();

                        setTimeout(()=>{  
                                this.formNewComprobante.categoriasComprobante= this.formFindComprobante.categoriasComprobante;
                                this.formNewComprobante.mediosPago= this.formFindComprobante.mediosPago;
                        }, 3000);
                       

                }
        }


}