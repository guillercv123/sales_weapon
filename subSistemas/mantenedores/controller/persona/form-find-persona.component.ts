import { Component, AfterViewInit, ViewChild, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';

import { ControllerComponent } from '../../../../core/controller/controller.component';




/******************IMPORTAR SERVICIOS*************** */


import { PersonaService } from '../../service/persona.service';
import { TipoDocumentoService } from '../../service/tipo-documento.service';
import { TipoPersonaService } from '../../service/tipo-persona.service';

declare var $: any;
@Component({
        selector: 'form-find-persona',
        templateUrl: '../../view/persona/form-find-persona.component.html',
        providers: [PersonaService, TipoDocumentoService, TipoPersonaService]

})

export class FormFindPersonaComponent extends ControllerComponent implements AfterViewInit, OnInit {

        idPersonaSelected: string=null;
        @Input()nombresSelected: string=null;
        @Input()apellidoPaternoSelected: string=null;
        @Input()apellidoMaternoSelected: string=null;
        @Input()numeroDocumentoSelected: string=null;
        @Input()direccionSelected: string=null;
        @Input()telefonoSelected: string=null;
        @Input()correoSelected: string=null;
        tipoDocumentoSelected: any=null;
        tipoPersonaSelected: any=null;
        tiposDocumento: any[];
        tiposPersona: any[];

        listaPersonas: any[];
        panelBuscarSelected: boolean = true;

        @Input() activatedSelected : boolean=false;
        @Output() dataExterna = new EventEmitter();

        @Output() editarPersonaAction = new EventEmitter();

       
        constructor(
                public http: Http,
                public router: Router,
                public personaService: PersonaService,
                public tipoPersonaService: TipoPersonaService,
                public tipoDocumentoService: TipoDocumentoService
        ) {
                super(router);
                //this.activatedSelected=false;
        }

        ngOnInit() {
                //this.activatedSelected=false;
                this.limpiarCampos();
                this.tiposDocumento = JSON.parse(localStorage.getItem("lista_tipos_documento"));
                this.tiposPersona = JSON.parse(localStorage.getItem("lista_tipos_persona"));
               
        }

        ngAfterViewInit() {
                 if (this.verificarTokenRpta(this.rutasMantenedores.FORM_PERSONA)) {
                        
                         //this.obtenerTiposDocumento();
                         //this.obtenerTiposPersona();
                 }
        }


        obtenerTiposDocumento() {

                this.tipoDocumentoService.getAll()
                        .subscribe(
                        data => {//this.vistas = data;

                                this.tiposDocumento = data;
                        },
                        error => this.msj = <any>error);
        }


        obtenerTiposPersona() {

                this.tipoPersonaService.getAll()
                        .subscribe(
                        data => {//this.vistas = data;

                                this.tiposPersona = data;
                        },
                        error => this.msj = <any>error);
        }

        limpiar() {
                this.limpiarCampos();
                this.inicio = 1;
                this.fin = 10;
                this.tamPagina = 10;
                //this.getTotalLista();
                //this.seleccionarByPagina(this.inicio, this.fin, this.tamPagina);
        }

       

       
        
        buscar() {
                if (this.tienePermisoPrintMsj(this.rutas.FORM_PERSONA, this.rutas.BUTTON_BUSCAR)) {
                        this.getTotalLista();
                        this.seleccionarByPagina(this.inicio, this.fin, this.tamPagina);
                }
        }

      


        limpiarCampos() {
                this.idPersonaSelected = null;
                this.nombresSelected = null;
                this.apellidoPaternoSelected = null;
                this.apellidoMaternoSelected = null;
                this.numeroDocumentoSelected = null;
                this.direccionSelected = null;
                this.telefonoSelected = null;
                this.correoSelected = null;
                this.tipoDocumentoSelected = null;
                this.tipoPersonaSelected = null;
                this.listaPersonas =  null;
                
        }

      


        obtenerPersonas() {
                this.limpiarCampos();
                this.getTotalLista();
                //this.seleccionarByPagina(this.inicio, this.fin, this.tamPagina);
        }

 
        eliminar(bean) {
                if (this.tienePermisoPrintMsj(this.rutas.FORM_PERSONA, this.rutas.BUTTON_ELIMINAR)) {
                        if( confirm("Realmente Desea Eliminar ?")){
                        this.personaService.eliminarLogico(bean.id_persona)
                                .subscribe(
                                data => {
                                        this.obtenerPersonas();
                                        let rpta = data;
                                        if (rpta != null) {
                                                if (rpta == 1) {
                                                        this.mensajeCorrecto("PERSONA ELIMINADA CORRECTAMENTE");
                                                } else {
                                                        this.mensajeInCorrecto("PERSONA NO ELIMINADO");
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



        getTotalLista() {

                let parametros = JSON.stringify({});

                if (this.panelBuscarSelected) {
                        parametros = JSON.stringify({
                                id_persona: this.idPersonaSelected,
                                nombres: this.nombresSelected,
                                apellido_paterno: this.apellidoPaternoSelected,
                                apellido_materno: this.apellidoMaternoSelected,
                                numero_documento: this.numeroDocumentoSelected,
                                direccion: this.direccionSelected,
                                telefono: this.telefonoSelected,
                                correo: this.correoSelected,
                                id_tipo_persona: this.tipoPersonaSelected == null ? null : this.tipoPersonaSelected.id_tipo_persona,
                                id_tipo_documento: this.tipoDocumentoSelected == null ? null : this.tipoDocumentoSelected.id_tipo_documento

                        });
                }

                this.print("parametros total: " + parametros);
                this.personaService.getTotalParametros(parametros)
                        .subscribe(
                        data => {
                                this.totalLista = data;
                                this.print("total:" + data);
                        },
                        error => this.msj = <any>error);
        }


        seleccionarByPagina(inicio: any, fin: any, tamPagina: any) {

                let parametros = JSON.stringify({});

                if (this.panelBuscarSelected) {
                        parametros = JSON.stringify({
                                id_persona: this.idPersonaSelected,
                                nombres: this.nombresSelected,
                                apellido_paterno: this.apellidoPaternoSelected,
                                apellido_materno: this.apellidoMaternoSelected,
                                numero_documento: this.numeroDocumentoSelected,
                                direccion: this.direccionSelected,
                                telefono: this.telefonoSelected,
                                correo: this.correoSelected,
                                id_tipo_persona: this.tipoPersonaSelected == null ? null : this.tipoPersonaSelected.id_tipo_persona,
                                id_tipo_documento: this.tipoDocumentoSelected == null ? null : this.tipoDocumentoSelected.id_tipo_documento

                        });
                }


                this.personaService.buscarPaginacion(inicio, fin, tamPagina, parametros)
                        .subscribe(
                        data => {
                                this.listaPersonas = data;

                                /************SE UTILIZA PARA NOTIFICAR LA DATA EXTERNA A ALGUN OTRO COMPONENTE QUE LO REQUIERA*/
                                //this.dataExterna.emit({lista: this.listaPersonas});
                                this.print(data);
                        },
                        error => this.msj = <any>error);
        }


        seleccionar(bean) {
                this.dataExterna.emit({ bean: bean });
        }

        abrirPanelEditar(bean) {
                if (this.tienePermisoPrintMsj(this.rutas.FORM_PERSONA, this.rutas.PANEL_EDITAR)) {
                        this.editarPersonaAction.emit({ bean: bean });
                }
        }
      
}