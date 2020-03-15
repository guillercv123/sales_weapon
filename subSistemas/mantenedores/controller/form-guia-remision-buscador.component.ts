import { Component, AfterViewInit, ViewChild, OnInit, Input,Output,EventEmitter } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';

import { ControllerComponent } from '../../../core/controller/controller.component';




/******************IMPORTAR SERVICIOS*************** */


import { GuiaRemisionService } from '../service/guia-remision.service';
import { VentaService } from '../../ventas/service/venta.service';
import { CompraService } from '../../compras/service/compra.service';
import { ReportePdfService } from '../../../core/service/reporte-pdf.Service';
import { CategoriaComprobanteService } from '../../mantenedores/service/categoria-comprobante.service';
import { TipoComprobanteService } from '../../mantenedores/service/tipo-comprobante.service';
import { SerieComprobanteService } from '../../mantenedores/service/serie-comprobante.service';
import { TipoMonedaService } from '../../mantenedores/service/tipo-moneda.service';
import { UnidadMedidaService } from '../../mantenedores/service/unidad-medida.service';

declare var $: any;
@Component({
        selector: 'form-guia-remision-buscador',
        templateUrl: '../view/form-guia-remision-buscador.component.html',
        providers: [GuiaRemisionService, UnidadMedidaService,ReportePdfService, VentaService, CompraService, CategoriaComprobanteService, TipoComprobanteService, SerieComprobanteService, TipoMonedaService]

})

export class FormGuiaRemisionBuscadorComponent extends ControllerComponent implements AfterViewInit {

        @Output() dataExterna = new EventEmitter();

        unidades_medida: any[];
        categoriasComprobante: any[];
        tiposComprobante: any[];
        seriesComprobante: any[];
        mediosPago: any[];

        categoriaComprobanteSelected: any = null;
        tipoComprobanteSelected: any = null;
        serieComprobanteSelected: any = null;
        medioPagoSelected: any = null;

        nroGuiaSelected: number = null;

        listaProductos: any[] = null;

        listaComprobantes: any[];

        tieneComprobante: boolean = false;

        tiposMoneda: any[];
        tipoMonedaSelected: any;

        numeroCorrelativoSiguiente:number;

        //************OBJETO ELEGIDO PARA EDITAR************
        //beanSelected: any;


        //***********PANELES DE LOS MANTENEDORES***********
        panelEditarSelected: boolean = false;
        panelListaBeanSelected: boolean = true;
        //busquedaMarcadaChecked: boolean = false;




        //****************OBTEJOS OBTENIDOS DEL FORMULARIO PRODUCTO
        //beanSelectedExterno: any;
        //idProductoSelected: number;

        //buttonSelectedActivatedPro: boolean = true;
        //buttonEliminarActivatedPro: boolean = false;
        //buttonEditarActivatedPro: boolean = false;


        //****************OBTEJOS OBTENIDOS DEL FORMULARIO CLIENTE
        ventaSelected: any;
        compraSelected: any;
        guiasSelected: any;
        //buttonSelectedActivatedCli: boolean = true;
        //buttonEliminarActivatedCli: boolean = false;
        //buttonEditarActivatedCli: boolean = false;



        //****************OBTEJOS OBTENIDOS DEL FORMULARIO PROVEEDOR
        //activatedSelectedProve: boolean = true;




        panelRegistroSelected: boolean = false;

        comprobanteCompraActivated: boolean = false;
        @Input() tabsActivated: boolean = true;

        idCompraVentaSelected: number;

        /****MODAL CLIENTE*******/
        buttonSelectedActivatedCli: boolean = true;
        buttonEliminarActivatedCli: boolean = false;
        buttonEditarActivatedCli: boolean = false;


        /**********PROPIEDADES DE COMPROBANTE************/
        beanSelected: any;

        idGuiaRemisionSelected: any;
        serieSelected: any=null;
        numeroSelected: any=null;
        rucEmisorSelected: any=null;
        rucDestinatarioSelected: any=null;
        puntoPartidaSelected: any=null;
        puntoLlegadaSelected: any=null;
        fechaEmisionSelected: any=null;
        fechaInicioTrasladoSelected: any=null;

