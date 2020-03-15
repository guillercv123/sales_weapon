import { Component, AfterViewInit, ViewChild, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';

import { ControllerComponent } from '../../../core/controller/controller.component';




/******************IMPORTAR SERVICIOS*************** */


import { TipoContratoService } from '../service/tipo-contrato.service';


import { Vista } from '../model/Vista';

declare var $: any;
@Component({
        selector: 'form-tipo-contrato',
        templateUrl: '../view/form-tipo-contrato.component.html',
        providers: [TipoContratoService]

})

export class FormTipoContratoComponent extends ControllerComponent implements AfterViewInit {



        listaTiposContrato: any[];

        idTipoContratoSelected: any;
        nombreSelected: any;
        fechaCreacionSelected: any;

        //************OBJETO ELEGIDO PARA EDITAR************
        beanSelected: any;

        //***********PANELES DE LOS MANTENEDORES***********

        panelEditarSelected: boolean = false;
        panelListaBeanSelected: boolean = true;


        //************OBJETOS QUE SE TRANSMITIRAN**********/
        @Output() tipoContratoSeleccionado = new EventEmitter();
        @Input() buttonSelectedActivated = false

        constructor(
                public http: Http,
                public router: Router,
                public tipoContratoService: TipoContratoService
        ) {
                super(router);

                this.panelEditarSelected = false;
        }


        ngOnInit() {
                this.limpiarCampos();
        }

        ngAfterViewInit() {
                if (this.verificarTokenRpta(this.rutasMantenedores.FORM_TIPO_CONTRATO)) {
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
                if (this.tienePermisoPrintMsj(this.rutas.FORM_TIPO_CONTRATO, this.rutas.PANEL_EDITAR)) {
                        this.beanSelected = pro;

                        this.nombreSelected = pro.nombre;
                        this.fechaCreacionSelected = null ? null : pro.fecha_creacion.substr(0, 10);

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
                        id_tipo_contrato: this.idTipoContratoSelected,
                        nombre: this.nombreSelected,
                        fecha_creacion: this.fechaCreacionSelected

                });

                this.tipoContratoService.buscarPaginacion(inicio, fin, tamPagina, parametros)
                        .subscribe(
                        data => {
                                this.listaTiposContrato = data;

                                this.print(data);
                        },
                        error => this.msj = <any>error);
        }


        registrar() {

                if (this.tienePermisoPrintMsj(this.rutas.FORM_TIPO_CONTRATO, this.rutas.BUTTON_REGISTRAR)) {
                        let parametros = JSON.stringify({
                                nombre: this.nombreSelected
                        });
                        this.tipoContratoService.registrar(parametros)
                                .subscribe(
                                data => {

                                        let rpta = data.rpta;
                                        this.print("rpta: " + rpta);
                                        if (rpta != null) {
                                                if (rpta == 1) {
                                                        this.mensajeCorrecto("TIPO CONTRATO REGISTRADO");
                                                        this.limpiarCampos();
                                                } else {
                                                        this.mensajeInCorrecto("TIPO CONTRATO NO REGISTRADO");
                                                }
                                        }

                                        this.obtenerCargos();

                                },
                                error => this.msj = <any>error
                                );
                }
        }

        buscar() {
                if (this.tienePermisoPrintMsj(this.rutas.FORM_TIPO_CONTRATO, this.rutas.BUTTON_BUSCAR)) {
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
                        id_tipo_contrato: this.idTipoContratoSelected,
                        nombre: this.nombreSelected,
                        fecha_creacion: this.fechaCreacionSelected
                });

                this.print("parametros total: " + parametros);
                this.tipoContratoService.getTotalParametros(parametros)
                        .subscribe(
                        data => {
                                this.totalLista = data;
                                this.print("total:" + data);
                        },
                        error => this.msj = <any>error);
        }


        eliminar(bean) {

                if (this.tienePermisoPrintMsj(this.rutas.FORM_TIPO_CONTRATO, this.rutas.BUTTON_ELIMINAR)) {
                        if( confirm("Realmente Desea Eliminar ?")){
                        this.tipoContratoService.eliminarLogico(bean.id_tipo_contrato)
                                .subscribe(
                                data => {
                                        this.obtenerCargos();
                                        let rpta = data;
                                        if (rpta != null) {
                                                if (rpta == 1) {
                                                        this.mensajeCorrecto("TIPO CONTRATO ELIMINADO CORRECTAMENTE");
                                                } else {
                                                        this.mensajeInCorrecto("TIPO CONTRATO NO ELIMINADO");
                                                }

                                        }
                                },
                                error => this.msj = <any>error);
                        }
                }
        }




        editar() {

                if (this.tienePermisoPrintMsj(this.rutas.FORM_TIPO_CONTRATO, this.rutas.BUTTON_ACTUALIZAR)) {
                        let parametros = JSON.stringify({
                                nombre: this.nombreSelected
                        });

                        this.print("parametros: " + parametros);
                        this.tipoContratoService.editar(parametros, this.beanSelected.id_tipo_contrato)
                                .subscribe(
                                data => {
                                        this.obtenerCargos();
                                        let rpta = data.rpta;
                                        this.print("rpta: " + rpta);
                                        if (rpta != null) {
                                                if (rpta == 1) {
                                                        this.mensajeCorrecto("TIPO CONTRATO MODIFICADO");
                                                } else {
                                                        this.mensajeInCorrecto("TIPO CONTRATO NO MOFICADO");
                                                }
                                        }

                                },
                                error => this.msj = <any>error
                                );
                }

        }



        limpiarCampos() {
                this.idTipoContratoSelected = null;
                this.nombreSelected = null;
                this.fechaCreacionSelected = null;
        }

        elegirFila(lista, i) {
                this.marcar(lista, i);
        }

        seleccionar(bean) {
                this.tipoContratoSeleccionado.emit({ bean: bean });
        }

}