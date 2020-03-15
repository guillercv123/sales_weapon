import { Component, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';

import { ControllerComponent } from '../../../core/controller/controller.component';




/******************IMPORTAR SERVICIOS*************** */


import { LibroDiarioService } from '../service/libro-diario.service';
import { SunatTablaService } from '../service/sunat-tabla.service';
import { ReporteExcelService } from '../../../core/service/reporte-excel.Service';


declare var $: any;
@Component({
        selector: 'form-libro-diario',
        templateUrl: '../view/form-libro-diario.component.html',
        providers: [SunatTablaService,LibroDiarioService,ReporteExcelService]

})

export class FormLibroDiarioComponent extends ControllerComponent implements AfterViewInit {
       

        titulo:string;
        periodo:string; 
        periodo_fecha:any; 
        ruc:string; 
        razon_social:string; 
        id_empresa:string; 

        
        libros_diarios: any[];
        lista_detalle_libro: any[];

        libroDiarioSelected={
             titulo: null,
             periodo: null,
             periodo_fecha: null,
             ruc: null,
             razon_social: null,
             id_conta_libro_diario: null
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
         tabla_8: any[];

        constructor(
                public http: Http,
                public router: Router,
                public libroDiarioService: LibroDiarioService,
                public reporteExcelService: ReporteExcelService,
                public sunatTablaService:SunatTablaService
        ) {
                super(router);
                this.panelEditarSelected = false;
        }




        ngOnInit() {
                this.lista_detalle_libro = new Array();
                this.obtenerSunatTabla(8);
        }


        ngAfterViewInit() {
                if (this.verificarTokenRpta(this.rutasContabilidad.FORM_LIBRO_DIARIO)) {
                      this.obtenerLibrosDiarios();
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
                                if(numero_tabla==8){
                                        this.tabla_8 = data;
                                }

                                this.print(data);
                        },
                        error => this.msj = <any>error);
        }


        generarReporteLibro(obj){

                let parametros = JSON.stringify({
                        id_libro: obj.id_conta_libro_diario
                });

                this.reporteExcelService.obtenerReporteExcel(this.rutasContabilidad.API_LIBRO_DIARIO_REST + "/reporte/",parametros)
                .subscribe(
                data => {
                        if (data._body.size == 0) {
                                this.mensajeInCorrecto("DOCUMENTO NO PUDO GENERARSE- INTENTA NUEVAMENTE");
                        } else {
                                this.descargarFileExtension(data._body,'libro-diario','xlsx');
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
                this.libroDiarioSelected={
                        titulo: null,
                        periodo: null,
                        periodo_fecha: null,
                        ruc: null,
                        razon_social: null,
                        id_conta_libro_diario: null
                   };

        }



        limpiar() {
                this.limpiarCampos();
                this.inicio = 1;
                this.fin = 10;
                this.tamPagina = 10;
                this.getTotalLista();
                this.seleccionarByPagina(this.inicio, this.fin, this.tamPagina);
        }


        eliminarItem(i) {
                this.print("INDICE A ELIMINAR: " + i);
                this.lista_detalle_libro.splice(i, 1)
        }

        buscar() {

                if (this.tienePermisoPrintMsj(this.rutasContabilidad.FORM_LIBRO_DIARIO, this.rutas.BUTTON_BUSCAR)) {
                        this.getTotalLista();
                        this.seleccionarByPagina(this.inicio, this.fin, this.tamPagina);
                }
        }

        obtenerLibrosDiarios() {
                this.limpiarCampos();
                this.getTotalLista();
                this.seleccionarByPagina(this.inicio, this.fin, this.tamPagina);

        }




        getTotalLista() {

                let parametros = JSON.stringify({
                        libro_diario:this.libroDiarioSelected,
                        detalle_libro:this.lista_detalle_libro      
                });

                this.print("parametros total: " + parametros);
                this.libroDiarioService.getTotalParametros(parametros)
                        .subscribe(
                        data => {
                                this.totalLista = data;
                                this.print("total:" + data);
                        },
                        error => this.msj = <any>error);
        }



        seleccionarByPagina(inicio: any, fin: any, tamPagina: any) {
                let parametros = JSON.stringify({
                        libro_diario:this.libroDiarioSelected,
                        detalle_libro:this.lista_detalle_libro      
                });

                let user = this.obtenerUsuario();
                this.libroDiarioService.buscarPaginacion(inicio, fin, tamPagina, parametros)
                        .subscribe(
                        data => {
                                this.libros_diarios = data;
                                this.print(data);
                        },
                        error => this.msj = <any>error);
        }


        abrirPanelEditar(pro) {

                if (this.tienePermisoPrintMsj(this.rutasContabilidad.FORM_LIBRO_DIARIO, this.rutas.PANEL_EDITAR)) {
                        this.print(pro);

                        this.beanSelectedExterno = pro;

                        this.buscarLibroDiarioEditar(pro);

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
                
                
                if(numero_tabla==8){
                        let i;
                        for (i = 0; i < this.tabla_8.length; i++) {
                        
                                //this.print("this.tipos_producto[i].nombre"+this.tipos_producto[i].nombre+" , nombreTipo: " +nombreTipo);
                                if (this.tabla_8[i].codigo == codigo) {
                                        obj = this.tabla_8[i];
                                        break;
                                }
                        }
                }

                        
                return obj;
        }

        buscarLibroDiarioEditar(obj) {
                     
                        this.libroDiarioService.getDetalleLibroById(obj.id_conta_libro_diario)
                                .subscribe(
                                data => {

                                        this.lista_detalle_libro = data.detalle_libro_diario;

                                        for( let i=0;i<this.lista_detalle_libro.length;i++){
                                                this.lista_detalle_libro[i].codigo_libro_refe_opera=this.obtenerTipoTablaSunat(this.lista_detalle_libro[i].codigo_libro_refe_opera,8);
                                        }


                                        data.libro_diario.periodo_fecha=data.libro_diario.periodo_fecha.substr(0,10);
                                        this.libroDiarioSelected = data.libro_diario;                                        
                                        this.print(data);
                                },
                                error => this.msj = <any>error);
                
        }


        agregarFilaLibroDiario(cantidad) {

                let i;
                for (i = 0; i < cantidad; i++) {
                        let p = {
                                correlativo: null,
                                fecha_operacion: null,
                                descripcion_operacion: null,
                                codigo_libro_refe_opera: this.tabla_8[0],
                                numero_correlativo_refe_opera: null,
                                numero_documento_refe_opera: null,
                                codigo_cuenta_contable: null,
                                denominacion_cuenta_contable: null,
                                debe_movimiento: null,
                                haber_movimiento: null,
                        }

                        this.lista_detalle_libro.push(p);
                        
                }
        }



        editar() {


                if (this.tienePermisoPrintMsj(this.rutasContabilidad.FORM_LIBRO_DIARIO, this.rutas.BUTTON_ACTUALIZAR)) {

                        
                        let user = this.obtenerUsuario();
                        let f= new Date();

                        let parametros = JSON.stringify({
                                libro_diario:this.libroDiarioSelected,
                                detalle_libro:this.lista_detalle_libro
                        });

                        this.libroDiarioService.editar(parametros, this.libroDiarioSelected.id_conta_libro_diario)
                                .subscribe(
                                data => {
                                        this.obtenerLibrosDiarios();                                        
                                        let rpta = data.rpta;
                                        this.print("rpta: " + rpta);
                                        if (rpta != null) {
                                                if (rpta) {
                                                        this.mensajeCorrecto("LIBRO DIARIO MODIFICADO CORRECTAMENTE");
                                                } else {
                                                        this.mensajeInCorrecto("LIBRO DIARIO  NO MODIFICADA");
                                                }
                                        }

                                },
                                error => this.msj = <any>error
                                );

                }
        }



        eliminar(bean) {

                if (this.tienePermisoPrintMsj(this.rutasContabilidad.FORM_LIBRO_DIARIO, this.rutas.BUTTON_ELIMINAR)) {
                        let user = this.obtenerUsuario();
                        if( confirm("Realmente Desea Eliminar ?")){
                                this.libroDiarioService.eliminarLogico(bean.id_conta_libro_diario)
                                        .subscribe(
                                        data => {
                                                this.obtenerLibrosDiarios();
                                      
                                                let rpta = data;
                                                if (rpta != null) {
                                                        if (rpta == 1) {
                                                                this.mensajeCorrecto("LIBRO DIARIO ELIMINADO CORRECTAMENTE");
                                                        } else {
                                                                this.mensajeInCorrecto("LIBRO DIARIO ELIMINADO NO ELIMINADo");
                                                        }

                                                }
                                        },
                                        error => this.msj = <any>error);
                        }
                }
        }


        registrar() {

                if (this.tienePermisoPrintMsj(this.rutasContabilidad.FORM_LIBRO_DIARIO, this.rutas.BUTTON_REGISTRAR)) {

                        let user = this.obtenerUsuario(); 
                        let f= new Date();

                        let parametros = JSON.stringify({
                                libro_diario:this.libroDiarioSelected,
                                detalle_libro:this.lista_detalle_libro      
                        });

                        this.libroDiarioService.registrar(parametros)
                                .subscribe(
                                data => {
                                        //this.idCompraSelected = data.id_compra
                                        this.obtenerLibrosDiarios();
                                        let rpta = data.rpta;
                                        this.print("rpta: " + rpta);
                                        if (rpta != null) {
                                                if (rpta == 1) {

                                                        this.mensajeCorrectoSinCerrar("LIBRO DIARIO REGISTRADO CORRECTAMENTE  - COD :" + data.id_conta_libro_diario);

                                                } else {
                                                        this.mensajeInCorrecto("LIBRO DIARIO NO REGISTRADO");

                                                }
                                        }

                                },
                                error => this.msj = <any>error
                                );
                }
        }

}