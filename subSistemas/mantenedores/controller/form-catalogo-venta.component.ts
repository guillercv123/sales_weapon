import { Component, AfterViewInit, ViewChild, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';

import { ControllerComponent } from '../../../core/controller/controller.component';




/******************IMPORTAR SERVICIOS*************** */


import { UnidadMedidaService } from '../service/unidad-medida.service';
import { TipoProductoService } from '../service/tipo-producto.service';
import { CatalogoVentaService } from '../service/catalogo-venta.service';
import { TipoMonedaService } from '../service/tipo-moneda.service';
import { LocalService } from '../service/local.service';
import { AlmacenService } from '../service/almacen.service';
import { StockService } from '../service/stock.service';
import { AplicacionService } from '../service/aplicacion.service';
import { MarcaService } from '../service/marca.service';

import { Vista } from '../model/Vista';
import { FormFindClienteComponent } from './cliente/form-find-cliente.component';
import { FormFindProveedorComponent } from './proveedor/form-find-proveedor.component';
import { FormProductoComponent } from './form-producto.component';

declare var $: any;
@Component({
        selector: 'form-catalogo-venta',
        templateUrl: '../view/form-catalogo-venta.component.html',
        providers: [MarcaService,CatalogoVentaService, TipoProductoService, UnidadMedidaService, AplicacionService, TipoMonedaService, LocalService, AlmacenService, StockService]

})

export class FormCatalogoVentaComponent extends ControllerComponent implements AfterViewInit {
        checkOpcionesAvanzadas:boolean=false;
        valor_30_porc:number;
        marcaSelected: any;
        marcas: any[];
        codigo:string;
        codigo_barra:string;



        id_producto_movimiento:any;
        fechaInicioSelected:any;
        fechaFinSelected:any;

        listaStockDetalle:any[];
        almacenes: any[];
        locales: any[];
        tipos_producto: any[];
        unidades_medida: any[];
        aplicaciones: any[];
        tiposMoneda: any[];
        listaProductos: any[];
        lista_stock: any[];

        idCatalogoVentaSelected: any;
        localSelected: any;
        almacenSelected: any;
        tipoProSelected: any;
        uniMediSelected: any;
        apliSelected: any;
        tipoMonedaSelected: any;
        proveedorSelected: any;
        precioSelected: any;
        nombreSelected: string;
        idProductoSelected: string;
        
        precioBaseSelected: any;
        tipoMonedaPbSelected: any;
        igvSelected: any;
        tipoCambioSelected: any;
        tipoMonedaPRSelected: any;
        precioReferenciaSelected:any;
        registro:boolean=true;


        medidaA: number;
        medidaB: number;
        medidaC: number;
        medidaD: number;
        medidaE: number;
        medidaF: number;
        descripcion: string;

        medidaA_menor: number;
        medidaA_mayor: number;

        medidaB_menor: number;
        medidaB_mayor: number;

        medidaC_menor: number;
        medidaC_mayor: number;

        medidaD_menor: number;
        medidaD_mayor: number;

        medidaE_menor: number;
        medidaE_mayor: number;

        medidaF_menor: number;
        medidaF_mayor: number;
        
        tipo_cambio_masivo:number;


        //************OBJETO ELEGIDO PARA EDITAR************
        beanSelected: any;


        //***********PANELES DE LOS MANTENEDORES***********
        //panelRegistroSelected: boolean = false;
        //panelBusquedaSelected: boolean = false;
        panelEditarSelected: boolean = false;
        //panelAccionesGeneralesSelected: boolean = true;
        @Input() panelListaBeanSelected: boolean = true;
        busquedaMarcadaChecked: boolean = false;


        @ViewChild('myInput',{static: true})
        archivo: any;

        file: any;


        //****************OBTEJOS OBTENIDOS DEL FORMULARIO PRODUCTO
        beanSelectedExterno: any;
        activatedSelectedPro: boolean = true;


        //****************OBTEJOS OBTENIDOS DEL FORMULARIO PROVEEDOR
        activatedSelectedProve: boolean = true;




        panelRegistroSelected: boolean = false;


        @Output() productoSeleccionado = new EventEmitter();
        @Input() buttonSelectedActivated = false;
        @Input() buttonEliminarActivated = true;
        @Input() buttonEditarActivated = true;


        @Input() panelListaVentaBeanSelected: boolean = false;
        @Input() estiloBusquedaCatalogo: string;
        @Input() estiloTablaDerecha: string;
        @Input() colMd2: string = "col-md-2";
        @Input() colMd4: string = "col-md-4";
        @Input() col1Md2: string = "col-md-4";
        @Input() campoOculto: boolean = false;


        /*********OBJETOS DEL MODAL CLIENTE************/
        buttonSelectedActivatedCli: boolean = true;
        buttonEliminarActivatedCli: boolean = false;
        buttonEditarActivatedCli: boolean = false;
        busquedaR:boolean = true; 
        clienteSelected: any;
        listaMoneda:any[];

        /***********OPCION GUARDAR EL USUARIO DE LA VENTA (CREADO PARA PUNTO DE VENTA)***********/
        busquedaClienteVenta: boolean = false;
        checkPorCliente: boolean = false;
        clienteVentaSelected: any;

        lista_locales:any[];
        listaMoneda1:any[];

        //VARIBLES PARA EL AUTOCOMPLETADO
        lista_autocompletado: any;
        indiceLista: any = -1;
        eleccion_autocompletado_selected: boolean = false;
        tamanio_lista_mostrar: number = 100;

        @ViewChild(FormFindClienteComponent,{static: true}) formFindCliente: FormFindClienteComponent;
        @ViewChild(FormFindProveedorComponent,{static:true}) formFindProveedor: FormFindProveedorComponent;
        @ViewChild(FormProductoComponent,{static: true}) formProducto: FormProductoComponent;

        isModal:boolean=false;
        constructor(
                public http: Http,
                public router: Router,
                public tipoProductoService: TipoProductoService,
                public unidadMedidaService: UnidadMedidaService,
                public catalogoVentaService: CatalogoVentaService,
                public aplicacionService: AplicacionService,
                public tipoMonedaService: TipoMonedaService,
                public localService: LocalService,
                public almacenService: AlmacenService,
                public stockService: StockService,
                public marcaService:MarcaService
        ) {
                super(router);
                
                this.panelEditarSelected = false;
                this.campoOculto = false;
              
        }




        ngOnInit() {
                this.formProducto.isModal=true;
                this.limpiarCamposIni();
              
                
                this.marcas = JSON.parse(localStorage.getItem("lista_marcas"));
                this.locales = JSON.parse(localStorage.getItem("lista_locales"));
                this.tiposMoneda = JSON.parse(localStorage.getItem("lista_tipos_moneda"));
                this.aplicaciones = JSON.parse(localStorage.getItem("lista_aplicaciones"));
                this.unidades_medida = JSON.parse(localStorage.getItem("lista_unidades_medida"));
                this.tipos_producto = JSON.parse(localStorage.getItem("lista_tipos_producto"));
               
               
        }


        ngAfterViewInit() {
                if (this.verificarTokenRpta(this.rutasMantenedores.FORM_CATALOGO_VENTA)) {
                  
                        this.formFindCliente.buttonSelectedActivated=true; 
                        this.formFindProveedor.buttonSelected=true;                
                        this.igvSelected=0.18;
                        this.tipoCambioSelected=3.30;
                        this.valor_30_porc=1.534;
                        
                        if(!this.isModal){
                                this.obtenerCatalogoVenta();
                        }
                        this.obtenerAlmacenes();
                        this.obtenerTipoMoneda();
                }
        }

        mostrarAlmacen() {
                this.obtenerAlmaceneByIdLocal(this.localSelected.id_local);
               
        }

        obtenerTipoMoneda(){
                this.tipoMonedaService.getAll().subscribe(
                        data =>{
                        this.listaMoneda=data;
                        this.tiposMoneda=data;
                        }
                );
        }

        obtenerAlmacenes(){

                this.localService.getAll().subscribe(
                        data=>{
                                this.lista_locales = data;
                        }
                )
           

        }

        obtenerAlmaceneByIdLocal(id) {

                this.almacenService.getByIdLocal(id)
                        .subscribe(
                        data => {//this.vistas = data;

                                this.almacenes = data;
                                if (this.almacenes != null) {
                                        this.almacenSelected = this.almacenes[0];                     
                                }
                                
                        },
                        error => this.msj = <any>error);
        }

        obtenerAlmaceneByIdLocalEditar(id) {

                this.almacenService.getByIdLocal(id)
                        .subscribe(
                        data => {//this.vistas = data;

                                this.almacenes = data;
                                this.almacenSelected=this.obtenerAlmacenActual( this.beanSelectedExterno.nombre_almacen);
                        },
                        error => this.msj = <any>error);
        }


        abrirPanelBuscar() {

                this.panelEditarSelected = false;
                this.panelListaBeanSelected = true;

        }

        abrirPanelRegistrar() {
                //this.panelEditarSelected = false;
                //this.panelListaBeanSelected = true;

                this.panelRegistroSelected = true;
        }

        abrirPanelEditar(pro) {
                this.print(pro);

                if (this.tienePermisoPrintMsj(this.rutas.FORM_CATALOGO_VENTA, this.rutas.PANEL_EDITAR)) {
                        this.beanSelectedExterno = pro;
                        this.idProductoSelected = pro.id_producto;
                       
                        this.idCatalogoVentaSelected = pro.id_catalogo_venta;
                        this.precioSelected = pro.precio_base;
                        this.tipoMonedaSelected = this.obtenerTipoMonedaActualId(pro.id_tipo_moneda_pb);
                        this.proveedorSelected = { nombre: pro.nombre_proveedor, id_proveedor: pro.id_proveedor };
                        this.clienteSelected = { nombres: pro.nombre_cliente, id_cliente: pro.id_cliente };
                        this.print(this.clienteSelected);
                        this.igvSelected=pro.igv;
                        this.tipoCambioSelected=pro.tipo_cambio;
                        this.precioReferenciaSelected=pro.precio_referencia;
                        this.tipoMonedaPRSelected = this.obtenerTipoMonedaActualId(pro.id_tipo_moneda_pr);
                        this.localSelected=this.obtenerLocalActual(pro.nombre_local);
                        this.obtenerAlmaceneByIdLocalEditar(this.localSelected.id_local);
   

                        this.panelEditarSelected = true;
                        this.panelListaBeanSelected = false;
                }
        }


        regresar() {
                //this.limpiarCampos();

                this.panelEditarSelected = false;
                this.panelListaBeanSelected = true;
        }

        busqueda(){
                this.panelEditarSelected = false;
                this.panelListaBeanSelected = true;
                this.registro = false;
                this.busquedaR = true;
        }
        nuevo(){
                this.panelEditarSelected = false;
                this.panelListaBeanSelected = true;   
                this.busquedaR = false;
                this.registro = true;
                this.panelListaBeanSelected = false;
        }


        obtenerMarcas() {
                this.marcaService.getAll()
                        .subscribe(
                        data => {//this.vistas = data;

                                this.marcas = data;
                        },
                        error => this.msj = <any>error);
        }

        obtenerLocales() {

                this.localService.getAll()
                        .subscribe(
                        data => {//this.vistas = data;

                                this.locales = data;
                                if (this.locales != null) {
                                        this.localSelected = this.locales[0];
                                        this.mostrarAlmacen();                                   
                                }
                        },
                        error => this.msj = <any>error);
        }


        obtenerTiposProducto() {

                this.tipoProductoService.getAll()
                        .subscribe(
                        data => {//this.vistas = data;

                                this.tipos_producto = data;
                        },
                        error => this.msj = <any>error);
        }

        obtenerUnidadesMedida() {

                this.unidadMedidaService.getAll()
                        .subscribe(
                        data => {//this.vistas = data;

                                this.unidades_medida = data;
                        },
                        error => this.msj = <any>error);


        }


        verStock(obj) {


                if (this.tienePermisoPrintMsj(this.rutas.FORM_CATALOGO_VENTA, this.rutas.BUTTON_STOCK)) {

                        this.abrirModal("modalStockProducto");

                        this.stockService.getDetalleById(obj.id_producto)
                                .subscribe(
                                data => {
                                        this.lista_stock = data;
                                },
                                error => this.msj = <any>error);
                }
        }

        buscarMovimientos(){
                this.completado=true;
                
                let parametros = JSON.stringify({
                        cantidad: null,
                        simbolo:null,
                        id_producto: this.id_producto_movimiento,
                        fecha_inicio:   this.fechaInicioSelected,
                        fecha_fin:      this.fechaFinSelected
                });

                this.stockService.buscarPaginacionDetalle(1, 200, 200, parametros)
                        .subscribe(
                                data => {
                                        this.listaStockDetalle = data;
                                        this.completado=false;
                                        this.print(data);
                                },
                                error => this.msj = <any>error);
        }

        verMovimientos(obj){
                this.listaStockDetalle=null;
                this.id_producto_movimiento=obj.id_producto;

                let fi=new Date();
                fi.setDate(fi.getDate() -1);
                let ff=new Date();

                this.fechaInicioSelected=fi.getFullYear()+"-"+(fi.getMonth()<9?'0'+(fi.getMonth()+1): fi.getMonth()+1)+"-"+fi.getDate();
                this.fechaFinSelected=ff.getFullYear()+"-"+(ff.getMonth()<9?'0'+(ff.getMonth()+1): ff.getMonth()+1)+"-"+ff.getDate();

                //this.print("fecha inicio: "+fi);
                //this.print("fecha fin: "+ff);
                
                

                this.buscarMovimientos();
                this.abrirModal("modalStockMovimiento");
        }




        obtenerAplicaciones() {

                this.aplicacionService.getAll()
                        .subscribe(
                        data => {//this.vistas = data;

                                this.aplicaciones = data;
                        },
                        error => this.msj = <any>error);
        }

        /*obtenerTiposMoneda() {

                this.tipoMonedaService.getAll()
                        .subscribe(
                        data => {//this.vistas = data;

                                this.tiposMoneda = data;
                        },
                        error => this.msj = <any>error);
        }*/

        obtenerTiposMoneda() {

                this.tipoMonedaService.getAll()
                        .subscribe(
                                data => {//this.vistas = data;

                                        this.tiposMoneda = data;
                                        if (this.tiposMoneda != null) {
                                                this.tipoMonedaSelected = this.tiposMoneda[0];
                                                this.tipoMonedaPRSelected= this.tiposMoneda[0];
                                                this.tipoMonedaPbSelected= this.tiposMoneda[0];                                        
                                        }
                                },
                                error => this.msj = <any>error);
        }

        obtenerCatalogoVenta() {
                this.limpiarCampos();
                this.getTotalLista();
              //  this.seleccionarByPagina(this.inicio, this.fin, this.tamPagina);

                /*this.productoService.getAll()
                        .subscribe(
                        data => {//this.vistas = data;

                                this.listaProductos = data;
                        },
                        error => this.msj = <any>error);*/
        }


        seleccionarByPagina(inicio: any, fin: any, tamPagina: any) {
                let parametros = JSON.stringify({
                        id_marca:this.marcaSelected==null?null:this.marcaSelected.id_marca,
                        codigo:this.codigo,
                        codigo_barra:this.codigo_barra,
                        id_producto: this.idProductoSelected,
                        id_tipo_producto: this.tipoProSelected == null ? null : this.tipoProSelected.id_tipo_producto,
                        id_unidad_medida: this.uniMediSelected == null ? null : this.uniMediSelected.id_unidad_medida,
                        id_aplicacion: this.apliSelected == null ? null : this.apliSelected.id_aplicacion,
                        nombre: this.nombreSelected,
                        medida_a: this.medidaA,
                        medida_b: this.medidaB,
                        medida_c: this.medidaC,
                        medida_d: this.medidaD,
                        medida_e: this.medidaE,
                        medida_f: this.medidaF,


                        //***********BUSQUEDA POR RANGOS************

                        medida_a_menor: this.medidaA_menor,
                        medida_a_mayor: this.medidaA_mayor,

                        medida_b_menor: this.medidaB_menor,
                        medida_b_mayor: this.medidaB_mayor,

                        medida_c_menor: this.medidaC_menor,
                        medida_c_mayor: this.medidaC_mayor,

                        medida_d_menor: this.medidaD_menor,
                        medida_d_mayor: this.medidaD_mayor,
                        
                        medida_e_menor: this.medidaE_menor,
                        medida_e_mayor: this.medidaE_mayor,

                        medida_f_menor: this.medidaF_menor,
                        medida_f_mayor: this.medidaF_mayor,


                        id_tipo_moneda: this.tipoMonedaSelected == null ? null : this.tipoMonedaSelected.id_tipo_moneda,
                        precio: this.precioSelected,
                        id_cliente: this.checkPorCliente ==false  ? null :  this.clienteSelected == null ? null : this.clienteSelected.id_cliente,
                        check_cliente:this.checkPorCliente ==true?1:0

                });

                let user = this.obtenerUsuario();
                this.catalogoVentaService.buscarPaginacion(inicio, fin, tamPagina, parametros)
                        .subscribe(
                        data => {
                                this.listaProductos = data;
                                this.print("lista de catalogos");
                                this.print(data);
                        },
                        error => this.msj = <any>error);
        }



        actualizarTipoCambioMasivo(tc_masivo) {
                let parametros = JSON.stringify({
                        tipo_cambio:tc_masivo
                });

                this.catalogoVentaService.actualizarTipoCambioMasivo( parametros)
                        .subscribe(
                        data => {
                               let nro_filas=data;
                               if(nro_filas>=0){
                                        this.mensajeCorrectoSinCerrar("ACTUALIZACION DE TIPO DE CAMBIO CORRECTA");
                                        this.obtenerCatalogoVenta();
                                }else{
                                        this.mensajeInCorrecto("ACTUALIZACION ERRONEA DE TIPO DE CAMBIO");
                               }
                                /*if(this.listaProductos.length>0){
                                        this.fin=this.listaProductos[this.listaProductos.length-1].correlativoDoc;
                                }*/
                                this.print(data);
                        },
                        error => this.msj = <any>error);
        }


        teclaEnter(event: any) {
                //this.print("tecla: "+event);
                //this.print("code: "+event.keyCode);
                if (event.keyCode == 13) {
                        //this.autocompletado=true;
                        this.buscar();
                        return false;
                }
        }


        onChange(event) {
                this.file = event.srcElement.files;
        }



        mostrarImagen(pro) {
                this.beanSelected = pro;
                this.abrirModal("modalImagenProducto");

        }

        registrar() {


                if (this.tienePermisoPrintMsj(this.rutas.FORM_CATALOGO_VENTA, this.rutas.BUTTON_REGISTRAR)) {

                        let parametros = JSON.stringify({
                                id_producto: this.beanSelectedExterno.id_producto,
                                id_tipo_moneda: this.tipoMonedaSelected.id_tipo_moneda,
                                id_proveedor: this.proveedorSelected.id_proveedor,
                                precio: this.precioSelected/this.valor_30_porc,
                                id_almacen: this.almacenSelected.id_almacen,
                                id_cliente: this.clienteSelected == null ? null : this.clienteSelected.id_cliente,

                                id_tipo_moneda_pb:this.tipoMonedaSelected.id_tipo_moneda,
                                id_tipo_moneda_pr:this.tipoMonedaPRSelected.id_tipo_moneda,
                                igv:this.igvSelected,
                                tipo_cambio:this.tipoCambioSelected,
                                precio_base:this.precioSelected,
                                id_tipo_cambio :175
                        });



                        this.catalogoVentaService.registrar(parametros)
                                .subscribe(
                                data => {

                                        let rpta = data.rpta;
                                        this.print("rpta: " + rpta);
                                        if (rpta != null) {
                                                if (rpta == 1) {
                                                        this.mensajeCorrectoSinCerrar("PRODUCTO REGISTRADO EN CATALOGO VENTAS");
                                                        this.limpiarCampos();
                                                } else {
                                                        this.mensajeInCorrecto("PRODUCTO NO REGISTRADO EN CATALOGO VENTAS");
                                                }
                                        }

                                        this.obtenerCatalogoVenta();

                                },
                                error => this.msj = <any>error
                                );
                }
        }

        buscar() {
                if (this.tienePermisoPrintMsj(this.rutas.FORM_CATALOGO_VENTA, this.rutas.BUTTON_BUSCAR)) {
                        this.getTotalLista();
                        this.seleccionarByPagina(this.inicio, this.fin, this.tamPagina);
                }
        }


        buscarMantenedor() {
                if (this.tienePermisoPrintMsj(this.rutas.FORM_CATALOGO_VENTA, this.rutas.BUTTON_BUSCAR)) {
                        this.getTotalListaMantenedor();
                        this.seleccionarByPaginaMantenedor(this.inicio, this.fin, this.tamPagina);
                }
        }


        limpiar() {
                this.limpiarCampos();
                this.inicio = 1;
                this.fin = 10;
                this.tamPagina = 10;
                this.getTotalLista();
              //  this.seleccionarByPagina(this.inicio, this.fin, this.tamPagina);
        }


        eliminar(bean) {

                if (this.tienePermisoPrintMsj(this.rutas.FORM_CATALOGO_VENTA, this.rutas.BUTTON_ELIMINAR)) {
                        
                        if( confirm("Realmente Desea Eliminar ?")){
                        this.catalogoVentaService.eliminarLogico(bean.id_catalogo_venta)
                                .subscribe(
                                data => {
                                        //this.obtenerCatalogoVenta();
                                        this.buscarMantenedor();
                                        let rpta = data;
                                        if (rpta != null) {
                                                if (rpta == 1) {
                                                        this.mensajeCorrecto("PRODUCTO ELIMINADO DEL CATALOGO VENTAS CORRECTAMENTE");
                                                } else {
                                                        this.mensajeInCorrecto("PRODUCTO NO ELIMINADO DEL CATALOGO VENTAS");
                                                }

                                        }
                                },
                                error => this.msj = <any>error);
                        }
                }
        }


        obtenerTipoActual(nombreTipo: string) {
                let obj = null;
                let i;
                for (i = 0; i < this.tipos_producto.length; i++) {
                        //this.print("this.tipos_producto[i].nombre"+this.tipos_producto[i].nombre+" , nombreTipo: " +nombreTipo);
                        if (this.tipos_producto[i].nombre == nombreTipo) {
                                obj = this.tipos_producto[i];
                                break;
                        }
                }
                return obj;
        }

        obtenerUnidadMedidaActual(nombreTipo: string) {
                let obj = null;
                let i;
                for (i = 0; i < this.unidades_medida.length; i++) {
                        //this.print("this.tipos_producto[i].nombre"+this.tipos_producto[i].nombre+" , nombreTipo: " +nombreTipo);
                        if (this.unidades_medida[i].nombre == nombreTipo) {
                                obj = this.unidades_medida[i];
                                break;
                        }
                }
                return obj;
        }


        obtenerAplicacionActual(nombreTipo: string) {
                let obj = null;
                let i;
                for (i = 0; i < this.aplicaciones.length; i++) {
                        //this.print("this.tipos_producto[i].nombre"+this.tipos_producto[i].nombre+" , nombreTipo: " +nombreTipo);
                        if (this.aplicaciones[i].nombre == nombreTipo) {
                                obj = this.aplicaciones[i];
                                break;
                        }
                }
                return obj;
        }


        obtenerTipoMonedaActual(nombreTipo: string) {
                let obj = null;
                let i;
                for (i = 0; i < this.tiposMoneda.length; i++) {
                        //this.print("this.tipos_producto[i].nombre"+this.tipos_producto[i].nombre+" , nombreTipo: " +nombreTipo);
                        if (this.tiposMoneda[i].nombre == nombreTipo) {
                                obj = this.tiposMoneda[i];
                                break;
                        }
                }
                return obj;
        }

        obtenerLocalActual(nombreTipo: string) {
                let obj = null;
                let i;
                for (i = 0; i < this.locales.length; i++) {
                        //this.print("this.tipos_producto[i].nombre"+this.tipos_producto[i].nombre+" , nombreTipo: " +nombreTipo);
                        if (this.locales[i].nombre == nombreTipo) {
                                obj = this.locales[i];
                                break;
                        }
                }
                return obj;
        }

        obtenerAlmacenActual(nombreTipo: string) {
                let obj = null;
                let i;
                for (i = 0; i < this.almacenes.length; i++) {
                        //this.print("this.tipos_producto[i].nombre"+this.tipos_producto[i].nombre+" , nombreTipo: " +nombreTipo);
                        if (this.almacenes[i].nombre == nombreTipo) {
                                obj = this.almacenes[i];
                                break;
                        }
                }
                return obj;
        }
        

        obtenerTipoMonedaActualId(id) {
                let obj = null;
                let i;
                for (i = 0; i < this.tiposMoneda.length; i++) {
                        //this.print("this.tipos_producto[i].nombre"+this.tipos_producto[i].nombre+" , nombreTipo: " +nombreTipo);
                        if (this.tiposMoneda[i].id_tipo_moneda == id) {
                                obj = this.tiposMoneda[i];
                                break;
                        }
                }
                return obj;
        }


        editar() {

                
                if (this.tienePermisoPrintMsj(this.rutas.FORM_CATALOGO_VENTA, this.rutas.BUTTON_ACTUALIZAR)) {
                        let parametros = JSON.stringify({
                                id_producto: this.idProductoSelected,
                                id_tipo_moneda: this.tipoMonedaSelected.id_tipo_moneda,
                                id_proveedor: this.proveedorSelected.id_proveedor,
                                precio: this.precioSelected,

                                id_almacen: this.almacenSelected.id_almacen,
                                id_cliente: this.clienteSelected == null ? null : this.clienteSelected.id_cliente,

                                id_tipo_moneda_pb:this.tipoMonedaSelected.id_tipo_moneda,
                                id_tipo_moneda_pr:this.tipoMonedaPRSelected.id_tipo_moneda,
                                igv:this.igvSelected,
                                tipo_cambio:this.tipoCambioSelected,
                                precio_base:this.precioSelected,
                                precio_referencia:this.precioReferenciaSelected
                                
                        });
                        this.print("id_producto: "+this.idProductoSelected);

                        this.print("parametros: " + parametros);
                        
                        this.catalogoVentaService.editar(parametros, this.idCatalogoVentaSelected)
                                .subscribe(
                                data => {
                                        //this.obtenerCatalogoVenta();
                                        this.idProductoSelected = null;
                                        this.precioSelected = null;
                                        this.tipoMonedaPRSelected = null;
                                        this.clienteSelected=null;

                                        this.buscarMantenedor();
                                        let rpta = data.rpta;
                                        this.print("rpta: " + rpta);
                                        if (rpta != null) {
                                                if (rpta) {
                                                        this.mensajeCorrecto("PRODUCTO MODIFICADO DEL CATALOGO VENTAS");
                                                } else {
                                                        this.mensajeInCorrecto(" PRODUCTO NO MOFICADO DEL CATALOGO VENTAS");
                                                }
                                        }

                                },
                                error => this.msj = <any>error
                                );
                }

        }




        limpiarBusquedaRangos() {

                if (!this.busquedaMarcadaChecked) {
                        this.medidaA_menor = null;
                        this.medidaA_mayor = null;

                        this.medidaB_menor = null;
                        this.medidaB_mayor = null;

                        this.medidaC_menor = null;
                        this.medidaC_mayor = null;

                        this.medidaD_menor = null;
                        this.medidaD_mayor = null;
                }

        }

        ocultarLista(){
                this.panelListaBeanSelected= false;
        }

        mostrarLista(){
                this.panelListaBeanSelected= true;
        }

        limpiarCampos() {
                this.marcaSelected=null;
                this.codigo=null;
                this.codigo_barra=null;
                this.idProductoSelected = null;

                this.tipoProSelected = null;
                this.uniMediSelected = null;
                this.apliSelected = null;
                this.localSelected = null;
                this.almacenSelected = null;

                this.nombreSelected = null;
                this.file = null;
                this.archivo = null;
                this.medidaA = null;
                this.medidaB = null;
                this.medidaC = null;
                this.medidaD = null;
              
                this.descripcion = null;

                this.medidaA_menor = null;
                this.medidaA_mayor = null;

                this.medidaB_menor = null;
                this.medidaB_mayor = null;

                this.medidaC_menor = null;
                this.medidaC_mayor = null;

                this.medidaD_menor = null;
                this.medidaD_mayor = null;

                this.beanSelectedExterno = null;
                this.panelRegistroSelected = false;
                this.proveedorSelected = null;
                this.clienteSelected = null;

                this.tipoMonedaSelected = null;
                this.precioSelected = null;


                this.precioBaseSelected= null;
                this.tipoMonedaPbSelected= null;
                this.igvSelected= null;
                this.tipoCambioSelected= null;
                this.tipoMonedaPRSelected= null;
                this.precioReferenciaSelected= null;


        }

        limpiarCamposIni() {
                this.idProductoSelected = null;

                this.tipoProSelected = null;
                this.uniMediSelected = null;
                this.apliSelected = null;
                this.localSelected = null;
                this.almacenSelected = null;

                this.nombreSelected = null;
                this.file = null;
                this.archivo = null;
                this.medidaA = null;
                this.medidaB = null;
                this.medidaC = null;
                this.medidaD = null;
                this.descripcion = null;

                this.medidaA_menor = null;
                this.medidaA_mayor = null;

                this.medidaB_menor = null;
                this.medidaB_mayor = null;

                this.medidaC_menor = null;
                this.medidaC_mayor = null;

                this.medidaD_menor = null;
                this.medidaD_mayor = null;

                this.beanSelectedExterno = null;
                this.panelRegistroSelected = false;
                this.proveedorSelected = null;
                //this.clienteSelected=null;

                this.tipoMonedaSelected = null;
                this.precioSelected = null;

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




        getTotalLista() {
                /*this.productoService.getTotal()
                        .subscribe(
                        data => {
                                this.totalLista = data;
                                this.print(data);
                        },
                        error => this.msj = <any>error);*/
                let parametros = JSON.stringify({
                        id_marca:this.marcaSelected==null?null:this.marcaSelected.id_marca,
                        codigo:this.codigo,
                        codigo_barra:this.codigo_barra,
                        id_producto: this.idProductoSelected,
                        id_tipo_producto: this.tipoProSelected == null ? null : this.tipoProSelected.id_tipo_producto,
                        id_unidad_medida: this.uniMediSelected == null ? null : this.uniMediSelected.id_unidad_medida,
                        id_aplicacion: this.apliSelected == null ? null : this.apliSelected.id_aplicacion,
                        nombre: this.nombreSelected,
                        medida_a: this.medidaA,
                        medida_b: this.medidaB,
                        medida_c: this.medidaC,
                        medida_d: this.medidaD,
                        medida_e: this.medidaE,
                        medida_f: this.medidaF,

                        //***********BUSQUEDA POR RANGOS************

                        medida_a_menor: this.medidaA_menor,
                        medida_a_mayor: this.medidaA_mayor,

                        medida_b_menor: this.medidaB_menor,
                        medida_b_mayor: this.medidaB_mayor,

                        medida_c_menor: this.medidaC_menor,
                        medida_c_mayor: this.medidaC_mayor,

                        medida_d_menor: this.medidaD_menor,
                        medida_d_mayor: this.medidaD_mayor,

                        medida_e_menor: this.medidaE_menor,
                        medida_e_mayor: this.medidaE_mayor,

                        medida_f_menor: this.medidaF_menor,
                        medida_f_mayor: this.medidaF_mayor,

                        id_tipo_moneda: this.tipoMonedaSelected == null ? null : this.tipoMonedaSelected.id_tipo_moneda,
                        precio: this.precioSelected,
                        id_cliente: this.checkPorCliente ==false  ? null :  this.clienteSelected == null ? null : this.clienteSelected.id_cliente,
                        check_cliente:this.checkPorCliente ==true?1:0

                });

                this.print("parametros total: " + parametros);
                this.catalogoVentaService.getTotalParametros(parametros)
                        .subscribe(
                        data => {
                                this.totalLista = data;
                                this.print("total:" + data);
                        },
                        error => this.msj = <any>error);
        }

      

        //**********ACCIONES PARAR FORMULARIO PRODUCTO********
        abrirModalProducto() {
                //this.cerrarPanelRegistrar();
                this.abrirModal("modalProducto");

                if(this.formProducto.listaProductos==null){
                        this.formProducto.obtenerProductos();
                }
                //this.panelListaBeanSelectedPer = true;
        }


        //**********ACCIONES PARAR FORMULARIO PROVEEDOR********
        abrirModalProveedor() {
                //this.cerrarPanelRegistrar();
                this.abrirModal("modalProveedor");
                this.formFindProveedor.buscar();
                //this.panelListaBeanSelectedPer = true;
        }

        //**********ACCIONES PARAR FORMULARIO PROVEEDOR********
        abrirModalCliente() {
                this.abrirModal("modalClienteCv");
        }



        //**********METODO QUE OBTIENE LOS DATOS EXTERNOS 
        obtenerDatosExternos(datos) {
                this.beanSelectedExterno = datos.bean;
                this.idProductoSelected = this.beanSelectedExterno.id_producto;
                //this.listaClientes.splice(0,this.listaClientes.length);
                //this.listaClientes.push(datos.bean)
                //this.listaClientes=datos.bean;
                this.cerrarModal("modalProducto");
                this.print("DATOS EXTERNOS: ");
                this.print(datos);
                this.abrirPanelRegistrar();
        }


        /*********OBTENER DATOS DEL CLIENTE*********/
        obtenerClienteDatosExternos(datos) {
                this.clienteSelected = datos.bean;
                this.print("datos Cliente");
                this.print(datos);
                this.cerrarModal("modalClienteCv");

        }


        obtenerProveedorDatosExternos(datos) {
                this.proveedorSelected = datos.bean;
                this.print(datos);
                this.cerrarModal("modalProveedor");

        }

        seleccionar(bean) {

                bean.tiene_precio_especial=false;
                if(this.checkPorCliente){
                        bean.tiene_precio_especial=true;
                }

                this.productoSeleccionado.emit({ bean: bean });
        }







        //***********MANEJO DEL AUTOCOMPLETADO************


        teclaKeyPressAutocomplete(event: any) {

                if (!this.eleccion_autocompletado_selected && event.keyCode == 13) {
                        this.lista_autocompletado = null;
                        this.eleccion_autocompletado_selected = false;
                        this.indiceLista = -1;
                        if(this.campoOculto==true){
                                this.buscar();
                        }else{
                                this.buscarMantenedor();
                        }

                       
                        return false;
                }

                if (this.eleccion_autocompletado_selected && event.keyCode == 13) {
                        this.elegirProducto(this.lista_autocompletado[this.indiceLista]);
                }


                if (event.keyCode == 27) {
                        this.lista_autocompletado = null;
                        this.indiceLista = -1;
                        this.eleccion_autocompletado_selected = false;
                }


        }


        teclaKeyDownAutocomplete(event: any) {
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

                                        this.indiceLista = this.indiceLista == -1 ? lista.length - 1 : this.indiceLista;
                                        if (this.indiceLista >= 0) {
                                                this.indiceLista--;
                                                this.indiceLista = this.indiceLista == -1 ? lista.length - 1 : this.indiceLista;

                                                $('.lista-diego li').removeClass();
                                                $(lista[this.indiceLista]).addClass("seleccionado");
                                        }

                                }




                                this.print("PRESIONASTE TECLA HACIA ARRIBA UP")
                                this.print("tamaño: " + $('.lista-diego li'));
                                this.print("tam:" + lista.length);
                                this.print("indice:" + this.indiceLista);

                        }

                        //******************FLECHA HACI ABAJO***************** 
                        if (event.keyCode == 40) {

                                let lista = [];
                                lista = $('.lista-diego li');
                                if (lista.length > 0) {
                                        //$(lista[this.indiceLista]).addClass( "seleccionado" );
                                        this.print("condicion: " + this.indiceLista + "tam:" + (lista.length - 1));
                                        if (this.indiceLista <= lista.length - 1) {
                                                this.indiceLista++
                                                $('.lista-diego li').removeClass();
                                                $(lista[this.indiceLista]).addClass("seleccionado");
                                        }

                                        if (this.indiceLista == lista.length) {
                                                this.indiceLista = 0;
                                                $('.lista-diego li').removeClass();
                                                $(lista[this.indiceLista]).addClass("seleccionado");
                                        }


                                }

                                this.print("PRESIONASTE TECLA HACIA ABAJO UP")
                                this.print("tamaño: " + $('.lista-diego li'));
                                this.print("tam:" + lista.length);
                                this.print("indice:" + this.indiceLista);

                        }


                }
        }


        teclaKeyUpAutocomplete(event: any) {

                //  tecla flecha arriba     :  38
                //  tecla flecha abajo      :  40
                //  tecla enter             :  13
                //  tecla barra espaciadora : 32
                //  tecla escape            : 27

                if (event.keyCode != 38 && event.keyCode != 40 && event.keyCode != 13 && event.keyCode != 27) {
                        this.buscarAutocompletado();
                }

                if (event.keyCode == 27) {
                        this.indiceLista = -1;
                        this.lista_autocompletado = null;
                        this.eleccion_autocompletado_selected = false;
                }
        }



        elegirProducto(producto: any) {
                if (producto != null) {
                        this.print(producto);
                        this.indiceLista = -1;
                        this.nombreSelected = producto.nombre;
                        this.lista_autocompletado = null;
                        this.eleccion_autocompletado_selected = false;
                }
                this.buscar();
        }

        buscarAutocompletado() {
                this.indiceLista = -1;
                if (this.nombreSelected != "") {
                        this.seleccionarByPaginaAutocompletado(1, this.tamanio_lista_mostrar, this.tamanio_lista_mostrar);
                } else {
                        this.lista_autocompletado = null;
                        this.buscar();
                }
        }

        seleccionarByPaginaAutocompletado(inicio: any, fin: any, tamPagina: any) {
                let parametros = JSON.stringify({
                        id_producto: this.idProductoSelected,
                        id_tipo_producto: this.tipoProSelected == null ? null : this.tipoProSelected.id_tipo_producto,
                        id_unidad_medida: this.uniMediSelected == null ? null : this.uniMediSelected.id_unidad_medida,
                        id_aplicacion: this.apliSelected == null ? null : this.apliSelected.id_aplicacion,
                        nombre: this.nombreSelected.replace(/\*/g,'%'),
                        medida_a: this.medidaA,
                        medida_b: this.medidaB,
                        medida_c: this.medidaC,
                        medida_d: this.medidaD,

                        //***********BUSQUEDA POR RANGOS************

                        medida_a_menor: this.medidaA_menor,
                        medida_a_mayor: this.medidaA_mayor,

                        medida_b_menor: this.medidaB_menor,
                        medida_b_mayor: this.medidaB_mayor,

                        medida_c_menor: this.medidaC_menor,
                        medida_c_mayor: this.medidaC_mayor,

                        medida_d_menor: this.medidaD_menor,
                        medida_d_mayor: this.medidaD_mayor,
                        id_tipo_moneda: this.tipoMonedaSelected == null ? null : this.tipoMonedaSelected.id_tipo_moneda,
                        precio: this.precioSelected,
                        id_cliente: this.checkPorCliente ==false  ? null :  this.clienteSelected == null ? null : this.clienteSelected.id_cliente,
                        check_cliente:this.checkPorCliente ==true?1:0

                });

                let user = this.obtenerUsuario();
                this.catalogoVentaService.buscarPaginacion(inicio, fin, tamPagina, parametros)
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




        /*******OPCION CREADA PARA CONSERVAR AL CLIENTE QUE SE TRANSMITE DE LA VENTA*********/
        habilitar_desahabilitar_cliente() {

                if (this.checkPorCliente) {
                        this.clienteSelected = this.clienteVentaSelected;
                }

                if (!this.checkPorCliente) {
                        this.clienteSelected = null;
                }

                this.buscar();
        }



        getTotalListaMantenedor() {

                let parametros = JSON.stringify({
                        id_marca:this.marcaSelected==null?null:this.marcaSelected.id_marca,
                        codigo:this.codigo,
                        codigo_barra:this.codigo_barra,
                        id_producto: this.idProductoSelected,
                        id_tipo_producto: this.tipoProSelected == null ? null : this.tipoProSelected.id_tipo_producto,
                        id_unidad_medida: this.uniMediSelected == null ? null : this.uniMediSelected.id_unidad_medida,
                        id_aplicacion: this.apliSelected == null ? null : this.apliSelected.id_aplicacion,
                        nombre: this.nombreSelected,
                        medida_a: this.medidaA,
                        medida_b: this.medidaB,
                        medida_c: this.medidaC,
                        medida_d: this.medidaD,
                        medida_e: this.medidaE,
                        medida_f: this.medidaF,

                        //***********BUSQUEDA POR RANGOS************

                        medida_a_menor: this.medidaA_menor,
                        medida_a_mayor: this.medidaA_mayor,

                        medida_b_menor: this.medidaB_menor,
                        medida_b_mayor: this.medidaB_mayor,

                        medida_c_menor: this.medidaC_menor,
                        medida_c_mayor: this.medidaC_mayor,

                        medida_d_menor: this.medidaD_menor,
                        medida_d_mayor: this.medidaD_mayor,

                        medida_e_menor: this.medidaE_menor,
                        medida_e_mayor: this.medidaE_mayor,

                        medida_f_menor: this.medidaF_menor,
                        medida_f_mayor: this.medidaF_mayor,

                        id_tipo_moneda: this.tipoMonedaSelected == null ? null : this.tipoMonedaSelected.id_tipo_moneda,
                        precio: this.precioSelected,
                        id_cliente: this.clienteSelected == null ? null : this.clienteSelected.id_cliente

                });

                this.print("parametros total: " + parametros);
                this.catalogoVentaService.getTotalParametrosMantenedores(parametros)
                        .subscribe(
                        data => {
                                this.totalLista = data;
                                this.print("total:" + data);
                        },
                        error => this.msj = <any>error);
        }



        seleccionarByPaginaMantenedor(inicio: any, fin: any, tamPagina: any) {
                let parametros = JSON.stringify({
                        id_marca:this.marcaSelected==null?null:this.marcaSelected.id_marca,
                        codigo:this.codigo,
                        codigo_barra:this.codigo_barra,
                        id_producto: this.idProductoSelected,
                        id_tipo_producto: this.tipoProSelected == null ? null : this.tipoProSelected.id_tipo_producto,
                        id_unidad_medida: this.uniMediSelected == null ? null : this.uniMediSelected.id_unidad_medida,
                        id_aplicacion: this.apliSelected == null ? null : this.apliSelected.id_aplicacion,
                        nombre: this.nombreSelected,
                        medida_a: this.medidaA,
                        medida_b: this.medidaB,
                        medida_c: this.medidaC,
                        medida_d: this.medidaD,
                        medida_e: this.medidaE,
                        medida_f: this.medidaF,


                        //***********BUSQUEDA POR RANGOS************

                        medida_a_menor: this.medidaA_menor,
                        medida_a_mayor: this.medidaA_mayor,

                        medida_b_menor: this.medidaB_menor,
                        medida_b_mayor: this.medidaB_mayor,

                        medida_c_menor: this.medidaC_menor,
                        medida_c_mayor: this.medidaC_mayor,

                        medida_d_menor: this.medidaD_menor,
                        medida_d_mayor: this.medidaD_mayor,
                        
                        medida_e_menor: this.medidaE_menor,
                        medida_e_mayor: this.medidaE_mayor,

                        medida_f_menor: this.medidaF_menor,
                        medida_f_mayor: this.medidaF_mayor,


                        id_tipo_moneda: this.tipoMonedaSelected == null ? null : this.tipoMonedaSelected.id_tipo_moneda,
                        precio: this.precioSelected,
                        id_cliente:  this.clienteSelected == null ? null : this.clienteSelected.id_cliente

                });

                let user = this.obtenerUsuario();
                this.catalogoVentaService.buscarPaginacionMantenedores(inicio, fin, tamPagina, parametros)
                        .subscribe(
                        data => {
                                this.listaProductos = data;
                                /*if(this.listaProductos.length>0){
                                        this.fin=this.listaProductos[this.listaProductos.length-1].correlativoDoc;
                                }*/
                                this.print(data);
                        },
                        error => this.msj = <any>error);
        }
      

        abrirPanelOpcionesAvanzadas() {



        }
}