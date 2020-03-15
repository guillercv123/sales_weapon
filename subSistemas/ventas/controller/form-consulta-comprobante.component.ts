import { Component, AfterViewInit, ViewChild} from '@angular/core';
import { Http} from '@angular/http';
import { Router,ActivatedRoute, Params} from '@angular/router';

import { ControllerComponent } from '../../../core/controller/controller.component';




/******************IMPORTAR SERVICIOS*************** */


import { ReportePdfService } from '../../../core/service/reporte-pdf.Service';
import { ComprobanteService } from '../../ventas/service/comprobante.service';


declare var $: any;
@Component({
        selector: 'form-consulta-comprobante',
        templateUrl: '../view/form-consulta-comprobante.component.html',
        providers: [ReportePdfService,ComprobanteService]

})

export class FormConsultaComprobanteComponent extends ControllerComponent implements AfterViewInit {
       
        numeroSelected: any=null;
        serieSelected: any=null;
        idComprobanteSelected: any=null;
        lista_locales:any[];

        constructor(
                public http: Http,
                public router: Router,
                public reportePdfService: ReportePdfService,
                public comprobanteService: ComprobanteService,
                private rutaActiva: ActivatedRoute
        ) {
                super(router);

             
        }




        ngOnInit() {
               /* this.obtenerCategoriasComprobante();
                this.obtenerMediosPago();
                this.obtenerComprobantes();*/
                this.lista_locales =  new Array();
                let array_almacen = JSON.parse(localStorage.getItem("almacen_start"));
                this.lista_locales.push(array_almacen);
               
        }


        ngAfterViewInit() {
              
                let serie_obj=this.rutaActiva.snapshot.params.serie;
                let numero_obj=this.rutaActiva.snapshot.params.numero;
                  
                
                this.print("serie: "+serie_obj+" , numero: "+numero_obj);

                let parametros = JSON.stringify({
                        serie:  serie_obj ,
                        numero: numero_obj
                });

                this.comprobanteService.buscarPaginacion(1,100, 100, parametros)
                        .subscribe(
                        data => {
                                let listaComprobantes = data;
                                this.print(data);

                                if(listaComprobantes!=null){
                                        this.print("tamaño de array: "+listaComprobantes.length);
                                        if(listaComprobantes.length>0){
                                                let obj=listaComprobantes[0];
                                                this.imprimir(obj.id_comprobante);
                                        }
                                }

                        },
                        error => this.msj = <any>error);


        }




        imprimir(id_comprobante) {
                let id = this.lista_locales[0].id_local;
                 
                       this.reportePdfService.obtenerComprobantePdf(id_comprobante,id)
                                .subscribe(
                                data => {
                                        if (data._body.size == 0) {
                                               // this.mensajeInCorrecto("DOCUMENTO DIGITALIZADO NO ENCONTRADO - HA SIDO ELIMINADO ARCHIVO ADJUNTO");
                                        } else {
                                                this.abrirDocumentoModalId(data._body,'mostrarPrincipalPDF');
                                                this.abrirModalPDfPorc("modalPrincipalPDF", 90);
                                        }


                                },
                                error => this.msj = <any>error
                                );
                

        }


     
}