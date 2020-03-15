import { Component, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';

import { ControllerComponent } from '../../../core/controller/controller.component';




/******************IMPORTAR SERVICIOS*************** */


import { TipoProductoService } from '../service/tipo-producto.service';
import {AplicacionService} from '../service/aplicacion.service';

import { Vista } from '../model/Vista';

declare var $: any;
@Component({
        selector: 'form-tipo-producto',
        templateUrl: '../view/form-tipo-producto.component.html',
        providers: [TipoProductoService,AplicacionService]

})

export class FormTipoProductoComponent extends ControllerComponent implements AfterViewInit {


        //tipos_producto: any[];
        listaTiposProducto: any[];



        idTipoProductoSelected: string;
        nombreSelected: string;
        apliSelected:any;
  

        //************OBJETO ELEGIDO PARA EDITAR************
        beanSelected: any;
        listaGrupo:any[];

        //***********PANELES DE LOS MANTENEDORES***********

        panelEditarSelected: boolean = false;
        panelListaBeanSelected: boolean = false;


        constructor(
                public http: Http,
                public router: Router,
                public tipoProductoService: TipoProductoService,
                public aplicacionService :AplicacionService
        ) {
                super(router);

                this.panelEditarSelected = false;
        }

        ngOnInit() {
                this.limpiarCampos();
        }


        ngAfterViewInit() {
                if (this.verificarTokenRpta(this.rutasMantenedores.FORM_TIPO_PRODUCTO)) {
                        this.obtenerTiposProducto();
                        this.ObtenerGrupo();
                }
        }

        ObtenerGrupo(){

                this.aplicacionService.getAll().subscribe(data=>{
                        //this.listaGrupo = apliSelected.id_aplicacion
                        return this.listaGrupo = data; 
                });

        }

       

        abrirPanelBuscar() {
                this.panelEditarSelected = false;
                this.panelListaBeanSelected = true;

        }

        abrirPanelRegistrar() {
                this.panelEditarSelected = false;
                this.panelListaBeanSelected = false;
        }

        abrirPanelEditar(pro) {

                if (this.tienePermisoPrintMsj(this.rutas.FORM_TIPO_PRODUCTO, this.rutas.PANEL_EDITAR)) {
                        this.beanSelected = pro;
                        this.print(pro);
                        this.idTipoProductoSelected = pro.id_tipo_producto;
                        this.nombreSelected = pro.nombre;
                        this.apliSelected= this.obtenergrupoActual(pro.grupo);
                        this.panelEditarSelected = true;
                        this.panelListaBeanSelected = false;
                }
        }

        obtenergrupoActual(nombreTipo: string) {
                let obj = null;
                let i;
                for (i = 0; i < this.listaGrupo.length; i++) {
                        if (this.listaGrupo[i].nombre == nombreTipo) {
                                obj = this.listaGrupo[i];
                                break;
                        }
                }
                return obj;
        }


        regresar() {
                this.limpiarCampos();
                this.panelEditarSelected = false;
                this.panelListaBeanSelected = true;
        }


        obtenerTiposProducto() {
                this.getTotalLista();
                this.limpiarCampos();
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
                        id_tipo_producto: this.idTipoProductoSelected,
                        nombre: this.nombreSelected,
                        
                });

                this.tipoProductoService.buscarPaginacion(inicio, fin, tamPagina, parametros)
                        .subscribe(
                        data => {
                                this.listaTiposProducto = data;

                                this.print(data);
                        },
                        error => this.msj = <any>error);
        }


        registrar() {

                if (this.tienePermisoPrintMsj(this.rutas.FORM_TIPO_PRODUCTO, this.rutas.BUTTON_REGISTRAR)) {

                        if(this.nombreSelected!=null){
                                if(this.nombreSelected!=""){

                                let parbusqueda = JSON.stringify({
                                        id_tipo_producto: this.idTipoProductoSelected,
                                        nombre: this.nombreSelected,
                                        id_aplicacion:this.apliSelected == null ? null : this.apliSelected.id_aplicacion
                                });
                
                                this.tipoProductoService.buscarPaginacion(1, 10, 10, parbusqueda)
                                        .subscribe(
                                        data => {
                                                let marcas = data;
                                                this.print("marcas: ");
                                                this.print(marcas);

                                                if(marcas==null){
                                                        /********REGISTRAR TIPO PRODUCTO SI NO EXISTE******/
                                                        let parametros = JSON.stringify({
                                                                nombre: this.nombreSelected,
                                                                id_aplicacion:this.apliSelected == null ? null : this.apliSelected.id_aplicacion
                                      
                                                        });
                                                        this.tipoProductoService.registrar(parametros)
                                                                .subscribe(
                                                                data => {
                                
                                                                        let rpta = data.rpta;
                                                                        this.print("rpta: " + rpta);
                                                                        if (rpta != null) {
                                                                                if (rpta == 1) {
                                                                                        this.mensajeCorrecto("TIPO PRODUCTO REGISTRADO");
                                                                                        this.limpiarCampos();
                                                                                } else {
                                                                                        this.mensajeInCorrecto(" TIPO PRODUCTO NO REGISTRADO");
                                                                                }
                                                                        }
                                
                                                                        this.obtenerTiposProducto();
                                
                                                                },
                                                                error => this.msj = <any>error
                                                                );
                                                }else{
                                                        this.mensajeAdvertencia("TIPO PRODUCTO YA ESTA REGISTRADO");
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
                if (this.tienePermisoPrintMsj(this.rutas.FORM_TIPO_PRODUCTO, this.rutas.BUTTON_BUSCAR)) {
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
                        id_tipo_producto: this.idTipoProductoSelected,
                        nombre: this.nombreSelected,
                     
                });

                this.print("parametros total: " + parametros);
                this.tipoProductoService.getTotalParametros(parametros)
                        .subscribe(
                        data => {
                                this.totalLista = data;
                                this.print("total:" + data);
                        },
                        error => this.msj = <any>error);
        }


        eliminar(bean) {

                if (this.tienePermisoPrintMsj(this.rutas.FORM_TIPO_PRODUCTO, this.rutas.BUTTON_ELIMINAR)) {
                        if( confirm("Realmente Desea Eliminar ?")){
                        this.tipoProductoService.eliminarLogico(bean.id_tipo_producto)
                                .subscribe(
                                data => {
                                        this.obtenerTiposProducto();
                                        let rpta = data;
                                        if (rpta != null) {
                                                if (rpta == 1) {
                                                        this.mensajeCorrecto("TIPO PRODUCTO ELIMINADO CORRECTAMENTE");
                                                } else {
                                                        this.mensajeInCorrecto("TIPO PRODUCTO NO ELIMINADO");
                                                }

                                        }
                                },
                                error => this.msj = <any>error);
                        }
                }
        }




        editar() {

                if (this.tienePermisoPrintMsj(this.rutas.FORM_TIPO_PRODUCTO, this.rutas.BUTTON_ACTUALIZAR)) {
                        let parametros = JSON.stringify({
                                nombre: this.nombreSelected,
                                id_aplicacion:this.apliSelected == null ? null : this.apliSelected.id_aplicacion
                        });

                        this.print("parametros: " + parametros);
                        this.tipoProductoService.editar(parametros, this.beanSelected.id_tipo_producto)
                                .subscribe(
                                data => {
                                        this.obtenerTiposProducto();
                                        let rpta = data.rpta;
                                        this.print("rpta: " + rpta);
                                        if (rpta != null) {
                                                if (rpta == 1) {
                                                        this.mensajeCorrecto("TIPO PRODUCTO MODIFICADO");
                                                } else {
                                                        this.mensajeInCorrecto("TIPO PRODUCTO NO MOFICADO");
                                                }
                                        }

                                },
                                error => this.msj = <any>error
                                );
                }
        }



        limpiarCampos() {
                this.nombreSelected = null;
                this.idTipoProductoSelected = null;
                this.apliSelected = null;
        }

        elegirFila(lista, i) {
                this.marcar(lista, i);
        }



}