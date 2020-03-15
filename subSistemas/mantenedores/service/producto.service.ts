import { Component, AfterViewInit, Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Router } from '@angular/router';

import { Service } from '../../../core/service/service.service';
import {map, catchError} from "rxjs/operators";

@Injectable()
export class ProductoService extends Service {



        constructor(private http: Http, public router: Router) {
                super(router);
        }



        registrar(files: File[], creds: any) {

                let formData: FormData = new FormData();

                if (files != null) {
                        let i = 0;
                        for (i = 0; i < files.length; i++) {
                                 formData.append('file' + i, files[i], files[i].name);
                        }

                        formData.append('totalFiles', files.length + "");
                } else {
                        formData.append('totalFiles', 0 + "");
                }

                formData.append('data', creds);
                let options = this.getOptionsTokenArchivo();
               

                return this.http.post(this.rutasMantenedores.API_PRODUCTO_REST, creds, options)
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


        registrarMultiple(parametros: any) {

                /*let formData: FormData = new FormData();


                formData.append('data', creds);
                let options = this.getOptionsTokenArchivo();
                this.print("formData:" + formData);
                this.print(formData);*/

                let options = this.getOptions();
                this.print("ruta: " + this.rutasMantenedores.API_PRODUCTO_REST + "/registro_multiple/");
                this.print("parametros: " + parametros);
                return this.http.post(this.rutasMantenedores.API_PRODUCTO_REST + "/registro_multiple/", parametros, options)
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



        buscar(parametros: any) {

                let options = this.getOptions();
                this.print("ruta: " + this.rutasMantenedores.API_PRODUCTO_REST + "/buscar/");

                //let headers = new Headers({ 'Content-Type': 'application/json' });
                //let options = new RequestOptions({ headers: headers });
                //let params = "json="+parametros;
                //this.print("parametros new: " +params);
                this.print("parametros : " + parametros);

                return this.http.post(this.rutasMantenedores.API_PRODUCTO_REST + "/buscar/", parametros, options)
                        .pipe(map(
                                data => {
                                        this.print("response:");
                                        this.print(data.json());
                                        if (!this.tokenInvalido(data.json())) {
                                                let res = data.json();
                                                if (res.rpta) {
                                                        return res.productos;
                                                } else {
                                                        return null;
                                                }
                                        }
                                }
                        )
                        ,catchError(this.handleError));

        }


        buscarPaginacion(inicio: any, fin: any, tamPagina: any, parametros: any) {


                let options = this.getOptions();
                this.print("ruta:" + this.rutasMantenedores.API_PRODUCTO_REST + "/inicio/" + inicio + "/fin/" + fin + "/tamPagina/" + tamPagina + "/");

                //let headers = new Headers({ 'Content-Type': 'application/json' });
                //let options = new RequestOptions({ headers: headers });
                //let params = "json="+parametros;
                //this.print("parametros new: " +params);
                this.print("parametros : " + parametros);

                return this.http.post(this.rutasMantenedores.API_PRODUCTO_REST + "/inicio/" + inicio + "/fin/" + fin + "/tamPagina/" + tamPagina + "/", parametros, options)
                        .pipe(map(
                                data => {
                                        this.print("response:");
                                        this.print(data.json());
                                        if (!this.tokenInvalido(data.json())) {
                                                let res = data.json();
                                                if (res.rpta) {
                                                        return res.productos;
                                                } else {
                                                        return null;
                                                }
                                        }
                                }
                        )
                        ,catchError(this.handleError));

        }




        editar(files: File[], creds: any, idProducto: any) {

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

                //formData.append('data', creds);
                let options = this.getOptionsTokenArchivo();
                /*this.print("formData:" + formData);
                this.print(formData);
                this.print("parametos: "+creds);
                this.print("ruta: "+this.rutasMantenedores.API_PRODUCTO_REST+ "/id_producto/" + idProducto + "/");
                */
               this.print("ruta: "+this.rutasMantenedores.API_PRODUCTO_REST + "/pruebaup/id_producto/" + idProducto + "/");
               this.print("param: "+creds);
               
                return this.http.post(this.rutasMantenedores.API_PRODUCTO_REST + "/pruebaup/id_producto/" + idProducto + "/", creds, options)
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



        actualizarMasivo(parametros: any) {

                let options = this.getOptionsToken();

                this.print("ruta: "+this.rutasMantenedores.API_PRODUCTO_REST+"/actualizar_masivo/");
                this.print("parametros: "+parametros);

                return this.http.post(this.rutasMantenedores.API_PRODUCTO_REST+"/actualizar_masivo/", parametros, options)
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

        eliminarLogico(id: string) {

                let options = this.getOptionsToken();

                return this.http.delete(this.rutasMantenedores.API_PRODUCTO_REST + "/id_producto/" + id + "/", options)
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

        obtenersubgrupo(id:number){
                let options = this.getOptionsToken();
                return this.http.post(this.rutasMantenedores.API_PRODUCTO_REST + "/obtenersubgrupo/" + id + "/", options)
                        .pipe(map(
                                /************FILTRAR LA DATA QUE SE QUIERE ENVIAR**************** */
                                data => {
                                        if (!this.tokenInvalido(data.json())) {
                                                if (data.json().rpta) {
                                                        return data.json().sub_grupo;
                                                    
                                                } else {
                                                        return null;
                                                }
                                        }
                                }
                        )
                        ,catchError(this.handleError));

        }

        getAll() {

                /*************OPTENER CABECERAS Y TOKEN PARA PETICION**************/
                let options = this.getOptionsToken();

                //this.print("peticion:"+this.rutas.API_USUARIO_REST+"/permiso/"+idUsuario+"/");

                return this.http.get(this.rutasMantenedores.API_PRODUCTO_REST, options)
                        .pipe(map(
                                data => {
                                        this.print("response:");
                                        this.print(data.json());
                                        if (!this.tokenInvalido(data.json())) {
                                                let res = data.json();
                                                if (res.rpta) {
                                                        return res.productos;
                                                } else {
                                                        return null;
                                                }
                                        }
                                }

                        ),catchError(this.handleError));
                //.catch(this.handleError);

        }



        getByPagina(inicio: any, fin: any, tamPagina: any) {

                let options = this.getOptionsToken();
                return this.http.get(this.rutasMantenedores.API_PRODUCTO_REST + "/inicio/" + inicio + "/fin/" + fin + "/tamPagina/" + tamPagina + "/", options)
                        .pipe(map(
                                /************FILTRAR LA DATA QUE SE QUIERE ENVIAR**************** */
                                data => {

                                        this.print("resultado paginacion: ");
                                        this.print(data);
                                        if (!this.tokenInvalido(data.json())) {
                                                if (data.json().rpta) {
                                                        return data.json().productos;
                                                } else {
                                                        return null;
                                                }
                                        }
                                }
                        )
                        ,catchError(this.handleError));

        }

        getStockByIdProducto(id: any,id_local:any) {

                let options = this.getOptionsToken();
        this.print(this.rutasMantenedores.API_PRODUCTO_REST + "/stock/id_producto/" + id + "/"+id_local);

                return this.http.get(this.rutasMantenedores.API_PRODUCTO_REST + "/stock/id_producto/" + id + "/"+id_local, options)
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



        
        getUbicacionByIdProducto(id: any) {

                let options = this.getOptionsToken();
                return this.http.get(this.rutasMantenedores.API_PRODUCTO_REST + "/ubicacion/id_producto/" + id + "/", options)
                        .pipe(map(
                                /************FILTRAR LA DATA QUE SE QUIERE ENVIAR**************** */
                                data => {
                                        if (!this.tokenInvalido(data.json())) {
                                                if (data.json().rpta) {
                                                        return data.json().lista_ubicacion;
                                                } else {
                                                        return null;
                                                }
                                        }
                                }
                        )
                        ,catchError(this.handleError));

        }

        getTipoProductoByIdProducto(id: any) {

                let options = this.getOptionsToken();
                return this.http.get(this.rutasMantenedores.API_PRODUCTO_REST + "/id_tipo_producto/id_producto/" + id + "/", options)
                        .pipe(map(
                                /************FILTRAR LA DATA QUE SE QUIERE ENVIAR**************** */
                                data => {
                                        if (!this.tokenInvalido(data.json())) {
                                                if (data.json().rpta) {
                                                        return data.json().lista_ubicacion;
                                                } else {
                                                        return null;
                                                }
                                        }
                                }
                        )
                        ,catchError(this.handleError));

        }

        getTotal() {

                let options = this.getOptionsToken();
                return this.http.get(this.rutasMantenedores.API_PRODUCTO_REST + "/total/", options)
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


        getTotalParametros(parametros: any) {

                let options = this.getOptions();
                return this.http.post(this.rutasMantenedores.API_PRODUCTO_REST + "/total/", parametros, options)
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