

import { Component, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';

import { ControllerComponent } from '../../../core/controller/controller.component';




/******************IMPORTAR SERVICIOS*************** */


import { ProductoDefectuosoService } from '../../mantenedores/service/producto-defectuoso.service';
//import { TipoMonedaService } from '../../mantenedores/service/tipo-moneda.Service';
import { ReportePdfService } from '../../../core/service/reporte-pdf.Service';
import { TipoMonedaService } from '../../mantenedores/service/tipo-moneda.service';
import { LocalService } from '../../mantenedores/service/local.service';
import { AlmacenService } from '../../mantenedores/service/almacen.service';
import { FormComprobanteComponent } from '../../ventas/controller/form-comprobante.component';
import { FormGuiaRemisionComponent } from '../../mantenedores/controller/form-guia-remision.component';
import { UnidadMedidaService } from '../../mantenedores/service/unidad-medida.service';
import { ProductoService } from '../../mantenedores/service/producto.service';
import {FormFindProveedorComponent} from '../../mantenedores/controller/proveedor/form-find-proveedor.component';

declare var $: any;
@Component({
        selector: 'form-producto-defectuoso',
        templateUrl: '../view/form-producto-defectuoso.component.html',
        providers: [ProductoService, TipoMonedaService, ProductoDefectuosoService, ReportePdfService, LocalService, AlmacenService, UnidadMedidaService]

})

export class FormProductoDefectuosoComponent extends ControllerComponent implements AfterViewInit {
        unidades_medida: any[];
        almacenes: any[];
        almacenSelected: any;

        locales: any[];
        localSelected: any;


        tiposMoneda: any[];
        tipoMonedaSelected: any;

        listaProductos: any[];
        listaProductosOriginal: any[];
        listaProductosEliminados: any[];
        listaProductosInsertados: any[];
        listaProductosActualizados: any[];
        compraSelected: any;

        listaProductosDetalle: any[];

        compras: any[];

        simboloMonedaSelected: any;
        idTipoMonedaSelected: any;
        fechaSelected: any;
        igvSelected: any = 0.18;
        tipoCambioSelected: any = 3.35;

        almacenesUsuario:any[];
        almacenUsuarioSelected:any;
        nombreSelected: string;
        //************OBJETO ELEGIDO PARA EDITAR************
        beanSelected: any;


        //***********PANELES DE LOS MANTENEDORES***********
        panelEditarSelected: boolean = false;
        panelListaBeanSelected: boolean = true;
        busquedaMarcadaChecked: boolean = false;
        panelDetalleCompraSelected: boolean = false;


        //****************OBTEJOS OBTENIDOS DEL FORMULARIO PRODUCTO
        beanSelectedExterno: any;
        idProductoSelected: number;
        id_producto_busqueda:number;
        buttonSelectedActivatedPro: boolean = true;
        buttonEliminarActivatedPro: boolean = false;
        buttonEditarActivatedPro: boolean = false;


        //****************OBTEJOS OBTENIDOS DEL FORMULARIO CLIENTE
        proveedorSelected: any;

        buttonSelectedActivatedCli: boolean = true;
        buttonEliminarActivatedCli: boolean = false;
        buttonEditarActivatedCli: boolean = false;



        //****************OBTEJOS OBTENIDOS DEL FORMULARIO PROVEEDOR
        activatedSelectedProve: boolean = true;




        panelRegistroSelected: boolean = false;


        //montoTotalSelected: string = "0";
        //idCompraSelected: number;

        ventaRealizada: boolean = false;


        /*********DATOS FORMULARIO PRODUCTO*********/
        activatedSelectedPro: boolean = true;

        @ViewChild(FormComprobanteComponent,{static: true}) formComprobante: FormComprobanteComponent;
        @ViewChild(FormGuiaRemisionComponent,{static: true}) formGuiaRemision: FormGuiaRemisionComponent;
        @ViewChild(FormFindProveedorComponent,{static: true}) formFindProveedor: FormFindProveedorComponent;
       tabsComprobanteActivated: boolean = false;
        tabsGuiaRemisionActivated: boolean = false;


        /*************VARIBLES PARA EL AUTOCOMPLETADO***/
        lista_autocompletado: any;
        indiceLista: any = -1;
        
        eleccion_autocompletado_selected: boolean = false;
        tamanio_lista_mostrar: number = 100;


        /*********BUSQUEDA DE PRODUCTOS MULTIPLE************/
        //listaProductos: any[];
        cantidadCeldas: number = 1;

        indiceActualProveedor:number=-1;
        constructor(
                public http: Http,
                public router: Router,
                public productoDefectuosoService: ProductoDefectuosoService,
                public reportePdfService: ReportePdfService,
                public tipoMonedaService: TipoMonedaService,
                public localService: LocalService,
                public almacenService: AlmacenService,
                public unidadMedidaService: UnidadMedidaService,
                public productoService: ProductoService,
        ) {
                super(router);

                this.panelEditarSelected = false; 
                }




        ngOnInit() {
                //this.limpiarCampos();
                this.listaProductos = new Array();
                this.listaProductosEliminados = new Array();
                this.listaProductosInsertados = new Array();
                this.listaProductosActualizados = new Array();
                this.iniciarProductosMultiples();
               
        }


        ngAfterViewInit() {
                if (this.verificarTokenRpta(this.rutasMantenedores.FORM_PRODUCTO_DEFECTUOSO)) {
                        this.obtenerTipoMoneda();
                        this.obtenerLocales();
                        this.obtenerCompras();
                        this.obtenerUnidadesMedida();
                        this.almacenesUsuario=this.obtenerAlmacenes();  
                        //this.print("almacenes usuario");
                        //this.print(this.almacenesUsuario) ;   
                        this.almacenUsuarioSelected=this.almacenesUsuario!=null?this.almacenesUsuario[0]:null;
                        this.formFindProveedor.buttonSelected = true;
       
                }
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


        obtenerAlmaceneByIdLocalEditar(id) {

                this.almacenService.getByIdLocal(id)
                        .subscribe(
                        data => {//this.vistas = data;

                                this.almacenes = data;
                                this.almacenSelected = this.obtenerAlmacenActual(this.beanSelectedExterno.nombre_almacen);
                        },
                        error => this.msj = <any>error);
        }

        iniciarProductosMultiples() {
                //this.listaProductos = new Array();
                this.agregarProductoMultiple(this.cantidadCeldas);

        }


        eliminarListaMultiple(i) {
                this.print("INDICE A ELIMINAR: " + i);
                this.listaProductos.splice(i, 1)
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
                                proveedor:null,
                                nombre: "",
                                nombre_marca:"",
                                fecha: f.getFullYear() + "-" + this.completarCerosIzquierda(2, "" + (f.getMonth() + 1)) + "-" + this.completarCerosIzquierda(2, "" + f.getDate()),
                                lista_autocompletado: null,
                                eleccion_autocompletado_selected: false,
                                precio_referencia: 1,
                                unidad_medida:this.unidades_medida[0],
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


        /*obtenerUnidadesMedida() {

                this.unidadMedidaService.getAll()
                        .subscribe(
                        data => {//this.vistas = data;

                                this.unidades_medida = data;
                        },
                        error => this.msj = <any>error);
        }*/


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

                if (this.tienePermisoPrintMsj(this.rutas.FORM_PRODUCTO_DEFECTUOSO, this.rutas.PANEL_EDITAR)) {
                        this.print(pro);

                        this.beanSelectedExterno = pro;

                        this.buscarCompraEditar(pro);

                        this.panelEditarSelected = true;
                        this.panelListaBeanSelected = false;
                }
        }


        regresar() {
                this.limpiarCampos();
                //this.id_producto_busqueda = null;
                this.panelEditarSelected = false;
                this.panelListaBeanSelected = true;
                this.panelDetalleCompraSelected = false;
                $('.nav-tabs a[href="#buscarCompra"]').tab('show');
        }




        obtenerCompras() {
                //this.getTotalLista();
                this.limpiarCampos();
             //   this.seleccionarByPagina(this.inicio, this.fin, this.tamPagina);
        }

        obtenerTipoMoneda() {

                this.tipoMonedaService.getAll()
                        .subscribe(
                        data => {//this.vistas = data;

                                this.tiposMoneda = data;
                        },
                        error => this.msj = <any>error);
        }

        obtenerLocales() {

                this.localService.getAll()
                        .subscribe(
                        data => {//this.vistas = data;

                                this.locales = data;
                        },
                        error => this.msj = <any>error);
        }


  
        mostrarAlmacen() {
                this.obtenerAlmaceneByIdLocal(this.localSelected.id_local);
        }


        obtenerAlmaceneByIdLocal(id) {

                this.almacenService.getByIdLocal(id)
                        .subscribe(
                        data => {//this.vistas = data;

                                this.almacenes = data;
                        },
                        error => this.msj = <any>error);
        }



        seleccionarByPagina(inicio: any, fin: any, tamPagina: any) {
                let parametros = JSON.stringify({
                        id_proveedor: this.proveedorSelected == null ? null : this.proveedorSelected.id_proveedor,
                        id_producto :this.id_producto_busqueda,
                        fecha:this.fechaSelected
                });

                let user = this.obtenerUsuario();
                this.productoDefectuosoService.buscarPaginacion(inicio, fin, tamPagina, parametros)
                        .subscribe(
                        data => {
                                this.compras = data;
                                /*if(this.listaProductos.length>0){
                                        this.fin=this.listaProductos[this.listaProductos.length-1].correlativoDoc;
                                }*/
                                this.print(data);
                        },
                        error => this.msj = <any>error);
        }



        teclaEnter(event: any) {
                //console.log("tecla: "+event);
                //console.log("code: "+event.keyCode);
                if (event.keyCode == 13) {
                        //this.autocompletado=true;
                        this.buscar();
                        return false;
                }
        }



        mostrarImagen(pro) {
                this.beanSelected = pro;
                this.abrirModal("modalImagenProducto");

        }


        reportePDf() {

                let parametros = JSON.stringify({ idUsuario: 12 });
                this.reportePdfService.generarFacturaPdf(parametros)
                        .subscribe(
                        data => {
                                if (data._body.size == 0) {
                                        this.mensajeInCorrecto("DOCUMENTO DIGITALIZADO NO ENCONTRADO - HA SIDO ELIMINADO ARCHIVO ADJUNTO");
                                } else {

                                        //this.abrirPDF(data._body);
                                        this.abrirDocumentoModal(data._body);
                                        this.abrirModalPDf("modalPDF");
                                }

                                //let rutaFile = data.json().rutaFile;
                                //let nameFile = data.json().nameFile;

                                //if (rutaFile != null && nameFile != null) {
                                //this.abrirModal();
                                //this.abrirPDFModalFileServer(rutaFile, "mostrarPDF");
                                //setTimeout(() => { this.reporteService.eliminarFileServer(nameFile).subscribe(); }, 2000);
                                //}
                        },
                        error => this.msj = <any>error
                        );

        }




        registrarMultiple() {

                if (this.tienePermisoPrintMsj(this.rutas.FORM_PRODUCTO_DEFECTUOSO, this.rutas.BUTTON_REGISTRAR)) {
                        let user = this.obtenerUsuario();

                        let parametros = JSON.stringify({
                                id_almacen:this.almacenUsuarioSelected.id_almacen,
                                lista_productos: this.listaProductos
                        });

                        this.productoDefectuosoService.registrarMultiple(parametros)
                                .subscribe(
                                data => {
              
                                        let rpta = data.rpta;
                                        this.print("rpta: " + rpta);
                                        if (rpta != null) {
                                                if (rpta == 1) {

                                                        this.mensajeCorrectoSinCerrar("PRODUCTO DEFECTUOSOS REGISTRADOS CORRECTAMENTE ");

                                                } else {
                                                        this.mensajeInCorrecto("COMPRA NO REGISTRADA");

                                                }
                                        }

                                },
                                error => this.msj = <any>error
                                );
                }
        }

        buscar() {

                if (this.tienePermisoPrintMsj(this.rutas.FORM_PRODUCTO_DEFECTUOSO, this.rutas.BUTTON_BUSCAR)) {
                        this.getTotalLista();
                        this.seleccionarByPagina(this.inicio, this.fin, this.tamPagina);
                }
        }


        limpiar() {
                this.limpiarCampos();
                this.inicio = 1;
                this.fin = 10;
                this.tamPagina = 10;
               // this.getTotalLista();
                this.compras =  null;
             //   this.seleccionarByPagina(this.inicio, this.fin, this.tamPagina);
        }


        eliminar(bean) {
                let user = this.obtenerUsuario();

                let parametros = JSON.stringify({
                        defectuoso:bean,
                        id_empleado_eliminado:user.id_empleado
                });
        
                if (this.tienePermisoPrintMsj(this.rutas.FORM_PRODUCTO_DEFECTUOSO, this.rutas.BUTTON_ELIMINAR)) {
                        if( confirm("Realmente Desea Eliminar ?")){
                        this.productoDefectuosoService.eliminarLogico(bean.id_producto_defectuoso,parametros)
                                .subscribe(
                                data => {
                                        this.obtenerCompras();
                                        let rpta = data;
                                        if (rpta != null) {
                                                if (rpta == 1) {
                                                        this.mensajeCorrecto("PRODUCTO DEFECTUOSO ELIMINADO CORRECTAMENTE");
                                                } else {
                                                        this.mensajeInCorrecto("PRODUCTO DEFECTUOSO NO ELIMINADO");
                                                }

                                        }
                                },
                                error => this.msj = <any>error);
                        }
                }
        }





       






        limpiarCampos() {
                this.nombreSelected = null;
                this.id_producto_busqueda = null;
                this.beanSelectedExterno = null;
                this.panelRegistroSelected = false;
                this.proveedorSelected = null;
                this.listaProductos = new Array();
                this.simboloMonedaSelected = null;
                this.listaProductosEliminados = new Array();
                this.listaProductosInsertados = new Array();
                this.listaProductosActualizados = new Array();
                this.fechaSelected=null;
                this.compras = null;    

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
                                console.log(data);
                        },
                        error => this.msj = <any>error);*/
                let parametros = JSON.stringify({
                        id_proveedor: this.proveedorSelected == null ? null : this.proveedorSelected.id_proveedor,
                        id_producto :this.id_producto_busqueda,
                        fecha:this.fechaSelected
                });

                this.print("parametros total: " + parametros);
                this.productoDefectuosoService.getTotalParametros(parametros)
                        .subscribe(
                        data => {
                                this.totalLista = data;
                                this.print("total:" + data);
                        },
                        error => this.msj = <any>error);
        }



        //**********ACCIONES PARAR FORMULARIO PRODUCTO********
        abrirModalCatalogoCompra() {
                //this.cerrarPanelRegistrar();
                this.abrirModal("modalCatalogoCompra");
                //this.panelListaBeanSelectedPer = true;
        }

        abrirModalProducto() {
                //this.cerrarPanelRegistrar();
                this.abrirModal("modalProducto2");
                //this.panelListaBeanSelectedPer = true;
        }

        //**********ACCIONES PARAR FORMULARIO Cliente********
        abrirModalProveedor(indice) {
                this.indiceActualProveedor=indice;
                this.abrirModal("modalProveedor2");

        }



        //**********METODO QUE OBTIENE LOS DATOS EXTERNOS 
        obtenerDatosExternos(datos) {
                this.beanSelectedExterno = datos.bean;
                this.idProductoSelected = this.beanSelectedExterno.id_producto;
                this.cerrarModal("modalCatalogoCompra");
                this.print("DATOS EXTERNOS: ");
                this.print(datos);
                this.abrirPanelRegistrar();
                this.beanSelectedExterno.cantidad = 1;
                this.beanSelectedExterno.id_unidad_medida = this.unidades_medida[0].id_unidad_medida;

                this.listaProductos.push(this.beanSelectedExterno);
     
        }





        obtenerProveedorDatosExternos(datos) {
                //this.proveedorSelected = datos.bean;
                this.print("datos Proveedor");
                this.print(datos);
                this.print(this.listaProductos);
                this.listaProductos[this.indiceActualProveedor].proveedor=datos.bean;             
              
                this.cerrarModal("modalProveedor2");


        }
        /*obtenerClienteDatosExternos(datos) {
                this.clienteSelected=datos.bean;
                console.log("datos Cliente");
                console.log(datos);
                this.cerrarModal("modalCliente");

        }*/


        obtenerDatosProducto(datos) {
                this.beanSelectedExterno = datos.bean;
                this.idProductoSelected = this.beanSelectedExterno.id_producto;
                //this.listaClientes.splice(0,this.listaClientes.length);
                //this.listaClientes.push(datos.bean)
                //this.listaClientes=datos.bean;
                //this.cerrarModal("modalProducto2");
                this.print("DATOS EXTERNOS: ");
                this.print(datos);
                this.abrirPanelRegistrar();
                this.beanSelectedExterno.precio = 1;
                this.beanSelectedExterno.cantidad = 1;
                this.beanSelectedExterno.descripcion = "";
                this.beanSelectedExterno.proveedor = null;
                this.beanSelectedExterno.tipo_moneda= this.tiposMoneda[0];
                this.beanSelectedExterno.unidad_medida=this.unidades_medida[0];
                var f = new Date();
                this.beanSelectedExterno.fecha=f.getFullYear() + "-" + this.completarCerosIzquierda(2, "" + (f.getMonth() + 1)) + "-" + this.completarCerosIzquierda(2, "" + f.getDate()),
                               
                this.print("unidad medida: ");
                this.print(this.unidades_medida);
                this.beanSelectedExterno.id_unidad_medida = this.unidades_medida[0].id_unidad_medida;
                this.listaProductos.push(this.beanSelectedExterno);

                this.mensajeCorrecto("PRODUCTO AGREGADO CORRECTAMENTE");
        }


        eliminarCarrito(i) {
                this.print("INDICE A ELIMINAR: " + i);
                this.listaProductos.splice(i, 1)
     
        }


        eliminarCarritoEditar(i) {
                this.print("INDICE A ELIMINAR: " + i);

                if (this.listaProductos[i].id_detalle_compra != null) {
                        this.listaProductosEliminados.push(this.listaProductos[i]);
                }
                this.listaProductos.splice(i, 1)
        }



        buscarCompra(obj) {
                if (this.tienePermisoPrintMsj(this.rutas.FORM_PRODUCTO_DEFECTUOSO, this.rutas.BUTTON_VER_DETALLE)) {
                        this.panelDetalleCompraSelected = true;
                        this.productoDefectuosoService.getCompraById(obj.id_compra)
                                .subscribe(
                                data => {
                                        this.listaProductosDetalle = data.detalle_compra;
                                        this.compraSelected = data.compra;
                                        this.print(data);
                                },
                                error => this.msj = <any>error);
                }
        }


        buscarCompraEditar(obj) {
                if (this.tienePermisoPrintMsj(this.rutas.FORM_PRODUCTO_DEFECTUOSO, this.rutas.BUTTON_VER_DETALLE)) {
                        this.panelDetalleCompraSelected = true;
                        this.productoDefectuosoService.getCompraById(obj.id_compra)
                                .subscribe(
                                data => {
                                        //this.listaProductosDetalle = data.detalle_compra;
                                        this.listaProductosOriginal = data.detalle_compra;
                                        this.compraSelected = data.compra;


                                        this.proveedorSelected = {
                                                id_proveedor: this.compraSelected.id_proveedor,
                                                nombre: this.compraSelected.nombres_proveedor,
                                                representante: this.compraSelected.nombres_representante,
                                                ruc: this.compraSelected.ruc_proveedor,
                                                correo: this.compraSelected.correo_proveedor,
                                                telefono: this.compraSelected.telefono_proveedor
                                        };

                           
                                        this.tipoMonedaSelected = this.obtenerTipoMonedaActualId(this.compraSelected.id_tipo_moneda);
                                        this.localSelected = this.obtenerLocalActual(this.compraSelected.nombre_local);
                                        this.obtenerAlmaceneByIdLocalEditar(this.localSelected.id_local);
                                        this.fechaSelected = this.compraSelected.fecha_compra.substr(0, 10);
                                        this.print("fecha: " + this.fechaSelected);
                                        this.igvSelected = this.compraSelected.igv_lista_precio;
                                        this.tipoCambioSelected = this.compraSelected.tipo_cambio;
                                        this.listaProductos = data.detalle_compra;


                                        this.print(data);
                                },
                                error => this.msj = <any>error);
                }
        }

        regresarListaCompras() {
                this.panelDetalleCompraSelected = false;
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
                        $(".lista-diego22").css({top:posicion.top, left: posicion.left});


                        this.buscarAutocompletado(indice);
                }

                if (event.keyCode == 27) {
                        this.indiceLista = -1;
                        this.listaProductos[indice].lista_autocompletado = null;
                        this.listaProductos[indice].eleccion_autocompletado_selected = false;
                }
        }

        
        teclaKeyUpAutocompleteFind(event: any) {

                //  tecla flecha arriba     :  38
                //  tecla flecha abajo      :  40
                //  tecla enter             :  13
                //  tecla barra espaciadora : 32
                //  tecla escape            : 27

                if (event.keyCode != 38 && event.keyCode != 40 && event.keyCode != 13 && event.keyCode != 27) {
                        this.buscarAutocompletadoFind();
                }

                if (event.keyCode == 27) {
                        this.indiceLista = -1;
                        this.lista_autocompletado = null;
                        this.eleccion_autocompletado_selected = false;
                }
        }

        buscarAutocompletadoFind() {
                this.indiceLista = -1;
                if (this.nombreSelected != "") {
                        this.seleccionarByPaginaAutocompletadoFind(1, this.tamanio_lista_mostrar, this.tamanio_lista_mostrar);
                } else {
                        this.lista_autocompletado = null;
                        this.buscar();
                }
        }

        seleccionarByPaginaAutocompletadoFind(inicio: any, fin: any, tamPagina: any) {
                let parametros = JSON.stringify({
                        id_producto: this.idProductoSelected,
                        // id_tipo_producto: this.tipoProSelected == null ? null : this.tipoProSelected.id_tipo_producto,
                        // id_unidad_medida: this.uniMediSelected == null ? null : this.uniMediSelected.id_unidad_medida,
                        // id_aplicacion: this.apliSelected == null ? null : this.apliSelected.id_aplicacion,
                        nombre: this.nombreSelected.replace(/\*/g,'%')
                        // medida_a: this.medidaA,
                        // medida_b: this.medidaB,
                        // medida_c: this.medidaC,
                        // medida_d: this.medidaD,
                        // medida_e: this.medidaE,
                        // medida_f: this.medidaF,

                        //***********BUSQUEDA POR RANGOS************

                        // medida_a_menor: this.medidaA_menor,
                        // medida_a_mayor: this.medidaA_mayor,

                        // medida_b_menor: this.medidaB_menor,
                        // medida_b_mayor: this.medidaB_mayor,

                        // medida_c_menor: this.medidaC_menor,
                        // medida_c_mayor: this.medidaC_mayor,

                        // medida_d_menor: this.medidaD_menor,
                        // medida_d_mayor: this.medidaD_mayor,


                        // medida_e_menor: this.medidaE_menor,
                        // medida_e_mayor: this.medidaE_mayor,

                        // medida_f_menor: this.medidaF_menor,
                        // medida_f_mayor: this.medidaF_mayor,

                });

                let user = this.obtenerUsuario();
                this.productoService.buscarPaginacion(inicio, fin, tamPagina, parametros)
                        .subscribe(
                        data => {
                                this.lista_autocompletado = data;
                                this.eleccion_autocompletado_selected = true;

                                this.print(data);
                        },
                        error => this.msj = <any>error);
        }
        
        elegirProductoFind(producto: any) {
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
}