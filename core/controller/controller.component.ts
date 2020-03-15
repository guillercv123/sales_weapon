import { Component} from '@angular/core';
import { Router } from '@angular/router';
//declare var $ =require('lib/js/jquery-1.9.1.js');

//*****************IMPORTAR FORMULARIOS PARA VALIDACION**************
import { FormGroup, FormBuilder, Validators } from '@angular/forms';


import { Rutas } from '../util/rutas';
import { RutasMantenedores } from '../../subSistemas/mantenedores/util/rutas-mantenedores';
import { RutasCompras } from '../../subSistemas/compras/util/rutas-compras';
import { RutasVentas } from '../../subSistemas/ventas/util/rutas-ventas';
import { RutasInventario } from '../../subSistemas/inventario/util/rutas-inventario';
import { RutasContabilidad } from '../../subSistemas/contabilidad/util/rutas-contabilidad';


import { ReportePdfService } from '../service/reporte-pdf.Service';
import { ReporteExcelService } from '../service/reporte-excel.Service';


declare var $: any;
export class ControllerComponent {
        public nombreSistema:string;

        public transferido:boolean=false;
        public tienePermisoView: boolean = true;
        protected item: string = "";
        protected menuItem: string = "";

        protected rutas: Rutas = new Rutas();
        protected rutasMantenedores: RutasMantenedores = new RutasMantenedores();
        protected rutasCompras: RutasCompras = new RutasCompras();
        protected rutasVentas: RutasVentas = new RutasVentas();
        protected rutasInventario: RutasInventario = new RutasInventario();
        protected rutasContabilidad: RutasContabilidad = new RutasContabilidad();

        /*****ALERTAS PARA FORMULARIO*****/
        success: boolean = false;
        completado: boolean = false;
        msj: string;
        msj1: string;
        msj2: string;
        tipoAlerta: string;
        iconoAlerta: string;

        public static hilo: any;

        /*public static usuario:string;
        public static nombre:string;
        public static apellido:string;*/


        public static finalizaSesion: boolean = false;


        /*************VARIABLE PARA CARGAR JAVASCRIPT EN CONTROLADOR MAIN****************/
        public static cargarScript: boolean = false;
        public static cargarDatatableScript: boolean = false;


        //************OBJETOS PARA VALIDAR LOS FORMULARIOS************

        formErrors;
        validationMessages;
        /* validaciones = {
             'required':      'Campo es requerido.',
             'minlength':     'Campo tiene que tener como minimo 4 caracteres.',
             'maxlength':     'Campo tiene que tener como maximo 24 caracteres.',
         };*/



        private formu: FormBuilder;
        private formulario: FormGroup;


        //**************PAGINACION*************
        tamPagina: number =10;
        inicio: number = 1;
        fin: number = 10;
        totalLista:number;
        totalListaDetalle:number;


        constructor(protected router: Router,  public reportePdfService?:ReportePdfService,
                public reporteExcelService?:ReporteExcelService) {

                this.success = false;
                this.msj = "";
                this.tipoAlerta = "";
                this.iconoAlerta = "";
                this.formu = new FormBuilder();
        }

        navegar(ruta: string): void {
                //$('#sidebar-menu li').addClass('active');
                //$('#sidebar-menu li ul').slideDown(); 
                // $('#sidebar-menu li').addClass('active');
                this.router.navigate([ruta]);
        }


        /*verificarToken():boolean{
           let rpta=false;
           let jwt=localStorage.getItem("jwt");

           if(jwt!=null){
             rpta=true;
           }
           
           return rpta;
        }*/


        isArrayVacio(lista){
                let existeTipo =true ;
                if (lista != null) {
                        if (lista.length > 0) {
                                existeTipo = false;
                        } else {
                                existeTipo = true;
                        }
                } else {
                        existeTipo = true;
                }
                return existeTipo;
        }
 


        obtenerUsuario(): any {
                let user = JSON.parse(localStorage.getItem("user"));
                if (user != null) {
                        return user;
                } else {
                        return null;
                }

        }

        obtenerConfiguracionFacturador(): any {
                let facturador = JSON.parse(localStorage.getItem("configuracion_facturador"));
                if (facturador != null) {
                        return facturador;
                } else {
                        return null;
                }

        }

        obtenerAlmacenes(): any {
                let almacenes = JSON.parse(localStorage.getItem("almacenes"));
                if (almacenes != null) {
                        return almacenes;
                } else {
                        return null;
                }

        }

        verificarToken(vista: string) {
                let jwt = localStorage.getItem("jwt");

                if (jwt != null) {
                        //rpta=true;
                        this.print("/************TIENE TOKEN VALIDO****************/");

                        if (!this.tienePermiso(vista, this.rutas.VISUALIZAR_VIEW)) {
                                this.mensajeInCorrecto("NO TIENE PERMISO PARA ESTA PANTALLA");
                                this.tienePermisoView = false;
                        }

                } else {
                        this.print("/************NO TIENE TOKEN VALIDO************/");
                        this.navegar("");
                }

        }


        verificarTokenPanel(vista: string) {
                let jwt = localStorage.getItem("jwt");

                if (jwt != null) {
                        //rpta=true;
                        this.print("/************TIENE TOKEN VALIDO****************/");
                        if (!this.tienePermiso(vista, this.rutas.VISUALIZAR_VIEW)) {
                                this.mensajeInCorrecto("NO TIENE PERMISO PARA ESTA PANTALLA");
                                this.tienePermisoView = false;
                                this.router.navigate(['home']);
                        }

                } else {
                        this.print("/************NO TIENE TOKEN VALIDO************/");
                        this.navegar("");
                }

        }


