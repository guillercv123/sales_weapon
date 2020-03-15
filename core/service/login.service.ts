import { Injectable } from '@angular/core';
import { Http, Headers,Response} from '@angular/http';
import { Router} from '@angular/router';

//************IMPORTACION DE LIBRERIAS PARA CAPTURAR LAS EXPECIONES***********
import {map, catchError} from "rxjs/operators";


//*************IMPORTACION DEL SERVICIO PRINCIPAL*********
import {Service} from './service.service';


@Injectable()
export class LoginService extends Service {


  constructor(private http: Http,public router: Router) {
                super(router);
	}



        obtenerConfiguracionFacturacion (parametros) { 

                let options = this.getOptions();
                this.print("ruta: "+this.rutas.API_CONFIGURACION_FACTURACION_REST + "/obtener_configuracion/");

                this.print("parametros : " +parametros);
               
                return this.http.post(this.rutas.API_CONFIGURACION_FACTURACION_REST + "/obtener_configuracion/",parametros, options)
                        .pipe(map(
                                data => {
                                        this.print("response:");
                                        this.print(data.json());
                                        if (!this.tokenInvalido(data.json())) {
                                                let res = data.json();
                                                if (res.rpta) {
                                                        return res.configuracion;
                                                } else {
                                                        return null;
                                                }
                                        }
                                }
                        )
                        ,catchError(this.handleError));          
        }




        ingresar (parametrosJson) { 
               
                let opt=this.getOptionsToken();

                this.print("ruta: " + this.rutas.API_USUARIO_REST+"/login/");
                this.print("parametros: " + parametrosJson);

                return  this.http.post(this.rutas.API_USUARIO_REST+"/login/",parametrosJson,opt)
                                .pipe(map(
                                        data=>{
                                                        let res=data.json();
                                                        if(res!=null){
                                                                
                                                                if (data.json().rpta) {
                                                                        //console.log("data:" +JSON.stringify(data.json()));
                                                                        let user=data.json().usuario;
                                                                        this.print("menu:");
                                                                        this.print(data.json().menu);
                                                                        let jwt=data.json().jwt;
                                                                        let permisos=data.json().permisos;
                                                                        let almacenes=data.json().almacenes;
                                                                        let vistasPermisos=data.json().vistasPermisos;

                                                                       
                                                                        let hashPermisos = this.obtenerPermisos(vistasPermisos,permisos);
                                                                        let menu=this.obtenerMenus(data.json().menu);
                                                                        
                                                                        /*console.log("menu final: ");
                                                                        console.log(menu);*/
                                                                        this.print("almacenes: ");
                                                                        this.print(almacenes);
                                                                        this.print("permisos: ");
                                                                        this.print(hashPermisos);
                                                                        this.print("usuario: ");
                                                                        this.print(user);
                                                                        localStorage.setItem("menu",JSON.stringify(menu));
                                                                        localStorage.setItem("almacenes",JSON.stringify(almacenes));
                                                                        localStorage.setItem("permisos",JSON.stringify(hashPermisos));
                                                                        localStorage.setItem("user",JSON.stringify(user));
                                                                       
                                                                        //************ALAMACENA EL TOKEN OTORGADO POR EL SERVIDOR************
                                                                        localStorage.setItem("jwt",jwt);
                                                                        //console.log("jwt: "+jwt);    
                                                                }
                                                                return res.rpta;
                                                        }else{
                                                                return null;
                                                        }
                                                
                                        }  

                                ),catchError(this.handleError));             
        }



        private obtenerPermisos( vistasPermisos:any , permisos: any):any{

                let hashPermisos = {};

                /******** CREAR UN ARRAY DE ARRAYS**********************/
                let i;
                for(i=0;i<vistasPermisos.length ;i++){
                        hashPermisos[vistasPermisos[i].vista] =new Array();
                }


                /**************LLENAR EL ARRAY CON LOS PERMISOS DADOS***************/
                let antes=permisos[0].vista;
                let j=0;
                //console.log("/********TAMAÑO DE PERMISOS: ***************/");
                for(i=0;i<permisos.length ;i++){
                           
                //console.log("I:"+i);
                        if(antes!=permisos[i].vista){
                                antes=permisos[i].vista;
                                j=0;
                        }
                        hashPermisos[permisos[i].vista][j] =permisos[i].componente ;
                        j++;
                }
               
                //console.log("permisos: ");
                //console.log( hashPermisos);

                return hashPermisos;
        }

        modificarClave(creds:any,idUsuario:number){

                let options=this.getOptionsToken();
                return  this.http.patch(this.rutas.API_LOGIN_REST+"/usuario/"+idUsuario+"/clave/",creds,options)
                                .pipe(map(
                                        data=>{
                                                if(!this.tokenInvalido(data.json())){
                                                        let res=data.json();
                                                        if(res!=null){
                                                                return res.rpta;
                                                        }else{
                                                                return null;
                                                        }
                                                }
                                        }

                                )
                                ,catchError(this.handleError));

        }

