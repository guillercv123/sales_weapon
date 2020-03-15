import { Component, AfterViewInit, Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Router } from '@angular/router';

import { Service } from '../../../core/service/service.service';

import {map, catchError} from "rxjs/operators";

@Injectable()
export class LibroDiarioService extends Service {



        constructor(private http: Http, public router: Router) {
                super(router);
        }


        reporteLibroDiario(parametros: any, http: any) {

                let options = this.getOptions();
                this.print("ruta: " + this.rutasContabilidad.API_LIBRO_DIARIO_REST + "/reporte/");
                this.print("parametros : " + parametros);

                return http.post(this.rutasContabilidad.API_LIBRO_DIARIO_REST + "/reporte/", parametros, options)
                .pipe(map(
                /************FILTRAR LA DATA QUE SE QUIERE ENVIAR**************** */
                data => {
                        this.print("data");
                        this.print(data);
                        return data;
                        /*if(!this.tokenInvalido(data.json())){
                                if (data.json().rpta) {
                                        return data.json();
                                }else{
                                        return null;
                                }
                        }*/
                }
                )
                ,catchError(this.handleError));

        }



        registrar(parametros: any) {


                let options = this.getOptions();
                this.print("ruta: " + this.rutasContabilidad.API_LIBRO_DIARIO_REST);
                this.print("parametros : " + parametros);
                return this.http.post(this.rutasContabilidad.API_LIBRO_DIARIO_REST, parametros, options)
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




        buscarPaginacion(inicio: any, fin: any, tamPagina: any, parametros: any) {


                let options = this.getOptions();
                this.print("ruta: " + this.rutasContabilidad.API_LIBRO_DIARIO_REST + "/inicio/" + inicio + "/fin/" + fin + "/tamPagina/" + tamPagina + "/");
                this.print("parametros : " + parametros);

                return this.http.post(this.rutasContabilidad.API_LIBRO_DIARIO_REST + "/inicio/" + inicio + "/fin/" + fin + "/tamPagina/" + tamPagina + "/", parametros, options)
                        .pipe(map(
                        data => {
                                this.print("response:");
                                this.print(data.json());
                                if (!this.tokenInvalido(data.json())) {
                                        let res = data.json();
                                        if (res.rpta) {
                                                return res.libros_diarios;
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
                return this.http.post(this.rutasContabilidad.API_LIBRO_DIARIO_REST + "/total/", parametros, options)
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


        editar(parametros: any, id: any) {
                this.print("ruta: " + this.rutasContabilidad.API_LIBRO_DIARIO_REST + "/id_libro/" + id + "/");
                this.print("parametros : " + parametros);

                let options = this.getOptionsToken();
                return this.http.put(this.rutasContabilidad.API_LIBRO_DIARIO_REST + "/id_libro/" + id + "/", parametros, options)
                        .pipe(map(
                                data => {

                                        let res = data.json();
                                        this.print("data libro diario:");
                                        this.print(res);
                                        return res;
                                }

                        )
                        ,catchError(this.handleError));

        }


        eliminarLogico(id: string) {

                let options = this.getOptionsToken();

                this.print("ruta: " + this.rutasContabilidad.API_LIBRO_DIARIO_REST + "/id_libro/" + id + "/");

                return this.http.delete(this.rutasContabilidad.API_LIBRO_DIARIO_REST + "/id_libro/" + id + "/", options)
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



        getDetalleLibroById(id: any) {

                /*************OPTENER CABECERAS Y TOKEN PARA PETICION**************/
                let options = this.getOptionsToken();

                //console.log("peticion:"+this.rutas.API_USUARIO_REST+"/permiso/"+idUsuario+"/");

                return this.http.get(this.rutasContabilidad.API_LIBRO_DIARIO_REST + "/id/" + id + "/", options)
                        .pipe(map(
                        data => {
                                this.print("response data livro diarip:");
                                this.print(data.json());
                                if (!this.tokenInvalido(data.json())) {
                                        let res = data.json();
                                        if (res.rpta) {
                                                return res.libro_diario;
                                        } else {
                                                return null;
                                        }
                                }
                        }

                        ),catchError(this.handleError));
                //.catch(this.handleError);

        }







  
       

}