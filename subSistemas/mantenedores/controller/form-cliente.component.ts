import { Component, AfterViewInit, ViewChild, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';

import { ControllerComponent } from '../../../core/controller/controller.component';
//import {FormPersonaComponent} from './form-persona.component';


/******************IMPORTAR SERVICIOS*************** */



import { FormFindClienteComponent } from './cliente/form-find-cliente.component';
import { FormNewPersonaComponent } from './persona/form-new-persona.component';

declare var $: any;
@Component({
        selector: 'form-cliente',
        templateUrl: '../view/form-cliente.component.html',
        providers: [],
        //directives: [FormPersonaComponent]
})

export class FormClienteComponent extends ControllerComponent implements AfterViewInit, OnInit {

        //***************CRUD COMPROBANTES
        @ViewChild(FormFindClienteComponent,{static: false}) formFindCliente: FormFindClienteComponent;
        @ViewChild(FormNewPersonaComponent,{static: false}) formNewPersona: FormNewPersonaComponent;
        @Input() panelEditarSelected: boolean = false;
        constructor(
                public http: Http,
                public router: Router,
        ) {
                super(router);
        }

        ngOnInit() {
               
        }

        ngAfterViewInit() {
                if (this.verificarTokenRpta(this.rutasMantenedores.FORM_CLIENTE)) {
                        this.formFindCliente.obtenerClientes();
                        this.formNewPersona.checkProveedorActivado=false;
                        this.formNewPersona.tituloPanel="Registrar Clientes";
                        this.formNewPersona.isClienteSelected=true;
                        this.formNewPersona.obtenerTiposDocumento();
                        this.formNewPersona.obtenerTiposPersona();
                      
                }
        }

        
        editarPersonaAction(data) {
                this.print("bean:");
                this.print(data);
                $('.nav-tabs a[href="#nuevoCliente"]').tab('show');
                this.formNewPersona.tituloPanel="Editando CLIENTE: << Id: "+data.bean.id_persona+" , Nombres:"+data.bean.nombres+" >>";
                this.formNewPersona.setBeanEditar(data.bean);

        }

        regresarAction(data) {
                this.panelEditarSelected = false;
                this.formFindCliente.limpiar();
        }

}