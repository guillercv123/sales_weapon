import { Component , AfterViewInit,Injectable } from '@angular/core';
import { Http, Headers,Response,RequestOptions,URLSearchParams} from '@angular/http';
import { Router} from '@angular/router';

//*************IMPORTACION DEL SERVICIO PRINCIPAL*********
import {Service} from './service.service';

import {map, catchError} from "rxjs/operators";


@Injectable()
export class ReporteExcelService extends Service  {


        
        constructor(private http: Http,public router: Router) {
                super(router);
	}


       generarReporteNotificacionesValidadas(parametros){
                let ruta=this.rutas.API_REPORTE_EXCEL_REST+"/notificacionesValidadas/";
                return this.generarReporteExcel(ruta,parametros,this.http);         
        }

        generarreportorteProduccionValidadaExcel(parametros){
                let ruta=this.rutas.API_REPORTE_EXCEL_REST+"/produccionValidada/";
                return this.generarReporteExcel(ruta,parametros,this.http);         
        }

        /*generarReporteSaldoCeroExcel(parametros){
                let ruta=this.rutas.API_REPORTE_EXCEL_REST+"/saldoCero/";
                return this.generarReporteExcel(ruta,parametros,this.http);         
        }*/

        generarReporteNotiPendientesExcel(parametros){
                let ruta=this.rutas.API_REPORTE_EXCEL_REST+"/notiPendientes/";
                return this.generarReporteExcel(ruta,parametros,this.http);         
        }

        generarReporteNotiNoAsignadasExcel(parametros){
                let ruta=this.rutas.API_REPORTE_EXCEL_REST+"/notiNoAsignadas/";
                return this.generarReporteExcel(ruta,parametros,this.http);         
        }

        generarReporteProduccionExcel(parametros){
                let ruta=this.rutas.API_REPORTE_EXCEL_REST+"/reporteProduccion/";
                return this.generarReporteExcel(ruta,parametros,this.http);         
        }

        generarReporteNotiManualesExcel(parametros){
                let ruta=this.rutas.API_REPORTE_EXCEL_REST+"/notiManuales/";
                return this.generarReporteExcel(ruta,parametros,this.http);         
        }


        generarExcelphp(parametros){
                let ruta=this.rutas.API_REPORTE_REST+"/reporteExcel/";
                return this.generarReporteExcel(ruta,parametros,this.http);         
        }

        generarReporteStockActualExcel(parametros){
                let ruta=this.rutas.API_REPORTE_REST+"/stockActualExcel/";
                return this.generarReporteExcel(ruta,parametros,this.http);         
        }

        generarReporteKardexExcel(parametros){
                let ruta=this.rutas.API_REPORTE_REST+"/kardexExcel/";
                return this.generarReporteExcel(ruta,parametros,this.http);         
        }

        exportarExcel(parametros){
                let ruta=this.rutas.API_REPORTE_REST+"/reporteExcel/";
                return this.generarReporteExcel(ruta,parametros,this.http);         
        }

        descarFormatoKardex(parametros){
                let ruta=this.rutasMantenedores.API_KARDEX_REST+"/descargar_formato/";
                return this.generarReporteExcel(ruta,parametros,this.http);         
        }


        descarArchivoPle(parametros){
                let ruta=this.rutasContabilidad.API_LIBRO_COMPRA_REST+"/generar_ple/";
                return this.generarReporteExcel(ruta,parametros,this.http);         
        }

        obtenerReporteExcel(ruta, parametros){
                return this.generarReporte(ruta, parametros,this.http);                 
        }
}