        verificarTokenRpta(vista: string): boolean {
                let rpta = false;
                let jwt = localStorage.getItem("jwt");

                if (jwt != null) {
                        this.print("/************TIENE TOKEN VALIDO****************/");

                       // if (!this.tienePermiso(vista, this.rutas.VISUALIZAR_VIEW)) {
                         //       this.mensajeInCorrecto("NO TIENE PERMISO PARA ESTA PANTALLA");
                           //     this.tienePermisoView = false;
                             //   rpta = false;
                       // } else {
                                rpta = true;
                    //    }

                } else {
                        this.print("/************NO TIENE TOKEN VALIDO************/");
                        this.navegar("");
                }
                return rpta;
        }



        tienePermiso(vista: string, accion: string) {
                let rpta = false;
                let permisos = JSON.parse(localStorage.getItem("permisos"));

                if (permisos != null) {
                        let permisoVista = permisos[vista];

                        if (permisoVista != null) {
                                let i;
                                for (i = 0; i < permisoVista.length; i++) {
                                        if (permisoVista[i] == accion) {
                                                //this.print("permiso encontrado :i: "+i +",permisoVista[i]: "+permisoVista[i]);
                                                rpta = true;
                                                break;
                                        }
                                }
                        }
                }
                this.print("rpta: " + rpta);
                return rpta;

        }


        tienePermisoPrintMsj(vista: string, accion: string) {
                let rpta = false;
                let permisos = JSON.parse(localStorage.getItem("permisos"));

                if (permisos != null) {
                        let permisoVista = permisos[vista];

                        if (permisoVista != null) {
                                let i;
                                for (i = 0; i < permisoVista.length; i++) {
                                        if (permisoVista[i] == accion) {
                                                rpta = true;
                                                break;
                                        }
                                }
                        }
                }

                if (rpta == false) {
                        this.mensajeInCorrecto("USTED NO TIENE PERMISO PARA ESTA ACCION");
                }
                return rpta;

        }


        tokenInvalido(json: any): boolean {
                let rpta = false;

                if (json.hasOwnProperty("tokenInvalido")) {
                        let tokenInvalido = json.tokenInvalido;
                        if (tokenInvalido) {
                                rpta = true;
                                localStorage.removeItem("jwt");
                                //localStorage.setItem("tokenInvalido",true);
                                this.mensajeInCorrecto("SESIÓN EXPIRADA - INICIAR SESIÓN");
                                this.navegar("");

                        }
                }

                return rpta;
        }


        animar() {

                /************ANIMACION CON JQUERY ANGULAR 2********************/
                $(this.item).parent().addClass('active');
                $(this.item).addClass('active');


                $(this.menuItem).addClass('active');
                $('ul', this.menuItem).slideDown();
        }

        mensajeAdvertencia(mensaje: string, mensaje1?: string, mensaje2?: string) {
                /*this.success=true;
                this.tipoAlerta="alert-warning";
                this.iconoAlerta="fa-close";
                this.msj=mensaje;
                this.msj1=mensaje1;
                this.msj2=mensaje2;*/
               /* $("#contenido2-alerta").text("");
                
                $("#tipo-alerta").removeClass();
                $("#tipo-alerta").addClass("alert-warning login-panel alert");
                $("#icono-alerta").removeClass();
                $("#icono-alerta").addClass("fa-close icon-tama");
                $("#contenido-alerta").text(mensaje);
                $("#contenido2-alerta").text(mensaje1);
                this.abrirAlerta();*/
              
                this.notificacionAdvertencia(mensaje);
        }

        mensajeInCorrecto(mensaje: string, mensaje1?: string, mensaje2?: string) {
                /*this.success=true; 
                this.tipoAlerta="alert-danger";
                this.iconoAlerta="fa-close";
                this.msj=mensaje;
                this.msj1=mensaje1;
                this.msj2=mensaje2;*/
               /* $("#contenido2-alerta").text("");

                $("#tipo-alerta").removeClass();
                $("#tipo-alerta").addClass("alert-danger login-panel alert");
                $("#icono-alerta").removeClass();
                $("#icono-alerta").addClass("fa-close icon-tama");
                $("#contenido-alerta").text(mensaje);
                $("#contenido2-alerta").text(mensaje1);
                this.abrirAlerta();*/
                this.notificacionInCorrecta(mensaje);
        }




        mensajeCorrecto(mensaje: string, mensaje1?: string, mensaje2?: string) {
                /*this.success=true; 
                this.tipoAlerta="alert-success";
                this.iconoAlerta="fa-check";
                this.msj=mensaje;
                this.msj1=mensaje1;
                this.msj2=mensaje2;*/
                $("#contenido2-alerta").text("");

                $("#tipo-alerta").removeClass();
                $("#tipo-alerta").addClass("alert-success login-panel alert");
                $("#icono-alerta").removeClass();
                $("#icono-alerta").addClass("fa-check icon-tama");
                $("#contenido-alerta").text(mensaje);
                $("#contenido2-alerta").text(mensaje1);

                this.abrirAlerta();
                setTimeout(() => { this.cerrarAlerta(); }, 900);
        }


        notificacionCorrecta(mensaje,titulo?){
                titulo=titulo==null?"ALERTA":titulo;
                $.toast({
                        heading: titulo,
                        text: mensaje,
                        icon: 'success',
                        loader: false,        // Change it to false to disable loader
                        loaderBg: '#9EC600' , // To change the background
                        showHideTransition: 'slide',//plain,fade, slide, 
                        hideAfter:3000, //false, 
                        position: 'top-right',
                        //textAlign: 'center', 
                      })
        }

        notificacionInCorrecta(mensaje,titulo?){
                titulo=titulo==null?"ALERTA":titulo;
                $.toast({
                        heading: titulo,
                        text: mensaje,
                        icon: 'error',
                        loader: false,        // Change it to false to disable loader
                        loaderBg: '#9EC600' , // To change the background
                        showHideTransition: 'slide',//plain,fade, slide, 
                        hideAfter:5000, //false, 
                        position: 'top-right',
                        //textAlign: 'center', 
                      })
        }

