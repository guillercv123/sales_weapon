import { Component, AfterViewInit, Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Router } from '@angular/router';

import { Service } from '../../../core/service/service.service';
import {map, catchError} from "rxjs/operators";

@Injectable()
export class UsuarioService extends Service {



        constructor(private http: Http, public router: Router) {
                super(router);
        }



        /*
        buscarEmpleado (dni:number): Observable<any> {
                
            
                let options= this.getOptionsToken();
                return  this.http.get(this.rutas.API_USUARIO_DATA_REST+"/dni/"+dni+"/",options)
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

                        );
                        //.catch(this.handleError) ;    
        }*/



        /*
                eliminarRol (idUsuario:string,idRol:string) { 
                      
                        let options=this.getOptionsToken();
                        return  this.http.delete(this.rutas.API_PERFIL_REST+"/login/"+idUsuario+"/rol/"+idRol+"/",options)
                                        .map(
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
                                        .catch(this.handleError);
                                
                }
        
                
                */
        registrar(parametros) {

                let options = this.getOptionsToken();

                this.print("rutas: "+ this.rutas.API_USUARIO_REST);
                this.print("parametros: "+parametros);
                return this.http.post(this.rutas.API_USUARIO_REST,parametros, options)
                        .pipe(map(
                        data => {

                                let res = data.json();
    
                                if (!this.tokenInvalido(data.json())) {
                                        let res = data.json();
                                        if (res != null) {
                                                return res.rpta;
                                        } else {
                                                return null;
                                        }
                                }
                        }

                        )
                        ,catchError(this.handleError));
        }

        crearNuevoRol(parametros) {

                let options = this.getOptionsToken();

                this.print("ruta:" + this.rutas.API_USUARIO_REST+"/rol/agregar/");
                this.print("parametros:" + parametros);

                return this.http.post(this.rutas.API_USUARIO_REST+"/rol/agregar/", parametros, options)
                        .pipe(map(
                        data => {
                                this.print("data");
                                this.print(data);

                                if (!this.tokenInvalido(data.json())) {
                                        let res = data.json();
                                        if (res != null) {
                                                return res.rpta;
                                        } else {
                                                return null;
                                        }
                                }
                        }

                        )
                        ,catchError(this.handleError));
        }


        modificarClave(creds: any, idUsuario: number) {

                this.print("parametros: " + creds);
                this.print("ruta: " + this.rutas.API_USUARIO_REST + "/cambio_clave/" + idUsuario + "/");

                let options = this.getOptionsToken();
                return this.http.patch(this.rutas.API_USUARIO_REST + "/cambio_clave/" + idUsuario + "/", creds, options)
                        .pipe(map(
                        data => {
                                if (!this.tokenInvalido(data.json())) {
                                        let res = data.json();
                                        if (res != null) {
                                                return res.rpta;
                                        } else {
                                                return null;
                                        }
                                }
                        }

                        )
                        ,catchError(this.handleError));

        }


        guardarFilesMultiple(files: File[], creds: any) {
                let formData: FormData = new FormData();

                let i = 0;
                for (i = 0; i < files.length; i++) {
                        //this.print('files'+i+"  content:"+files[i] +"  name: "+files[i].name);
                        formData.append('file' + i, files[i], files[i].name);
                }


                formData.append('totalFiles', files.length + "");
                formData.append('data', creds);
                let options = this.getOptionsTokenArchivo();
                this.print("formData:" + formData);
                this.print(formData);

                return this.http.post(this.rutas.API_USUARIO_REST + "/multiple/", formData, options)
                        .pipe(map(
                        data => {

                                let res = data.json();
                                this.print("data:");
                                this.print(res);
                                return res;
                        }

                        )
                        ,catchError(this.handleError));
        }


        editar(parametros: any, id:any) {

                let options = this.getOptionsToken();
                return this.http.put(this.rutasMantenedores.API_USUARIO_REST+ "/id_usuario/" + id + "/", parametros, options)
                        .pipe(map(
                        data => {

                                let res = data.json();
                                return res;
                        }

                        )
                        ,catchError(this.handleError));

        }


        eliminarLogico(id: string) {

                let options = this.getOptionsToken();

                return this.http.delete(this.rutasMantenedores.API_USUARIO_REST + "/id_usuario/" + id + "/", options)
                        .pipe(map(
                        data => {
                                if (!this.tokenInvalido(data.json())) {
                                        let res = data.json();
                                        if (res != null) {
                                                return res.rpta;
                                        } else {
                                                return null;
                                        }
                                }
                        }

                        )
                        ,catchError(this.handleError));

        }


    


        buscarPaginacion( inicio: any, fin: any, tamPagina: any,parametros: any) {


                let options = this.getOptions();
                this.print("ruta: "+this.rutasMantenedores.API_USUARIO_REST + "/inicio/" + inicio + "/fin/" + fin + "/tamPagina/" + tamPagina + "/");

                this.print("parametros : " +parametros);
               
                return this.http.post(this.rutasMantenedores.API_USUARIO_REST + "/inicio/" + inicio + "/fin/" + fin + "/tamPagina/" + tamPagina + "/",parametros, options)
                        .pipe(map(
                                data => {
                                        this.print("response:");
                                        this.print(data.json());
                                        if (!this.tokenInvalido(data.json())) {
                                                let res = data.json();
                                                if (res.rpta) {
                                                        return res.usuarios;
                                                } else {
                                                        return null;
                                                }
                                        }
                                }
                        )
                        ,catchError(this.handleError));

        }



        getTotalParametros(parametros:any) {

                let options = this.getOptions();
                return this.http.post(this.rutasMantenedores.API_USUARIO_REST + "/total/", parametros,options)
                        .pipe(map(
                        /************FILTRAR LA DATA QUE SE QUIERE ENVIAR**************** */
                        data => {
                                if (!this.tokenInvalido(data.json())) {
                                        if (data.json().rpta) {
                                                return data.json().total;
                                        } else {
                                                return null;
                                        }
                                }
                        }
                        )
                        ,catchError(this.handleError));

        }



}