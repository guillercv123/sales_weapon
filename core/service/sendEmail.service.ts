import { Component , AfterViewInit,Injectable } from '@angular/core';
import { Http, Headers,Response,RequestOptions,URLSearchParams} from '@angular/http';
import { Router} from '@angular/router';

//*************IMPORTACION DEL SERVICIO PRINCIPAL*********
import {Service} from './service.service';

import {map, catchError} from "rxjs/operators";

@Injectable()
export class SendEmailService extends Service  {


        
        constructor(private http: Http,public router: Router) {
                super(router);
	}

        SendEmail(parametros:any){
               
                let options = this.getOptionsToken();

                this.print("parametros:" +parametros);
                this.print("parametros:" +this.rutas.API_SENDEMAIL_REST);
                
                return this.http.post(this.rutas.API_SENDEMAIL_REST, parametros, options)
                        .pipe(map(
                        data => {

                            let res = data.json();
                            this.print("respuesta"+data.json());
                            if (res != null) {
                                    return res.rpta;
                            } else {
                                    return null;
                            }
                        }

                        )
                        ,catchError(this.handleError));
              
        }

      
}