        notificacionAdvertencia(mensaje,titulo?){
                titulo=titulo==null?"ALERTA":titulo;
                $.toast({
                        heading: titulo,
                        text: mensaje,
                        icon: 'warning',
                        loader: false,        // Change it to false to disable loader
                        loaderBg: '#9EC600' , // To change the background
                        showHideTransition: 'slide',//plain,fade, slide, 
                        hideAfter:3000, //false, 
                        position: 'top-right',
                        //textAlign: 'center', 
                      })
        }

        notificacionInformacion(mensaje,titulo?){
                titulo=titulo==null?"ALERTA":titulo;
                $.toast({
                        heading: titulo,
                        text: mensaje,
                        icon: 'info',
                        loader: false,        // Change it to false to disable loader
                        loaderBg: '#9EC600' , // To change the background
                        showHideTransition: 'slide',//plain,fade, slide, 
                        hideAfter:3000, //false, 
                        position: 'top-right',
                        //textAlign: 'center',  
                      })
        }

        mensajeCorrectoSinCerrar(mensaje: string, mensaje1?: string, mensaje2?: string) {
                /*this.success=true; 
                this.tipoAlerta="alert-success";
                this.iconoAlerta="fa-check";
                this.msj=mensaje;
                this.msj1=mensaje1;
                this.msj2=mensaje2;*/
 
                $("#contenido2-alerta").text("");

                $("#tipo-alerta").removeClass();
                $("#tipo-alerta").addClass("alert-success login-panel alert");
                $("#icono-alerta").removeClass();
                $("#icono-alerta").addClass("fa-check icon-tama");
                $("#contenido-alerta").text(mensaje);
                $("#contenido2-alerta").text(mensaje1);

                this.abrirAlerta();
     
        }


        mensajeInCorrectoSinCerrar(mensaje: string, mensaje1?: string, mensaje2?: string) {
                /*this.success=true; 
                this.tipoAlerta="alert-success";
                this.iconoAlerta="fa-check";
                this.msj=mensaje;
                this.msj1=mensaje1;
                this.msj2=mensaje2;*/
 
                $("#contenido2-alerta").text("");

                $("#tipo-alerta").removeClass();
                $("#tipo-alerta").addClass("alert-danger login-panel alert");
                $("#icono-alerta").removeClass();
                $("#icono-alerta").addClass("fa-close icon-tama");
                $("#contenido-alerta").text(mensaje);
                $("#contenido2-alerta").text(mensaje1);

                this.abrirAlerta();
     
        }


        abrirAlerta() {
                $("#mensaje-alerta").dialog({
                        autoOpen: false,
                        modal: true,
                        show: "bounce",
                        hide: "explode",
                        //width: 'auto', // overcomes width:'auto' and maxWidth bug
                        width: $(window).width() > 600 ? 600 : 'auto',
                        maxWidth: 600,
                        height: 'auto',
                        fluid: true, //new option
                        my: "center",
                        at: "center",
                        of: window
                });

                $('#mensaje-alerta').dialog("open");

        }


        cerrarAlerta() {
                $("#mensaje-alerta").dialog("close");
        }


        abrirModalPorc(id_modal,porc) {
                
                                let tam = $(window).width();
                                let eva = tam > 780 ? 60 : 90;
                                //this.print("tamaño pantalla:" + tam);
                                //this.print("eva pantalla:" + eva);
                                //$("#" + id_modal + "Pnl div.modal-dialog").css("width", (tam > 780 ? (tam-200) : (tam-100)));
                                $("#" + id_modal + "Pnl div.modal-dialog").css("width", (porc) +"%");
                                $("#" + id_modal).click();
                                //this.print( $("#"+id_modal+"Pnl div.modal-dialog").text())
        }

        abrirModal(id_modal) {

                let tam = $(window).width();
                let eva = tam > 780 ? 60 : 90;
                //this.print("tamaño pantalla:" + tam);
                //this.print("eva pantalla:" + eva);
                //$("#" + id_modal + "Pnl div.modal-dialog").css("width", (tam > 780 ? (tam-200) : (tam-100)));
                $("#" + id_modal + "Pnl div.modal-dialog").css("width", (tam > 780 ? 80 : 90) +"%");
                $("#" + id_modal).click();
                //this.print( $("#"+id_modal+"Pnl div.modal-dialog").text())
        }

        abrirModalRef(id_modal,id_referencia) {

                let tam = $(window).width();
                let eva = tam > 780 ? 60 : 90;
                //this.print("tamaño pantalla:" + tam);
                //this.print("eva pantalla:" + eva);
                $("#" + id_modal + "Pnl div.modal-dialog").css("width", (tam > 780 ? (tam-400) : (tam-100)));
                $("#" + id_modal).click();
                //this.print( $("#"+id_modal+"Pnl div.modal-dialog").text())
        }

        cerrarModal(id_modal) {
                $("#" + id_modal).click();
        }


        abrirModalPDf(id_modal) {

                let tam = $(window).width();
                let alto = $(window).height();
                let eva = tam > 780 ? 60 : 90;
                //this.print("tamaño pantalla:" + tam);
                //this.print("eva pantalla:" + eva);
                $("#" + id_modal + "Pnl div.modal-dialog").css("width", (tam > 780 ? 60 : 90) + "%");
                $("#" + id_modal + "Pnl div.modal-dialog div.modal-content div.modal-body").css("height", (alto - 300) + "px");
                $("#" + id_modal).click();
                //this.print( $("#"+id_modal+"Pnl div.modal-dialog").text())
        }

