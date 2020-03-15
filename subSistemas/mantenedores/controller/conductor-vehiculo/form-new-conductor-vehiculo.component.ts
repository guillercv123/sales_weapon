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
        selector: 'form-new-conductor-vehiculo',
        templateUrl: '../../view/conductor-vehiculo/form-new-conductor-vehiculo.component.html',
        //providers: [AlmacenService,LocalService]
        providers: [ConductorVehiculoService, ReportePdfService, ReporteExcelService]

})

export class FormNewConductorVehiculoComponent extends ControllerComponent implements AfterViewInit {

        idConductorVehiculoSelected: number;
        marcaSelected: string;
        nroPlacaSelected: number;
        nroConstanciaInscripcion: number;
        nroLicenciaConducir: number;
        personaSelected: any;
        nombrePersonaSelected: string;

        tituloPanel:string="Registro Conductor Vehiculo";
        //************OBJETO ELEGIDO PARA EDITAR************
        //beanSelected: any;


        //@Output() conductorSeleccionado = new EventEmitter();
        //@Input() buttonSelected = false;

        //@Input() buttonSelected = false;

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
                }
        }

        

        setBeanEditar(pro) {
                        //this.beanSelected = pro;

                        this.idConductorVehiculoSelected = pro.id_conductor_vehiculo;
                        this.marcaSelected = pro.marca;
                        this.nroPlacaSelected = pro.nro_placa;
                        this.nroConstanciaInscripcion = pro.nro_constancia_inscripcion;
                        this.nroLicenciaConducir = pro.nro_licencia_conducir;
                        this.personaSelected = { id_persona: pro.id_persona };
                        this.nombrePersonaSelected = pro.conductor;
               
        }


        limpiar() {
                this.limpiarCampos();
        }


        guardar(){
                if(this.idConductorVehiculoSelected==null){
                        this.registrar();
                }else{
                        this.editar();
                }
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


                                },
                                error => this.msj = <any>error
                                );
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
                        this.conductorVehiculoService.editar(parametros, this.idConductorVehiculoSelected)
                                .subscribe(
                                data => {
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
                this.tituloPanel="Registro Conductor Vehiculo";
        }





        //**********ACCIONES PARAR FORMULARIO PERSONA********
        abrirModalPersona() {
                if(this.formFindPersona.listaPersonas==null){
                        this.formFindPersona.obtenerPersonas();
                }
                

                this.abrirModal("modalPersonaNew");
        }

        //**********METODO QUE OBTIENE LOS DATOS EXTERNOS PERSONA *****
        obtenerDatosPersonaExterna(datos) {
                //this.beanSelectedExterno = datos.bean;
                this.personaSelected = datos.bean;
                this.nombrePersonaSelected = this.personaSelected.nombres + " " + 
                this.personaSelected.apellido_paterno + " " + this.personaSelected.apellido_materno

                this.cerrarModal("modalPersonaNew");
                this.print("DATOS EXTERNOS: ");
                this.print(datos);
        }

}