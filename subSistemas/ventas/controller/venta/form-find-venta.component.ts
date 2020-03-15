import { Component, AfterViewInit, ViewChild, OnInit, EventEmitter, Output } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';

import { ControllerComponent } from '../../../../core/controller/controller.component';




/******************IMPORTAR SERVICIOS*************** */


import { VentaService } from '../../service/venta.service';
import { ReportePdfService } from '../../../../core/service/reporte-pdf.Service';
import { ReporteExcelService } from '../../../../core/service/reporte-excel.Service';
import { LocalService } from '../../../mantenedores/service/local.service';
import { MedioPagoService } from '../../../mantenedores/service/medio-pago.service';
import { ClienteService } from '../../../mantenedores/service/cliente.service';
import { ProductoService } from '../../../mantenedores/service/producto.service';

import { FormFindClienteComponent } from 'src/app/subSistemas/mantenedores/controller/cliente/form-find-cliente.component';


declare var $: any;
@Component({
        selector: 'form-find-venta',
        templateUrl: '../../view/venta/form-find-venta.component.html',
        providers: [ProductoService,ClienteService, MedioPagoService, VentaService, ReportePdfService, ReporteExcelService,
                LocalService]

})

export class FormFindVentaComponent extends ControllerComponent implements AfterViewInit {

        //********************VER DETALLE DE LA VENTA
        panelDetalleVentaSelected: boolean = false;
        listaProductosDetalle: any[];
        ventaSelected: any;



        id_venta_busqueda: number;
        fechaInicio: any;
        fechaFin: any;
        is_pagada: boolean = false;
        is_no_pagada: boolean = false;
        //fecha_pago:any;
        //observacion:any;
        medioPagoSelected: any = null;
        mediosPago: any[];
        locales: any[];
        localSelected: any;
        id_producto_busqueda: any;
        estadoSelected: string;

        ventas:any[];
        detalleVenta:any[];
        loading:boolean = false;


        //************OBJETO ELEGIDO PARA EDITAR************
        beanSelected: any;


        //****************OBTEJOS OBTENIDOS DEL FORMULARIO CLIENTE
        clienteSelected: any;

        buttonSelectedActivatedCli: boolean = true;
        buttonEliminarActivatedCli: boolean = false;
        buttonEditarActivatedCli: boolean = false;


        /***OBJETOS DEL FORMULARIO EMPLEADO*****/
        buttonSelectedActivatedEmple: boolean = true;
        empleadoSelected: any;

        @Output() editarVentaAction = new EventEmitter();
        @ViewChild(FormFindClienteComponent,{static: true}) formFindCliente: FormFindClienteComponent;

        //VARIBLES PARA EL AUTOCOMPLETADO DE PRODUCTO
        lista_autocompletado: any;
        indiceListaProducto: any = -1;
        eleccion_autocompletado_selected: boolean = false;
        nombreProductoSelected: any;
        indiceLista: any = -1;
        tamanio_lista_mostrar: number = 100;
        lista_locales :any[];

        panelCuentasPorCobrar:boolean=false;
        buttonSelected:boolean=false;
        seleccionarTodos:boolean=false;
        @Output() editarCompraAction = new EventEmitter();
        @Output() seleccionMultipleAction= new EventEmitter();
        @Output() variasFacturasAction= new EventEmitter();

        constructor(
                public http: Http,
                public router: Router,
                public ventaService: VentaService,
                public reportePdfService: ReportePdfService,
                public reporteExcelService: ReporteExcelService,
                public localService: LocalService,
                public medioPagoService: MedioPagoService,
                public clienteService: ClienteService,
                public productoService:ProductoService
        ) {
                super(router, reportePdfService, reporteExcelService);


        }




        ngOnInit() {
                this.limpiarCampos();
                this.lista_locales =  new Array();
                this.obtenerVentas();
                //this.obtenerLocales();
                //this.obtenerMediosPago();
                this.locales = JSON.parse(localStorage.getItem("lista_locales"));
                this.mediosPago = JSON.parse(localStorage.getItem("lista_medios_pago"));
                let array_almacen = JSON.parse(localStorage.getItem("almacen_start"));
                this.lista_locales.push(array_almacen);
                this.tamPagina = 100;
                this.fin = 100;

                this.formFindCliente.buttonSelectedActivated = true;
                
        }


