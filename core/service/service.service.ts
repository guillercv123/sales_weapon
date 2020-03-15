
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Response, Headers, RequestOptions, URLSearchParams, ResponseContentType } from '@angular/http';

/*****************PARA ACTIVAR MSJ CUANDO LA SESION EXPIRE****************/
import { ControllerComponent } from '../controller/controller.component';

import { Rutas } from '../util/rutas';
import { RutasMantenedores } from '../../subSistemas/mantenedores/util/rutas-mantenedores';
import { RutasCompras } from '../../subSistemas/compras/util/rutas-compras';
import { RutasVentas } from '../../subSistemas/ventas/util/rutas-ventas';
import { RutasInventario } from '../../subSistemas/inventario/util/rutas-inventario';
import { RutasContabilidad } from '../../subSistemas/contabilidad/util/rutas-contabilidad';
import {map, catchError, throwIfEmpty} from "rxjs/operators";


export class Service {
        protected rutas: Rutas = new Rutas();
        protected rutasMantenedores: RutasMantenedores = new RutasMantenedores();
        protected rutasCompras: RutasCompras = new RutasCompras();
        protected rutasVentas: RutasVentas = new RutasVentas();
        protected rutasInventario: RutasInventario = new RutasInventario();
        protected rutasContabilidad: RutasContabilidad = new RutasContabilidad();

        constructor(protected router: Router) {

        }


        protected handleError(error: any) {
                //console.log("ERROR ENCONTRADO:"+JSON.stringify(error));
                // In a real world app, we might use a remote logging infrastructure
                // We'd also dig deeper into the error to get a better message
                let errMsg = (error.message) ? error.message :
                        error.status ? `${error.status} - ${error.statusText}` : 'Server error';
                console.error(errMsg); // log to console instead
                return Observable.throw(errMsg);
        }


        protected extractData(res: Response) {
                let body = res.json();
                this.print("cuerpo:" + body);

                return body.data || {};
        }

        protected verificarToken() {
                let jwt = localStorage.getItem("jwt");

                if (jwt != null) {
                        //rpta=true;
                        this.print("/************TIENE TOKEN VALIDO****************/");

                } else {
                        this.print("/************NO TIENE TOKEN VALIDO************/");
                        this.navegar("");
                }

        }


        protected tokenInvalido(json: any): boolean {
                let rpta = false;

                if (json.hasOwnProperty("tokenInvalido")) {
                        let tokenInvalido = json.tokenInvalido;
                        if (tokenInvalido) {
                                rpta = true;
                                localStorage.removeItem("jwt");
                                ControllerComponent.finalizaSesion = true;
                                //localStorage.setItem("tokenInvalido","true");
                                //this.mensajeInCorrecto("SESIÓN EXPIRADA - INICIAR SESIÓN");
                                this.navegar("");

                        }
                }

                return rpta;
        }


        protected navegar(ruta: string): void {
                this.router.navigate([ruta]);
        }


        protected getOptionsTokenArchivo() {

                /****************OBTENER TOKEN VALIDO***********/
                let jwt = localStorage.getItem("jwt");

                /***************CABECERAS PARA ENVIAR PARAMETROS EN PETICION GET**************/
                let headers = new Headers();
                headers.append('enctype', 'multipart/form-data');

                let options = new RequestOptions({ headers: headers });
                let params: URLSearchParams = new URLSearchParams();
                params.set("jwt", jwt);
                options.search = params;
                /********************FIN DE CABECERAS PARA ENVIAR PARAMETROS******************************************************/

                return options;

        }

        protected getOptionsJson() {
                /****************OBTENER TOKEN VALIDO***********/
                let jwt = localStorage.getItem("jwt");

                /***************CABECERAS PARA ENVIAR PARAMETROS EN PETICION GET**************/
                let headers = new Headers();
                headers.append('Content-Type', 'application/json; charset=utf-8');

                headers.append('Accept', 'application/json');
                let options = new RequestOptions({ headers: headers });
                let params: URLSearchParams = new URLSearchParams();
                params.set("jwt", jwt);
                options.search = params;
                /********************FIN DE CABECERAS PARA ENVIAR PARAMETROS******************************************************/

                return options;

        }


        protected getOptionsToken() {
                /****************OBTENER TOKEN VALIDO***********/
                let jwt = localStorage.getItem("jwt");

                /***************CABECERAS PARA ENVIAR PARAMETROS EN PETICION GET**************/
                let headers = new Headers();
                //headers.append('Content-Type', 'application/json; charset=utf-8');

                headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
                headers.append('Accept', 'application/json');
                let options = new RequestOptions({ headers: headers });
                let params: URLSearchParams = new URLSearchParams();
                params.set("jwt", jwt);
                options.search = params;
                /********************FIN DE CABECERAS PARA ENVIAR PARAMETROS******************************************************/

                return options;

        }

