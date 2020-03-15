import { Component, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';

import { ControllerComponent } from '../../../core/controller/controller.component';




/******************IMPORTAR SERVICIOS*************** */



import { SunatTablaService } from '../service/sunat-tabla.service';
import { LibroCompraService } from '../service/libro-compra.service';
import { ReporteExcelService } from '../../../core/service/reporte-excel.Service';


declare var $: any;
@Component({
        selector: 'form-libro-compra',
        templateUrl: '../view/form-libro-compra.component.html',
        providers: [SunatTablaService, LibroCompraService, ReporteExcelService]

})

export class FormLibroCompraComponent extends ControllerComponent implements AfterViewInit {


        titulo: string;
        periodo: string;
        periodo_fecha: any;
        ruc: string;
        razon_social: string;
        id_empresa: string;


        libros_diarios: any[];
        lista_detalle_libro: any[];

        libroCompraSelected = {
                titulo: null,
                periodo: null,
                periodo_fecha: null,
                ruc: null,
                razon_social: null,
                id_conta_libro_compra: null
        };

        //***********PANELES DE LOS MANTENEDORES***********
        panelEditarSelected: boolean = false;
        panelListaBeanSelected: boolean = true;
        panelDetalleLibroSelected: boolean = false;

        //****************OBTEJOS OBTENIDOS DEL FORMULARIO PRODUCTO
        beanSelectedExterno: any;

        //************AGREGAR FILAS AL DETALLE LIBRO DIARIO************
        cantidadCeldas: number = 1;


        /**************TABLAS DEL LIBRO*************/
        tabla_2: any[];
        tabla_10: any[];
        tabla_11: any[];


        constructor(
                public http: Http,
                public router: Router,
                public sunatTablaService: SunatTablaService,
                public libroCompraService: LibroCompraService,
                public reporteExcelService: ReporteExcelService,
        ) {
                super(router,null,reporteExcelService);
                this.panelEditarSelected = false;
        }

        ngOnInit() {
                this.lista_detalle_libro = new Array();
                this.obtenerSunatTabla(2);
                this.obtenerSunatTabla(10);
                this.obtenerSunatTabla(11);
        }


        ngAfterViewInit() {
                if (this.verificarTokenRpta(this.rutasContabilidad.FORM_LIBRO_COMPRA)) {
                        this.obtenerLibrosCompras();
                }
        }


        obtenerSunatTabla(numero_tabla) {
                let parametros = JSON.stringify({
                        id_sunat_tabla: null,
                        codigo: null,
                        descripcion: null,
                        nro_tabla: numero_tabla,
                });

                let user = this.obtenerUsuario();
                this.sunatTablaService.buscarPaginacion(1, 500, 500, parametros)
                        .subscribe(
                                data => {
                                        if (numero_tabla == 2) {
                                                this.tabla_2 = data;
                                        }

                                        if (numero_tabla == 10) {
                                                this.tabla_10 = data;
                                        }

                                        if (numero_tabla == 11) {
                                                this.tabla_11 = data;
                                        }

                                        this.print(data);
                                },
                                error => this.msj = <any>error);
        }





        generarReporteLibro(obj) {

                let parametros = JSON.stringify({
                        id_libro: obj.id_conta_libro_compra
                });

                this.reporteExcelService.obtenerReporteExcel(this.rutasContabilidad.API_LIBRO_COMPRA_REST + "/reporte/", parametros)
                        .subscribe(
                                data => {
                                        if (data._body.size == 0) {
                                                this.mensajeInCorrecto("DOCUMENTO NO PUDO GENERARSE- INTENTA NUEVAMENTE");
                                        } else {
                                                this.descargarFileExtension(data._body, 'registro-compras', 'xlsx');
                                        }


                                },
                                error => this.msj = <any>error
                        );


        }


        limpiarCampos() {

                this.titulo = null;
                this.periodo = null;
                this.periodo_fecha = null;
                this.ruc = null;
                this.razon_social = null;
                this.id_empresa = null;
                this.libroCompraSelected = {
                        titulo: null,
                        periodo: null,
                        periodo_fecha: null,
                        ruc: null,
                        razon_social: null,
                        id_conta_libro_compra: null
                };

        }


        buscar() {

                if (this.tienePermisoPrintMsj(this.rutasContabilidad.FORM_LIBRO_COMPRA, this.rutas.BUTTON_BUSCAR)) {
                        this.getTotalLista();
                        this.seleccionarByPagina(this.inicio, this.fin, this.tamPagina);
                }
        }

        obtenerLibrosCompras() {
                this.limpiarCampos();
                this.getTotalLista();
                this.seleccionarByPagina(this.inicio, this.fin, this.tamPagina);

        }




        getTotalLista() {

                let parametros = JSON.stringify({
                        libro_compra: this.libroCompraSelected,
                        detalle_libro: this.lista_detalle_libro
                });

                this.print("parametros total: " + parametros);
                this.libroCompraService.getTotalParametros(parametros)
                        .subscribe(
                                data => {
                                        this.totalLista = data;
                                        this.print("total:" + data);
                                },
                                error => this.msj = <any>error);
        }



        seleccionarByPagina(inicio: any, fin: any, tamPagina: any) {
                let parametros = JSON.stringify({
                        libro_compra: this.libroCompraSelected,
                        detalle_libro: this.lista_detalle_libro
                });

                let user = this.obtenerUsuario();
                this.libroCompraService.buscarPaginacion(inicio, fin, tamPagina, parametros)
                        .subscribe(
                                data => {
                                        this.libros_diarios = data;
                                        this.print(data);
                                },
                                error => this.msj = <any>error);
        }


        abrirPanelEditar(pro) {

                if (this.tienePermisoPrintMsj(this.rutasContabilidad.FORM_LIBRO_COMPRA, this.rutas.PANEL_EDITAR)) {
                        this.print(pro);

                        this.beanSelectedExterno = pro;

                        this.buscarLibroCompraEditar(pro);

                        this.panelEditarSelected = true;
                        this.panelListaBeanSelected = false;
                        this.panelDetalleLibroSelected = true;
                }
        }


        regresar() {
                this.limpiarCampos();

                this.panelEditarSelected = false;
                this.panelListaBeanSelected = true;
                this.panelDetalleLibroSelected = false;
                $('.nav-tabs a[href="#buscarLibroDiario"]').tab('show');
        }


        obtenerTipoTablaSunat(codigo, numero_tabla) {
                let obj = null;


                if (numero_tabla == 2) {
                        let i;
                        for (i = 0; i < this.tabla_2.length; i++) {

                                //this.print("this.tipos_producto[i].nombre"+this.tipos_producto[i].nombre+" , nombreTipo: " +nombreTipo);
                                if (this.tabla_2[i].codigo == codigo) {
                                        obj = this.tabla_2[i];
                                        break;
                                }
                        }
                }

                if (numero_tabla == 10) {
                        let i;
                        for (i = 0; i < this.tabla_10.length; i++) {

                                //this.print("this.tipos_producto[i].nombre"+this.tipos_producto[i].nombre+" , nombreTipo: " +nombreTipo);
                                if (this.tabla_10[i].codigo == codigo) {
                                        obj = this.tabla_10[i];
                                        break;
                                }
                        }
                }

                if (numero_tabla == 11) {
                        let i;
                        for (i = 0; i < this.tabla_11.length; i++) {

                                //this.print("this.tipos_producto[i].nombre"+this.tipos_producto[i].nombre+" , nombreTipo: " +nombreTipo);
                                if (this.tabla_11[i].codigo == codigo) {
                                        obj = this.tabla_11[i];
                                        break;
                                }
                        }
                }





                return obj;
        }

        buscarLibroCompraEditar(obj) {

                this.libroCompraService.getDetalleLibroById(obj.id_conta_libro_compra)
                        .subscribe(
                                data => {

                                        this.lista_detalle_libro = data.detalle_libro_compra;

                                        for (let i = 0; i < this.lista_detalle_libro.length; i++) {
                                                if (this.lista_detalle_libro[i].id_tabla_codigo_aduana != null) {
                                                        this.lista_detalle_libro[i].serie_codigo_aduanera_comprobante = this.obtenerTipoTablaSunat(this.lista_detalle_libro[i].serie_codigo_aduanera_comprobante, 11);
                                                }

                                                this.lista_detalle_libro[i].inc_codigo_aduana = this.lista_detalle_libro[i].inc_codigo_aduana == 1 ? true : false;
                                                this.lista_detalle_libro[i].tipo_comprobante = this.obtenerTipoTablaSunat(this.lista_detalle_libro[i].tipo_comprobante, 10);
                                                this.lista_detalle_libro[i].tipo_doc_proveedor = this.obtenerTipoTablaSunat(this.lista_detalle_libro[i].tipo_doc_proveedor, 2);
                                                this.lista_detalle_libro[i].tipo_documento_modifica = this.obtenerTipoTablaSunat(this.lista_detalle_libro[i].tipo_documento_modifica, 10);
                                        }

                                        data.libro_compra.periodo_fecha = data.libro_compra.periodo_fecha.substr(0, 10);
                                        this.libroCompraSelected = data.libro_compra;

                                        this.print(data);
                                },
                                error => this.msj = <any>error);

        }


        agregarFilaLibroCompra(cantidad) {

                this.print("tabla 2: ");
                this.print(this.tabla_2);
                this.print("tabla 10: ");
                this.print(this.tabla_10);
                this.print("tabla 11: ");
                this.print(this.tabla_11);

                let i;
                for (i = 0; i < cantidad; i++) {
                        let p = {
                                id_conta_detalle_libro_compra: null,
                                correlativo: null,
                                fecha_emision_comprobante: null,
                                fecha_vencimiento_comprobante: null,
                                /*TABLA 10*/ tipo_comprobante: this.tabla_10[0],
                                /*TABLA 11*/serie_codigo_aduanera_comprobante: this.tabla_11[0],
                                anio_emision_dua_comprobante: null,
                                nro_comprobante_pago: null,
                                /*TABLA 2*/tipo_doc_proveedor: null,
                                nro_doc_proveedor: null,
                                razon_social_proveedor: null,
                                base_imponible_adquisiciones_gravadas_expor: null,
                                igv_adquisiciones_gravadas_expor: null,
                                base_imponible_adquisiciones_expor_no_gravadas: null,
                                igv_adquisiciones_expor_no_gravadas: null,
                                base_imponible_adquisiciones_no_gravadas: null,
                                igv_adquisiciones_no_gravadas: null,
                                valor_adquisiciones_no_gravadas: null,
                                isc: null,
                                otros_tributos_cargos: null,
                                importe_total: null,
                                nro_comprobante_pago_sujeto_no_domiciliado: null,
                                numero_deposito: null,
                                fecha_emision_deposito: null,
                                tipo_cambio: null,
                                fecha_documento_modifica: null,
                                /*TABLA 10*/tipo_documento_modifica: null,
                                serie_documento_modifica: null,
                                nro_documento_modifica: null,
                                id_conta_libro_compra: null,
                                estado: null,
                                inc_codigo_aduana: false
                        }

                        this.lista_detalle_libro.push(p);

                }
        }



        editar() {


                if (this.tienePermisoPrintMsj(this.rutasContabilidad.FORM_LIBRO_COMPRA, this.rutas.BUTTON_ACTUALIZAR)) {


                        let user = this.obtenerUsuario();
                        let f = new Date();

                        let parametros = JSON.stringify({
                                libro_compra: this.libroCompraSelected,
                                detalle_libro: this.lista_detalle_libro
                        });

                        this.libroCompraService.editar(parametros, this.libroCompraSelected.id_conta_libro_compra)
                                .subscribe(
                                        data => {

                                                let rpta = data.rpta;
                                                this.print("rpta: " + rpta);
                                                if (rpta != null) {
                                                        if (rpta) {
                                                                this.mensajeCorrecto("LIBRO COMPRA MODIFICADO CORRECTAMENTE");
                                                        } else {
                                                                this.mensajeInCorrecto("LIBRO COMPRA  NO MODIFICADA");
                                                        }
                                                }

                                        },
                                        error => this.msj = <any>error
                                );

                }
        }

        eliminarItem(i) {
                this.print("INDICE A ELIMINAR: " + i);
                this.lista_detalle_libro.splice(i, 1)
        }

        generarPle(bean) {

                if (this.tienePermisoPrintMsj(this.rutasContabilidad.FORM_LIBRO_COMPRA, this.rutas.BUTTON_ELIMINAR)) {

                        let parametros = JSON.stringify({
                                id_conta_libro_compra: bean.id_conta_libro_compra
                        });

                        this.reporteExcelService.descarArchivoPle(parametros)
                                .subscribe(
                                        data => {
                                                this.print("response: ");
                                                this.print(data);
                                                this.print("data: ");
                                                this.print(data.data);
                                                this.descargarFileExtension(data._body,"archivo","txt");
                                        },
                                        error => this.msj = <any>error
                                        );

                }
        }



        sincronizar(bean) {

                if (this.tienePermisoPrintMsj(this.rutasContabilidad.FORM_LIBRO_COMPRA, this.rutas.BUTTON_ELIMINAR)) {


                        var date = new Date(bean.periodo_fecha);
                        var primerDia = new Date(date.getFullYear(), date.getMonth(), 1);
                        var ultimoDia = new Date(date.getFullYear(), date.getMonth() + 1, 0);

                        this.print("primerDia: " + this.convertirFechaMysql(primerDia));
                        this.print("ultimoDia: " + this.convertirFechaMysql(ultimoDia));

                        let parametros = JSON.stringify({
                                id_conta_libro_compra: bean.id_conta_libro_compra,
                                fecha_inicio: this.convertirFechaMysql(primerDia),
                                fecha_fin: this.convertirFechaMysql(ultimoDia)


                        });

                        if (confirm("Realmente Desea Sincronizar ?")) {
                                this.libroCompraService.sincronizarLibro(parametros)
                                        .subscribe(
                                                data => {
                                                        let rpta = data;
                                                        if (rpta != null) {
                                                                if (rpta == 1) {
                                                                        this.mensajeCorrecto("LIBRO DE COMPRA SINCRONIZADO CORRECTAMENTE");
                                                                } else {
                                                                        this.mensajeInCorrecto("LIBRO DE COMPRA NO SINCRONIZADO");
                                                                }

                                                        }
                                                },
                                                error => this.msj = <any>error);
                        }
                }
        }

        eliminar(bean) {

                if (this.tienePermisoPrintMsj(this.rutasContabilidad.FORM_LIBRO_COMPRA, this.rutas.BUTTON_ELIMINAR)) {
                        let user = this.obtenerUsuario();
                        if (confirm("Realmente Desea Eliminar ?")) {
                                this.libroCompraService.eliminarLogico(bean.id_conta_libro_compra)
                                        .subscribe(
                                                data => {
                                                        this.obtenerLibrosCompras();
                                                        let rpta = data;
                                                        if (rpta != null) {
                                                                if (rpta == 1) {
                                                                        this.mensajeCorrecto("LIBRO COMPRA ELIMINADO CORRECTAMENTE");
                                                                } else {
                                                                        this.mensajeInCorrecto("LIBRO COMPRA NO ELIMINADO");
                                                                }

                                                        }
                                                },
                                                error => this.msj = <any>error);
                        }
                }
        }



        limpiar() {
                this.limpiarCampos();
                this.inicio = 1;
                this.fin = 10;
                this.tamPagina = 10;
                this.getTotalLista();
                this.seleccionarByPagina(this.inicio, this.fin, this.tamPagina);
        }


        registrar() {

                if (this.tienePermisoPrintMsj(this.rutasContabilidad.FORM_LIBRO_COMPRA, this.rutas.BUTTON_REGISTRAR)) {

                        let user = this.obtenerUsuario();
                        let f = new Date();

                        let parametros = JSON.stringify({
                                libro_diario: this.libroCompraSelected,
                                detalle_libro: this.lista_detalle_libro
                        });

                        this.libroCompraService.registrar(parametros)
                                .subscribe(
                                        data => {
                                                //this.idCompraSelected = data.id_compra
                                                this.obtenerLibrosCompras();
                                                let rpta = data.rpta;
                                                this.print("rpta: " + rpta);
                                                if (rpta != null) {
                                                        if (rpta == 1) {

                                                                this.mensajeCorrectoSinCerrar("LIBRO COMPRA REGISTRADO CORRECTAMENTE  - COD :" + data.id_conta_libro_compra);

                                                        } else {
                                                                this.mensajeInCorrecto("LIBRO COMPRA NO REGISTRADO");

                                                        }
                                                }


                                        },
                                        error => this.msj = <any>error
                                );
                }
        }

}