import { Component, AfterViewInit, Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Router } from '@angular/router';

import { Service } from '../../../core/service/service.service';
import {map, catchError} from "rxjs/operators";

@Injectable()
export class FacturadorSunatService extends Service {



        constructor(private http: Http, public router: Router) {
                super(router);
        }





        getAllTipoNotaCredito() {


                let options = this.getOptions();
                this.print("ruta: " + this.rutasVentas.API_FACTURADOR_SUNAT_REST + "/tipo_nota_credito/all/");
                //this.print("parametros : " + parametros);

                return this.http.post(this.rutasVentas.API_FACTURADOR_SUNAT_REST + "/tipo_nota_credito/all/", null, options)
                        .pipe(map(
                        data => {
                                this.print("response:");
                                this.print(data.json());
                                if (!this.tokenInvalido(data.json())) {
                                        let res = data.json();
                                        if (res.rpta) {
                                                return res.documentos;
                                        } else {
                                                return null;
                                        }
                                }
                        }
                        )
                        ,catchError(this.handleError));

        }


        getAllTipoNotaDebito() {


                let options = this.getOptions();
                this.print("ruta: " + this.rutasVentas.API_FACTURADOR_SUNAT_REST + "/tipo_nota_debito/all/");
                //this.print("parametros : " + parametros);

                return this.http.post(this.rutasVentas.API_FACTURADOR_SUNAT_REST + "/tipo_nota_debito/all/", null, options)
                        .pipe(map(
                        data => {
                                this.print("response:");
                                this.print(data.json());
                                if (!this.tokenInvalido(data.json())) {
                                        let res = data.json();
                                        if (res.rpta) {
                                                return res.documentos;
                                        } else {
                                                return null;
                                        }
                                }
                        }
                        )
                        ,catchError(this.handleError));

        }


        getAllTipoFactura() {


                let options = this.getOptions();
                this.print("ruta: " + this.rutasVentas.API_FACTURADOR_SUNAT_REST + "/tipo_factura/all/");
                //this.print("parametros : " + parametros);

                return this.http.post(this.rutasVentas.API_FACTURADOR_SUNAT_REST + "/tipo_factura/all/", null, options)
                        .pipe(map(
                        data => {
                                this.print("response:");
                                this.print(data.json());
                                if (!this.tokenInvalido(data.json())) {
                                        let res = data.json();
                                        if (res.rpta) {
                                                return res.documentos;
                                        } else {
                                                return null;
                                        }
                                }
                        }
                        )
                        ,catchError(this.handleError));

        }


        buscarDocumentosPaginacion(inicio: any, fin: any, tamPagina: any, parametros: any) {


                let options = this.getOptions();
                this.print("ruta: " + this.rutasVentas.API_FACTURADOR_SUNAT_REST + "/inicio/" + inicio + "/fin/" + fin + "/tamPagina/" + tamPagina + "/");
                this.print("parametros : " + parametros);

                return this.http.post(this.rutasVentas.API_FACTURADOR_SUNAT_REST + "/inicio/" + inicio + "/fin/" + fin + "/tamPagina/" + tamPagina + "/", parametros, options)
                        .pipe(map(
                        data => {
                                this.print("response:");
                                this.print(data.json());
                                if (!this.tokenInvalido(data.json())) {
                                        let res = data.json();
                                        if (res.rpta) {
                                                return res.documentos;
                                        } else {
                                                return null;
                                        }
                                }
                        }
                        )
                        ,catchError(this.handleError));

        }



