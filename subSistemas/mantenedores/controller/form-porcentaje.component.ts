import { Component, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';

import { ControllerComponent } from '../../../core/controller/controller.component';




/******************IMPORTAR SERVICIOS*************** */


import { PorcentajeService } from '../service/porcentaje.service';


import { Vista } from '../model/Vista';

declare var $: any;
@Component({
        selector: 'form-porcentaje',
        templateUrl: '../view/form-porcentaje.component.html',
        providers: [PorcentajeService]

})

export class FormPorcentajeComponent extends ControllerComponent implements AfterViewInit {


        listaPorcentaje:any[];
        porcentajeSelected:number;
        //***********PANELES DE LOS MANTENEDORES***********

        panelEditarSelected: boolean = false;
        panelListaBeanSelected: boolean = true;


        constructor(
                public http: Http,
                public router: Router,
                public porcentajeService:PorcentajeService
              
        ) {
                super(router);

                this.panelEditarSelected = false;
        }

        ngOnInit() {
                this.ObtenerPorcentaje();
        }


        ngAfterViewInit() {
                if (this.verificarTokenRpta(this.rutasMantenedores.FORM_PORCENTAJE)) {    
                     
                }
        }

        ObtenerPorcentaje(){

                this.porcentajeService.getAll().subscribe(
                        data=>{
                                this.porcentajeSelected = data[0].porcentaje;
                                
                        }
                );

        }

        editar(){

                if (this.tienePermisoPrintMsj(this.rutasMantenedores.FORM_PORCENTAJE, this.rutas.BUTTON_ACTUALIZAR)) {
                        
                        let parametros = JSON.stringify({
                                porcentaje: this.porcentajeSelected,
                                
                        });

                        this.print("parametros: " + parametros);
                        this.porcentajeService.editar(parametros)
                                .subscribe(
                                data => {
                                        this.obtenerAlmacenes();
                                        let rpta = data.rpta;
                                        this.print("rpta: " + rpta);
                                        if (rpta != null) {
                                                if (rpta == 1) {
                                                        this.mensajeCorrecto("PORCENTAJE MODIFICADO");
                                                } else {
                                                        this.mensajeInCorrecto("PORCENTAJE NO MOFICADO");
                                                }
                                        }

                                },
                                error => this.msj = <any>error
                                );
                }
                
        }



}