import { Component, AfterViewInit, ViewChild, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';

import { ControllerComponent } from '../../../core/controller/controller.component';




/******************IMPORTAR SERVICIOS*************** */


import { PlazaService } from '../service/plaza.service';


import { Vista } from '../model/Vista';

declare var $: any;
@Component({
        selector: 'form-plaza',
        templateUrl: '../view/form-plaza.component.html',
        providers: [PlazaService]

})

export class FormPlazaComponent extends ControllerComponent implements AfterViewInit {



        listaPlazas: any[];

        idPlazaSelected: any;
        nombreSelected: any;
        cargoSelected: any;
        cantidadSelected: any;
        sueldoSelected: any;
        fechaInicioSelected: any;
        fechaFinSelected: any;
        fechaCreacionSelected: any;

        //************OBJETO ELEGIDO PARA EDITAR************
        beanSelected: any;

        //***********PANELES DE LOS MANTENEDORES***********

        panelEditarSelected: boolean = false;
        panelListaBeanSelected: boolean = true;



        buttonSelectedActivatedCargo: boolean = true;


        //************OBJETOS QUE SE TRANSMITIRAN**********/
        @Output() plazaSeleccionada = new EventEmitter();
        @Input() buttonSelectedActivated = false

        constructor(
                public http: Http,
                public router: Router,
                public plazaService: PlazaService
        ) {
                super(router);

                this.panelEditarSelected = false;
        }


        ngOnInit() {
                this.limpiarCampos();
        }

        ngAfterViewInit() {
                if (this.verificarTokenRpta(this.rutasMantenedores.FORM_PLAZA)) {
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

                if (this.tienePermisoPrintMsj(this.rutas.FORM_PLAZA, this.rutas.PANEL_EDITAR)) {
                        this.beanSelected = pro;

                        this.idPlazaSelected = pro.id_plaza;
                        this.nombreSelected = pro.nombre;
                        this.cargoSelected = { id_cargo: pro.id_cargo, nombre: pro.nombre_cargo };
                        this.cantidadSelected = pro.cantidad;
                        this.sueldoSelected = pro.sueldo;
                        this.fechaInicioSelected = pro.fecha_inicio == null ? null : pro.fecha_inicio.substr(0, 10);
                        this.fechaFinSelected = pro.fecha_fin == null ? null : pro.fecha_fin.substr(0, 10);

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
                        id_plaza: this.idPlazaSelected,
                        nombre: this.nombreSelected,
                        id_cargo: this.cargoSelected == null ? null : this.cargoSelected.id_cargo,
                        cantidad: this.cantidadSelected,
                        sueldo: this.sueldoSelected,
                        fecha_inicio: this.fechaInicioSelected,
                        fecha_fin: this.fechaFinSelected,
                        fecha_creacion: this.fechaCreacionSelected
                });

                this.plazaService.buscarPaginacion(inicio, fin, tamPagina, parametros)
                        .subscribe(
                        data => {
                                this.listaPlazas = data;

                                this.print(data);
                        },
                        error => this.msj = <any>error);
        }


        registrar() {
                if (this.tienePermisoPrintMsj(this.rutas.FORM_PLAZA, this.rutas.BUTTON_REGISTRAR)) {
                        let parametros = JSON.stringify({
                                nombre: this.nombreSelected,
                                id_cargo: this.cargoSelected == null ? null : this.cargoSelected.id_cargo,
                                cantidad: this.cantidadSelected,
                                sueldo: this.sueldoSelected,
                                fecha_inicio: this.fechaInicioSelected,
                                fecha_fin: this.fechaFinSelected,
                        });
                        this.plazaService.registrar(parametros)
                                .subscribe(
                                data => {

                                        let rpta = data.rpta;
                                        this.print("rpta: " + rpta);
                                        if (rpta != null) {
                                                if (rpta == 1) {
                                                        this.mensajeCorrecto("PLAZA REGISTRADA");
                                                        this.limpiarCampos();
                                                } else {
                                                        this.mensajeInCorrecto("PLAZA NO REGISTRADA");
                                                }
                                        }

                                        this.obtenerCargos();

                                },
                                error => this.msj = <any>error
                                );
                }
        }

        buscar() {
                if (this.tienePermisoPrintMsj(this.rutas.FORM_PLAZA, this.rutas.BUTTON_BUSCAR)) {
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
                        id_plaza: this.idPlazaSelected,
                        nombre: this.nombreSelected,
                        id_cargo: this.cargoSelected == null ? null : this.cargoSelected.id_cargo,
                        cantidad: this.cantidadSelected,
                        sueldo: this.sueldoSelected,
                        fecha_inicio: this.fechaInicioSelected,
                        fecha_fin: this.fechaFinSelected,
                        fecha_creacion: this.fechaCreacionSelected
                });

                this.print("parametros total: " + parametros);
                this.plazaService.getTotalParametros(parametros)
                        .subscribe(
                        data => {
                                this.totalLista = data;
                                this.print("total:" + data);
                        },
                        error => this.msj = <any>error);
        }


        eliminar(bean) {

                if (this.tienePermisoPrintMsj(this.rutas.FORM_PLAZA, this.rutas.BUTTON_ELIMINAR)) {
                        if( confirm("Realmente Desea Eliminar ?")){
                        this.plazaService.eliminarLogico(bean.id_plaza)
                                .subscribe(
                                data => {
                                        this.obtenerCargos();
                                        let rpta = data;
                                        if (rpta != null) {
                                                if (rpta == 1) {
                                                        this.mensajeCorrecto("PLAZA ELIMINADA CORRECTAMENTE");
                                                } else {
                                                        this.mensajeInCorrecto("PLAZA NO ELIMINADA");
                                                }

                                        }
                                },
                                error => this.msj = <any>error);
                        }
                }
        }




        editar() {
                if (this.tienePermisoPrintMsj(this.rutas.FORM_PLAZA, this.rutas.BUTTON_ACTUALIZAR)) {
                        let parametros = JSON.stringify({
                                nombre: this.nombreSelected,
                                id_cargo: this.cargoSelected == null ? null : this.cargoSelected.id_cargo,
                                cantidad: this.cantidadSelected,
                                sueldo: this.sueldoSelected,
                                fecha_inicio: this.fechaInicioSelected,
                                fecha_fin: this.fechaFinSelected,
                        });

                        this.print("parametros: " + parametros);
                        this.plazaService.editar(parametros, this.beanSelected.id_plaza)
                                .subscribe(
                                data => {
                                        this.obtenerCargos();
                                        let rpta = data.rpta;
                                        this.print("rpta: " + rpta);
                                        if (rpta != null) {
                                                if (rpta == 1) {
                                                        this.mensajeCorrecto("PLAZA MODIFICADA");
                                                } else {
                                                        this.mensajeInCorrecto("PLAZA NO MOFICADA");
                                                }
                                        }

                                },
                                error => this.msj = <any>error
                                );
                }

        }



        limpiarCampos() {
                this.idPlazaSelected = null;
                this.nombreSelected = null;
                this.cargoSelected = null;
                this.cantidadSelected = null;
                this.sueldoSelected = null;
                this.fechaInicioSelected = null;
                this.fechaFinSelected = null;
                this.fechaCreacionSelected = null;
        }

        elegirFila(lista, i) {
                this.marcar(lista, i);
        }


        abrirModalCargo() {
                this.abrirModal("modalCargo");
        }

        obtenerCargoDatosExternos(datos) {
                this.cargoSelected = datos.bean;
                this.print("datos Cargo");
                this.print(datos);
                this.cerrarModal("modalCargo");

        }

        seleccionar(bean) {
                this.plazaSeleccionada.emit({ bean: bean });
        }
}