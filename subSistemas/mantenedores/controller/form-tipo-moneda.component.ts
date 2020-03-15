import { Component, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';

import { ControllerComponent } from '../../../core/controller/controller.component';




/******************IMPORTAR SERVICIOS*************** */


import { TipoMonedaService } from '../service/tipo-moneda.service';


import { Vista } from '../model/Vista';

declare var $: any;
@Component({
        selector: 'form-tipo-moneda',
        templateUrl: '../view/form-tipo-moneda.component.html',
        providers: [TipoMonedaService]

})

export class FormTipoMonedaComponent extends ControllerComponent implements AfterViewInit {


        //tipos_producto: any[];
        listaTiposMoneda: any[];



        idTipoMonedaSelected: string;
        nombreSelected: string;
        simboloSelected: string;
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
        panelListaBeanSelected: boolean = true;


        constructor(
                public http: Http,
                public router: Router,
                public tipoMonedaService: TipoMonedaService
        ) {
                super(router);

                this.panelEditarSelected = false;
        }


        ngOnInit() {
                this.limpiarCampos();
        }


        ngAfterViewInit() {
                if (this.verificarTokenRpta(this.rutasMantenedores.FORM_TIPO_MONEDA)) {
                        this.obtenerTiposProducto();
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

                if (this.tienePermisoPrintMsj(this.rutas.FORM_TIPO_MONEDA, this.rutas.PANEL_EDITAR)) {
                        this.beanSelected = pro;
                        //this.tipoProSelected=this.obtenerTipoActual(pro.nombre_tipo_producto);
                        this.idTipoMonedaSelected = pro.id_tipo_producto;
                        this.nombreSelected = pro.nombre;
                        this.simboloSelected = pro.simbolo;
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


        obtenerTiposProducto() {
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
                        id_tipo_moneda: this.idTipoMonedaSelected,
                        nombre: this.nombreSelected,
                        simbolo: this.simboloSelected,
                        orden_presentacion: this.ordenPresentacionSelected,
                        observacion: this.observacionSelected
                });

                this.tipoMonedaService.buscarPaginacion(inicio, fin, tamPagina, parametros)
                        .subscribe(
                        data => {
                                this.listaTiposMoneda = data;

                                this.print(data);
                        },
                        error => this.msj = <any>error);
        }


        registrar() {
                if (this.tienePermisoPrintMsj(this.rutas.FORM_TIPO_MONEDA, this.rutas.BUTTON_REGISTRAR)) {
                        let parametros = JSON.stringify({
                                nombre: this.nombreSelected,
                                simbolo: this.simboloSelected,
                                observacion: this.observacionSelected,
                                orden_presentacion: this.ordenPresentacionSelected
                        });
                        this.tipoMonedaService.registrar(parametros)
                                .subscribe(
                                data => {

                                        let rpta = data.rpta;
                                        this.print("rpta: " + rpta);
                                        if (rpta != null) {
                                                if (rpta == 1) {
                                                        this.mensajeCorrecto("TIPO MONEDA REGISTRADO");
                                                        this.limpiarCampos();
                                                } else {
                                                        this.mensajeInCorrecto(" TIPO MONEDA NO REGISTRADO");
                                                }
                                        }

                                        this.obtenerTiposProducto();

                                },
                                error => this.msj = <any>error
                                );
                }
        }

        buscar() {
                if (this.tienePermisoPrintMsj(this.rutas.FORM_TIPO_MONEDA, this.rutas.BUTTON_BUSCAR)) {
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
                        id_tipo_moneda: this.idTipoMonedaSelected,
                        nombre: this.nombreSelected,
                        simbolo: this.simboloSelected,
                        orden_presentacion: this.ordenPresentacionSelected,
                        observacion: this.observacionSelected
                });

                this.print("parametros total: " + parametros);
                this.tipoMonedaService.getTotalParametros(parametros)
                        .subscribe(
                        data => {
                                this.totalLista = data;
                                this.print("total:" + data);
                        },
                        error => this.msj = <any>error);
        }


        eliminar(bean) {

                if (this.tienePermisoPrintMsj(this.rutas.FORM_TIPO_MONEDA, this.rutas.BUTTON_ELIMINAR)) {
                        if( confirm("Realmente Desea Eliminar ?")){
                        this.tipoMonedaService.eliminarLogico(bean.id_tipo_moneda)
                                .subscribe(
                                data => {
                                        this.obtenerTiposProducto();
                                        let rpta = data;
                                        if (rpta != null) {
                                                if (rpta == 1) {
                                                        this.mensajeCorrecto("TIPO MONEDA ELIMINADO CORRECTAMENTE");
                                                } else {
                                                        this.mensajeInCorrecto("TIPO MONEDA NO ELIMINADO");
                                                }

                                        }
                                },
                                error => this.msj = <any>error);
                        }
                }
        }




        editar() {
                if (this.tienePermisoPrintMsj(this.rutas.FORM_TIPO_MONEDA, this.rutas.BUTTON_ACTUALIZAR)) {
                        let parametros = JSON.stringify({
                                nombre: this.nombreSelected,
                                simbolo: this.simboloSelected,
                                observacion: this.observacionSelected,
                                orden_presentacion: this.ordenPresentacionSelected
                        });

                        this.print("parametros: " + parametros);
                        this.tipoMonedaService.editar(parametros, this.beanSelected.id_tipo_moneda)
                                .subscribe(
                                data => {
                                        this.obtenerTiposProducto();
                                        let rpta = data.rpta;
                                        this.print("rpta: " + rpta);
                                        if (rpta != null) {
                                                if (rpta == 1) {
                                                        this.mensajeCorrecto("TIPO MONEDA MODIFICADO");
                                                } else {
                                                        this.mensajeInCorrecto("TIPO MONEDA NO MOFICADO");
                                                }
                                        }

                                },
                                error => this.msj = <any>error
                                );
                }
        }



        limpiarCampos() {
                this.nombreSelected = null;
                this.simboloSelected = null
                this.idTipoMonedaSelected = null;
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