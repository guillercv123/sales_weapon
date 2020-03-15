import { Component, AfterViewInit, Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Router } from '@angular/router';


import { Service } from '../../../core/service/service.service';
import {map, catchError} from "rxjs/operators";

@Injectable()
export class ComprobanteElectronicoService extends Service {



        constructor(private http: Http, public router: Router) {
                super(router);
        }



        registrar(parametros: any) {


                let options = this.getOptions();
                this.print("ruta: " + this.rutasVentas.API_COMPROBANTE_ELECTRONICO_REST);
                this.print("parametros : " + parametros);
                return this.http.post(this.rutasVentas.API_COMPROBANTE_ELECTRONICO_REST, parametros, options)
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
                this.print("ruta: " + this.rutasVentas.API_COMPROBANTE_ELECTRONICO_REST + "/buscar/");

                //let headers = new Headers({ 'Content-Type': 'application/json' });
                //let options = new RequestOptions({ headers: headers });
                //let params = "json="+parametros;
                //this.print("parametros new: " +params);
                this.print("parametros : " + parametros);

                return this.http.post(this.rutasVentas.API_COMPROBANTE_ELECTRONICO_REST + "/buscar/", parametros, options)
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
                this.print("ruta: " + this.rutasVentas.API_COMPROBANTE_ELECTRONICO_REST + "/id_catalogo_venta/" + id + "/");
                this.print("parametros : " + parametros);

                let options = this.getOptionsToken();
                return this.http.put(this.rutasVentas.API_COMPROBANTE_ELECTRONICO_REST + "/id_catalogo_venta/" + id + "/", parametros, options)
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


        eliminarLogico(id: string) {

                let options = this.getOptionsToken();

                return this.http.delete(this.rutasVentas.API_COMPROBANTE_ELECTRONICO_REST + "/id_comprobante/" + id + "/", options)
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



        eliminarLogicoComprobante(parametros) {

                let options = this.getOptionsToken();

                this.print("ruta: "+this.rutasVentas.API_COMPROBANTE_ELECTRONICO_REST + "/delete_comprobante/")
                this.print("parametros: "+parametros)
                return this.http.post(this.rutasVentas.API_COMPROBANTE_ELECTRONICO_REST + "/delete_comprobante/",parametros, options)
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


        getComprobanteById(id:any) {

                /*************OPTENER CABECERAS Y TOKEN PARA PETICION**************/
                let options = this.getOptionsToken();

                //this.print("peticion:"+this.rutas.API_USUARIO_REST+"/permiso/"+idUsuario+"/");

                return this.http.get(this.rutasVentas.API_COMPROBANTE_ELECTRONICO_REST+"/id/"+id+"/", options)
                        .pipe(map(
                        data => {
                                this.print("response:");
                                this.print(data.json());
                                if (!this.tokenInvalido(data.json())) {
                                        let res = data.json();
                                        if (res.rpta) {
                                                return res.comprobante;
                                        } else {
                                                return null;
                                        }
                                }
                        }

                        ),catchError(this.handleError));
                //.catch(this.handleError);

        }





        buscarPaginacion(inicio: any, fin: any, tamPagina: any, parametros: any) {


                let options = this.getOptions();
                this.print("ruta: " + this.rutasVentas.API_COMPROBANTE_ELECTRONICO_REST + "/inicio/" + inicio + "/fin/" + fin + "/tamPagina/" + tamPagina + "/");
                this.print("parametros : " + parametros);

                return this.http.post(this.rutasVentas.API_COMPROBANTE_ELECTRONICO_REST + "/inicio/" + inicio + "/fin/" + fin + "/tamPagina/" + tamPagina + "/", parametros, options)
                        .pipe(map(
                        data => {
                                this.print("response:");
                                this.print(data.json());
                                if (!this.tokenInvalido(data.json())) {
                                        let res = data.json();
                                        if (res.rpta) {
                                                return res.comprobantes;
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
                return this.http.post(this.rutasVentas.API_COMPROBANTE_ELECTRONICO_REST + "/total/", parametros, options)
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