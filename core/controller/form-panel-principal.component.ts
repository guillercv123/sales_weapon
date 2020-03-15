import { Component, AfterViewInit, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';


import { ControllerComponent } from './controller.component';


/********Servicios*************/
import { LoginService } from '../service/Login.Service';
import { UsuarioService } from '../../subSistemas/mantenedores/service/Usuario.Service';
import { CatalogoVentaService } from '../../subSistemas/mantenedores/service/catalogo-venta.service';
import { TipoCambioService } from '../../subSistemas/mantenedores/service/tipo-cambio.service';
import { ProductoService } from 'src/app/subSistemas/mantenedores/service/producto.service';
import {StockService} from '../../subSistemas/mantenedores/service/stock.service';

declare var $: any;
@Component({
        selector: 'app-form-panel',
        templateUrl: '../view/form-panel-principal.component.html',
        providers: [LoginService,StockService,ProductoService, UsuarioService,CatalogoVentaService,TipoCambioService]
})


export class FormPanelPrincipalComponent extends ControllerComponent implements AfterViewInit, OnInit {


        lista_tipos_cambio:any[];
        usuario: string;
        usuario_id: number;
        imagen: string;
        nombres: string;

        /*----------------Cambio de Contraseña -----------*/
        claveNueva: string = null;
        generoUsuario:string;
        cargoUsuario:string;
        empresaUsuario:string;

        tipoCambioCompra:number;
        tipoCambioVenta:number;
        lista_locales:any[];
        nombreAlmacen:string;
        StockProducto:any[];
        message:string ;
        notas:any [];
        ProductoSinStock:any[];
        IdsProductos:any[];
        CadenaPreMessage:string = "";
        NumeroNotificaciones:number=0;
        letraPagar:any[];



        constructor(public loginService: LoginService, public usuarioService: UsuarioService, public http: Http, public router: Router, private route: ActivatedRoute,
                public catalogoVentaService: CatalogoVentaService,
                public tipoCambioService: TipoCambioService,
                public productoService:ProductoService,
                public stockService:StockService) {
                super(router);
        }




        ngOnInit() {
                this.notas = new Array();
                this.nombreSistema=this.rutas.NOMBRE_SISTEMA;
                this.IdsProductos = new Array(); 
                this.lista_locales = new Array();
                this.ProductoSinStock = new Array();
                this.letraPagar = new Array();

                let array_almacen = JSON.parse(localStorage.getItem("almacen_start"));
                let day_letra = JSON.parse(localStorage.getItem("dias_letra"));
                
                this.lista_locales.push(array_almacen);
                this.letraPagar.push(day_letra);

                this.nombreAlmacen= this.lista_locales[0].nombre;
                //let user = JSON.parse(this.obtenerDatosUsuario());
                let user=this.obtenerUsuario();
                this.print("user SESION:");
                this.print(user);
                if (user != null) {
                        this.usuario = user.usuario;
                        this.nombres = user.nombres;
                        this.generoUsuario=user.genero;
                        this.cargoUsuario=user.nombre_cargo;
                        this.empresaUsuario=user.nombre_empresa;
                }
                // let array_notas = JSON.parse(localStorage.getItem("NombreProductosSinStock"));
                // this.ProductoSinStock = array_notas;
                // let notificaciones = JSON.parse(localStorage.getItem("NumerodeNotificaciones"));
                // this.NumeroNotificaciones  =notificaciones;
               this.CalcularDias();
                //  $('#example').popover({ html : true,
                //          content : '<ul>'+ this.letraPagar[0] +'</ul>',
                //         placement:'bottom' }); 

              //  this.stockProductos(this.inicio,this.fin,this.tamPagina);
            
        }

        ngAfterViewInit() {



                if (this.verificarTokenRpta(this.rutasMantenedores.FORM_PRINCIPAL)) {

                        

                        let l = document.getElementById("menu-principal-dfa");

                        let menuHTML = JSON.parse(localStorage.getItem("menu"));
                      

                        l.innerHTML = menuHTML;
                        this.eliminarAnimacion();

                        if (!ControllerComponent.cargarScript) {
                                this.cargarScriptAdmin();
                                this.print("CARGANDO SCRIPT");
                        } else {
                                this.eliminarScriptAdmin();
                                this.cargarScriptAdmin();
                                this.print("ELIMINANDO Y CARGANDO SCRIPT");
                        }

                        //this.route.params.subscribe(params => { }); 



                        let user = JSON.parse(this.obtenerDatosUsuario());

                        this.print("user: ");
                        this.print(user);
                        this.print("persona: " + user.nombres);
                        this.nombres = "diego";
                        if (user != null) {
                                this.usuario = user.usuario;
                                this.nombres = user.nombres;
                                this.usuario_id = user.idUsuario;
                                localStorage.setItem("usuario_id", "" + this.usuario_id);
                                this.print("----------------->");
                                this.print(user);
                                //console.log(this.usuario_id);
                                //console.log(localStorage.getItem("usuario_id"));
                                if (localStorage.getItem("cambio") == null && user.cambio_clave == 0) {
                                        localStorage.setItem("cambio", "true");
                                        this.abrirCambioClave();
                                }
                        };
                    
                      //  this.print(this.IdsProductos)
                        // for (let index = 0; index <this.IdsProductos.length; index++) {
                        //         this.message += "<li>" +this.IdsProductos[index].nombre+"</li>"             
                        // }
                        // $('#example').popover({ html : true,
                        //         content : '<ul>'+this.message +'</ul>',
                        //         placement:'bottom' }); 

                        //this.abrirTipoCambio();
                        
                }

        }
        abrirModalProductoSinStock(){
                this.abrirModal("modalProductoSinStock");
        }

        CalcularDias(){
                  this.print("objeto de pagar letra");
                  if(this.letraPagar[0] == null){
                        this.print("mensaje");
                        this.print(this.CadenaPreMessage);
                         $('#example').popover({ html : true,
                                content : '<ul><li>NO TIENE LETRAS PENDIENTES</li></ul>',
                               placement:'bottom',
                               delay: { "show": 500, "hide": 100 },
                               trigger:'hover' }); 
                  }else{
                        
               for (let index = 0; index < this.letraPagar[0].length; index++) {
                if(this.letraPagar[0][index].dias <=2){

                  this.NumeroNotificaciones++;
                  //let ruc = this.letraPagar[0][index].ruc_proveedor;
                  this.CadenaPreMessage += '<li><b>RUC:</b>'+this.letraPagar[0][index].ruc_proveedor +'<BR> <b>TIENE UNA LETRA QUE PAGAR LA FECHA:</b>'+this.letraPagar[0][index].fecha_vencimiento +'</li>';
              }
                   
           }

           if(this.NumeroNotificaciones==0){

                  this.print("mensaje");
                  this.print(this.CadenaPreMessage);
                   $('#example').popover({ html : true,
                          content : '<ul><li>NO TIENE LETRAS PENDIENTES</li></ul>',
                         placement:'bottom',
                         delay: { "show": 500, "hide": 100 },
                         trigger:'hover' }); 
 
           }else{

                  this.print("mensaje");
                  this.print(this.CadenaPreMessage);
                   $('#example').popover({ html : true,
                          content : '<ul>'+this.CadenaPreMessage+'</ul>',
                         placement:'bottom',
                         delay: { "show": 500, "hide": 100 },
                         trigger:'hover' }); 
 
           }
                }
                     
                

        }
       
        abrirCambioClave() {
                var abrirModal = <HTMLButtonElement>document.getElementById("abrirModal");
                this.print(abrirModal);
                abrirModal.click();

        }

        //  abrirTipoCambio() {

        //          let fecha_actual= this.obtenerFechaActual();
        //          let para = JSON.stringify({
        //                  id_tipo_cambio: null,
        //                  fecha:fecha_actual,
        //                  precio_compra: null,
        //                  precio_venta: null
        //          });

        //          this.tipoCambioService.buscarPaginacion(1, 1, 10, para)
        //                  .subscribe(
        //                          data => {
        //                                  let listaTipoCambio = data;
        //                                  if(this.isArrayVacio(listaTipoCambio)){
        //                                          this.abrirModal("modalTipoCambio");
        //                                          let parametros = JSON.stringify({
        //                                                 anio:fecha_actual.substr(0,4),
        //                                                 mes:fecha_actual.substr(5,2)
        //                                          });
        //                                          this.tipoCambioService.obtenerTipoCambioSunat(parametros)  
        //                                          .subscribe(
        //                                                  data => {
        //                                                         this.lista_tipos_cambio=data;  
        //                                                         if(this.lista_tipos_cambio!=null){
        //                                                          if(this.lista_tipos_cambio.length>0){
        //                                                                  this.tipoCambioCompra=this.lista_tipos_cambio[0].precio_compra;
        //                                                                  this.tipoCambioVenta=this.lista_tipos_cambio[0].precio_venta;

        //                                                          } 
        //                                                         }  
        //                                                  },
        //                                                  error => this.msj = <any>error);     
        //                                  }
                                       
        //                          },
        //                          error => this.msj = <any>error);
                          
        //  }


        establecerTipoCambio(){
                if(this.tipoCambioVenta!=null){
                        if(this.tipoCambioVenta>0){

                                this.registrarTipoCambioActual(this.tipoCambioCompra,this.tipoCambioVenta);
                                this.actualizarTipoCambioMasivo(this.tipoCambioVenta);

                                //localStorage.setItem("tipo_cambio",this.tipoCambio+"");                                                     
                                this.cerrarModal("modalTipoCambio"); 
                        }else{
                                this.mensajeInCorrecto("TIPO DE CAMBIO DEBE SER MAYOR A 1");
                        }
                }else{
                        this.mensajeInCorrecto("TIPO DE CAMBIO VACIO");
                }        
                
        }

        registrarTipoCambioActual(tipo_cambio_compra, tipo_cambio_venta){
                let fecha_actual= this.obtenerFechaActual();

                let para = JSON.stringify({
                        id_tipo_cambio: null,
                        fecha:fecha_actual,
                        precio_compra: null,
                        precio_venta: null
                });

                this.tipoCambioService.buscarPaginacion(1, 1, 10, para)
                        .subscribe(
                                data => {
                                        let listaTipoCambio = data;

                                        if (this.isArrayVacio(listaTipoCambio)) {
                                                let parametros = JSON.stringify({
                                                        fecha: fecha_actual,
                                                        precio_compra: tipo_cambio_compra,
                                                        precio_venta: tipo_cambio_venta
                                                });
                                                this.tipoCambioService.registrar(parametros)
                                                        .subscribe(
                                                                data => {

                                                                        let rpta = data.rpta;
                                                                        this.print("rpta: " + rpta);
                                                                        if (rpta != null) {
                                                                                if (rpta == 1) {
                                                                                        this.print("TIPO  CAMBIO REGISTRADO");
                                                                                } else {
                                                                                        this.print("TIPO CAMBIO NO REGISTRADO");
                                                                                }
                                                                        }


                                                                },
                                                                error => this.msj = <any>error
                                                        );
                                        }else{
                                                this.print("TIPO DE CAMBIO YA ESTA REGISTRADO");
                                        }

                                        this.print(data);
                                },
                                error => this.msj = <any>error);
        }


        actualizarTipoCambioMasivo(tc_masivo) {
                let parametros = JSON.stringify({
                        tipo_cambio:tc_masivo
                });

                this.catalogoVentaService.actualizarTipoCambioMasivo( parametros)
                        .subscribe(
                        data => {
                               let nro_filas=data;
                               if(nro_filas>=0){
                                        this.print("ACTUALIZACION DE TIPO DE CAMBIO CORRECTA");
                                }else{
                                        this.print("ACTUALIZACION ERRONEA DE TIPO DE CAMBIO");
                               }
                                this.print(data);
                        },
                        error => this.msj = <any>error);
        }


        cerrarSesion() {
                localStorage.removeItem("jwt");
                localStorage.removeItem("user");
                localStorage.removeItem("permisos");
                localStorage.removeItem("menu");
                localStorage.removeItem("almacenes");
                localStorage.removeItem("configuracion_facturador");
                //localStorage.removeItem("tipo_cambio");

                //this.agregarAnimacion();
                this.navegar("");

                /******AGREGAR ESTILO AL BODY****/

                //$("body").addClass("hold-transition ");
                this.agregarFondo();

                /*****ELIMINAR TABLAS OBTENIDAS***/
                localStorage.removeItem("lista_marcas");
                localStorage.removeItem("lista_tipos_producto");
                localStorage.removeItem("lista_aplicaciones");
                localStorage.removeItem("lista_tipos_moneda");
                localStorage.removeItem("lista_unidades_medida");
                localStorage.removeItem("lista_locales");
                localStorage.removeItem("lista_medios_pago");
                localStorage.removeItem("lista_categorias_comprobante");
                localStorage.removeItem("lista_tipos_documento");
                localStorage.removeItem("lista_tipos_persona");
                localStorage.removeItem("lista_tipos_contrato");
        }





        private obtenerDatosUsuario(): any {
                let user = JSON.parse(localStorage.getItem("user"));
                if (user != null) {

                        let us = JSON.stringify({ usuario: user.usuario, nombres: user.nombres });
                        return us;
                } else {
                        user = JSON.stringify({ usuario: "SIN USUARIO", nombres: "SIN NOMBRES" });
                        return user;
                }

        }
    

        cambiarContrasenia() {

                if (this.claveNueva != null) {

                        if (this.claveNueva != "") {

                                let user = this.obtenerUsuario();
                                let parametros = JSON.stringify({
                                        ulogin: user.usuario,
                                        clave: this.claveNueva,
                                        id_empleado: user.id_empleado
                                });

                                this.print("parametros: " + parametros);
                                this.usuarioService.editar(parametros, user.id_usuario)
                                        .subscribe(
                                        data => {
                                                let rpta = data.rpta;
                                                this.print("rpta: " + rpta);
                                                if (rpta != null) {
                                                        if (rpta == 1) {
                                                                this.mensajeCorrecto("CLAVE MODIFICADA CORRECTAMENTE");
                                                        } else {
                                                                this.mensajeInCorrecto("CLAVE NO MODIFICADA");
                                                        }
                                                }

                                        },
                                        error => this.msj = <any>error
                                        );
                        } else {
                                this.mensajeAdvertencia("CAMPOS EN BLANCO");
                        }
                } else {
                        this.mensajeAdvertencia("CAMPOS EN BLANCO");
                }

        }

        seleccionar(obj){
                this.tipoCambioCompra=obj.precio_compra;
                this.tipoCambioVenta=obj.precio_venta;
        }

}

