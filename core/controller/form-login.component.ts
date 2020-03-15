import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ControllerComponent } from './controller.component';
import { Router } from '@angular/router';


//*****************IMPORTAR FORMULARIOS PARA VALIDACION**************
import { FormGroup } from '@angular/forms';

//***********IMPORTAR SERVICIOS PARA EL CONTROLADOR*********
import { LoginService } from '../service/Login.Service';


//************OBTENER OBJETOS INICIALES GENERICOS Y COMUNES A TODAS LAS PANTALLAS**********/
import { MarcaService } from '../../subSistemas/mantenedores/service/marca.service';
import { TipoProductoService } from '../../subSistemas/mantenedores/service/tipo-producto.service';
import { AplicacionService } from '../../subSistemas/mantenedores/service/aplicacion.service';
import { TipoMonedaService } from '../../subSistemas/mantenedores/service/tipo-moneda.service';
import { UnidadMedidaService } from '../../subSistemas/mantenedores/service/unidad-medida.service';
import { MedioPagoService } from '../../subSistemas/mantenedores/service/medio-pago.service';
import { LocalService } from '../../subSistemas/mantenedores/service/local.service';
import { CategoriaComprobanteService } from '../../subSistemas/mantenedores/service/categoria-comprobante.service';
import { TipoDocumentoService } from '../../subSistemas/mantenedores/service/tipo-documento.service';
import { TipoPersonaService } from '../../subSistemas/mantenedores/service/tipo-persona.service';
import { TipoContratoService } from '../../subSistemas/mantenedores/service/tipo-contrato.service';
import {StockService} from '../../subSistemas/mantenedores/service/stock.service';
import { ProductoService } from 'src/app/subSistemas/mantenedores/service/producto.service';
import { LetraService } from 'src/app/subSistemas/contabilidad/service/letra.service';




@Component({
        selector: 'app-form-login',
        templateUrl: '../view/form-login.component.html',
        providers: [LoginService,
                TipoProductoService,
                UnidadMedidaService,
                AplicacionService,
                MarcaService,
                LocalService,
                TipoMonedaService,
                MedioPagoService,
                CategoriaComprobanteService,
                TipoDocumentoService,
                TipoPersonaService,
                TipoContratoService,
                StockService,
                ProductoService,
                LetraService
        ]
})
export class FormLoginComponent extends ControllerComponent implements OnInit, AfterViewInit {

        loginForm: FormGroup;

        //*******VARIABLES A UTILIZAR EN EL SISTEMA************
        txt = {
                txtUsuario: { val: 'txtUsuario', label: 'Usuario' },
                txtClave: { val: 'txtClave', label: 'Clave' }
        };
        listaAlmacen:any[];
        almacenSelected:any[] = [];

        pagosLetra:any[];

        StockProducto:any[];
        lista_marcas: any[] = [];
        lista_tipos_producto: any[] = [];
        lista_aplicaciones: any[] = [];
        lista_tipos_moneda: any[] = [];
        lista_unidades_medida: any[] = [];
        lista_locales: any[] = [];
        lista_medios_pago: any[] = [];
        lista_categorias_comprobante: any[] = [];
        lista_tipos_documento: any[] = [];
        lista_tipos_persona: any[] = []; 
        lista_tipos_contrato: any[] = [];
        NumeroNotificaciones:number = 0;
        ProductoSinStock:any[];

        constructor(public router: Router, public loginService: LoginService,

                public tipoProductoService: TipoProductoService,
                public unidadMedidaService: UnidadMedidaService,
                public aplicacionService: AplicacionService,
                public marcaService: MarcaService,
                public localService: LocalService,
                public tipoMonedaService: TipoMonedaService,
                public medioPagoService: MedioPagoService,
                public categoriaComprobanteService: CategoriaComprobanteService,
                public tipoDocumentoService: TipoDocumentoService,
                public tipoPersonaService: TipoPersonaService,
                public tipoContratoService:TipoContratoService,
                public stockService:StockService,
                public productoService:ProductoService,
                public letraService:LetraService
        ) {
                super(router);

                this.loginForm = this.buildForm(this.txt);

                this.validacion(this.txt.txtUsuario, true, true, true);
                this.validacion(this.txt.txtClave, true, true, true);

                //*********ASIGNAR VALORES A LAS PROPIEDADES*******
                //this.setValueTxt(this.txt.txtUsuario,"dflores");
                //this.setValueTxt(this.txt.txtClave,72677832);


        }

