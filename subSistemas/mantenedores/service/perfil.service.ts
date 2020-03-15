import { Component , AfterViewInit,Injectable } from '@angular/core';
import { Http, Headers,Response} from '@angular/http';
import { Router} from '@angular/router';

import {Service} from '../../../core/service/service.service';
import {map, catchError} from "rxjs/operators";

@Injectable()
export class PerfilService extends Service  {
   
        constructor(private http: Http,public router: Router) {
                super(router);
	}


      

        obtenerByLogin (login:string) {
                
                //var n = login.indexOf("");
                //var res = login.split("@");

                //let ulogin=res[0];
                let options= this.getOptionsToken();

                let parametros = JSON.stringify({login:login});

               
                this.print("ruta: "+this.rutas.API_USUARIO_REST+"/perfil/");
                this.print("parametros: "+parametros);

                return this.http.post(this.rutas.API_USUARIO_REST+"/perfil/",parametros, options)
                        .pipe(map(
                                data=>{
                                        this.print("res:");
                                        this.print(data);
                                        if(!this.tokenInvalido(data.json())){
                                                let res=data.json();
                                                if(res.rpta){
                                                        
                                                        return res;
                                                }else{
                                                        return null;
                                                }
                                        }
                                }

                        ),catchError(this.handleError));

                /*return  this.http.get(this.rutas.API_PERFIL_REST+"/login/"+ulogin+"/",options)
                        .map(
                                data=>{
                                        if(!this.tokenInvalido(data.json())){
                                                let res=data.json();
                                                if(res.rpta){
                                                        
                                                        return res;
                                                }else{
                                                        return null;
                                                }
                                        }
                                }

                        );*/
                        //.catch(this.handleError) ;    
        }




        eliminarRol (idUsuario:string,idRol:string) { 
              
                let options=this.getOptionsToken();
                this.print("ruta: "+this.rutas.API_USUARIO_REST+"/id_usuario/"+idUsuario+"/rol/"+idRol+"/");
                return  this.http.delete(this.rutas.API_USUARIO_REST+"/id_usuario/"+idUsuario+"/rol/"+idRol+"/",options)
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

        
        
        registrar(creds){
     
                      
                        let options=this.getOptionsToken();
                        this.print("parametros: "+creds);
                        this.print("ruta: "+this.rutas.API_USUARIO_REST+"/perfil/agregar/");
                        return this.http.post(this.rutas.API_USUARIO_REST+"/perfil/agregar/",creds, options)
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
        





}