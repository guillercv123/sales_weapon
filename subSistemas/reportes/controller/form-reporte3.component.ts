import { Component, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';

import { ControllerComponent } from '../../../core/controller/controller.component';




/******************IMPORTAR SERVICIOS*************** */
import { ReportePdfService } from '../../../core/service/reporte-pdf.Service';
import { ReporteExcelService } from '../../../core/service/reporte-excel.Service';

declare var $: any;
@Component({
        selector: 'form-reporte3',
        templateUrl: '../view/form-reporte3.component.html',
        providers: [ReportePdfService,ReporteExcelService]

})

export class FormReporte3Component extends ControllerComponent implements AfterViewInit {

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

}