        abrirModalPDfPorc(id_modal,porc) {
                
                                let tam = $(window).width();
                                let alto = $(window).height();
                               
                                //this.print("tamaño pantalla:" + tam);
                                //this.print("eva pantalla:" + eva);
                                $("#" + id_modal + "Pnl div.modal-dialog").css("width", (porc) + "%");
                                $("#" + id_modal + "Pnl div.modal-dialog div.modal-content div.modal-body").css("height", (alto - 100) + "px");
                                $("#" + id_modal).click();
                                //this.print( $("#"+id_modal+"Pnl div.modal-dialog").text())
        }


        abrirModalPDfPorcWidth(id_modal,porc) {
                
                let tam = $(window).width();
                let alto = $(window).height();
               
                //this.print("tamaño pantalla:" + tam);
                //this.print("eva pantalla:" + eva);
                $("#" + id_modal + "Pnl div.modal-dialog").css("width", (porc) + "%");
                $("#" + id_modal + "Pnl div.modal-dialog div.modal-content div.modal-body").css("height",100+"%");
                $("#" + id_modal).click();
                //this.print( $("#"+id_modal+"Pnl div.modal-dialog").text())
}


        /*cerrarModal() {

        }*/


        limpiarMensaje() {
                this.success = false;
                this.msj = null;
                this.iconoAlerta = null;
                this.tipoAlerta = null;
        }


        obtenerFechaMesAnio(str: string) {
                let fecha = str.substring(5, 7) + "-" + str.substring(0, 4);
                return fecha;
        }


        obtenerFechaActual(){
                var hoy = new Date();
                var dd = hoy.getDate();
                var mm = hoy.getMonth() + 1; //hoy es 0!
                var yyyy = hoy.getFullYear();

                var dd1 = "" + dd;
                var mm1 = "" + mm;
                if (dd < 10) { dd1 = '0' + dd; }
                if (mm < 10) { mm1 = '0' + mm; }

                let fecha =yyyy+'-'+ mm1 +'-'+dd1;

                return fecha;

        }


        convertirFechaMysql(hoy){
                var dd = hoy.getDate();
                var mm = hoy.getMonth() + 1; //hoy es 0!
                var yyyy = hoy.getFullYear();

                var dd1 = "" + dd;
                var mm1 = "" + mm;
                if (dd < 10) { dd1 = '0' + dd; }
                if (mm < 10) { mm1 = '0' + mm; }

                let fecha =yyyy+'-'+ mm1 +'-'+dd1;

                return fecha;

        }

        //***************FUNCIONES NECESARIAS PARA**********
        onValueChanged(data?: any, formu?: any) {
                if (!formu) { return; }
                const form = formu;

                for (const field in this.formErrors) {
                        // clear previous error message (if any)
                        this.formErrors[field] = '';
                        const control = form.get(field);

                        if (control && control.dirty && !control.valid) {
                                const messages = this.validationMessages[field];
                                for (const key in control.errors) {
                                        this.formErrors[field] += messages[key] + ' ';
                                }
                        }
                }
        }


        generarMsj(propiedad, min?, max?) {

                let mi = min == null ? 8 : min;
                let ma = max == null ? 35 : max;

                let msjs = new Array();
                msjs['required'] = ' es requerido.';
                msjs['minlength'] = ' tiene que tener como minimo ' + mi + ' caracteres.';
                msjs['maxlength'] = ' tiene que tener como minimo ' + ma + ' caracteres.';

                let validadores = ['required', 'minlength', 'maxlength'];

                //let validadores =['required'];

                //********SIRVE PARA GENERAR VALIDACIONES PERSONALIZADAS */
                let messa = "{";
                let k;
                for (k = 0; k < validadores.length; k++) {
                        if (k == validadores.length - 1) {
                                messa += "\"" + validadores[k] + "\": \"" + propiedad + msjs[validadores[k]] + "\"";
                        } else {
                                messa += "\"" + validadores[k] + "\": \"" + propiedad + msjs[validadores[k]] + "\",";
                        }
                }
                messa += "}";

                //this.print("valida json: "+messa);
                //let validationMessages=JSON.parse(messa);
                //this.print(validationMessages);

                return messa;
        }



        setVariables(propiedades: any, etiquetas: any) {

                //********SIRVE PARA MAPEAR TODAS LAS VARIABLES QUE CONTENDRAN ERRORES */
                let errores = "{";
                let i;
                for (i = 0; i < propiedades.length; i++) {
                        if (i == propiedades.length - 1) {
                                errores += "\"" + propiedades[i] + "\": \"\"";
                        } else {
                                errores += "\"" + propiedades[i] + "\": \"\",";
                        }
                }
                errores += "}";
                this.formErrors = JSON.parse(errores);
                //this.print("errores json: "+errores);
                //this.print(this.formErrors);

                //********SIRVE PARA MAPEAR TODOS LOS MENSAJES DE ERRORES QUE SE OBTENDRAN POR VARIABLE */
                let valida = "{";
                let j;
                for (j = 0; j < propiedades.length; j++) {
                        //this.generarMsj(propiedades[j]);

                        //this.print(etiquetas[propiedades[j]]);
                        if (j == propiedades.length - 1) {
                                //valida+="\""+propiedades[j]+"\": "+ this.generarMsj(propiedades[j]);
                                valida += "\"" + propiedades[j] + "\": " + this.generarMsj(etiquetas[propiedades[j]]);
                        } else {
                                //valida+="\""+propiedades[j]+"\": "+ this.generarMsj(propiedades[j])+",";
                                valida += "\"" + propiedades[j] + "\": " + this.generarMsj(etiquetas[propiedades[j]]) + ",";
                        }
                }

                valida += "}";
                this.validationMessages = JSON.parse(valida);

                //let nom=Object.keys(etiquetas);
                //this.print("valida json: "+valida);
                //this.print(this.validationMessages);
        }