        fechaEmisionBuscarSelected: any=null;
        fechaInicioTrasladoBuscarSelected: any=null;

        costoMinimoSelected: any=null;
        idPersonaDestinatarioSelected: any=null;
        idPersonaEmpresaTransporteSelected: any=null;
        personaEmpresaSelected: any=null;
        personaDestinatarioSelected: any=null;

        idComprobanteSelected: any=null;
        idConductorVehiculoSelected: any=null;
        conductorSelected: any=null;

        nombreConductorSelected: string;
        nombreEmpresaTransporte: string;
        nombrePersonaDestinatario: string;
        motivoTrasladoSelected: any=null;
        nroOrdenSelected: any=null;
        referenciaClienteSelected: any=null;
        referenciaOrigenSelected: any=null;
        condicionesEntregaSelected: any=null;
        tipoGuia: any=null;


        //*************OBJETOS DEL FORMULARIO PERSONA**************
        activatedSelectedPer: boolean = true;
        activatedSelectedCondu: boolean = true;
        //beanSelectedExterno: any;


        busquedaDestinatarioActivated: boolean = false;
        constructor(
                public http: Http,
                public router: Router,
                public guiaRemisionService: GuiaRemisionService,
                public reportePdfService: ReportePdfService,
                public ventaService: VentaService,
                public compraService: CompraService,
                public categoriaComprobanteService: CategoriaComprobanteService,
                public tipoComprobanteService: TipoComprobanteService,
                public serieComprobanteService: SerieComprobanteService,
                public unidadMedidaService: UnidadMedidaService,
                public tipoMonedaService: TipoMonedaService
        ) {
                super(router);

                this.panelEditarSelected = false;
        }




        ngOnInit() {
                //this.limpiarCampos();
                //this.listaProductos = new Array();
               
                
        }


        ngAfterViewInit() {
                if (this.verificarTokenRpta(this.rutasMantenedores.FORM_GUIA_REMISION)) {
                        this.obtenerUnidadesMedida();
                        //this.getTotalLista();
                        //this.obtenerCatalogoVenta();
                        //this.seleccionarByPagina(this.inicio,this.fin,this.tamPagina);   
                        this.obtenerCategoriasComprobante();
                        this.obtenerTipoMoneda();
                        //this.obtenerMediosPago();
                        this.obtenerGuiasRemision();

                        var f = new Date();
                        this.fechaEmisionSelected = f.getFullYear() + "-" + this.completarCerosIzquierda(2, "" + (f.getMonth() + 1)) + "-" + this.completarCerosIzquierda(2, "" + f.getDate());
                        this.fechaInicioTrasladoSelected = this.fechaEmisionSelected;

                }
        }

