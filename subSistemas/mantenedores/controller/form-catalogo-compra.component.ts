import { Component, AfterViewInit, ViewChild, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';

import { ControllerComponent } from '../../../core/controller/controller.component';




/******************IMPORTAR SERVICIOS*************** */


import { UnidadMedidaService } from '../service/unidad-medida.service';
import { TipoProductoService } from '../service/tipo-producto.service';
import { CatalogoCompraService } from '../service/catalogo-compra.service';
import { TipoMonedaService } from '../service/tipo-moneda.service';
import { LocalService } from '../service/local.service';
import { AlmacenService } from '../service/almacen.service';
import { AplicacionService } from '../service/aplicacion.service';


import { Vista } from '../model/Vista';

declare var $: any;
@Component({
        selector: 'form-catalogo-compra',
        templateUrl: '../view/form-catalogo-compra.component.html',
        providers: [CatalogoCompraService, TipoProductoService, UnidadMedidaService, AplicacionService, TipoMonedaService, LocalService, AlmacenService]

})

export class FormCatalogoCompraComponent extends ControllerComponent implements AfterViewInit {

        almacenes: any[];
        locales: any[];
        tipos_producto: any[];
        unidades_medida: any[];
        aplicaciones: any[];
        tiposMoneda: any[];
        listaProductos: any[];


        idCatalogoCompraSelected: any;
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

        medidaA: number;
        medidaB: number;
        medidaC: number;
        medidaD: number;
        descripcion: string;

        medidaA_menor: number;
        medidaA_mayor: number;

        medidaB_menor: number;
        medidaB_mayor: number;

        medidaC_menor: number;
        medidaC_mayor: number;

        medidaD_menor: number;
        medidaD_mayor: number;



        //************OBJETO ELEGIDO PARA EDITAR************
        beanSelected: any;


        //***********PANELES DE LOS MANTENEDORES***********
        //panelRegistroSelected: boolean = false;
        //panelBusquedaSelected: boolean = false;
        panelEditarSelected: boolean = false;
        //panelAccionesGeneralesSelected: boolean = true;
        panelListaBeanSelected: boolean = true;
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


        constructor(
                public http: Http,
                public router: Router,
                public tipoProductoService: TipoProductoService,
                public unidadMedidaService: UnidadMedidaService,
                public catalogoCompraService: CatalogoCompraService,
                public aplicacionService: AplicacionService,
                public tipoMonedaService: TipoMonedaService,
                public localService: LocalService,
                public almacenService: AlmacenService
        ) {
                super(router);

                this.panelEditarSelected = false;
        }




        ngOnInit() {
                this.limpiarCampos();
        }


        ngAfterViewInit() {
                if (this.verificarTokenRpta(this.rutasMantenedores.FORM_CATALOGO_COMPRA)) {
                        //this.getTotalLista();
                        this.obtenerLocales();
                        this.obtenerTiposMoneda();
                        this.obtenerAplicaciones();
                        this.obtenerUnidadesMedida();
                        this.obtenerTiposProducto();
                        this.obtenerCatalogoCompra();
                        //this.seleccionarByPagina(this.inicio,this.fin,this.tamPagina);   
                }
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
                if (this.tienePermisoPrintMsj(this.rutas.FORM_CATALOGO_COMPRA, this.rutas.PANEL_EDITAR)) {
                        this.print(pro);
                        this.beanSelectedExterno = pro;
                        this.idProductoSelected = pro.id_producto;
                        this.idCatalogoCompraSelected = pro.id_catalogo_compra;
                        this.precioSelected = pro.precio;
                        this.tipoMonedaSelected = this.obtenerTipoMonedaActual(pro.nombre_tipo_moneda);
                        this.proveedorSelected = { nombre: pro.nombre_proveedor, id_proveedor: pro.id_proveedor };

                        this.panelEditarSelected = true;
                        this.panelListaBeanSelected = false;
                }
        }


        regresar() {
                this.limpiarCampos();

                this.panelEditarSelected = false;
                this.panelListaBeanSelected = true;
        }


        obtenerLocales() {

                this.localService.getAll()
                        .subscribe(
                        data => {//this.vistas = data;

                                this.locales = data;
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


        obtenerAplicaciones() {

                this.aplicacionService.getAll()
                        .subscribe(
                        data => {//this.vistas = data;

                                this.aplicaciones = data;
                        },
                        error => this.msj = <any>error);
        }

        obtenerTiposMoneda() {

                this.tipoMonedaService.getAll()
                        .subscribe(
                        data => {//this.vistas = data;

                                this.tiposMoneda = data;
                        },
                        error => this.msj = <any>error);
        }

        obtenerCatalogoCompra() {
                this.getTotalLista();
                this.limpiarCampos();
                this.seleccionarByPagina(this.inicio, this.fin, this.tamPagina);

                /*this.productoService.getAll()
                        .subscribe(
                        data => {//this.vistas = data;

                                this.listaProductos = data;
                        },
                        error => this.msj = <any>error);*/
        }


        seleccionarByPagina(inicio: any, fin: any, tamPagina: any) {
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
                        precio: this.precioSelected

                });

                let user = this.obtenerUsuario();
                this.catalogoCompraService.buscarPaginacion(inicio, fin, tamPagina, parametros)
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

                if (this.tienePermisoPrintMsj(this.rutas.FORM_CATALOGO_COMPRA, this.rutas.BUTTON_REGISTRAR)) {
                        this.print("moneda");
                        this.print(this.tipoMonedaSelected);

                        let parametros = JSON.stringify({
                                id_producto: this.beanSelectedExterno.id_producto,
                                id_tipo_moneda: this.tipoMonedaSelected.id_tipo_moneda,
                                id_proveedor: this.proveedorSelected.id_proveedor,
                                precio: this.precioSelected,
                                id_almacen: this.almacenSelected.id_almacen
                        });



                        this.catalogoCompraService.registrar(parametros)
                                .subscribe(
                                data => {

                                        let rpta = data.rpta;
                                        this.print("rpta: " + rpta);
                                        if (rpta != null) {
                                                if (rpta == 1) {
                                                        this.mensajeCorrecto("PRODUCTO REGISTRADO EN CATALOGO COMPRAS");
                                                        this.limpiarCampos();
                                                } else {
                                                        this.mensajeInCorrecto("PRODUCTO NO REGISTRADO EN CATALOGO COMPRAS");
                                                }
                                        }

                                        this.obtenerCatalogoCompra();

                                },
                                error => this.msj = <any>error
                                );
                }
        }

        buscar() {
                if (this.tienePermisoPrintMsj(this.rutas.FORM_CATALOGO_COMPRA, this.rutas.BUTTON_BUSCAR)) {
                        this.getTotalLista();
                        this.seleccionarByPagina(this.inicio, this.fin, this.tamPagina);
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


        eliminar(bean) {

                if (this.tienePermisoPrintMsj(this.rutas.FORM_CATALOGO_COMPRA, this.rutas.BUTTON_ELIMINAR)) {
                        this.catalogoCompraService.eliminarLogico(bean.id_catalogo_compra)
                                .subscribe(
                                data => {
                                        this.obtenerCatalogoCompra();
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


        editar() {

                if (this.tienePermisoPrintMsj(this.rutas.FORM_CATALOGO_COMPRA, this.rutas.BUTTON_ACTUALIZAR)) {
                        let parametros = JSON.stringify({
                                id_producto: this.beanSelectedExterno.id_producto,
                                id_tipo_moneda: this.tipoMonedaSelected.id_tipo_moneda,
                                id_proveedor: this.proveedorSelected.id_proveedor,
                                precio: this.precioSelected
                        });
                        this.catalogoCompraService.editar(parametros, this.idCatalogoCompraSelected)
                                .subscribe(
                                data => {
                                        this.obtenerCatalogoCompra();
                                        let rpta = data.rpta;
                                        this.print("rpta: " + rpta);
                                        if (rpta != null) {
                                                if (rpta) {
                                                        this.mensajeCorrecto("PRODUCTO MODIFICADO DEL CATALOGO COMPRAS");
                                                } else {
                                                        this.mensajeInCorrecto(" PRODUCTO NO MOFICADO DEL CATALOGO COMPRAS");
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


        limpiarCampos() {
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
                        id_producto: this.idProductoSelected,
                        id_tipo_producto: this.tipoProSelected == null ? null : this.tipoProSelected.id_tipo_producto,
                        id_unidad_medida: this.uniMediSelected == null ? null : this.uniMediSelected.id_unidad_medida,
                        id_aplicacion: this.apliSelected == null ? null : this.apliSelected.id_aplicacion,

                        nombre: this.nombreSelected,
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
                        medida_d_mayor: this.medidaD_mayor
                });

                this.print("parametros total: " + parametros);
                this.catalogoCompraService.getTotalParametros(parametros)
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
                //this.panelListaBeanSelectedPer = true;
        }


        //**********ACCIONES PARAR FORMULARIO PROVEEDOR********
        abrirModalProveedor() {
                //this.cerrarPanelRegistrar();
                this.abrirModal("modalProveedor");
                //this.panelListaBeanSelectedPer = true;
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


        obtenerProveedorDatosExternos(datos) {
                this.proveedorSelected = datos.bean;
                this.print(datos);
                this.cerrarModal("modalProveedor");

        }

        seleccionar(bean) {
                this.productoSeleccionado.emit({ bean: bean });
        }

}