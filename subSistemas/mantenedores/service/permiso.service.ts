import { Component , AfterViewInit,Injectable } from '@angular/core';
import { Http, Headers,Response} from '@angular/http';
import { Router} from '@angular/router';

import {Service} from '../../../core/service/service.service';
import {map, catchError} from "rxjs/operators";

@Injectable()
export class PermisoService extends Service  {


   
        constructor(private http: Http,public router: Router) {
                super(router);
	}


      

        actualizar(permisos:any,idUsuario:number){

                let options=this.getOptionsToken();
                this.print("ruta:"+this.rutas.API_PERMISO_REST+"/usuario/"+idUsuario+"/");
                return  this.http.patch(this.rutas.API_PERMISO_REST+"/usuario/"+idUsuario+"/",permisos,options)
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


        actualizarPermisosRol(parametros:any,idUsuario:number){
                
                                let options=this.getOptionsToken();
                                this.print("options:"+options);
                                this.print(options);
                                this.print("parametros:"+parametros);
                                this.print("ruta:"+this.rutas.API_USUARIO_REST+"/permiso/"+idUsuario+"/actualizar/");
                                return  this.http.put(this.rutas.API_USUARIO_REST+"/permiso/actualizar/"+idUsuario+"/",parametros,options)
                                                .pipe(map(
                                                        data=>{
                                                              
                                                                if(!this.tokenInvalido(data.json())){
                                                                      
                                                                        let res=data.json();
                                                                        this.print("permisos a actualizar:");
                                                                        this.print(res);
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




        obtenerPermisosByLogin (idUsuario:number) { 

                /*************OPTENER CABECERAS Y TOKEN PARA PETICION**************/
                let options=this.getOptionsToken();
                
                this.print("peticion:"+this.rutas.API_USUARIO_REST+"/permiso/"+idUsuario+"/");

                return  this.http.get(this.rutas.API_USUARIO_REST+"/permiso/"+idUsuario+"/",options)
                                .pipe(map(
                                        data=>{
                                                this.print("res permisos:");
                                                //this.print(data);
                                                this.print(data.json());
                                                if(!this.tokenInvalido(data.json())){
                                                        let res=data.json();
                                                        if(res.rpta){

                                                                        let permisos=data.json().permisos;
                                                                        let vistasPermisos=data.json().vistasPermisos;
                                                                        this.print("permisos:");
                                                                        this.print(permisos);

                                                                        this.print("vistas permisos:");
                                                                        this.print(vistasPermisos);

                                                                        let hashPermisos = this.obtenerPermisosHash(vistasPermisos,permisos);

                                                                return hashPermisos;
                                                        }else{
                                                                return null;
                                                        }
                                                }
                                        }

                                ),catchError(this.handleError));
                                //.catch(this.handleError);
                        
        }



        obtenerPermisosByIdUsuarioRol (id_usuario:number,id_rol:number) { 
                
                                /*************OPTENER CABECERAS Y TOKEN PARA PETICION**************/
                                let options=this.getOptionsToken();
                                
                                this.print("peticion:"+this.rutas.API_USUARIO_REST+"/permiso/"+id_usuario+"/rol/"+id_rol+"/");
                
                                return  this.http.get(this.rutas.API_USUARIO_REST+"/permiso/"+id_usuario+"/rol/"+id_rol+"/",options)
                                                .pipe(map(
                                                        data=>{
                                                                this.print("res permisos:");
                                                                //this.print(data);
                                                                this.print(data.json());
                                                                if(!this.tokenInvalido(data.json())){
                                                                        let res=data.json();
                                                                        if(res.rpta){
                
                                                                                        let permisos=data.json().permisos;
                                                                                        let vistasPermisos=data.json().vistasPermisos;
                                                                                        this.print("permisos:");
                                                                                        this.print(permisos);
                
                                                                                        this.print("vistas permisos:");
                                                                                        this.print(vistasPermisos);
                
                                                                                        let hashPermisos = this.obtenerPermisosHash(vistasPermisos,permisos);
                                                                                        let permiIdDetalle = this.obtenerIdPermisos(vistasPermisos,permisos);
                                                                                        let permi={hashPermisos :hashPermisos ,permisos:permiIdDetalle}
                                                                                return permi;
                                                                        }else{
                                                                                return null;
                                                                        }
                                                                }
                                                        }
                
                                                ),catchError(this.handleError));
                                                //.catch(this.handleError);
                                        
                        }


      







        private obtenerPermisosHash( vistasPermisos:any , permisos: any):any{

                let hashPermisos = {};

                //******** CREAR UN ARRAY DE ARRAYS*********************
                let i;
                for(i=0;i<vistasPermisos.length ;i++){
                        hashPermisos[vistasPermisos[i].vista] =new Array();
                }


                //**************LLENAR EL ARRAY CON LOS PERMISOS DADOS**************
                let antes=permisos[0].vista;
                let j=0;
                this.print("//********TAMAÑO DE PERMISOS: ***************");
                for(i=0;i<permisos.length ;i++){
                           
                //this.print("I:"+i);
                        if(antes!=permisos[i].vista){
                                antes=permisos[i].vista;
                                j=0;
                        }
                        hashPermisos[permisos[i].vista][j] =permisos[i].componente ;
                        j++;
                }
               
                //this.print("permisos: ");
               //this.print( hashPermisos);

                return hashPermisos;
        }



        private obtenerIdPermisos( vistasPermisos:any , permisos: any):any{
                
                                let hashPermisos = new Array();
                
                                //******** CREAR UN ARRAY DE ARRAYS*********************
                                let i;
                                let k=0;
                                this.print("//********TAMAÑO DE PERMISOS: ***************");
                                for(i=0;i<permisos.length ;i++){
                                        hashPermisos[k] =permisos[i].id_detalle_view ;
                                        k++;
                                }
                               
                                //this.print("permisos: ");
                               //this.print( hashPermisos);
                
                                return hashPermisos;
        }



}