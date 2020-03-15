import { Component, AfterViewInit, ViewChild, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';

import { ControllerComponent } from '../../../core/controller/controller.component';
//import {FormPersonaComponent} from './form-persona.component';


/******************IMPORTAR SERVICIOS*************** */


import { ClienteService } from '../service/cliente.service';
import { ReportePdfService } from '../../../core/service/reporte-pdf.Service';
import { ReporteExcelService } from '../../../core/service/reporte-excel.Service';

import { Vista } from '../model/Vista';
import { FormPersonaComponent } from './form-persona.component';

declare var $: any;
@Component({
        selector: 'form-cliente-pv',
        templateUrl: '../view/form-cliente-pv.component.html',
        providers: [ClienteService, ReportePdfService, ReporteExcelService],
        //directives: [FormPersonaComponent]
})

export class FormClientePvComponent extends ControllerComponent implements AfterViewInit, OnInit {


        tabsPersonaActivated:boolean=false;

        listaClientes: any[];


        idClienteSelected: string;
        idPersonaSelected: string;
        nombresSelected: string;
        apellidoPaternoSelected: string;
        apellidoMaternoSelected: string;
        numeroDocumentoSelected: string;
        direccionSelected: string;
        telefonoSelected: string;
        correoSelected: string;

        observacionSelected: string;



        //************OBJETO ELEGIDO PARA EDITAR************
        beanSelected: any;

        //***********PANELES DE LOS MANTENEDORES***********
        panelRegistroSelected: boolean = false;
        panelBusquedaSelected: boolean = false;
        panelEditarSelected: boolean = false;
        panelAccionesGeneralesSelected: boolean = true;
        panelListaBeanSelected: boolean = true;




        //*************OBJETOS DEL FORMULARIO PERSONA**************

        activatedSelectedPer: boolean = true;

        idPersonaSelectedPer: string
        nombresSelectedPer: string;
        apellidoPaternoSelectedPer: string;
        apellidoMaternoSelectedPer: string;
        numeroDocumentoSelectedPer: string;
        direccionSelectedPer: string;
        telefonoSelectedPer: string;
        correoSelectedPer: string;

        beanSelectedPer: any;

        panelEditarSelectedPer: boolean;
        panelListaBeanSelectedPer: boolean;



        //************OBJETOS QUE SE TRANSMITIRAN**********/
        @Output() clienteSeleccionado = new EventEmitter();
        @Input() buttonSelectedActivated = false;
        @Input() buttonEliminarActivated = true;
        @Input() buttonEditarActivated = true;


        panelBuscarSelected: boolean = true;


        //VARIBLES PARA EL AUTOCOMPLETADO
        lista_autocompletado: any;
        indiceLista: any = -1;
        eleccion_autocompletado_selected: boolean = false;
        tamanio_lista_mostrar: number = 100;


        @ViewChild(FormPersonaComponent,{static: true}) formPersonaComponent: FormPersonaComponent;
       

        constructor(
                public http: Http,
                public router: Router,
                public clienteService: ClienteService,
                public reportePdfService: ReportePdfService,
                public reporteExcelService: ReporteExcelService
        ) {
                super(router, reportePdfService, reporteExcelService);

                this.panelRegistroSelected = false;
                this.panelBusquedaSelected = true;
                this.panelEditarSelected = false;
        }

        ngOnInit() {
                this.limpiarCampos();
                this.obtenerClientes();
        }

        ngAfterViewInit() {
                if (this.verificarTokenRpta(this.rutasMantenedores.FORM_CLIENTE)) {
                      
                        this.formPersonaComponent.tabsActivated=false;
                        this.formPersonaComponent.panelEditarSelected=false;
                }
        }


        mostrar() {
                this.print("DATOS EXTERNOS: ");
                this.print(this.listaClientes);
                this.print(this.panelListaBeanSelectedPer);
                if (this.panelListaBeanSelectedPer) {
                        this.panelListaBeanSelectedPer = false;
                } else {
                        this.panelListaBeanSelectedPer = true;
                }
        }

        obtenerClientes() {
                this.getTotalLista();
                //this.limpiarCampos();
                this.seleccionarByPagina(this.inicio, this.fin, this.tamPagina);
        }

        activarPanelBusqueda(estado) {
                this.panelBuscarSelected = estado;
                this.print("panel busqueda activado?:" + this.panelBuscarSelected);
        }


        limpiarCampos() {
                this.idClienteSelected = null;
                this.idPersonaSelected = null;
                this.nombresSelected = null;
                this.apellidoPaternoSelected = null;
                this.apellidoMaternoSelected = null;
                this.numeroDocumentoSelected = null;
                this.direccionSelected = null;
                this.telefonoSelected = null;
                this.correoSelected = null;
                this.observacionSelected = null;
        }

        getTotalLista() {

                let parametros = JSON.stringify({});

                if (this.panelBuscarSelected) {
                        parametros = JSON.stringify({
                                id_cliente: this.idClienteSelected,
                                id_persona: this.idPersonaSelected,
                                nombres: this.nombresSelected,
                                apellido_paterno: this.apellidoPaternoSelected,
                                apellido_materno: this.apellidoMaternoSelected,
                                numero_documento: this.numeroDocumentoSelected,
                                direccion: this.direccionSelected,
                                telefono: this.telefonoSelected,
                                correo: this.correoSelected,
                                observacion: this.observacionSelected
                        });

                }


                this.print("parametros total: " + parametros);
                this.clienteService.getTotalParametros(parametros)
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
                                id_cliente: this.idClienteSelected,
                                id_persona: this.idPersonaSelected,
                                nombres: this.nombresSelected,
                                apellido_paterno: this.apellidoPaternoSelected,
                                apellido_materno: this.apellidoMaternoSelected,
                                numero_documento: this.numeroDocumentoSelected,
                                direccion: this.direccionSelected,
                                telefono: this.telefonoSelected,
                                correo: this.correoSelected,
                                observacion: this.observacionSelected
                        });

                }

                this.clienteService.buscarPaginacion(inicio, fin, tamPagina, parametros)
                        .subscribe(
                        data => {
                                this.listaClientes = data;
                                this.print(data);
                                if (this.listaClientes == null) {
                                        this.mensajeAdvertencia("CLIENTE NO ENCONTRADO");
                                }
                        },
                        error => this.msj = <any>error);
        }


        buscar() {
                if (this.tienePermisoPrintMsj(this.rutas.FORM_CLIENTE, this.rutas.BUTTON_BUSCAR)) {
                        this.getTotalLista();
                        this.seleccionarByPagina(this.inicio, this.fin, this.tamPagina);
                }
        }





        eliminar(bean) {

                if (this.tienePermisoPrintMsj(this.rutas.FORM_CLIENTE, this.rutas.BUTTON_ELIMINAR)) {
                        if( confirm("Realmente Desea Eliminar ?")){
                        this.clienteService.eliminarLogico(bean.id_cliente)
                                .subscribe(
                                data => {
                                        this.obtenerClientes();
                                        let rpta = data;
                                        if (rpta != null) {
                                                if (rpta == 1) {
                                                        this.mensajeCorrecto("CLIENTE ELIMINADO CORRECTAMENTE");
                                                } else {
                                                        this.mensajeInCorrecto("CLIENTE NO ELIMINADO");
                                                }

                                        }
                                },
                                error => this.msj = <any>error);
                        }
                }
        }

        registrar() {
                if (this.tienePermisoPrintMsj(this.rutas.FORM_CLIENTE, this.rutas.BUTTON_REGISTRAR)) {
                        let parametros = JSON.stringify({
                                id_persona: this.beanSelected.id_persona,
                                observacion: this.observacionSelected
                        });
                        this.clienteService.registrar(parametros)
                                .subscribe(
                                data => {
                                        let rpta = data.rpta;
                                        this.print("rpta: " + rpta);
                                        if (rpta != null) {
                                                if (rpta == 1) {
                                                        this.mensajeCorrecto("CLIENTE REGISTRADO");
                                                        //this.limpiarCampos();
                                                        this.cerrarPanelRegistrar();
                                                } else {
                                                        this.mensajeInCorrecto("CLIENTE NO REGISTRADO");
                                                }
                                        }
                                        this.obtenerClientes();

                                },
                                error => this.msj = <any>error
                                );
                }
        }


        limpiar() {
                this.limpiarCampos();
                this.inicio = 1;
                this.fin = 10;
                this.tamPagina = 10;
                this.getTotalLista();
                this.seleccionarByPagina(this.inicio, this.fin, this.tamPagina);
        }



        //**********ACCIONES PARAR FORMULARIO PERSONA********
        abrirModalPersona() {
                this.cerrarPanelRegistrar();
                this.abrirModal("modalPersona");
                this.panelListaBeanSelectedPer = true;
        }

        abrirPanelRegistrar() {
                this.panelRegistroSelected = true;
        }

        cerrarPanelRegistrar() {
                this.panelRegistroSelected = false;
                this.beanSelected = null;
        }


        abrirPanelEditar(bean) {

                if (this.tienePermisoPrintMsj(this.rutas.FORM_CLIENTE, this.rutas.PANEL_EDITAR)) {
                        this.abrirPanelRegistrar();

                        this.panelEditarSelectedPer = true;
                        this.panelListaBeanSelectedPer = false;

                        this.beanSelectedPer = bean;
                        this.nombresSelectedPer = bean.nombres;
                        this.apellidoPaternoSelectedPer = bean.apellido_paterno;
                        this.apellidoMaternoSelectedPer = bean.apellido_materno;
                        this.numeroDocumentoSelectedPer = bean.numero_documento;
                        this.direccionSelectedPer = bean.direccion;
                        this.telefonoSelectedPer = bean.telefono;
                        this.correoSelectedPer = bean.correo;

                        this.print("panel editar: " + this.panelEditarSelectedPer);
                        this.print("panel lista: " + this.panelListaBeanSelectedPer);

                        this.abrirModalPersona();
                }
        }

        //**********METODO QUE OBTIENE LOS DATOS EXTERNOS 
        obtenerDatosExternos(datos) {
                this.beanSelected = datos.bean;
                //this.listaClientes.splice(0,this.listaClientes.length);
                //this.listaClientes.push(datos.bean)
                //this.listaClientes=datos.bean;
                this.cerrarModal("modalPersona");
                this.print("DATOS EXTERNOS: ");
                this.print(datos);
                this.abrirPanelRegistrar();

                this.idPersonaSelected = this.beanSelected.id_persona;
                this.nombresSelected = this.beanSelected.nombres;
                this.apellidoPaternoSelected = this.beanSelected.apellido_paterno;
                this.apellidoMaternoSelected = this.beanSelected.apellido_materno;
                this.numeroDocumentoSelected = this.beanSelected.numero_documento;
                this.direccionSelected = this.beanSelected.direccion;
                this.telefonoSelected = this.beanSelected.telefono;
                this.correoSelected = this.beanSelected.correo;

        }


        editarPersona(datos) {
                this.cerrarModal("modalPersona");
                this.obtenerClientes();
        }


        seleccionar(bean) {
                this.clienteSeleccionado.emit({ bean: bean });
        }





        //***********MANEJO DEL AUTOCOMPLETADO************


        teclaKeyPressAutocomplete(event: any) {

                if (!this.eleccion_autocompletado_selected && event.keyCode == 13) {
                        this.lista_autocompletado = null;
                        this.eleccion_autocompletado_selected = false;
                        this.indiceLista = -1;
                        this.buscar();
                        return false;
                }

                if (this.eleccion_autocompletado_selected && event.keyCode == 13) {
                        this.elegirLista(this.lista_autocompletado[this.indiceLista]);
                }


                if (event.keyCode == 27) {
                        this.lista_autocompletado = null;
                        this.indiceLista = -1;
                        this.eleccion_autocompletado_selected = false;
                }


        }


        teclaKeyDownAutocomplete(event: any) {
                if (event.keyCode == 38 || event.keyCode == 40 || event.keyCode == 32 || event.keyCode == 13) {

                        //************MANEJO DE TECLAS AUTOCOMPLETADO*********
                        //************FLECHA HACIA ARRIBA************
                        if (event.keyCode == 38) {

                                let lista = [];
                                lista = $('.lista-diego li');

                                //$('.lista-diego li').each(function(indice, elemento) {
                                //this.print('El elemento con el índice '+indice+' contiene '+$(elemento).text());
                                //});
                                if (lista.length >= 0) {

                                        this.indiceLista = this.indiceLista == -1 ? lista.length - 1 : this.indiceLista;
                                        if (this.indiceLista >= 0) {
                                                this.indiceLista--;
                                                this.indiceLista = this.indiceLista == -1 ? lista.length - 1 : this.indiceLista;

                                                $('.lista-diego li').removeClass();
                                                $(lista[this.indiceLista]).addClass("seleccionado");
                                        }

                                }




                                this.print("PRESIONASTE TECLA HACIA ARRIBA UP")
                                this.print("tamaño: " + $('.lista-diego li'));
                                this.print("tam:" + lista.length);
                                this.print("indice:" + this.indiceLista);

                        }

                        //******************FLECHA HACI ABAJO***************** 
                        if (event.keyCode == 40) {

                                let lista = [];
                                lista = $('.lista-diego li');
                                if (lista.length > 0) {
                                        //$(lista[this.indiceLista]).addClass( "seleccionado" );
                                        this.print("condicion: " + this.indiceLista + "tam:" + (lista.length - 1));
                                        if (this.indiceLista <= lista.length - 1) {
                                                this.indiceLista++
                                                $('.lista-diego li').removeClass();
                                                $(lista[this.indiceLista]).addClass("seleccionado");
                                        }

                                        if (this.indiceLista == lista.length) {
                                                this.indiceLista = 0;
                                                $('.lista-diego li').removeClass();
                                                $(lista[this.indiceLista]).addClass("seleccionado");
                                        }


                                }

                                this.print("PRESIONASTE TECLA HACIA ABAJO UP")
                                this.print("tamaño: " + $('.lista-diego li'));
                                this.print("tam:" + lista.length);
                                this.print("indice:" + this.indiceLista);

                        }


                }
        }


        teclaKeyUpAutocomplete(event: any) {

                //  tecla flecha arriba     :  38
                //  tecla flecha abajo      :  40
                //  tecla enter             :  13
                //  tecla barra espaciadora : 32
                //  tecla escape            : 27

                if (event.keyCode != 38 && event.keyCode != 40 && event.keyCode != 13) {
                        this.buscarAutocompletado();
                }
        }



        elegirLista(bean: any) {
                if (bean != null) {
                        this.print(bean);
                        this.indiceLista = -1;
                        this.nombresSelected = bean.nombres;
                        this.lista_autocompletado = null;
                        this.eleccion_autocompletado_selected = false;
                }
        }

        buscarAutocompletado() {
                this.indiceLista = -1;
                if (this.nombresSelected != "") {
                        this.seleccionarByPaginaAutocompletado(1, this.tamanio_lista_mostrar, this.tamanio_lista_mostrar);
                } else {
                        this.lista_autocompletado = null;
                        this.buscar();
                }
        }

        seleccionarByPaginaAutocompletado(inicio: any, fin: any, tamPagina: any) {

                let parametros = JSON.stringify({});

                if (this.panelBuscarSelected) {
                        parametros = JSON.stringify({
                                id_cliente: this.idClienteSelected,
                                id_persona: this.idPersonaSelected,
                                nombres: this.nombresSelected,
                                apellido_paterno: this.apellidoPaternoSelected,
                                apellido_materno: this.apellidoMaternoSelected,
                                numero_documento: this.numeroDocumentoSelected,
                                direccion: this.direccionSelected,
                                telefono: this.telefonoSelected,
                                correo: this.correoSelected,
                                observacion: this.observacionSelected
                        });

                }

                this.clienteService.buscarPaginacion(inicio, fin, tamPagina, parametros)
                        .subscribe(
                        data => {
                                this.lista_autocompletado = data;
                                this.eleccion_autocompletado_selected = true;
                                this.print(data);
                        },
                        error => this.msj = <any>error);
        }

        exportarExcel() {
                this.eliminarColumna(this.listaClientes, ["estado_cliente", "fecha_baja", "observacion", "id_tipo_persona", "id_tipo_documento", "estado"]);

                let parametros = JSON.stringify({
                        datos: this.listaClientes,
                        titulo: 'CLIENTES',
                        subtitulo: 'CLIENTES EN TABLA'
                });

                this.exportarExcelFinal(parametros, "reporte Almacen");

        }


        exportarPdf() {

                this.eliminarColumna(this.listaClientes, ["estado_cliente", "fecha_baja", "observacion", "id_tipo_persona", "id_tipo_documento", "estado"]);
                let parametros = JSON.stringify({
                        datos: this.listaClientes,
                        titulo: 'CLIENTES',
                        subtitulo: 'CLIENTES EN TABLA'
                });

                this.exportarPdfFinal(parametros);


        }





}