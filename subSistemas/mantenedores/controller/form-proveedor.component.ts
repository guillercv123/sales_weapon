import { Component, AfterViewInit, ViewChild, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';

import { ControllerComponent } from '../../../core/controller/controller.component';




/******************IMPORTAR SERVICIOS*************** */


import { ProveedorService } from '../service/proveedor.service';


import { Vista } from '../model/Vista';
import { FormFindProveedorComponent } from './proveedor/form-find-proveedor.component';
import { FormNewProveedorComponent } from './proveedor/form-new-proveedor.component';

declare var $: any;
@Component({
        selector: 'form-proveedor',
        templateUrl: '../view/form-proveedor.component.html',
        providers: [ProveedorService]

})

export class FormProveedorComponent extends ControllerComponent implements AfterViewInit {


        //***************CRUD COMPROBANTES
        @ViewChild(FormFindProveedorComponent,{static: true}) formFindProveedor: FormFindProveedorComponent;
        @ViewChild(FormNewProveedorComponent,{static: true}) formNewProveedor: FormNewProveedorComponent;

        constructor(
                public http: Http,
                public router: Router,
                public proveedorService: ProveedorService
        ) {
                super(router);

                
        }

        ngOnInit() {
        }

        ngAfterViewInit() {
                if (this.verificarTokenRpta(this.rutasMantenedores.FORM_PROVEEDOR)) {
                     this.formFindProveedor.obtenerProveedores();
                     /*this.formFindProveedor.formFindPersona.obtenerTiposDocumento();
                     this.formFindProveedor.formFindPersona.obtenerTiposPersona();
                     setTimeout(()=>{  
                        this.formNewProveedor.formFindPersona.tiposDocumento= this.formFindProveedor.
                        formFindPersona.tiposDocumento
                        this.formNewProveedor.formFindPersona.tiposPersona= 
                        this.formFindProveedor.
                        formFindPersona.tiposPersona
                     }, 4000);*/
                }
        }


       editarProveedorAction(data) {
                this.print("bean:");
                this.print(data);

                //this.panelEditarSelected = true;
                //this.formEditPersona.limpiarCampos();
                $('.nav-tabs a[href="#nuevoProveedor"]').tab('show');
                this.formNewProveedor.tituloPanel="Editando Proveedor: << Id: "+data.bean.id_proveedor+" , Nombres:"+data.bean.nombre+" >>";
                this.formNewProveedor.setBeanEditar(data.bean);

        }
}