        //*********CONSTRUIR FORMULARIOS*************
        buildForm2(propiedades, etiquetas) {

                let form;
                let variables = "{";
                let i;
                for (i = 0; i < propiedades.length; i++) {
                        if (i == propiedades.length - 1) {
                                variables += "\"" + propiedades[i] + "\": []";
                        } else {
                                variables += "\"" + propiedades[i] + "\": [],";
                        }
                }
                variables += "}";
                let arreglo = JSON.parse(variables);

                form = this.formu.group(arreglo);

                this.setVariables(Object.keys(form.value), etiquetas);

                form.valueChanges
                        .subscribe(data => this.onValueChanged(data, form));
                this.onValueChanged(form); // (re)set validation messages now

                this.formulario = form;

                return form;
        }


        buildForm(vars) {
                let propiedades = Object.keys(vars);

                let form;
                let variables = "{";
                let i;
                for (i = 0; i < propiedades.length; i++) {
                        if (i == propiedades.length - 1) {
                                variables += "\"" + propiedades[i] + "\": []";
                        } else {
                                variables += "\"" + propiedades[i] + "\": [],";
                        }
                }
                variables += "}";
                let arreglo = JSON.parse(variables);
                form = this.formu.group(arreglo);


                /***********CREAR ETIQUETAS***********/
                let eti = "{";
                for (i = 0; i < propiedades.length; i++) {
                        if (i == propiedades.length - 1) {
                                eti += "\"" + propiedades[i] + "\":\"" + vars[propiedades[i]].label + "\"";
                        } else {
                                eti += "\"" + propiedades[i] + "\": \"" + vars[propiedades[i]].label + "\",";
                        }
                }
                eti += "}";
                let etiquetas = JSON.parse(eti);



                this.setVariables(Object.keys(form.value), etiquetas);

                form.valueChanges
                        .subscribe(data => this.onValueChanged(data, form));
                this.onValueChanged(form); // (re)set validation messages now

                this.formulario = form;

                return form;
        }



        //validacion(form,variable:string,required:boolean,min:boolean,max:boolean,valor_min?:number,valor_max?:number){
        validacion2(variable: string, required: boolean, min: boolean, max: boolean, valor_min?: number, valor_max?: number) {
                let valmin = valor_min != null ? valor_min : 8;
                let valmax = valor_max != null ? valor_max : 35;

                if (required) this.formulario.controls[variable].setValidators(Validators.required);
                if (min) this.formulario.controls[variable].setValidators(Validators.minLength(valmin));
                if (max) this.formulario.controls[variable].setValidators(Validators.maxLength(valmax));

        }

        validacion(variable: any, required: boolean, min: boolean, max: boolean, valor_min?: number, valor_max?: number) {
                let valmin = valor_min != null ? valor_min : 8;
                let valmax = valor_max != null ? valor_max : 35;

                if (required) this.formulario.controls[variable.val].setValidators(Validators.required);
                if (min) this.formulario.controls[variable.val].setValidators(Validators.minLength(valmin));
                if (max) this.formulario.controls[variable.val].setValidators(Validators.maxLength(valmax));

        }


        setValueTxt(propiedad, valor) {
                this.formulario.controls[propiedad.val].setValue(valor);
        }


        setValueTxt2(propiedad, valor) {
                this.formulario.controls[propiedad].setValue(valor);
        }

        abrirPDF(body) {

                var mediaType = 'application/pdf';
                var fileURL = URL.createObjectURL(body);
                this.mensajeCorrecto("REPORTE GENERADO EXITOSAMENTE");
                window.open(fileURL);

        }


        abrirDocumentoRutaModalPdf(documento) {

                let ruta = URL.createObjectURL(documento);

                ruta="assets/pdf-viewer/web/viewer.html?file="+ruta;
                let elemento = document.getElementById("mostrarPDF");
                elemento.innerHTML = "<embed src=" + ruta + " width='100%' height='100%'/>";
        }

        abrirDocumentoModal(documento) {

                /*let pdf = URL.createObjectURL(documento);
                let elemento = document.getElementById("mostrarPDF");
                elemento.innerHTML = "<embed src=" + pdf +
                " width='100%' height='100%'/>";*/

                /*var fileURL = URL.createObjectURL(documento);
                this.mensajeCorrecto("REPORTE GENERADO EXITOSAMENTE");
                window.open(fileURL);*/

                let ruta = URL.createObjectURL(documento);

                ruta="assets/pdf-viewer/web/viewer.html?file="+ruta;
                let elemento = document.getElementById("mostrarPDF");
                elemento.innerHTML = "<embed src=" + ruta + " width='100%' height='100%'/>";
        }

        abrirDocumentoModalId(documento,id) {
                /*var mediaType = 'application/pdf';
                let pdf = URL.createObjectURL(documento);
                let tituloPDF = documento.nombre_DIGI;

                let elemento = document.getElementById(id);
                elemento.innerHTML = "<embed src=" + pdf + " width='100%' height='100%'/>";*/

                let ruta = URL.createObjectURL(documento);

                ruta="assets/pdf-viewer/web/viewer.html?file="+ruta;
                let elemento = document.getElementById(id);
                elemento.innerHTML = "<embed src=" + ruta + " width='100%' height='100%'/>";
        }



        cargarScriptDataTable() {
                var js_script3 = document.createElement('script');
                js_script3.type = "text/javascript";
                js_script3.src = "assets/js/datatableExport.js";
                js_script3.async = true;
                document.getElementsByTagName('head')[0].appendChild(js_script3);
                ControllerComponent.cargarDatatableScript = true;

        }


        eliminarScriptDataTable() {
                var js = document.getElementsByTagName('head')[0];
                var js2 = document.getElementsByTagName('script');

                let i = 0;
                for (i = 0; i < js2.length; i++) {
                        var cad = js2[i].src;
                        var res = cad.split("/");
                        if (res[res.length - 1] == "datatableExport.js") {
                                /***********REMOVER SCRIPT "admin.js" PARA VOLVER A CARGARLO************/
                                js2[i].parentNode.removeChild(js2[i]);
                                break;
                        }
                }

        }





