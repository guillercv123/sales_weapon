import { Component, AfterViewInit, Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Router } from '@angular/router';

import { Service } from '../../../core/service/service.service';

import {map, catchError} from "rxjs/operators";

@Injectable()
export class CompraService extends Service {



        constructor(private http: Http, public router: Router) {
                super(router);
        }



        registrar(parametros: any) {


                let options = this.getOptions();
                this.print("ruta: " + this.rutasCompras.API_COMPRA_REST);
                this.print("parametros : " + parametros);
                return this.http.post(this.rutasCompras.API_COMPRA_REST, parametros, options)
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
                this.print("ruta: " + this.rutasCompras.API_COMPRA_REST + "/buscar/");
                this.print("parametros : " + parametros);

                return this.http.post(this.rutasCompras.API_COMPRA_REST + "/buscar/", parametros, options)
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
                this.print("ruta: " + this.rutasCompras.API_COMPRA_REST + "/inicio/" + inicio + "/fin/" + fin + "/tamPagina/" + tamPagina + "/");
                this.print("parametros : " + parametros);

                return this.http.post(this.rutasCompras.API_COMPRA_REST + "/inicio/" + inicio + "/fin/" + fin + "/tamPagina/" + tamPagina + "/", parametros, options)
                        .pipe(map(
                        data => {
                                this.print("response:");
                                this.print(data.json());
                                if (!this.tokenInvalido(data.json())) {
                                        let res = data.json();
                                        if (res.rpta) {
                                                return res.compras;
                                        } else {
                                                return null;
                                        }
                                }
                        }
                        )
                        ,catchError(this.handleError));

        }




        editar(parametros: any, id: any) {
                this.print("ruta: " + this.rutasCompras.API_COMPRA_REST + "/id_compra/" + id + "/");
                this.print("parametros : " + parametros);

                let options = this.getOptionsToken();
                return this.http.put(this.rutasCompras.API_COMPRA_REST + "/id_compra/" + id + "/", parametros, options)
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


        eliminarLogico(id: string) {

                let options = this.getOptionsToken();

                this.print("ruta: " + this.rutasCompras.API_COMPRA_REST + "/id_compra/" + id + "/");

                return this.http.delete(this.rutasCompras.API_COMPRA_REST + "/id_compra/" + id + "/", options)
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


        eliminarLogicoEmpleado(id: string,id_empleado:string) {

                let options = this.getOptionsToken();

                this.print("ruta: " + this.rutasCompras.API_COMPRA_REST + "/id_compra/" + id + "/id_empleado/"+id_empleado+"/");

                return this.http.delete(this.rutasCompras.API_COMPRA_REST + "/id_compra/" + id + "/id_empleado/"+id_empleado+"/", options)
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

                return this.http.get(this.rutasCompras.API_COMPRA_REST + "/id/" + id + "/", options)
                        .pipe(map(
                        data => {
                                this.print("response data compra:");
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

        getCompraByIds(parametros) {

             
                /*************OPTENER CABECERAS Y TOKEN PARA PETICION**************/
                let options = this.getOptionsToken();

                //this.print("peticion:"+this.rutas.API_USUARIO_REST+"/permiso/"+idUsuario+"/");
                this.print("peticion:"+this.rutasCompras.API_COMPRA_REST+"/multiple_id/");
                this.print("parametros:"+parametros);

                return this.http.post(this.rutasCompras.API_COMPRA_REST+"/multiple_id/",parametros, options)
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
     

        }



        getAll() {

                /*************OPTENER CABECERAS Y TOKEN PARA PETICION**************/
                let options = this.getOptionsToken();

                //console.log("peticion:"+this.rutas.API_USUARIO_REST+"/permiso/"+idUsuario+"/");

                return this.http.get(this.rutasCompras.API_COMPRA_REST, options)
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
                return this.http.get(this.rutasCompras.API_COMPRA_REST + "/inicio/" + inicio + "/fin/" + fin + "/tamPagina/" + tamPagina + "/", options)
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
                return this.http.get(this.rutasCompras.API_COMPRA_REST + "/total/", options)
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
                return this.http.post(this.rutasCompras.API_COMPRA_REST + "/total/", parametros, options)
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