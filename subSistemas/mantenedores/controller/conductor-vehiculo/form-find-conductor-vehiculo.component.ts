import { Component, AfterViewInit, ViewChild, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';

import { ControllerComponent } from '../../../../core/controller/controller.component';




/******************IMPORTAR SERVICIOS*************** */


import { ConductorVehiculoService } from '../../service/conductor-vehiculo.service';
import { ReportePdfService } from '../../../../core/service/reporte-pdf.Service';
import { ReporteExcelService } from '../../../../core/service/reporte-excel.Service';
import { FormFindPersonaComponent } from '../persona/form-find-persona.component';


declare var $: any;
@Component({
        selector: 'form-find-conductor-vehiculo',
        templateUrl: '../../view/conductor-vehiculo/form-find-conductor-vehiculo.component.html',
        //providers: [AlmacenService,LocalService]
        providers: [ConductorVehiculoService, ReportePdfService, ReporteExcelService]

})

export class FormFindConductorVehiculoComponent extends ControllerComponent implements AfterViewInit {

        idConductorVehiculoSelected: number;
        marcaSelected: string;
        nroPlacaSelected: number;
        nroConstanciaInscripcion: number;
        nroLicenciaConducir: number;
        personaSelected: any;
        nombrePersonaSelected: string;


        listaConductores: any[];

        @Output() conductorSeleccionado = new EventEmitter();
        @Output() editarConductorAction = new EventEmitter();

        buttonSelected = false;

        @ViewChild(FormFindPersonaComponent,{static: true}) formFindPersona: FormFindPersonaComponent;

        constructor(
                public http: Http,
                public router: Router,
                public conductorVehiculoService: ConductorVehiculoService,
                public reportePdfService: ReportePdfService,
                public reporteExcelService: ReporteExcelService
        ) {
                super(router, reportePdfService, reporteExcelService);

        }

        ngOnInit() {
                this.limpiarCampos();
                this.formFindPersona.activatedSelected=true;
        }


        ngAfterViewInit() {
                if (this.verificarTokenRpta(this.rutasMantenedores.FORM_CONDUCTOR_VEHICULO)) {
                        //this.obtenerConductores();
                       
                      


                }
        }

        
        

        obtenerConductores() {
                this.getTotalLista();
                this.limpiarCampos();
                this.seleccionarByPagina(this.inicio, this.fin, this.tamPagina);
        }

        limpiar() {
                this.limpiarCampos();
                this.inicio = 1;
                this.fin = 10;
                this.tamPagina = 10;
                this.getTotalLista();
                this.seleccionarByPagina(this.inicio, this.fin, this.tamPagina);
        }


        seleccionarByPagina(inicio: any, fin: any, tamPagina: any) {
                let parametros = JSON.stringify({
                        id_conductor_vehiculo: this.idConductorVehiculoSelected,
                        marca: this.marcaSelected,
                        nro_placa: this.nroPlacaSelected,
                        nro_constancia_inscripcion: this.nroConstanciaInscripcion,
                        nro_licencia_conducir: this.nroLicenciaConducir,
                        id_persona: this.personaSelected == null ? null : this.personaSelected.id_persona
                });

                this.conductorVehiculoService.buscarPaginacion(inicio, fin, tamPagina, parametros)
                        .subscribe(
                        data => {
                                this.listaConductores = data;
                                this.print(data);
                        },
                        error => this.msj = <any>error);
        }

        buscar() {

                if (this.tienePermisoPrintMsj(this.rutas.FORM_CONDUCTOR_VEHICULO, this.rutas.BUTTON_BUSCAR)) {
                        this.getTotalLista();
                        this.seleccionarByPagina(this.inicio, this.fin, this.tamPagina);
                }
        }

        getTotalLista() {
                let parametros = JSON.stringify({
                        id_conductor_vehiculo: this.idConductorVehiculoSelected,
                        marca: this.marcaSelected,
                        nro_placa: this.nroPlacaSelected,
                        nro_constancia_inscripcion: this.nroConstanciaInscripcion,
                        nro_licencia_conducir: this.nroLicenciaConducir,
                        id_persona: this.personaSelected == null ? null : this.personaSelected.id_persona
                });

                this.print("parametros total: " + parametros);
                this.conductorVehiculoService.getTotalParametros(parametros)
                        .subscribe(
                        data => {
                                this.totalLista = data;
                                this.print("total:" + data);
                        },
                        error => this.msj = <any>error);
        }


        eliminar(bean) {
                if (this.tienePermisoPrintMsj(this.rutas.FORM_CONDUCTOR_VEHICULO, this.rutas.BUTTON_ELIMINAR)) {
                        if( confirm("Realmente Desea Eliminar ?")){
                        this.conductorVehiculoService.eliminarLogico(bean.id_conductor_vehiculo)
                                .subscribe(
                                data => {
                                        this.obtenerConductores();
                                        let rpta = data;
                                        if (rpta != null) {
                                                if (rpta == 1) {
                                                        this.mensajeCorrecto("CONDUCTOR ELIMINADO CORRECTAMENTE");
                                                } else {
                                                        this.mensajeInCorrecto("CONDUCTOR NO ELIMINADO");
                                                }

                                        }
                                },
                                error => this.msj = <any>error);
                        }
                }
        }


        limpiarCampos() {
                this.idConductorVehiculoSelected = null;
                this.marcaSelected = null;
                this.nroPlacaSelected = null;
                this.nroConstanciaInscripcion = null;
                this.nroLicenciaConducir = null;
                this.personaSelected = null;
                this.nombrePersonaSelected = null;
        }

        elegirFila(lista, i) {
                this.marcar(lista, i);
        }

        exportarExcel() {

                let parametros = JSON.stringify({
                        datos: this.listaConductores,
                        titulo: 'ALMACENES',
                        subtitulo: 'ALMACENES EN TABLA'
                });

                this.exportarExcelFinal(parametros, "reporte Almacen");

        }


        exportarPdf() {

                let parametros = JSON.stringify({
                        datos: this.listaConductores,
                        titulo: 'ALMACENES',
                        subtitulo: 'ALMACENES EN TABLA'
                });
                this.exportarPdfFinal(parametros);


        }

        seleccionar(bean) {
                this.conductorSeleccionado.emit({ bean: bean });
        }


        //**********ACCIONES PARAR FORMULARIO PERSONA********
        abrirModalPersona() {
                if(this.formFindPersona.listaPersonas==null){
                        this.formFindPersona.obtenerPersonas();
                }
                
                this.abrirModal("modalPersona1");
        }

        //**********METODO QUE OBTIENE LOS DATOS EXTERNOS PERSONA *****
        obtenerDatosPersonaExterna(datos) {
                //this.beanSelectedExterno = datos.bean;
                this.personaSelected = datos.bean;
                this.nombrePersonaSelected = this.personaSelected.nombres + " " +
                 this.personaSelected.apellido_paterno + " " + this.personaSelected.apellido_materno;

                this.cerrarModal("modalPersona1");
                this.print("DATOS EXTERNOS: ");
                this.print(datos);
        }


        abrirPanelEditar(bean) {
                if (this.tienePermisoPrintMsj(this.rutas.FORM_CONDUCTOR_VEHICULO, this.rutas.PANEL_EDITAR)) {
                        this.editarConductorAction.emit({ bean: bean });
                }
        }
}