        descargarFile(body, fileName: any) {

                var hoy = new Date();
                var dd = hoy.getDate();
                var mm = hoy.getMonth() + 1; //hoy es 0!
                var yyyy = hoy.getFullYear();

                var dd1 = "" + dd;
                var mm1 = "" + mm;
                if (dd < 10) { dd1 = '0' + dd; }
                if (mm < 10) { mm1 = '0' + mm; }

                var a = document.createElement('a');
                //recibo desde php un xhr.response de tipo blob file
                a.href = window.URL.createObjectURL(body); // xhr.response es un blob file
                a.target = '_blank';
                a.download = fileName + "-" + dd1 + '-' + mm1 + '-' + yyyy + ".xls"; // nombre del archivo con el cual quiero que se descargue.
                a.click();

                this.mensajeCorrecto("REPORTE GENERADO EXITOSAMENTE");

        }

        
        descargarFileExtension(body, fileName: any,extension:any) {

                var hoy = new Date();
                var dd = hoy.getDate();
                var mm = hoy.getMonth() + 1; //hoy es 0!
                var yyyy = hoy.getFullYear();

                var dd1 = "" + dd;
                var mm1 = "" + mm;
                if (dd < 10) { dd1 = '0' + dd; }
                if (mm < 10) { mm1 = '0' + mm; }

                var a = document.createElement('a');
                //recibo desde php un xhr.response de tipo blob file
                a.href = window.URL.createObjectURL(body); // xhr.response es un blob file
                a.target = '_blank';
                a.download = fileName + "-" + dd1 + '-' + mm1 + '-' + yyyy + "."+extension; // nombre del archivo con el cual quiero que se descargue.
                a.click();

                this.mensajeCorrecto("REPORTE GENERADO EXITOSAMENTE");

        }


        descargarFileName(body, fileName: any) {

                var a = document.createElement('a');
                //recibo desde php un xhr.response de tipo blob file
                a.href = window.URL.createObjectURL(body); // xhr.response es un blob file
                a.target = '_blank';
                a.download = fileName; // nombre del archivo con el cual quiero que se descargue.
                a.click();

                //this.mensajeCorrecto("REPORTE GENERADO EXITOSAMENTE");

        }
        
        abrirPDFNEW(body, fileName: any) {

                var hoy = new Date();
                var dd = hoy.getDate();
                var mm = hoy.getMonth() + 1; //hoy es 0!
                var yyyy = hoy.getFullYear();

                var dd1 = "" + dd;
                var mm1 = "" + mm;
                if (dd < 10) { dd1 = '0' + dd; }
                if (mm < 10) { mm1 = '0' + mm; }

                var a = document.createElement('a');
                //recibo desde php un xhr.response de tipo blob file
                a.href = window.URL.createObjectURL(body); // xhr.response es un blob file
                a.target = '_blank';
                a.download = fileName + "-" + dd1 + '-' + mm1 + '-' + yyyy;; // nombre del archivo con el cual quiero que se descargue.
                a.click();

                this.mensajeCorrecto("REPORTE GENERADO EXITOSAMENTE");


                var reader = new FileReader();
                /*reader.onload = function(event) {
                  alert(event.target.result); // <-- data url
                };*/
                reader.readAsDataURL(null);
                var rea = new File(null, 'diego.pdf');


        }




        obtenerMenusCI(menus): string {
                let cadena = "";
                for (var i = 0; i < menus.length; i++) {
                        cadena += '<li class="header">' + menus[i].nombre + '</li>';
                        cadena += this.obtenerSubMenusCI(menus[i]);
                }
                return cadena;
        }

        obtenerSubMenusCI(menu): string {
                let cadena = "";
                for (var i = 0; i < menu.items.length; i++) {
                        cadena +=
                                '<li>' +
                                '<a onclick="cerrarMenu()" href=\'#/mainCI/(menu:' + menu.items[i].link + ')\'"  >' +
                                '<i class="fa ' + menu.items[i].icono + ' icon-submenu" aria-hidden="true"></i>' +
                                '<span class="icon-span" >' + menu.items[i].nombre + '</span>' +
                                '</a>' +
                                '</li>  ';

                }
                for (var i = 0; i < menu.submenus.length; i++) {
                        cadena +=
                                '<li>' +
                                '<a  href="javascript:void(0);" class="menu-toggle waves-effect waves-block">' +
                                '<i class="' + menu.submenus[i].icono + ' fa-fw icon-menu" ></i>' +
                                '<span class="icon-span" >' + menu.submenus[i].nombre + '</span>' +
                                '</a>' +
                                '<ul class="ml-menu">';
                        cadena += this.obtenerSubMenusCI(menu.submenus[i]);
                        cadena += '</ul>' +
                                '</li>';
                }
                return cadena;
        }



        obtenerMenus(menus): string {
                let cadena = "";
                for (var i = 0; i < menus.length; i++) {
                        cadena += '<li class="header">' + menus[i].nombre + '</li>';
                        cadena += this.obtenerSubMenus(menus[i]);
                }
                return cadena;
        }

        obtenerSubMenus(menu): string {
                let cadena = "";
                for (var i = 0; i < menu.items.length; i++) {
                        cadena +=
                                '<li>' +
                                '<a onclick="cerrarMenu()" href=\'#/main/(menu:' + menu.items[i].link + ')\'"  >' +
                                '<i class="fa ' + menu.items[i].icono + ' icon-submenu" aria-hidden="true"></i>' +
                                '<span class="icon-span" >' + menu.items[i].nombre + '</span>' +
                                '</a>' +
                                '</li>  ';

                }
                for (var i = 0; i < menu.submenus.length; i++) {
                        cadena +=
                                '<li>' +
                                '<a  href="javascript:void(0);" class="menu-toggle waves-effect waves-block">' +
                                '<i class="' + menu.submenus[i].icono + ' fa-fw icon-menu" ></i>' +
                                '<span class="icon-span" >' + menu.submenus[i].nombre + '</span>' +
                                '</a>' +
                                '<ul class="ml-menu">';
                        cadena += this.obtenerSubMenus(menu.submenus[i]);
                        cadena += '</ul>' +
                                '</li>';
                }
                return cadena;
        }