        ngOnInit() {
                this.nombreSistema = this.rutas.NOMBRE_SISTEMA;
                this.ProductoSinStock =  new Array();
                this.getAlmacen();
                this.getDayPagoletra()
                
        }

        ngAfterViewInit() {
                this.eliminarAnimacion();
                
        }

        getAlmacen(){

                this.localService.getAll().subscribe(
                        data=>{
                                this.listaAlmacen = data;
                        }
                );

        }

        getDayPagoletra(){

                this.letraService.getDay().subscribe(
                        data =>{
                         this.print(data);
                         this.pagosLetra = data;
                })

        }


        stockProductos(){
                let parametros = JSON.stringify({
                      
                });
              
                this.NumeroNotificaciones= 0;
                this.stockService.buscarPaginacionDetalle(1,10,500000 , parametros)
                        .subscribe(
                                data => {
                                        this.StockProducto =data;
                                   
                                        for (let index = 0; index < this.StockProducto.length; index++) {
                                                if(this.StockProducto[index].cantidad <= 0){
                                        
                                                        this.productoService.getStockByIdProducto(this.StockProducto[index].id_producto,1).subscribe(
                                                                data =>{
                                                                        let total = data;
                                                                     
                                                                        if(total<=0){
                                                                              this.NumeroNotificaciones++;
                                                                              let mensaje=[{

                                                                                      messagez:"<li>"+this.StockProducto[index].nombre_producto+"</li>"
                                                                              }];
                                                                          
                                                                                 this.ProductoSinStock.push(mensaje);
                                                                             
                                                                                
                                                                        }
                                                                    
                                                                        localStorage.setItem("NombreProductosSinStock",JSON.stringify(this.ProductoSinStock));
                                                                        localStorage.setItem("NumerodeNotificaciones",JSON.stringify(this.NumeroNotificaciones));   
                                                                }
                                                                
                                                        );  
                                                      
                                                       
                                                
                                                }
                                        }
                                        
                                       
                                                        
                                      
                                      
                                          
                                          
                                               
                                       
                                        
                                },
                                error => this.msj = <any>error);
                            
          
                 
        }


        ingresar(): void {

                this.print("select");
                this.print(this.almacenSelected);
                if (this.loginForm.valid && this.almacenSelected.length != 0) {
                        //this.router.navigate(['home']);
                        let parametrosJson = JSON.stringify(this.loginForm.value);

                        this.loginService.ingresar(parametrosJson)
                                .subscribe(
                                        data => {
                                                let rpta = data;
                                                if (rpta != null) {
                                                        if (rpta == 1) {

                                                                //*************INDICA SI HA FINALIZADO LA SESION O NO EN TODOS LOS CONTROLADORES***************
                                                                ControllerComponent.finalizaSesion = false;



                                                                //*******************OBTENER LA CONFIGURACION DEL FACTURADOR SUNAT******************/
                                                                let user = this.obtenerUsuario();
                                                                let parametros = JSON.stringify({ id_empresa:user.id_empresa });

                                                                this.loginService.obtenerConfiguracionFacturacion(parametros)
                                                                        .subscribe(
                                                                                data => {
                                                                                        var obj = data;
                                                                                        if (obj != null) {
                                                                                                localStorage.setItem("configuracion_facturador", JSON.stringify(obj));
                                                                                        }
                                                                                      

                                                                                },
                                                                                error => this.msj = <any>error);



                                                                //*************REDIRECCIONAR A LA VISTA PRINCIPAL***************
                                                               // this.stockProductos();
                                             
                                                                localStorage.setItem("almacen_start",JSON.stringify(this.almacenSelected));
                                                                localStorage.setItem("dias_letra",JSON.stringify(this.pagosLetra));
                                                                
                                                                this.router.navigate(['home']);
                                                                this.eliminarFondo();
                                                                

                                                                /**********OBTENER LAS TABLAS COMUNES A TODO****/
                                                                this.obtenerMarcas();
                                                                this.obtenerTiposProducto();
                                                                this.obtenerUnidadesMedida();
                                                                this.obtenerAplicaciones();
                                                                this.obtenerTipoMoneda();
                                                                this.obtenerCategoriasComprobante();
                                                                this.obtenerMediosPago();
                                                                this.obtenerLocales();
                                                                this.obtenerTiposDocumento();
                                                                this.obtenerTiposPersona();
                                                                this.obtenerTiposContrato();
                                                        } else {

                                                                this.mensajeInCorrecto("USUARIO INCORRECTO");
                                                        }
                                                }
                                        },
                                        error => {
                                                let msj = "ERROR: Login - ";
                                                msj += error.statusText;

                                                this.mensajeInCorrecto(msj);
                                        }
                                );
                } else {
                        this.mensajeAdvertencia("RELLENE TODOS LOS CAMPOS");
                }
        }



