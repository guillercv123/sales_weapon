import { Component, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';

import { ControllerComponent } from '../../../core/controller/controller.component';




/******************IMPORTAR SERVICIOS*************** */


import { KardexService } from '../service/kardex.service';
import { TipoMovimientoService } from '../service/tipo-movimiento.service';
import { ConceptoMovimientoService } from '../service/concepto-movimiento.service';
import { FormCatalogoVentaComponent } from '../../mantenedores/controller/form-catalogo-venta.component';
import { TipoMonedaService } from '../../mantenedores/service/tipo-moneda.service';
import { UnidadMedidaService } from '../../mantenedores/service/unidad-medida.service';
import { LocalService } from '../../mantenedores/service/local.service';
import { AlmacenService } from '../../mantenedores/service/almacen.service';
import { ReportePdfService } from '../../../core/service/reporte-pdf.Service';
import { ReporteExcelService } from '../../../core/service/reporte-excel.Service';

import { Vista } from '../model/Vista';

declare var $: any;
@Component({
        selector: 'form-kardex',
        templateUrl: '../view/form-kardex.component.html',
        providers: [ReportePdfService,ReporteExcelService,KardexService, TipoMovimientoService, ConceptoMovimientoService, TipoMonedaService, UnidadMedidaService, LocalService, AlmacenService]

})

export class FormKardexComponent extends ControllerComponent implements AfterViewInit {
        fecha_inicio_selected:any;
        fecha_fin_selected:any;
        estadoSelected:string;
        almacenesOrigen: any[];1
        almacenesDestino: any[];
        almacenOrigenSelected: any;
        almacenDestinoSelected: any;

        locales: any[];
        localOrigenSelected: any;
        localDestinoSelected: any;



        listaKardex: any[];
        listaKardexSubir:any[];
        tiposMovimiento: any[];
        conceptosMovimiento: any[];
        tipoMovimientoSelected: any;
        conceptoMovimientoSelected: any;

        unidades_medida: any[];

        tiposMoneda: any[];
        tipoMonedaSelected: any;


        //************OBJETO ELEGIDO PARA EDITAR************
        beanSelected: any;

        //***********PANELES DE LOS MANTENEDORES***********

        panelEditarSelected: boolean = false;
        panelListaBeanSelected: boolean = true;


        /***************PROPIEDADES PARA CATALOGO VENTA*******************/
        buttonSelectedActivatedPro: boolean = true;
        buttonEliminarActivatedPro: boolean = false;
        buttonEditarActivatedPro: boolean = false;
        panelListaCatalogoVenta: boolean = false;
        panelListaCatalogoVentaDerecha: boolean = true;
        estiloTablaDerechaCatalogo: string = "col-md-8 quitar-borde";
        estiloBusquedaCatalogo: string = "col-md-4 quitar-borde";
        colMd2Catalogo: string = "col-md-12";
        colMd4Catalogo: string = "col-md-12";
        col1Md2Catalogo: string = "col-md-4";
        campoOcultoVenta = true;

        beanSelectedExterno: any;
        idProductoSelected: number;
        listaProductos: any[];
        simboloMonedaSelected: any;
        idTipoMonedaSelected: any;
        montoTotalSelected: string = "0";

        precioCorrecto: boolean = true;
        clavePermiso: string;
        indObjSeleccionadoClave: any;


        /********para adjuntar los archivos**********/
        //@ViewChild('myInput2')
        //archivo: any;
        file: any;

        @ViewChild(FormCatalogoVentaComponent,{static: true}) formCatalogoVentaComponent: FormCatalogoVentaComponent;
        constructor(
                public http: Http,
                public router: Router,
                public kardexService: KardexService,
                public tipoMovimientoService: TipoMovimientoService,
                public conceptoMovimientoService: ConceptoMovimientoService,
                public tipoMonedaService: TipoMonedaService,
                public unidadMedidaService: UnidadMedidaService,
                public localService: LocalService,
                public almacenService: AlmacenService,
                public reportePdfService: ReportePdfService,
                public reporteExcelService: ReporteExcelService
        ) {
           
                super(router,reportePdfService, reporteExcelService);

                this.panelEditarSelected = false;
        }


        ngOnInit() {
                this.limpiarCampos();
                this.listaProductos = new Array();
        }


        ngAfterViewInit() {

                if (this.verificarTokenRpta(this.rutasMantenedores.FORM_KARDEX)) {
                        this.obtenerLocales();
                        this.obtenerTipoMoneda();
                        this.obtenerUnidadesMedida();
                        this.obtenerTiposMovimento();
                        this.obtenerConceptosMovimento();
                        //this.obtenerConceptosMovimentoRegistro();
                        this.obtenerKardex();
                }
        }


        
        obtenerLocales() {

                this.localService.getAll()
                        .subscribe(
                        data => {//this.vistas = data;

                                this.locales = data;
                        },
                        error => this.msj = <any>error);
        }

        mostrarAlmacenOrigen(local) {
                this.obtenerAlmaceneByIdLocalOrigen(local.id_local);

        }


        mostrarAlmacenDestino(local) {
                this.obtenerAlmaceneByIdLocalDestino(local.id_local);

        }


        obtenerAlmaceneByIdLocalOrigen(id) {

                this.almacenService.getByIdLocal(id)
                        .subscribe(
                        data => {//this.vistas = data;

                                this.almacenesOrigen = data;
                        },
                        error => this.msj = <any>error);
        }

        obtenerAlmaceneByIdLocalDestino(id) {

                this.almacenService.getByIdLocal(id)
                        .subscribe(
                        data => {//this.vistas = data;

                                this.almacenesDestino = data;
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


        obtenerTipoMoneda() {

                this.tipoMonedaService.getAll()
                        .subscribe(
                        data => {//this.vistas = data;

                                this.tiposMoneda = data;
                                if (this.tiposMoneda != null) {
                                        this.tipoMonedaSelected = this.tiposMoneda[0];
                                        this.simboloMonedaSelected = this.tipoMonedaSelected.simbolo;
                                        this.idTipoMonedaSelected = this.tipoMonedaSelected.id_tipo_moneda;
                                }
                        },
                        error => this.msj = <any>error);
        }

        obtenerTiposMovimento() {
                let parametros = JSON.stringify({

                });

                this.tipoMovimientoService.buscarPaginacion(1, 1000, 1000, parametros)
                        .subscribe(
                        data => {
                                this.tiposMovimiento = data;
                                this.tipoMovimientoSelected = this.obtenerTipoMovimientoPreferido('SALIDA');
                        },
                        error => this.msj = <any>error);


        }

        obtenerConceptosMovimento() {
                let parametros = JSON.stringify({
                     
                });

                this.conceptoMovimientoService.buscarPaginacion(1, 1000, 1000, parametros)
                        .subscribe(
                        data => {
                                this.conceptosMovimiento = data;
                                this.conceptoMovimientoSelected = this.obtenerConceptoMovimientoPreferido('TRASLADO');
                        },
                        error => this.msj = <any>error);


        }


        obtenerConceptosMovimentoRegistro() {
                let parametros = JSON.stringify({
                        nombre:"TRASLADO"
                });

                this.conceptoMovimientoService.buscarPaginacion(1, 1000, 1000, parametros)
                        .subscribe(
                        data => {
                                this.conceptosMovimiento = data;
                                this.conceptoMovimientoSelected = this.obtenerConceptoMovimientoPreferido('TRASLADO');
                        },
                        error => this.msj = <any>error);


        }


        obtenerConceptoMovimientoPreferido(nombre) {
                let obj;
                for (let i = 0; i < this.conceptosMovimiento.length; i++) {
                        if (this.conceptosMovimiento[i].nombre == nombre) {
                                obj = this.conceptosMovimiento[i];
                                break;
                        }
                }
                return obj;
        }

        obtenerTipoMovimientoPreferido(nombre) {
                let obj;
                for (let i = 0; i < this.tiposMovimiento.length; i++) {
                        if (this.tiposMovimiento[i].nombre == nombre) {
                                obj = this.tiposMovimiento[i];
                                break;
                        }
                }
                return obj;
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
                this.beanSelected = pro;
                //this.tipoProSelected=this.obtenerTipoActual(pro.nombre_tipo_producto);
                this.idTipoMonedaSelected = pro.id_tipo_producto;


                this.panelEditarSelected = true;
                this.panelListaBeanSelected = false;
        }


        regresar() {
                this.limpiarCampos();
                this.panelEditarSelected = false;
                this.panelListaBeanSelected = true;
        }


        obtenerKardex() {
                this.limpiarCampos();
                this.getTotalLista();
                this.seleccionarByPagina(this.inicio, this.fin, this.tamPagina);
        }





        limpiar() {
                this.limpiarCampos();
                this.inicio = 1;
                this.fin = 10;
                this.tamPagina = 10;
                this.getTotalLista();
                this.seleccionarByPagina(this.inicio, this.fin, this.tamPagina);

                //this.tipoMovimientoSelected=this.obtenerTipoMovimientoPreferido('SALIDA');
                //this.conceptoMovimientoSelected=this.obtenerConceptoMovimientoPreferido('TRASLADO');
        }

        establecer_transaldo() {
                this.tipoMovimientoSelected = this.obtenerTipoMovimientoPreferido('SALIDA');
                this.conceptoMovimientoSelected = this.obtenerConceptoMovimientoPreferido('TRASLADO');
        }


        seleccionarByPagina(inicio: any, fin: any, tamPagina: any) {
                let parametros = JSON.stringify({
                        id_tipo_movimiento: this.tipoMovimientoSelected == null ? null : this.tipoMovimientoSelected.id_tipo_movimiento,
                        id_concepto_movimiento: this.conceptoMovimientoSelected == null ? null : this.conceptoMovimientoSelected.id_concepto_movimiento,
                        estado:this.estadoSelected,
                        fecha_inicio:this.fecha_inicio_selected,
                        fecha_fin:this.fecha_fin_selected
                });

                this.kardexService.buscarPaginacion(inicio, fin, tamPagina, parametros)
                        .subscribe(
                        data => {
                                this.listaKardex = data;

                                this.print(data);
                        },
                        error => this.msj = <any>error);
        }

        onChange(event) {
                this.file = event.srcElement.files;
        }

        registrarMultiple() {

                this.establecer_transaldo();
                if (this.tienePermisoPrintMsj(this.rutas.FORM_KARDEX, this.rutas.BUTTON_SUBIR_FILE_KARDEX)) {
                       this.completado=true;
                        let creds = JSON.stringify({
                                host_file: this.rutas.SERVIDOR + this.rutas.SEPARADOR,
                                app_file: this.rutas.NAME_APP + this.rutas.SEPARADOR,
                                tipo_movimiento: this.tipoMovimientoSelected == null ? null : this.tipoMovimientoSelected,
                                concepto_movimiento: this.conceptoMovimientoSelected == null ? null : this.conceptoMovimientoSelected,
                                id_almacen_origen: this.almacenOrigenSelected == null ? null : this.almacenOrigenSelected.id_almacen,
                                id_almacen_destino: this.almacenDestinoSelected == null ? null : this.almacenDestinoSelected.id_almacen
                        });
                        this.print("parametros: "+creds);
                        this.kardexService.registrarMultiple(this.file, creds)
                                .subscribe(
                                data => {

                                        let rpta = data.rpta;
                                        this.print("rpta: " + rpta);
                                        if (rpta != null) {
                                                if (rpta == 1) {
                                                        this.mensajeCorrectoSinCerrar("TRASLADO(S) REGISTRADO(S)");
                                                        this.limpiarCampos();
                                                } else {
                                                        this.mensajeInCorrecto("TRASLADO(S) NO REGISTRADO(S)");
                                                }
                                        }
                                        this.completado=false;
                                        this.obtenerKardex();
                     
                                },
                                error => this.msj = <any>error
                                );
                }
        }

        registrarMultipleObtener() {

                this.establecer_transaldo();
                if (this.tienePermisoPrintMsj(this.rutas.FORM_KARDEX, this.rutas.BUTTON_SUBIR_FILE_KARDEX)) {
                       this.completado=true;
                        let creds = JSON.stringify({
                                host_file: this.rutas.SERVIDOR + this.rutas.SEPARADOR,
                                app_file: this.rutas.NAME_APP + this.rutas.SEPARADOR,
                                tipo_movimiento: this.tipoMovimientoSelected == null ? null : this.tipoMovimientoSelected,
                                concepto_movimiento: this.conceptoMovimientoSelected == null ? null : this.conceptoMovimientoSelected,
                                id_almacen_origen: this.almacenOrigenSelected == null ? null : this.almacenOrigenSelected.id_almacen,
                                id_almacen_destino: this.almacenDestinoSelected == null ? null : this.almacenDestinoSelected.id_almacen
                        });
                        this.print("parametros: "+creds);
                        this.kardexService.registrarMultipleObtener(this.file, creds)
                                .subscribe(
                                data => {
                                        //this.print("data:");
                                        //this.print(data);
                                        let rpta = data.rpta;
                                        //this.print("rpta: " + rpta);
                                        if (rpta != null) {
                                                if (rpta == 1) {
                                                        this.listaKardexSubir=data.lista;
                                                        this.mensajeCorrecto("TRASLADO(S) LISTOS PARA REGISTRAR");
                                                        //this.limpiarCampos();
                                                } else {
                                                        this.mensajeInCorrecto("LISTA DE TRASLADO(S) ESTA VACIA");
                                                }
                                        }
                                        this.completado=false;
                                       
                     
                                },
                                error => this.msj = <any>error
                                );
                }
        }

        eliminarPreSubida(){
                this.kardexService.eliminarPreSubida()
                .subscribe(
                data => {
                      
                        let rpta = data.rpta;
                      
                        if (rpta != null) {
                                if (rpta == 1) {
                                        this.listaKardexSubir=null;
                                        this.mensajeCorrectoSinCerrar("LISTA PRE SUBIDA ELIMINADA");
                                } else {
                                        this.mensajeInCorrecto("ERROR AL ELIMINAR LISTA PRE SUBIDA");
                                }
                        }
                        this.completado=false;
                        //this.obtenerKardex();
     
                },
                error => this.msj = <any>error
                );

        }
        
        registrarTrasladosConfirmados(){
                this.completado=true;
                let parametros = JSON.stringify({
                        lista_kardex: this.listaKardexSubir
                });

                this.kardexService.registrarTrasladosConfirmados(parametros)
                .subscribe(
                data => {
                      
                        let rpta = data.rpta;
                      
                        if (rpta != null) {
                                if (rpta == 1) {
                                        this.listaKardexSubir=data.lista;
                                        this.mensajeCorrectoSinCerrar("TRASLADO(S) REGISTRADOS CORRECTAMENTE");
                                } else {
                                        this.mensajeInCorrecto("TRASLADO(S) NO REGISTRADOS");
                                }
                        }
                        this.completado=false;
                       this.obtenerKardex();
     
                },
                error => this.msj = <any>error
                );
        }

        registrar() {
                if (this.tienePermisoPrintMsj(this.rutas.FORM_KARDEX, this.rutas.BUTTON_REGISTRAR)) {
                        let parametros = JSON.stringify({
                                tipo_movimiento: this.tipoMovimientoSelected == null ? null : this.tipoMovimientoSelected,
                                concepto_movimiento: this.conceptoMovimientoSelected == null ? null : this.conceptoMovimientoSelected,
                                id_almacen_origen: this.almacenOrigenSelected == null ? null : this.almacenOrigenSelected.id_almacen,
                                id_almacen_destino: this.almacenDestinoSelected == null ? null : this.almacenDestinoSelected.id_almacen,
                                lista_productos: this.listaProductos
                        });
                        this.kardexService.registrar(parametros)
                                .subscribe(
                                data => {

                                        let rpta = data.rpta;
                                        this.print("rpta: " + rpta);
                                        if (rpta != null) {
                                                if (rpta == 1) {
                                                        this.mensajeCorrecto("MOVIMIENTO KARDEX REGISTRADO");
                                                        this.limpiarCampos();
                                                } else {
                                                        this.mensajeInCorrecto("MOVIMIENTO KARDEX NO REGISTRADO");
                                                }
                                        }

                                        this.obtenerKardex();

                                },
                                error => this.msj = <any>error
                                );
                }
        }

        buscar() {

                if (this.tienePermisoPrintMsj(this.rutas.FORM_KARDEX, this.rutas.BUTTON_BUSCAR)) {
                        this.getTotalLista();
                        this.seleccionarByPagina(this.inicio, this.fin, this.tamPagina);
                }
        }



        getTotalLista() {
                let parametros = JSON.stringify({
                        id_tipo_movimiento: this.tipoMovimientoSelected == null ? null : this.tipoMovimientoSelected.id_tipo_movimiento,
                        id_concepto_movimiento: this.conceptoMovimientoSelected == null ? null : this.conceptoMovimientoSelected.id_concepto_movimiento,
                        estado:this.estadoSelected,
                        fecha_inicio:this.fecha_inicio_selected,
                        fecha_fin:this.fecha_fin_selected
                });

                this.print("parametros total: " + parametros);
                this.kardexService.getTotalParametros(parametros)
                        .subscribe(
                        data => {
                                this.totalLista = data;
                                this.print("total:" + data);
                        },
                        error => this.msj = <any>error);
        }


        eliminar(bean) {

                

                if (this.tienePermisoPrintMsj(this.rutas.FORM_KARDEX, this.rutas.BUTTON_ELIMINAR)) {

                       
                        
                        if( confirm("Realmente Desea Eliminar ?")){
                        let user = this.obtenerUsuario();
                        let parametros = JSON.stringify({
                                bean:bean,
                                id_empleado_eliminado:user.id_empleado
                        });

                        this.kardexService.eliminarLogico(parametros)
                                .subscribe(
                                data => {
                                        this.obtenerKardex();
                                        let rpta = data;
                                        if (rpta != null) {
                                                if (rpta == 1) {
                                                        this.mensajeCorrecto("REGISTRO KARDEX ELIMINADO CORRECTAMENTE");
                                                } else {
                                                        this.mensajeInCorrecto("REGISTRO KARDEX NO ELIMINADO");
                                                }

                                        }
                                },
                                error => this.msj = <any>error);
                        }
                }
        }




        editar() {

                if (this.tienePermisoPrintMsj(this.rutas.FORM_KARDEX, this.rutas.BUTTON_ACTUALIZAR)) {
                        let parametros = JSON.stringify({

                        });

                        this.print("parametros: " + parametros);
                        this.kardexService.editar(parametros, this.beanSelected.id_tipo_moneda)
                                .subscribe(
                                data => {
                                        this.obtenerKardex();
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
                this.listaKardex = null;
                this.tipoMovimientoSelected = null;
                this.conceptoMovimientoSelected = null;
                this.listaProductos = new Array();
                this.montoTotalSelected = "0";
                this.localOrigenSelected=null;
                this.localDestinoSelected=null;
                this.almacenDestinoSelected=null;
                this.almacenOrigenSelected=null;
                this.estadoSelected="";
                this.fecha_inicio_selected=null;
                this.fecha_fin_selected=null;
        }

        elegirFila(lista, i) {
                this.marcar(lista, i);
        }



        //**********ACCIONES PARAR FORMULARIO CATALOGO VENTAS********
        abrirModalCatalogoVenta() {
                this.formCatalogoVentaComponent.limpiarCampos();
                
                //this.formCatalogoVentaComponent.clienteSelected = this.clienteSelected;
                this.formCatalogoVentaComponent.busquedaClienteVenta = false;
                this.formCatalogoVentaComponent.checkPorCliente = false;
                //this.formCatalogoVentaComponent.clienteVentaSelected = this.clienteSelected;
                
                this.abrirModalPorc("modalCatalogoVenta", 90);

        }


        //**********METODO QUE OBTIENE LOS DATOS EXTERNOS 
        obtenerDatosCatalogoVenta(datos) {
                this.beanSelectedExterno = datos.bean;
                this.idProductoSelected = this.beanSelectedExterno.id_producto;
                //this.cerrarModal("modalCatalogoVenta");
                this.print("DATOS EXTERNOS: ");
                //this.print(datos);
                this.abrirPanelRegistrar();
                this.beanSelectedExterno.precio_original = this.beanSelectedExterno.precio;
                this.beanSelectedExterno.precio_venta = this.beanSelectedExterno.porc4;
                this.beanSelectedExterno.precio = this.beanSelectedExterno.porc4;
                this.beanSelectedExterno.cantidad = 1;
                this.beanSelectedExterno.sub_total = this.beanSelectedExterno.precio_venta * this.beanSelectedExterno.cantidad;
                this.beanSelectedExterno.desc = 0;
                this.beanSelectedExterno.porc_desc = 0;
                this.beanSelectedExterno.id_unidad_medida = this.unidades_medida[0].id_unidad_medida;
                this.beanSelectedExterno.tiene_permiso_exceder = false;
                this.beanSelectedExterno.tiene_permiso_muestra = false;
                this.beanSelectedExterno.tipo_moneda = this.tipoMonedaSelected;

                this.print(this.beanSelectedExterno);

                if (!this.existeProducto(this.beanSelectedExterno)) {
                        this.listaProductos.push(this.beanSelectedExterno);
                }

                this.sumarTotalProductos();
                this.mensajeCorrecto("PRODUCTO AGREGADO CORRECTAMENTE");
        }

        existeProducto(bean) {
                let rpta = false;
                for (let i = 0; i < this.listaProductos.length; i++) {

                        if (this.listaProductos[i].id_catalogo_venta == bean.id_catalogo_venta) {
                                rpta = true;
                                break;
                        }


                }
                return rpta;
        }

        sumarTotalProductos() {
                let total = 0;
                for (let i = 0; i < this.listaProductos.length; i++) {

                        this.listaProductos[i].precio = this.listaProductos[i].precio_venta - this.listaProductos[i].desc;
                        this.listaProductos[i].sub_total = this.listaProductos[i].precio * this.listaProductos[i].cantidad;
                        total = total + this.listaProductos[i].sub_total;
                        this.listaProductos[i].id_tipo_moneda = this.listaProductos[i].tipo_moneda.id_tipo_moneda;
                        if (i == 0) {
                                //this.simboloMonedaSelected = this.listaProductos[i].nombre_simbolo_moneda;
                                //this.idTipoMonedaSelected = this.listaProductos[i].id_tipo_moneda;
                                this.simboloMonedaSelected = this.listaProductos[i].tipo_moneda.simbolo;
                                this.idTipoMonedaSelected = this.listaProductos[i].tipo_moneda.id_tipo_moneda;
                        }

                }
                this.montoTotalSelected = "" + this.round2(total);
                this.montoTotalSelected = this.completar_ceros_derecha("" + this.montoTotalSelected, 2);
        }

        activarPermiso(indice) {
                this.indObjSeleccionadoClave = indice;
                this.listaProductos[this.indObjSeleccionadoClave].tiene_permiso_exceder = false;
                this.listaProductos[this.indObjSeleccionadoClave].tiene_permiso_muestra = false;

                this.abrirModalPorc("modalClavePermiso", 50);



        }

        aceptarClave() {
                if (this.clavePermiso == "123456") {
                        this.listaProductos[this.indObjSeleccionadoClave].tiene_permiso_exceder = true;
                        this.listaProductos[this.indObjSeleccionadoClave].tiene_permiso_muestra = true;
                } else {
                        this.mensajeInCorrecto("CLAVE ERRONEA");
                        this.listaProductos[this.indObjSeleccionadoClave].tiene_permiso_exceder = false;
                        this.listaProductos[this.indObjSeleccionadoClave].tiene_permiso_muestra = false;
                }
                this.cerrarModal("modalClavePermiso");
                this.clavePermiso = null;
        }


        validarPrecio(obj, event: any) {
                this.print("tecla: ");
                this.print(event);
                this.print("key: " + event.key);
                this.print("code: " + event.keyCode);
                this.print("precio: " + obj.precio_venta);
                if (event.keyCode == 13) {
                        this.print("tipo moneda: ");
                        this.print(obj);
                        this.print("obj.tipo_moneda.nombre: " + obj.tipo_moneda.nombre);

                        this.print("comp1 obj.tipo_moneda.nombre: " + obj.tipo_moneda.nombre + " -" + (obj.tipo_moneda.nombre == "DOLARES"));
                        this.print("comp2 obj.tipo_moneda.nombre: " + obj.tipo_moneda.nombre + "- " + (obj.tipo_moneda.nombre == "SOLES"));

                        if (obj.tipo_moneda.nombre == "DOLARES") {

                        } else {
                                if (obj.porc4 == null) {
                                        if ((obj.precio_venta < obj.porc1 || obj.precio_venta > obj.porc2) && obj.tiene_permiso_exceder == false) {
                                                this.mensajeInCorrecto("PRECIO INCORRECTO");
                                        }

                                } else {
                                        if ((obj.precio_venta < obj.costo_incluido || obj.precio_venta > obj.porc4) && obj.tiene_permiso_exceder == false) {
                                                this.mensajeInCorrecto("PRECIO INCORRECTO");
                                        }
                                }
                        }
                }
        }


        validarPreciosTotal() {
                for (let i = 0; i < this.listaProductos.length; i++) {
                        let obj = this.listaProductos[i];
                        if (obj.tipo_moneda.nombre == "DOLARES") {
                                this.precioCorrecto = true;
                        } else {
                                if (obj.porc4 == null) {
                                        if ((obj.precio_venta < obj.porc1 || obj.precio_venta > obj.porc2) && obj.tiene_permiso_exceder == false) {
                                                this.precioCorrecto = false;
                                                break;
                                        } else {
                                                this.precioCorrecto = true;
                                        }

                                } else {
                                        if ((obj.precio_venta < obj.costo_incluido || obj.precio_venta > obj.porc4) && obj.tiene_permiso_exceder == false) {
                                                this.precioCorrecto = false;
                                                break;
                                        } else {
                                                this.precioCorrecto = true;
                                        }
                                }
                        }
                }

        }

        obtenerTipoMonedaGeneral(pro) {
                this.simboloMonedaSelected = pro.simbolo;
                this.idTipoMonedaSelected = pro.id_tipo_moneda;

                //this.simboloMonedaSelected=pro.tipo_moneda.simbolo;

                let rpta = false;
                for (let i = 0; i < this.listaProductos.length; i++) {
                        this.listaProductos[i].tipo_moneda = pro;
                        this.listaProductos[i].id_tipo_moneda = pro.id_tipo_moneda;
                }
                return rpta;


        }



        dowloadFormatoKardex() {

                let parametros = JSON.stringify({
                });

                
                this.descargarFormatKardex(parametros,"FORMATO KARDEX");

        }
}