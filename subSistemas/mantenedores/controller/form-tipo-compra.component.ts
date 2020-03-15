import { Component, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';

import { ControllerComponent } from '../../../core/controller/controller.component';




/******************IMPORTAR SERVICIOS*************** */


import { TipoCompraService } from '../service/tipo-compra.service';


import { Vista } from '../model/Vista';

declare var $: any;
@Component({
        selector: 'form-tipo-compra',
        templateUrl: '../view/form-tipo-compra.component.html',
        providers: [TipoCompraService]

})

export class FormTipoCompraComponent extends ControllerComponent implements AfterViewInit {


        //tipos_producto: any[];
        listaTiposCompra: any[];



        idTipoCompraSelected: string;
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
                public tipoCompraService: TipoCompraService
        ) {
                super(router);

                this.panelEditarSelected = false;
        }

        ngOnInit() {
                this.limpiarCampos();
        }


        ngAfterViewInit() {
                if (this.verificarTokenRpta(this.rutasMantenedores.FORM_TIPO_COMPRA)) {
                        this.obtenerTiposCompra();
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

                if (this.tienePermisoPrintMsj(this.rutas.FORM_TIPO_COMPRA, this.rutas.PANEL_EDITAR)) {
                        this.beanSelected = pro;
                        //this.tipoProSelected=this.obtenerTipoActual(pro.nombre_tipo_producto);
                        this.idTipoCompraSelected = pro.id_tipo_compra;
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


        obtenerTiposCompra() {
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
                        id_tipo_compra: this.idTipoCompraSelected,
                        nombre: this.nombreSelected,
                        orden_presentacion: this.ordenPresentacionSelected,
                        descripcion: this.descripcionSelected
                });

                this.tipoCompraService.buscarPaginacion(inicio, fin, tamPagina, parametros)
                        .subscribe(
                        data => {
                                this.listaTiposCompra = data;

                                this.print(data);
                        },
                        error => this.msj = <any>error);
        }


        registrar() {

                if (this.tienePermisoPrintMsj(this.rutas.FORM_TIPO_COMPRA, this.rutas.BUTTON_REGISTRAR)) {

                        let parametros = JSON.stringify({
                                nombre: this.nombreSelected,
                                descripcion: this.descripcionSelected,
                                orden_presentacion: this.ordenPresentacionSelected
                        });
                        this.tipoCompraService.registrar(parametros)
                                .subscribe(
                                data => {

                                        let rpta = data.rpta;
                                        this.print("rpta: " + rpta);
                                        if (rpta != null) {
                                                if (rpta == 1) {
                                                        this.mensajeCorrecto("TIPO COMPRA REGISTRADO");
                                                        this.limpiarCampos();
                                                } else {
                                                        this.mensajeInCorrecto(" TIPO COMPRA NO REGISTRADO");
                                                }
                                        }

                                        this.obtenerTiposCompra();

                                },
                                error => this.msj = <any>error
                                );
                }
        }

        buscar() {
                if (this.tienePermisoPrintMsj(this.rutas.FORM_TIPO_COMPRA, this.rutas.BUTTON_BUSCAR)) {
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
                        id_tipo_compra: this.idTipoCompraSelected,
                        nombre: this.nombreSelected,
                        orden_presentacion: this.ordenPresentacionSelected,
                        descripcion: this.descripcionSelected
                });

                this.print("parametros total: " + parametros);
                this.tipoCompraService.getTotalParametros(parametros)
                        .subscribe(
                        data => {
                                this.totalLista = data;
                                this.print("total:" + data);
                        },
                        error => this.msj = <any>error);
        }


        eliminar(bean) {

                if (this.tienePermisoPrintMsj(this.rutas.FORM_TIPO_COMPRA, this.rutas.BUTTON_ELIMINAR)) {
                        if( confirm("Realmente Desea Eliminar ?")){
                        this.tipoCompraService.eliminarLogico(bean.id_tipo_compra)
                                .subscribe(
                                data => {
                                        this.obtenerTiposCompra();
                                        let rpta = data;
                                        if (rpta != null) {
                                                if (rpta == 1) {
                                                        this.mensajeCorrecto("TIPO COMPRA ELIMINADO CORRECTAMENTE");
                                                } else {
                                                        this.mensajeInCorrecto("TIPO COMPRA NO ELIMINADO");
                                                }

                                        }
                                },
                                error => this.msj = <any>error);
                        }
                }
        }




        editar() {

                if (this.tienePermisoPrintMsj(this.rutas.FORM_TIPO_COMPRA, this.rutas.BUTTON_ACTUALIZAR)) {
                        let parametros = JSON.stringify({
                                nombre: this.nombreSelected,
                                descripcion: this.descripcionSelected,
                                orden_presentacion: this.ordenPresentacionSelected
                        });

                        this.print("parametros: " + parametros);
                        this.tipoCompraService.editar(parametros, this.beanSelected.id_tipo_compra)
                                .subscribe(
                                data => {
                                        this.obtenerTiposCompra();
                                        let rpta = data.rpta;
                                        this.print("rpta: " + rpta);
                                        if (rpta != null) {
                                                if (rpta == 1) {
                                                        this.mensajeCorrecto("TIPO COMPRA MODIFICADO");
                                                } else {
                                                        this.mensajeInCorrecto("TIPO COMPRA NO MOFICADO");
                                                }
                                        }

                                },
                                error => this.msj = <any>error
                                );
                }
        }



        limpiarCampos() {
                this.nombreSelected = null;
                this.idTipoCompraSelected = null;
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