        getTotalDocumentosParametros(parametros: any) {

                
                this.print("ruta: " + this.rutasVentas.API_FACTURADOR_SUNAT_REST + "/total/");
                this.print("parametros : " + parametros);
                let options = this.getOptions();
                return this.http.post(this.rutasVentas.API_FACTURADOR_SUNAT_REST + "/total/", parametros, options)
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

        

        generarXml(parametros: any, servidor) {

                let options = this.getOptions();
                return this.http.post(servidor+"/api/GenerarComprobante.htm", parametros, options)
                        .pipe(map(
                        /************FILTRAR LA DATA QUE SE QUIERE ENVIAR**************** */
                        data => {
                              return data.json();
                        }
                        )
                        ,catchError(this.handleError));

        //generarXml(lista, ruta) {
                /*let registros=0;
                let tam=lista.length;
                this.print("tam: "+tam);
                for(let i=0;i<tam;i++){
                        let obj=lista[i];
                        let parametros = JSON.stringify({
                                num_ruc: obj.NUM_RUC,
                                tip_docu:obj.TIP_DOCU,
                                num_docu: obj.NUM_DOCU         
                        });
        
                        let options = this.getOptions();
                        this.http.post(ruta+"/api/GenerarComprobante.htm", parametros, options)
                                .subscribe(
                                data => {
                                        let result=data.json();
                                        let res=result._body;
                                        this.print("resultado xml");
                                        console.log(result);
                                        registros++;
                                },
                                error => {}
                                );
                                
                }

                
                return registros;*/
        }


        enviarXml(parametros, servidor) {

                /*var tam=lista.length;
                this.print("tam: "+tam);
                for(let i=0;i<tam;i++){
                        let obj=lista[i];
                        let parametros = JSON.stringify({
                                num_ruc: obj.NUM_RUC,
                                tip_docu:obj.TIP_DOCU,
                                num_docu: obj.NUM_DOCU         
                        });
        
                        let options = this.getOptions();
                        this.http.post(ruta+"/api/enviarXML.htm", parametros, options)
                                .subscribe(
                                data => {
                                        this.print("resultado xml");
                                        console.log(data);
                                },
                                error => {}
                                );
                                
                }*/

                
                let options = this.getOptions();
                return this.http.post(servidor+"/api/enviarXML.htm", parametros, options)
                        .pipe(map(
                        /************FILTRAR LA DATA QUE SE QUIERE ENVIAR**************** */
                        data => {
                              return data.json();
                        }
                        )
                        ,catchError(this.handleError));

        }

        
        genearPdfFacturador(parametros, servidor) {

                /*var tam=lista.length;
                this.print("tam: "+tam);
                for(let i=0;i<tam;i++){
                        let obj=lista[i];
                        let parametros = JSON.stringify({
                                nomArch:obj.NUM_RUC+"-"+obj.TIP_DOCU+"-"+obj.NUM_DOCU
                        });
        
                        let options = this.getOptions();
                        this.http.post(ruta+"/api/MostrarXml.htm", parametros, options)
                                .subscribe(
                                data => {
                                        this.print("resultado xml");
                                        console.log(data);
                                },
                                error => {}
                                );
                                
                }*/
                let options = this.getOptions();
                return this.http.post(servidor+"/api/MostrarXml.htm", parametros, options)
                        .pipe(map(
                        /************FILTRAR LA DATA QUE SE QUIERE ENVIAR**************** */
                        data => {
                              return data.json();
                        }
                        )
                        ,catchError(this.handleError));

        }



        eliminarBandeja(servidor) {

                let options = this.getOptions();
                return this.http.post(servidor+"/api/EliminarBandeja.htm", null, options)
                        .pipe(map(
                        /************FILTRAR LA DATA QUE SE QUIERE ENVIAR**************** */
                        data => {
                              return data.json();
                        }
                        )
                        ,catchError(this.handleError));
        }
        
        actualizarBandeja(servidor) {

                let options = this.getOptions();
                return this.http.post(servidor+"/api/ActualizarPantalla.htm", null, options)
                        .pipe(map(
                        /************FILTRAR LA DATA QUE SE QUIERE ENVIAR**************** */
                        data => {
                              return data.json();
                        }
                        )
                        ,catchError(this.handleError));
        }

        //"http://localhost:9000/api/enviarXML.htm"
        //

}