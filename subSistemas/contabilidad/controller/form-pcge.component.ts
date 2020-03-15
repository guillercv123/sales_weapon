import { Component, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';

import { ControllerComponent } from '../../../core/controller/controller.component';




/******************IMPORTAR SERVICIOS*************** */


import { ReportePdfService } from '../../../core/service/reporte-pdf.Service';
import { ReporteExcelService } from '../../../core/service/reporte-excel.Service';
import { PcgeService } from '../service/pcge.service';


declare var $: any;
@Component({
        selector: 'form-pcge',
        templateUrl: '../view/form-pcge.component.html',
        providers: [PcgeService, ReportePdfService, ReporteExcelService]

})

export class FormPcgeComponent extends ControllerComponent implements AfterViewInit {


        //tipos_producto: any[];
        listaContasPcge: any[];



        idContaPcgeSelected: string;
        codigoSelected: string;
        //ordenPresentacionSelected: number;
        //direccionSelected: string;
        //telefonoSelected: string;
        //idLocalSelected: number;
        descripcionSelected: string;

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
                public pcgeService: PcgeService,
                public reportePdfService: ReportePdfService,
                public reporteExcelService: ReporteExcelService
        ) {
                super(router, reportePdfService, reporteExcelService);

                this.panelEditarSelected = false;
        }

        ngOnInit() {
                this.limpiarCampos();
        }


        ngAfterViewInit() {
                if (this.verificarTokenRpta(this.rutasContabilidad.FORM_PCGE)) {
                        //$('#table-almacenes').DataTable();
                        
                        this.obtenerAlmacenes();

                        

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
                if (this.tienePermisoPrintMsj(this.rutasContabilidad.FORM_PCGE, this.rutas.PANEL_EDITAR)) {

                        this.beanSelected = pro;

                        this.idContaPcgeSelected = pro.id_conta_pcge;
                        this.codigoSelected = pro.codigo;
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


        obtenerAlmacenes() {
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
                        id_conta_pcge: this.idContaPcgeSelected,
                        codigo: this.codigoSelected,
                        descripcion: this.descripcionSelected
                });

                this.pcgeService.buscarPaginacion(inicio, fin, tamPagina, parametros)
                        .subscribe(
                        data => {
                                this.listaContasPcge = data;
                                this.print(data);
                        },
                        error => this.msj = <any>error);
        }



        registrar() {
                if (this.tienePermisoPrintMsj(this.rutasContabilidad.FORM_PCGE, this.rutas.BUTTON_REGISTRAR)) {

                        let parametros = JSON.stringify({
                                codigo: this.codigoSelected,
                                descripcion: this.descripcionSelected
                        });
                        this.pcgeService.registrar(parametros)
                                .subscribe(
                                data => {

                                        let rpta = data.rpta;
                                        this.print("rpta: " + rpta);
                                        if (rpta != null) {
                                                if (rpta == 1) {
                                                        this.mensajeCorrecto("CONTA PCGE REGISTRADO");
                                                        this.limpiarCampos();
                                                } else {
                                                        this.mensajeInCorrecto("CONTA PCGE NO REGISTRADO");
                                                }
                                        }

                                        this.obtenerAlmacenes();

                                },
                                error => this.msj = <any>error
                                );
                }
        }

        buscar() {
                if (this.tienePermisoPrintMsj(this.rutasContabilidad.FORM_PCGE, this.rutas.BUTTON_BUSCAR)) {
                        this.getTotalLista();
                        this.seleccionarByPagina(this.inicio, this.fin, this.tamPagina);
                }
        }



        getTotalLista() {
                /*this.productoService.getTotal()
                        .subscribe(
                        data => {
                                this.totalLista = data;
                                console.log(data);
                        },
                        error => this.msj = <any>error);*/
                let parametros = JSON.stringify({
                        id_conta_pcge: this.idContaPcgeSelected,
                        codigo: this.codigoSelected,
                        descripcion: this.descripcionSelected
                });

                this.print("parametros total: " + parametros);
                this.pcgeService.getTotalParametros(parametros)
                        .subscribe(
                        data => {
                                this.totalLista = data;
                                this.print("total:" + data);
                        },
                        error => this.msj = <any>error);
        }


        eliminar(bean) {

                if (this.tienePermisoPrintMsj(this.rutasContabilidad.FORM_PCGE, this.rutas.BUTTON_ELIMINAR)) {
                       
                        if( confirm("Realmente Desea Eliminar ?")){
                        this.getTotalLista();
                        this.pcgeService.eliminarLogico(bean.id_conta_pcge)
                                .subscribe(
                                data => {
                                        this.obtenerAlmacenes();
                                        let rpta = data;
                                        if (rpta != null) {
                                                if (rpta == 1) {
                                                        this.mensajeCorrecto("CONTA PCGE ELIMINADO CORRECTAMENTE");
                                                } else {
                                                        this.mensajeInCorrecto("CONTA PCGE NO ELIMINADO");
                                                }

                                        }
                                },
                                error => this.msj = <any>error);
                        }
                }
        }




        editar() {


                if (this.tienePermisoPrintMsj(this.rutasContabilidad.FORM_PCGE, this.rutas.BUTTON_ACTUALIZAR)) {
                        this.getTotalLista();
                        let parametros = JSON.stringify({
                                codigo: this.codigoSelected,
                                descripcion: this.descripcionSelected
                        });

                        this.print("parametros: " + parametros);
                        this.pcgeService.editar(parametros, this.beanSelected.id_conta_pcge)
                                .subscribe(
                                data => {
                                        this.obtenerAlmacenes();
                                        let rpta = data.rpta;
                                        this.print("rpta: " + rpta);
                                        if (rpta != null) {
                                                if (rpta == 1) {
                                                        this.mensajeCorrecto("CONTA PCGE MODIFICADO");
                                                } else {
                                                        this.mensajeInCorrecto("CONTA PCGE NO MOFICADO");
                                                }
                                        }

                                },
                                error => this.msj = <any>error
                                );
                }
        }



        limpiarCampos() {
                this.idContaPcgeSelected= null;
                this.codigoSelected = null;
                this.descripcionSelected = null;
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
                //console.log("cerro el modal abierto");
        }

        exportarExcel() {

                let parametros = JSON.stringify({
                        datos: this.listaContasPcge,
                        titulo: 'CONTA PCGE',
                        subtitulo: 'CONTA PCGE EN TABLA'
                });

                this.exportarExcelFinal(parametros, "reporte Conta Pcge");

        }


        exportarPdf() {

                let parametros = JSON.stringify({
                        datos: this.listaContasPcge,
                        titulo: 'CONTA PCGE',
                        subtitulo: 'CONTA PCGE EN TABLA'
                });
                this.exportarPdfFinal(parametros);


        }
}