        /******************OBTENER TODAS LAS TABLAS COMUNES A TODAS LAS PANTALLAS****************/
        obtenerMarcas() {
                this.marcaService.getAll()
                        .subscribe(
                                data => {
                                        this.lista_marcas = data;
                                        localStorage.setItem("lista_marcas", JSON.stringify(this.lista_marcas));
                                },
                                error => this.msj = <any>error);
        }

        obtenerTiposProducto() {

                this.tipoProductoService.getAll()
                        .subscribe(
                                data => {
                                        this.lista_tipos_producto = data;
                                        localStorage.setItem("lista_tipos_producto", JSON.stringify(this.lista_tipos_producto));
                                },
                                error => this.msj = <any>error);
        }

        obtenerUnidadesMedida() {

                this.unidadMedidaService.getAll()
                        .subscribe(
                                data => {
                                        this.lista_unidades_medida = data;
                                        localStorage.setItem("lista_unidades_medida", JSON.stringify(this.lista_unidades_medida));
                                },
                                error => this.msj = <any>error);
        }


        obtenerAplicaciones() {

                this.aplicacionService.getAll()
                        .subscribe(
                                data => {
                                        this.lista_aplicaciones = data;
                                        localStorage.setItem("lista_aplicaciones", JSON.stringify(this.lista_aplicaciones));
                                },
                                error => this.msj = <any>error);
        }

        obtenerTipoMoneda() {

                this.tipoMonedaService.getAll()
                        .subscribe(
                                data => {
                                        this.lista_tipos_moneda = data;
                                        localStorage.setItem("lista_tipos_moneda", JSON.stringify(this.lista_tipos_moneda));
                                },
                                error => this.msj = <any>error);
        }

        obtenerCategoriasComprobante() {

                this.categoriaComprobanteService.getAll()
                        .subscribe(
                                data => {
                                        this.lista_categorias_comprobante = data;
                                        localStorage.setItem("lista_categorias_comprobante", JSON.stringify(this.lista_categorias_comprobante));
                                },
                                error => this.msj = <any>error);
        }

        obtenerMediosPago() {

                this.medioPagoService.getAll()
                        .subscribe(
                                data => {
                                        this.lista_medios_pago = data;
                                        localStorage.setItem("lista_medios_pago", JSON.stringify(this.lista_medios_pago));
                                },
                                error => this.msj = <any>error);
        }

        obtenerLocales() {
                this.localService.getAll()
                        .subscribe(
                                data => {
                                        this.lista_locales = data;
                                        localStorage.setItem("lista_locales", JSON.stringify(this.lista_locales));
                                },
                                error => this.msj = <any>error);
        }

        obtenerTiposDocumento() {

                this.tipoDocumentoService.getAll()
                        .subscribe(
                        data => {this.lista_tipos_documento = data;
                                localStorage.setItem("lista_tipos_documento", JSON.stringify(this.lista_tipos_documento));
                        },
                        error => this.msj = <any>error);
        }


        obtenerTiposPersona() {

                this.tipoPersonaService.getAll()
                        .subscribe(
                        data => {this.lista_tipos_persona = data;
                                localStorage.setItem("lista_tipos_persona", JSON.stringify(this.lista_tipos_persona));
                        },
                        error => this.msj = <any>error);
        }

        obtenerTiposContrato() {
                let parametros = JSON.stringify({ });

                this.tipoContratoService.buscarPaginacion(1, 1000, 1000, parametros)
                        .subscribe(
                        data => {
                                this.lista_tipos_contrato = data;
                                localStorage.setItem("lista_tipos_contrato", JSON.stringify(this.lista_tipos_contrato));
                        },
                        error => this.msj = <any>error);
        }
}