        obtenerCarpetas(carpetas): string {
                let cadena =
                        '<li>' +
                        '<a  href="javascript:void(0);" class="menu-toggle">' +
                        '<i class="fa-folder-open fa-fw icon-menu" ></i>' +
                        '<span class="icon-span" >CARPETAS</span>' +
                        '</a>' +
                        '<ul class="ml-menu">';
                for (var i = 0; i < carpetas.length; i++) {
                        cadena +=
                                '<li>' +
                                '<a onclick="cerrarMenu()" href=\'#/main/(menu:inbox/' + carpetas[i].id_carpeta + ')\'"  >' +
                                '<i class="fa fa-folder-open-o icon-submenu" aria-hidden="true"></i>' +
                                '<span class="icon-span" >' + carpetas[i].nombre + '</span>' +
                                '</a>' +
                                '</li>  ';
                }

                cadena += '</ul>' +
                        '</li>';
                return cadena;
        }


        obtenerCarpetasCI(carpetas): string {
                let cadena = "";
                if (carpetas.length > 0) {
                        cadena =
                                '<li>' +
                                '<a  href="javascript:void(0);" class="menu-toggle">' +
                                '<i class="fa-folder-open fa-fw icon-menu" ></i>' +
                                '<span class="icon-span" >CARPETAS</span>' +
                                '</a>' +
                                '<ul class="ml-menu">';
                        for (var i = 0; i < carpetas.length; i++) {
                                cadena +=
                                        '<li>' +
                                        '<a onclick="cerrarMenu()" href=\'#/mainCI/(menu:inbox/' + carpetas[i].id_carpeta + ')\'"  >' +
                                        '<i class="fa fa-folder-open-o icon-submenu" aria-hidden="true"></i>' +
                                        '<span class="icon-span" >' + carpetas[i].nombre + '</span>' +
                                        '</a>' +
                                        '</li>  ';
                        }

                        cadena += '</ul>' +
                                '</li>';
                }
                return cadena;
        }





        cargarScriptAdmin() {
                var js_script1 = document.createElement('script');
                js_script1.type = "text/javascript";
                js_script1.src = "assets/bower_components/jquery/dist/jquery.js";


                var js_script2 = document.createElement('script');
                js_script2.type = "text/javascript";
                js_script2.src = "bower_components/jquery-ui/jquery-ui.min.js";


                var js_script3 = document.createElement('script');
                js_script3.type = "text/javascript";
                js_script3.src = "assets/dist/js/script_sistema.js";
                js_script3.async = true;
                js_script3.charset = 'utf-8';

                let scripts = document.getElementById("carga_scripts");
                //scripts.innerHTML="";
                //scripts.appendChild(js_script1);
                //scripts.appendChild(js_script2);

                //document.getElementsByTagName('head')[0].appendChild(js_script1);
                //document.getElementsByTagName('head')[0].appendChild(js_script2);
                document.getElementsByTagName('head')[0].appendChild(js_script3);

                //scripts.appendChild(js_script3);
                ControllerComponent.cargarScript = true;

        }


        eliminarScriptAdmin() {
                var js = document.getElementsByTagName('head')[0];
                var js2 = document.getElementsByTagName('script');

                let i = 0;
                for (i = 0; i < js2.length; i++) {
                        var cad = js2[i].src;
                        var res = cad.split("/");
                        if (res[res.length - 1] == "adminlte.js") {
                                //***********REMOVER SCRIPT "admin.js" PARA VOLVER A CARGARLO*********
                                js2[i].parentNode.removeChild(js2[i]);
                                break;
                        }
                }

        }


        eliminarAnimacion() {
                var js = document.getElementsByTagName('head')[0];
                var js2 = document.getElementsByTagName('link');

                let i = 0;
                for (i = 0; i < js2.length; i++) {
                        var cad = js2[i].href;
                        var res = cad.split("/");
                        if (res[res.length - 1] == "animacion.css") {
                                //***********REMOVER SCRIPT "admin.js" PARA VOLVER A CARGARLO*********
                                js2[i].parentNode.removeChild(js2[i]);
                                break;
                        }
                }

        }



        agregarAnimacion() {
                var css1 = document.createElement('link');
                css1.type = 'text/css';
                css1.rel = 'stylesheet';
                css1.href = "assets/dist/css/animacion.css";

                document.getElementsByTagName('head')[0].appendChild(css1);

        }


        eliminarFondo() {
                $("body").removeClass("color-fondo");
                $("body").addClass("fondo-gris");
        }


        agregarFondo() {
                $("body").addClass("color-fondo");
                $("body").removeClass("fondo-gris");
        }

        abrirPDFModalFileServer(documento, idModal) {

                let elemento = document.getElementById(idModal);
                elemento.innerHTML = "<embed src=" + documento + " width='100%' height='100%' type='application/pdf'  />";
        }




        marcar(lista: any[], indice: any) {
                this.print("indice:" + indice);
                let estado = true;
                if (lista[indice].selected) {
                        estado = false;
                }
                lista[indice].selected = estado;
        }

        isNumberKey(evt) {
                var charCode = (evt.which) ? evt.which : evt.keyCode;
                if (charCode > 31 && (charCode < 48 || charCode > 57))
                        return false;

                return true;
        }



