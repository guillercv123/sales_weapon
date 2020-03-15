import { Component, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';

import { ControllerComponent } from '../../../core/controller/controller.component';




/******************IMPORTAR SERVICIOS*************** */

import { VentaService } from '../../ventas/service/venta.service';
import { CompraService } from '../../compras/service/compra.service';
import { StockService } from '../service/stock.service';
import { TipoMonedaService } from '../../mantenedores/service/tipo-moneda.service';
import { UnidadMedidaService } from '../../mantenedores/service/unidad-medida.service';
import { ProductoService } from '../../mantenedores/service/producto.service';
import { LocalService } from '../../mantenedores/service/local.service';
import { AlmacenService } from '../../mantenedores/service/almacen.service';
import { ReportePdfService } from '../../../core/service/reporte-pdf.Service';
import { ReporteExcelService } from '../../../core/service/reporte-excel.Service';

import { Vista } from '../model/Vista';

declare var $: any;
@Component({
        selector: 'form-stock',
        templateUrl: '../view/form-stock.component.html',
        providers: [CompraService , VentaService,ReportePdfService, ReporteExcelService, StockService, TipoMonedaService, UnidadMedidaService, ProductoService, LocalService, AlmacenService]

})

export class FormStockComponent extends ControllerComponent implements AfterViewInit {

        estadoSelected: string;
        //tipos_producto: any[];
        listaStock: any[];
        listaStockDetalle: any[];
        listaStockResumenDetalle: any[];


        /*idTipoMonedaSelected: string;
        simboloSelected: string;
        observacionSelected: string;
        ordenPresentacionSelected: number;
        */
        nombreSelected: string;
        cantidadSelected: string;
        aumentoSelected: number = 1;
        id_producto_Selected: number;

        listaProductos: any[];
        unidades_medida: any[];
        tiposMoneda: any[];
        almacenesUsuario: any[];
        almacenUsuarioSelected: any;

        almacenes: any[];
        locales: any[];
        localSelected: any;
        simboloSelected: string = "IGUAL";
        fechaInicioSelected: any;
        fechaFinSelected: any;
        //rucSelected:string;
        //representanteSelected:string;
        //telefonoSelected:string;
        //correoSelected:string;


        //************OBJETO ELEGIDO PARA EDITAR************
        beanSelected: any;

        //***********PANELES DE LOS MANTENEDORES***********

        panelEditarSelected: boolean = false;
        panelListaBeanSelected: boolean = true;
        
        /*************VARIBLES PARA EL AUTOCOMPLETADO***/
        indiceLista: any = -1;
        tamanio_lista_mostrar: number = 100;

        /*********BUSQUEDA DE PRODUCTOS MULTIPLE************/
        cantidadCeldas: number = 1;



        //VARIBLES PARA EL AUTOCOMPLETADO PRODUCTO
        lista_autocompletado: any;
        indiceListaProducto: any = -1;
        eleccion_autocompletado_selected: boolean = false;
        tamanio_lista_mostrarProducto: number = 100;


        /*************VARIABLES PAGINACION DE STOCK DETALLADO**************/
        totalListaDetalle: number;
        inicioDetalle: number = 1;
        finDetalle: number = 10;
        tamPaginaDetalle: number = 10;


        /*************VARIABLES PAGINACION DE STOCK DETALLADO**************/
        totalListaResumenDetalle: number;
        inicioResumenDetalle: number = 1;
        finResumenDetalle: number = 10;
        tamPaginaResumenDetalle: number = 10;


        /***************Detalle Venta****************/   
        panelDetalleVentaSelected: boolean = false;
        listaProductosDetalle: any[];
        ventaSelected: any;
        compraSelected: any;
        
        constructor(
                public http: Http,
                public router: Router,
                public stockService: StockService,
                public ventaService: VentaService,
                public compraService: CompraService,
                public tipoMonedaService: TipoMonedaService,
                public unidadMedidaService: UnidadMedidaService,
                public productoService: ProductoService,
                public localService: LocalService,
                public almacenService: AlmacenService,
                public reportePdfService: ReportePdfService,
                public reporteExcelService: ReporteExcelService
        ) {
                super(router, reportePdfService, reporteExcelService);


                this.panelEditarSelected = false;
        }


        ngOnInit() {
                this.limpiarCampos();
                this.listaProductos = new Array();
                //this.almacenesUsuario=this.obtenerAlmacenes();  
                //this.almacenUsuarioSelected=this.almacenesUsuario!=null?this.almacenesUsuario[0]:null;

        }


        ngAfterViewInit() {
                if (this.verificarTokenRpta(this.rutasMantenedores.FORM_STOCK)) {
                        this.obtenerStock();
                        this.obtenerTipoMoneda();
                        this.obtenerUnidadesMedida();
                        this.obtenerLocales();
                        this.obtenerStockDetalle();
                        this.obtenerStockResumenDetalle();
                }
        }


        obtenerTipoMoneda() {

                this.tipoMonedaService.getAll()
                        .subscribe(
                                data => {//this.vistas = data;

                                        this.tiposMoneda = data;
                                },
                                error => this.msj = <any>error);
        }

        obtenerUnidadesMedida() {

                let parametros = JSON.stringify({
                        id_unidad_medida: null,
                        nombre: null,
                        orden_presentacion: null,
                        observacion: null,
                        simbolo: null,
                        is_para_comprobante: 1
                });

                this.unidadMedidaService.buscarPaginacion(1, 1000, 1000, parametros)
                        .subscribe(
                                data => {//this.vistas = data;

                                        this.unidades_medida = data;
                                },
                                error => this.msj = <any>error);
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
                if (this.tienePermisoPrintMsj(this.rutas.FORM_STOCK, this.rutas.PANEL_EDITAR)) {
                        this.beanSelected = pro;
                        //this.tipoProSelected=this.obtenerTipoActual(pro.nombre_tipo_producto);
                        /*this.idTipoMonedaSelected = pro.id_tipo_producto;
                        this.nombreSelected = pro.nombre;
                        this.simboloSelected = pro.simbolo;
                        this.ordenPresentacionSelected = pro.orden_presentacion;
                        this.observacionSelected = pro.observacion;
                        */
                        this.panelEditarSelected = true;
                        this.panelListaBeanSelected = false;
                }
        }



        buscarCompraVenta(obj){
                if(obj.tipo_compra_venta=='VENTA'){
                        this.buscarVenta(obj);
                }

                if(obj.tipo_compra_venta=='COMPRA'){
                        this.buscarCompra(obj);
                }
        }


        buscarVenta(obj) {
                this.abrirModal("modalVenta");

                this.ventaService.getVentaById(obj.id_compra_venta)
                                .subscribe(
                                data => {
                                        this.listaProductosDetalle = data.detalle_venta;
                                        this.ventaSelected = data.venta;
                                        this.print(data);
                                },
                                error => this.msj = <any>error);
                
        }


        buscarCompra(obj) {
                this.abrirModal("modalCompra");

                this.compraService.getCompraById(obj.id_compra_venta)
                                .subscribe(
                                data => {
                                        this.listaProductosDetalle = data.detalle_compra;
                                        this.compraSelected = data.compra;
                                        this.print(data);
                                },
                                error => this.msj = <any>error);
                
        }


        agregarProductoMultiple(cantidad) {

                var f = new Date();
                let i;
                for (i = 0; i < cantidad; i++) {
                        let p = {



                                id_producto: null,
                                precio: 1,
                                cantidad: 1,
                                descripcion: "",
                                proveedor: "",
                                nombre: "",
                                nombre_marca: "",
                                fecha: f.getFullYear() + "-" + this.completarCerosIzquierda(2, "" + (f.getMonth() + 1)) + "-" + this.completarCerosIzquierda(2, "" + f.getDate()),
                                lista_autocompletado: null,
                                eleccion_autocompletado_selected: false,
                                precio_referencia: 1,
                                unidad_medida: this.unidades_medida[0],
                                tipo_moneda: this.tiposMoneda[0],
                                nombre_tipo_producto: "",
                                nombre_unidad_medida: "",
                                nombre_aplicacion: "",
                                medida_a: "",
                                medida_b: "",
                                medida_c: "",
                                medida_d: ""
                        }

                        this.print("pro: ");
                        this.print(p);
                        this.listaProductos.push(p);
                }
        }

        regresar() {
                this.limpiarCampos();
                this.panelEditarSelected = false;
                this.panelListaBeanSelected = true;
        }


        obtenerStock() {
                this.limpiarCampos();
                this.getTotalLista();
                this.seleccionarByPagina(this.inicio, this.fin, this.tamPagina);
        }

        obtenerStockDetalle() {
                this.limpiarCampos();
                this.getTotalListaDetalle();
                this.seleccionarByPaginaDetalle(this.inicioDetalle, this.finDetalle, this.tamPaginaDetalle);
        }


        obtenerStockResumenDetalle() {
                this.limpiarCampos();
                this.getTotalResumenListaDetalle();
                this.seleccionarByPaginaResumenDetalle(this.inicioResumenDetalle, this.finResumenDetalle, this.tamPaginaResumenDetalle);
        }


        limpiar() {
                this.limpiarCampos();
                this.inicio = 1;
                this.fin = 10;
                this.tamPagina = 10;
                this.getTotalLista();
                this.seleccionarByPagina(this.inicio, this.fin, this.tamPagina);
        }


        limpiarDetallado() {
                this.limpiarCampos();
                this.inicioDetalle = 1;
                this.finDetalle = 10;
                this.tamPaginaDetalle = 10;
                this.getTotalListaDetalle();
                this.seleccionarByPaginaDetalle(this.inicioDetalle, this.finDetalle, this.tamPaginaDetalle);
        }


        limpiarResumenDetallado() {
                this.limpiarCampos();
                this.inicioResumenDetalle = 1;
                this.finResumenDetalle = 10;
                this.tamPaginaResumenDetalle = 10;
                this.getTotalResumenListaDetalle();
                this.seleccionarByPaginaResumenDetalle(this.inicioResumenDetalle, this.finResumenDetalle, this.tamPaginaResumenDetalle);
        }



        seleccionarByPagina(inicio: any, fin: any, tamPagina: any) {
                this.completado = true;
                let parametros = JSON.stringify({
                        cantidad: this.cantidadSelected,
                        simbolo: this.simboloSelected,
                        id_producto: this.id_producto_Selected,
                        fecha_inicio: this.fechaInicioSelected,
                        fecha_fin: this.fechaFinSelected
                });

                this.stockService.buscarPaginacion(inicio, fin, tamPagina, parametros)
                        .subscribe(
                                data => {
                                        this.listaStock = data;
                                        this.completado = false;
                                        this.print(data);
                                },
                                error => this.msj = <any>error);
        }


        seleccionarByPaginaDetalle(inicio: any, fin: any, tamPagina: any) {
                this.completado = true;
                let parametros = JSON.stringify({
                        cantidad: this.cantidadSelected,
                        simbolo: this.simboloSelected,
                        id_producto: this.id_producto_Selected,
                        fecha_inicio: this.fechaInicioSelected,
                        fecha_fin: this.fechaFinSelected,
                        estado: this.estadoSelected
                });

                this.stockService.buscarPaginacionDetalle(inicio, fin, tamPagina, parametros)
                        .subscribe(
                                data => {
                                        this.listaStockDetalle = data;
                                        this.completado = false;
                                        this.print(data);
                                },
                                error => this.msj = <any>error);
        }


        seleccionarByPaginaResumenDetalle(inicio: any, fin: any, tamPagina: any) {
                this.completado = true;
                let parametros = JSON.stringify({
                        cantidad: this.cantidadSelected,
                        simbolo: this.simboloSelected,
                        id_producto: this.id_producto_Selected,
                        fecha_inicio: this.fechaInicioSelected,
                        fecha_fin: this.fechaFinSelected,
                        estado: this.estadoSelected,
                        id_almacen:this.almacenUsuarioSelected==null?null:this.almacenUsuarioSelected.id_almacen
                });

                this.stockService.buscarPaginacionResumenDetalle(inicio, fin, tamPagina, parametros)
                        .subscribe(
                                data => {
                                        this.listaStockResumenDetalle = data;
                                        this.completado = false;
                                        this.print(data);
                                },
                                error => this.msj = <any>error);
        }


        registrar() {

                if (this.tienePermisoPrintMsj(this.rutas.FORM_STOCK, this.rutas.BUTTON_REGISTRAR)) {
                        let parametros = JSON.stringify({
                                /*nombre: this.nombreSelected,
                                simbolo: this.simboloSelected,
                                observacion: this.observacionSelected,
                                orden_presentacion: this.ordenPresentacionSelected*/
                        });
                        this.stockService.registrar(parametros)
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

                                                this.obtenerStock();

                                        },
                                        error => this.msj = <any>error
                                );
                }
        }


        registrarMultiple() {

                if (this.tienePermisoPrintMsj(this.rutas.FORM_STOCK, this.rutas.BUTTON_REGISTRAR)) {
                        let user = this.obtenerUsuario();

                        let parametros = JSON.stringify({
                                aumento: this.aumentoSelected,
                                id_almacen: this.almacenUsuarioSelected.id_almacen,
                                lista_productos: this.listaProductos
                        });

                        this.stockService.registrarMultiple(parametros)
                                .subscribe(
                                        data => {

                                                let rpta = data.rpta;
                                                this.print("rpta: " + rpta);
                                                if (rpta != null) {
                                                        if (rpta == 1) {

                                                                this.mensajeCorrectoSinCerrar("STOCK DE PRODUCTOS REGISTRADOS CORRECTAMENTE ");

                                                        } else {
                                                                this.mensajeInCorrecto("STOCK DE PRODUCTOS REGISTRADOS NO REGISTRADOS");

                                                        }
                                                }

                                        },
                                        error => this.msj = <any>error
                                );
                }
        }

        obtenerLocales() {

                this.localService.getAll()
                        .subscribe(
                                data => {//this.vistas = data;

                                        this.locales = data;
                                        this.localSelected = this.locales[0];
                                        this.mostrarAlmacen(this.localSelected);

                                },
                                error => this.msj = <any>error);
        }

        mostrarAlmacen(local) {
                this.obtenerAlmaceneByIdLocal(local.id_local);

        }

        obtenerAlmaceneByIdLocal(id) {

                this.almacenService.getByIdLocal(id)
                        .subscribe(
                                data => {//this.vistas = data;

                                        this.almacenes = data;
                                },
                                error => this.msj = <any>error);
        }


        buscar() {
                if (this.tienePermisoPrintMsj(this.rutas.FORM_STOCK, this.rutas.BUTTON_BUSCAR)) {
                        this.inicio = 1;
                        if (this.tamPagina == -1) {
                                this.fin = this.totalLista;
                                this.tamPagina = this.totalLista;
                                this.getTotalLista();
                                this.seleccionarByPagina(this.inicio, this.fin, this.tamPagina);
                                this.tamPagina = -1;
                        } else {
                                this.fin = this.tamPagina;
                                this.tamPagina = this.tamPagina;
                                this.getTotalLista();
                                this.seleccionarByPagina(this.inicio, this.fin, this.tamPagina);
                        }

                }
        }

        buscarResumenDetallado() {
                if (this.tienePermisoPrintMsj(this.rutas.FORM_STOCK, this.rutas.BUTTON_BUSCAR)) {
                        this.inicioResumenDetalle = 1;
                        if (this.tamPaginaResumenDetalle == -1) {
                                this.tamPaginaResumenDetalle = this.totalListaResumenDetalle;
                                this.finResumenDetalle = this.totalListaResumenDetalle;
                                this.getTotalResumenListaDetalle();
                                this.seleccionarByPaginaResumenDetalle(this.inicioResumenDetalle, this.finResumenDetalle, this.tamPaginaResumenDetalle);
                                this.tamPaginaResumenDetalle = -1;
                        } else {
                                this.finResumenDetalle = this.tamPaginaResumenDetalle;
                                this.tamPaginaResumenDetalle = this.tamPaginaResumenDetalle;
                                this.getTotalResumenListaDetalle();
                                this.seleccionarByPaginaResumenDetalle(this.inicioResumenDetalle, this.finResumenDetalle, this.tamPaginaResumenDetalle);

                        }
                }
        }


        buscarDetallado() {
                if (this.tienePermisoPrintMsj(this.rutas.FORM_STOCK, this.rutas.BUTTON_BUSCAR)) {
                        this.inicioDetalle = 1;
                        if (this.tamPaginaDetalle == -1) {
                                this.tamPaginaDetalle = this.totalListaDetalle;
                                this.finDetalle = this.totalListaDetalle;
                                this.getTotalListaDetalle();
                                this.seleccionarByPaginaDetalle(this.inicioDetalle, this.finDetalle, this.tamPaginaDetalle);
                                this.tamPaginaDetalle = -1;
                        } else {
                                this.finDetalle = this.tamPaginaDetalle;
                                this.tamPaginaDetalle = this.tamPaginaDetalle;
                                this.getTotalListaDetalle();
                                this.seleccionarByPaginaDetalle(this.inicioDetalle, this.finDetalle, this.tamPaginaDetalle);

                        }
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
                        cantidad: this.cantidadSelected,
                        simbolo: this.simboloSelected,
                        id_producto: this.id_producto_Selected,
                        fecha_inicio: this.fechaInicioSelected,
                        fecha_fin: this.fechaFinSelected
                });

                this.print("parametros total: " + parametros);
                this.stockService.getTotalParametros(parametros)
                        .subscribe(
                                data => {
                                        this.totalLista = data;
                                        this.print("total:" + data);
                                },
                                error => this.msj = <any>error);
        }


        getTotalListaDetalle() {
                /*this.productoService.getTotal()
                        .subscribe(
                        data => {
                                this.totalLista = data;
                                this.print(data);
                        },
                        error => this.msj = <any>error);*/
                let parametros = JSON.stringify({
                        cantidad: this.cantidadSelected,
                        simbolo: this.simboloSelected,
                        id_producto: this.id_producto_Selected,
                        fecha_inicio: this.fechaInicioSelected,
                        fecha_fin: this.fechaFinSelected,
                        estado: this.estadoSelected
                });

                this.print("parametros total: " + parametros);
                this.stockService.getTotalParametrosDetalle(parametros)
                        .subscribe(
                                data => {
                                        this.totalListaDetalle = data;
                                        this.print("total:" + data);
                                },
                                error => this.msj = <any>error);
        }


        getTotalResumenListaDetalle() {
                /*this.productoService.getTotal()
                        .subscribe(
                        data => {
                                this.totalLista = data;
                                this.print(data);
                        },
                        error => this.msj = <any>error);*/
                let parametros = JSON.stringify({
                        cantidad: this.cantidadSelected,
                        simbolo: this.simboloSelected,
                        id_producto: this.id_producto_Selected,
                        fecha_inicio: this.fechaInicioSelected,
                        fecha_fin: this.fechaFinSelected,
                        estado: this.estadoSelected,
                        id_almacen:this.almacenUsuarioSelected==null?null:this.almacenUsuarioSelected.id_almacen
                });

                this.print("parametros total: " + parametros);
                this.stockService.getTotalParametrosResumenDetalle(parametros)
                        .subscribe(
                                data => {
                                        this.totalListaResumenDetalle = data;
                                        this.print("total:" + data);
                                },
                                error => this.msj = <any>error);
        }


        eliminar(bean) {

                if (this.tienePermisoPrintMsj(this.rutas.FORM_STOCK, this.rutas.BUTTON_ELIMINAR)) {
                        if (confirm("Realmente Desea Eliminar ?")) {
                                this.stockService.eliminarLogico(bean.id_tipo_moneda)
                                        .subscribe(
                                                data => {
                                                        this.obtenerStock();
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


        eliminarListaMultiple(i) {
                this.print("INDICE A ELIMINAR: " + i);
                this.listaProductos.splice(i, 1)
        }

        limpiarTodo() {
                this.listaProductos = new Array();
        }

        editar() {

                if (this.tienePermisoPrintMsj(this.rutas.FORM_STOCK, this.rutas.BUTTON_ACTUALIZAR)) {
                        let parametros = JSON.stringify({
                                /* nombre: this.nombreSelected,
                                 simbolo: this.simboloSelected,
                                 observacion: this.observacionSelected,
                                 orden_presentacion: this.ordenPresentacionSelected*/
                        });

                        this.print("parametros: " + parametros);
                        this.stockService.editar(parametros, this.beanSelected.id_tipo_moneda)
                                .subscribe(
                                        data => {
                                                this.obtenerStock();
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
                this.localSelected=null;
                this.cantidadSelected = null;
                this.nombreSelected = null;
                this.id_producto_Selected = null;
                this.fechaFinSelected = null;
                this.fechaInicioSelected = null;
                this.simboloSelected = null;
                this.estadoSelected = "";
                /*this.simboloSelected = null
                this.idTipoMonedaSelected = null;
                this.observacionSelected = null;
                this.ordenPresentacionSelected = null;*/
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



        //***********MANEJO DEL AUTOCOMPLETADO************


        teclaKeyPressAutocomplete(event: any, indice: any) {

                if (!this.listaProductos[indice].eleccion_autocompletado_selected && event.keyCode == 13) {
                        this.listaProductos[indice].lista_autocompletado = null;
                        this.listaProductos[indice].eleccion_autocompletado_selected = false;
                        this.indiceLista = -1;
                        this.buscar();
                        return false;
                }

                if (this.listaProductos[indice].eleccion_autocompletado_selected && event.keyCode == 13) {
                        this.elegirProducto(this.listaProductos[indice].lista_autocompletado[this.indiceLista], indice);
                }


                if (event.keyCode == 27) {
                        this.listaProductos[indice].lista_autocompletado = null;
                        this.indiceLista = -1;
                        this.listaProductos[indice].eleccion_autocompletado_selected = false;
                }


        }


        teclaKeyDownAutocomplete(event: any, indice: any) {
                if (event.keyCode == 38 || event.keyCode == 40 || event.keyCode == 32 || event.keyCode == 13) {

                        //************MANEJO DE TECLAS AUTOCOMPLETADO*********
                        //************FLECHA HACIA ARRIBA************
                        if (event.keyCode == 38) {

                                let lista = [];
                                lista = $('.lista-diego2 li');

                                //$('.lista-diego2 li').each(function(indice, elemento) {
                                //this.print('El elemento con el índice '+indice+' contiene '+$(elemento).text());
                                //});
                                if (lista.length >= 0) {

                                        this.indiceLista = this.indiceLista == -1 ? lista.length - 1 : this.indiceLista;
                                        if (this.indiceLista >= 0) {
                                                this.indiceLista--;
                                                this.indiceLista = this.indiceLista == -1 ? lista.length - 1 : this.indiceLista;

                                                $('.lista-diego2 li').removeClass();
                                                $(lista[this.indiceLista]).addClass("seleccionado");
                                        }

                                }




                                this.print("PRESIONASTE TECLA HACIA ARRIBA UP")
                                this.print("tamaño: " + $('.lista-diego2 li'));
                                this.print("tam:" + lista.length);
                                this.print("indice:" + this.indiceLista);

                        }

                        //******************FLECHA HACI ABAJO***************** 
                        if (event.keyCode == 40) {

                                let lista = [];
                                lista = $('.lista-diego2 li');
                                if (lista.length > 0) {
                                        //$(lista[this.indiceLista]).addClass( "seleccionado" );
                                        this.print("condicion: " + this.indiceLista + "tam:" + (lista.length - 1));
                                        if (this.indiceLista <= lista.length - 1) {
                                                this.indiceLista++
                                                $('.lista-diego2 li').removeClass();
                                                $(lista[this.indiceLista]).addClass("seleccionado");
                                        }

                                        if (this.indiceLista == lista.length) {
                                                this.indiceLista = 0;
                                                $('.lista-diego2 li').removeClass();
                                                $(lista[this.indiceLista]).addClass("seleccionado");
                                        }


                                }

                                this.print("PRESIONASTE TECLA HACIA ABAJO UP")
                                this.print("tamaño: " + $('.lista-diego2 li'));
                                this.print("tam:" + lista.length);
                                this.print("indice:" + this.indiceLista);

                        }


                }
        }


        teclaKeyUpAutocomplete(event: any, indice: any) {

                //  tecla flecha arriba     :  38
                //  tecla flecha abajo      :  40
                //  tecla enter             :  13
                //  tecla barra espaciadora : 32
                //  tecla escape            : 27

                if (event.keyCode != 38 && event.keyCode != 40 && event.keyCode != 13 && event.keyCode != 27) {
                        this.listaNulaAutocompletado();
                        this.listaProductos[indice].activo = true;


                        let lista = [];
                        lista = $('.listaPro tr');

                        var posicion = $(lista[indice]).position();
                        //alert( "left: " + posicion.left + ", top: " + posicion.top );
                        $(".lista-diego22").css({ top: posicion.top, left: posicion.left });


                        this.buscarAutocompletado(indice);
                }

                if (event.keyCode == 27) {
                        this.indiceLista = -1;
                        this.listaProductos[indice].lista_autocompletado = null;
                        this.listaProductos[indice].eleccion_autocompletado_selected = false;
                }
        }



        elegirProducto(producto: any, indice: any) {
                if (producto != null) {
                        this.print(producto);
                        this.indiceLista = -1;
                        this.listaProductos[indice].nombre = producto.nombre;
                        this.listaProductos[indice].nombre_marca = producto.nombre_marca;

                        this.listaProductos[indice].id_producto = producto.id_producto;
                        this.listaProductos[indice].id_unidad_medida = producto.id_unidad_medida;
                        this.listaProductos[indice].nombre_tipo_producto = producto.nombre_tipo_producto;
                        //this.listaProductos[indice].unidad_medida=this.obtenerUnidadMedidaActual(producto.nombre_unidad_medida);
                        this.listaProductos[indice].nombre_unidad_medida = producto.nombre_unidad_medida;
                        this.listaProductos[indice].id_unidad_medida = this.unidades_medida.length > 0 ? this.unidades_medida[0].id_unidad_medida : null;
                        this.listaProductos[indice].nombre_aplicacion = producto.nombre_aplicacion;
                        this.listaProductos[indice].medida_a = producto.medida_a;
                        this.listaProductos[indice].medida_b = producto.medida_b;
                        this.listaProductos[indice].medida_c = producto.medida_c;
                        this.listaProductos[indice].medida_d = producto.medida_d;
                        this.listaProductos[indice].descripcion = producto.descripcion;




                        this.listaProductos[indice].lista_autocompletado = null;
                        this.listaProductos[indice].eleccion_autocompletado_selected = false;


                }
        }

        buscarAutocompletado(indice) {

                let nombre = this.listaProductos[indice].nombre;
                this.indiceLista = -1;
                if (nombre != "") {
                        this.seleccionarByPaginaAutocompletado(1, this.tamanio_lista_mostrar, this.tamanio_lista_mostrar, indice);
                } else {
                        this.listaProductos[indice].lista_autocompletado = null;
                        this.buscar();
                }
        }

        listaNulaAutocompletado() {
                let i;
                for (i = 0; i < this.listaProductos.length; i++) {
                        this.listaProductos[i].activo = false;
                }
        }


        seleccionarByPaginaAutocompletado(inicio: any, fin: any, tamPagina: any, indice: any) {

                let nombre = this.listaProductos[indice].nombre;
                let parametros = JSON.stringify({
                        nombre: nombre

                });

                let user = this.obtenerUsuario();
                this.productoService.buscarPaginacion(inicio, fin, tamPagina, parametros)
                        .subscribe(
                                data => {
                                        this.listaProductos[indice].lista_autocompletado = data;
                                        this.listaProductos[indice].eleccion_autocompletado_selected = true;

                                        /*if(this.listaProductos.length>0){
                                                this.fin=this.listaProductos[this.listaProductos.length-1].correlativoDoc;
                                        }*/

                                        this.print("lista autocompletado: ");
                                        this.print(data);
                                },
                                error => this.msj = <any>error);
        }










        //***********MANEJO DEL AUTOCOMPLETADO PRODUCTO BUSQUEDA************
        teclaKeyPressAutocompleteProducto(event: any) {

                if (!this.eleccion_autocompletado_selected && event.keyCode == 13) {
                        this.lista_autocompletado = null;
                        this.eleccion_autocompletado_selected = false;
                        this.indiceListaProducto = -1;
                        this.buscar();
                        return false;
                }

                if (this.eleccion_autocompletado_selected && event.keyCode == 13) {
                        this.elegirProducto2(this.lista_autocompletado[this.indiceListaProducto]);
                }


                if (event.keyCode == 27) {
                        this.lista_autocompletado = null;
                        this.indiceListaProducto = -1;
                        this.eleccion_autocompletado_selected = false;
                }


        }


        teclaKeyDownAutocompleteProducto(event: any) {
                if (event.keyCode == 38 || event.keyCode == 40 || event.keyCode == 32 || event.keyCode == 13) {

                        //************MANEJO DE TECLAS AUTOCOMPLETADO*********
                        //************FLECHA HACIA ARRIBA************
                        if (event.keyCode == 38) {

                                let lista = [];
                                lista = $('.lista-diego li');

                                //$('.lista-diego li').each(function(indice, elemento) {
                                //this.print('El elemento con el índice '+indice+' contiene '+$(elemento).text());
                                //});
                                if (lista.length >= 0) {

                                        this.indiceListaProducto = this.indiceListaProducto == -1 ? lista.length - 1 : this.indiceListaProducto;
                                        if (this.indiceListaProducto >= 0) {
                                                this.indiceListaProducto--;
                                                this.indiceListaProducto = this.indiceListaProducto == -1 ? lista.length - 1 : this.indiceListaProducto;

                                                $('.lista-diego li').removeClass();
                                                $(lista[this.indiceListaProducto]).addClass("seleccionado");
                                        }

                                }




                                this.print("PRESIONASTE TECLA HACIA ARRIBA UP")
                                this.print("tamaño: " + $('.lista-diego li'));
                                this.print("tam:" + lista.length);
                                this.print("indice:" + this.indiceListaProducto);

                        }

                        //******************FLECHA HACI ABAJO***************** 
                        if (event.keyCode == 40) {

                                let lista = [];
                                lista = $('.lista-diego li');
                                if (lista.length > 0) {
                                        //$(lista[this.indiceLista]).addClass( "seleccionado" );
                                        this.print("condicion: " + this.indiceListaProducto + "tam:" + (lista.length - 1));
                                        if (this.indiceListaProducto <= lista.length - 1) {
                                                this.indiceListaProducto++
                                                $('.lista-diego li').removeClass();
                                                $(lista[this.indiceListaProducto]).addClass("seleccionado");
                                        }

                                        if (this.indiceListaProducto == lista.length) {
                                                this.indiceListaProducto = 0;
                                                $('.lista-diego li').removeClass();
                                                $(lista[this.indiceListaProducto]).addClass("seleccionado");
                                        }


                                }

                                this.print("PRESIONASTE TECLA HACIA ABAJO UP")
                                this.print("tamaño: " + $('.lista-diego li'));
                                this.print("tam:" + lista.length);
                                this.print("indice:" + this.indiceListaProducto);

                        }


                }
        }


        teclaKeyUpAutocompleteProducto(event: any) {

                //  tecla flecha arriba     :  38
                //  tecla flecha abajo      :  40
                //  tecla enter             :  13
                //  tecla barra espaciadora : 32
                //  tecla escape            : 27

                if (event.keyCode != 38 && event.keyCode != 40 && event.keyCode != 13 && event.keyCode != 27) {
                        this.buscarAutocompletadoProducto();
                }

                if (event.keyCode == 27) {
                        this.indiceListaProducto = -1;
                        this.lista_autocompletado = null;
                        this.eleccion_autocompletado_selected = false;
                }
        }



        elegirProducto2(producto: any) {
                if (producto != null) {
                        this.print(producto);
                        this.indiceListaProducto = -1;
                        this.nombreSelected = producto.nombre;
                        this.lista_autocompletado = null;
                        this.eleccion_autocompletado_selected = false;
                        this.id_producto_Selected = producto.id_producto;
                }
        }

        buscarAutocompletadoProducto() {
                this.indiceListaProducto = -1;
                if (this.nombreSelected != "") {
                        this.seleccionarByPaginaAutocompletadoProducto(1, this.tamanio_lista_mostrarProducto, this.tamanio_lista_mostrarProducto);
                } else {
                        this.lista_autocompletado = null;
                        this.buscar();
                }
        }

        seleccionarByPaginaAutocompletadoProducto(inicio: any, fin: any, tamPagina: any) {
                let parametros = JSON.stringify({
                        nombre: this.nombreSelected
                });

                let user = this.obtenerUsuario();
                this.productoService.buscarPaginacion(inicio, fin, tamPagina, parametros)
                        .subscribe(
                                data => {
                                        this.lista_autocompletado = data;
                                        this.eleccion_autocompletado_selected = true;

                                        /*if(this.listaProductos.length>0){
                                                this.fin=this.listaProductos[this.listaProductos.length-1].correlativoDoc;
                                        }*/
                                        this.print(data);
                                },
                                error => this.msj = <any>error);
        }

        /*****************EXPORTACION DE EXCEL Y PDF**************/
        exportarExcel() {
                this.completado = true;
                this.eliminarColumna(this.listaStock,
                        ["id_stock", "id_almacen", "aumento", "cantidad", "precio_compra_simbolo",
                                "simbolo", "fecha", "id_catalogo_compra",
                                "id_detalle_compra", "estado", "fecha_inicio",
                                "fecha_fin", "lista_productos"]);

                let parametros = JSON.stringify({
                        datos: this.listaStock,
                        titulo: 'STOCK',
                        subtitulo: 'STOCK EN BASE DE DATOS'
                });

                this.exportarExcelFinal(parametros, "reporte Stock Total");

        }


        exportarPdf() {

                //this.eliminarColumna(this.listaClientes, ["estado_cliente", "fecha_baja", "observacion", "id_tipo_persona", "id_tipo_documento", "estado"]);
                this.completado = true;
                this.eliminarColumna(this.listaStock,
                        ["id_stock", "id_almacen", "aumento", "cantidad", "precio_compra_simbolo",
                                "simbolo", "fecha", "id_catalogo_compra",
                                "id_detalle_compra", "estado", "fecha_inicio",
                                "fecha_fin", "lista_productos"]);

                let parametros = JSON.stringify({
                        datos: this.listaStock,
                        titulo: 'STOCK',
                        subtitulo: 'STOCK EN BASE DE DATOS'
                });

                this.exportarPdfFinalIdModal(parametros, "modalPDFStock", "mostrarStockPDF");


        }






        /*****************EXPORTACION DE EXCEL Y PDF DETALLE**************/
        exportarExcelDetalle() {
                this.completado = true;
                this.eliminarColumna(this.listaStockDetalle,
                        ["id_almacen", "aumento", "id_producto",
                                "simbolo", "id_catalogo_compra",
                                "id_detalle_compra", "estado", "fecha_inicio",
                                "fecha_fin", "lista_productos", "nombre_aplicacion"]);

                let parametros = JSON.stringify({
                        datos: this.listaStockDetalle,
                        titulo: 'STOCK',
                        subtitulo: 'STOCK EN BASE DE DATOS'
                });

                this.exportarExcelFinal(parametros, "reporte Stock Total");

        }


        exportarPdfDetalle() {
                this.completado = true;
                //this.eliminarColumna(this.listaClientes, ["estado_cliente", "fecha_baja", "observacion", "id_tipo_persona", "id_tipo_documento", "estado"]);

                this.eliminarColumna(this.listaStockDetalle,
                        ["id_almacen", "aumento", "id_producto",
                                "simbolo", "id_catalogo_compra",
                                "id_detalle_compra", "estado", "fecha_inicio",
                                "fecha_fin", "lista_productos", "nombre_aplicacion"]);

                let parametros = JSON.stringify({
                        datos: this.listaStockDetalle,
                        titulo: 'STOCK',
                        subtitulo: 'STOCK EN BASE DE DATOS'
                });

                this.exportarPdfFinalIdModal(parametros, "modalPDFStock", "mostrarStockPDF");



        }



         /*****************EXPORTACION DE EXCEL Y PDF DETALLE**************/
         exportarExcelResumenDetalle() {
                this.completado = true;
                this.eliminarColumna(this.listaStockResumenDetalle,
                        ["id_almacen", "aumento", "id_producto",
                                "simbolo", "id_catalogo_compra",
                                "id_detalle_compra", "estado", "fecha_inicio",
                                "fecha_fin", "lista_productos", "nombre_aplicacion","id_stock","cantidad","fecha"]);
                let parametros = JSON.stringify({
                        datos: this.listaStockResumenDetalle,
                        titulo: 'STOCK',
                        subtitulo: 'STOCK EN BASE DE DATOS'
                });

                this.exportarExcelFinal(parametros, "reporte Resumen Stock diario");

        }


        exportarPdfResumenDetalle() {
                this.completado = true;
                //this.eliminarColumna(this.listaClientes, ["estado_cliente", "fecha_baja", "observacion", "id_tipo_persona", "id_tipo_documento", "estado"]);

                this.eliminarColumna(this.listaStockResumenDetalle,
                        ["id_almacen", "aumento", "id_producto",
                                "simbolo", "id_catalogo_compra",
                                "id_detalle_compra", "estado", "fecha_inicio",
                                "fecha_fin", "lista_productos", "nombre_aplicacion","id_stock","cantidad","fecha"]);

                let parametros = JSON.stringify({
                        datos: this.listaStockResumenDetalle,
                        titulo: 'STOCK',
                        subtitulo: 'STOCK EN BASE DE DATOS'
                });

                this.exportarPdfFinalIdModal(parametros, "modalPDFStock", "mostrarStockPDF");



        }


        //**************PAGINACION STOCK DETALLADO*************
        paginaSiguienteDetalle() {

                if (this.finDetalle < this.totalListaDetalle) {
                        /***********PAGINACION DOCUMENTOS***********/
                        this.inicioDetalle = this.inicioDetalle + this.tamPaginaDetalle;
                        this.finDetalle = (this.inicioDetalle + this.tamPaginaDetalle) - 1;
                        if (this.finDetalle > this.totalListaDetalle) {
                                this.finDetalle = this.totalListaDetalle;
                                this.inicioDetalle = this.finDetalle - this.tamPaginaDetalle + 1;
                                if (this.inicioDetalle <= 0) {
                                        this.inicioDetalle = 1;
                                }
                        }

                        this.print("inicio: " + this.inicioDetalle + " fin: " + this.finDetalle + " tamPagina: " + this.tamPaginaDetalle);
                        this.seleccionarByPaginaDetalle(this.inicioDetalle, this.finDetalle, this.tamPaginaDetalle);

                }
                this.print("/***************FIN PAGINA SIGUIENTE***************/\n\n");
        }


        paginaAnteriorDetalle() {

                this.print("inicio: " + this.inicioDetalle + " fin: " + this.finDetalle + " tamPagina: " + this.tamPaginaDetalle);
                //if (this.inicio>10){
                /***********PAGINACION DOCUMENTOS***********/
                this.inicioDetalle = this.inicioDetalle - this.tamPaginaDetalle;
                if (this.inicioDetalle <= 0) {
                        this.inicioDetalle = 1;
                }
                this.finDetalle = (this.inicioDetalle + this.tamPaginaDetalle) - 1;

                if (this.finDetalle > this.totalListaDetalle) {
                        this.finDetalle = this.totalListaDetalle;
                }

                this.print("inicio: " + this.inicioDetalle + " fin: " + this.finDetalle + " tamPagina: " + this.tamPaginaDetalle);
                this.seleccionarByPaginaDetalle(this.inicioDetalle, this.finDetalle, this.tamPaginaDetalle);
                //}
                this.print("/***************FIN PAGINA REGRESAR***************/\n\n");
        }


         //**************PAGINACION RESUMEN STOCK DETALLADO*************
         paginaSiguienteResumenDetalle() {

                if (this.finResumenDetalle < this.totalListaResumenDetalle) {
                        /***********PAGINACION DOCUMENTOS***********/
                        this.inicioResumenDetalle = this.inicioResumenDetalle + this.tamPaginaResumenDetalle;
                        this.finResumenDetalle = (this.inicioResumenDetalle + this.tamPaginaResumenDetalle) - 1;
                        if (this.finResumenDetalle > this.totalListaResumenDetalle) {
                                this.finResumenDetalle = this.totalListaResumenDetalle;
                                this.inicioResumenDetalle = this.finResumenDetalle - this.tamPaginaResumenDetalle + 1;
                                if (this.inicioResumenDetalle <= 0) {
                                        this.inicioResumenDetalle = 1;
                                }
                        }

                        this.print("inicio: " + this.inicioResumenDetalle + " fin: " + this.finResumenDetalle + " tamPagina: " + this.tamPaginaResumenDetalle);
                        this.seleccionarByPaginaResumenDetalle(this.inicioResumenDetalle, this.finResumenDetalle, this.tamPaginaResumenDetalle);

                }
                this.print("/***************FIN PAGINA SIGUIENTE***************/\n\n");
        }


        paginaAnteriorResumenDetalle() {

                this.print("inicio: " + this.inicioResumenDetalle + " fin: " + this.finResumenDetalle + " tamPagina: " + this.tamPaginaResumenDetalle);
                //if (this.inicio>10){
                /***********PAGINACION DOCUMENTOS***********/
                this.inicioResumenDetalle = this.inicioResumenDetalle - this.tamPaginaResumenDetalle;
                if (this.inicioResumenDetalle <= 0) {
                        this.inicioResumenDetalle = 1;
                }
                this.finResumenDetalle = (this.inicioResumenDetalle + this.tamPaginaResumenDetalle) - 1;

                if (this.finResumenDetalle > this.totalListaResumenDetalle) {
                        this.finResumenDetalle = this.totalListaResumenDetalle;
                }

                this.print("inicio: " + this.inicioResumenDetalle + " fin: " + this.finResumenDetalle + " tamPagina: " + this.tamPaginaResumenDetalle);
                this.seleccionarByPaginaResumenDetalle(this.inicioResumenDetalle, this.finResumenDetalle, this.tamPaginaResumenDetalle);
                //}
                this.print("/***************FIN PAGINA REGRESAR***************/\n\n");
        }


        exportarExcelJS() {
                window.open('data:application/vnd.ms-excel,' + encodeURIComponent($('#tabla-stock').html()));
        }
}