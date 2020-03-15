import { Component, AfterViewInit, Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Router } from '@angular/router';

import { Service } from '../../../core/service/service.service';
import {map, catchError} from "rxjs/operators";

@Injectable()
export class VentaService extends Service {



        constructor(private http: Http, public router: Router) {
                super(router);
        }



        registrar(parametros: any) {


                let options = this.getOptions();
                this.print("ruta: " + this.rutasVentas.API_VENTA_REST);
                this.print("parametros : " + parametros);
                return this.http.post(this.rutasVentas.API_VENTA_REST, parametros, options)
                        .pipe(map(
                        data => {

                                let res = data.json();
                                this.print("data venta:");
                                this.print(res);
                                return res;
                        }

                        )
                        ,catchError(this.handleError));

        }




        buscarPaginacion(inicio: any, fin: any, tamPagina: any, parametros: any,id:any) {


                let options = this.getOptions();
                this.print("ruta: " + this.rutasVentas.API_VENTA_REST + "/inicio/" + inicio + "/fin/" + fin + "/tamPagina/" + tamPagina + "/"+id);

                this.print("parametros : " + parametros);

                return this.http.post(this.rutasVentas.API_VENTA_REST + "/inicio/" + inicio + "/fin/" + fin + "/tamPagina/" + tamPagina + "/"+id, parametros, options)
                        .pipe(map(
                        data => {
                                this.print("response:");
                                this.print(data.json());
                                if (!this.tokenInvalido(data.json())) {
                                        let res = data.json();
                                        if (res.rpta) {
                                                return res.ventas;
                                        } else {
                                                return null;
                                        }
                                }
                        }
                        )
                        ,catchError(this.handleError));
        }

        buscarVentasPagadas(inicio: any, fin: any, tamPagina: any, parametros: any,id:any) {


                let options = this.getOptions();
             

                return this.http.post(this.rutasVentas.API_VENTA_REST+"/ventas_pagadas/inicio/" + inicio + "/fin/" + fin + "/tamPagina/" + tamPagina + "/"+id, parametros, options)
                        .pipe(map(
                        data => {
                                this.print("response:");
                                this.print(data.json());
                                if (!this.tokenInvalido(data.json())) {
                                        let res = data.json();
                                        if (res.rpta) {
                                                return res.ventas_pagadas;
                                        } else {
                                                return null;
                                        }
                                }
                        }
                        )
                        ,catchError(this.handleError));
        }

        getTotalVentasPagadas(parametros: any) {

                let options = this.getOptions();
                return this.http.post(this.rutasVentas.API_VENTA_REST + "/ventas_pagadas/total/", parametros, options)
                        .pipe(map(
                        /************FILTRAR LA DATA QUE SE QUIERE ENVIAR**************** */
                        data => {
                                if (!this.tokenInvalido(data.json())) {
                                        if (data.json().rpta) {
                                                return data.json().Total_ventas_pagadas;
                                        } else {
                                                return null;
                                        }
                                }
                        }
                        )
                        ,catchError(this.handleError));

        }



        buscarVentasPorPagar(parametros: any) {


                let options = this.getOptions();
                this.print("ruta: " + this.rutasVentas.API_VENTA_REST + "/ventas_por_pagar/");

                //let headers = new Headers({ 'Content-Type': 'application/json' });
                //let options = new RequestOptions({ headers: headers });
                //let params = "json="+parametros;
                //this.print("parametros new: " +params);
                this.print("parametros : " + parametros);

                return this.http.post(this.rutasVentas.API_VENTA_REST + "/ventas_por_pagar/", parametros, options)
                        .pipe(map(
                        data => {
                                this.print("response:");
                                this.print(data.json());
                                if (!this.tokenInvalido(data.json())) {
                                        let res = data.json();
                                        if (res.rpta) {
                                                return res.ventas;
                                        } else {
                                                return null;
                                        }
                                }
                        }
                        )
                        ,catchError(this.handleError));
        }




        getUltimasVentas(parametros: any,id:any) {


                let options = this.getOptions();
                this.print("ruta: " + this.rutasVentas.API_VENTA_REST + "/ventas_por_pagar/"+id);
                this.print("parametros : " + parametros);

                return this.http.post(this.rutasVentas.API_VENTA_REST + "/ventas_por_pagar/"+id, parametros, options)
                        .pipe(map(
                        data => {
                                this.print("response:");
                                this.print(data.json());
                                if (!this.tokenInvalido(data.json())) {
                                        let res = data.json();
                                        if (res.rpta) {
                                                return res.ventas;
                                        } else {
                                                return null;
                                        }
                                }
                        }
                        )
                        ,catchError(this.handleError));
        }



