import { Component, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';

import { ControllerComponent } from '../../../core/controller/controller.component';




/******************IMPORTAR SERVICIOS*************** */


import { UnidadMedidaService } from '../service/unidad-medida.service';


import { Vista } from '../model/Vista';

declare var $: any;
@Component({
        selector: 'form-unidad-medida',
        templateUrl: '../view/form-unidad-medida.component.html',
        providers: [UnidadMedidaService]

})

export class FormUnidadMedidaComponent extends ControllerComponent implements AfterViewInit {


        //tipos_producto: any[];
        listaUnidadMedidas: any[];



        idUnidadMedidaSelected: string;
        nombreSelected: string;
        simboloSelected: string;
        observacionSelected: string;
        ordenPresentacionSelected: number;
        isParaComprobanteSelected: number;
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
                public unidadMedidaService: UnidadMedidaService
        ) {
                super(router);

                this.panelEditarSelected = false;
        }



        ngOnInit() {
                this.limpiarCampos();
        }

        ngAfterViewInit() {
                if (this.verificarTokenRpta(this.rutasMantenedores.FORM_UNIDAD_MEDIDA)) {
                        this.obtenerUnidadesMedida();
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
                if (this.tienePermisoPrintMsj(this.rutas.FORM_UNIDAD_MEDIDA, this.rutas.PANEL_EDITAR)) {
                        this.beanSelected = pro;

                        this.idUnidadMedidaSelected = pro.id_unidad_medida;
                        this.nombreSelected = pro.nombre;
                        this.simboloSelected = pro.simbolo;
                        this.ordenPresentacionSelected = pro.orden_presentacion;
                        this.observacionSelected = pro.observacion;
                        this.simboloSelected = pro.simbolo;
                        this.isParaComprobanteSelected=pro.is_para_comprobante ;

                        this.panelEditarSelected = true;
                        this.panelListaBeanSelected = false;
                }
        }


        regresar() {
                this.limpiarCampos();
                this.panelEditarSelected = false;
                this.panelListaBeanSelected = true;
        }


        obtenerUnidadesMedida() {
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
                        id_unidad_medida: this.idUnidadMedidaSelected,
                        nombre: this.nombreSelected,
                        orden_presentacion: this.ordenPresentacionSelected,
                        observacion: this.observacionSelected,
                        simbolo: this.simboloSelected,
                        is_para_comprobante: this.isParaComprobanteSelected 
                });

                this.unidadMedidaService.buscarPaginacion(inicio, fin, tamPagina, parametros)
                        .subscribe(
                        data => {
                                this.listaUnidadMedidas = data;

                                this.print(data);
                        },
                        error => this.msj = <any>error);
        }


        registrar() {

                if (this.tienePermisoPrintMsj(this.rutas.FORM_UNIDAD_MEDIDA, this.rutas.BUTTON_REGISTRAR)) {
                        let parametros = JSON.stringify({
                                nombre: this.nombreSelected,
                                simbolo: this.simboloSelected,
                                observacion: this.observacionSelected,
                                orden_presentacion: this.ordenPresentacionSelected,
                                is_para_comprobante: this.isParaComprobanteSelected
                        });
                        this.unidadMedidaService.registrar(parametros)
                                .subscribe(
                                data => {

                                        let rpta = data.rpta;
                                        this.print("rpta: " + rpta);
                                        if (rpta != null) {
                                                if (rpta == 1) {
                                                        this.mensajeCorrecto("UNIDAD MEDIDA REGISTRADO");
                                                        this.limpiarCampos();
                                                } else {
                                                        this.mensajeInCorrecto("UNIDAD MEDIDA NO REGISTRADO");
                                                }
                                        }

                                        this.obtenerUnidadesMedida();

                                },
                                error => this.msj = <any>error
                                );
                }
        }

        buscar() {
                if (this.tienePermisoPrintMsj(this.rutas.FORM_UNIDAD_MEDIDA, this.rutas.BUTTON_BUSCAR)) {
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
                        id_unidad_medida: this.idUnidadMedidaSelected,
                        nombre: this.nombreSelected,
                        orden_presentacion: this.ordenPresentacionSelected,
                        observacion: this.observacionSelected,
                        simbolo: this.simboloSelected,
                        is_para_comprobante: this.isParaComprobanteSelected
                });

                this.print("parametros total: " + parametros);
                this.unidadMedidaService.getTotalParametros(parametros)
                        .subscribe(
                        data => {
                                this.totalLista = data;
                                this.print("total:" + data);
                        },
                        error => this.msj = <any>error);
        }


        eliminar(bean) {
                if (this.tienePermisoPrintMsj(this.rutas.FORM_UNIDAD_MEDIDA, this.rutas.BUTTON_ELIMINAR)) {
                        if( confirm("Realmente Desea Eliminar ?")){
                        this.unidadMedidaService.eliminarLogico(bean.id_unidad_medida)
                                .subscribe(
                                data => {
                                        this.obtenerUnidadesMedida();
                                        let rpta = data;
                                        if (rpta != null) {
                                                if (rpta == 1) {
                                                        this.mensajeCorrecto("UNIDAD MEDIDA ELIMINADO CORRECTAMENTE");
                                                } else {
                                                        this.mensajeInCorrecto("UNIDAD MEDIDA NO ELIMINADO");
                                                }

                                        }
                                },
                                error => this.msj = <any>error);
                        }
                }
        }




        editar() {
                if (this.tienePermisoPrintMsj(this.rutas.FORM_UNIDAD_MEDIDA, this.rutas.BUTTON_ACTUALIZAR)) {
                        let parametros = JSON.stringify({
                                nombre: this.nombreSelected,
                                simbolo: this.simboloSelected,
                                observacion: this.observacionSelected,
                                orden_presentacion: this.ordenPresentacionSelected,
                                is_para_comprobante: this.isParaComprobanteSelected

                        });

                        this.print("parametros: " + parametros);
                        this.unidadMedidaService.editar(parametros, this.beanSelected.id_unidad_medida)
                                .subscribe(
                                data => {
                                        this.obtenerUnidadesMedida();
                                        let rpta = data.rpta;
                                        this.print("rpta: " + rpta);
                                        if (rpta != null) {
                                                if (rpta == 1) {
                                                        this.mensajeCorrecto("UNIDAD MEDIDA MODIFICADO");
                                                } else {
                                                        this.mensajeInCorrecto("UNIDAD MEDIDA NO MOFICADO");
                                                }
                                        }

                                },
                                error => this.msj = <any>error
                                );
                }
        }



        limpiarCampos() {
                this.nombreSelected = null;
                this.idUnidadMedidaSelected = null;
                this.observacionSelected = null;
                this.ordenPresentacionSelected = null;
                this.simboloSelected = null;
                this.isParaComprobanteSelected=null;
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