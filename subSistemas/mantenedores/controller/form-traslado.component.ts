import { Component, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';

import { ControllerComponent } from '../../../core/controller/controller.component';




/******************IMPORTAR SERVICIOS*************** */


import { KardexService } from '../service/kardex.service';
import { TipoMovimientoService } from '../service/tipo-movimiento.service';
import { ConceptoMovimientoService } from '../service/concepto-movimiento.service';
import { FormCatalogoVentaComponent } from './form-catalogo-venta.component';
import { TipoMonedaService } from '../service/tipo-moneda.service';
import { UnidadMedidaService } from '../service/unidad-medida.service';
import { LocalService } from '../service/local.service';
import { AlmacenService } from '../service/almacen.service';
import { ReportePdfService } from '../../../core/service/reporte-pdf.Service';
import { ReporteExcelService } from '../../../core/service/reporte-excel.Service';
import { CatalogoVentaService } from '../../mantenedores/service/catalogo-venta.service';

import { Vista } from '../model/Vista';

declare var $: any;
@Component({
        selector: 'form-traslado',
        templateUrl: '../view/form-traslado.component.html',
        providers: [ReportePdfService,CatalogoVentaService,ReporteExcelService,KardexService, TipoMovimientoService, ConceptoMovimientoService, TipoMonedaService, UnidadMedidaService, LocalService, AlmacenService]

})

export class FormTrasladoComponent extends ControllerComponent implements AfterViewInit {
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
        tamanio_lista_mostrar: number = 100;
        indiceLista: any = -1;
        tamTexto: any[];
        listaKardex: any[];
        listaKardexSubir:any[];
        tiposMovimiento: any[];
        conceptosMovimiento: any[];
        tipoMovimientoSelected: any;
        conceptoMovimientoSelected: any;

        unidades_medida: any[];

        tiposMoneda: any[];
        tipoMonedaSelected: any;
        cantidadCeldas: number = 1;

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
        lastkeydown1: number = 0;
        lastkeydown2: number = 0;
        subTotalSelected: string = "";
        igvSelected: string = "";
        incluyeIgvSelected:boolean=true;
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
                public catalogoVentaService:CatalogoVentaService,
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
                this.tamTexto = new Array();
                if (this.verificarTokenRpta(this.rutasMantenedores.FORM_TRASLADO)) {
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

        agregarProductoMultiple(cantidad) {

                if (cantidad > 0) {
                        let i;
                        for (i = 0; i < cantidad; i++) {
                                        let p = {
                                                andamio: null,
                                                app_imagen: null,
                                                cantidad: null,
                                                carpeta_imagen: null,
                                                columna: null,
                                                costo_incluido: null,
                                                costo_incluido_dolar: null,
                                                costo_incluido_dolar_sinigv: null,
                                                costo_incluido_sinigv: null,
                                                desc: 0,
                                                descripcion: null,
                                                estado: null,
                                                fecha: null,
                                                fecha_baja: null,
                                                fila: null,
                                                gana_porc1: null,
                                                gana_porc2: null,
                                                gana_porc3: null,
                                                gana_porc4: null,
                                                host_imagen: null,
                                                id_almacen: null,
                                                id_aplicacion: null,
                                                id_catalogo_venta: null,
                                                id_cliente: null,
                                                id_local: null,
                                                id_marca: null,
                                                id_producto: null,
                                                id_proveedor: null,
                                                id_tipo_moneda: null,
                                                id_tipo_moneda_compra: null,
                                                id_tipo_moneda_pb: null,
                                                id_tipo_moneda_pr: null,
                                                id_tipo_producto: null,
                                               // id_unidad_medida: this.unidadMedidaSelected.id_unidad_medida,
                                                igv: 0.18,
                                                maximo: null,
                                                medida_a: null,
                                                medida_a_mayor: null,
                                                medida_a_menor: null,
                                                medida_b: null,
                                                medida_b_mayor: null,
                                                medida_b_menor: null,
                                                medida_c: null,
                                                medida_c_mayor: null,
                                                medida_c_menor: null,
                                                medida_d: null,
                                                medida_d_mayor: null,
                                                medida_d_menor: null,
                                                medida_e: null,
                                                medida_e_mayor: null,
                                                medida_e_menor: null,
                                                medida_f: null,
                                                nombre: null,
                                                nombre_almacen: null,
                                                nombre_aplicacion: "",
                                                nombre_cliente: "",
                                                nombre_imagen: "",
                                                nombre_local: null,
                                                nombre_marca: null,
                                                nombre_proveedor: null,
                                                nombre_simbolo_moneda: "S/",
                                                nombre_simbolo_moneda_pb: "S/",
                                                nombre_simbolo_moneda_pr: "S/",
                                                nombre_tipo_moneda: "SOLES",
                                                nombre_tipo_producto: null,
                                              //  nombre_unidad_medida: this.unidadMedidaSelected.nombre,
                                                orden: 1,
                                                order_by: null,
                                                porc1: null,
                                                porc1_dolar: null,
                                                porc1_dolar_sinigv: null,
                                                porc1_sinigv: null,
                                                porc2: null,
                                                porc2_dolar: null,
                                                porc2_dolar_sinigv: null,
                                                porc2_sinigv: null,
                                                porc3: null,
                                                porc3_dolar: null,
                                                porc3_dolar_sinigv: null,
                                                porc3_sinigv: null,
                                                porc4: null,
                                                porc4_dolar: null,
                                                porc4_dolar_sinigv: null,
                                                porc4_sinigv: null,
                                                porc_desc: null,
                                                precio: null,
                                                precio_base: null,
                                                precio_compra: null,
                                                precio_especial: null,
                                                precio_especial_soles: null,
                                                precio_original: null,
                                                precio_referencia: null,
                                                precio_venta: null,
                                                ruta_imagen: null,
                                                sub_total: null,
                                                tiene_permiso_exceder: false,
                                                tiene_permiso_muestra: false,
                                                tiene_precio_especial: false,
                                                tipo_cambio: 5,
                                                nuevo: false,
                                                tipo_moneda: {
                                                        estado: null,
                                                        id_tipo_moneda: null,
                                                        nombre: "SOLES",
                                                        observacion: null,
                                                        orden_presentacion: 1,
                                                        simbolo: "S/"
                                                },
                                                id_unidad_medida_peso: this.unidades_medida[0].id_unidad_medida,
                                                peso: 1,
                                        }

                                this.print("pro: ");
                                this.print(p);
                                this.listaProductos.push(p);

                                // this.activarPrecioIgv();
                        }
                }
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
              //  this.seleccionarByPagina(this.inicio, this.fin, this.tamPagina);
        }





        limpiar() {
                this.limpiarCampos();
                this.inicio = 1;
                this.fin = 10;
                this.tamPagina = 10;
                this.getTotalLista();
               // this.seleccionarByPagina(this.inicio, this.fin, this.tamPagina);

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
                if(this.fecha_fin_selected !=null || this.fecha_inicio_selected !=null){

                this.kardexService.buscarPaginacionTraslado(inicio, fin, tamPagina, parametros)
                        .subscribe(
                        data => {
                                this.listaKardex = data;

                                this.print(data);
                        },
                        error => this.msj = <any>error);

                }else{
                        this.mensajeAdvertencia("SELECCIONE UNA FECHA PARA PODER VISUALIZAR LOS TRASLADOS INTERNO");
                }
        }

        onChange(event) {
                this.file = event.srcElement.files;
        }

        registrarMultiple() {

                this.establecer_transaldo();
                if (this.tienePermisoPrintMsj(this.rutasMantenedores.FORM_TRASLADO, this.rutasMantenedores.BUTTON_SUBIR_FILE_KARDEX)) {
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
                if (this.tienePermisoPrintMsj(this.rutasMantenedores.FORM_TRASLADO, this.rutasMantenedores.BUTTON_SUBIR_FILE_KARDEX)) {
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


        elegirProducto(producto: any, indice: any) {
                
                if (producto != null) {
                       
                        //this.precioS = producto.precio_venta;
                        this.indiceLista = -1;
                        this.agregarProductoCatalogo(producto, indice);
                        this.listaProductos[indice].lista_autocompletado = null;
                        this.listaProductos[indice].eleccion_autocompletado_selected = false;
                      

                }
        }

        
        agregarProductoCatalogo(beanSelected, indice) {
                //this.beanSelectedExterno = datos.bean;

                this.idProductoSelected = beanSelected.id_producto;
              
                beanSelected.precio_original = beanSelected.precio;
                

                if (beanSelected.tiene_precio_especial) {

                        beanSelected.precio_venta = beanSelected.precio_especial;
                        beanSelected.precio = beanSelected.precio_especial;
                      

                } else {

                        if (beanSelected.gana_porc4 != null) {
                                beanSelected.precio_venta = beanSelected.gana_porc4;
                                beanSelected.precio = beanSelected.gana_porc4;
                        } else if (beanSelected.gana_porc3 != null) {
                                beanSelected.precio_venta = beanSelected.gana_porc3;
                                beanSelected.precio = beanSelected.gana_porc3;
                        } else if (beanSelected.gana_porc2 != null) {
                                beanSelected.precio_venta = beanSelected.gana_porc2;
                                beanSelected.precio = beanSelected.gana_porc2;
                        } else if (beanSelected.gana_porc1 != null) {
                                beanSelected.precio_venta = beanSelected.gana_porc1;
                                beanSelected.precio = beanSelected.gana_porc1;
                        } else {
                                beanSelected.precio_venta = 1;
                                beanSelected.precio = 1;
                        }

                }

                beanSelected.desc = 0;
                beanSelected.porc_desc = 0;
                beanSelected.id_unidad_medida = this.unidades_medida[0].id_unidad_medida;
                beanSelected.tiene_permiso_exceder = false;
                beanSelected.tiene_permiso_muestra = false;
                beanSelected.tipo_moneda = this.tipoMonedaSelected;
                beanSelected.cantidad = 1;
                beanSelected.sub_total = beanSelected.precio_venta * beanSelected.cantidad;

                beanSelected.id_unidad_medida_peso = this.unidades_medida[0].id_unidad_medida;
                beanSelected.peso = 1;

                this.print(beanSelected);
                this.print("existe producto: " + !this.existeProducto(beanSelected));
                if (!this.existeProducto(beanSelected)) {
                        this.listaProductos[indice] = beanSelected;
                        //this.listaProductos.push(beanSelected);
                }else{
                                           
                        this.listaProductos[indice] = null;
                        let p = {
                                andamio: null,
                                app_imagen: null,
                                cantidad: null,
                                carpeta_imagen: null,
                                columna: null,
                                costo_incluido: null,
                                costo_incluido_dolar: null,
                                costo_incluido_dolar_sinigv: null,
                                costo_incluido_sinigv: null,
                                desc: 0,
                                descripcion: null,
                                estado: null,
                                fecha: null,
                                fecha_baja: null,
                                fila: null,
                                gana_porc1: null,
                                gana_porc2: null,
                                gana_porc3: null,
                                gana_porc4: null,
                                host_imagen: null,
                                id_almacen: null,
                                id_aplicacion: null,
                                id_catalogo_venta: null,
                                id_cliente: null,
                                id_local: null,
                                id_marca: null,
                                id_producto: null,
                                id_proveedor: null,
                                id_tipo_moneda: null,
                                id_tipo_moneda_compra: null,
                                id_tipo_moneda_pb: null,
                                id_tipo_moneda_pr: null,
                                id_tipo_producto: null,
                               // id_unidad_medida: this.unidadMedidaSelected.id_unidad_medida,
                                igv: 0.18,
                                maximo: null,
                                medida_a: null,
                                medida_a_mayor: null,
                                medida_a_menor: null,
                                medida_b: null,
                                medida_b_mayor: null,
                                medida_b_menor: null,
                                medida_c: null,
                                medida_c_mayor: null,
                                medida_c_menor: null,
                                medida_d: null,
                                medida_d_mayor: null,
                                medida_d_menor: null,
                                medida_e: null,
                                medida_e_mayor: null,
                                medida_e_menor: null,
                                medida_f: null,
                                nombre: null,
                                nombre_almacen: null,
                                nombre_aplicacion: "",
                                nombre_cliente: "",
                                nombre_imagen: "",
                                nombre_local: null,
                                nombre_marca: null,
                                nombre_proveedor: null,
                                nombre_simbolo_moneda: "S/",
                                nombre_simbolo_moneda_pb: "S/",
                                nombre_simbolo_moneda_pr: "S/",
                                nombre_tipo_moneda: "SOLES",
                                nombre_tipo_producto: null,
                                //nombre_unidad_medida: this.unidadMedidaSelected.nombre,
                                orden: 1,
                                order_by: null,
                                porc1: null,
                                porc1_dolar: null,
                                porc1_dolar_sinigv: null,
                                porc1_sinigv: null,
                                porc2: null,
                                porc2_dolar: null,
                                porc2_dolar_sinigv: null,
                                porc2_sinigv: null,
                                porc3: null,
                                porc3_dolar: null,
                                porc3_dolar_sinigv: null,
                                porc3_sinigv: null,
                                porc4: null,
                                porc4_dolar: null,
                                porc4_dolar_sinigv: null,
                                porc4_sinigv: null,
                                porc_desc: null,
                                precio: null,
                                precio_base: null,
                                precio_compra: null,
                                precio_especial: null,
                                precio_especial_soles: null,
                                precio_original: null,
                                precio_referencia: null,
                                precio_venta: null,
                                ruta_imagen: null,
                                sub_total: null,
                                tiene_permiso_exceder: false,
                                tiene_permiso_muestra: false,
                                tiene_precio_especial: false,
                                tipo_cambio: 5,
                                nuevo: false,
                                tipo_moneda: {
                                        estado: null,
                                        id_tipo_moneda: null,
                                        nombre: "SOLES",
                                        observacion: null,
                                        orden_presentacion: 1,
                                        simbolo: "S/"
                                },
                                id_unidad_medida_peso: this.unidades_medida[0].id_unidad_medida,
                                peso: 1,
                        };
                        this.listaProductos[indice] = p;
                      
                        this.mensajeInCorrecto("Este producto ya ha sido seleccionado");
                }   
                  this.calcularIgv();
               
                
          
        }

        calcularIgv(){
                this.sumarTotalProductos();
              
                if(this.incluyeIgvSelected==true){
                        this.montoTotalSelected=""+this.round2(parseFloat(this.montoTotalSelected));
                        this.subTotalSelected=""+this.round2(parseFloat(this.montoTotalSelected)/1.18);
                        this.igvSelected=""+this.round2(parseFloat(this.montoTotalSelected) -parseFloat(this.subTotalSelected));
                       
                        this.montoTotalSelected=this.completar_ceros_derecha(this.montoTotalSelected,2);
                        this.subTotalSelected=this.completar_ceros_derecha(this.subTotalSelected,2);
                        this.igvSelected=this.completar_ceros_derecha(this.igvSelected,2);
                }
                if(this.incluyeIgvSelected==false){
                        this.subTotalSelected=""+this.round2(parseFloat(this.montoTotalSelected));
                        this.montoTotalSelected=""+this.round2(parseFloat(this.subTotalSelected)*1.18);
                        this.igvSelected=""+this.round2(parseFloat(this.montoTotalSelected) -parseFloat(this.subTotalSelected));
                        
                        this.montoTotalSelected=this.completar_ceros_derecha(this.montoTotalSelected,2);
                        this.subTotalSelected=this.completar_ceros_derecha(this.subTotalSelected,2);
                        this.igvSelected=this.completar_ceros_derecha(this.igvSelected,2);
                }

        }
        
        teclaKeyPressAutocomplete(event: any, indice: any) {

          
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
                this.lastkeydown1 = event.timeStamp;
                let textoBusqueda = this.listaProductos[indice].nombre;
                let tamBusqueda = textoBusqueda == null ? 0 : textoBusqueda.length;
              
                this.tamTexto.push(tamBusqueda);


                if (event.keyCode == 38 || event.keyCode == 40 || event.keyCode == 32 || event.keyCode == 13) {

                        
                        if (event.keyCode == 38) {

                                let lista = [];
                                lista = $('.lista-diego2 li');

                                
                                if (lista.length >= 0) {

                                        this.indiceLista = this.indiceLista == -1 ? lista.length - 1 : this.indiceLista;
                                        if (this.indiceLista >= 0) {
                                                this.indiceLista--;
                                                this.indiceLista = this.indiceLista == -1 ? lista.length - 1 : this.indiceLista;

                                                $('.lista-diego2 li').removeClass();
                                                $(lista[this.indiceLista]).addClass("seleccionado");
                                        }

                                }





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

                               

                        }


                }
        }


        teclaKeyUpAutocomplete(event: any, indice: any) {

               
                let tiempo = event.timeStamp;
            
                let textoBusqueda = this.listaProductos[indice].nombre;
                
                let tamBusqueda = textoBusqueda.length;
               

                let tamUltimo = this.tamTexto.length;
                this.print(tamUltimo);
                setTimeout(() => {    //<<<---    using ()=> syntax
                        this.print("tamUltimo: " + tamUltimo);
                        this.print("tamTexto Array: " + this.tamTexto.length);
                        if (tamUltimo == this.tamTexto.length) {
                                if (tamBusqueda > 2) {
                                        this.print("/*******************BUSCAR EL AUTOCOMPLETADO");
                                        this.print("buscar");
                                        this.listaNulaAutocompletado();
                                        this.listaProductos[indice].activo = true;
                                        this.buscarAutocompletado(indice);
                                }

                        }
                }, 200);




                if (event.keyCode == 27 || tamBusqueda < 2) {
                        this.indiceLista = -1;
                        this.listaProductos[indice].lista_autocompletado = null;
                        this.listaProductos[indice].eleccion_autocompletado_selected = false;
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
                nombre = nombre.replace(/\*/g, '%');
                this.print("texto a buscar: " + nombre);

                let parametros = JSON.stringify({
                        nombre: nombre
                });

                let user = this.obtenerUsuario();
                this.catalogoVentaService.buscarPaginacionAutocompletado(inicio, fin, tamPagina, parametros)
                        .subscribe(
                                data => {
                                        this.listaProductos[indice].lista_autocompletado = data;
                                        this.listaProductos[indice].eleccion_autocompletado_selected = true;


                                        this.print("lista autocompletado: ");
                                        this.print(data);

                                      
                                },
                                error => this.msj = <any>error);
        }


        
        buscarAutocompletado(indice) {
                let nombre = this.listaProductos[indice].nombre;

                this.indiceLista = -1;
                if (nombre != "") {
                        this.seleccionarByPaginaAutocompletado(1, this.tamanio_lista_mostrar, this.tamanio_lista_mostrar, indice);
                } else {
                        this.listaProductos[indice].lista_autocompletado = null;
                        //this.buscar();
                }
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


        eliminarCarrito(i) {
                this.print("INDICE A ELIMINAR: " + i);
                this.listaProductos.splice(i, 1)
                //this.sumarTotalProductos();
                this.sumarTotalProductos();
        }


        registrar() {
                if (this.tienePermisoPrintMsj(this.rutas.FORM_TRASLADO, this.rutas.BUTTON_REGISTRAR)) {
                        let parametros = JSON.stringify({
                                tipo_movimiento: this.tipoMovimientoSelected == null ? null : this.tipoMovimientoSelected,
                                concepto_movimiento: this.conceptoMovimientoSelected == null ? null : this.conceptoMovimientoSelected,
                                id_almacen_origen: this.localOrigenSelected == null ? null : this.localOrigenSelected.id_local,
                                id_almacen_destino: this.localDestinoSelected == null ? null : this.localDestinoSelected.id_local,
                                lista_productos: this.listaProductos
                        });
                        this.kardexService.registrar(parametros)
                                .subscribe(
                                data => {

                                        let rpta = data.rpta;
                                        this.print("rpta: " + rpta);
                                        if (rpta != null) {
                                                if (rpta == 1) {
                                                        this.mensajeCorrecto("MOVIMIENTO TRASLADO(S) REGISTRADO");
                                                        this.limpiarCampos();
                                                } else {
                                                        this.mensajeInCorrecto("MOVIMIENTO  TRASLADO(S)  NO REGISTRADO");
                                                }
                                        }

                                        this.obtenerKardex();

                                },
                                error => this.msj = <any>error
                                );
                }
        }

        buscar() {

                if (this.tienePermisoPrintMsj(this.rutas.FORM_TRASLADO, this.rutas.BUTTON_BUSCAR)) {
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

                

                if (this.tienePermisoPrintMsj(this.rutasMantenedores.FORM_TRASLADO, this.rutasMantenedores.BUTTON_ELIMINAR)) {

                       
                        
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

                if (this.tienePermisoPrintMsj(this.rutasMantenedores.FORM_TRASLADO, this.rutasMantenedores.BUTTON_ACTUALIZAR)) {
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