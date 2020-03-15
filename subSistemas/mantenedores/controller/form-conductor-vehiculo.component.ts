import { Component, AfterViewInit, ViewChild, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';

import { ControllerComponent } from '../../../core/controller/controller.component';




/******************IMPORTAR SERVICIOS*************** */


import { ConductorVehiculoService } from '../service/conductor-vehiculo.service';
import { ReportePdfService } from '../../../core/service/reporte-pdf.Service';
import { ReporteExcelService } from '../../../core/service/reporte-excel.Service';

import { Vista } from '../model/Vista';
import { FormFindConductorVehiculoComponent } from './conductor-vehiculo/form-find-conductor-vehiculo.component';
import { FormNewConductorVehiculoComponent } from './conductor-vehiculo/form-new-conductor-vehiculo.component';

declare var $: any;
@Component({
        selector: 'form-conductor-vehiculo',
        templateUrl: '../view/form-conductor-vehiculo.component.html',
        //providers: [AlmacenService,LocalService]
        providers: [ConductorVehiculoService, ReportePdfService, ReporteExcelService]

})

export class FormConductorVehiculoComponent extends ControllerComponent implements AfterViewInit {


        listaConductores: any[];


        idConductorVehiculoSelected: number;
        marcaSelected: string;
        nroPlacaSelected: number;
        nroConstanciaInscripcion: number;
        nroLicenciaConducir: number;
        personaSelected: any;
        nombrePersonaSelected: string;


        //************OBJETO ELEGIDO PARA EDITAR************
        beanSelected: any;

        //***********PANELES DE LOS MANTENEDORES***********

        panelEditarSelected: boolean = false;
        panelListaBeanSelected: boolean = true;


        //*************OBJETOS DEL FORMULARIO PERSONA**************
        activatedSelectedPer: boolean = true;
        beanSelectedExterno: any;


        @Output() conductorSeleccionado = new EventEmitter();
        //@Input() buttonSelected = false;

        @Input() buttonSelected = false;

        @ViewChild(FormFindConductorVehiculoComponent,{static: true}) formFindConductorVehiculo: FormFindConductorVehiculoComponent;
        @ViewChild(FormNewConductorVehiculoComponent,{static: true}) formNewConductorVehiculo: FormNewConductorVehiculoComponent;
       
        constructor(
                public http: Http,
                public router: Router,
                public conductorVehiculoService: ConductorVehiculoService,
                public reportePdfService: ReportePdfService,
                public reporteExcelService: ReporteExcelService
        ) {
                super(router, reportePdfService, reporteExcelService);

                this.panelEditarSelected = false;
        }

        ngOnInit() {
                this.limpiarCampos();
        }


        ngAfterViewInit() {
                if (this.verificarTokenRpta(this.rutasMantenedores.FORM_CONDUCTOR_VEHICULO)) {
                        this.formFindConductorVehiculo.obtenerConductores();
                }
        }

        abrirPanelBuscar() {
                this.panelEditarSelected = false;
                this.panelListaBeanSelected = true;

        }

        abrirPanelRegistrar() {
                this.panelEditarSelected = false;
                this.panelListaBeanSelected = true;
        }

        abrirPanelEditar(pro) {
                if (this.tienePermisoPrintMsj(this.rutas.FORM_CONDUCTOR_VEHICULO, this.rutas.PANEL_EDITAR)) {
                        this.beanSelected = pro;

                        this.idConductorVehiculoSelected = pro.id_conductor_vehiculo;
                        this.marcaSelected = pro.marca;
                        this.nroPlacaSelected = pro.nro_placa;
                        this.nroConstanciaInscripcion = pro.nro_constancia_inscripcion;
                        this.nroLicenciaConducir = pro.nro_licencia_conducir;
                        this.personaSelected = { id_persona: pro.id_persona };
                        this.nombrePersonaSelected = pro.conductor;

                        this.panelEditarSelected = true;
                        this.panelListaBeanSelected = false;
                }
        }


        regresar() {
                this.limpiarCampos();
                this.panelEditarSelected = false;
                this.panelListaBeanSelected = true;
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

        registrar() {

                if (this.tienePermisoPrintMsj(this.rutas.FORM_CONDUCTOR_VEHICULO, this.rutas.BUTTON_REGISTRAR)) {
                        let parametros = JSON.stringify({
                                marca: this.marcaSelected,
                                nro_placa: this.nroPlacaSelected,
                                nro_constancia_inscripcion: this.nroConstanciaInscripcion,
                                nro_licencia_conducir: this.nroLicenciaConducir,
                                id_persona: this.personaSelected == null ? null : this.personaSelected.id_persona
                        });
                        this.conductorVehiculoService.registrar(parametros)
                                .subscribe(
                                data => {

                                        let rpta = data.rpta;
                                        this.print("rpta: " + rpta);
                                        if (rpta != null) {
                                                if (rpta == 1) {
                                                        this.mensajeCorrecto("CONDUCTOR REGISTRADO");
                                                        this.limpiarCampos();
                                                } else {
                                                        this.mensajeInCorrecto(" CONDUCTOR NO REGISTRADO");
                                                }
                                        }

                                        this.obtenerConductores();

                                },
                                error => this.msj = <any>error
                                );
                }
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

        editar() {

                if (this.tienePermisoPrintMsj(this.rutas.FORM_CONDUCTOR_VEHICULO, this.rutas.BUTTON_ACTUALIZAR)) {
                        let parametros = JSON.stringify({
                                marca: this.marcaSelected,
                                nro_placa: this.nroPlacaSelected,
                                nro_constancia_inscripcion: this.nroConstanciaInscripcion,
                                nro_licencia_conducir: this.nroLicenciaConducir,
                                id_persona: this.personaSelected == null ? null : this.personaSelected.id_persona
                        });

                        this.print("parametros: " + parametros);
                        this.conductorVehiculoService.editar(parametros, this.beanSelected.id_conductor_vehiculo)
                                .subscribe(
                                data => {
                                        this.obtenerConductores();
                                        let rpta = data.rpta;
                                        this.print("rpta: " + rpta);
                                        if (rpta != null) {
                                                if (rpta == 1) {
                                                        this.mensajeCorrecto("CONDUCTOR MODIFICADO");
                                                } else {
                                                        this.mensajeInCorrecto("CONDUCTOR NO MOFICADO");
                                                }
                                        }

                                },
                                error => this.msj = <any>error
                                );
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
                this.abrirModal("modalPersona");
        }

        //**********METODO QUE OBTIENE LOS DATOS EXTERNOS PERSONA *****
        obtenerDatosPersonaExterna(datos) {
                this.beanSelectedExterno = datos.bean;
                this.personaSelected = datos.bean;
                this.nombrePersonaSelected = this.beanSelectedExterno.nombres + " " + this.beanSelectedExterno.apellido_paterno + " " + this.beanSelectedExterno.apellido_materno

                this.cerrarModal("modalPersona");
                this.print("DATOS EXTERNOS: ");
                this.print(datos);
        }


        editarConductorAction(data) {
                this.print("bean:");
                this.print(data);

                //this.panelEditarSelected = true;
                //this.formEditPersona.limpiarCampos();
                $('.nav-tabs a[href="#nuevoConductor"]').tab('show');
                this.formNewConductorVehiculo.tituloPanel="Editando Conductor: << Id: "+data.bean.id_conductor_vehiculo+" , Nombres:"+data.bean.conductor+" >>";
                this.formNewConductorVehiculo.setBeanEditar(data.bean);

        }
}