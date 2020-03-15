import { Component, AfterViewInit, ViewChild, OnInit, Input } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';

import { ControllerComponent } from '../../../core/controller/controller.component';




/******************IMPORTAR SERVICIOS*************** */
import { FormFindGuiaRemisionComponent } from './guia-remision/form-find-guia-remision.component';
import { FormNewGuiaRemisionComponent } from './guia-remision/form-new-guia-remision.component';

declare var $: any;
@Component({
        selector: 'form-guia-remision',
        templateUrl: '../view/form-guia-remision.component.html',
        providers: []

})

export class FormGuiaRemisionComponent extends ControllerComponent implements AfterViewInit {

        @ViewChild(FormNewGuiaRemisionComponent,{static:false}) formNewGuiaRemision: FormNewGuiaRemisionComponent;

        @ViewChild(FormFindGuiaRemisionComponent,{static: false}) formFindGuiaRemision: FormFindGuiaRemisionComponent;
       
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
                if (this.verificarTokenRpta(this.rutasMantenedores.FORM_GUIA_REMISION)) {
                      
                        this.formFindGuiaRemision.obtenerTipoMoneda();
                        this.formFindGuiaRemision.obtenerCategoriasComprobante();
                        this.formNewGuiaRemision.obtenerUnidadesMedida();
                        this.formFindGuiaRemision.obtenerGuiasRemision();
                        
                        
                        
                        this.formFindGuiaRemision.formFindPersona.obtenerTiposDocumento();
                        this.formFindGuiaRemision.formFindPersona.obtenerTiposPersona();

                        setTimeout(()=>{  
                                this.formNewGuiaRemision.categoriasComprobante= this.formFindGuiaRemision.categoriasComprobante;
                                this.formNewGuiaRemision.tiposMoneda= this.formFindGuiaRemision.tiposMoneda;
                        
                                this.formNewGuiaRemision.formFindPersona.tiposDocumento= this.formFindGuiaRemision.
                                formFindPersona.tiposDocumento
                                this.formNewGuiaRemision.formFindPersona.tiposPersona= 
                                this.formFindGuiaRemision.
                                formFindPersona.tiposPersona
                             
                                
                                this.formFindGuiaRemision.formFindConductor.formFindPersona.tiposDocumento= 
                                this.formFindGuiaRemision.formFindPersona.tiposDocumento
                                
                                this.formFindGuiaRemision.formFindConductor.formFindPersona.tiposPersona= 
                                this.formFindGuiaRemision.formFindPersona.tiposPersona
                        
                        }, 4000);



                      /*this.obtenerUnidadesMedida();
                        this.obtenerCategoriasComprobante();
                        this.obtenerTipoMoneda();
                        this.obtenerGuiasRemision();

                        var f = new Date();
                        this.fechaEmisionSelected = f.getFullYear() + "-" + this.completarCerosIzquierda(2, "" + (f.getMonth() + 1)) + "-" + this.completarCerosIzquierda(2, "" + f.getDate());
                        this.fechaInicioTrasladoSelected = this.fechaEmisionSelected;*/

                }
        }

}