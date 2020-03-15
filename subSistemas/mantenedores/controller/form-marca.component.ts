import { Component, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';

import { ControllerComponent } from '../../../core/controller/controller.component';




/******************IMPORTAR SERVICIOS*************** */


import { MarcaService } from '../service/marca.service';


import { Vista } from '../model/Vista';

declare var $: any;
@Component({
        selector: 'form-marca',
        templateUrl: '../view/form-marca.component.html',
        providers: [MarcaService]

})

export class FormMarcaComponent extends ControllerComponent implements AfterViewInit {


        listaMarcas: any[];


        idMarcaSelected: number;
        nombreSelected: string;
        observacionSelected: string;
        ordenPresentacionSelected: string;


        //************OBJETO ELEGIDO PARA EDITAR************
        beanSelected: any;

        //***********PANELES DE LOS MANTENEDORES***********

        panelEditarSelected: boolean = false;
        panelListaBeanSelected: boolean = true;


        constructor(
                public http: Http,
                public router: Router,
                public marcaService: MarcaService
        ) {
                super(router);

                this.panelEditarSelected = false;
        }

        ngOnInit() {
                this.limpiarCampos();
        }


        ngAfterViewInit() {
                if (this.verificarTokenRpta(this.rutasMantenedores.FORM_MARCA)) {
                        this.obtenerMarcas();
                }
        }



        abrirPanelBuscar() {
                this.panelEditarSelected = false;
                this.panelListaBeanSelected = true;

        }

        abrirPanelRegistrar() {
                this.panelEditarSelected = false;
                this.panelListaBeanSelected = true;
        }

        abrirPanelEditar(pro) {
                if (this.tienePermisoPrintMsj(this.rutas.FORM_MARCA, this.rutas.PANEL_EDITAR)) {
                        this.beanSelected = pro;

                        this.idMarcaSelected = pro.id_marca;
                        this.nombreSelected = pro.nombre;
                        this.observacionSelected = pro.observacion;
                        this.ordenPresentacionSelected = pro.orden_presentacion;

                        this.panelEditarSelected = true;
                        this.panelListaBeanSelected = false;
                }
        }


        regresar() {
                this.limpiarCampos();
                this.panelEditarSelected = false;
                this.panelListaBeanSelected = true;
        }


        obtenerMarcas() {
                this.limpiarCampos();
                this.getTotalLista();
                this.seleccionarByPagina(this.inicio, this.fin, this.tamPagina);
        }





        limpiar() {
                this.limpiarCampos();
                this.inicio = 1;
                this.fin = 10;
                this.tamPagina = 10;
                this.getTotalLista();
                this.seleccionarByPagina(this.inicio, this.fin, this.tamPagina);
        }


        seleccionarByPagina(inicio: any, fin: any, tamPagina: any) {
                let parametros = JSON.stringify({
                        id_marca: this.idMarcaSelected,
                        nombre: this.nombreSelected,
                        observacion: this.observacionSelected,
                        orden_presentacion: this.ordenPresentacionSelected
                });

                this.marcaService.buscarPaginacion(inicio, fin, tamPagina, parametros)
                        .subscribe(
                        data => {
                                this.listaMarcas = data;

                                this.print(data);
                        },
                        error => this.msj = <any>error);
        }


        registrar() {
                if (this.tienePermisoPrintMsj(this.rutas.FORM_MARCA, this.rutas.BUTTON_REGISTRAR)) {

                        if(this.nombreSelected!=null){
                                if(this.nombreSelected!=""){
                                        let parbusqueda = JSON.stringify({
                                                id_marca: this.idMarcaSelected,
                                                nombre: this.nombreSelected,
                                                observacion: this.observacionSelected,
                                                orden_presentacion: this.ordenPresentacionSelected
                                        });
                        
                                        this.marcaService.buscarPaginacion(1, 10, 10, parbusqueda)
                                                .subscribe(
                                                data => {
                                                        let marcas = data;
                                                        this.print("marcas: ");
                                                        this.print(marcas);

                                                        if(marcas==null){
                                                                /********REGISTRAR MARCA SI NO EXISTE******/
                                                                let parametros = JSON.stringify({
                                                                        nombre: this.nombreSelected,
                                                                        observacion: this.observacionSelected,
                                                                        orden_presentacion: this.ordenPresentacionSelected
                                                                });
                                                                this.marcaService.registrar(parametros)
                                                                .subscribe(
                                                                        data => {
                                                                                let rpta = data.rpta;
                                                                                this.print("rpta: " + rpta);
                                                                                        if (rpta != null) {
                                                                                                if (rpta == 1) {
                                                                                                        this.mensajeCorrecto("MARCA REGISTRADA");
                                                                                                        this.limpiarCampos();
                                                                                                } else {
                                                                                                        this.mensajeInCorrecto("MARCA NO REGISTRADA");
                                                                                                }
                                                                                        }
                                                
                                                                                        this.obtenerMarcas();
                                                
                                                                                },
                                                                                error => this.msj = <any>error
                                                                );
                                                        }else{
                                                                this.mensajeAdvertencia("MARCA YA ESTA REGISTRADA");
                                                        }

                                                },
                                                error => this.msj = <any>error);

                                }else{
                                        this.mensajeAdvertencia("NOMBRE ESTA EN BLANCO");
                                }
                        }else{
                                 this.mensajeAdvertencia("NOMBRE ESTA EN BLANCO");
                        }


                }
        }

        buscar() {
                if (this.tienePermisoPrintMsj(this.rutas.FORM_MARCA, this.rutas.BUTTON_BUSCAR)) {
                        this.getTotalLista();
                        this.seleccionarByPagina(this.inicio, this.fin, this.tamPagina);
                }
        }



        getTotalLista() {
                /*this.productoService.getTotal()
                        .subscribe(
                        data => {
                                this.totalLista = data;
                                this.print(data);
                        },
                        error => this.msj = <any>error);*/
                let parametros = JSON.stringify({
                        id_marca: this.idMarcaSelected,
                        nombre: this.nombreSelected,
                        observacion: this.observacionSelected,
                        orden_presentacion: this.ordenPresentacionSelected
                });

                this.print("parametros total: " + parametros);
                this.marcaService.getTotalParametros(parametros)
                        .subscribe(
                        data => {
                                this.totalLista = data;
                                this.print("total:" + data);
                        },
                        error => this.msj = <any>error);
        }


        eliminar(bean) {

                if (this.tienePermisoPrintMsj(this.rutas.FORM_MARCA, this.rutas.BUTTON_ELIMINAR)) {
                        if( confirm("Realmente Desea Eliminar ?")){
                        this.marcaService.eliminarLogico(bean.id_marca)
                                .subscribe(
                                data => {
                                        this.obtenerMarcas();
                                        let rpta = data;
                                        if (rpta != null) {
                                                if (rpta == 1) {
                                                        this.mensajeCorrecto("MARCA ELIMINADA CORRECTAMENTE");
                                                } else {
                                                        this.mensajeInCorrecto("MARCA NO ELIMINADA");
                                                }

                                        }
                                },
                                error => this.msj = <any>error);
                        }
                }
        }




        editar() {

                if (this.tienePermisoPrintMsj(this.rutas.FORM_MARCA, this.rutas.BUTTON_ACTUALIZAR)) {
                        let parametros = JSON.stringify({
                                nombre: this.nombreSelected,
                                observacion: this.observacionSelected,
                                orden_presentacion: this.ordenPresentacionSelected
                        });

                        this.print("parametros: " + parametros);
                        this.marcaService.editar(parametros, this.beanSelected.id_marca)
                                .subscribe(
                                data => {
                                        this.obtenerMarcas();
                                        let rpta = data.rpta;
                                        this.print("rpta: " + rpta);
                                        if (rpta != null) {
                                                if (rpta == 1) {
                                                        this.mensajeCorrecto("MARCA MODIFICADA");
                                                } else {
                                                        this.mensajeInCorrecto("MARCA NO MODIFICADA");
                                                }
                                        }

                                },
                                error => this.msj = <any>error
                                );
                }
        }



        limpiarCampos() {
                this.idMarcaSelected = null;
                this.nombreSelected = null;
                this.observacionSelected = null;
                this.ordenPresentacionSelected = null;
        }

        elegirFila(lista, i) {
                this.marcar(lista, i);
        }



        activarBuscarDoc(event) {

                //this.success=false;
                //this.successModal=false;
                //if(!this.tienePermiso(this.rutas.FORM_NUEVO_MENSAJE,this.rutas.BUTTON_BUSCAR_PERSONA)) {
                //               this.mensajeInCorrecto("USTED NO TIENE PERMISO PARA ESTA ACCION");
                //event.stopPropagation();
                //       }
        }

        cerrarModal() {
                //this.panelReferenciaSelected = false;
                //this.print("cerro el modal abierto");
        }
}