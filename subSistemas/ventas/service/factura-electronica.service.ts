import { Component, AfterViewInit, Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Router } from '@angular/router';

import { Service } from '../../../core/service/service.service';
import {map, catchError} from "rxjs/operators";

@Injectable()
export class FacturaElectronicaService extends Service {



        constructor(private http: Http, public router: Router) {
                super(router);
        }



        registrar(parametros: any) {


                let options = this.getOptions();
                this.print("ruta: " + this.rutasVentas.API_COMPROBANTE_REST);
                this.print("parametros : " + parametros);
                return this.http.post(this.rutasVentas.API_COMPROBANTE_REST, parametros, options)
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
                this.print("ruta: " + this.rutasVentas.API_COMPROBANTE_REST + "/buscar/");

                //let headers = new Headers({ 'Content-Type': 'application/json' });
                //let options = new RequestOptions({ headers: headers });
                //let params = "json="+parametros;
                //this.print("parametros new: " +params);
                this.print("parametros : " + parametros);

                return this.http.post(this.rutasVentas.API_COMPROBANTE_REST + "/buscar/", parametros, options)
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
                this.print("ruta: " + this.rutasVentas.API_FACTURA_ELECTRONICA_REST + "/inicio/" + inicio + "/fin/" + fin + "/tamPagina/" + tamPagina + "/");

                //let headers = new Headers({ 'Content-Type': 'application/json' });
                //let options = new RequestOptions({ headers: headers });
                //let params = "json="+parametros;
                //this.print("parametros new: " +params);
                this.print("parametros : " + parametros);

                return this.http.post(this.rutasVentas.API_FACTURA_ELECTRONICA_REST + "/inicio/" + inicio + "/fin/" + fin + "/tamPagina/" + tamPagina + "/", parametros, options)
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

        generar_archivo_txt_nota_credito_debito(parametros: any) {


                let options = this.getOptions();
                this.print("ruta: " + this.rutasVentas.API_FACTURA_ELECTRONICA_REST+"/generar_archivo_txt_nota_credito_debito/");
                this.print("parametros : " + parametros);
                return this.http.post(this.rutasVentas.API_FACTURA_ELECTRONICA_REST+"/generar_archivo_txt_nota_credito_debito/", parametros, options)
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


        generar_archivo_txt(parametros: any) {


                let options = this.getOptions();
                this.print("ruta: " + this.rutasVentas.API_FACTURA_ELECTRONICA_REST+"/generar_archivo_txt/");
                this.print("parametros : " + parametros);
                return this.http.post(this.rutasVentas.API_FACTURA_ELECTRONICA_REST+"/generar_archivo_txt/", parametros, options)
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


        sincronizar(parametros: any) {


                let options = this.getOptions();
                this.print("ruta: " + this.rutasVentas.API_FACTURA_ELECTRONICA_REST+"/sincronizar/");
                this.print("parametros : " + parametros);
                return this.http.post(this.rutasVentas.API_FACTURA_ELECTRONICA_REST+"/sincronizar/", parametros, options)
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

        eliminar_files(parametros: any) {
        

                let options = this.getOptions();
                this.print("ruta: " + this.rutasVentas.API_FACTURA_ELECTRONICA_REST+"/eliminar_files/");
                this.print("parametros : " + parametros);
                return this.http.post(this.rutasVentas.API_FACTURA_ELECTRONICA_REST+"/eliminar_files/", parametros, options)
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

        descargar(parametros: any) {


                let options = this.getOptionsTokenPDF();

                this.print("ruta: " + this.rutasVentas.API_FACTURA_ELECTRONICA_REST + "/descargar/");
                this.print("parametros: "+parametros);
                return this.http.post(this.rutasVentas.API_FACTURA_ELECTRONICA_REST + "/descargar/", parametros, options)
                      
                        .pipe(map(
                        /************FILTRAR LA DATA QUE SE QUIERE ENVIAR**************** */
                        data => {
                                this.print("data");
                                this.print(data);
                                this.print("data PDF");
                                this.print(data.json());
                                return data.json();
                                
                               /* this.print("data pdf:");
                                this.print(data.json());
                                return data.json();*/
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
        
        generar_archivo_txt_baja(parametros: any) {


                let options = this.getOptions();
                this.print("ruta: " + this.rutasVentas.API_FACTURA_ELECTRONICA_REST+"/generar_archivo_txt_baja/");
                this.print("parametros : " + parametros);
                return this.http.post(this.rutasVentas.API_FACTURA_ELECTRONICA_REST+"/generar_archivo_txt_baja/", parametros, options)
                        .pipe(map(
                        data => {

                                let res = data.json();
                                this.print("data comunicacion baja:");
                                this.print(res);
                                return res;
                        }

                        )
                        ,catchError(this.handleError));

        }

        insertar_comprobantes_generados(parametros: any) {


                let options = this.getOptions();
                this.print("ruta comprobantes generados: " + this.rutasVentas.API_FACTURA_ELECTRONICA_REST+"/insertar_comprobantes_generados/");
                this.print("parametros : " + parametros);
                return this.http.post(this.rutasVentas.API_FACTURA_ELECTRONICA_REST+"/insertar_comprobantes_generados/", parametros, options)
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




        editar(parametros: any, id: any) {
                this.print("ruta: " + this.rutasVentas.API_COMPROBANTE_REST + "/id_catalogo_venta/" + id + "/");
                this.print("parametros : " + parametros);

                let options = this.getOptionsToken();
                return this.http.put(this.rutasVentas.API_COMPROBANTE_REST + "/id_catalogo_venta/" + id + "/", parametros, options)
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
                this.print("ruta: "+this.rutasVentas.API_FACTURA_ELECTRONICA_REST + "/id_comprobante_electronico/" + id + "/");
                return this.http.delete(this.rutasVentas.API_FACTURA_ELECTRONICA_REST + "/id_comprobante_electronico/" + id + "/", options)
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

                this.print("ruta: "+this.rutasVentas.API_COMPROBANTE_REST + "/delete_comprobante/")
                this.print("parametros: "+parametros)
                return this.http.post(this.rutasVentas.API_COMPROBANTE_REST + "/delete_comprobante/",parametros, options)
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

                return this.http.get(this.rutasVentas.API_COMPROBANTE_REST+"/id/"+id+"/", options)
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





        getAll() {

                /*************OPTENER CABECERAS Y TOKEN PARA PETICION**************/
                let options = this.getOptionsToken();

                //this.print("peticion:"+this.rutas.API_USUARIO_REST+"/permiso/"+idUsuario+"/");

                return this.http.get(this.rutasVentas.API_COMPROBANTE_REST, options)
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
                return this.http.get(this.rutasVentas.API_COMPROBANTE_REST + "/inicio/" + inicio + "/fin/" + fin + "/tamPagina/" + tamPagina + "/", options)
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
                return this.http.get(this.rutasVentas.API_COMPROBANTE_REST + "/total/", options)
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

                
                this.print("ruta: " + this.rutasVentas.API_FACTURA_ELECTRONICA_REST + "/total/");
                this.print("parametros : " + parametros);
                let options = this.getOptions();
                return this.http.post(this.rutasVentas.API_FACTURA_ELECTRONICA_REST + "/total/", parametros, options)
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



        
        getFacturador(parametros: any) {

                
            
                let options = this.getOptions();
                return this.http.post(this.rutasVentas.API_FACTURA_ELECTRONICA_REST + "/obtener_facturador/", parametros, options)
                        .pipe(map(
                        /************FILTRAR LA DATA QUE SE QUIERE ENVIAR**************** */
                        data => {
                              return data;
                        }
                        )
                        ,catchError(this.handleError));

        }

        actualizarBandeja(parametros: any) {

                
            
                let options = this.getOptions();
                return this.http.post("http://localhost:9000/api/ActualizarPantalla.htm", parametros, options)
                        .pipe(map(
                        /************FILTRAR LA DATA QUE SE QUIERE ENVIAR**************** */
                        data => {
                              return data;
                        }
                        )
                        ,catchError(this.handleError));

        }

        
        limpiarBandeja(parametros: any) {

                
            
                let options = this.getOptions();
                return this.http.post("http://localhost:9000/api/EliminarBandeja.htm", parametros, options)
                        .pipe(map(
                        /************FILTRAR LA DATA QUE SE QUIERE ENVIAR**************** */
                        data => {
                              return data;
                        }
                        )
                        ,catchError(this.handleError));

        }


        mostrarXml(parametros: any) {
                let options = this.getOptions();
                return this.http.post("http://localhost:9000/api/MostrarXml.htm", parametros, options)
                        .pipe(map(
                        /************FILTRAR LA DATA QUE SE QUIERE ENVIAR**************** */
                        data => {
                              return data;
                        }
                        )
                        ,catchError(this.handleError));

        }

        //"http://localhost:9000/api/enviarXML.htm"
        //

}