        ngAfterViewInit() {
                if (this.verificarTokenRpta(this.rutasMantenedores.FORM_VENTA)) {
                   
                }
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

        obtenerMediosPago() {

                this.medioPagoService.getAll()
                        .subscribe(
                                data => {//this.vistas = data;

                                        this.mediosPago = data;
                                        if (this.mediosPago != null) {
                                                if (this.mediosPago.length > 0) {
                                                        this.medioPagoSelected = this.mediosPago[0];
                                                }
                                        }
                                },
                                error => this.msj = <any>error);
        }



        obtenerVentas() {
                this.limpiarCampos();
                this.ventas = null; 
                this.getTotalLista();
                /* this.obtenerUltimasVentas();*/
                 
        }



        seleccionarByPagina(inicio: any, fin: any, tamPagina: any) {
                let parametros = JSON.stringify({
                        id_venta: this.id_venta_busqueda,
                        id_cliente: this.clienteSelected == null ? null : this.clienteSelected.id_cliente,
                        id_empleado: this.empleadoSelected != null ? this.empleadoSelected.id_empleado : null,
                        estado: this.estadoSelected,
                        fecha_inicio: this.fechaInicio,
                        fecha_fin: this.fechaFin,
                       
                        id_local: this.localSelected != null ? this.localSelected.id_local : null,
                        is_pagada: (this.is_pagada == false && this.is_no_pagada == false) || (this.is_pagada == true && this.is_no_pagada == true) ? null : this.is_pagada == true ? "1" : this.is_no_pagada == true ? "0" : null,
                        id_medio_pago: this.medioPagoSelected != null ? this.medioPagoSelected.id_medio_pago : null,
                        id_producto: this.id_producto_busqueda
                });

                let user = this.obtenerUsuario();
                let id = this.lista_locales[0].id_local;
                this.ventaService.buscarPaginacion(inicio, fin, tamPagina, parametros,id)
                        .subscribe(
                                data => {
                                        this.ventas = data;
                                        this.print(data);
                                },
                                error => this.msj = <any>error);
        }



        teclaEnter(event: any) {
              
                if (event.keyCode == 13) {
                       
                        this.buscar();
                        return false;
                }
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



        buscar() {
                if (this.tienePermisoPrintMsj(this.rutas.FORM_VENTA, this.rutas.BUTTON_BUSCAR)) {
                        this.getTotalLista();
                        this. seleccionarByPagina(this.inicio,this.fin,this.tamPagina);
                }
        }

        obtenerUltimasVentas(){
                let parametros = JSON.stringify({
                        id_venta: this.id_venta_busqueda==null ? null:this.id_venta_busqueda,
                        id_cliente: this.clienteSelected == null ? null : this.clienteSelected.id_cliente,
                        id_producto: this.id_producto_busqueda
                });
                if(this.id_venta_busqueda!=null || this.clienteSelected != null ||this.id_producto_busqueda!=null ){
                let user = this.obtenerUsuario();
                let id = this.lista_locales[0].id_local;
                this.ventaService.getUltimasVentas(parametros,id)
                        .subscribe(
                                data => {
                                        if(data == null){
                                                this.mensajeAdvertencia("ESTA VENTA YA FUE PAGADO O NO ESTA GENERADA AÚN")
                                        }else{
                                            this.ventas = data;
                                        
                                        }
                                       
                                },
                                error => this.msj = <any>error);
                }else{
                        this.mensajeAdvertencia("INGRESE ALGUNO CAMPO PARA BUSCAR");    
                                    

                }
               

        }

      

        verVentasEnStandBy(){
                this.detalleVenta = null;
                this.totalListaDetalle = null;
                this.abrirModal("VentaStandBy");
                this.getTotalListaDetalle();
                let parametros = JSON.stringify({
                       
                });
                this.loading = true;
                
                let id = this.lista_locales[0].id_local;
                this.ventaService.getUltimasVentas(parametros,id)
                        .subscribe(
                                data => {
                                        if(!data){
                                                this.mensajeAdvertencia("NO HAY VENTAS EN ESPERA");
                                        }else{
                                        this.detalleVenta = data;
                                        this.print(data) 
                                        this.loading = false;
                                        }
                                       ;
                                },
                                error => this.msj = <any>error);

        }


        limpiar() {
                this.limpiarCampos();
                this.getTotalLista();
                this.obtenerUltimasVentas();
        }

        limpiarBusqueda() {
                this.limpiarCamposBusqueda();
                this.getTotalLista();
                this.ventas =null;
                this.totalLista = null;
        }



        eliminar(bean) {

             //   if (this.tienePermisoPrintMsj(this.rutas.FORM_VENTA, this.rutas.BUTTON_ELIMINAR)) {

                        let user = this.obtenerUsuario();
                        if (confirm("Realmente Desea Eliminar ?")) {
                                this.ventaService.eliminarLogicoEmpleado(bean.id_venta, user.id_empleado)
                                        .subscribe(
                                                data => {
                                                        this.obtenerVentas();
                                                        let rpta = data;
                                                        if (rpta != null) {
                                                                if (rpta == 1) {
                                                                        this.mensajeCorrecto("VENTA ELIMINADA CORRECTAMENTE");
                                                                } else {
                                                                        this.mensajeInCorrecto("VENTA NO ELIMINADA");
                                                                }

                                                        }
                                                },
                                                error => this.msj = <any>error);
                        }
             //   }
        }


        anular(bean) {

          //      if (this.tienePermisoPrintMsj(this.rutas.FORM_VENTA, this.rutas.BUTTON_ELIMINAR)) {

                        let user = this.obtenerUsuario();
                        if (confirm("Realmente Desea Anular ?")) {
                                this.ventaService.anularLogicoEmpleado(bean.id_venta, user.id_empleado)
                                        .subscribe(
                                                data => {
                                                        this.obtenerVentas();
                                                        let rpta = data;
                                                        if (rpta != null) {
                                                                if (rpta == 1) {
                                                                        this.mensajeCorrecto("VENTA ANULADA CORRECTAMENTE");
                                                                } else {
                                                                        this.mensajeInCorrecto("VENTA NO ANULADA");
                                                                }

                                                        }
                                                },
                                                error => this.msj = <any>error);
                        }
               // }
        }







        limpiarCampos() {
                if(!this.panelCuentasPorCobrar){
                        this.medioPagoSelected=null;
                }

                this.id_venta_busqueda = null;
                //this.fecha_pago = null;
                this.is_pagada = null;
                this.clienteSelected = null;
                this.estadoSelected = "";
                this.fechaFin = null;
                this.fechaInicio = null;
                this.localSelected = null;
                this.empleadoSelected = null;
                this.id_producto_busqueda = null;

                this.medioPagoSelected = null;
        }

        limpiarCamposBusqueda() {
                if(!this.panelCuentasPorCobrar){
                        this.medioPagoSelected=null;
                }
              
                this.id_venta_busqueda = null;
              
                //this.fecha_pago = null;
                this.is_pagada = null;
                this.is_no_pagada = null;
                this.clienteSelected = null;
                this.estadoSelected = "";
                this.fechaFin = null;
                this.fechaInicio = null;
                this.localSelected = null;
                this.empleadoSelected = null;
                this.nombreProductoSelected=null;
                this.id_producto_busqueda =null;
        }

        elegirFila(lista, i) {
                this.marcar(lista, i);
        }





        getTotalLista() {

                let parametros = JSON.stringify({
                        id_venta: this.id_venta_busqueda,
                        id_cliente: this.clienteSelected == null ? null : this.clienteSelected.id_cliente,
                        estado: this.estadoSelected,
                        fecha_inicio: this.fechaInicio,
                        fecha_fin: this.fechaFin,
                        id_empleado: this.empleadoSelected != null ? this.empleadoSelected.id_empleado : null,
                        id_local: this.localSelected != null ? this.localSelected.id_local : null,
                        //is_pagada:this.is_pagada!=null?this.is_pagada ==true?"1":"0":null,
                        is_pagada: (this.is_pagada == false && this.is_no_pagada == false) || (this.is_pagada == true && this.is_no_pagada == true) ? null : this.is_pagada == true ? "1" : this.is_no_pagada == true ? "0" : null,
                        id_medio_pago: this.medioPagoSelected != null ? this.medioPagoSelected.id_medio_pago : null,
                        id_producto: this.id_producto_busqueda
                });

                this.ventaService.getTotalParametros(parametros)
                        .subscribe(
                                data => {
                                        this.totalLista = data;
                                        this.print("total:" + data);
                                },
                                error => this.msj = <any>error);
        }

        getTotalListaDetalle() {

                let parametros = JSON.stringify({
                        id_venta: this.id_venta_busqueda,
                        id_cliente: this.clienteSelected == null ? null : this.clienteSelected.id_cliente,
                        estado: this.estadoSelected,
                        fecha_inicio: this.fechaInicio,
                        fecha_fin: this.fechaFin,
                        id_empleado: this.empleadoSelected != null ? this.empleadoSelected.id_empleado : null,
                        id_local: this.localSelected != null ? this.localSelected.id_local : null,
                        //is_pagada:this.is_pagada!=null?this.is_pagada ==true?"1":"0":null,
                        is_pagada: (this.is_pagada == false && this.is_no_pagada == false) || (this.is_pagada == true && this.is_no_pagada == true) ? null : this.is_pagada == true ? "1" : this.is_no_pagada == true ? "0" : null,
                        id_medio_pago: this.medioPagoSelected != null ? this.medioPagoSelected.id_medio_pago : null,
                        id_producto: this.id_producto_busqueda
                });

                this.print("parametros total: " + parametros);
                this.ventaService.getTotalParametros(parametros)
                        .subscribe(
                                data => {
                                        this.totalListaDetalle = data;
                                        this.print("total:" + data);
                                },
                                error => this.msj = <any>error);
        }

        



        //**********ACCIONES PARAR FORMULARIO Cliente********
        abrirModalCliente() {
                if(this.formFindCliente.listaClientes==null){
                        this.formFindCliente.obtenerClientes();
                }

                this.abrirModal("modalCliente");
        }

        obtenerClienteDatosExternos(datos) {
                this.clienteSelected = datos.bean;
                this.print("datos Cliente");
                this.print(datos);
                this.cerrarModal("modalCliente");

        }



        buscarVenta(obj) {
              //  if (this.tienePermisoPrintMsj(this.rutas.FORM_VENTA, this.rutas.BUTTON_VER_DETALLE)) {
                        this.panelDetalleVentaSelected = false;
                 this.abrirModal("modalDetalleVenta");
                        this.ventaService.getVentaById(obj.id_venta)
                                .subscribe(
                                        data => {
                                                this.listaProductosDetalle = data.detalle_venta;
                                                this.ventaSelected = data.venta;
                                                
                                        },
                                        error => this.msj = <any>error);
             //   }
        }

        regresarListaVentas() {
                this.panelDetalleVentaSelected = false;
                //this.panelEditarVentaSelected = false;
        }




        /*****************EXPORTACION DE EXCEL Y PDF DETALLE**************/
        exportarExcelDetalle() {
                this.completado = true;
                let ventasAux = this.ventas;
                this.eliminarColumna(ventasAux,
                        ["is_editable", "nombre_tipo_persona_cliente", "nombres_empleado", "apellido_paterno_empleado", "apellido_materno_empleado", "nombre_empleado_eliminado", "correo_cliente", "telefono_cliente", "direccion_cliente", "numero_documento_cliente", "nombre_tipo_documento_cliente", "apellido_materno_cliente", "apellido_paterno_cliente", "porc_igv", "nombre_tipo_moneda", "estado", "id_comprobante", "nro_comprobante", "id_cliente", "id_empleado", "id_tipo_moneda", "lista_productos", "id_almacen", "nro_documento", ""]);

                let parametros = JSON.stringify({
                        datos: ventasAux,
                        titulo: 'VENTAS',
                        subtitulo: 'VENTAS EN BASE DE DATOS'
                });

                this.exportarExcelFinal(parametros, "reporte Ventas - generado el ");

        }


        exportarPdfDetalle() {
                this.completado = true;
                //this.eliminarColumna(this.listaClientes, ["estado_cliente", "fecha_baja", "observacion", "id_tipo_persona", "id_tipo_documento", "estado"]);
                let ventasAux = this.ventas;

                this.eliminarColumna(ventasAux,
                        ["is_editable", "nombre_tipo_persona_cliente", "nombres_empleado", "apellido_paterno_empleado", "apellido_materno_empleado", "nombre_empleado_eliminado", "correo_cliente", "telefono_cliente", "direccion_cliente", "numero_documento_cliente", "nombre_tipo_documento_cliente", "apellido_materno_cliente", "apellido_paterno_cliente", "porc_igv", "nombre_tipo_moneda", "estado", "id_comprobante", "nro_comprobante", "id_cliente", "id_empleado", "id_tipo_moneda", "lista_productos", "id_almacen", "nro_documento", ""]);

                let parametros = JSON.stringify({
                        datos: ventasAux,
                        titulo: 'VENTAS',
                        subtitulo: 'VENTAS EN BASE DE DATOS'
                });

                this.exportarPdfFinalIdModal(parametros, "modalPDFVenta", "mostrarVentaPDF");



        }


        //**********ACCIONES PARAR FORMULARIO EMPLEADO********
        abrirModalEmpleado() {
                this.abrirModal("modalEmpleado");
        }

        obtenerEmpleadoDatosExternos(datos) {
                this.empleadoSelected = datos.bean;
                this.print("datos Empleado");
                this.print(datos);
                this.cerrarModal("modalEmpleado");

        }



        abrirPanelEditarVenta(bean) {
            //    if (this.tienePermisoPrintMsj(this.rutas.FORM_VENTA, this.rutas.PANEL_EDITAR)) {
                        this.editarVentaAction.emit({ bean: bean });
              //  }
        }


        //***********MANEJO DEL AUTOCOMPLETADO PRODUCTO************


        teclaKeyPressAutocompleteProducto(event: any) {

                if (!this.eleccion_autocompletado_selected && event.keyCode == 13) {
                        this.lista_autocompletado = null;
                        this.eleccion_autocompletado_selected = false;
                        this.indiceListaProducto = -1;
                        //this.buscarProducto();
                        this.seleccionarByPaginaAutocompletadoProducto(1, 100, this.tamanio_lista_mostrar);
                        return false;
                }

                if (this.eleccion_autocompletado_selected && event.keyCode == 13) {
                        this.elegirProductoBusqueda(this.lista_autocompletado[this.indiceListaProducto]);
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
                                        //$(lista[this.indiceListaProducto]).addClass( "seleccionado" );
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
                        this.indiceLista = -1;
                        this.lista_autocompletado = null;
                        this.eleccion_autocompletado_selected = false;
                }
        }



        elegirProductoBusqueda(producto: any) {
                if (producto != null) {
                        this.print(producto);
                        this.indiceLista = -1;
                        this.nombreProductoSelected = producto.nombre;
                        this.id_producto_busqueda = producto.id_producto;
                        this.lista_autocompletado = null;
                        this.eleccion_autocompletado_selected = false;
                }
                this.buscar();

        }

        buscarAutocompletadoProducto() {
                this.indiceListaProducto = -1;
                if (this.nombreProductoSelected != "") {
                        this.seleccionarByPaginaAutocompletadoProducto(1, 100, this.tamanio_lista_mostrar);
                } else {
                        this.lista_autocompletado = null;
                        //this.buscarProducto();
                        this.seleccionarByPaginaAutocompletadoProducto(1, 100, this.tamanio_lista_mostrar);
                }
        }

        seleccionarByPaginaAutocompletadoProducto(inicio: any, fin: any, tamPagina: any) {
                let parametros = JSON.stringify({
                        nombre: this.nombreProductoSelected.replace(/\*/g, '%'),
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

        buscarParametros(parametros) {
                this.getTotalListaParametros(parametros);
                this.seleccionarByPaginaParametros(this.inicio, this.fin, this.tamPagina,parametros);
        }

        getTotalListaParametros(parametros) {

                this.print("parametros total: " + parametros);
               
                this.ventaService.getTotalParametros(parametros)
                        .subscribe(
                                data => {
                                        this.totalLista = data;
                                        this.print("total:" + data);
                                },
                                error => this.msj = <any>error);
        }
        
        seleccionarByPaginaParametros(inicio: any, fin: any, tamPagina: any,parametros) {
 
                let user = this.obtenerUsuario();
                let id = this.lista_locales[0].id_local;
                this.ventaService.buscarPaginacion(inicio, fin, tamPagina, parametros,id)
                        .subscribe(
                                data => {
                                        this.ventas = data;
                                        this.print(data);
                                },
                                error => this.msj = <any>error);
        }


        
        obtenerMediosPagoByNombre(nombre) {
                
                this.panelCuentasPorCobrar=true;
                let parametros = JSON.stringify({
                        nombre: nombre,
                       
                });
                this.medioPagoService.buscarPaginacion(1, 100, 100, parametros)
                        .subscribe(
                        data => {
                                this.mediosPago = data;
                                if (this.mediosPago != null) {
                                        this.medioPagoSelected = this.mediosPago[0];
                                }
                        },
                        error => this.msj = <any>error);
        }



        seleccionarMultiple(){
                let ventasSeleccionadas= new Array();
                if(this.ventas!=null){
                        var tam=this.ventas.length;
                        if(tam>0)
                        {
                                for(let i=0;i<tam;i++){
                                        if(this.ventas[i].selected){
                                                ventasSeleccionadas.push(this.ventas[i]);
                                        }   
                                }
                        }
                }

                this.seleccionMultipleAction.emit({ bean: ventasSeleccionadas });
        }


        cajearVariasFacturas(){
                let ventasSeleccionadas= new Array();
                if(this.ventas!=null){
                        var tam=this.ventas.length;
                        if(tam>0)
                        {
                                for(let i=0;i<tam;i++){
                                        if(this.ventas[i].selected){
                                                ventasSeleccionadas.push(this.ventas[i]);
                                        }   
                                }
                        }
                }

                this.variasFacturasAction.emit({ bean: ventasSeleccionadas });
        }

}