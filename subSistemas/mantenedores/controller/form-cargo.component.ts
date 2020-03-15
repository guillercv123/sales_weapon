import { Component, AfterViewInit, ViewChild, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';

import { ControllerComponent } from '../../../core/controller/controller.component';




/******************IMPORTAR SERVICIOS*************** */


import { CargoService } from '../service/cargo.service';


import { Vista } from '../model/Vista';

declare var $: any;
@Component({
        selector: 'form-cargo',
        templateUrl: '../view/form-cargo.component.html',
        providers: [CargoService]

})

export class FormCargoComponent extends ControllerComponent implements AfterViewInit {



        listaCargos: any[];

        nombreSelected: any;
        unidadEmpresaSelected: any;
        idCargoSelected: any;

        //************OBJETO ELEGIDO PARA EDITAR************
        beanSelected: any;

        //***********PANELES DE LOS MANTENEDORES***********

        panelEditarSelected: boolean = false;
        panelListaBeanSelected: boolean = true;


        buttonSelectedActivatedUniEmpre: boolean = true;


        //************OBJETOS QUE SE TRANSMITIRAN**********/
        @Output() cargoSeleccionado = new EventEmitter();
        @Input() buttonSelectedActivated = false

        constructor(
                public http: Http,
                public router: Router,
                public cargoService: CargoService
        ) {
                super(router);

                this.panelEditarSelected = false;
        }


        ngOnInit() {
                this.limpiarCampos();
        }

        ngAfterViewInit() {
                if (this.verificarTokenRpta(this.rutasMantenedores.FORM_CARGO)) {
                        this.obtenerCargos();
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
                if (this.tienePermisoPrintMsj(this.rutas.FORM_CARGO, this.rutas.PANEL_EDITAR)) {

                        this.beanSelected = pro;
                        this.nombreSelected = pro.nombre;
                        this.unidadEmpresaSelected = { id_unidad_empresa: pro.id_unidad_empresa, nombre: pro.nombre_unidad_empresa },
                                this.idCargoSelected = pro.id_cargo;

                        this.panelEditarSelected = true;
                        this.panelListaBeanSelected = false;
                }
        }


        regresar() {
                this.limpiarCampos();
                this.panelEditarSelected = false;
                this.panelListaBeanSelected = true;
        }


        obtenerCargos() {
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
                        nombre: this.nombreSelected,
                        id_unidad_empresa: this.unidadEmpresaSelected == null ? null : this.unidadEmpresaSelected.id_unidad_empresa,
                        id_cargo: this.idCargoSelected
                });

                this.cargoService.buscarPaginacion(inicio, fin, tamPagina, parametros)
                        .subscribe(
                        data => {
                                this.listaCargos = data;

                                this.print(data);
                        },
                        error => this.msj = <any>error);
        }


        registrar() {

                if (this.tienePermisoPrintMsj(this.rutas.FORM_CARGO, this.rutas.BUTTON_REGISTRAR)) {
                        let parametros = JSON.stringify({
                                nombre: this.nombreSelected,
                                id_unidad_empresa: this.unidadEmpresaSelected == null ? null : this.unidadEmpresaSelected.id_unidad_empresa,
                        });
                        this.cargoService.registrar(parametros)
                                .subscribe(
                                data => {

                                        let rpta = data.rpta;
                                        this.print("rpta: " + rpta);
                                        if (rpta != null) {
                                                if (rpta == 1) {
                                                        this.mensajeCorrecto("CARGO REGISTRADO");
                                                        this.limpiarCampos();
                                                } else {
                                                        this.mensajeInCorrecto("CARGO NO REGISTRADO");
                                                }
                                        }

                                        this.obtenerCargos();

                                },
                                error => this.msj = <any>error
                                );
                }
        }

        buscar() {
                if (this.tienePermisoPrintMsj(this.rutas.FORM_CARGO, this.rutas.BUTTON_BUSCAR)) {
                        this.getTotalLista();
                        this.seleccionarByPagina(this.inicio, this.fin, this.tamPagina);
                }
        }



        getTotalLista() {
                /*this.productoService.getTotal()
                        .subscribe(
                        data => {
                                this.totalLista = data;
                                this.print(data);
                        },
                        error => this.msj = <any>error);*/
                let parametros = JSON.stringify({
                        nombre: this.nombreSelected,
                        id_unidad_empresa: this.unidadEmpresaSelected == null ? null : this.unidadEmpresaSelected.id_unidad_empresa,
                        id_cargo: this.idCargoSelected
                });

                this.print("parametros total: " + parametros);
                this.cargoService.getTotalParametros(parametros)
                        .subscribe(
                        data => {
                                this.totalLista = data;
                                this.print("total:" + data);
                        },
                        error => this.msj = <any>error);
        }


        eliminar(bean) {

                if (this.tienePermisoPrintMsj(this.rutas.FORM_CARGO, this.rutas.BUTTON_ELIMINAR)) {
                        if( confirm("Realmente Desea Eliminar ?")){
                        this.cargoService.eliminarLogico(bean.id_aplicacion)
                                .subscribe(
                                data => {
                                        this.obtenerCargos();
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
                if (this.tienePermisoPrintMsj(this.rutas.FORM_CARGO, this.rutas.BUTTON_ACTUALIZAR)) {
                        let parametros = JSON.stringify({
                                nombre: this.nombreSelected,
                                id_unidad_empresa: this.unidadEmpresaSelected == null ? null : this.unidadEmpresaSelected.id_unidad_empresa,
                        });

                        this.print("parametros: " + parametros);
                        this.cargoService.editar(parametros, this.beanSelected.id_cargo)
                                .subscribe(
                                data => {
                                        this.obtenerCargos();
                                        let rpta = data.rpta;
                                        this.print("rpta: " + rpta);
                                        if (rpta != null) {
                                                if (rpta == 1) {
                                                        this.mensajeCorrecto("CARGO MODIFICADO");
                                                } else {
                                                        this.mensajeInCorrecto("CARGO NO MOFICADO");
                                                }
                                        }

                                },
                                error => this.msj = <any>error
                                );
                }

        }



        limpiarCampos() {
                this.nombreSelected = null;
                this.unidadEmpresaSelected = null;
                this.idCargoSelected = null;
        }

        elegirFila(lista, i) {
                this.marcar(lista, i);
        }

        abrirModalUnidadEmpresa() {
                this.abrirModal("modalUnidadEmpresa");
        }

        obtenerUnidadEmpresaDatosExternos(datos) {
                this.unidadEmpresaSelected = datos.bean;
                this.print("datos Empresa");
                this.print(datos);
                this.cerrarModal("modalUnidadEmpresa");

        }

        seleccionar(bean) {
                this.cargoSeleccionado.emit({ bean: bean });
        }
}