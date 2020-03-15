import { Component , AfterViewInit,Injectable } from '@angular/core';
import { Http, Headers,Response,RequestOptions,URLSearchParams} from '@angular/http';
import { Router} from '@angular/router';

import {Service} from '../../../core/service/service.service';

import {map, catchError} from "rxjs/operators";

@Injectable()
export class VistaService extends Service  {



        
        constructor(private http: Http,public router: Router) {
                super(router);
	}




      
       seleccionarTodos(){

                let options=this.getOptionsToken();

                return this.http.get(this.rutas.API_VISTA_REST,options) 
                                .pipe(map(
                                        /************FILTRAR LA DATA QUE SE QUIERE ENVIAR**************** */
                                        data => {
                                                if(!this.tokenInvalido(data.json())){
                                                        if (data.json().rpta) {
                                                                return data.json();
                                                        }else{
                                                                return null;
                                                        }
                                                }
                                        }
                                )
                                ,catchError(this.handleError));
         
        }
  






}