        obtenerMenus(menus):string{
                let cadena="";
                let subm=menus.submenus;
                cadena+='<li class="header">'+menus.nombre+'</li>';
                for(var i=0;i<subm.length;i++){
                        if( subm[i].hasOwnProperty('submenus')){
                               /* console.log("sub menu:");
                                console.log(subm[i]);
                                console.log("\n\n TAMAÑO SUB MENU:"+subm[i].submenus.length);*/
                                if( subm[i].submenus.length>0){
                                        cadena+='<li class="treeview">';
                                        cadena+='<a href="#">';
                                        cadena+='<i class="'+subm[i].icono+'"></i>';
                                        cadena+='<span>'+subm[i].nombre+'</span>';
                                        cadena+='<span class="pull-right-container">';
                                        cadena+='<i class="fa fa-angle-left pull-right"></i>';
                                        cadena+='</span>';
                                        cadena+='</a>';

                                        if(subm[i].submenus.length>0){
                                                cadena+=this.obtenerSubMenus(subm[i]);
                                        }
                                        cadena+='</li>';
                                }
                        }
                }

                cadena +="<li class='header creditos'>";
                cadena +="<div class='version'>";
                cadena +="  <b>Version</b> 1.0";
                cadena +="</div>";
                cadena +="<div class='copy'>";
                cadena +="    <strong>Copyright © 2018</strong>";
                cadena +="</div>";
                cadena +="<div class='logo-empresa-dev'>";
                cadena +="  <strong><a href='www.novumsystem.com'>Novum System Consulting</a></strong>";
                cadena +="</div>";
                cadena +="<div class='autor'>";
                cadena +="  <strong><a href='www.novumsystem.com'>Ing. Diego Flores Aguilar</a></strong>";
                cadena +="</div>";
                
                cadena +=" </li>";

                return cadena;
        }

        /*obtenerMenus(menus):string{
                let cadena="";
                for(var i=0;i<menus.length;i++){
                        cadena+='<li class="header">'+menus[i].nombre+'</li>';
                        cadena+=this.obtenerSubMenus(menus[i]);
                }
                return cadena;
        }*/

        obtenerSubMenus(menu):string{
               /* console.log("\n\n analizando sub nivel:")
                console.log(menu);*/
                let cadena="";
                if( menu.hasOwnProperty('submenus')){

                        
                        let sub=menu.submenus;
                        cadena+= ' <ul class="treeview-menu" style="display: none;">';

                
                        for(var i=0;i<sub.length;i++){
                        

                                if( sub[i].hasOwnProperty('submenus')){
                                        /*console.log("TIENE SUB MENUS");
                                        console.log("sub menu nivel:")
                                        console.log(sub[i]);*/
                                        cadena+=
                                        '<li class="treeview">'+
                                                '<a  href="#" >'+
                                                        '<i class="'+sub[i].icono+' fa-fw icon-menu" ></i>'+sub[i].nombre+
                                                        '<span class="pull-right-container">'+
                                                                '<i class="fa fa-angle-left pull-right"></i>'+
                                                        '</span>'+
                                                '</a>';
                                
                                                cadena+=this.obtenerSubMenus(sub[i]);
                                        cadena+='</li>';      
                                }
                                else{
                                        //console.log("Array.isArray(sub[i]):"+Array.isArray(sub[i]));
                                        if( Array.isArray(sub[i])){    
                                                let sub_menu=sub[i];
                                                for(var j=0;j<sub_menu.length;j++){
                                                cadena+=
                                                '<li class="treeview">'+
                                                        '<a  href="#" >'+
                                                                '<i class="'+sub_menu[j].icono+' fa-fw icon-menu" ></i>'+sub_menu[j].nombre+
                                                                '<span class="pull-right-container">'+
                                                                        '<i class="fa fa-angle-left pull-right"></i>'+
                                                                '</span>'+
                                                        '</a>';
                                        
                                                cadena+=this.obtenerSubMenus(sub_menu[j]);
                                                cadena+='</li>';
                                                /*console.log("sub menu nivel 1:")
                                                console.log(sub_menu[j]);*/
                                                }

                                                //console.log("ENTRO A SUB NIVEL 2");
                                        }
                                        else{
                                        
                                                /*console.log("ENTRO A OBTENER ITEMS");
                                                console.log(sub[i]);   */

                                                        cadena+= 
                                                                '<li>'+
                                                                //'<a  href=\'#/main/(menu:'+sub[i].link+')\'"  >'+
                                                                '<a  href="'+sub[i].link+'"  >'+
                                                                '<i class="fa '+sub[i].icono+'"></i>'+sub[i].nombre+
                                                                '</a>'+
                                                                '</li>  ';
                                        
                                                
                                        }
                                }
                        }
                        cadena+= ' </ul>';
       
                }

              return cadena;
        }
        /*
        obtenerSubMenus(menu):string{
                let cadena="";
                for(var i=0;i<menu.items.length;i++){
                        cadena+= 
                            '<li>'+
                                '<a onclick="cerrarMenu()" href=\'#/main/(menu:'+menu.items[i].link+')\'"  >'+
                                   '<i class="fa '+menu.items[i].icono+' icon-submenu" aria-hidden="true"></i>'+
                                   '<span class="icon-span" >'+menu.items[i].nombre+'</span>'+
                                 '</a>'+
                            '</li>  ';
                        
                }

                for(var i=0;i<menu.submenus.length;i++){
                        cadena+=
                     '<li>'+
                        '<a  href="javascript:void(0);" class="menu-toggle waves-effect waves-block">'+
                            '<i class="'+menu.submenus[i].icono+' fa-fw icon-menu" ></i>'+
                            '<span class="icon-span" >'+menu.submenus[i].nombre+'</span>'+
                        '</a>'+
                       '<ul class="ml-menu">';
                       cadena+=this.obtenerSubMenus(menu.submenus[i]);
                       cadena+='</ul>'+
                    '</li>';
                }
                return cadena;
        }*/
}
