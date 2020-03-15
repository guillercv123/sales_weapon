import { Component, AfterViewInit, ViewChild, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';

import { ControllerComponent } from '../../../../core/controller/controller.component';
//import {FormPersonaComponent} from './form-persona.component';


/******************IMPORTAR SERVICIOS*************** */

import { PersonaService } from '../../service/persona.service';
import { ClienteService } from '../../service/cliente.service';
import { ReportePdfService } from '../../../../core/service/reporte-pdf.Service';
import { ReporteExcelService } from '../../../../core/service/reporte-excel.Service';

declare var $: any;
@Component({
        selector: 'form-find-cliente',
        templateUrl: '../../view/cliente/form-find-cliente.component.html',
        providers: [PersonaService,ClienteService, ReportePdfService, ReporteExcelService],
        //directives: [FormPersonaComponent]
})

export class FormFindClienteComponent extends ControllerComponent implements AfterViewInit, OnInit {




        teclaEnterPresionada:boolean=false;


        idClienteSelected: string;
        idPersonaSelected: string;
        nombresSelected: string;
        apellidoPaternoSelected: string;
        apellidoMaternoSelected: string;
        numeroDocumentoSelected: string;
        direccionSelected: string;
        telefonoSelected: string;
        correoSelected: string;
        tiposDocumento: any[];
        observacionSelected: string;
        listaClientes: any[];
        buttonSelectedActivated:boolean=false;
        //************OBJETOS QUE SE TRANSMITIRAN**********/
        @Output() clienteSeleccionado = new EventEmitter();
        @Output() editarPersonaAction = new EventEmitter();

        tipoDocumentoSelected:any;
        //VARIBLES PARA EL AUTOCOMPLETADO
        lista_autocompletado: any;
        indiceLista: any = -1;
        eleccion_autocompletado_selected: boolean = false;
        tamanio_lista_mostrar: number = 100;

        constructor(
                public http: Http,
                public router: Router,
                public clienteService: ClienteService,
                public reportePdfService: ReportePdfService,
                public reporteExcelService: ReporteExcelService,
                public personaService: PersonaService
        ) {
                super(router, reportePdfService, reporteExcelService);

        }

        ngOnInit() {
                this.limpiarCampos();
                this.listaClientes = null;
                this.tiposDocumento = JSON.parse(localStorage.getItem("lista_tipos_documento"));
         
        }

        ngAfterViewInit() {
                if (this.verificarTokenRpta(this.rutasMantenedores.FORM_CLIENTE)) {
                       this.activarFocus();
                }
        }


        activarFocus(){
                $("#nroDocClienteBusqueda").focus();
        }


        obtenerClientes() {
                this.limpiarCampos();
                this.getTotalLista();
                //this.seleccionarByPagina(this.inicio, this.fin, this.tamPagina);
        }



        limpiarCampos() {
                this.teclaEnterPresionada=false;
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
                this.listaClientes = null;
        }

        getTotalLista() {

                let parametros = JSON.stringify({
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

                let parametros = JSON.stringify({
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

              
                this.clienteService.buscarPaginacion(inicio, fin, tamPagina, parametros)
                        .subscribe(
                                data => {
                                        this.listaClientes = data;
                                        this.print(data);
                                        if(this.buttonSelectedActivated && this.teclaEnterPresionada){
                                                if(this.listaClientes!=null){
                                                        if(this.listaClientes.length>0){
                                                                this.seleccionar(this.listaClientes[0]);
                                                                this.teclaEnterPresionada=false;
                                                        }
                                                }
                                               
                                        }

                                        if (this.listaClientes == null) {
                                                this.mensajeAdvertencia("CLIENTE NO ENCONTRADO");
                                        }
                                },
                                error => this.msj = <any>error);
        }

        teclaEnter(event: any) {

                //  tecla flecha arriba     :  38
                //  tecla flecha abajo      :  40
                //  tecla enter             :  13
                //  tecla barra espaciadora : 32
                //  tecla escape            : 27

                if (event.keyCode == 13) {
                        this.teclaEnterPresionada=true;
                        this.buscar();
                }
        }

        buscar() {
                if (this.tienePermisoPrintMsj(this.rutas.FORM_CLIENTE, this.rutas.BUTTON_BUSCAR)) {
                        this.getTotalLista();
                        this.seleccionarByPagina(this.inicio, this.fin, this.tamPagina);
                }
        }


        abrirPanelEditar(bean) {
                if (this.tienePermisoPrintMsj(this.rutas.FORM_PERSONA, this.rutas.PANEL_EDITAR)) {
                        this.editarPersonaAction.emit({ bean: bean });
                }
        }




        eliminar(bean) {

                if (this.tienePermisoPrintMsj(this.rutas.FORM_CLIENTE, this.rutas.BUTTON_ELIMINAR)) {
                        if (confirm("Realmente Desea Eliminar ?")) {
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



        limpiar() {
                this.limpiarCampos();
                this.inicio = 1;
                this.fin = 10;
                this.tamPagina = 10;
                this.getTotalLista();
                //this.seleccionarByPagina(this.inicio, this.fin, this.tamPagina);
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

                if (event.keyCode != 38 && event.keyCode != 40 && event.keyCode != 13 && event.keyCode != 27) {
                        this.buscarAutocompletado();
                }

                if (event.keyCode == 27) {
                        this.indiceLista = -1;
                        this.lista_autocompletado = null;
                        this.eleccion_autocompletado_selected = false;
                }
        }



        elegirLista(bean: any) {
                if (bean != null) {
                        this.print(bean);
                        this.indiceLista = -1;
                        this.nombresSelected = bean.nombres;
                        this.lista_autocompletado = null;
                        this.eleccion_autocompletado_selected = false;
                        this.buscar();
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

                let parametros = JSON.stringify({
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