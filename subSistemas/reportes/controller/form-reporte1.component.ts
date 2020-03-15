import { Component, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';

import { ControllerComponent } from '../../../core/controller/controller.component';




/******************IMPORTAR SERVICIOS*************** */
import { ReportePdfService } from '../../../core/service/reporte-pdf.Service';
import { ReporteExcelService } from '../../../core/service/reporte-excel.Service';

declare var $: any;
@Component({
        selector: 'form-reporte1',
        templateUrl: '../view/form-reporte1.component.html',
        providers: [ReportePdfService,ReporteExcelService]

})

export class FormReporte1Component extends ControllerComponent implements AfterViewInit {

        constructor(
                public http: Http,
                public router: Router,
                public reportePdfService: ReportePdfService,
                public reporteExcelService: ReporteExcelService,

        ) {
                super(router);

              
        }




        ngOnInit() {
              
        }


        ngAfterViewInit() {
                if (this.verificarTokenRpta(this.rutasMantenedores.FORM_MODIFICAR_USUARIO)) {
                  
                        
                }
        }


        reportePdfStockActual() {

                let parametros = JSON.stringify({ idUsuario: 12 });
                this.reportePdfService.generarStockActualPDF(parametros)
                        .subscribe(
                        data => {
                                if (data._body.size == 0) {
                                        this.mensajeInCorrecto("DOCUMENTO DIGITALIZADO NO ENCONTRADO - HA SIDO ELIMINADO ARCHIVO ADJUNTO");
                                } else {

                                        //this.abrirPDF(data._body);
                                        this.abrirDocumentoModal(data._body);
                                        this.abrirModalPDfPorc("modalPDF",90);
                                }

                                //let rutaFile = data.json().rutaFile;
                                //let nameFile = data.json().nameFile;

                                //if (rutaFile != null && nameFile != null) {
                                //this.abrirModal();
                                //this.abrirPDFModalFileServer(rutaFile, "mostrarPDF");
                                //setTimeout(() => { this.reporteService.eliminarFileServer(nameFile).subscribe(); }, 2000);
                                //}
                        },
                        error => this.msj = <any>error
                        );

        }


        reporteExcelStockActual() {
                let parametros = JSON.stringify({ idUsuario: 12 });

                this.reporteExcelService.generarReporteStockActualExcel(parametros)
                        .subscribe(
                        data => {
                                this.print("response: ");
                                this.print(data);
                                this.print("data: ");
                                this.print(data.data);
                                this.descargarFile(data._body, "Reporte_Produccion");
                        },
                        error => this.msj = <any>error
                        );


        }


        reportePDf() {

                let parametros = JSON.stringify({ idUsuario: 12 });
                this.reportePdfService.generarPdfphp(parametros)
                        .subscribe(
                        data => {
                                if (data._body.size == 0) {
                                        this.mensajeInCorrecto("DOCUMENTO DIGITALIZADO NO ENCONTRADO - HA SIDO ELIMINADO ARCHIVO ADJUNTO");
                                } else {

                                        //this.abrirPDF(data._body);
                                        this.abrirDocumentoModal(data._body);
                                        this.abrirModalPDf("modalPDF");
                                }

                                //let rutaFile = data.json().rutaFile;
                                //let nameFile = data.json().nameFile;

                                //if (rutaFile != null && nameFile != null) {
                                //this.abrirModal();
                                //this.abrirPDFModalFileServer(rutaFile, "mostrarPDF");
                                //setTimeout(() => { this.reporteService.eliminarFileServer(nameFile).subscribe(); }, 2000);
                                //}
                        },
                        error => this.msj = <any>error
                        );

        }


        reporteExcel() {
                let parametros = JSON.stringify({ idUsuario: 12 });

                this.reporteExcelService.generarExcelphp(parametros)
                        .subscribe(
                        data => {
                                this.print("response: ");
                                this.print(data);
                                this.print("data: ");
                                this.print(data.data);
                                this.descargarFile(data._body, "Reporte_Produccion");
                        },
                        error => this.msj = <any>error
                        );


        }
}