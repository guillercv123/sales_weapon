import { Component, AfterViewInit, Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Router } from '@angular/router';

import { Service } from '../../../core/service/service.service';
import {map, catchError} from "rxjs/operators";

@Injectable()
export class KardexService extends Service {



        constructor(private http: Http, public router: Router) {
                super(router);
        }



        registrarMultiple(files: File[], creds: any) {

                let formData: FormData = new FormData();

                if (files != null) {
                        let i = 0;
                        for (i = 0; i < files.length; i++) {
                                //this.print('files'+i+"  content:"+files[i] +"  name: "+files[i].name);
                                formData.append('file' + i, files[i], files[i].name);
                        }

                        formData.append('totalFiles', files.length + "");
                } else {
                        formData.append('totalFiles', 0 + "");
                }

                this.print('data'+ creds);

                formData.append('data', creds);
                let options = this.getOptionsTokenArchivo();
                this.print("totalFiles"+files.length);
                this.print("formData:" + formData.getAll("data"));
                for (var key in formData) {
                        this.print(key);
                       
                    }
                this.print(formData);


                return this.http.post(this.rutasMantenedores.API_KARDEX_REST+"/archivo/traslados/", formData, options)
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

        registrarMultipleObtener(files: File[], creds: any) {

                let formData: FormData = new FormData();

                if (files != null) {
                        let i = 0;
                        for (i = 0; i < files.length; i++) {
                                //this.print('files'+i+"  content:"+files[i] +"  name: "+files[i].name);
                                formData.append('file' + i, files[i], files[i].name);
                        }

                        formData.append('totalFiles', files.length + "");
                } else {
                        formData.append('totalFiles', 0 + "");
                }

                this.print('data'+ creds);

                formData.append('data', creds);
                let options = this.getOptionsTokenArchivo();
                this.print("totalFiles"+files.length);
                this.print("formData:" + formData.getAll("data"));
                for (var key in formData) {
                        this.print(key);
                       
                    }
                this.print(formData);


                return this.http.post(this.rutasMantenedores.API_KARDEX_REST+"/archivo/traslados/get/", formData, options)
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



        registrarTrasladosConfirmados( parametros: any) {

              
                let options = this.getOptions();
                this.print("ruta:"+this.rutasMantenedores.API_KARDEX_REST+"/confirmar_traslados/");
                this.print("parametros:"+parametros);
                return this.http.post(this.rutasMantenedores.API_KARDEX_REST+"/confirmar_traslados/", parametros, options)
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


        eliminarPreSubida( ) {

              
                let options = this.getOptions();
                this.print("ruta:"+this.rutasMantenedores.API_KARDEX_REST+"/eliminar_pre_subida/");
                return this.http.delete(this.rutasMantenedores.API_KARDEX_REST+"/eliminar_pre_subida/",options)
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


        getAll() {

                /*************OPTENER CABECERAS Y TOKEN PARA PETICION**************/
                let options = this.getOptionsToken();

                //this.print("peticion:"+this.rutas.API_USUARIO_REST+"/permiso/"+idUsuario+"/");

                return this.http.get(this.rutasMantenedores.API_KARDEX_REST, options)
                        .pipe(map(
                        data => {
                                this.print("response:");
                                this.print(data.json());
                                if (!this.tokenInvalido(data.json())) {
                                        let res = data.json();
                                        if (res.rpta) {
                                                return res.tiposMoneda;
                                        } else {
                                                return null;
                                        }
                                }
                        }

                        ),catchError(this.handleError));
                //.catch(this.handleError);

        }


        registrar(parametros: any) {

                let options = this.getOptionsToken();
                this.print("ruta: " + this.rutasMantenedores.API_KARDEX_REST);
                this.print("parametros : " + parametros);

                return this.http.post(this.rutasMantenedores.API_KARDEX_REST, parametros, options)
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
                return this.http.put(this.rutasMantenedores.API_KARDEX_REST+ "/id_tipo_moneda/" + id + "/", parametros, options)
                        .pipe(map(
                        data => {

                                let res = data.json();
                                this.print("data EDITAR PROVEEDOR:");
                                this.print(res);
                                return res;
                        }

                        )
                        ,catchError(this.handleError));

        }


        /*eliminarLogico(id: string) {

                let options = this.getOptionsToken();

                return this.http.delete(this.rutasMantenedores.API_KARDEX_REST + "/id_kardex/" + id + "/", options)
                        .map(
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
                        .catch(this.handleError);

        }*/

        eliminarLogico(parametros) {

                let options = this.getOptions();

                this.print("ruta:"+this.rutasMantenedores.API_KARDEX_REST + "/eliminar/");
                this.print(parametros);
                return this.http.post(this.rutasMantenedores.API_KARDEX_REST + "/eliminar/", parametros,options)
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
                this.print("ruta: "+this.rutasMantenedores.API_KARDEX_REST + "/inicio/" + inicio + "/fin/" + fin + "/tamPagina/" + tamPagina + "/");

                this.print("parametros : " +parametros);
               
                return this.http.post(this.rutasMantenedores.API_KARDEX_REST + "/inicio/" + inicio + "/fin/" + fin + "/tamPagina/" + tamPagina + "/",parametros, options)
                        .pipe(map(
                                data => {
                                        this.print("response:");
                                        this.print(data.json());
                                        if (!this.tokenInvalido(data.json())) {
                                                let res = data.json();
                                                if (res.rpta) {
                                                        return res.listaKardex;
                                                } else {
                                                        return null;
                                                }
                                        }
                                }
                        )
                        ,catchError(this.handleError));

        }

        buscarPaginacionTraslado( inicio: any, fin: any, tamPagina: any,parametros: any) {


                let options = this.getOptions();
                this.print("ruta: "+this.rutasMantenedores.API_KARDEX_REST + "/inicio/" + inicio + "/fin/" + fin + "/tamPagina/" + tamPagina + "/traslados");

                this.print("parametros : " +parametros);
               
                return this.http.post(this.rutasMantenedores.API_KARDEX_REST + "/inicio/" + inicio + "/fin/" + fin + "/tamPagina/" + tamPagina + "/traslados",parametros, options)
                        .pipe(map(
                                data => {
                                        this.print("response:");
                                        this.print(data.json());
                                        if (!this.tokenInvalido(data.json())) {
                                                let res = data.json();
                                                if (res.rpta) {
                                                        return res.listaKardex;
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
                return this.http.post(this.rutasMantenedores.API_KARDEX_REST + "/total/", parametros,options)
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