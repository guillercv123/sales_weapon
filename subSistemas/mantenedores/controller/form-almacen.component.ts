import { Component, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';

import { ControllerComponent } from '../../../core/controller/controller.component';




/******************IMPORTAR SERVICIOS*************** */


import { AlmacenService } from '../service/almacen.service';
import { LocalService } from '../service/local.service';
import { ReportePdfService } from '../../../core/service/reporte-pdf.Service';
import { ReporteExcelService } from '../../../core/service/reporte-excel.Service';

import { Vista } from '../model/Vista';

declare var $: any;
@Component({
        selector: 'form-almacen',
        templateUrl: '../view/form-almacen.component.html',
        providers: [AlmacenService, LocalService, ReportePdfService, ReporteExcelService]

})

export class FormAlmacenComponent extends ControllerComponent implements AfterViewInit {


        //tipos_producto: any[];
        listaAlmacenes: any[];
        locales: any[];



        idAlmacenSelected: string;
        nombreSelected: string;
        ordenPresentacionSelected: number;
        direccionSelected: string;
        telefonoSelected: string;
        //idLocalSelected: number;
        localSelected: any;

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
                public almacenService: AlmacenService,
                public localService: LocalService,
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
                if (this.verificarTokenRpta(this.rutasMantenedores.FORM_ALMACEN)) {
                        //$('#table-almacenes').DataTable();
                        this.obtenerLocales();
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

        obtenerLocalActual(id: string) {
                let obj = null;
                let i;
                for (i = 0; i < this.locales.length; i++) {
                        //console.log("this.tipos_producto[i].nombre"+this.tipos_producto[i].nombre+" , nombreTipo: " +nombreTipo);
                        if (this.locales[i].id_local == id) {
                                obj = this.locales[i];
                                break;
                        }
                }
                return obj;
        }



        abrirPanelEditar(pro) {
                if (this.tienePermisoPrintMsj(this.rutas.FORM_ALMACEN, this.rutas.PANEL_EDITAR)) {

                        this.beanSelected = pro;

                        this.nombreSelected = pro.nombre;
                        this.ordenPresentacionSelected = pro.orden_presentacion;
                        this.idAlmacenSelected = pro.id_almacen;
                        this.direccionSelected = pro.direccion;
                        this.telefonoSelected = pro.telefono;
                        this.localSelected = this.obtenerLocalActual(pro.id_local);


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

        obtenerLocales() {
                this.localService.getAll()
                        .subscribe(
                        data => {
                                this.locales = data;

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
                        id_almacen: this.idAlmacenSelected,
                        nombre: this.nombreSelected,
                        direccion: this.direccionSelected,
                        telefono: this.telefonoSelected,
                        id_local: this.localSelected == null ? null : this.localSelected.id_local,
                        orden_presentacion: this.ordenPresentacionSelected
                });

                this.almacenService.buscarPaginacion(inicio, fin, tamPagina, parametros)
                        .subscribe(
                        data => {
                                this.listaAlmacenes = data;
                                this.print(data);
                        },
                        error => this.msj = <any>error);
        }



        registrar() {
                if (this.tienePermisoPrintMsj(this.rutas.FORM_ALMACEN, this.rutas.BUTTON_REGISTRAR)) {

                        let parametros = JSON.stringify({
                                nombre: this.nombreSelected,
                                direccion: this.direccionSelected,
                                telefono: this.telefonoSelected,
                                id_local: this.localSelected == null ? null : this.localSelected.id_local,
                                orden_presentacion: this.ordenPresentacionSelected
                        });
                        this.almacenService.registrar(parametros)
                                .subscribe(
                                data => {

                                        let rpta = data.rpta;
                                        this.print("rpta: " + rpta);
                                        if (rpta != null) {
                                                if (rpta == 1) {
                                                        this.mensajeCorrecto("ALMACEN REGISTRADO");
                                                        this.limpiarCampos();
                                                } else {
                                                        this.mensajeInCorrecto(" ALMACEN NO REGISTRADO");
                                                }
                                        }

                                        this.obtenerAlmacenes();

                                },
                                error => this.msj = <any>error
                                );
                }
        }

        buscar() {
                if (this.tienePermisoPrintMsj(this.rutas.FORM_ALMACEN, this.rutas.BUTTON_BUSCAR)) {
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
                        id_almacen: this.idAlmacenSelected,
                        nombre: this.nombreSelected,
                        direccion: this.direccionSelected,
                        telefono: this.telefonoSelected,
                        id_local: this.localSelected == null ? null : this.localSelected.id_local,
                        orden_presentacion: this.ordenPresentacionSelected
                });

                this.print("parametros total: " + parametros);
                this.almacenService.getTotalParametros(parametros)
                        .subscribe(
                        data => {
                                this.totalLista = data;
                                this.print("total:" + data);
                        },
                        error => this.msj = <any>error);
        }


        eliminar(bean) {

                if (this.tienePermisoPrintMsj(this.rutas.FORM_ALMACEN, this.rutas.BUTTON_ELIMINAR)) {
                       
                        if( confirm("Realmente Desea Eliminar ?")){
                        this.getTotalLista();
                        this.almacenService.eliminarLogico(bean.id_almacen)
                                .subscribe(
                                data => {
                                        this.obtenerAlmacenes();
                                        let rpta = data;
                                        if (rpta != null) {
                                                if (rpta == 1) {
                                                        this.mensajeCorrecto("ALMACEN ELIMINADO CORRECTAMENTE");
                                                } else {
                                                        this.mensajeInCorrecto("ALMACEN NO ELIMINADO");
                                                }

                                        }
                                },
                                error => this.msj = <any>error);
                        }
                }
        }




        editar() {


                if (this.tienePermisoPrintMsj(this.rutas.FORM_ALMACEN, this.rutas.BUTTON_ACTUALIZAR)) {
                        this.getTotalLista();
                        let parametros = JSON.stringify({
                                nombre: this.nombreSelected,
                                direccion: this.direccionSelected,
                                telefono: this.telefonoSelected,
                                id_local: this.localSelected == null ? null : this.localSelected.id_local,
                                orden_presentacion: this.ordenPresentacionSelected
                        });

                        this.print("parametros: " + parametros);
                        this.almacenService.editar(parametros, this.beanSelected.id_almacen)
                                .subscribe(
                                data => {
                                        this.obtenerAlmacenes();
                                        let rpta = data.rpta;
                                        this.print("rpta: " + rpta);
                                        if (rpta != null) {
                                                if (rpta == 1) {
                                                        this.mensajeCorrecto("ALMACEN MODIFICADO");
                                                } else {
                                                        this.mensajeInCorrecto("ALMACEN NO MOFICADO");
                                                }
                                        }

                                },
                                error => this.msj = <any>error
                                );
                }
        }



        limpiarCampos() {
                this.nombreSelected = null;
                this.ordenPresentacionSelected = null;
                this.idAlmacenSelected = null;
                this.direccionSelected = null;
                this.telefonoSelected = null;
                this.localSelected = null;
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
                        datos: this.listaAlmacenes,
                        titulo: 'ALMACENES',
                        subtitulo: 'ALMACENES EN TABLA'
                });

                this.exportarExcelFinal(parametros, "reporte Almacen");

        }


        exportarPdf() {

                let parametros = JSON.stringify({
                        datos: this.listaAlmacenes,
                        titulo: 'ALMACENES',
                        subtitulo: 'ALMACENES EN TABLA'
                });
                this.exportarPdfFinal(parametros);


        }
}