import { Component, AfterViewInit, ViewChild, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';

import { ControllerComponent } from '../../../core/controller/controller.component';




/******************IMPORTAR SERVICIOS*************** */
import { FormFindPersonaComponent } from './persona/form-find-persona.component';
import { FormNewPersonaComponent } from './persona/form-new-persona.component';
declare var $: any;
@Component({
        selector: 'form-persona',
        templateUrl: '../view/form-persona.component.html',
        providers: []

})

export class FormPersonaComponent extends ControllerComponent implements AfterViewInit, OnInit {

        //***********PANELES DE LOS MANTENEDORES***********
        @Input() panelEditarSelected: boolean = false;

        //***************CRUD COMPROBANTES
        @ViewChild(FormFindPersonaComponent,{static: false}) formFindPersona: FormFindPersonaComponent;
        @ViewChild(FormNewPersonaComponent,{static: false}) formNewPersona: FormNewPersonaComponent;

        @Input() tabsActivated: boolean = true;
        @Input() activatedSelected = false;
        @Output() dataExterna = new EventEmitter();

        constructor(
                public http: Http,
                public router: Router
        ) {
                super(router);

                this.panelEditarSelected = false;
                //this.formFindPersona.obtenerPersonas();

        }

        ngOnInit() {
               
        }

        ngAfterViewInit() {
                // if (this.verificarTokenRpta(this.rutasMantenedores.FORM_PERSONA)) {
                //         //this.formFindPersona.obtenerTiposDocumento();
                //         //this.formFindPersona.obtenerTiposPersona();

                //         /*setTimeout(() => {
                //                 this.formNewPersona.tiposDocumento = this.formFindPersona.tiposDocumento;
                //                 this.formNewPersona.tiposPersona = this.formFindPersona.tiposPersona;         
                //         }, 4000);*/

                //         this.formFindPersona.obtenerPersonas();
                // }
                this.formFindPersona.obtenerPersonas();
                
        }

        editarPersonaAction(data) {
                this.print("bean:");
                this.print(data);

                //this.panelEditarSelected = true;
                //this.formEditPersona.limpiarCampos();
                $('.nav-tabs a[href="#nuevoPersona"]').tab('show');
                this.formNewPersona.tituloPanel="Editando Persona: << Id: "+data.bean.id_persona+" , Nombres:"+data.bean.nombres+" >>";
                this.formNewPersona.setBeanEditar(data.bean);

        }

        regresarAction(data) {
                this.panelEditarSelected = false;
                this.formFindPersona.limpiar();
        }

}