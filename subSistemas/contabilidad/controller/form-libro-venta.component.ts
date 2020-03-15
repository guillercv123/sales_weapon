import { Component, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';

import { ControllerComponent } from '../../../core/controller/controller.component';




/******************IMPORTAR SERVICIOS*************** */


import { LibroVentaService } from '../service/libro-venta.service';
import { SunatTablaService } from '../service/sunat-tabla.service';
import { ReporteExcelService } from '../../../core/service/reporte-excel.Service';


declare var $: any;
@Component({
        selector: 'form-libro-venta',
        templateUrl: '../view/form-libro-venta.component.html',
        providers: [SunatTablaService,LibroVentaService,ReporteExcelService]

})

export class FormLibroVentaComponent extends ControllerComponent implements AfterViewInit {
       

        titulo:string;
        periodo:string; 
        periodo_fecha:any; 
        ruc:string; 
        razon_social:string; 
        id_empresa:string; 

        
        libros_ventas: any[];
        lista_detalle_libro: any[];

        libroVentaSelected={
             titulo: null,
             periodo: null,
             periodo_fecha: null,
             ruc: null,
             razon_social: null,
             id_conta_libro_venta: null
        };

        //***********PANELES DE LOS MANTENEDORES***********
        panelEditarSelected: boolean = false;
        panelListaBeanSelected: boolean = true;
        panelDetalleLibroSelected: boolean = false;

        //****************OBTEJOS OBTENIDOS DEL FORMULARIO PRODUCTO
        beanSelectedExterno: any;

        //************AGREGAR FILAS AL DETALLE LIBRO DIARIO************
        cantidadCeldas: number = 1;


        /**************TABLAS DEL LIBRO*************/
        tabla_2: any[];
        tabla_10: any[];
              

        constructor(
                public http: Http,
                public router: Router,
                public libroVentaService: LibroVentaService,
                public reporteExcelService: ReporteExcelService,
                public sunatTablaService:SunatTablaService
        ) {
                super(router);
                this.panelEditarSelected = false;
        }




        ngOnInit() {
                this.lista_detalle_libro = new Array();
                this.obtenerSunatTabla(2);
                this.obtenerSunatTabla(10);
        }


        ngAfterViewInit() {
                if (this.verificarTokenRpta(this.rutasContabilidad.FORM_LIBRO_VENTA)) {
                      this.obtenerLibrosVentas();
                }
        }


        obtenerSunatTabla(numero_tabla) {
                let parametros = JSON.stringify({
                        id_sunat_tabla:null,
                        codigo:null,
                        descripcion:null,
                        nro_tabla :numero_tabla,   
                });

                let user = this.obtenerUsuario();
                this.sunatTablaService.buscarPaginacion(1, 500, 500, parametros)
                        .subscribe(
                        data => {
                                if(numero_tabla==2){
                                        this.tabla_2 = data;
                                }

                                if(numero_tabla==10){
                                        this.tabla_10 = data;
                                }
                                
                                this.print(data);
                        },
                        error => this.msj = <any>error);
        }



        generarReporteLibro(obj){

                let parametros = JSON.stringify({
                        id_libro: obj.id_conta_libro_venta
                });

                this.reporteExcelService.obtenerReporteExcel(this.rutasContabilidad.API_LIBRO_VENTA_REST + "/reporte/",parametros)
                .subscribe(
                data => {
                        if (data._body.size == 0) {
                                this.mensajeInCorrecto("DOCUMENTO NO PUDO GENERARSE- INTENTA NUEVAMENTE");
                        } else {
                                this.descargarFileExtension(data._body,'registro-ventas','xlsx');
                        }


                },
                error => this.msj = <any>error
                );

               
        }


        limpiarCampos() {

                this.titulo=null;
                this.periodo=null; 
                this.periodo_fecha=null; 
                this.ruc=null; 
                this.razon_social=null;
                this.id_empresa=null;
                this.libroVentaSelected={
                        titulo: null,
                        periodo: null,
                        periodo_fecha: null,
                        ruc: null,
                        razon_social: null,
                        id_conta_libro_venta: null
                   };

        }


        buscar() {

                if (this.tienePermisoPrintMsj(this.rutasContabilidad.FORM_LIBRO_VENTA, this.rutas.BUTTON_BUSCAR)) {
                        this.getTotalLista();
                        this.seleccionarByPagina(this.inicio, this.fin, this.tamPagina);
                }
        }

        obtenerLibrosVentas() {
                this.limpiarCampos();
                this.getTotalLista();
                this.seleccionarByPagina(this.inicio, this.fin, this.tamPagina);

        }




        getTotalLista() {

                let parametros = JSON.stringify({
                        libro_venta:this.libroVentaSelected,
                        detalle_libro:this.lista_detalle_libro      
                });

                this.print("parametros total: " + parametros);
                this.libroVentaService.getTotalParametros(parametros)
                        .subscribe(
                        data => {
                                this.totalLista = data;
                                this.print("total:" + data);
                        },
                        error => this.msj = <any>error);
        }



        seleccionarByPagina(inicio: any, fin: any, tamPagina: any) {
                let parametros = JSON.stringify({
                        libro_venta:this.libroVentaSelected,
                        detalle_libro:this.lista_detalle_libro      
                });

                let user = this.obtenerUsuario();
                this.libroVentaService.buscarPaginacion(inicio, fin, tamPagina, parametros)
                        .subscribe(
                        data => {
                                this.libros_ventas = data;
                                this.print(data);
                        },
                        error => this.msj = <any>error);
        }


        abrirPanelEditar(pro) {

                if (this.tienePermisoPrintMsj(this.rutasContabilidad.FORM_LIBRO_VENTA, this.rutas.PANEL_EDITAR)) {
                        this.print(pro);

                        this.beanSelectedExterno = pro;

                        this.buscarLibroVentaEditar(pro);

                        this.panelEditarSelected = true;
                        this.panelListaBeanSelected = false;
                        this.panelDetalleLibroSelected = true;
                }
        }


        regresar() {
                this.limpiarCampos();

                this.panelEditarSelected = false;
                this.panelListaBeanSelected = true;
                this.panelDetalleLibroSelected = false;
                $('.nav-tabs a[href="#buscarLibroDiario"]').tab('show');
        }

        obtenerTipoTablaSunat(codigo,numero_tabla) {
                let obj = null;
                
                
                if(numero_tabla==2){
                        let i;
                        for (i = 0; i < this.tabla_2.length; i++) {
                        
                                //this.print("this.tipos_producto[i].nombre"+this.tipos_producto[i].nombre+" , nombreTipo: " +nombreTipo);
                                if (this.tabla_2[i].codigo == codigo) {
                                        obj = this.tabla_2[i];
                                        break;
                                }
                        }
                }

                if(numero_tabla==10){
                        let i;
                        for (i = 0; i < this.tabla_10.length; i++) {
                        
                                //this.print("this.tipos_producto[i].nombre"+this.tipos_producto[i].nombre+" , nombreTipo: " +nombreTipo);
                                if (this.tabla_10[i].codigo == codigo) {
                                        obj = this.tabla_10[i];
                                        break;
                                }
                        }
                }
                
                
                
                return obj;
        }


        buscarLibroVentaEditar(obj) {
                     
                        this.libroVentaService.getDetalleLibroById(obj.id_conta_libro_venta)
                                .subscribe(
                                data => {

                                        this.lista_detalle_libro = data.detalle_libro_venta;

                                        for( let i=0;i<this.lista_detalle_libro.length;i++){
                                                this.lista_detalle_libro[i].tipo_comprobante=this.obtenerTipoTablaSunat(this.lista_detalle_libro[i].tipo_comprobante,10);
                                                this.lista_detalle_libro[i].tipo_doc_cliente=this.obtenerTipoTablaSunat(this.lista_detalle_libro[i].tipo_doc_cliente,2);
                                                this.lista_detalle_libro[i].tipo_documento_modifica=this.obtenerTipoTablaSunat(this.lista_detalle_libro[i].tipo_documento_modifica,10);
                                        }


                                        data.libro_venta.periodo_fecha=data.libro_venta.periodo_fecha.substr(0,10);
                                        this.libroVentaSelected = data.libro_venta; 
                                                                               
                                        this.print(data);
                                },
                                error => this.msj = <any>error);
                
        }


        agregarFilaLibroCompra(cantidad) {

                let i;
                for (i = 0; i < cantidad; i++) {
                        let p = {                        
                                correlativo:null,
                                fecha_emision_comprobante:null,
                                fecha_vencimiento_comprobante:null,
                                tipo_comprobante:this.tabla_10[0],
                                serie_comprobante:null,
                                nro_comprobante:null,
                                tipo_doc_cliente:this.tabla_2[0],
                                nro_doc_cliente:null,
                                razon_social_cliente:null,
                                valor_facturado_expor:null,
                                base_imponible_operacion_gravada:null,
                                importe_total_operacion_exonerada:null,
                                importe_total_operacion_inafecta:null,
                                isc:null,
                                igv_ipm:null,
                                otros_tributos_cargos:null,
                                importe_total_comprobante:null,
                                tipo_cambio:null,
                                fecha_documento_modifica:null,
                                tipo_documento_modifica:this.tabla_10[0],
                                serie_documento_modifica:null,
                                nro_documento_modifica:null,
                                id_conta_libro_compra:null,
                                estado:null
                        }

                        this.lista_detalle_libro.push(p);
                        
                }
        }



        editar() {


                if (this.tienePermisoPrintMsj(this.rutasContabilidad.FORM_LIBRO_VENTA, this.rutas.BUTTON_ACTUALIZAR)) {

                        
                        let user = this.obtenerUsuario();
                        let f= new Date();

                        let parametros = JSON.stringify({
                                libro_venta:this.libroVentaSelected,
                                detalle_libro:this.lista_detalle_libro
                        });

                        this.libroVentaService.editar(parametros, this.libroVentaSelected.id_conta_libro_venta)
                                .subscribe(
                                data => {
                                        
                                        let rpta = data.rpta;
                                        this.print("rpta: " + rpta);
                                        if (rpta != null) {
                                                if (rpta) {
                                                        this.mensajeCorrecto("LIBRO VENTA MODIFICADO CORRECTAMENTE");
                                                } else {
                                                        this.mensajeInCorrecto("LIBRO VENTA  NO MODIFICADA");
                                                }
                                        }

                                },
                                error => this.msj = <any>error
                                );

                }
        }

        eliminarItem(i) {
                this.print("INDICE A ELIMINAR: " + i);
                this.lista_detalle_libro.splice(i, 1)
        }




        

        sincronizar(bean) {

                if (this.tienePermisoPrintMsj(this.rutasContabilidad.FORM_LIBRO_COMPRA, this.rutas.BUTTON_ELIMINAR)) {
                       
                     
                        var date = new Date(bean.periodo_fecha);
                        var primerDia = new Date(date.getFullYear(), date.getMonth(), 1);
                        var ultimoDia = new Date(date.getFullYear(), date.getMonth() + 1, 0);

                        this.print("primerDia: "+this.convertirFechaMysql(primerDia));
                        this.print("ultimoDia: "+this.convertirFechaMysql(ultimoDia));

                        let parametros = JSON.stringify({
                                id_conta_libro_venta: bean.id_conta_libro_venta,
                                fecha_inicio:this.convertirFechaMysql(primerDia),
                                fecha_fin:this.convertirFechaMysql(ultimoDia)

                                
                        });

                        if( confirm("Realmente Desea Sincronizar ?")){
                                this.libroVentaService.sincronizarLibro(parametros)
                                        .subscribe(
                                        data => {
                                                let rpta = data;
                                                if (rpta != null) {
                                                        if (rpta == 1) {
                                                                this.mensajeCorrecto("LIBRO DE VENTA SINCRONIZADO CORRECTAMENTE");
                                                        } else {
                                                                this.mensajeInCorrecto("LIBRO DE VENTA NO SINCRONIZADO");
                                                        }

                                                }
                                        },
                                        error => this.msj = <any>error);
                        }
                }
        }


        eliminar(bean) {

                if (this.tienePermisoPrintMsj(this.rutasContabilidad.FORM_LIBRO_VENTA, this.rutas.BUTTON_ELIMINAR)) {
                        let user = this.obtenerUsuario();
                        if( confirm("Realmente Desea Eliminar ?")){
                                this.libroVentaService.eliminarLogico(bean.id_conta_libro_venta)
                                        .subscribe(
                                        data => {
                                                this.obtenerLibrosVentas();
                                                let rpta = data;
                                                if (rpta != null) {
                                                        if (rpta == 1) {
                                                                this.mensajeCorrecto("LIBRO VENTA ELIMINADO CORRECTAMENTE");
                                                        } else {
                                                                this.mensajeInCorrecto("LIBRO VENTA ELIMINADO NO ELIMINADo");
                                                        }

                                                }
                                        },
                                        error => this.msj = <any>error);
                        }
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


        registrar() {

                if (this.tienePermisoPrintMsj(this.rutasContabilidad.FORM_LIBRO_VENTA, this.rutas.BUTTON_REGISTRAR)) {

                        let user = this.obtenerUsuario(); 
                        let f= new Date();

                        let parametros = JSON.stringify({
                                libro_venta:this.libroVentaSelected,
                                detalle_libro:this.lista_detalle_libro      
                        });

                        this.libroVentaService.registrar(parametros)
                                .subscribe(
                                data => {
                                        //this.idCompraSelected = data.id_compra
                                        this.obtenerLibrosVentas();
                                        let rpta = data.rpta;
                                        this.print("rpta: " + rpta);
                                        if (rpta != null) {
                                                if (rpta == 1) {

                                                        this.mensajeCorrectoSinCerrar("LIBRO VENTA REGISTRADO CORRECTAMENTE  - COD :" + data.id_conta_libro_venta);

                                                } else {
                                                        this.mensajeInCorrecto("LIBRO VENTA NO REGISTRADO");

                                                }
                                        }
                                       

                                },
                                error => this.msj = <any>error
                                );
                }
        }

}