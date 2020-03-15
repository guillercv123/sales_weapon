import { Component, AfterViewInit, Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Router } from '@angular/router';

import { Service } from '../../../core/service/service.service';
import {map, catchError} from "rxjs/operators";

@Injectable()
export class ProductoDefectuosoService extends Service {



        constructor(private http: Http, public router: Router) {
                super(router);
        }



        registrar(parametros: any) {


                let options = this.getOptions();
                this.print("ruta: " + this.rutasMantenedores.API_PRODUCTO_DEFECTUOSO_REST);
                this.print("parametros : " + parametros);
                return this.http.post(this.rutasMantenedores.API_PRODUCTO_DEFECTUOSO_REST, parametros, options)
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


                let options = this.getOptions();
                this.print("ruta: " + this.rutasMantenedores.API_PRODUCTO_DEFECTUOSO_REST+"/registro_multiple/");
                this.print("parametros : " + parametros);
                return this.http.post(this.rutasMantenedores.API_PRODUCTO_DEFECTUOSO_REST+"/registro_multiple/", parametros, options)
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
                this.print("ruta: " + this.rutasMantenedores.API_PRODUCTO_DEFECTUOSO_REST + "/buscar/");
                this.print("parametros : " + parametros);

                return this.http.post(this.rutasMantenedores.API_PRODUCTO_DEFECTUOSO_REST + "/buscar/", parametros, options)
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
                this.print("ruta: " + this.rutasMantenedores.API_PRODUCTO_DEFECTUOSO_REST + "/inicio/" + inicio + "/fin/" + fin + "/tamPagina/" + tamPagina + "/");
                this.print("parametros : " + parametros);

                return this.http.post(this.rutasMantenedores.API_PRODUCTO_DEFECTUOSO_REST + "/inicio/" + inicio + "/fin/" + fin + "/tamPagina/" + tamPagina + "/", parametros, options)
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




        editar(parametros: any, id: any) {
                this.print("ruta: " + this.rutasMantenedores.API_PRODUCTO_DEFECTUOSO_REST + "/id_compra/" + id + "/");
                this.print("parametros : " + parametros);

                let options = this.getOptionsToken();
                return this.http.put(this.rutasMantenedores.API_PRODUCTO_DEFECTUOSO_REST + "/id_compra/" + id + "/", parametros, options)
                        .pipe(map(
                                data => {

                                        let res = data.json();
                                        this.print("data compras:");
                                        this.print(res);
                                        return res;
                                }

                        )
                        ,catchError(this.handleError));

        }


        eliminarLogico(id: string, parametros) {

                let options = this.getOptionsToken();

                this.print("ruta eliminar Defectuoso: " + this.rutasMantenedores.API_PRODUCTO_DEFECTUOSO_REST + "/delete_defectuoso/");
                this.print("parametros eliminar Defectuoso: " +parametros);

                return this.http.post(this.rutasMantenedores.API_PRODUCTO_DEFECTUOSO_REST + "/delete_defectuoso/",parametros, options)
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





        getCompraById(id: any) {

                /*************OPTENER CABECERAS Y TOKEN PARA PETICION**************/
                let options = this.getOptionsToken();

                //console.log("peticion:"+this.rutas.API_USUARIO_REST+"/permiso/"+idUsuario+"/");

                return this.http.get(this.rutasMantenedores.API_PRODUCTO_DEFECTUOSO_REST + "/id/" + id + "/", options)
                        .pipe(map(
                        data => {
                                this.print("response:");
                                this.print(data.json());
                                if (!this.tokenInvalido(data.json())) {
                                        let res = data.json();
                                        if (res.rpta) {
                                                return res.compra;
                                        } else {
                                                return null;
                                        }
                                }
                        }

                        ),catchError(this.handleError));
                //.catch(this.handleError);

        }



        getAll() {

                /*************OPTENER CABECERAS Y TOKEN PARA PETICION**************/
                let options = this.getOptionsToken();

                //console.log("peticion:"+this.rutas.API_USUARIO_REST+"/permiso/"+idUsuario+"/");

                return this.http.get(this.rutasMantenedores.API_PRODUCTO_DEFECTUOSO_REST, options)
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
                return this.http.get(this.rutasMantenedores.API_PRODUCTO_DEFECTUOSO_REST+ "/inicio/" + inicio + "/fin/" + fin + "/tamPagina/" + tamPagina + "/", options)
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

        getTotal() {

                let options = this.getOptionsToken();
                return this.http.get(this.rutasMantenedores.API_PRODUCTO_DEFECTUOSO_REST + "/total/", options)
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
                return this.http.post(this.rutasMantenedores.API_PRODUCTO_DEFECTUOSO_REST + "/total/", parametros, options)
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