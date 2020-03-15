import { Component, AfterViewInit, ViewChild, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';

import { ControllerComponent } from '../../../../core/controller/controller.component';




/******************IMPORTAR SERVICIOS*************** */


import { GuiaRemisionService } from '../../service/guia-remision.service';
import { ReportePdfService } from '../../../../core/service/reporte-pdf.Service';
import { CategoriaComprobanteService } from '../../../mantenedores/service/categoria-comprobante.service';
import { TipoComprobanteService } from '../../../mantenedores/service/tipo-comprobante.service';
import { SerieComprobanteService } from '../../../mantenedores/service/serie-comprobante.service';
import { TipoMonedaService } from '../../../mantenedores/service/tipo-moneda.service';
import { FormFindPersonaComponent } from '../persona/form-find-persona.component';
import { FormFindConductorVehiculoComponent } from '../conductor-vehiculo/form-find-conductor-vehiculo.component';


declare var $: any;
@Component({
        selector: 'form-find-guia-remision',
        templateUrl: '../../view/guia-remision/form-find-guia-remision.component.html',
        providers: [GuiaRemisionService,  ReportePdfService, CategoriaComprobanteService, TipoComprobanteService, SerieComprobanteService, TipoMonedaService]

})

export class FormFindGuiaRemisionComponent extends ControllerComponent implements AfterViewInit {

        idCompraVentaBusqueda: any = null;
        categoriaComprobanteSelected: any = null;
        categoriasComprobante: any[];
        serieSelected:any = null;
        numeroSelected: any = null;
        puntoPartidaSelected:any = null;
        puntoLlegadaSelected: any = null;
        fechaEmisionBuscarSelected: any = null;
        fechaInicioTrasladoBuscarSelected: any = null;
        motivoTrasladoSelected: any = null;
        nroOrdenSelected: any = null;
        referenciaClienteSelected:any = null;
        referenciaOrigenSelected:any = null;
        condicionesEntregaSelected: any = null;
        tipoMonedaSelected: any = null;
        tiposMoneda: any[];
        costoMinimoSelected: any = null;
        nombrePersonaDestinatario: string= null;
        nombreEmpresaTransporte: string= null;
        nombreConductorSelected: string= null;
        listaComprobantes: any[];


        conductorSelected: any = null;
        personaEmpresaSelected: any = null;
        personaDestinatarioSelected:any = null;
        idGuiaRemisionSelected:any = null;
        tiposComprobante: any[];
        tipoComprobanteSelected: any = null;
        seriesComprobante: any[];
        serieComprobanteSelected: any = null;
        busquedaDestinatarioActivated: boolean = false;
        comprobanteCompraActivated: boolean = false;


        @Output() dataExterna = new EventEmitter();
        buttonSelected:boolean=false;

        //**********MODAL PERSONA
        @ViewChild(FormFindPersonaComponent,{static: true}) formFindPersona: FormFindPersonaComponent;

        //**********MODAL CONDUCTOR
        @ViewChild(FormFindConductorVehiculoComponent,{static: true}) formFindConductor: FormFindConductorVehiculoComponent;



        //activatedSelectedPer: boolean = true;


        //**********MODAL CONDUCTOR
        //activatedSelectedCondu: boolean = true;

        

        constructor(
                public http: Http,
                public router: Router,
                public guiaRemisionService: GuiaRemisionService,
                public reportePdfService: ReportePdfService,
                public categoriaComprobanteService: CategoriaComprobanteService,
                public tipoComprobanteService: TipoComprobanteService,
                public serieComprobanteService: SerieComprobanteService,
                public tipoMonedaService: TipoMonedaService
        ) {
                super(router);


        }

        ngOnInit() {
                this.formFindPersona.activatedSelected=true;
                this.formFindConductor.buttonSelected=true;
        }

        ngAfterViewInit() {
                if (this.verificarTokenRpta(this.rutasMantenedores.FORM_GUIA_REMISION)) {
                        //this.obtenerUnidadesMedida();

                        /*this.obtenerCategoriasComprobante();
                        this.obtenerTipoMoneda();
                        this.obtenerGuiasRemision();*/
                       
                }
        }

        obtenerGuiasRemision() {
                this.limpiarCamposBuscar();
                this.getTotalLista();
               // this.seleccionarByPagina(this.inicio, this.fin, this.tamPagina);
        }

        obtenerTipoMoneda() {

                this.tipoMonedaService.getAll()
                        .subscribe(
                                data => {
                                        this.tiposMoneda = data;
                                },
                                error => this.msj = <any>error);
        }

        obtenerCategoriasComprobante() {

                this.categoriaComprobanteService.getAll()
                        .subscribe(
                                data => {
                                        this.categoriasComprobante = data;
                                },
                                error => this.msj = <any>error);
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


        obtenerCategoriasComprobanteVenta() {

                this.categoriaComprobanteService.getAllVenta()
                        .subscribe(
                                data => {
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

        mostrarSeriesComprobante() {
                this.obtenerSeriesComprobanteByIdTipo(this.tipoComprobanteSelected.id_tipo_comprobante);

        }

        obtenerSeriesComprobanteByIdTipo(id) {

                this.serieComprobanteService.getByIdTipo(id)
                        .subscribe(
                                data => {//this.vistas = data;

                                        this.seriesComprobante = data;
                                },
                                error => this.msj = <any>error);
        }



        getTotalLista() {

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
                        id_persona_destinatario: this.personaDestinatarioSelected == null ? null : this.personaDestinatarioSelected.id_persona,
                        id_compra_venta: this.idCompraVentaBusqueda
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
                        id_persona_destinatario: this.personaDestinatarioSelected == null ? null : this.personaDestinatarioSelected.id_persona,
                        id_compra_venta: this.idCompraVentaBusqueda
                });

                let user = this.obtenerUsuario();
                this.guiaRemisionService.buscarPaginacion(inicio, fin, tamPagina, parametros)
                        .subscribe(
                                data => {
                                        this.listaComprobantes = data;
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
                                                this.abrirDocumentoModalId(data._body,'mostrarPrincipalPDF');
                                                this.abrirModalPDfPorc("modalPrincipalPDF", 90);
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

                                                        this.abrirDocumentoModalId(data._body,'mostrarPrincipalPDF');
                                                        this.abrirModalPDfPorc("modalPrincipalPDF", 90);
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

                                                        this.abrirDocumentoModalId(data._body,'mostrarPrincipalPDF');
                                                        this.abrirModalPDfPorc("modalPrincipalPDF", 90);
                                                }


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
                //this.seleccionarByPagina(this.inicio, this.fin, this.tamPagina);
        }


        eliminar(bean) {

                if (this.tienePermisoPrintMsj(this.rutas.FORM_GUIA_REMISION, this.rutas.BUTTON_ELIMINAR)) {
                        if (confirm("Realmente Desea Eliminar ?")) {
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




        limpiarCampos() {
               
                //this.categoriaComprobanteSelected=null;
                this.tipoComprobanteSelected = null;
                this.serieComprobanteSelected = null;
                this.tipoMonedaSelected=null;
                this.nroOrdenSelected = null;
                this.serieSelected = null;
                this.numeroSelected = null;
                //this.idCompraVentaSelected=null;

                this.idGuiaRemisionSelected = null;
                this.serieSelected = null;
                this.numeroSelected = null;

                this.puntoPartidaSelected = null;
                this.puntoLlegadaSelected = null;



                this.costoMinimoSelected = null;
                this.personaEmpresaSelected = null;
                this.conductorSelected = null;
                this.nombreConductorSelected = null;
                this.nombreEmpresaTransporte = null;
                this.motivoTrasladoSelected = null;
                this.nroOrdenSelected = null;
                this.referenciaClienteSelected = null;
                this.referenciaOrigenSelected = null;
                this.condicionesEntregaSelected = null;
                this.listaComprobantes = null;
                this.idCompraVentaBusqueda = null;


        }




        limpiarCamposBuscar() {

                this.categoriaComprobanteSelected = null;
                this.tipoComprobanteSelected = null;
                this.serieComprobanteSelected = null;
                this.nroOrdenSelected = null;
                this.serieSelected = null;
                this.numeroSelected = null;
                this.tipoMonedaSelected=null;
                //this.idCompraVentaSelected=null;

                this.idGuiaRemisionSelected = null;
                this.serieSelected = null;
                this.numeroSelected = null;
                this.puntoPartidaSelected = null;
                this.puntoLlegadaSelected = null;


                this.fechaEmisionBuscarSelected = null;
                this.fechaInicioTrasladoBuscarSelected = null;

                this.costoMinimoSelected = null;
                this.personaEmpresaSelected = null;
                this.conductorSelected = null;

                this.nombreConductorSelected = null;
                this.nombreEmpresaTransporte = null;
                this.motivoTrasladoSelected = null;
                this.nroOrdenSelected = null;
                this.referenciaClienteSelected = null;
                this.referenciaOrigenSelected = null;
                this.condicionesEntregaSelected = null;
                this.personaDestinatarioSelected = null;
                this.nombrePersonaDestinatario = null;
                this.listaComprobantes = null;
                this.idCompraVentaBusqueda = null;
        }


        elegirFila(lista, i) {
                this.marcar(lista, i);
        }


        seleccionar(bean) {
                this.dataExterna.emit({ bean: bean });
        }




        //**********ACCIONES PARAR FORMULARIO PERSONA********
        abrirModalPersonaDestinatario() {
                this.busquedaDestinatarioActivated = true;
                if(this.formFindPersona.listaPersonas==null){
                        this.formFindPersona.obtenerPersonas();
                }
                
                this.abrirModal("modalPersona2");
        }


        //**********ACCIONES PARAR FORMULARIO PERSONA********
        abrirModalPersona() {
                this.busquedaDestinatarioActivated = false;
                if(this.formFindPersona.listaPersonas==null){
                        this.formFindPersona.obtenerPersonas();
                }
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
        // abrirModalConductor() {
        //         this.abrirModal("modalConductor");
        //         this.formFindConductor.obtenerConductores();
        // }

        // //**********METODO QUE OBTIENE LOS DATOS EXTERNOS Conductor *****
        // obtenerDatosConductorExterna(datos) {
        //         this.conductorSelected = datos.bean;
        //         this.nombreConductorSelected = this.conductorSelected.conductor;

        //         this.cerrarModal("modalConductor");
        //         this.print("DATOS EXTERNOS: ");
        //         this.print(datos);
        // }

}