        seleccionarByPagina(inicio: any, fin: any, tamPagina: any) {
              
        }


        
        //**************PAGINACION*************
        paginaSiguiente() {

                if (this.fin < this.totalLista) {
                        /***********PAGINACION DOCUMENTOS***********/
                        this.inicio = this.inicio + this.tamPagina;
                        this.fin = (this.inicio + this.tamPagina) - 1;
                        if (this.fin > this.totalLista) {
                                this.fin = this.totalLista;
                                this.inicio = this.fin - this.tamPagina + 1;
                                if (this.inicio <= 0) {
                                        this.inicio = 1;
                                }
                        }

                        this.print("inicio: " + this.inicio + " fin: " + this.fin + " tamPagina: " + this.tamPagina);
                        this.seleccionarByPagina(this.inicio, this.fin, this.tamPagina);

                }
                this.print("/***************FIN PAGINA SIGUIENTE***************/\n\n");
        }


        paginaAnterior() {

                this.print("inicio: " + this.inicio + " fin: " + this.fin + " tamPagina: " + this.tamPagina);
                //if (this.inicio>10){
                /***********PAGINACION DOCUMENTOS***********/
                this.inicio = this.inicio - this.tamPagina;
                if (this.inicio <= 0) {
                        this.inicio = 1;
                }
                this.fin = (this.inicio + this.tamPagina) - 1;

                if (this.fin > this.totalLista) {
                        this.fin = this.totalLista;
                }

                this.print("inicio: " + this.inicio + " fin: " + this.fin + " tamPagina: " + this.tamPagina);
                this.seleccionarByPagina(this.inicio, this.fin, this.tamPagina);
                //}
                this.print("/***************FIN PAGINA REGRESAR***************/\n\n");
        }


        round2(val:any ){
                //return  Math.ceil(val * 100)/100; 
                return Math.round(val * 100) / 100;
                //return parseFloat(val+"").toFixed(2);   
               //return 0;
        }
       
        
        cambiarIdsModal(idForm){

                $("#"+idForm+" ul li").each(function(){
                        let href=$(this).children("a").attr('href')+idForm;			 
                        $(this).children("a").attr('href',href);
                });
                                
                $("#"+idForm+" .tab-content").children().each(function(){
                        let id=$(this).attr('id')+idForm;
                        $(this).attr('id',id)
                });
                            
        }



         exportarPdfFinal(parametros) {



                this.reportePdfService.exportarPdf(parametros)
                        .subscribe(
                        data => {
                                if (data._body.size == 0) {
                                        this.mensajeInCorrecto("DOCUMENTO DIGITALIZADO NO ENCONTRADO - HA SIDO ELIMINADO ARCHIVO ADJUNTO");
                                } else {
                                        this.abrirDocumentoModal(data._body);
                                        this.abrirModalPDfPorc("modalPDF",90);
                                }

                        },
                        error => this.msj = <any>error
                        );

        }


        exportarPdfFinalIdModal(parametros,id_modal,id_modal_pdf) {



                this.reportePdfService.exportarPdf(parametros)
                        .subscribe(
                        data => {
                                if (data._body.size == 0) {
                                        this.mensajeInCorrecto("DOCUMENTO DIGITALIZADO NO ENCONTRADO - HA SIDO ELIMINADO ARCHIVO ADJUNTO");
                                } else {
                                        this.abrirDocumentoModalId(data._body,id_modal_pdf);
                                        this.abrirModalPDfPorc(id_modal,90);
                                }
                                this.completado=false;
                        },
                        error => this.msj = <any>error
                        );

        }

        

        exportarExcelFinal(parametros,tituloArchivo) {


                this.reporteExcelService.exportarExcel(parametros)
                        .subscribe(
                        data => {
                                this.print("response: ");
                                this.print(data);
                               
                                this.descargarFileExtension(data._body, tituloArchivo,"xlsx");
                                this.completado=false;
                        },
                        error => this.msj = <any>error
                        );


        }

        descargarFormatKardex(parametros,tituloArchivo) {


                this.reporteExcelService.descarFormatoKardex(parametros)
                        .subscribe(
                        data => {
                                this.print("response: ");
                                this.print(data);
                                this.print("data: ");
                                this.print(data.data);
                                this.descargarFile(data._body, tituloArchivo);
                        },
                        error => this.msj = <any>error
                        );


        }

        eliminarColumna(lista,columnas_array){
                let i,j;
                for(i=0;i<lista.length; i++){
                        for(j=0;j<columnas_array.length; j++){
                                delete lista[i][columnas_array[j]];   
                        }         
                }
        }


        completar_ceros_derecha(texto, cantidad_ceros){
                texto=""+texto;
                let rpta=""+texto;
                
                let indice_decimal=texto.indexOf(".");
                let cantidad_cifras_parte_decimal=0;

                if(indice_decimal>=0){
                        let parte_entera=texto.substring(0,indice_decimal);
                        let parte_decimal=texto.substring(indice_decimal+1,texto.length);
                        
                        cantidad_cifras_parte_decimal=parte_decimal.length;                
                }

                let ceros="";
                let i=0;
                for(i=0;i<cantidad_ceros-cantidad_cifras_parte_decimal;i++){
                        ceros+=""+"0";
                }

                if(indice_decimal>=0){
                        rpta+=""+ceros;
                }else{
                        rpta+="."+ceros;
                }

                //this.print(rpta);
                return rpta;
        }


        completarCerosIzquierda(cantidad, texto){

                let tam_texto=texto.length;

                let ceros="";
                let i;
                /*this.print("cantidad: "+(cantidad));
                this.print("tam_texto: "+(tam_texto));
                this.print("cantidad-tam_texto: "+(cantidad-tam_texto));*/
                for(i=0;i<cantidad-tam_texto;i++){
                        ceros+="0";
                }
                 return ceros+texto;
        }

        print(msj){
                if(this.rutas.DEBUG=='true'){
                        console.log(msj);
                }
        }
}