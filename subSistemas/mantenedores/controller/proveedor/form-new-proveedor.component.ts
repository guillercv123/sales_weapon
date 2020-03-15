import { Component, AfterViewInit, ViewChild, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';

import { ControllerComponent } from '../../../../core/controller/controller.component';




/******************IMPORTAR SERVICIOS*************** */


import { ProveedorService } from '../../service/proveedor.service';
import { FormFindPersonaComponent } from '../persona/form-find-persona.component';


declare var $: any;
@Component({
        selector: 'form-new-proveedor',
        templateUrl: '../../view/proveedor/form-new-proveedor.component.html',
        providers: [ProveedorService]

})

export class FormNewProveedorComponent extends ControllerComponent implements AfterViewInit {



        idProveedorSelected: string;
        nombreSelected: string;
        rucSelected: string;
        representanteSelected: any;
        nombreRepresentanteSelected:string;
        idRepresentanteSelected: string;
        telefonoSelected: string;
        direccionSelected: string;
        correoSelected: string;

        tituloPanel:string="Registro Proveedor";

        //************OBJETO ELEGIDO PARA EDITAR************
        //beanSelected: any;

        //***********PANELES DE LOS MANTENEDORES***********
        //panelRegistroSelected: boolean = false;
        //panelBusquedaSelected: boolean = false;
        //panelEditarSelected: boolean = false;
        //panelAccionesGeneralesSelected: boolean = true;
        //panelListaBeanSelected: boolean = true;




        //*************OBJETOS DEL FORMULARIO PERSONA**************
        //activatedSelectedPer: boolean = true;
        //beanSelectedExterno: any;


        @Output() proveedorSeleccionado = new EventEmitter();
        @Input() buttonSelected = false;

        @ViewChild(FormFindPersonaComponent,{static: true}) formFindPersona: FormFindPersonaComponent;
       
        
        constructor(
                public http: Http,
                public router: Router,
                public proveedorService: ProveedorService
        ) {
                super(router);

        }

        ngOnInit() {
                this.limpiarCampos();
                this.formFindPersona.activatedSelected=true;
               
        }

        ngAfterViewInit() {
                if (this.verificarTokenRpta(this.rutasMantenedores.FORM_PROVEEDOR)) {
                        //this.formFindPersona.activatedSelected=true;
                }
        }



        
        setBeanEditar(pro) {

                if (this.tienePermisoPrintMsj(this.rutas.FORM_PROVEEDOR, this.rutas.PANEL_EDITAR)) {

                        //this.beanSelected = pro;
                        //this.tipoProSelected=this.obtenerTipoActual(pro.nombre_tipo_producto);
                        this.idProveedorSelected = pro.id_proveedor;
                        this.nombreSelected = pro.nombre;
                        this.rucSelected = pro.ruc;
                        this.nombreRepresentanteSelected= pro.representante;
                        this.telefonoSelected = pro.telefono;
                        this.correoSelected = pro.correo;
                        this.direccionSelected = pro.direccion;
                        this.idRepresentanteSelected = pro.id_representante;

                }
        }


      
        guardar(){
                if(this.idProveedorSelected==null){
                        this.registrar();
                }else{
                        this.editar();
                }
        }


        registrar() {

                if (this.tienePermisoPrintMsj(this.rutas.FORM_PROVEEDOR, this.rutas.BUTTON_REGISTRAR)) {

                        
                        if(this.nombreSelected!=null || this.rucSelected!=null ){
                                if(this.nombreSelected!="" || this.rucSelected!=""){

                                let parbusqueda = JSON.stringify({
                                        nombre: null,
                                        ruc: this.rucSelected,
                                        direccion: null,
                                        id_representante: null,
                                        telefono: null,
                                        correo: null
                                });
                
                                this.proveedorService.buscarPaginacion(1, 10, 10, parbusqueda)
                                        .subscribe(
                                        data => {
                                                let proveedores = data;
                                                this.print("proveedores: ");
                                                this.print(proveedores);

                                                if(proveedores==null){
                                                        //********REGISTRAR PROVEEDOR SI NO EXISTE******

                                                        let parametros = JSON.stringify({
                                                                nombre: this.nombreSelected,
                                                                ruc: this.rucSelected,
                                                                direccion: this.direccionSelected,
                                                                id_representante: this.idRepresentanteSelected,
                                                                telefono: this.telefonoSelected,
                                                                correo: this.correoSelected
                                                        });
                                                        this.proveedorService.registrar(parametros)
                                                                .subscribe(
                                                                data => {
                                
                                                                        let rpta = data.rpta;
                                                                        this.print("rpta: " + rpta);
                                                                        if (rpta != null) {
                                                                                if (rpta == 1) {
                                                                                        this.mensajeCorrecto("PROVEEDOR REGISTRADO");
                                                                                        this.limpiarCampos();
                                                                                } else {
                                                                                        this.mensajeInCorrecto(" PROVEEDOR NO REGISTRADO");
                                                                                }
                                                                        }
                                
                                
                                                                },
                                                                error => this.msj = <any>error
                                                                );


                                                }else{
                                                        this.mensajeAdvertencia("PROVEEDOR YA ESTA REGISTRADO");
                                                }

                                        },
                                        error => this.msj = <any>error);
                                }else{
                                        this.mensajeAdvertencia("PROVEEDOR ESTA EN BLANCO");
                                }
                        }else{
                                this.mensajeAdvertencia("PROVEEDOR ESTA EN BLANCO");
                        }
 
                }
        }


      
        editar() {

                let parametros = JSON.stringify({
                        nombre: this.nombreSelected,
                        ruc: this.rucSelected,
                        direccion: this.direccionSelected,
                        id_representante: this.idRepresentanteSelected,
                        telefono: this.telefonoSelected,
                        correo: this.correoSelected
                });

                this.print("parametros: " + parametros);
                this.proveedorService.editar(parametros, this.idProveedorSelected)
                        .subscribe(
                        data => {
                                let rpta = data.rpta;
                                this.print("rpta: " + rpta);
                                if (rpta != null) {
                                        if (rpta == 1) {
                                                if (data.rutaImagen != null) {
                                                        //this.beanSelected.ruta_imagen = data.rutaImagen;
                                                }
                                                this.mensajeCorrecto("PROVEEDOR MODIFICADO");
                                        } else {
                                                this.mensajeInCorrecto(" PROVEEDOR NO MOFICADO");
                                        }
                                }

                        },
                        error => this.msj = <any>error
                        );

        }



        limpiarCampos() {
                this.idProveedorSelected = null;
                this.nombreSelected = null;
                this.rucSelected = null;
                this.representanteSelected = null;
                this.telefonoSelected = null;
                this.correoSelected = null;
                this.direccionSelected=null;
                this.idRepresentanteSelected = null;
                this.nombreRepresentanteSelected=null;
                this.tituloPanel="Registro Proveedor";
        }


        limpiar() {
                this.limpiarCampos();
        }



      


        //**********ACCIONES PARAR FORMULARIO PERSONA********
        abrirModalPersona() {
                //this.cerrarPanelRegistrar();
                this.abrirModal("modalPersonaNewPro");
                this.formFindPersona.obtenerPersonas();
                //this.panelListaBeanSelectedPer=true;
        }


        //**********METODO QUE OBTIENE LOS DATOS EXTERNOS 
        obtenerDatosExternos(datos) {
                this.idRepresentanteSelected = datos.bean.id_persona;
                //this.beanSelectedExterno= = datos.bean;
                this.representanteSelected=datos.bean;
                this.nombreRepresentanteSelected = this.representanteSelected.nombres + " " + 
                this.representanteSelected.apellido_paterno + " " + this.representanteSelected.apellido_materno
                //this.listaClientes.splice(0,this.listaClientes.length);
                //this.listaClientes.push(datos.bean)
                //this.listaClientes=datos.bean;
                this.cerrarModal("modalPersonaNewPro");
                this.print("DATOS EXTERNOS: ");
                this.print(datos);
                //this.abrirPanelRegistrar();
        }


}