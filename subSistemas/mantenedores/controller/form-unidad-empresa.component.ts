import { Component, AfterViewInit, ViewChild, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';

import { ControllerComponent } from '../../../core/controller/controller.component';




/******************IMPORTAR SERVICIOS*************** */


import { UnidadEmpresaService } from '../service/unidad-empresa.service';


import { Vista } from '../model/Vista';

declare var $: any;
@Component({
        selector: 'form-unidad-empresa',
        templateUrl: '../view/form-unidad-empresa.component.html',
        providers: [UnidadEmpresaService]

})

export class FormUnidadEmpresaComponent extends ControllerComponent implements AfterViewInit {


        listaUnidadesEmpresa: any[];
        listaUnidadesEmpresaTotal: any[];

        idUnidadEmpresaSelected: any;
        nombreSelected: any;
        inicialesSelected: any;
        ubicacionSelected: any;
        //idEmpresaSelected: any;
        empresaSelected: any;
        superUnidadEmpresaSelected: any;
        informalSelected: boolean = false;


        //************OBJETO ELEGIDO PARA EDITAR************
        beanSelected: any;

        //***********PANELES DE LOS MANTENEDORES***********

        panelEditarSelected: boolean = false;
        panelListaBeanSelected: boolean = true;

        buttonSelectedActivatedEmpre: boolean = true;

        //************OBJETOS QUE SE TRANSMITIRAN**********/
        @Output() unidadEmpresaSeleccionada = new EventEmitter();
        @Input() buttonSelectedActivated = false;

        constructor(
                public http: Http,
                public router: Router,
                public unidadEmpresaService: UnidadEmpresaService
        ) {
                super(router);

                this.panelEditarSelected = false;
        }


        ngOnInit() {
                this.limpiarCampos();
        }

        ngAfterViewInit() {
                if (this.verificarTokenRpta(this.rutasMantenedores.FORM_UNIDAD_EMPRESA)) {
                        this.obtenerUnidadesEmpresa();
                        this.obtenerUnidadesEmpresaTotal();
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
                if (this.tienePermisoPrintMsj(this.rutas.FORM_UNIDAD_EMPRESA, this.rutas.PANEL_EDITAR)) {
                        this.beanSelected = pro;

                        this.idUnidadEmpresaSelected = pro.id_unidad_empresa;
                        this.nombreSelected = pro.nombre;
                        this.inicialesSelected = pro.iniciales;
                        this.ubicacionSelected = pro.ubicacion;
                        this.empresaSelected = { id_empresa: pro.id_empresa, nombre: pro.nombre_empresa }
                        this.superUnidadEmpresaSelected = this.obtenerSuperUnidadActual(pro.id_super_unidad_empresa);
                        this.informalSelected = pro.informal;
                        this.panelEditarSelected = true;
                        this.panelListaBeanSelected = false;
                }
        }


        obtenerSuperUnidadActual(id_unidad_empresa: string) {
                let obj = null;
                let i;
                for (i = 0; i < this.listaUnidadesEmpresaTotal.length; i++) {
                        //this.print("this.tipos_producto[i].nombre"+this.tipos_producto[i].nombre+" , nombreTipo: " +nombreTipo);
                        if (this.listaUnidadesEmpresaTotal[i].id_unidad_empresa == id_unidad_empresa) {
                                obj = this.listaUnidadesEmpresaTotal[i];
                                break;
                        }
                }
                return obj;
        }


        regresar() {
                this.limpiarCampos();
                this.panelEditarSelected = false;
                this.panelListaBeanSelected = true;
        }


        obtenerUnidadesEmpresa() {
                this.getTotalLista();
                this.limpiarCampos();
                this.seleccionarByPagina(this.inicio, this.fin, this.tamPagina);
        }

        obtenerUnidadesEmpresaTotal() {
                this.unidadEmpresaService.getAll()
                        .subscribe(
                        data => {
                                this.listaUnidadesEmpresaTotal = data;

                                this.print(data);
                        },
                        error => this.msj = <any>error);
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
                        id_unidad_empresa: this.idUnidadEmpresaSelected,
                        nombre: this.nombreSelected,
                        iniciales: this.inicialesSelected,
                        ubicacion: this.ubicacionSelected,
                        id_empresa: this.empresaSelected == null ? null : this.empresaSelected.id_empresa,
                        id_super_unidad_empresa: this.superUnidadEmpresaSelected == null ? null : this.superUnidadEmpresaSelected.id_unidad_empresa,
                        informal: this.informalSelected
                });

                this.unidadEmpresaService.buscarPaginacion(inicio, fin, tamPagina, parametros)
                        .subscribe(
                        data => {
                                this.listaUnidadesEmpresa = data;

                                this.print(data);
                        },
                        error => this.msj = <any>error);
        }


        registrar() {

                if (this.tienePermisoPrintMsj(this.rutas.FORM_UNIDAD_EMPRESA, this.rutas.BUTTON_REGISTRAR)) {
                        let parametros = JSON.stringify({
                                nombre: this.nombreSelected,
                                iniciales: this.inicialesSelected,
                                ubicacion: this.ubicacionSelected,
                                id_empresa: this.empresaSelected == null ? null : this.empresaSelected.id_empresa,
                                id_super_unidad_empresa: this.superUnidadEmpresaSelected == null ? null : this.superUnidadEmpresaSelected.id_unidad_empresa,
                                informal: this.informalSelected
                        });
                        this.unidadEmpresaService.registrar(parametros)
                                .subscribe(
                                data => {

                                        let rpta = data.rpta;
                                        this.print("rpta: " + rpta);
                                        if (rpta != null) {
                                                if (rpta == 1) {
                                                        this.mensajeCorrecto("UNIDA EMPRESA REGISTRADA");
                                                        this.limpiarCampos();
                                                } else {
                                                        this.mensajeInCorrecto("UNIDA EMPRESA NO REGISTRADA");
                                                }
                                        }

                                        this.obtenerUnidadesEmpresa();

                                },
                                error => this.msj = <any>error
                                );
                }
        }

        buscar() {
                if (this.tienePermisoPrintMsj(this.rutas.FORM_UNIDAD_EMPRESA, this.rutas.BUTTON_BUSCAR)) {
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
                        id_unidad_empresa: this.idUnidadEmpresaSelected,
                        nombre: this.nombreSelected,
                        iniciales: this.inicialesSelected,
                        ubicacion: this.ubicacionSelected,
                        id_empresa: this.empresaSelected == null ? null : this.empresaSelected.id_empresa,
                        id_super_unidad_empresa: this.superUnidadEmpresaSelected == null ? null : this.superUnidadEmpresaSelected.id_unidad_empresa,
                        informal: this.informalSelected
                });

                this.print("parametros total: " + parametros);
                this.unidadEmpresaService.getTotalParametros(parametros)
                        .subscribe(
                        data => {
                                this.totalLista = data;
                                this.print("total:" + data);
                        },
                        error => this.msj = <any>error);
        }


        eliminar(bean) {

                if (this.tienePermisoPrintMsj(this.rutas.FORM_UNIDAD_EMPRESA, this.rutas.BUTTON_ELIMINAR)) {
                        if( confirm("Realmente Desea Eliminar ?")){
                        this.unidadEmpresaService.eliminarLogico(bean.id_unidad_empresa)
                                .subscribe(
                                data => {
                                        this.obtenerUnidadesEmpresa();
                                        let rpta = data;
                                        if (rpta != null) {
                                                if (rpta == 1) {
                                                        this.mensajeCorrecto("UNIDAD EMPRESA ELIMINADA CORRECTAMENTE");
                                                } else {
                                                        this.mensajeInCorrecto("UNIDAD EMPRESA NO ELIMINADA");
                                                }

                                        }
                                },
                                error => this.msj = <any>error);
                        }
                }
        }




        editar() {

                if (this.tienePermisoPrintMsj(this.rutas.FORM_UNIDAD_EMPRESA, this.rutas.BUTTON_ACTUALIZAR)) {
                        let parametros = JSON.stringify({
                                nombre: this.nombreSelected,
                                iniciales: this.inicialesSelected,
                                ubicacion: this.ubicacionSelected,
                                id_empresa: this.empresaSelected == null ? null : this.empresaSelected.id_empresa,
                                id_super_unidad_empresa: this.superUnidadEmpresaSelected == null ? null : this.superUnidadEmpresaSelected.id_unidad_empresa,
                                informal: this.informalSelected
                        });

                        this.print("parametros: " + parametros);
                        this.unidadEmpresaService.editar(parametros, this.beanSelected.id_unidad_empresa)
                                .subscribe(
                                data => {
                                        this.obtenerUnidadesEmpresa();
                                        let rpta = data.rpta;
                                        this.print("rpta: " + rpta);
                                        if (rpta != null) {
                                                if (rpta == 1) {
                                                        this.mensajeCorrecto("UNIDAD EMPRESA MODIFICADA");
                                                } else {
                                                        this.mensajeInCorrecto("UNIDAD EMPRESA NO MOFICADA");
                                                }
                                        }

                                },
                                error => this.msj = <any>error
                                );
                }

        }



        limpiarCampos() {
                this.idUnidadEmpresaSelected = null;
                this.nombreSelected = null;
                this.inicialesSelected = null;
                this.ubicacionSelected = null;
                this.empresaSelected = null;
                this.superUnidadEmpresaSelected = null;
                this.informalSelected = null;
        }

        elegirFila(lista, i) {
                this.marcar(lista, i);
        }


        //**********ACCIONES PARAR FORMULARIO Cliente********
        abrirModalEmpresa() {
                this.abrirModal("modalEmpresa");
        }


        obtenerEmpresaDatosExternos(datos) {
                this.empresaSelected = datos.bean;
                this.print("datos Empresa");
                this.print(datos);
                this.cerrarModal("modalEmpresa");

        }

        seleccionar(bean) {
                this.unidadEmpresaSeleccionada.emit({ bean: bean });
        }
}