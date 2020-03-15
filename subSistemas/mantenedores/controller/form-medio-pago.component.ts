import { Component, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';

import { ControllerComponent } from '../../../core/controller/controller.component';




/******************IMPORTAR SERVICIOS*************** */


import { MedioPagoService } from '../service/medio-pago.service';


import { Vista } from '../model/Vista';

declare var $: any;
@Component({
        selector: 'form-medio-pago',
        templateUrl: '../view/form-medio-pago.component.html',
        providers: [MedioPagoService]

})

export class FormMedioPagoComponent extends ControllerComponent implements AfterViewInit {


        //tipos_producto: any[];
        listaMediosPago: any[];



        idMedioPagoSelected: string;
        nombreSelected: string;
        descripcionSelected: string;
        ordenPresentacionSelected: number;
        //rucSelected:string;
        //representanteSelected:string;
        //telefonoSelected:string;
        //correoSelected:string;


        //************OBJETO ELEGIDO PARA EDITAR************
        beanSelected: any;

        //***********PANELES DE LOS MANTENEDORES***********

        panelEditarSelected: boolean = false;
        panelListaBeanSelected: boolean = true;


        constructor(
                public http: Http,
                public router: Router,
                public medioPagoService: MedioPagoService
        ) {
                super(router);

                this.panelEditarSelected = false;
        }

        ngOnInit() {
                this.limpiarCampos();
        }


        ngAfterViewInit() {
                if (this.verificarTokenRpta(this.rutasMantenedores.FORM_MEDIO_PAGO)) {
                        this.obtenerMediosPago();
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

                if (this.tienePermisoPrintMsj(this.rutas.FORM_MEDIO_PAGO, this.rutas.PANEL_EDITAR)) {
                        this.beanSelected = pro;
                        //this.tipoProSelected=this.obtenerTipoActual(pro.nombre_tipo_producto);
                        this.idMedioPagoSelected = pro.id_medio_pago;
                        this.nombreSelected = pro.nombre;
                        this.ordenPresentacionSelected = pro.orden_presentacion;
                        this.descripcionSelected = pro.descripcion;

                        this.panelEditarSelected = true;
                        this.panelListaBeanSelected = false;
                }
        }


        regresar() {
                this.limpiarCampos();
                this.panelEditarSelected = false;
                this.panelListaBeanSelected = true;
        }


        obtenerMediosPago() {
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
                        id_medio_pago: this.idMedioPagoSelected,
                        nombre: this.nombreSelected,
                        orden_presentacion: this.ordenPresentacionSelected,
                        descripcion: this.descripcionSelected
                });

                this.medioPagoService.buscarPaginacion(inicio, fin, tamPagina, parametros)
                        .subscribe(
                        data => {
                                this.listaMediosPago = data;

                                this.print(data);
                        },
                        error => this.msj = <any>error);
        }


        registrar() {

                if (this.tienePermisoPrintMsj(this.rutas.FORM_MEDIO_PAGO, this.rutas.BUTTON_REGISTRAR)) {

                        let parametros = JSON.stringify({
                                nombre: this.nombreSelected,
                                descripcion: this.descripcionSelected,
                                orden_presentacion: this.ordenPresentacionSelected
                        });
                        this.medioPagoService.registrar(parametros)
                                .subscribe(
                                data => {

                                        let rpta = data.rpta;
                                        this.print("rpta: " + rpta);
                                        if (rpta != null) {
                                                if (rpta == 1) {
                                                        this.mensajeCorrecto("MEDIO PAGO REGISTRADO");
                                                        this.limpiarCampos();
                                                } else {
                                                        this.mensajeInCorrecto("MEDIO PAGO NO REGISTRADO");
                                                }
                                        }

                                        this.obtenerMediosPago();

                                },
                                error => this.msj = <any>error
                                );
                }
        }

        buscar() {
                if (this.tienePermisoPrintMsj(this.rutas.FORM_MEDIO_PAGO, this.rutas.BUTTON_BUSCAR)) {
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
                        id_medio_pago: this.idMedioPagoSelected,
                        nombre: this.nombreSelected,
                        orden_presentacion: this.ordenPresentacionSelected,
                        descripcion: this.descripcionSelected
                });

                this.print("parametros total: " + parametros);
                this.medioPagoService.getTotalParametros(parametros)
                        .subscribe(
                        data => {
                                this.totalLista = data;
                                this.print("total:" + data);
                        },
                        error => this.msj = <any>error);
        }


        eliminar(bean) {

                if (this.tienePermisoPrintMsj(this.rutas.FORM_MEDIO_PAGO, this.rutas.BUTTON_ELIMINAR)) {
                        if( confirm("Realmente Desea Eliminar ?")){
                        this.medioPagoService.eliminarLogico(bean.id_medio_pago)
                                .subscribe(
                                data => {
                                        this.obtenerMediosPago();
                                        let rpta = data;
                                        if (rpta != null) {
                                                if (rpta == 1) {
                                                        this.mensajeCorrecto("MEDIO PAGO ELIMINADO CORRECTAMENTE");
                                                } else {
                                                        this.mensajeInCorrecto("MEDIO PAGO NO ELIMINADO");
                                                }

                                        }
                                },
                                error => this.msj = <any>error);
                        }
                }
        }




        editar() {

                if (this.tienePermisoPrintMsj(this.rutas.FORM_MEDIO_PAGO, this.rutas.BUTTON_ACTUALIZAR)) {
                        let parametros = JSON.stringify({
                                nombre: this.nombreSelected,
                                descripcion: this.descripcionSelected,
                                orden_presentacion: this.ordenPresentacionSelected
                        });

                        this.print("parametros: " + parametros);
                        this.medioPagoService.editar(parametros, this.beanSelected.id_medio_pago)
                                .subscribe(
                                data => {
                                        this.obtenerMediosPago();
                                        let rpta = data.rpta;
                                        this.print("rpta: " + rpta);
                                        if (rpta != null) {
                                                if (rpta == 1) {
                                                        this.mensajeCorrecto("MEDIO PAGO MODIFICADO");
                                                } else {
                                                        this.mensajeInCorrecto("MEDIO PAGO NO MOFICADO");
                                                }
                                        }

                                },
                                error => this.msj = <any>error
                                );
                }
        }



        limpiarCampos() {
                this.nombreSelected = null;
                this.idMedioPagoSelected = null;
                this.descripcionSelected = null;
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