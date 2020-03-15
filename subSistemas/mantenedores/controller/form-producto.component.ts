import { Component, AfterViewInit, ViewChild, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';

import { ControllerComponent } from '../../../core/controller/controller.component';




/******************IMPORTAR SERVICIOS*************** */


import { UnidadMedidaService } from '../service/unidad-medida.service';
import { TipoProductoService } from '../service/tipo-producto.service';
import { ProductoService } from '../service/producto.service';
import { AplicacionService } from '../service/aplicacion.service';
import { MarcaService } from '../service/marca.service';
import { StockService } from '../service/stock.service';
import { LocalService } from '../../mantenedores/service/local.service';
import { AlmacenService } from '../../mantenedores/service/almacen.service';
import {TipoCambioService} from '../../mantenedores/service/tipo-cambio.service';
import { Vista } from '../model/Vista';

declare var $: any;
@Component({
        selector: 'form-producto',
        templateUrl: '../view/form-producto.component.html',
        providers: [TipoCambioService,ProductoService, TipoProductoService, UnidadMedidaService, AplicacionService, MarcaService,StockService,LocalService,AlmacenService]

})

export class FormProductoComponent extends ControllerComponent implements AfterViewInit {

        /***********BANDERAS DE LAS COLUMNAS**********/
        activarNombre:boolean=false;
        activarMarca:boolean=false;
        activarAplicacion:boolean=false;
        activarUnidadMedida:boolean=false;
        activarTipoProducto:boolean=false;
        activarDescripcion:boolean=false;

        nombreSubrupo:string;
        tipos_producto: any[];
        unidades_medida: any[];
        aplicaciones: any[];
        marcas: any[];
        listaProductos: any[];
        listaProductosMultiple: any[];
        listaSubgrupos:any[];
        tipoProSelected: any;
        uniMediSelected: any;
        apliSelected: any;
        marcaSelected: any;
        ExchangeRate:any[];
        id_tipo_moneda:string;
        tipoMonedaSelected:any;
        id_proveedor:string;
        proveedorSelected:string;
        precio:string; 
        precioSelected:any;
        id_almacen:string;
        almacenSelected:any;
        id_cliente:string; 
        clienteSelected:any;
        priceCompra:number;
        promedio_compra:number;
        promedio_venta:number;
        id_tipo_moneda_pb:string;
        id_tipo_moneda_pr:string;
        tipoMonedaPRSelected:any;
        igv:string;
        igvSelected:any;
        tipo_cambio:string;
        tipoCambioSelected:any;
        precio_base:string;
        tipo_producto_data:any;
        tipo_producto_id:number;
        listaProducto:any[];
        promedioEditar:any;
        id_producto_busqueda:number;
        editarMasivo:boolean=false;
        tipo_subgrupo_id:number;
        nombreSelected: string;
        idProductoSelected: string;

        medidaA: number;
        medidaB: number;
        medidaC: number;
        medidaD: number;
        medidaE: number;
        medidaF: number;
        descripcion: string;
        tipo_subgrupo_data:any;
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
        subgrupoEditar:any[];


        //************OBJETO ELEGIDO PARA EDITAR************
        beanSelected: any;


        //***********PANELES DE LOS MANTENEDORES***********
        //panelRegistroSelected: boolean = false;
        //panelBusquedaSelected: boolean = false;
        panelEditarSelected: boolean = false;
        //panelAccionesGeneralesSelected: boolean = true;
        panelListaBeanSelected: boolean = true;
        busquedaMarcadaChecked: boolean = false;



        @ViewChild('myInput',{static: false})
        archivo: any;

        file: any;

        @Output() productoSeleccionado = new EventEmitter();
        @Input() buttonSelected = false;


        //VARIBLES PARA EL AUTOCOMPLETADO
        lista_autocompletado: any;
        indiceLista: any = -1;
        eleccion_autocompletado_selected: boolean = false;
        tamanio_lista_mostrar: number = 100;


        //**********DATOS PARA EL ALMACENAMIENTO DE CADA PRODUCTO
        andamioUbiSelected: any;
        filaUbiSelected: any;
        columnaUbiSelected: any;


        //***************** REGISTRO MULTIPLE
        cantidadCeldas: number = 1;
        camposOcultos: boolean = false;
        textoBotonOculto: string = "Mostrar Campos";;

        /**********Modales Stock y Movimientos**********/
        lista_stock: any[];
        listaStockDetalle:any[];
        id_producto_movimiento:any;
        fechaInicioSelected:any;
        fechaFinSelected:any;
        priceSale:number;
        priceCompraSoles:any;
        priceSaleSoles:any;
        pricemayor:number;
        pricemayorSoles:any;
        promedio_mayor:any;
        /*************PARA LA UBICACION*****************/
        lista_ubicacion: any[];
        cantidadCeldadUbi:number=1;
        locales_aux:any[];
        lista_tipo_producto : any[];
        lista_locales:any[];

        codigo:string;
        codigo_barra:string;

        isModal:boolean=false;
        constructor(
                public http: Http,
                public router: Router,
                public tipoProductoService: TipoProductoService,
                public unidadMedidaService: UnidadMedidaService,
                public productoService: ProductoService,
                public aplicacionService: AplicacionService,
                public marcaService: MarcaService,
                public stockService: StockService,
                public localService: LocalService,
                public almacenService: AlmacenService,
                public tipoCambioService:TipoCambioService
        ) {
                super(router);

                this.panelEditarSelected = false;

                       
        }




        ngOnInit() {
                this.limpiarCampos();
                this.lista_locales = new Array();
                this.marcas = JSON.parse(localStorage.getItem("lista_marcas"));
                this.aplicaciones = JSON.parse(localStorage.getItem("lista_aplicaciones"));
                this.unidades_medida = JSON.parse(localStorage.getItem("lista_unidades_medida"));
                this.tipos_producto = JSON.parse(localStorage.getItem("lista_tipos_producto"));
                this.locales_aux = JSON.parse(localStorage.getItem("lista_locales"));
                this.obtenerUltimoTC();
                let almacenSesion = JSON.parse(localStorage.getItem("almacen_start"));
                this.lista_locales.push(almacenSesion);
                this.print("ALMACENES DE PRODUCTOS")
                this.print(this.lista_locales);
        }


        ngAfterViewInit() {
                if (this.verificarTokenRpta(this.rutasMantenedores.FORM_PRODUCTO)) {

                        if(!this.isModal){
                                this.obtenerProductos();
                        }               
                        this.obtenerTiposProducto();
               
                      
                      
                       
                        this.lista_ubicacion= new Array();
                }
        }

        subgrupo(){
            
                this.productoService.obtenersubgrupo(this.apliSelected.id_aplicacion)
                        .subscribe(
                        data => {
                                if(!data){
                                        this.listaSubgrupos = null;
                                }else{
                                       this.subgrupoEditar = data; 
                                       this.listaSubgrupos = data;
                                       
                                }
                                
                        },
                        error => this.msj = <any>error);
        }

       

        iniciarProductosMultiples() {
                this.editarMasivo=false;
                this.listaProductosMultiple = new Array();
                this.agregarProductoMultiple(this.cantidadCeldas);

        }




        mostrarCampos() {
                if (this.camposOcultos == false) {
                        this.camposOcultos = true;
                        this.textoBotonOculto = "Ocultar Campos";
                } else {
                        if (this.camposOcultos == true) {
                                this.camposOcultos = false;
                                this.textoBotonOculto = "Mostrar Campos";
                        }
                }



                this.print("campos: " + this.camposOcultos);
        }


        eliminarListaMultiple(i) {
                this.print("INDICE A ELIMINAR: " + i);
                this.listaProductosMultiple.splice(i, 1)
        }


        
        eliminarUbicacion(i) {
                this.print("INDICE A ELIMINAR: " + i);
                this.lista_ubicacion.splice(i, 1)
        }

        agregarProductoMultiple(cantidad) {

                let i;
                for (i = 0; i < cantidad; i++) {
                        let p = {
                                tipoProSelected: this.tipos_producto[0],
                                uniMediSelected: this.unidades_medida[0],
                                apliSelected: this.aplicaciones[0],
                                marcaSelected: this.marcas[0],
                                nombreSelected: "",
                                medidaA: "",
                                medidaB: "",
                                medidaC: "",
                                medidaD: "",
                                medidaE: "",
                                medidaF: "",
                                descripcion: "",
                                andamioUbiSelected: "",
                                filaUbiSelected: "",
                                columnaUbiSelected: "",
                                precio_referencia: 1,
                                
                        }
                        
                        this.listaProductosMultiple.push(p);
                      
                }
        }


        agregarProductoMultipleUbi(cantidad) {

                let i;
                for (i = 0; i < cantidad; i++) {
                        

                        this.localService.getAll()
                        .subscribe(
                        data => {//this.vistas = data;
                             
                                let p = {
                                        locales: data,
                                        local:null,
                                        almacenes:null,
                                        almacen: null,
                                        andamio: "",
                                        fila: "",
                                        columna: "",
                                }

                                this.print("obj:");
                                this.print(p);
                                this.lista_ubicacion.push(p);
                                
                        },
                        error => this.msj = <any>error);

                        
                }
        }



        obtenerLocalesAux() {

                this.localService.getAll()
                        .subscribe(
                        data => {//this.vistas = data;
                                this.print(data);
                                this.locales_aux= data;
                        },
                        error => this.msj = <any>error);
        }

        obtenerUltimoTC(){
                this.tipoCambioService.getAllLatest().subscribe(
                        data=>{
                                this.ExchangeRate = data;               
                })
        }

        obtenerLocales(locales) {

                this.localService.getAll()
                        .subscribe(
                        data => {//this.vistas = data;
                                this.print(data);
                                locales = data;
                        },
                        error => this.msj = <any>error);
        }


        mostrarAlmacen(local,indice) {

                this.almacenService.getByIdLocal(local.id_local)
                        .subscribe(
                        data => {
                                this.lista_ubicacion[indice].almacenes = data;   
                        },
                        error => this.msj = <any>error);
        }

        


        mostrarAlmacenEditar(local,indice) {

                this.almacenService.getByIdLocal(local.id_local)
                        .subscribe(
                        data => {
                                this.lista_ubicacion[indice].almacenes = data;
                                let i;
                                for (i = 0; i < this.lista_ubicacion[indice].almacenes.length; i++) {
                                        if (this.lista_ubicacion[indice].almacenes[i].nombre == this.lista_ubicacion[indice].nombre_almacen) {
                                                this.lista_ubicacion[indice].almacen = this.lista_ubicacion[indice].almacenes[i];
                                                break;
                                        }
                                }

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
                
                if (this.tienePermisoPrintMsj(this.rutas.FORM_PRODUCTO, this.rutas.PANEL_EDITAR)) {
                        this.print(pro);
                        this.beanSelected = pro;
                        this.obtenerUbicacion(pro.id_producto);
                        this.obtenerGrupoandSubgrupo(pro.nombre_aplicacion,pro.nombre_tipo_producto);
                        //this.tipoProSelected = this.obtenerTipoActual(pro.nombre_tipo_producto);
                        this.uniMediSelected = this.obtenerUnidadMedidaActual(pro.nombre_unidad_medida);
                      //  this.apliSelected = this.obtenerAplicacionActual(pro.nombre_aplicacion);
                        this.marcaSelected = this.obtenerMarcaActual(pro.nombre_marca);
                        this.nombreSelected = pro.nombre;
                        this.medidaA = pro.medida_a;
                        this.medidaB = pro.medida_b;
                        this.medidaC = pro.medida_c;
                        this.medidaD = pro.medida_d;
                        this.medidaE = pro.medida_e;
                        this.medidaF = pro.medida_f;
                        this.pricemayor = pro.precio_mayor;
                        this.descripcion = pro.descripcion;
                        this.andamioUbiSelected = pro.andamio;
                        this.filaUbiSelected = pro.fila;
                        this.columnaUbiSelected = pro.columna;
                        this.codigo=pro.codigo;
                        this.codigo_barra=pro.codigo_barra;
                        this.priceSale = pro.precio_referencia;
                        this.priceCompra =pro.precio_compra;
                        this.pricemayor = pro.precio_mayor;

                        let venta =this.round2(this.ExchangeRate[0].precio_venta);          
                        let compra =this.round2(this.ExchangeRate[0].precio_compra);
                        this.promedioEditar =this.round2(venta/2+compra/2);

                        this.priceCompraSoles="S/."+this.round2(this.priceCompra*this.promedioEditar);
                        this.priceSaleSoles = "S/."+this.round2(this.priceSale*this.promedioEditar);
                        this.pricemayorSoles = "S/."+this.round2(this.pricemayor*this.promedioEditar);
                        
                        this.panelEditarSelected = true;
                        this.panelListaBeanSelected = false;
                       
                }
        }


        regresar() {
                this.limpiarCampos();

                this.panelEditarSelected = false;
                this.panelListaBeanSelected = true;
        }


        obtenerMarcas() {
                this.marcaService.getAll()
                        .subscribe(
                        data => {//this.vistas = data;

                                this.marcas = data;
                        },
                        error => this.msj = <any>error);
        }



        obtenerTiposProducto() {

                this.tipoProductoService.getAll()
                        .subscribe(
                        data => {
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


        obtenerAplicaciones() {

                this.aplicacionService.getAll()
                        .subscribe(
                        data => {
                                this.print("grupos son:");
                                this.print(data);
                                this.aplicaciones = data;
                        },
                        error => this.msj = <any>error);
        }

        obtenerProductos() {
                this.getTotalLista();
                this.limpiarCampos();
              //  this.seleccionarByPagina(this.inicio, this.fin, this.tamPagina);

              
        }

        obtenerID(){
                this.print(this.tipoProSelected.nombre);
                this.tipoProductoService.getID(this.tipoProSelected.nombre).subscribe(data=>{
                        if(!data){
                                this.tipo_producto_id = null;
                        }else{
                        this.tipo_producto_data = data;
                        this.tipo_producto_id = this.tipo_producto_data.id_tipo_producto;     
                        }
                        
                });
        }

        obtenerIDs(nombre){
               this.nombreSubrupo = nombre;
                this.tipoProductoService.getID(this.nombreSubrupo).subscribe(
                        data=>{        
                        this.tipo_subgrupo_data = data;
                        this.tipo_subgrupo_id = this.tipo_subgrupo_data.id_tipo_producto;          
                           //id = this.tipo_producto_data.id_tipo_producto;            
                });
        }


        seleccionarByPagina(inicio: any, fin: any, tamPagina: any) {
                let parametros = JSON.stringify({
                        id_producto :this.id_producto_busqueda == null ? this.idProductoSelected:this.id_producto_busqueda,

                });
                if(this.idProductoSelected !=null || this.id_producto_busqueda !=null){
                let user = this.obtenerUsuario();
                this.productoService.buscarPaginacion(inicio, fin, tamPagina, parametros)
                        .subscribe(
                        data => {


                                this.listaProductos = data;
                                this.print("datos productos");
                                this.print(data);

                                this.print("editar Masivo: "+this.editarMasivo)
                                 if(this.editarMasivo){

                                         let i;
                                         for(i=0;i<this.listaProductos.length;i++){
                                                 this.listaProductos[i].tipoProSelected=this.obtenerTipoActual(this.listaProductos[i].nombre_tipo_producto);
                                                 this.listaProductos[i].uniMediSelected = this.obtenerUnidadMedidaActual(this.listaProductos[i].nombre_unidad_medida);
                                                 this.listaProductos[i].apliSelected = this.obtenerAplicacionActual(this.listaProductos[i].nombre_aplicacion);
                                                 this.listaProductos[i].marcaSelected = this.obtenerMarcaActual(this.listaProductos[i].nombre_marca);
                                                
                                         }
                                 }
                             
                                this.print(data);
                                this.completado=false;
                        },
                        error => {
                                this.msj = <any>error
                                this.completado=false;
                        }
                        );
                }else{
                        this.completado=false;
                        this.mensajeAdvertencia("INGRESE ALGUNO CAMPO PARA BUSCAR");    
                }
                        
        }




        abrirtipocambio(){
                this.abrirModal("tipocambio");
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

        limpiarTodosProductos() {
                this.listaProductosMultiple = new Array();
        }

        filtrarProductosMultiples() {

                let productos = new Array();

                let i = 0;
                for (i = 0; i < this.listaProductosMultiple.length; i++) {
                        let pro = this.listaProductosMultiple[i];
                        let p = {
                                nombre: pro.nombreSelected,
                                id_tipo_producto: pro.tipoProSelected.id_tipo_producto,
                                id_unidad_medida: pro.uniMediSelected.id_unidad_medida,
                                id_aplicacion: pro.apliSelected.id_aplicacion,
                                id_marca: pro.marcaSelected.id_marca,
                                medida_a: pro.medidaA,
                                medida_b: pro.medidaB,
                                medida_c: pro.medidaC,
                                medida_d: pro.medidaD,
                                medida_e: pro.medidaE,
                                descripcion: pro.descripcion,
                                andamio: pro.andamioUbiSelected,
                                fila: pro.filaUbiSelected,
                                columna: pro.columnaUbiSelected,
                                host_imagen: "",
                                app_imagen: "",
                                carpeta_imagen: "",
                                nombre_imagen: ""

                        }

                        productos.push(p);
                }
                return productos;
        }

        registrarMultiple() {

                if (this.tienePermisoPrintMsj(this.rutas.FORM_PRODUCTO, this.rutas.BUTTON_REGISTRAR)) {
                        let parametros = JSON.stringify({
                                lista_productos: this.filtrarProductosMultiples()
                        });

                        this.productoService.registrarMultiple(parametros)
                                .subscribe(
                                data => {

                                        let rpta = data.rpta;
                                        this.print("rpta: " + rpta);
                                        if (rpta != null) {
                                                if (rpta == 1) {
                                                        this.mensajeCorrecto("PRODUCTOS REGISTRADOS");
                                                        this.limpiarCampos();
                                                } else {
                                                        this.mensajeInCorrecto(" PRODUCTOSNO REGISTRADOS");
                                                }
                                        }

                                        this.obtenerProductos();

                                },
                                error => this.msj = <any>error
                                );
                }
        }


        registrar() {

                if (this.tienePermisoPrintMsj(this.rutas.FORM_PRODUCTO, this.rutas.BUTTON_REGISTRAR)) {


                        if(this.nombreSelected!=null ){
                                if(this.nombreSelected!="" ){

                                let parbusqueda = JSON.stringify({
                                        nombre: this.nombreSelected,
                                });
                
                                this.productoService.buscarPaginacion(1, 10, 10,parbusqueda)
                                        .subscribe(
                                        data => {
                                                let productos = data;
                                                

                                                if(productos==null){
                                                        //********REGISTRAR PRODUCTO SI NO EXISTE******


                                                        
                                                        let creds = JSON.stringify({
                                                                id_tipo_producto: this.tipo_producto_id,
                                                                id_unidad_medida: this.uniMediSelected.id_unidad_medida,
                                                                id_aplicacion: this.apliSelected.id_aplicacion,
                                                                id_marca: this.marcaSelected.id_marca,
                                                                nombre: this.nombreSelected,
                                                                host_imagen: this.rutas.SERVIDOR + this.rutas.SEPARADOR,
                                                                app_imagen: this.rutas.NAME_APP + this.rutas.SEPARADOR,
                                                                medida_a: this.medidaA,
                                                                medida_b: this.medidaB,
                                                                medida_c: this.medidaC,
                                                                medida_d: this.medidaD,
                                                                medida_e: this.medidaE,
                                                                medida_f: this.medidaF,
                                                                descripcion: this.codigo,
                                                                andamio: this.andamioUbiSelected,
                                                                fila: this.filaUbiSelected,
                                                                columna: this.columnaUbiSelected,
                                                                lista_ubicacion:this.lista_ubicacion,
                                                                codigo:this.codigo,
                                                                codigo_barra:this.codigo_barra,
                                                                precio_compra:this.priceCompra,
                                                                precio_mayor:this.pricemayor,

                                                                id_tipo_moneda: 2,
                                                                id_proveedor: 1,
                                                                precio: this.priceSale,
                                                                id_almacen: 1,
                                                                id_cliente: null,
                                                                id_tipo_moneda_pb:2,
                                                                id_tipo_moneda_pr:2,
                                                                igv:0.18,
                                                                precio_referencia:this.priceSale,
                                                                precio_base:this.priceSale,


                                                                monto_total: 1,
                                                                sub_total: 1,
                                                                igv_calc: 1,
                                                                descuento: 1,
                                                                bruto: 1,
                                                                id_empleado: 1,
                                                                inc_igv: 1,
                                                                medio_pago: "EFECTIVO",
                                                                dias_credito:1,
                                                                id_tipo_compra: 1,
                                                                id_conta_configuracion_cuenta: null,
                                                                percepcion: 1,
                                                                retencion: 1,
                                                                detraccion: 1,
                                                                tipo_cambio:1,
                                                                id_tipo_cambio:175,
                                                                
                                                                lista_productos:this.listaProducto =[{
                                                                        id_detalle_compra: null,
                                                                        nombre: "",
                                                                        lista_autocompletado: null,
                                                                        eleccion_autocompletado_selected: false,
                                                                        lista_autocompletado_codigo: null,
                                                                        lista_autocompletado_codigo_selected: false,
                                                                        id_producto: 5,
                                                                        precio: this.priceCompra,
                                                                        precio_desc:1,
                                                                        precio_igv: 1 * 1.18,
                                                                        precio_referencia: this.priceCompra,
                                                                        cantidad: 1,
                                                                        id_tipo_moneda:2,
                                                                        id_catalogo_compra:1,
                                                                        id_unidad_medida: 1,
                                                                        nombre_tipo_producto: "",
                                                                        nombre_unidad_medida: "",
                                                                        nombre_aplicacion: "",
                                                                        medida_a: "",
                                                                        medida_b: "",
                                                                        medida_c: "",
                                                                        medida_d: "",
                                                                        descripcion: "",
                                                                        nuevo: true,
                                                                        porc_desc1: 0,
                                                                        porc_desc2: 0,
                                                                        porc_desc3: 0,
                                                                        porc_desc4: 0,
                                                                        desc1: 0,
                                                                        desc2: 0,
                                                                        desc3: 0,
                                                                        desc4: 0,
                                                                        porc_gana1: 10,
                                                                        porc_gana2: 15,
                                                                        porc_gana3: 20,
                                                                        porc_gana4: 30,
                                                                        id_unidad_medida_peso: this.unidades_medida[0].id_unidad_medida,
                                                                        peso: 1
                                                                        
                                                                }]
                                                 

                                
                                                        });
                                                        this.print(creds);
                                
                                                        if(this.lista_ubicacion!=null){
                                
                                                                if(this.lista_ubicacion.length>0){
                                                                        this.productoService.registrar(this.file, creds)
                                                                                .subscribe(
                                                                                data => {
                                                                                        this.print("datos de registro");
                                                                                        this.print(data);
                                                                                        let rpta = data.rpta;
                                                                                        this.print("rpta: " + rpta);
                                                                                        if (rpta != null) {
                                                                                                if (rpta == 1) {
                                                                                                        this.mensajeCorrecto("PRODUCTO REGISTRADO");
                                                                                                        this.limpiarCampos();
                                                                                                } else {
                                                                                                        this.mensajeInCorrecto(" PRODUCTO NO REGISTRADO");
                                                                                                }
                                                                                        }
                                
                                                                                        this.obtenerProductos();
                                
                                                                                },
                                                                                error => this.msj = <any>error
                                                                                );
                                                                }else{
                                                                        this.mensajeAdvertencia("DEBE AGREGAR UNA UBICACION AL PRODUCTO");
                                                                }
                                                        }else{
                                                                this.mensajeAdvertencia("DEBE AGREGAR UNA UBICACION AL PRODUCTO");
                                                        }


                                        
                                                }else{
                                                        this.mensajeAdvertencia("PRODUCTO YA ESTA REGISTRADO - EL CAMPO NOMBRE ES UNICO");
                                                }

                                        },
                                        error => this.msj = <any>error);
                                }else{
                                        this.mensajeAdvertencia("PRODUCTO ESTA EN BLANCO - EL CAMPO CODIGO ES UNICO");
                                }
                        }else{
                                this.mensajeAdvertencia("PRODUCTO ESTA EN BLANCO - EL CAMPO NOMBRE ES UNICO");
                        }

                }
        }

        buscar() {
                if (this.tienePermisoPrintMsj(this.rutas.FORM_PRODUCTO, this.rutas.BUTTON_BUSCAR)) {
                        this.completado=true;
                        this.inicio = 1;
                        this.fin=this.tamPagina;
                        //this.fin = 10;
                        //this.tamPagina = 10;
                        this.getTotalLista();
                        this.seleccionarByPagina(this.inicio, this.fin, this.tamPagina);
                }
        }

        ConversionCompra(){
               let venta =this.round2(this.ExchangeRate[0].precio_venta);          
               let compra =this.round2(this.ExchangeRate[0].precio_compra);
               this.promedio_compra =this.round2(venta/2+compra/2);
               this.priceCompraSoles="S/."+this.round2(this.priceCompra*this.promedio_compra);

        }

        ConversionVenta(){
                let venta =this.ExchangeRate[0].precio_venta;          
                let compra =this.ExchangeRate[0].precio_compra;
                this.promedio_venta =this.round2(venta/2+compra/2);
                this.priceSaleSoles= "S/."+this.round2(this.priceSale*this.promedio_venta);
 
         }

         ConversionMayor(){
                let venta =this.ExchangeRate[0].precio_venta;          
                let compra =this.ExchangeRate[0].precio_compra;
                this.promedio_mayor=this.round2(venta/2+compra/2);
                this.pricemayorSoles= "S/."+this.round2(this.pricemayor*this.promedio_venta);
         }

        activarEditarMasivo(valor){
                this.editarMasivo=valor;
                if(this.editarMasivo=true){
                        //this.buscar();
                }
                this.limpiarCampos();
        }


        limpiar() {
                this.limpiarCampos();
                this.inicio = 1;
                this.fin = 10;
                this.tamPagina = 10;
                this.getTotalLista();
               // this.seleccionarByPagina(this.inicio, this.fin, this.tamPagina);
        }


        eliminar(bean) {

                if (this.tienePermisoPrintMsj(this.rutas.FORM_PRODUCTO, this.rutas.BUTTON_ELIMINAR)) {
                        if( confirm("Realmente Desea Eliminar ?")){
                        this.productoService.eliminarLogico(bean.id_producto)
                                .subscribe(
                                data => {
                                        this.obtenerProductos();
                                        let rpta = data;
                                        if (rpta != null) {
                                                if (rpta == 1) {
                                                        this.mensajeCorrecto("PRODUCTO ELIMINADO CORRECTAMENTE");
                                                } else {
                                                        this.mensajeInCorrecto("PRODUCTO NO ELIMINADO");
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
                        if (this.unidades_medida[i].nombre == nombreTipo) {
                                obj = this.unidades_medida[i];
                                break;
                        }
                }
                return obj;
        }

        orderBy(nombre_columna) {

                this.print("orderBy: " + nombre_columna);
                let parametros = JSON.stringify({
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

                        andamio: this.andamioUbiSelected,
                        fila: this.filaUbiSelected,
                        columna: this.columnaUbiSelected,
                        order_by: nombre_columna

                });

                this.print("parametros: ");
                this.print(parametros);
                let user = this.obtenerUsuario();
                this.productoService.buscarPaginacion(this.inicio, this.fin, this.tamPagina, parametros)
                        .subscribe(
                        data => {

                                this.listaProductos = data;
                                this.print(data);
                        },
                        error => this.msj = <any>error);
        }


        convertir() {
                $('#tabla-productos').DataTable({
                        //dom: 'Bfrtip',
                        dom: 'lBfrtip',
                        lengthMenu: [[5, 10, 25, 50, -1], [5, 10, 25, 50, "Todos"]],
                        language: {
                                "decimal": "",
                                "emptyTable": "No existe Datos en la Tabla",
                                "info": "Mostrar _START_ de _END_ de _TOTAL_ filas",
                                "infoEmpty": "Mostrar 0 de 0 de 0 filas",
                                "infoFiltered": "(filtered from _MAX_ total entries)",
                                "infoPostFix": "",
                                "thousands": ",",
                                "lengthMenu": "Mostrar _MENU_  filas",
                                "loadingRecords": "Loading...",
                                "processing": "Processing...",
                                "search": "Busqueda:",
                                "zeroRecords": "No matching records found",
                                "paginate": {
                                        "first": "First",
                                        "last": "Last",
                                        "next": "Siguiente",
                                        "previous": "Atras"
                                },
                                "aria": {
                                        "sortAscending": ": activate to sort column ascending",
                                        "sortDescending": ": activate to sort column descending"
                                }
                        },
                        buttons: [
                                /*{
                                        extend: 'copyHtml5',
                                        text: 'Copiar',
                                        exportOptions: {
                                        columns: ':contains("Office")'
                                        }
                                },*/
                                /*'excelHtml5',
                                'csvHtml5',
                                'pdfHtml5'
                                */
                                {
                                        extend: 'excelHtml5',
                                        title: 'Reporte Notificaciones Validadas'
                                },
                                {
                                        extend: 'csvHtml5',
                                        title: 'Reporte Notificaciones Validadas'
                                }/*,
                                {
                                        extend: 'pdfHtml5',
                                        orientation: 'landscape',
                                        title: 'Reporte Notificaciones Validadas'
                                }*/


                        ]
                });
        }

        obtenerAplicacionActual(nombreTipo: string) {
                let obj = null;
                let i;
                for (i = 0; i < this.aplicaciones.length; i++) {
                         if (this.aplicaciones[i].nombre == nombreTipo) {
                                obj = this.aplicaciones[i];
                                break;
                        }
                }
                return obj;
        }


        obtenerMarcaActual(nombreTipo: string) {
                let obj = null;
                let i;
                for (i = 0; i < this.marcas.length; i++) {
                        if (this.marcas[i].nombre == nombreTipo) {
                                obj = this.marcas[i];
                                break;
                        }
                }
                return obj;
        }




        editar() {
             

                if (this.tienePermisoPrintMsj(this.rutas.FORM_PRODUCTO, this.rutas.BUTTON_ACTUALIZAR)) {
                
               
                let creds = JSON.stringify({

                        id_tipo_producto: this.tipoProSelected.id_tipo_producto,
                        id_unidad_medida: this.uniMediSelected.id_unidad_medida,
                        id_aplicacion: this.apliSelected==null?null:this.apliSelected.id_aplicacion,
                        id_marca: this.marcaSelected==null?null:this.marcaSelected.id_marca,
                        nombre: this.nombreSelected,
                        host_imagen: this.rutas.SERVIDOR + this.rutas.SEPARADOR,
                        app_imagen: this.rutas.NAME_APP + this.rutas.SEPARADOR,
                        medida_a: this.medidaA,
                        medida_b: this.medidaB,
                        medida_c: this.medidaC,
                        medida_d: this.medidaD,
                        medida_e: this.medidaE,
                        medida_f: this.medidaF,
                        descripcion: this.descripcion,
                        andamio: this.andamioUbiSelected,
                        fila: this.filaUbiSelected,
                        columna: this.columnaUbiSelected,
                        lista_ubicacion:this.lista_ubicacion,
                        codigo:this.codigo,
                        codigo_barra:this.codigo_barra,
                        precio_compra:this.priceCompra,
                        precio_mayor:this.pricemayor,

                        
                        id_tipo_moneda: 2,
                        id_proveedor: 1,
                        precio: this.priceSale,
                        id_almacen: 1,
                        id_cliente: null,
                        id_tipo_moneda_pb:2,
                        id_tipo_moneda_pr:2,
                        igv:0.18,
                        precio_referencia:this.priceSale,
                        precio_base:this.priceSale

                });
                this.productoService.editar(this.file, creds, this.beanSelected.id_producto)
                        .subscribe(
                        data => {
                                this.obtenerProductos();
                                let rpta = data.rpta;
                                this.print("rpta: " + rpta);
                                if (rpta != null) {
                                        if (rpta == 1) {
                                                if (data.rutaImagen != null) {
                                                        this.beanSelected.ruta_imagen = data.rutaImagen;
                                                }
                                                this.mensajeCorrecto("PRODUCTO MODIFICADO");
                                        } else {
                                                this.mensajeInCorrecto(" PRODUCTO NO MOFICADO");
                                        }
                                }

                        },
                        error => this.msj = <any>error
                        );
                }

        }



        actualizarMasivo(){
                if (this.tienePermisoPrintMsj(this.rutas.FORM_PRODUCTO, this.rutas.BUTTON_ACTUALIZAR)) {
                        this.completado=true;
                        let parametros = JSON.stringify({
                                lista_productos: this.listaProductos
                        });
                        this.productoService.actualizarMasivo(parametros)
                                .subscribe(
                                data => {
                                        this.obtenerProductos();
                                        let rpta = data.rpta;
                                        this.print("rpta: " + rpta);
                                        if (rpta != null) {
                                                if (rpta == 1) {
                                                        this.mensajeCorrecto("PRODUCTO(S) MODIFICADO(S)");
                                                } else {
                                                        this.mensajeInCorrecto(" PRODUCTO(S) NO MOFICADO(S)");
                                                }
                                        }
                                        this.completado=false;
        
                                },
                                error => {this.msj = <any>error
                                                this.completado=false;
                                        }
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

                        this.medidaE_menor = null;
                        this.medidaE_mayor = null;
                }

        }


        limpiarCampos() {
                this.idProductoSelected = null;
                this.codigo=null;
                this.codigo_barra=null;
                this.tipoProSelected = null;
                this.uniMediSelected = null;
                this.apliSelected = null;
                this.marcaSelected = null;

                this.nombreSelected = null;
                this.file = null;
                this.archivo = null;
                this.medidaA = null;
                this.medidaB = null;
                this.medidaC = null;
                this.medidaD = null;
                this.medidaE = null;
                this.medidaF = null;
                this.priceCompra = null;
                this.priceSale =  null;
                this.pricemayor = null;
                this.priceCompraSoles = null;
                this.priceSaleSoles = null;
                this.pricemayorSoles =  null;
                this.listaProductos =  null;
                this.descripcion = null;
                this.andamioUbiSelected = null;
                this.filaUbiSelected = null;
                this.columnaUbiSelected = null;

                this.medidaA_menor = null;
                this.medidaA_mayor = null;

                this.medidaB_menor = null;
                this.medidaB_mayor = null;

                this.medidaC_menor = null;
                this.medidaC_mayor = null;

                this.medidaD_menor = null;
                this.medidaD_mayor = null;

                this.medidaE_menor = null;
                this.medidaE_mayor = null;

                this.medidaF_menor = null;
                this.medidaF_mayor = null;

                this.indiceLista = -1;
                this.lista_autocompletado = null;
                this.eleccion_autocompletado_selected = false;
                this.id_producto_busqueda = null;
                this.priceCompra = null;
                this.priceSale = null;
                this.lista_ubicacion= new Array();
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
             
                let parametros = JSON.stringify({
                        id_marca:this.marcaSelected==null?null:this.marcaSelected.id_marca,
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

                       
                        andamio: this.andamioUbiSelected,
                        fila: this.filaUbiSelected,
                        columna: this.columnaUbiSelected,
                        codigo:this.codigo,
                        codigo_barra:this.codigo_barra,
                        descripcion:this.descripcion
                });

                this.print("parametros total: " + parametros);
                this.productoService.getTotalParametros(parametros)
                        .subscribe(
                        data => {
                                this.totalLista = data;
                                this.print("total:" + data);
                        },
                        error => this.msj = <any>error);
        }


        seleccionar(bean) {


                this.productoService.getStockByIdProducto(bean.id_producto,this.lista_locales[0].id_local)
                        .subscribe(
                        data => {
                                let total = data;

                                this.print("id_producto: " + bean.id_producto + "stock:" + data);
                                if (total > 0) {
                                        bean.stock = total;
                                } else {
                                        bean.stock = 0;
                                        this.mensajeInCorrecto("PRODUCTO NO PRESENTA STOCK - DEBE INGRESAR ALGUNA COMPRA");
                                }

                                this.productoSeleccionado.emit({ bean: bean });
                        },
                        error => this.msj = <any>error);
        }



        //**********METODO QUE OBTIENE LOS DATOS EXTERNOS 
        obtenerDatosExternos(datos) {
                this.beanSelected = datos.bean;
                //this.listaClientes.splice(0,this.listaClientes.length);
                //this.listaClientes.push(datos.bean)
                //this.listaClientes=datos.bean;
                this.cerrarModal("modalProducto");
                this.print("DATOS EXTERNOS: ");
                this.print(datos);
                this.abrirPanelRegistrar();
        }






        //***********MANEJO DEL AUTOCOMPLETADO************


        teclaKeyPressAutocomplete(event: any) {

                if (!this.eleccion_autocompletado_selected && event.keyCode == 13) {
                        this.lista_autocompletado = null;
                        this.eleccion_autocompletado_selected = false;
                        this.indiceLista = -1;
                        this.buscar();
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
                        this.id_producto_busqueda = producto.id_producto;
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


        obtenerTipoProducto(id) {



                this.productoService.getTipoProductoByIdProducto(id)
                        .subscribe(
                        data => {
                                this.lista_tipo_producto = data;
                                this.print("tipo_producto");
                                this.print(data);
                                // if(this.lista_ubicacion==null){
                                //          this.lista_ubicacion=new Array();
                                // }else{
                                //          this.print("ubicacion: ");
                                //          this.print(this.lista_ubicacion);
                                //          let i;
                                //          for (i = 0; i < this.lista_ubicacion.length; i++) {
                                //          this.lista_ubicacion[i].locales=this.locales_aux;    
                                //          this.lista_ubicacion[i].local=this.obtenerLocalActual(this.lista_ubicacion[i].nombre_local,i);              
                                //          }
                                // }
                        },
                        error => this.msj = <any>error);
        
}


        obtenerUbicacion(id) {

                        this.productoService.getUbicacionByIdProducto(id)
                                .subscribe(
                                data => {
                                        this.lista_ubicacion = data;
                                        if(this.lista_ubicacion==null){
                                                this.lista_ubicacion=new Array();
                                        }else{
                                                this.print("ubicacion: ");
                                                this.print(this.lista_ubicacion);
                                                let i;
                                                for (i = 0; i < this.lista_ubicacion.length; i++) {
                                                this.lista_ubicacion[i].locales=this.locales_aux;    
                                                this.lista_ubicacion[i].local=this.obtenerLocalActual(this.lista_ubicacion[i].nombre_local,i);              
                                                }
                                        }
                                },
                                error => this.msj = <any>error);
                
        }

        obtenerGrupoandSubgrupo(nombreTipo,nombreSubgrupo) {

                let obj = null;
                let i;
                for (i = 0; i < this.aplicaciones.length; i++) {
                         if (this.aplicaciones[i].nombre == nombreTipo) {
                                obj = this.aplicaciones[i];
                                this.apliSelected = obj;
                                this.productoService.obtenersubgrupo(obj.id_aplicacion)
                                         .subscribe(
                                        data => {
                                                if(!data){
                                                        this.listaSubgrupos = null;
                                                }else{
                                                        this.subgrupoEditar = new Array();
                                                        this.subgrupoEditar = data;
                                                      
                                                        let obj = null;
                                                        let i;
                                                        for (i = 0; i < this.subgrupoEditar.length; i++) {
                                                               if (this.subgrupoEditar[i].nombre == nombreSubgrupo) {
                                                                        obj = this.subgrupoEditar[i];
                                                                        this.print("obj");
                                                                        this.print(obj);
                                                                        this.tipoProSelected = obj;
                                                                        break;
                                                                }else{
                                                                        this.print(nombreSubgrupo);
                                                                }
                                                        }
                                                        return obj;
                                                }
                                                
                                        },
                                error => this.msj = <any>error);

                                
                                break;
                        }
                }
                return obj;

                 
                // this.productoService.getUbicacionByIdProducto(id)
                //         .subscribe(
                //         data => {
                //                 this.lista_ubicacion = data;
                //                 if(this.lista_ubicacion==null){
                //                         this.lista_ubicacion=new Array();
                //                 }else{
                //                         this.print("ubicacion: ");
                //                         this.print(this.lista_ubicacion);
                //                         let i;
                //                         for (i = 0; i < this.lista_ubicacion.length; i++) {
                //                         this.lista_ubicacion[i].locales=this.locales_aux;    
                //                         this.lista_ubicacion[i].local=this.obtenerLocalActual(this.lista_ubicacion[i].nombre_local,i);              
                //                         }
                //                 }
                //         },
                //         error => this.msj = <any>error);
        
}




        obtenerLocalActual(nombreTipo: string,indice) {
                let obj = null;
                let i;
                for (i = 0; i < this.locales_aux.length; i++) {
                           if (this.locales_aux[i].nombre == nombreTipo) {
                                obj = this.locales_aux[i];
                                this.mostrarAlmacenEditar(obj,indice);
                                break;
                        }
                }
                return obj;
        }


        verStock(obj) {


                if (this.tienePermisoPrintMsj(this.rutas.FORM_CATALOGO_VENTA, this.rutas.BUTTON_STOCK)) {

                        this.abrirModal("modalStockProductoPro");

                        this.stockService.getDetalleById(obj.id_producto)
                                .subscribe(
                                data => {
                                        this.lista_stock = data;
                                },
                                error => this.msj = <any>error);
                }
        }


        verUbicacion(obj) {

                this.abrirModal("modalUbicacionProductoPro");

                this.productoService.getUbicacionByIdProducto(obj.id_producto)
                        .subscribe(
                        data => {
                                this.lista_ubicacion = data;
                        },
                        error => this.msj = <any>error);
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
                this.abrirModal("modalStockMovimientoPro");
        }




}