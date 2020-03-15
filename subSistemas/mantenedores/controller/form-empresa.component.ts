import { Component, AfterViewInit, ViewChild, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';

import { ControllerComponent } from '../../../core/controller/controller.component';




/******************IMPORTAR SERVICIOS*************** */


import { EmpresaService } from '../service/empresa.service';

declare var $: any;
@Component({
        selector: 'form-empresa',
        templateUrl: '../view/form-empresa.component.html',
        providers: [EmpresaService]

})

export class FormEmpresaComponent extends ControllerComponent implements AfterViewInit {


        listaEmpresas: any[];

        idEmpresaSelected: any;
        nombreSelected: any;
        rucSelected: any;
        direccionSelected: any;
        telefonoSelected: any;
        correoSelected: any;
        fechaSelected: any;

        //************OBJETO ELEGIDO PARA EDITAR************
        beanSelected: any;

        //***********PANELES DE LOS MANTENEDORES***********

        panelEditarSelected: boolean = false;
        panelListaBeanSelected: boolean = true;

        //************OBJETOS QUE SE TRANSMITIRAN**********/
        @Output() empresaSeleccionada = new EventEmitter();
        @Input() buttonSelectedActivated = false;

        constructor(
                public http: Http,
                public router: Router,
                public empresaService: EmpresaService
        ) {
                super(router);

                this.panelEditarSelected = false;
        }


        ngOnInit() {
                this.limpiarCampos();
        }

        ngAfterViewInit() {
                if (this.verificarTokenRpta(this.rutasMantenedores.FORM_EMPRESA)) {
                        this.obtenerEmpresas();
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

                if (this.tienePermisoPrintMsj(this.rutas.FORM_EMPRESA, this.rutas.PANEL_EDITAR)) {
                        this.beanSelected = pro;
                        this.idEmpresaSelected = pro.id_empresa;
                        this.nombreSelected = pro.nombre;
                        this.rucSelected = pro.ruc;
                        this.direccionSelected = pro.direccion;
                        this.telefonoSelected = pro.telefono;
                        this.correoSelected = pro.correo;

                        this.panelEditarSelected = true;
                        this.panelListaBeanSelected = false;
                }
        }


        regresar() {
                this.limpiarCampos();
                this.panelEditarSelected = false;
                this.panelListaBeanSelected = true;
        }


        obtenerEmpresas() {
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
                        id_empresa: this.idEmpresaSelected,
                        nombre: this.nombreSelected,
                        ruc: this.rucSelected,
                        direccion: this.direccionSelected,
                        telefono: this.telefonoSelected,
                        correo: this.correoSelected,
                        fecha: this.fechaSelected
                });

                this.empresaService.buscarPaginacion(inicio, fin, tamPagina, parametros)
                        .subscribe(
                        data => {
                                this.listaEmpresas = data;

                                this.print(data);
                        },
                        error => this.msj = <any>error);
        }


        registrar() {

                if (this.tienePermisoPrintMsj(this.rutas.FORM_EMPRESA, this.rutas.BUTTON_REGISTRAR)) {
                        let parametros = JSON.stringify({
                                nombre: this.nombreSelected,
                                ruc: this.rucSelected,
                                direccion: this.direccionSelected,
                                telefono: this.telefonoSelected,
                                correo: this.correoSelected
                        });
                        this.empresaService.registrar(parametros)
                                .subscribe(
                                data => {

                                        let rpta = data.rpta;
                                        this.print("rpta: " + rpta);
                                        if (rpta != null) {
                                                if (rpta == 1) {
                                                        this.mensajeCorrecto("EMPRESA REGISTRADA");
                                                        this.limpiarCampos();
                                                } else {
                                                        this.mensajeInCorrecto("EMPRESA NO REGISTRADA");
                                                }
                                        }

                                        this.obtenerEmpresas();

                                },
                                error => this.msj = <any>error
                                );
                }
        }

        buscar() {
                if (this.tienePermisoPrintMsj(this.rutas.FORM_EMPRESA, this.rutas.BUTTON_BUSCAR)) {
                        this.getTotalLista();
                        this.seleccionarByPagina(this.inicio, this.fin, this.tamPagina);
                }
        }



        getTotalLista() {
                let parametros = JSON.stringify({
                        id_empresa: this.idEmpresaSelected,
                        nombre: this.nombreSelected,
                        ruc: this.rucSelected,
                        direccion: this.direccionSelected,
                        telefono: this.telefonoSelected,
                        correo: this.correoSelected,
                        fecha: this.fechaSelected
                });

                this.print("parametros total: " + parametros);
                this.empresaService.getTotalParametros(parametros)
                        .subscribe(
                        data => {
                                this.totalLista = data;
                                this.print("total:" + data);
                        },
                        error => this.msj = <any>error);
        }


        eliminar(bean) {
                if (this.tienePermisoPrintMsj(this.rutas.FORM_EMPRESA, this.rutas.BUTTON_ELIMINAR)) {
                        if( confirm("Realmente Desea Eliminar ?")){
                        this.empresaService.eliminarLogico(bean.id_empresa)
                                .subscribe(
                                data => {
                                        this.obtenerEmpresas();
                                        let rpta = data;
                                        if (rpta != null) {
                                                if (rpta == 1) {
                                                        this.mensajeCorrecto("APLICACION ELIMINADO CORRECTAMENTE");
                                                } else {
                                                        this.mensajeInCorrecto("APLICACION NO ELIMINADO");
                                                }

                                        }
                                },
                                error => this.msj = <any>error);
                        }
                }
        }




        editar() {

                if (this.tienePermisoPrintMsj(this.rutas.FORM_EMPRESA, this.rutas.BUTTON_ACTUALIZAR)) {
                        let parametros = JSON.stringify({
                                nombre: this.nombreSelected,
                                ruc: this.rucSelected,
                                direccion: this.direccionSelected,
                                telefono: this.telefonoSelected,
                                correo: this.correoSelected
                        });

                        this.print("parametros: " + parametros);
                        this.empresaService.editar(parametros, this.beanSelected.id_empresa)
                                .subscribe(
                                data => {
                                        this.obtenerEmpresas();
                                        let rpta = data.rpta;
                                        this.print("rpta: " + rpta);
                                        if (rpta != null) {
                                                if (rpta == 1) {
                                                        this.mensajeCorrecto("EMPRESA MODIFICADA");
                                                } else {
                                                        this.mensajeInCorrecto("EMPRESA NO MOFICADA");
                                                }
                                        }

                                },
                                error => this.msj = <any>error
                                );
                }

        }



        limpiarCampos() {
                this.idEmpresaSelected = null;
                this.nombreSelected = null;
                this.rucSelected = null;
                this.direccionSelected = null;
                this.telefonoSelected = null;
                this.correoSelected = null;
                this.fechaSelected = null;
        }

        elegirFila(lista, i) {
                this.marcar(lista, i);
        }


        seleccionar(bean) {
                this.empresaSeleccionada.emit({ bean: bean });
        }
}