        protected getOptionsTokenPut() {
                /****************OBTENER TOKEN VALIDO***********/
                let jwt = localStorage.getItem("jwt");

                /***************CABECERAS PARA ENVIAR PARAMETROS EN PETICION GET**************/
                let headers = new Headers();

                //headers.append('Content-Type', 'application/json; charset=utf-8');

                headers.append('Content-Type', 'application/json');
                let options = new RequestOptions({ method: 'PUT', headers: headers });
                /********************FIN DE CABECERAS PARA ENVIAR PARAMETROS******************************************************/

                return options;

        }


        protected getOptions() {
                /****************OBTENER TOKEN VALIDO***********/
                let jwt = "token";

                /***************CABECERAS PARA ENVIAR PARAMETROS EN PETICION GET**************/
                let headers = new Headers();
                headers.append('Content-Type', 'application/json; charset=utf-8');

                //headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
                headers.append('Accept', 'application/json');
                let options = new RequestOptions({ headers: headers });
                let params: URLSearchParams = new URLSearchParams();
                params.set("jwt", jwt);
                options.search = params;
                /********************FIN DE CABECERAS PARA ENVIAR PARAMETROS******************************************************/

                return options;

        }




        protected getOptionsTokenPDF() {
                /****************OBTENER TOKEN VALIDO***********/
                let jwt = localStorage.getItem("jwt");

                /***************CABECERAS PARA ENVIAR PARAMETROS EN PETICION GET**************/
                let headers = new Headers();
                headers.append('Content-Type', 'application/pdf; charset=utf-8');
                //headers.append('Content-Type', 'application/json; charset=utf-8');

                //let options = new RequestOptions({headers: headers});
                let options = new RequestOptions({ responseType: ResponseContentType.Blob });

                //let options = new RequestOptions({responseType: 'arraybuffer'});
                let params: URLSearchParams = new URLSearchParams();
                params.set("jwt", jwt);
                options.search = params;
                /********************FIN DE CABECERAS PARA ENVIAR PARAMETROS******************************************************/

                return options;

        }



        protected getOptionsImgToken() {
                /****************OBTENER TOKEN VALIDO***********/
                let jwt = localStorage.getItem("jwt");

                /***************CABECERAS PARA ENVIAR PARAMETROS EN PETICION GET**************/
                let headers = new Headers();
                headers.append('Content-Type', 'image/jpg; charset=utf-8');
                //headers.append('Content-Type', 'application/json; charset=utf-8');

                //let options = new RequestOptions({headers: headers});
                let options = new RequestOptions({ responseType: ResponseContentType.Blob });

                //let options = new RequestOptions({responseType: 'arraybuffer'});
                let params: URLSearchParams = new URLSearchParams();
                params.set("jwt", jwt);
                options.search = params;
                /********************FIN DE CABECERAS PARA ENVIAR PARAMETROS******************************************************/

                return options;

        }




        generarReporte(ruta: string, parametros: any, http: any) {

                let options = this.getOptionsTokenPDF();

                this.print("ruta: " + ruta);
                this.print("parametros: "+parametros);
                return http.post(ruta, parametros, options)
                        .pipe(map(
                        /************FILTRAR LA DATA QUE SE QUIERE ENVIAR**************** */
                        data => {
                                this.print("data");
                                this.print(data);
                                return data;
                               
                        }
                        )
                        ,catchError(this.handleError));

        }

        SendEMail(ruta: string, parametros: any, http: any){
                let options = this.getOptionsTokenPDF();
                return http.post(ruta, parametros, options)
                        .pipe(map(
                        /************FILTRAR LA DATA QUE SE QUIERE ENVIAR**************** */
                        data => {
                                this.print("data");
                                this.print(data);
                                return data;
                               
                        }
                        )
                        ,catchError(this.handleError));
        }

        
        generarReporteFileServer(ruta: string, parametros: any, http: any) {

                let options = this.getOptionsToken();

                return http.post(ruta, parametros, options)
                        .map(
                        /************FILTRAR LA DATA QUE SE QUIERE ENVIAR**************** */
                        data => {
                                //console.log("data");
                                //console.log(data);
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
                        .catch(this.handleError);

        }



        generarReporteExcel(ruta: string, parametros: any, http: any) {

                let options = this.getOptionsTokenPDF();
                this.print("ruta: "+ruta);
                this.print("parametros:"+parametros);
                return http.post(ruta, parametros, options)
                        .pipe(map(
                        /************FILTRAR LA DATA QUE SE QUIERE ENVIAR**************** */
                        data => {
                                return data;
                               
                        }
                        )
                        ,catchError(this.handleError)); 
        }


        print(msj){
                if(this.rutas.DEBUG=='true'){
                        console.log(msj);
                }
        }

}