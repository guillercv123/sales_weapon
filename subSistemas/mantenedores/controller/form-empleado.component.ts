import { Component, AfterViewInit, ViewChild, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';

import { ControllerComponent } from '../../../core/controller/controller.component';




/******************IMPORTAR SERVICIOS*************** */


import { EmpleadoService } from '../service/empleado.service';
import { LocalService } from '../service/local.service';
import { FormFindPersonaComponent } from './persona/form-find-persona.component';

declare var $: any;
@Component({
        selector: 'form-empleado',
        templateUrl: '../view/form-empleado.component.html',
        providers: [EmpleadoService,LocalService]

})

export class FormEmpleadoComponent extends ControllerComponent implements AfterViewInit {


        locales: any[];
        localSelected: any;


        listaEmpleados: any[];

        idEmpleadoSelected: any;
        personaSelected: any;
        tipoContratoSelected: any;
        plazaSelected: any;
        fechaAsignacionSelected: any;

        //************OBJETO ELEGIDO PARA EDITAR************
        beanSelected: any;

        //***********PANELES DE LOS MANTENEDORES***********
        panelEditarSelected: boolean = false;
        panelListaBeanSelected: boolean = true;



        //*************OBJETOS DEL FORMULARIO PERSONA**************

        activatedSelectedPer: boolean = true;


        //**********OBJETOS DEL FORMULARIO PLAZA
        activatedSelectedPlaza: boolean = true;

        //**********OBJETOS DEL FORMULARIO PLAZA
        activatedSelectedTipoContrato: boolean = true;



        /*idPersonaSelectedPer: string
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
        */


       @ViewChild(FormFindPersonaComponent,{static: true}) formFindPersona: FormFindPersonaComponent;


        //************OBJETOS QUE SE TRANSMITIRAN**********/
        @Output() empleadoSeleccionado = new EventEmitter();
        @Input() buttonSelectedActivated = false;

        isModal:boolean=false;
        constructor(
                public http: Http,
                public router: Router,
                public empleadoService: EmpleadoService,
                public localService: LocalService
        ) {
                super(router);

                this.panelEditarSelected = false;
        }


        ngOnInit() {
                this.limpiarCampos();
                this.locales = JSON.parse(localStorage.getItem("lista_locales"));
                this.formFindPersona.activatedSelected=true;
        }

        ngAfterViewInit() {
                if (this.verificarTokenRpta(this.rutasMantenedores.FORM_EMPLEADO)) {
                        
                        if(!this.isModal){
                                this.obtenerEmpleados();
                        }      
                }
        }


        
        obtenerLocales() {
                this.localService.getAll()
                        .subscribe(
                        data => {
                                this.locales = data;

                                this.print(data);
                        },
                        error => this.msj = <any>error);
        }


        abrirPanelBuscar() {
                this.panelEditarSelected = false;
                this.panelListaBeanSelected = true;

        }

        abrirPanelRegistrar() {
                this.panelEditarSelected = false;
                this.panelListaBeanSelected = true;
        }



        obtenerLocalActual(id: string) {
                let obj = null;
                let i;
                for (i = 0; i < this.locales.length; i++) {
                        //this.print("this.tipos_producto[i].nombre"+this.tipos_producto[i].nombre+" , nombreTipo: " +nombreTipo);
                        if (this.locales[i].id_local == id) {
                                obj = this.locales[i];
                                break;
                        }
                }
                return obj;
        }


        abrirPanelEditar(pro) {
                if (this.tienePermisoPrintMsj(this.rutas.FORM_EMPLEADO, this.rutas.PANEL_EDITAR)) {
                        this.beanSelected = pro;
                        this.idEmpleadoSelected = pro.id_empleado;
                        this.personaSelected = { id_persona: pro.id_persona, nombres: pro.nombre_empleado };
                        this.fechaAsignacionSelected = pro.fecha_asignacion.substr(0, 10);
                        this.plazaSelected={ id_plaza :pro.id_plaza, nombre: pro.nombre_plaza };
                        this.tipoContratoSelected= {id_tipo_contrato:pro.id_tipo_contrato, nombre: pro.nombre_tipo_contrato};
                        this.localSelected=this.obtenerLocalActual(pro.id_local);
                        this.panelEditarSelected = true;
                        this.panelListaBeanSelected = false;
                }
        }


        regresar() {
                this.limpiarCampos();
                this.panelEditarSelected = false;
                this.panelListaBeanSelected = true;
        }


        obtenerEmpleados() {
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
                        id_empleado: this.idEmpleadoSelected,
                        id_plaza: this.plazaSelected == null ? null : this.plazaSelected.id_plaza,
                        id_tipo_contrato: this.tipoContratoSelected == null ? null : this.tipoContratoSelected.id_tipo_contrato,
                        id_persona: this.personaSelected == null ? null : this.personaSelected.id_persona,
                        fecha_asignacion: this.fechaAsignacionSelected,
                        id_local:this.localSelected==null?null:this.localSelected.id_local
                });

                this.empleadoService.buscarPaginacion(inicio, fin, tamPagina, parametros)
                        .subscribe(
                        data => {
                                this.listaEmpleados = data;

                                this.print(data);
                        },
                        error => this.msj = <any>error);
        }


        registrar() {

                if (this.tienePermisoPrintMsj(this.rutas.FORM_EMPLEADO, this.rutas.BUTTON_REGISTRAR)) {
                        let parametros = JSON.stringify({
                                id_plaza: this.plazaSelected == null ? null : this.plazaSelected.id_plaza,
                                id_tipo_contrato: this.tipoContratoSelected == null ? null : this.tipoContratoSelected.id_tipo_contrato,
                                id_persona: this.personaSelected == null ? null : this.personaSelected.id_persona,
                                fecha_asignacion: this.fechaAsignacionSelected,
                                id_local:this.localSelected==null?null:this.localSelected.id_local
                        });
                        this.empleadoService.registrar(parametros)
                                .subscribe(
                                data => {

                                        let rpta = data.rpta;
                                        this.print("rpta: " + rpta);
                                        if (rpta != null) {
                                                if (rpta == 1) {
                                                        this.mensajeCorrecto("EMPLEADO REGISTRADO");
                                                        this.limpiarCampos();
                                                } else {
                                                        this.mensajeInCorrecto("EMPLEADO NO REGISTRADO");
                                                }
                                        }

                                        this.obtenerEmpleados();

                                },
                                error => this.msj = <any>error
                                );
                }
        }

        buscar() {
                if (this.tienePermisoPrintMsj(this.rutas.FORM_EMPLEADO, this.rutas.BUTTON_BUSCAR)) {
                        this.getTotalLista();
                        this.seleccionarByPagina(this.inicio, this.fin, this.tamPagina);
                }
        }



        getTotalLista() {
                let parametros = JSON.stringify({
                        id_empleado: this.idEmpleadoSelected,
                        id_plaza: this.plazaSelected == null ? null : this.plazaSelected.id_plaza,
                        id_tipo_contrato: this.tipoContratoSelected == null ? null : this.tipoContratoSelected.id_tipo_contrato,
                        id_persona: this.personaSelected == null ? null : this.personaSelected.id_persona,
                        fecha_asignacion: this.fechaAsignacionSelected
                });

                this.print("parametros total: " + parametros);
                this.empleadoService.getTotalParametros(parametros)
                        .subscribe(
                        data => {
                                this.totalLista = data;
                                this.print("total:" + data);
                        },
                        error => this.msj = <any>error);
        }


        eliminar(bean) {

                if (this.tienePermisoPrintMsj(this.rutas.FORM_EMPLEADO, this.rutas.BUTTON_ELIMINAR)) {
                        if( confirm("Realmente Desea Eliminar ?")){
                        this.empleadoService.eliminarLogico(bean.id_empleado)
                                .subscribe(
                                data => {
                                        this.obtenerEmpleados();
                                        let rpta = data;
                                        if (rpta != null) {
                                                if (rpta == 1) {
                                                        this.mensajeCorrecto("EMPLEADO ELIMINADO CORRECTAMENTE");
                                                } else {
                                                        this.mensajeInCorrecto("EMPLEADO NO ELIMINADO");
                                                }

                                        }
                                },
                                error => this.msj = <any>error);
                        }
                }
        }




        editar() {

                if (this.tienePermisoPrintMsj(this.rutas.FORM_EMPLEADO, this.rutas.BUTTON_ACTUALIZAR)) {
                        let parametros = JSON.stringify({
                                id_plaza: this.plazaSelected == null ? null : this.plazaSelected.id_plaza,
                                id_tipo_contrato: this.tipoContratoSelected == null ? null : this.tipoContratoSelected.id_tipo_contrato,
                                id_persona: this.personaSelected == null ? null : this.personaSelected.id_persona,
                                fecha_asignacion: this.fechaAsignacionSelected,
                                id_local:this.localSelected==null?null:this.localSelected.id_local
                        });

                        this.print("parametros: " + parametros);
                        this.empleadoService.editar(parametros, this.beanSelected.id_empleado)
                                .subscribe(
                                data => {
                                        this.obtenerEmpleados();
                                        let rpta = data.rpta;
                                        this.print("rpta: " + rpta);
                                        if (rpta != null) {
                                                if (rpta == 1) {
                                                        this.mensajeCorrecto("EMPLEADO MODIFICADO");
                                                } else {
                                                        this.mensajeInCorrecto("EMPLEADO NO MOFICADO");
                                                }
                                        }

                                },
                                error => this.msj = <any>error
                                );
                }

        }



        limpiarCampos() {
                this.idEmpleadoSelected = null;
                this.personaSelected = null;
                this.fechaAsignacionSelected = null;
                this.tipoContratoSelected = null;
                this.plazaSelected = null;
                this.localSelected=null;
        }

        elegirFila(lista, i) {
                this.marcar(lista, i);
        }




        //**********ACCIONES PARAR FORMULARIO PERSONA********
        abrirModalPersona() {
                this.abrirModal("modalPersona");
                this.formFindPersona.obtenerPersonas();
        }

        //**********ACCIONES PARAR FORMULARIO PLAZA********
        abrirModalPlaza() {
                this.abrirModal("modalPlaza");
        }


        //**********ACCIONES PARAR FORMULARIO TIPO CONTRATO********
        abrirModalTipoContrato() {
                this.abrirModalPorc("modalTipoContrato",90);
        }



        //**********METODO QUE OBTIENE LOS DATOS EXTERNOS 
        obtenerPersonaDatosExternos(datos) {
                this.personaSelected = datos.bean;

                this.cerrarModal("modalPersona");
                this.print("DATOS EXTERNOS: ");
                this.print(datos);


                /* this.idPersonaSelected = this.beanSelected.id_persona;
                 this.nombresSelected = this.beanSelected.nombres;
                 this.apellidoPaternoSelected = this.beanSelected.apellido_paterno;
                 this.apellidoMaternoSelected = this.beanSelected.apellido_materno;
                 this.numeroDocumentoSelected = this.beanSelected.numero_documento;
                 this.direccionSelected = this.beanSelected.direccion;
                 this.telefonoSelected = this.beanSelected.telefono;
                 this.correoSelected = this.beanSelected.correo;*/

        }


        obtenerPlazaDatosExternos(datos) {
                this.plazaSelected = datos.bean;
                this.print("datos Cargo");
                this.print(datos);
                this.cerrarModal("modalPlaza");

        }

        obtenerTipoContratoDatosExternos(datos) {
                this.tipoContratoSelected = datos.bean;
                this.print("datos Cargo");
                this.print(datos);
                this.cerrarModal("modalTipoContrato");

        }


        seleccionar(bean) {
                this.empleadoSeleccionado.emit({ bean: bean });
        }
}