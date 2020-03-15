import { Component , AfterViewInit,Injectable } from '@angular/core';
import { Http, Headers,Response,RequestOptions,URLSearchParams} from '@angular/http';
import { Router} from '@angular/router';

//*************IMPORTACION DEL SERVICIO PRINCIPAL*********
import {Service} from './service.service';

import {map, catchError} from "rxjs/operators";

@Injectable()
export class ReportePdfService extends Service  {


        
        constructor(private http: Http,public router: Router) {
                super(router);
	}


        obtenerDocumentoFileServer(parametros){
                let ruta=this.rutas.API_REPORTE_REST+"/FileServer/documento/";
                return this.generarReporteFileServer(ruta,parametros,this.http);          
        }

 
        obtenerDocumento(parametros){
                let ruta=this.rutas.API_REPORTE_REST+"/documento/";
                return this.generarReporte(ruta,parametros,this.http);                 
        }

        obtenerNuevoUsuario(parametros){
                let ruta=this.rutas.API_REPORTE_REST+"/usuarioNuevo/";
                return this.generarReporte(ruta,parametros,this.http);                 
        }

        obtenerAutorizacionNuevoUsuarioFileServer(parametros){
                let ruta=this.rutas.API_REPORTE_REST+"/FileServer/autorizacionUsuarioNuevo/";
                return this.generarReporteFileServer(ruta,parametros,this.http);                 
        }

        obtenerAutorizacionNuevoUsuario(parametros){
                let ruta=this.rutas.API_REPORTE_REST+"/autorizacionUsuarioNuevo/";
                return this.generarReporte(ruta,parametros,this.http);                 
        }

        obtenerNuevasClaves(){
                let ruta=this.rutas.API_REPORTE_REST+"/FileServer/nuevasClaves/";
                return this.generarReporteFileServer(ruta,null,this.http);                 
        }

        eliminarFileServer(file){
                let ruta=this.rutas.API_REPORTE_REST+"/FileServer/eliminarDoc/";
                let parametros= JSON.stringify({fileName:file});
                return this.generarReporteFileServer(ruta,parametros,this.http);          
        }


        generarPdfphp(parametros){
                let ruta=this.rutas.API_REPORTE_REST+"/reporte/";
                return this.generarReporte(ruta,parametros,this.http);                 
        }


        generarStockActualPDF(parametros){
                let ruta=this.rutas.API_REPORTE_REST+"/stockActualPdf/";
                return this.generarReporte(ruta,parametros,this.http);                 
        }

        generarKardexPDF(parametros){
                let ruta=this.rutas.API_REPORTE_REST+"/kardexPdf/";
                return this.generarReporte(ruta,parametros,this.http);                 
        }


        generarFacturaPdf(parametros){
                let ruta=this.rutas.API_REPORTE_REST+"/factura/";
                return this.generarReporte(ruta,parametros,this.http);                 
        }

        exportarPdf(parametros){
                let ruta=this.rutas.API_REPORTE_REST+"/reportePdf/";
                return this.generarReporte(ruta,parametros,this.http);                 
        }


        obtenerPagoPdf(id_pago){
                let ruta=this.rutas.API_REPORTE_REST+"/pago/"+id_pago+"/";
                return this.generarReporte(ruta,null,this.http);                 
        }


        obtenerComprobanteBlancoPdf(id_comprobante){
                let ruta=this.rutas.API_REPORTE_REST+"/comprobante_blanco/"+id_comprobante+"/";
                return this.generarReporte(ruta,null,this.http);                 
        }

        obtenerComprobantePdf(id_comprobante,id){
                let ruta=this.rutas.API_REPORTE_REST+"/comprobante/"+id_comprobante+"/"+id;
                return this.generarReporte(ruta,null,this.http);                 
        }

        obtenerComprobantePdf2(id_comprobante){
                let ruta=this.rutas.API_REPORTE_REST+"/comprobante_invertido/"+id_comprobante+"/";
                return this.generarReporte(ruta,null,this.http);                 
        }

        obtenerComprobantePdfA4(id_comprobante){
                let ruta=this.rutas.API_REPORTE_REST+"/comprobantea4/"+id_comprobante+"/";
                return this.generarReporte(ruta,null,this.http);                 
        }
        obtenerComprobantePdfA4compra(id_comprobante){
                let ruta=this.rutas.API_REPORTE_REST+"/comprobantea4/compra/"+id_comprobante+"/";
                return this.generarReporte(ruta,null,this.http);                 
        }

        obtenerComprobantePdTicketera(id_comprobante,id){
                let ruta=this.rutas.API_REPORTE_REST+"/ticketera/"+id_comprobante+"/"+id;
                return this.generarReporte(ruta,null,this.http);                 
        }

        obtenerCotizacionPdf(id_cotizacion){
                let ruta=this.rutas.API_REPORTE_REST+"/cotizacion/"+id_cotizacion+"/";
                return this.generarReporte(ruta,null,this.http);                 
        }

        obtenerGuiaRemisionPdf(id_guia){
                let ruta=this.rutas.API_REPORTE_REST+"/guia_remision/"+id_guia+"/";
                return this.generarReporte(ruta,null,this.http);                 
        }
}