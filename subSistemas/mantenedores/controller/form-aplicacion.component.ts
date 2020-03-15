import { Component, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';

import { ControllerComponent } from '../../../core/controller/controller.component';




/******************IMPORTAR SERVICIOS*************** */


import { AplicacionService } from '../service/aplicacion.service';


import { Vista } from '../model/Vista';

declare var $: any;
@Component({
        selector: 'form-aplicacion',
        templateUrl: '../view/form-aplicacion.component.html',
        providers: [AplicacionService]

})

export class FormAplicacionComponent extends ControllerComponent implements AfterViewInit {


        //tipos_producto: any[];
        listaAplicaciones: any[];



        idAplicacionSelected: string;
        nombreSelected: string;
        observacionSelected: string;
        ordenPresentacionSelected: number;
        //rucSelected:string;
        //representanteSelected:string;
        //telefonoSelected:string;
        //correoSelected:string;


        //************OBJETO ELEGIDO PARA EDITAR************
        beanSelected: any;

        //***********PANELES DE LOS MANTENEDORES***********

        panelEditarSelected: boolean = false;
        panelListaBeanSelected: boolean = false;


        constructor(
                public http: Http,
                public router: Router,
                public aplicacionService: AplicacionService
        ) {
                super(router);

                this.panelEditarSelected = false;
        }


        ngOnInit() {
                this.limpiarCampos();
        }

        ngAfterViewInit() {
                if (this.verificarTokenRpta(this.rutasMantenedores.FORM_APLICACION)) {
                        this.obtenerAplicaciones();
                }
        }



        abrirPanelBuscar() {
                this.panelEditarSelected = false;
                this.panelListaBeanSelected = true;

        }

        abrirPanelRegistrar() {
                this.panelEditarSelected = false;
                this.panelListaBeanSelected = false;
        }

        abrirPanelEditar(pro) {

                if (this.tienePermisoPrintMsj(this.rutas.FORM_APLICACION, this.rutas.PANEL_EDITAR)) {
                        this.beanSelected = pro;
                        //this.tipoProSelected=this.obtenerTipoActual(pro.nombre_tipo_producto);
                        this.idAplicacionSelected = pro.id_aplicacion;
                        this.nombreSelected = pro.nombre;
                        this.ordenPresentacionSelected = pro.orden_presentacion;
                        this.observacionSelected = pro.observacion;

                        this.panelEditarSelected = true;
                        this.panelListaBeanSelected = false;
                }
        }


        regresar() {
                this.limpiarCampos();
                this.panelEditarSelected = false;
                this.panelListaBeanSelected = true;
        }


        obtenerAplicaciones() {
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
                        id_aplicacion: this.idAplicacionSelected,
                        nombre: this.nombreSelected,
                        orden_presentacion: this.ordenPresentacionSelected,
                        observacion: this.observacionSelected
                });

                this.aplicacionService.buscarPaginacion(inicio, fin, tamPagina, parametros)
                        .subscribe(
                        data => {
                                this.listaAplicaciones = data;

                                this.print(data);
                        },
                        error => this.msj = <any>error);
        }


        registrar() {

                if (this.tienePermisoPrintMsj(this.rutas.FORM_APLICACION, this.rutas.BUTTON_REGISTRAR)) {
                        let parametros = JSON.stringify({
                                nombre: this.nombreSelected,
                                observacion: this.observacionSelected,
                                orden_presentacion: this.ordenPresentacionSelected
                        });
                        this.aplicacionService.registrar(parametros)
                                .subscribe(
                                data => {

                                        let rpta = data.rpta;
                                        this.print("rpta: " + rpta);
                                        if (rpta != null) {
                                                if (rpta == 1) {
                                                        this.mensajeCorrecto("APLICACION REGISTRADO");
                                                        this.limpiarCampos();
                                                } else {
                                                        this.mensajeInCorrecto("APLICACION NO REGISTRADO");
                                                }
                                        }

                                        this.obtenerAplicaciones();

                                },
                                error => this.msj = <any>error
                                );
                }
        }

        buscar() {
                this.getTotalLista();
                this.seleccionarByPagina(this.inicio, this.fin, this.tamPagina);
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
                        id_aplicacion: this.idAplicacionSelected,
                        nombre: this.nombreSelected,
                        orden_presentacion: this.ordenPresentacionSelected,
                        observacion: this.observacionSelected
                });

                this.print("parametros total: " + parametros);
                this.aplicacionService.getTotalParametros(parametros)
                        .subscribe(
                        data => {
                                this.totalLista = data;
                                this.print("total:" + data);
                        },
                        error => this.msj = <any>error);
        }


        eliminar(bean) {

                if (this.tienePermisoPrintMsj(this.rutas.FORM_APLICACION, this.rutas.BUTTON_ELIMINAR)) {
                        if( confirm("Realmente Desea Eliminar ?")){
                        this.aplicacionService.eliminarLogico(bean.id_aplicacion)
                                .subscribe(
                                data => {
                                        this.obtenerAplicaciones();
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

                if (this.tienePermisoPrintMsj(this.rutas.FORM_APLICACION, this.rutas.BUTTON_ACTUALIZAR)) {
                        let parametros = JSON.stringify({
                                nombre: this.nombreSelected,
                                observacion: this.observacionSelected,
                                orden_presentacion: this.ordenPresentacionSelected
                        });

                        this.print("parametros: " + parametros);
                        this.aplicacionService.editar(parametros, this.beanSelected.id_aplicacion)
                                .subscribe(
                                data => {
                                        this.obtenerAplicaciones();
                                        let rpta = data.rpta;
                                        this.print("rpta: " + rpta);
                                        if (rpta != null) {
                                                if (rpta == 1) {
                                                        this.mensajeCorrecto("APLICACION MODIFICADO");
                                                } else {
                                                        this.mensajeInCorrecto("APLICACION NO MOFICADO");
                                                }
                                        }

                                },
                                error => this.msj = <any>error
                                );
                }
        }



        limpiarCampos() {
                this.nombreSelected = null;
                this.idAplicacionSelected = null;
                this.observacionSelected = null;
                this.ordenPresentacionSelected = null;
        }

        elegirFila(lista, i) {
                this.marcar(lista, i);
        }



        activarBuscarDoc(event) {

                //this.success=false;
                //this.successModal=false;
                //if(!this.tienePermiso(this.rutas.FORM_NUEVO_MENSAJE,this.rutas.BUTTON_BUSCAR_PERSONA)) {
                //               this.mensajeInCorrecto("USTED NO TIENE PERMISO PARA ESTA ACCION");
                //event.stopPropagation();
                //       }
        }

        cerrarModal() {
                //this.panelReferenciaSelected = false;
                //this.print("cerro el modal abierto");
        }
}