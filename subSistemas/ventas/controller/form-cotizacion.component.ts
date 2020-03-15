import { Component, AfterViewInit, ViewChild, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';

import { ControllerComponent } from '../../../core/controller/controller.component';




/******************IMPORTAR SERVICIOS*************** */


import { CotizacionService } from '../service/cotizacion.service';
import { ReportePdfService } from '../../../core/service/reporte-pdf.Service';
import { TipoMonedaService } from '../../mantenedores/service/tipo-moneda.service';
import { UnidadMedidaService } from '../../mantenedores/service/unidad-medida.service';
import { StockService } from '../../mantenedores/service/stock.service';
import { FormCatalogoVentaComponent } from '../../mantenedores/controller/form-catalogo-venta.component';
import { FormFindClienteComponent } from '../../mantenedores/controller/cliente/form-find-cliente.component';
import { CatalogoVentaService } from '../../mantenedores/service/catalogo-venta.service';


declare var $: any;
@Component({
        selector: 'form-cotizacion',
        templateUrl: '../view/form-cotizacion.component.html',
        providers: [TipoMonedaService,CatalogoVentaService, CotizacionService, ReportePdfService, UnidadMedidaService,StockService]

})

export class FormCotizacionComponent extends ControllerComponent implements AfterViewInit {


        //*********OBJETOS PROPIOS DEL FORMULARIO********
        simboloMonedaSelected: any;
        idTipoMonedaSelected: any;
     
        montoTotalSelected: string = "0";
        subTotalCotiSelected:string="0";
        igvCotiSelected:string="0";
        numcuentaSelected:number;
        ciiSelected:number;
        atencionSelected: any = null;
        referenciaSelected: any = null;
        condicionPagoSelected:any=null;
        numeroSelected: any;
        fechaSelected: any;
        subTotalSelected: number = null;
        porcIgvSelected: number = null;
        igvSelected: number = null;
        beanSelected :any;
        FechaValidezSelected:any;
        FechaEntregaSelected:any;

        idCotizacionSelected: any;
        idCotizacionBusqueda:any;
        venta_listaProductos: any[];
        venta_listaProductos_original: any[];
        cotizaciones: any[];
        unidades_medida: any[];
        tiposMoneda: any[];
        tipoMonedaSelected: any;
        incluyeIgvSelected:boolean=true;
        listaProductos: any[];
        indiceLista: any = -1;
        tamanio_lista_mostrar: number = 100;
        precioDescu:any;
        tipoCambio:any[];
        lastkeydown1: number = 0;
        lastkeydown2: number = 0;
        inactivo: boolean = false;

        tamTexto: any[];
        cantidadCeldas: number = 1;
        nombresSelected: string;
        numeroDocSelected: string;
        lista_autocompletado_cliente: any[];
        unidadMedidaSelected: any;
        lista_productos_data: any[] = [];
        userList1: any[] = [];
        lista_autocompletado:any[];
        lista_clientes_data: any[] = [];
        lista_clientes_nombres_autocompletada: any[] = null;
        lista_clientes_nro_doc_autocompletada: any[] = null;
        //***********PANELES DE LOS MANTENEDORES***********
        panelEditarSelected: boolean = false;
        panelListaBeanSelected: boolean = true;
        panelRegistroSelected: boolean = false;

        @Input() tabsActivated: boolean = true;


        //****************OBTEJOS OBTENIDOS DEL FORMULARIO EMPLEADO
        empleadoSelected: any;



        //****************OBTEJOS OBTENIDOS DEL FORMULARIO CLIENTE
        clienteSelected: any;
        buttonSelectedActivatedCli: boolean = true;
        buttonEliminarActivatedCli: boolean = false;
        buttonEditarActivatedCli: boolean = false;


        //************OBJETOS PARA EL FORMULARIO CATALOGO DE VENTA********
        estiloTablaDerechaCatalogo: string = "col-md-8 quitar-borde";
        estiloBusquedaCatalogo: string = "col-md-4 quitar-borde";
        colMd2Catalogo: string = "col-md-12";
        colMd4Catalogo: string = "col-md-12";
        col1Md2Catalogo: string = "col-md-4";

        beanSelectedExterno: any;
        idProductoSelected: number;
        buttonSelectedActivatedPro: boolean = true;
        buttonEliminarActivatedPro: boolean = false;
        buttonEditarActivatedPro: boolean = false;
        panelListaCatalogoVenta: boolean = false;
        panelListaCatalogoVentaDerecha: boolean = true;
        campoOcultoVenta = true;

        precioCorrecto: boolean = true;
        clavePermiso: string;
        indObjSeleccionadoClave: any;

        @ViewChild(FormCatalogoVentaComponent,{static: true}) formCatalogoVentaComponent: FormCatalogoVentaComponent;
        @ViewChild(FormFindClienteComponent,{static: true}) formFindCliente: FormFindClienteComponent;

        /******EMITIR VALORES A OTRAS PANTALLAS *******/
        @Output() cotizacionSeleccionada = new EventEmitter();
        buttonSelectedActivated:boolean=false;
        /*******PANEL STOCK*****/
        lista_stock: any[];

        isModal:boolean=false;
        constructor(
                public http: Http,
                public router: Router,
                public cotizacionService: CotizacionService,
                public reportePdfService: ReportePdfService,
                public catalogoVentaService: CatalogoVentaService,
                public tipoMonedaService: TipoMonedaService,
                public unidadMedidaService: UnidadMedidaService,
                public stockService: StockService
        ) {
                super(router);

                this.panelEditarSelected = false;
        }




        ngOnInit() {
                //this.limpiarCampos();
               // this.venta_listaProductos = new Array();
                this.listaProductos = new Array();
                this.formCatalogoVentaComponent.isModal=true;

                this.tiposMoneda = JSON.parse(localStorage.getItem("lista_tipos_moneda"));
                this.unidades_medida = JSON.parse(localStorage.getItem("lista_unidades_medida"));
                
                if (this.tiposMoneda != null) {
                        this.tipoMonedaSelected = this.tiposMoneda[0];
                        this.simboloMonedaSelected = this.tipoMonedaSelected.simbolo;
                        this.idTipoMonedaSelected = this.tipoMonedaSelected.id_tipo_moneda;
                }

                this.formFindCliente.buttonSelectedActivated=true;
        }


        ngAfterViewInit() {
                this.tamTexto = new Array();
                if (this.verificarTokenRpta(this.rutasMantenedores.FORM_COTIZACION)) {
                        //this.obtenerTipoMoneda();
                        //this.obtenerUnidadesMedida();
                        
                    

                        if(!this.isModal){
                                this.obtenerCotizaciones();
                        }
                        
                       
                }
        }


        obtenerUnidadesMedida() {

                /* this.unidadMedidaService.getAll()
                         .subscribe(
                         data => {//this.vistas = data;
 
                                 this.unidades_medida = data;
                         },
                         error => this.msj = <any>error);* */


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
                this.idCotizacionSelected=null;
                this.beanSelected = pro;
                this.beanSelected.incluyeIgvSelected=pro.incluye_igv;
                this.cotizacionService.getDetalleCotizacionById(pro.id_cotizacion)
                .subscribe(
                data => {
                        this.listaProductos = data;

                        this.tipoMonedaSelected=this.obtenerTipoMonedaActualId(pro.id_tipo_moneda);
                        this.obtenerTipoMonedaGeneral(this.tipoMonedaSelected);
                        this.calcularIgv();
                        this.print(data);
                },
                error => this.msj = <any>error);
               
        
                this.FechaValidezSelected=pro.fecha_validez == null? null: pro.fecha_validez.substr(0, 10);
                this.FechaEntregaSelected = pro.tiempo_entrega == null? null:pro.tiempo_entrega.substr(0, 10);
                this.atencionSelected=pro.atencion;
                this.referenciaSelected=pro.referencia;
                this.condicionPagoSelected=pro.condicion_pago;
                this.numcuentaSelected=pro.NumCuenta;
                this.ciiSelected=pro.CII;
                this.clienteSelected={
                        id_cliente:pro.id_cliente,
                        nombres:pro.nombres_cliente,
                        nombre_tipo_documento:pro.nombre_tipo_documento_cliente,
                        nombre_tipo_persona:pro.nombre_tipo_persona_cliente,
                        numero_documento:pro.numero_documento_cliente,
                        apellido_materno:pro.apellido_materno_cliente,
                        apellido_paterno:pro.apellido_paterno_cliente,
                        direccion:pro.direccion_cliente,
                        telefono:pro.telefono_cliente,
                        correo:pro.correo_cliente

                }
                this.montoTotalSelected=pro.monto_total;
                //this.idTipoMonedaSelected=pro.id_tipo_moneda;
                
                this.igvSelected=pro.igv;


                this.panelEditarSelected = true;
                this.panelListaBeanSelected = false;
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

        obtenerTipoUnidadMedidaActualId(id) {
                let obj = null;
                let i;
                for (i = 0; i < this.unidades_medida.length; i++) {
                        //this.print("this.tipos_producto[i].nombre"+this.tipos_producto[i].nombre+" , nombreTipo: " +nombreTipo);
                        if (this.unidades_medida[i].id_unidad_medida == id) {
                                obj = this.unidades_medida[i];
                                break;
                        }
                }
                return obj;
        }

        regresar() {
                this.limpiarCampos();
                this.obtenerCotizaciones();
                this.panelEditarSelected = false;
                this.panelListaBeanSelected = true;
        }



        obtenerCotizaciones() {
                this.limpiarCampos();
                this.getTotalLista();
               // this.seleccionarByPagina(this.inicio, this.fin, this.tamPagina);
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

        seleccionarByPagina(inicio: any, fin: any, tamPagina: any) {
                let parametros = JSON.stringify({
                        id_cotizacion: this.idCotizacionBusqueda,
                        numero: this.numeroSelected,
                        atencion: this.atencionSelected,
                        referencia: this.referenciaSelected,
                        id_cliente: this.clienteSelected == null ? null : this.clienteSelected.id_cliente,
                        //id_empleado: this.empleadoSelected == null ? null : this.empleadoSelected.id_empleado,
                        fecha: this.fechaSelected,
                        monto_total: this.montoTotalSelected,
                        sub_total: this.subTotalSelected,
                        porc_igv: this.porcIgvSelected,
                        igv: this.igvSelected
                });

                let user = this.obtenerUsuario();
                this.cotizacionService.buscarPaginacion(inicio, fin, tamPagina, parametros)
                        .subscribe(
                        data => {
                                this.cotizaciones = data;
                                /*if(this.venta_listaProductos.length>0){
                                        this.fin=this.venta_listaProductos[this.venta_listaProductos.length-1].correlativoDoc;
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






        reportePDf() {

                let parametros = JSON.stringify({ idUsuario: 12 });
                this.reportePdfService.generarFacturaPdf(parametros)
                        .subscribe(
                        data => {
                                if (data._body.size == 0) {
                                        this.mensajeInCorrecto("DOCUMENTO DIGITALIZADO NO ENCONTRADO - HA SIDO ELIMINADO ARCHIVO ADJUNTO");
                                } else {

                                        //this.abrirPDF(data._body);
                                        this.abrirDocumentoModalId(data._body, "modalPDFCotiView");
                                        this.abrirModalPDf("modalPDFCoti");
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


        registrar() {

                if (this.tienePermisoPrintMsj(this.rutas.FORM_COTIZACION, this.rutas.BUTTON_REGISTRAR)) {
                        let user = this.obtenerUsuario();

                        let parametros = JSON.stringify({
                                atencion: this.atencionSelected,
                                referencia: this.referenciaSelected,
                                condicion_pago:this.condicionPagoSelected,
                                id_cliente: this.clienteSelected.id_cliente,
                                monto_total: this.montoTotalSelected,
                                sub_total: this.subTotalCotiSelected,
                                igv: this.igvCotiSelected, 
                                id_empleado: user.id_empleado,
                                id_tipo_moneda: this.idTipoMonedaSelected,
                                lista_productos: this.listaProductos,
                                incluye_igv:this.incluyeIgvSelected,
                                fecha_validez: this.FechaValidezSelected,
                                fecha_entrega: this.FechaEntregaSelected,
                                numcuenta:this.numcuentaSelected,
                                cii:this.ciiSelected
                        });
                        this.print("DATOS");
                        this.print(parametros);

                        this.cotizacionService.registrar(parametros)
                                .subscribe(
                                data => {
                                        this.idCotizacionSelected = data.id_cotizacion
                                        let rpta = data.rpta;
                                        this.print("rpta: " + rpta);
                                        if (rpta != null) {
                                                if (rpta == 1) {
                                                        //this.ventaRealizada=true;
                                                        this.mensajeCorrectoSinCerrar("COTIZACION REGISTRADA CORRECTAMENTE  - COD :" + this.idCotizacionSelected);
                                                        //this.limpiarCampos();
                                                } else {
                                                        this.mensajeInCorrecto("COTIZACION NO REGISTRADA");
                                                        //this.ventaRealizada=false;
                                                }
                                        }
                                        this.obtenerCotizaciones();

                                },
                                error => this.msj = <any>error
                                );
                }
        }

        buscar() {
                if (this.tienePermisoPrintMsj(this.rutas.FORM_COTIZACION, this.rutas.BUTTON_BUSCAR)) {
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
               // this.seleccionarByPagina(this.inicio, this.fin, this.tamPagina);
        }

        limpiarBusqueda() {
                this.limpiarCamposBusqueda();
                this.inicio = 1;
                this.fin = 10;
                this.tamPagina = 10;
                this.getTotalLista();
              //  this.seleccionarByPagina(this.inicio, this.fin, this.tamPagina);
        }



        eliminar(bean) {

                if (this.tienePermisoPrintMsj(this.rutas.FORM_COTIZACION, this.rutas.BUTTON_ELIMINAR)) {
                        
                        if( confirm("Realmente Desea Eliminar ?")){
                        this.cotizacionService.eliminarLogico(bean.id_cotizacion)
                                .subscribe(
                                data => {
                                        this.obtenerCotizaciones();
                                        let rpta = data;
                                        if (rpta != null) {
                                                if (rpta == 1) {
                                                        this.mensajeCorrecto("COTIZACION ELIMINADA CORRECTAMENTE");
                                                } else {
                                                        this.mensajeInCorrecto("COTIZACION NO ELIMINADO");
                                                }

                                        }
                                },
                                error => this.msj = <any>error);
                        }
                }
        }


        imprimirCotizacion(id) {

                if (this.tienePermisoPrintMsj(this.rutas.FORM_COTIZACION, this.rutas.BUTTON_IMPRIMIR)) {
                        if (id != null) {
                                this.reportePdfService.obtenerCotizacionPdf(id)
                                        .subscribe(
                                        data => {
                                                if (data._body.size == 0) {
                                                        this.mensajeInCorrecto("DOCUMENTO DIGITALIZADO NO ENCONTRADO - HA SIDO ELIMINADO ARCHIVO ADJUNTO");
                                                } else {

                                                        //this.abrirPDF(data._body);
                                                        this.abrirDocumentoModalId(data._body, "modalPDFCotiView");
                                                        this.abrirModalPDfPorc("modalPDFCoti", 90);
                                                }
                                        },
                                        error => this.msj = <any>error
                                        );
                        }
                }

        }



        editar() {


                let parametros = JSON.stringify({
                                atencion: this.atencionSelected,
                                referencia: this.referenciaSelected,
                                condicion_pago: this.condicionPagoSelected,
                                id_cliente: this.clienteSelected.id_cliente,
                                monto_total: this.montoTotalSelected,
                                sub_total: this.subTotalCotiSelected,
                                igv: this.igvCotiSelected, 
                                id_tipo_moneda: this.idTipoMonedaSelected,
                                lista_productos: this.listaProductos,
                                incluye_igv:this.incluyeIgvSelected,
                                fecha_validez:this.FechaValidezSelected,
                                tiempo_entrega:this.FechaEntregaSelected,
                                numcuenta:this.numcuentaSelected,
                                cii:this.ciiSelected
                });

                this.cotizacionService.editar(parametros,this.beanSelected.id_cotizacion)
                        .subscribe(
                        data => {
                                let rpta = data.rpta;
                                this.print("rpta: " + rpta);
                                if (rpta != null) {
                                        if (rpta) {
                                                this.idCotizacionSelected=this.beanSelected.id_cotizacion;
                                                this.mensajeCorrecto("COTIZACION MODIFICADA");
                                        } else {
                                                this.mensajeInCorrecto("COTIZACION NO MODIFICADA");
                                        }
                                }

                        },
                        error => this.msj = <any>error
                        );

        }

        limpiarCampos() {
                this.simboloMonedaSelected = null;
                this.idTipoMonedaSelected = null;
                this.montoTotalSelected = null;
                this.subTotalSelected = null;
                this.subTotalCotiSelected = null;
                this.igvCotiSelected = null;
                this.porcIgvSelected = null;
                this.igvSelected = null;
                this.atencionSelected = null;
                this.referenciaSelected = null;
                this.listaProductos = [];
                this.clienteSelected = null;
                this.empleadoSelected = null;
                this.subTotalCotiSelected="0";
                this.igvCotiSelected="0";
                this.cotizaciones = null;
                this.fechaSelected = null;
                this.numcuentaSelected = null;
                this.ciiSelected =null;
                this.condicionPagoSelected = null;
                this.FechaEntregaSelected = null;
                this.FechaValidezSelected = null;


        
        }

        limpiarCamposBusqueda() {
                this.idCotizacionBusqueda=null;
                this.simboloMonedaSelected = null;
                this.idTipoMonedaSelected = null;
                this.montoTotalSelected = null;
                this.subTotalSelected = null;
                this.subTotalCotiSelected = null;
                this.igvCotiSelected = null;
                this.porcIgvSelected = null;
                this.igvSelected = null;
                this.atencionSelected = null;
                this.referenciaSelected = null;
                this.idCotizacionSelected = null;
                this.listaProductos = [];
                this.clienteSelected = null;
                this.empleadoSelected = null;
                this.numeroSelected=null;
                this.cotizaciones = null;
                this.fechaSelected = null;
                this.condicionPagoSelected = null;
                this.FechaEntregaSelected = null;
                this.FechaValidezSelected = null;
                this.numcuentaSelected = null;
                this.ciiSelected =null;
                
        }

        elegirFila(lista, i) {
                this.marcar(lista, i);
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
                        id_cotizacion: this.idCotizacionBusqueda,
                        numero: this.numeroSelected,
                        atencion: this.atencionSelected,
                        referencia: this.referenciaSelected,
                        id_cliente: this.clienteSelected == null ? null : this.clienteSelected.id_cliente,
                        //id_empleado: this.empleadoSelected == null ? null : this.empleadoSelected.id_empleado,
                        fecha: this.fechaSelected,
                        monto_total: this.montoTotalSelected,
                        sub_total: this.subTotalSelected,
                        porc_igv: this.porcIgvSelected,
                        igv: this.igvSelected
                });

             
                this.cotizacionService.getTotalParametros(parametros)
                        .subscribe(
                        data => {
                                this.totalLista = data;
                                this.print("total:" + data);
                        },
                        error => this.msj = <any>error);
        }



        //**********ACCIONES PARAR FORMULARIO PRODUCTO********
        abrirModalCatalogoVenta() {
                this.formCatalogoVentaComponent.limpiarCampos();
                //this.cerrarPanelRegistrar();
                this.abrirModalPorc("modalCatalogoVenta", 90);
                this.formCatalogoVentaComponent.clienteSelected = this.clienteSelected;
                this.formCatalogoVentaComponent.busquedaClienteVenta = true;
                this.formCatalogoVentaComponent.checkPorCliente = false;
                this.formCatalogoVentaComponent.clienteVentaSelected = this.clienteSelected;
                this.formCatalogoVentaComponent.buscar();
                /*this.print("id_cliente_transmitido ori");
                this.print(this.clienteSelected);
                this.print("id_cliente_transmitido");
                this.print(this.formCatalogoVentaComponent.clienteSelected);*/

                //this.panelListaBeanSelectedPer = true;
        }




        //**********ACCIONES PARAR FORMULARIO Cliente********
        abrirModalCliente() {
                this.abrirModal("modalClienteCotizacion");
        }

        //**********METODO QUE OBTIENE LOS DATOS EXTERNOS 
        /*obtenerDatosExternos(datos) {
                this.beanSelectedExterno = datos.bean;
                this.idProductoSelected = this.beanSelectedExterno.id_producto;
                //this.cerrarModal("modalCatalogoVenta");
                this.print("DATOS EXTERNOS: ");
                //this.print(datos);
                this.abrirPanelRegistrar();
                this.beanSelectedExterno.precio_original= this.beanSelectedExterno.precio;
                this.beanSelectedExterno.precio= this.beanSelectedExterno.precio;
                this.beanSelectedExterno.cantidad=1;
                this.beanSelectedExterno.desc=0;
                this.beanSelectedExterno.porc_desc=0;
                this.beanSelectedExterno.id_unidad_medida=this.unidades_medida[0].id_unidad_medida;
                this.beanSelectedExterno.descripcion="";
                this.beanSelectedExterno.entrega_disponibilidad="";
                this.beanSelectedExterno.requerimiento="";

                this.print(this.beanSelectedExterno);

                if(!this.existeProducto(this.beanSelectedExterno)){
                        this.venta_listaProductos.push(this.beanSelectedExterno);
                }
                
                this.sumarTotalProductos();
                this.mensajeCorrecto("PRODUCTO AGREGADO CORRECTAMENTE");
        }*/

        obtenerDatosExternos(datos) {


                this.beanSelectedExterno = datos.bean;
                this.idProductoSelected = this.beanSelectedExterno.id_producto;
             
                this.print("DATOS EXTERNOS: ");
       
                this.abrirPanelRegistrar();
                this.beanSelectedExterno.precio_original = this.beanSelectedExterno.precio;

                if (this.beanSelectedExterno.tiene_precio_especial) {

                        this.beanSelectedExterno.precio_venta = this.beanSelectedExterno.precio_especial;
                        this.beanSelectedExterno.precio = this.beanSelectedExterno.precio_especial;
                        /*this.beanSelectedExterno.porc1= 0;
                        this.beanSelectedExterno.porc2= 0;
                        this.beanSelectedExterno.porc3= 0;
                        this.beanSelectedExterno.porc4= 0;
                        this.beanSelectedExterno.costo_incluido=0;

                        this.beanSelectedExterno.porc1_dolar= 0;
                        this.beanSelectedExterno.porc2_dolar= 0;
                        this.beanSelectedExterno.porc3_dolar= 0;
                        this.beanSelectedExterno.porc4_dolar= 0;
                        this.beanSelectedExterno.costo_incluido_dolar= 0;*/

                } else {
                        this.beanSelectedExterno.precio_venta = this.beanSelectedExterno.porc4;
                        this.beanSelectedExterno.precio = this.beanSelectedExterno.porc4;
                }

                this.beanSelectedExterno.desc = 0;
                this.beanSelectedExterno.porc_desc = 0;
                this.beanSelectedExterno.id_unidad_medida = this.unidades_medida[0].id_unidad_medida;
                this.beanSelectedExterno.tiene_permiso_exceder = false;
                this.beanSelectedExterno.tiene_permiso_muestra = false;
                this.beanSelectedExterno.tipo_moneda = this.tipoMonedaSelected;
                this.beanSelectedExterno.cantidad = 1;
                this.beanSelectedExterno.sub_total = this.beanSelectedExterno.precio_venta * this.beanSelectedExterno.cantidad;


                
                this.print(this.beanSelectedExterno);

                if (!this.existeProducto(this.beanSelectedExterno)) {
                        this.listaProductos.push(this.beanSelectedExterno);
                }

                //this.sumarTotalProductos();
                this.calcularIgv();
                this.mensajeCorrecto("PRODUCTO AGREGADO CORRECTAMENTE");


               /* this.beanSelectedExterno = datos.bean;
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
                //this.beanSelectedExterno.tipo_moneda=this.tiposMoneda[0];
                this.beanSelectedExterno.tipo_moneda = this.tipoMonedaSelected;

                this.print(this.beanSelectedExterno);

                if (!this.existeProducto(this.beanSelectedExterno)) {
                        this.venta_listaProductos.push(this.beanSelectedExterno);
                }

                this.sumarTotalProductos();
                this.mensajeCorrecto("PRODUCTO AGREGADO CORRECTAMENTE");



*/



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
                return rpta


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


        activarPermiso(indice) {
                this.indObjSeleccionadoClave = indice;
                this.venta_listaProductos[this.indObjSeleccionadoClave].tiene_permiso_exceder = false;
                this.venta_listaProductos[this.indObjSeleccionadoClave].tiene_permiso_muestra = false;

                this.abrirModalPorc("modalClavePermisoCoti", 50);



        }

        aceptarClave() {
                if (this.clavePermiso == "20259402") {
                        this.venta_listaProductos[this.indObjSeleccionadoClave].tiene_permiso_exceder = true;
                        this.venta_listaProductos[this.indObjSeleccionadoClave].tiene_permiso_muestra = true;
                } else {
                        this.mensajeInCorrecto("CLAVE ERRONEA");
                        this.venta_listaProductos[this.indObjSeleccionadoClave].tiene_permiso_exceder = false;
                        this.venta_listaProductos[this.indObjSeleccionadoClave].tiene_permiso_muestra = false;
                }
                this.cerrarModal("modalClavePermisoCoti");
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
                                if ((obj.precio_venta < obj.costo_incluido || obj.precio_venta > obj.porc4) && obj.tiene_permiso_exceder == false) {
                                        this.mensajeInCorrecto("PRECIO INCORRECTO");
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
                                if ((obj.precio_venta < obj.costo_incluido || obj.precio_venta > obj.porc4) && obj.tiene_permiso_exceder == false) {
                                        this.precioCorrecto = false;
                                        break;
                                } else {
                                        this.precioCorrecto = true;
                                }
                        }
                }

        }



        sumarTotalProductos() {
                let total = 0;
                for (let i = 0; i < this.listaProductos.length; i++) {

                        this.listaProductos[i].precio = this.listaProductos[i].precio_venta ;//- this.venta_listaProductos[i].desc;
                        this.listaProductos[i].sub_total = this.round2(this.listaProductos[i].precio * this.listaProductos[i].cantidad);
                        total = total + this.listaProductos[i].sub_total;
                        this.listaProductos[i].id_tipo_moneda = this.listaProductos[i].tipo_moneda.id_tipo_moneda;

                        if (i == 0) {
                                this.simboloMonedaSelected = this.listaProductos[i].tipo_moneda.simbolo;
                                this.idTipoMonedaSelected = this.listaProductos[i].tipo_moneda.id_tipo_moneda;
                        }
                }
                this.montoTotalSelected = "" + this.round2(total);
                this.montoTotalSelected = this.completar_ceros_derecha("" + this.montoTotalSelected, 2);
        }


        /*
        sumarTotalProductos(){
              
                let total=0;
                for(let i=0;i<this.venta_listaProductos.length;i++){
                        total=total +(this.venta_listaProductos[i].precio*this.venta_listaProductos[i].cantidad );
                        if(i==0){
                                this.simboloMonedaSelected=this.venta_listaProductos[i].nombre_simbolo_moneda;
                                this.idTipoMonedaSelected=this.venta_listaProductos[i].id_tipo_moneda;
                        }

                }
                this.montoTotalSelected=total; 
        }*/

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


        elegirProducto(producto: any, indice: any) {
                
                if (producto != null) {
                       
                        //this.precioS = producto.precio_venta;
                        this.indiceLista = -1;
                        this.agregarProductoCatalogo(producto, indice);
                        this.listaProductos[indice].lista_autocompletado = null;
                        this.listaProductos[indice].eleccion_autocompletado_selected = false;
                      

                }
        }





        obtenerClienteDatosExternos(datos) {
                this.clienteSelected = datos.bean;
                this.print("datos Cliente");
                this.print(datos);
                this.cerrarModal("modalClienteCotizacion");

        }


        eliminarCarrito(i) {
                this.print("INDICE A ELIMINAR: " + i);
                this.listaProductos.splice(i, 1)
                //this.sumarTotalProductos();
                this.calcularIgv();
        }

        verStock(obj) {

                this.abrirModal("modalStockProductoCotizacion");

                this.stockService.getDetalleById(obj.id_producto)
                        .subscribe(
                        data => {
                                this.lista_stock = data;
                        },
                        error => this.msj = <any>error);
        }

        calcularIgv(){
                this.sumarTotalProductos();
              
                if(this.incluyeIgvSelected==true){
                        this.montoTotalSelected=""+this.round2(parseFloat(this.montoTotalSelected));
                        this.subTotalCotiSelected=""+this.round2(parseFloat(this.montoTotalSelected)/1.18);
                        this.igvCotiSelected=""+this.round2(parseFloat(this.montoTotalSelected) -parseFloat(this.subTotalCotiSelected));
                       
                        this.montoTotalSelected=this.completar_ceros_derecha(this.montoTotalSelected,2);
                        this.subTotalCotiSelected=this.completar_ceros_derecha(this.subTotalCotiSelected,2);
                        this.igvCotiSelected=this.completar_ceros_derecha(this.igvCotiSelected,2);
                }
                if(this.incluyeIgvSelected==false){
                        this.subTotalCotiSelected=""+this.round2(parseFloat(this.montoTotalSelected));
                        this.montoTotalSelected=""+this.round2(parseFloat(this.subTotalCotiSelected)*1.18);
                        this.igvCotiSelected=""+this.round2(parseFloat(this.montoTotalSelected) -parseFloat(this.subTotalCotiSelected));
                        
                        this.montoTotalSelected=this.completar_ceros_derecha(this.montoTotalSelected,2);
                        this.subTotalCotiSelected=this.completar_ceros_derecha(this.subTotalCotiSelected,2);
                        this.igvCotiSelected=this.completar_ceros_derecha(this.igvCotiSelected,2);
                }

        }




        seleccionar(bean) {
                this.cotizacionSeleccionada.emit({ bean: bean });
        }


}