        obtenerUnidadesMedida() {

                let parametros = JSON.stringify({
                        id_unidad_medida: null,
                        nombre: null,
                        orden_presentacion: null,
                        observacion: null,
                        simbolo: null,
                        is_para_comprobante: 2
                });

                this.unidadMedidaService.buscarPaginacion(1, 1000, 1000, parametros)
                        .subscribe(
                        data => {//this.vistas = data;

                                this.unidades_medida = data;
                                if(this.unidades_medida==null){
                                        this.mensajeInCorrecto("Unidades de Medida tipo 2 VACIAS");
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


                this.beanSelected = pro;

                /*this.id_comprobante= pro.id_comprobante; 
                this.tipo_comprobante= pro.tipo_comprobante; 
                this.serie= pro.serie; 
                this.numero= pro.numero;
                this.fecha= pro.fecha==null?null:pro.fecha.substr(0,10); 
                this.monto_total= pro.monto_total;
                this.nro_orden= pro.nro_orden;
                this.nro_guia_remision= pro.nro_guia_remision;
                this.fecha_emision= pro.fecha_emision==null?null:pro.fecha_emision.substr(0,10); 
                this.sub_total= pro.sub_total;
                this.igv= pro.igv;
                this.porc_igv= pro.porc_igv;
                this.ruc_emisor= pro.ruc_emisor;
                this.ruc_receptor= pro.ruc_receptor;

                this.clienteSelected={
                        direccion:pro.direccion,
                        nombres:pro.cliente,
                        telefono:pro.telefono,
                        numero_documento:pro.ruc_receptor
                }
                //this.cliente= pro.cliente;
                this.telefono= pro.telefono;
                this.direccion= pro.direccion;
                this.tipo_moneda= pro.tipo_moneda;
                this.medio_pago= pro.medio_pago;
                this.id_empleado= pro.id_empleado;
*/

                this.panelEditarSelected = true;
                this.panelListaBeanSelected = false;
        }


        regresar() {
                this.limpiarCampos();

                this.panelEditarSelected = false;
                this.panelListaBeanSelected = true;
        }


        mostrarTiposComprobante() {
                this.obtenerTiposComprobanteByIdCategoria(this.categoriaComprobanteSelected.id_categoria_comprobante);
                this.limpiarCampos();

                if (this.categoriaComprobanteSelected.nombre.toUpperCase() == "COMPRA") {
                        this.comprobanteCompraActivated = true;
                }

                if (this.categoriaComprobanteSelected.nombre.toUpperCase() == "VENTA") {
                        this.comprobanteCompraActivated = false;
                }
        }


        mostrarSeriesComprobante() {
                this.obtenerSeriesComprobanteByIdTipo(this.tipoComprobanteSelected.id_tipo_comprobante);

        }






        obtenerGuiasRemision() {
                this.getTotalLista();
                this.limpiarCamposBuscar();
                this.seleccionarByPagina(this.inicio, this.fin, this.tamPagina);
        }


        obtenerTipoMoneda() {

                this.tipoMonedaService.getAll()
                        .subscribe(
                        data => {//this.vistas = data;

                                this.tiposMoneda = data;
                        },
                        error => this.msj = <any>error);
        }

        obtenerCategoriasComprobante() {

                this.categoriaComprobanteService.getAll()
                        .subscribe(
                        data => {//this.vistas = data;

                                this.categoriasComprobante = data;
                        },
                        error => this.msj = <any>error);
        }

        obtenerCategoriasComprobanteVenta() {

                this.categoriaComprobanteService.getAllVenta()
                        .subscribe(
                        data => {//this.vistas = data;

                                this.categoriasComprobante = data;
                                this.categoriaComprobanteSelected = this.categoriasComprobante != null ? this.categoriasComprobante[0] : null;
                                this.mostrarTiposComprobante();
                        },
                        error => this.msj = <any>error);
        }

        obtenerCategoriasComprobanteCompra() {

                this.categoriaComprobanteService.getAllCompra()
                        .subscribe(
                        data => {//this.vistas = data;

                                this.categoriasComprobante = data;
                                this.categoriaComprobanteSelected = this.categoriasComprobante != null ? this.categoriasComprobante[0] : null;
                                this.mostrarTiposComprobante();
                        },
                        error => this.msj = <any>error);
        }



        obtenerTiposComprobanteByIdCategoria(id) {
                let parametros = JSON.stringify({
                        nombre: 'GUIA REMISION'
                });
                this.tipoComprobanteService.getByIdCategoriaParametros(parametros, id)
                        .subscribe(
                        data => {//this.vistas = data;

                                this.tiposComprobante = data;
                                this.tipoComprobanteSelected = this.tiposComprobante[0];
                                this.mostrarSeriesComprobante();
                        },
                        error => this.msj = <any>error);
        }


        obtenerSeriesComprobanteByIdTipo(id) {

                this.serieComprobanteService.getByIdTipo(id)
                        .subscribe(
                        data => {//this.vistas = data;

                                this.seriesComprobante = data;
                        },
                        error => this.msj = <any>error);
        }


        /*obtenerCatalogoVenta() {
                this.getTotalLista();
                this.limpiarCampos();
                this.seleccionarByPagina(this.inicio, this.fin, this.tamPagina);

}*/


        seleccionarByPagina(inicio: any, fin: any, tamPagina: any) {
                let parametros = JSON.stringify({
                        serie: this.serieSelected,
                        numero: this.numeroSelected,
                        punto_partida: this.puntoPartidaSelected,
                        punto_llegada: this.puntoLlegadaSelected,
                        fecha_emision: this.fechaEmisionBuscarSelected,
                        fecha_inicio_traslado: this.fechaInicioTrasladoBuscarSelected,
                        costo_minimo: this.costoMinimoSelected,
                        id_persona_empresa_transporte: this.personaEmpresaSelected == null ? null : this.personaEmpresaSelected.id_persona,
                        id_conductor_vehiculo: this.conductorSelected == null ? null : this.conductorSelected.id_conductor_vehiculo,
                        motivo_traslado: this.motivoTrasladoSelected,
                        nro_orden: this.nroOrdenSelected,
                        referencia_cliente: this.referenciaClienteSelected,
                        referencia_origen: this.referenciaOrigenSelected,
                        condiciones_entrega: this.condicionesEntregaSelected,
                        tipo_guia: this.categoriaComprobanteSelected == null ? null : this.categoriaComprobanteSelected.nombre.toUpperCase(),
                        id_tipo_moneda: this.tipoMonedaSelected == null ? null : this.tipoMonedaSelected.id_tipo_moneda,
                        id_persona_destinatario: this.personaDestinatarioSelected == null ? null : this.personaDestinatarioSelected.id_persona
                              
                });

                let user = this.obtenerUsuario();
                this.guiaRemisionService.buscarPaginacion(inicio, fin, tamPagina, parametros)
                        .subscribe(
                        data => {
                                this.listaComprobantes = data;
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

        imprimirGuiaRemision() {

                if (this.tienePermisoPrintMsj(this.rutas.FORM_GUIA_REMISION, this.rutas.BUTTON_IMPRIMIR)) {
                        this.reportePdfService.obtenerGuiaRemisionPdf(this.idGuiaRemisionSelected)
                                .subscribe(
                                data => {
                                        if (data._body.size == 0) {
                                                this.mensajeInCorrecto("DOCUMENTO DIGITALIZADO NO ENCONTRADO - HA SIDO ELIMINADO ARCHIVO ADJUNTO");
                                        } else {

                                                this.abrirDocumentoModalId(data._body, "guiaMostrarPDF");
                                                this.abrirModalPDfPorc("modalPDFGuiaRemison", 90);
                                        }

                                },
                                error => this.msj = <any>error
                                );
                }

        }



        imprimir(id_guia_remision) {
                if (this.tienePermisoPrintMsj(this.rutas.FORM_GUIA_REMISION, this.rutas.BUTTON_IMPRIMIR)) {

                        this.reportePdfService.obtenerGuiaRemisionPdf(id_guia_remision)
                                .subscribe(
                                data => {
                                        if (data._body.size == 0) {
                                                this.mensajeInCorrecto("DOCUMENTO DIGITALIZADO NO ENCONTRADO - HA SIDO ELIMINADO ARCHIVO ADJUNTO");
                                        } else {

                                                this.abrirDocumentoModalId(data._body, "guiaMostrarPDF");
                                                this.abrirModalPDfPorc("modalPDFGuiaRemison", 90);
                                        }


                                },
                                error => this.msj = <any>error
                                );
                }

        }


        buscarCompraVenta() {
                if (this.categoriaComprobanteSelected != null) {
                        this.print("nombre: " + this.categoriaComprobanteSelected.nombre)
                        if (this.categoriaComprobanteSelected.nombre.toUpperCase() == "COMPRA") {
                                this.buscarCompra();

                        }
                        if (this.categoriaComprobanteSelected.nombre.toUpperCase() == "VENTA") {
                                this.buscarVenta();
                        }
                }
        }


        buscarCompra() {

                this.compraService.getCompraById(this.idCompraVentaSelected)
                        .subscribe(
                        data => {
                                this.listaProductos = data.detalle_compra;
                                 this.agregarUnidadMedidaPeso();
                                this.compraSelected = data.compra;
                                this.guiasSelected = data.guiaRemision;
                                this.ventaSelected = null;
                                if (this.compraSelected != null) {

                                        this.idGuiaRemisionSelected = this.guiasSelected.length > 0 ? this.guiasSelected[0].id_guia_remision : null;

                                        if (this.idGuiaRemisionSelected != null) {
                                                this.tieneComprobante = true;
                                                this.mensajeCorrectoSinCerrar("COMPRA YA TIENE GUIA REMISION GENERADA ", "ID GUIA GENERADA: " + this.idGuiaRemisionSelected);
                                        } else {
                                                this.tieneComprobante = false;
                                                this.mensajeCorrecto("COMPRA ENCONTRADA - PUEDE GENERAR GUIA");
                                        }

                                        let usuario = this.obtenerUsuario()
                                        this.puntoLlegadaSelected = usuario.direccion_empresa;

                                } else {
                                        this.mensajeInCorrecto("COMPRA NO EXISTE");
                                }

                                this.print(data);
                        },
                        error => this.msj = <any>error);
        }



        buscarVenta() {

                this.ventaService.getVentaById(this.idCompraVentaSelected)
                        .subscribe(
                        data => {
                                this.listaProductos = data.detalle_venta;
                                this.agregarUnidadMedidaPeso();
                                this.ventaSelected = data.venta;
                                this.guiasSelected = data.guiaRemision;
                                this.compraSelected = null;
                                if (this.ventaSelected != null) {

                                        this.idGuiaRemisionSelected = this.guiasSelected.length > 0 ? this.guiasSelected[0].id_guia_remision : null;

                                        if (this.idGuiaRemisionSelected != null) {
                                                this.tieneComprobante = true;
                                                this.mensajeCorrectoSinCerrar("VENTA YA TIENE GUIA REMISION GENERADA ", "ID GUIA GENERADA: " + this.idGuiaRemisionSelected);

                                        } else {
                                                this.tieneComprobante = false;
                                                this.mensajeCorrecto("VENTA ENCONTRADA - PUEDE GENERAR GUIA");
                                        }


                                        let usuario = this.obtenerUsuario()
                                        this.puntoPartidaSelected = usuario.direccion_empresa;
                                        this.puntoLlegadaSelected = this.ventaSelected.direccion_cliente;
                                } else {
                                        this.mensajeInCorrecto("VENTA NO EXISTE");
                                }

                                this.print(data);
                        },
                        error => this.msj = <any>error);
        }


        agregarUnidadMedidaPeso(){
                let i;
                for(i=0;i<this.listaProductos.length;i++){
                        this.listaProductos[i].id_unidad_medida_peso = this.unidades_medida[0].id_unidad_medida;
                }
               
        }


        /*buscarComprobante(id) {

                this.guiaRemisionService.getComprobanteById(id)
                        .subscribe(
                        data => {
                               
                                //this.print(data);
                        },
                        error => this.msj = <any>error);
        }*/



        generarComprobante() {
                $('.nav-tabs a[href="#comprobanteVenta"]').tab('show')
        }


        registrar() {
                if (this.tienePermisoPrintMsj(this.rutas.FORM_GUIA_REMISION, this.rutas.BUTTON_REGISTRAR)) {
                        let usuario = this.obtenerUsuario()
                        let miRuc = usuario.ruc_empresa;
                        let mi_id_persona_empresa = usuario.id_persona_empresa;
                        this.print("mi_id_persona_empresa: "+mi_id_persona_empresa);

                        let cliente = "";
                        if (this.ventaSelected != null) {
                                cliente = this.ventaSelected.nombres_cliente + " " + this.ventaSelected.apellido_paterno_cliente + " " + this.ventaSelected.apellido_materno_cliente;
                        } else {
                                cliente = usuario.nombre_empresa;
                        }

                        let emisor = "";
                        if (this.ventaSelected != null) {
                                emisor = usuario.nombre_empresa;
                        } else {
                               emisor = this.compraSelected.nombres_proveedor;    
                        }

                        let user = this.obtenerUsuario();

                        let parametros = JSON.stringify({

                                id_serie_comprobante: this.serieComprobanteSelected == null ? null : this.serieComprobanteSelected.id_serie_comprobante,
                                nombre_categoria_comprobante: this.categoriaComprobanteSelected.nombre.toUpperCase(),
                                serie: this.serieComprobanteSelected == null ? this.serieSelected : this.serieComprobanteSelected.numero,
                                numero: this.numeroSelected,
                                ruc_emisor: this.ventaSelected == null ? this.compraSelected.ruc_proveedor : miRuc,
                                ruc_destinatario: this.ventaSelected == null ? miRuc : this.ventaSelected.numero_documento_cliente,
                                punto_partida: this.puntoPartidaSelected,
                                punto_llegada: this.puntoLlegadaSelected,
                                fecha_emision: this.fechaEmisionSelected,
                                fecha_inicio_traslado: this.fechaInicioTrasladoSelected,
                                costo_minimo: this.costoMinimoSelected,
                                id_persona_destinatario: this.ventaSelected == null ? mi_id_persona_empresa : this.ventaSelected.id_persona,
                                id_persona_empresa_transporte: this.personaEmpresaSelected == null ? null : this.personaEmpresaSelected.id_persona,
                                id_conductor_vehiculo: this.conductorSelected == null ? null : this.conductorSelected.id_conductor_vehiculo,
                                motivo_traslado: this.motivoTrasladoSelected,
                                nro_orden: this.nroOrdenSelected,
                                referencia_cliente: this.referenciaClienteSelected,
                                referencia_origen: this.referenciaOrigenSelected,
                                condiciones_entrega: this.condicionesEntregaSelected,
                                tipo_guia: this.categoriaComprobanteSelected.nombre.toUpperCase(),
                                id_comprobante: this.ventaSelected == null ? this.compraSelected.id_comprobante : this.ventaSelected.id_comprobante,

                                id_tipo_moneda: this.tipoMonedaSelected==null?null:this.tipoMonedaSelected.id_tipo_moneda,
                                id_compra_venta: this.idCompraVentaSelected,
                                lista_productos: this.listaProductos,
                                emisor:emisor
                        });


                        this.guiaRemisionService.registrar(parametros)
                                .subscribe(
                                data => {

                                        let rpta = data.rpta;
                                        this.print("rpta: " + rpta);
                                        if (rpta != null) {
                                                if (rpta == 1) {
                                                        this.mensajeCorrectoSinCerrar("ID GUIA REMISION: " + data.id_guia_remision + " REGISTRADO CORRECTAMENTE", " NUMERO GUIA: " + data.numero);
                                                        //this.limpiarCampos();
                                                        this.idGuiaRemisionSelected = data.id_guia_remision;
                                                        this.tieneComprobante = true;
                                                        //this.buscarComprobante(data.id_comprobante);
                                                } else {
                                                        this.mensajeInCorrecto("GUIA REMISION NO REGISTRADO");
                                                }
                                        }

                                        //this.obtenerCatalogoVenta();

                                },
                                error => this.msj = <any>error
                                );
                }
        }

        buscar() {
                if (this.tienePermisoPrintMsj(this.rutas.FORM_GUIA_REMISION, this.rutas.BUTTON_BUSCAR)) {
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


        limpiarBuscar() {
                this.limpiarCamposBuscar();
                this.inicio = 1;
                this.fin = 10;
                this.tamPagina = 10;
                this.getTotalLista();
                this.seleccionarByPagina(this.inicio, this.fin, this.tamPagina);
        }


        eliminar(bean) {

                if (this.tienePermisoPrintMsj(this.rutas.FORM_GUIA_REMISION, this.rutas.BUTTON_ELIMINAR)) {
                        if( confirm("Realmente Desea Eliminar ?")){
                        this.guiaRemisionService.eliminarLogico(bean.id_guia_remision)
                                .subscribe(
                                data => {
                                        this.obtenerGuiasRemision();
                                        let rpta = data;
                                        if (rpta != null) {
                                                if (rpta == 1) {
                                                        this.mensajeCorrecto("GUIA REMISION ELIMINADA CORRECTAMENTE");
                                                } else {
                                                        this.mensajeInCorrecto("GUIA REMISION NO ELIMINADO");
                                                }

                                        }
                                },
                                error => this.msj = <any>error);
                        }
                }
        }


        //**********ACCIONES PARAR FORMULARIO Cliente********
        abrirModalCliente() {
                this.abrirModal("modalClienteCom");
        }



        editar() {


                let parametros = JSON.stringify({

                });
                this.guiaRemisionService.editar(parametros, 1)
                        .subscribe(
                        data => {
                                this.obtenerGuiasRemision();
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

        mostrarCorrelativoSerie(){
                this.tipoComprobanteService.getCorrelativoByIdSerie(this.serieComprobanteSelected.id_serie_comprobante)
                .subscribe(
                data => {//this.vistas = data;

                        this.numeroCorrelativoSiguiente=data;
                },
                error => this.msj = <any>error);
        }


        limpiarCampos() {
                this.numeroCorrelativoSiguiente=null;
                this.ventaSelected = null;
                this.compraSelected = null;
                this.listaProductos = null;
                //this.categoriaComprobanteSelected=null;
                this.tipoComprobanteSelected = null;
                this.serieComprobanteSelected = null;
                this.medioPagoSelected = null;
                this.nroGuiaSelected = null;
                this.nroOrdenSelected = null;
                this.serieSelected = null;
                this.numeroSelected = null;
                //this.idCompraVentaSelected=null;

                this.idGuiaRemisionSelected = null;
                this.serieSelected = null;
                this.numeroSelected = null;
                this.rucEmisorSelected = null;
                this.rucDestinatarioSelected = null;
                this.puntoPartidaSelected = null;
                this.puntoLlegadaSelected = null;


                var f = new Date();
                this.fechaEmisionSelected = f.getFullYear() + "-" + this.completarCerosIzquierda(2, "" + (f.getMonth() + 1)) + "-" + this.completarCerosIzquierda(2, "" + f.getDate());
                this.fechaInicioTrasladoSelected = this.fechaEmisionSelected;

                this.costoMinimoSelected = null;
                this.idPersonaDestinatarioSelected = null;
                this.idPersonaEmpresaTransporteSelected = null;
                this.personaEmpresaSelected = null;
                this.idComprobanteSelected = null;
                this.idConductorVehiculoSelected = null;
                this.conductorSelected = null;

                this.nombreConductorSelected = null;
                this.nombreEmpresaTransporte = null;
                this.motivoTrasladoSelected = null;
                this.nroOrdenSelected = null;
                this.referenciaClienteSelected = null;
                this.referenciaOrigenSelected = null;
                this.condicionesEntregaSelected = null;
                this.tipoGuia = null;


        }



        
        limpiarCamposBuscar() {

                this.ventaSelected = null;
                this.compraSelected = null;
                this.listaProductos = null;
                this.categoriaComprobanteSelected = null;
                this.tipoComprobanteSelected = null;
                this.serieComprobanteSelected = null;
                this.medioPagoSelected = null;
                this.nroGuiaSelected = null;
                this.nroOrdenSelected = null;
                this.serieSelected = null;
                this.numeroSelected = null;
                //this.idCompraVentaSelected=null;

                this.idGuiaRemisionSelected = null;
                this.serieSelected = null;
                this.numeroSelected = null;
                this.rucEmisorSelected = null;
                this.rucDestinatarioSelected = null;
                this.puntoPartidaSelected = null;
                this.puntoLlegadaSelected = null;


                this.fechaEmisionBuscarSelected = null;
                this.fechaInicioTrasladoBuscarSelected = null;

                this.costoMinimoSelected = null;
                this.idPersonaDestinatarioSelected = null;
                this.idPersonaEmpresaTransporteSelected = null;
                this.personaEmpresaSelected = null;
                this.idComprobanteSelected = null;
                this.idConductorVehiculoSelected = null;
                this.conductorSelected = null;

                this.nombreConductorSelected = null;
                this.nombreEmpresaTransporte = null;
                this.motivoTrasladoSelected = null;
                this.nroOrdenSelected = null;
                this.referenciaClienteSelected = null;
                this.referenciaOrigenSelected = null;
                this.condicionesEntregaSelected = null;
                this.tipoGuia = null;

                this.personaDestinatarioSelected=null;
                this.nombrePersonaDestinatario=null;
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
                        serie: this.serieSelected,
                        numero: this.numeroSelected,
                        punto_partida: this.puntoPartidaSelected,
                        punto_llegada: this.puntoLlegadaSelected,
                        fecha_emision: this.fechaEmisionBuscarSelected,
                        fecha_inicio_traslado: this.fechaInicioTrasladoBuscarSelected,
                        costo_minimo: this.costoMinimoSelected,
                        id_persona_empresa_transporte: this.personaEmpresaSelected == null ? null : this.personaEmpresaSelected.id_persona,
                        id_conductor_vehiculo: this.conductorSelected == null ? null : this.conductorSelected.id_conductor_vehiculo,
                        motivo_traslado: this.motivoTrasladoSelected,
                        nro_orden: this.nroOrdenSelected,
                        referencia_cliente: this.referenciaClienteSelected,
                        referencia_origen: this.referenciaOrigenSelected,
                        condiciones_entrega: this.condicionesEntregaSelected,
                        tipo_guia: this.categoriaComprobanteSelected == null ? null : this.categoriaComprobanteSelected.nombre.toUpperCase(),
                        id_tipo_moneda: this.tipoMonedaSelected == null ? null : this.tipoMonedaSelected.id_tipo_moneda,
                        id_persona_destinatario: this.personaDestinatarioSelected == null ? null : this.personaDestinatarioSelected.id_persona

                });

                this.print("parametros total: " + parametros);
                this.guiaRemisionService.getTotalParametros(parametros)
                        .subscribe(
                        data => {
                                this.totalLista = data;
                                this.print("total:" + data);
                        },
                        error => this.msj = <any>error);
        }



        //**********ACCIONES PARAR FORMULARIO PERSONA********
        abrirModalPersonaDestinatario() {
                this.busquedaDestinatarioActivated=true;
                this.abrirModal("modalPersona2");
        }


        //**********ACCIONES PARAR FORMULARIO PERSONA********
        abrirModalPersona() {
                this.busquedaDestinatarioActivated=false;
                this.abrirModal("modalPersona2");
        }

        //**********METODO QUE OBTIENE LOS DATOS EXTERNOS PERSONA *****
        obtenerDatosPersonaExterna(datos) {

                if (this.busquedaDestinatarioActivated) {
                        this.personaDestinatarioSelected = datos.bean;
                        this.nombrePersonaDestinatario = this.personaDestinatarioSelected.nombres + " " + this.personaDestinatarioSelected.apellido_paterno + " " + this.personaDestinatarioSelected.apellido_materno;
                } else {
                        this.personaEmpresaSelected = datos.bean;
                        this.nombreEmpresaTransporte = this.personaEmpresaSelected.nombres + " " + this.personaEmpresaSelected.apellido_paterno + " " + this.personaEmpresaSelected.apellido_materno;
                }

                this.cerrarModal("modalPersona2");
                this.print("DATOS EXTERNOS: ");
                this.print(datos);
        }



        //**********ACCIONES PARAR FORMULARIO PERSONA********
        abrirModalConductor() {
                this.abrirModal("modalConductor");
        }

        //**********METODO QUE OBTIENE LOS DATOS EXTERNOS Conductor *****
        obtenerDatosConductorExterna(datos) {
                this.conductorSelected = datos.bean;
                this.nombreConductorSelected = this.conductorSelected.conductor;

                this.cerrarModal("modalConductor");
                this.print("DATOS EXTERNOS: ");
                this.print(datos);
        }


        seleccionar(bean) {
                this.dataExterna.emit({ bean: bean });
        }
}