        editar(parametros: any, id: any) {
                this.print("ruta: " + this.rutasVentas.API_VENTA_REST + "/venta/" + id + "/");
                this.print("parametros : " + parametros);

                let options = this.getOptionsToken();
                return this.http.put(this.rutasVentas.API_VENTA_REST + "/venta/" + id + "/", parametros, options)
                        .pipe(map(
                        data => {

                                let res = data.json();
                                this.print("data editar venta:");
                                this.print(res);
                                return res;
                        }

                        )
                        ,catchError(this.handleError));

        }


        eliminarLogico(id: string) {

                let options = this.getOptionsToken();
                this.print("ruta: "+this.rutasVentas.API_VENTA_REST + "/id_venta/" + id + "/");
               
                return this.http.delete(this.rutasVentas.API_VENTA_REST + "/id_venta/" + id + "/", options)
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

        eliminarLogicoEmpleado(id: string,id_emmpleado:string) {

                let options = this.getOptionsToken();
                this.print("ruta eliminar Venta: "+this.rutasVentas.API_VENTA_REST + "/id_venta/" + id + "/id_empleado/" + id_emmpleado + "/");
                return this.http.delete(this.rutasVentas.API_VENTA_REST + "/id_venta/" + id + "/id_empleado/" + id_emmpleado + "/", options)
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

        anularLogicoEmpleado(id: string,id_emmpleado:string) {

                let options = this.getOptionsToken();
                this.print("ruta: "+this.rutasVentas.API_VENTA_REST + "/anular/id_venta/" + id + "/id_empleado/" + id_emmpleado + "/");
                return this.http.delete(this.rutasVentas.API_VENTA_REST + "/anular/id_venta/" + id + "/id_empleado/" + id_emmpleado + "/", options)
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



        getVentaById(id:any) {

                /*************OPTENER CABECERAS Y TOKEN PARA PETICION**************/
                let options = this.getOptionsToken();

                this.print("ruta:"+this.rutasVentas.API_VENTA_REST+"/id/"+id+"/");

                return this.http.get(this.rutasVentas.API_VENTA_REST+"/id/"+id+"/", options)
                        .pipe(map(
                        data => {
                                this.print("response:");
                                this.print(data.json());
                                if (!this.tokenInvalido(data.json())) {
                                        let res = data.json();
                                        if (res.rpta) {
                                                return res.venta;
                                        } else {
                                                return null;
                                        }
                                }
                        }

                        ),catchError(this.handleError));
                //.catch(this.handleError);

        }


        getVentaByIds(parametros) {

                /*************OPTENER CABECERAS Y TOKEN PARA PETICION**************/
                let options = this.getOptionsToken();

                //this.print("peticion:"+this.rutas.API_USUARIO_REST+"/permiso/"+idUsuario+"/");
                this.print("peticion:"+this.rutasVentas.API_VENTA_REST+"/multiple_id/");
                this.print("parametros:"+parametros);

                return this.http.post(this.rutasVentas.API_VENTA_REST+"/multiple_id/",parametros, options)
                        .pipe(map(
                        data => {
                                this.print("response:");
                                this.print(data.json());
                                if (!this.tokenInvalido(data.json())) {
                                        let res = data.json();
                                        if (res.rpta) {
                                                return res.venta;
                                        } else {
                                                return null;
                                        }
                                }
                        }

                        ),catchError(this.handleError));
                //.catch(this.handleError);

        }



        getTotalParametros(parametros: any) {

                let options = this.getOptions();
                return this.http.post(this.rutasVentas.API_VENTA_REST + "/total/", parametros, options)
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

        updateVenta(id:any,parametros:any){
                let options = this.getOptionsToken();
                return this.http.put(this.rutasVentas.API_VENTA_REST+"/editarVenta/id_venta/"+id+"/",parametros,options)
                        .pipe(map(
                                data=>{
                                let res = data.json();
                                this.print("data EDITAR VENTA:");
                                this.print(res);
                                return res;  
                                }
                        ),catchError(this.handleError));

        }


}