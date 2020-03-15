import { Component, AfterViewInit, ViewChild, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';

import { ControllerComponent } from '../../../../core/controller/controller.component';




/******************IMPORTAR SERVICIOS*************** */


import { ProveedorService } from '../../service/proveedor.service';
import { FormFindPersonaComponent } from '../persona/form-find-persona.component';
import { ClienteService } from '../../service/cliente.service';


declare var $: any;
@Component({
        selector: 'form-find-proveedor',
        templateUrl: '../../view/proveedor/form-find-proveedor.component.html',
        providers: [ProveedorService,ClienteService]

})

export class FormFindProveedorComponent extends ControllerComponent implements AfterViewInit {

        teclaEnterPresionada:boolean=false;

        listaProveedores: any[];



        idProveedorSelected: string;
        nombreSelected: string;
        rucSelected: string;
        representanteSelected: any;
        nombreRepresentanteSelected:string;
        idRepresentanteSelected: string;
        telefonoSelected: string;
        direccionSelected: string;
        correoSelected: string;
        idClienteSelected: string;
        idPersonaSelected: string;
        
        apellidoPaternoSelected: string;
        apellidoMaternoSelected: string;
        numeroDocumentoSelected: string;
   

        //************OBJETO ELEGIDO PARA EDITAR************
        beanSelected: any;

        //***********PANELES DE LOS MANTENEDORES***********
        //panelRegistroSelected: boolean = false;
        //panelBusquedaSelected: boolean = false;
        //panelEditarSelected: boolean = false;
        //panelAccionesGeneralesSelected: boolean = true;
        //panelListaBeanSelected: boolean = true;




        //*************OBJETOS DEL FORMULARIO PERSONA**************
        activatedSelectedPer: boolean = true;
        beanSelectedExterno: any;


        @Output() proveedorSeleccionado = new EventEmitter();
        @Output() editarProveedorAction = new EventEmitter();
        @Input() buttonSelected = false;

        
        @ViewChild(FormFindPersonaComponent,{static: true}) formFindPersona: FormFindPersonaComponent;
         //VARIBLES PARA EL AUTOCOMPLETADO
         nombresSelected: string;
         lista_autocompletado: any;
         indiceLista: any = -1;
         eleccion_autocompletado_selected: boolean = false;
         tamanio_lista_mostrar: number = 100;
 

        constructor(
                public http: Http,
                public router: Router, 
                public clienteService: ClienteService,
                public proveedorService: ProveedorService
        ) {
                super(router);
}

        ngOnInit() {
                this.limpiarCampos();
                this.formFindPersona.activatedSelected=true;
//                this.obtenerProveedores();
      
        }

        ngAfterViewInit() {
                if (this.verificarTokenRpta(this.rutasMantenedores.FORM_PROVEEDOR)) {
                     
                }
        }

        teclaEnter(event: any) {

                //  tecla flecha arriba     :  38
                //  tecla flecha abajo      :  40
                //  tecla enter             :  13
                //  tecla barra espaciadora : 32
                //  tecla escape            : 27

                if (event.keyCode == 13) {
                        this.teclaEnterPresionada=true;
                        this.buscar();
                }
        }
   

        obtenerProveedores() {
                this.getTotalLista();
                this.limpiarCampos();
              //  this.seleccionarByPagina(this.inicio, this.fin, this.tamPagina);

        }


      

        buscar() {
                if (this.tienePermisoPrintMsj(this.rutas.FORM_PROVEEDOR, this.rutas.BUTTON_BUSCAR)) {
                        this.getTotalLista();
                        this.seleccionarByPagina(this.inicio, this.fin, this.tamPagina);
                }
        }

        eliminar(bean) {

                if (this.tienePermisoPrintMsj(this.rutas.FORM_PROVEEDOR, this.rutas.BUTTON_ELIMINAR)) {
                        if( confirm("Realmente Desea Eliminar ?")){
                        this.proveedorService.eliminarLogico(bean.id_proveedor)
                                .subscribe(
                                data => {
                                        this.obtenerProveedores();
                                        let rpta = data;
                                        if (rpta != null) {
                                                if (rpta == 1) {
                                                        this.mensajeCorrecto("PROVEEDOR ELIMINADO CORRECTAMENTE");
                                                } else {
                                                        this.mensajeInCorrecto("PROVEEDOR NO ELIMINADO");
                                                }

                                        }
                                },
                                error => this.msj = <any>error);
                        }
                }
        }


        limpiarCampos() {
                this.teclaEnterPresionada=false;
                this.idProveedorSelected = null;
                this.nombresSelected = null;
                this.rucSelected = null;
                this.representanteSelected = null;
                this.telefonoSelected = null;
                this.correoSelected = null;
                this.idRepresentanteSelected = null;
                this.nombreRepresentanteSelected=null;
        }


        limpiar() {
                this.limpiarCampos();
                this.inicio = 1;
                this.fin = 10;
                this.tamPagina = 10;
                this.listaProveedores = null;
                this.getTotalLista();
                //this.seleccionarByPagina(this.inicio, this.fin, this.tamPagina);
        }



        elegirFila(lista, i) {
                this.marcar(lista, i);
        }






        //**********ACCIONES PARAR FORMULARIO PERSONA********
        abrirModalPersona() {
                //this.cerrarPanelRegistrar();
                this.abrirModal("modalPersona");
                this.formFindPersona.obtenerPersonas();
                //this.panelListaBeanSelectedPer=true;
        }


        getTotalLista() {

                let parametros = JSON.stringify({
                        id_proveedor: this.idProveedorSelected,
                        nombre: this.nombreSelected,
                        ruc: this.rucSelected,
                        id_representante: this.idRepresentanteSelected,
                        telefono: this.telefonoSelected,
                        correo: this.correoSelected
                });

                this.print("parametros total: " + parametros);
                this.proveedorService.getTotalParametros(parametros)
                        .subscribe(
                        data => {
                                this.totalLista = data;
                                this.print("total:" + data);
                        },
                        error => this.msj = <any>error);
        }


        seleccionarByPagina(inicio: any, fin: any, tamPagina: any) {
                let parametros = JSON.stringify({
                        id_proveedor: this.idProveedorSelected,
                        nombre: this.nombresSelected,
                        ruc: this.rucSelected,
                        id_representante: this.idRepresentanteSelected,
                        telefono: this.telefonoSelected,
                        correo: this.correoSelected
                });
                if(this.nombresSelected != null || this.rucSelected !=null || this.idProveedorSelected !=null){

                        let user = this.obtenerUsuario();
                        this.proveedorService.buscarPaginacion(inicio, fin, tamPagina, parametros)
                                .subscribe(
                                data => {
                                        this.listaProveedores = data;
                                        /*if(this.listaProductos.length>0){
                                                this.fin=this.listaProductos[this.listaProductos.length-1].correlativoDoc;
                                        }*/
                                        this.print(data);
        
                                        if(this.buttonSelected && this.teclaEnterPresionada){
                                                if(this.listaProveedores!=null){
                                                        if(this.listaProveedores.length>0){
                                                                this.seleccionar(this.listaProveedores[0]);
                                                                this.teclaEnterPresionada=false;
                                                        }
                                                }
                                               
                                        }
        
                                        if (this.listaProveedores == null) {
                                                this.mensajeAdvertencia("PROVEEDOR NO ENCONTRADO");
                                        }
                                },
                                error => this.msj = <any>error);
                }else{
                        this.mensajeAdvertencia("RELLENE ALGUN CAMPO PARA BUSCAR");
                }
        }



        abrirPanelEditar(bean) {
                if (this.tienePermisoPrintMsj(this.rutas.FORM_PROVEEDOR, this.rutas.PANEL_EDITAR)) {
                        this.editarProveedorAction.emit({ bean: bean });
                }
        }

        seleccionar(bean) {
                this.proveedorSeleccionado.emit({ bean: bean });
        }

        teclaKeyPressAutocomplete(event: any) {

                if (!this.eleccion_autocompletado_selected && event.keyCode == 13) {
                        this.lista_autocompletado = null;
                        this.eleccion_autocompletado_selected = false;
                        this.indiceLista = -1;
                        this.buscar();
                        return false;
                }

                if (this.eleccion_autocompletado_selected && event.keyCode == 13) {
                        this.elegirLista(this.lista_autocompletado[this.indiceLista]);
                }


                if (event.keyCode == 27) {
                        this.lista_autocompletado = null;
                        this.indiceLista = -1;
                        this.eleccion_autocompletado_selected = false;
                }


        }


        teclaKeyDownAutocomplete(event: any) {
                if (event.keyCode == 38 || event.keyCode == 40 || event.keyCode == 32 || event.keyCode == 13) {

                        //************MANEJO DE TECLAS AUTOCOMPLETADO*********
                        //************FLECHA HACIA ARRIBA************
                        if (event.keyCode == 38) {

                                let lista = [];
                                lista = $('.lista-diego li');

                                //$('.lista-diego li').each(function(indice, elemento) {
                                //this.print('El elemento con el índice '+indice+' contiene '+$(elemento).text());
                                //});
                                if (lista.length >= 0) {

                                        this.indiceLista = this.indiceLista == -1 ? lista.length - 1 : this.indiceLista;
                                        if (this.indiceLista >= 0) {
                                                this.indiceLista--;
                                                this.indiceLista = this.indiceLista == -1 ? lista.length - 1 : this.indiceLista;

                                                $('.lista-diego li').removeClass();
                                                $(lista[this.indiceLista]).addClass("seleccionado");
                                        }

                                }




                                this.print("PRESIONASTE TECLA HACIA ARRIBA UP")
                                this.print("tamaño: " + $('.lista-diego li'));
                                this.print("tam:" + lista.length);
                                this.print("indice:" + this.indiceLista);

                        }

                        //******************FLECHA HACI ABAJO***************** 
                        if (event.keyCode == 40) {

                                let lista = [];
                                lista = $('.lista-diego li');
                                if (lista.length > 0) {
                                        //$(lista[this.indiceLista]).addClass( "seleccionado" );
                                        this.print("condicion: " + this.indiceLista + "tam:" + (lista.length - 1));
                                        if (this.indiceLista <= lista.length - 1) {
                                                this.indiceLista++
                                                $('.lista-diego li').removeClass();
                                                $(lista[this.indiceLista]).addClass("seleccionado");
                                        }

                                        if (this.indiceLista == lista.length) {
                                                this.indiceLista = 0;
                                                $('.lista-diego li').removeClass();
                                                $(lista[this.indiceLista]).addClass("seleccionado");
                                        }


                                }

                                this.print("PRESIONASTE TECLA HACIA ABAJO UP")
                                this.print("tamaño: " + $('.lista-diego li'));
                                this.print("tam:" + lista.length);
                                this.print("indice:" + this.indiceLista);

                        }


                }
        }


        teclaKeyUpAutocomplete(event: any) {

                //  tecla flecha arriba     :  38
                //  tecla flecha abajo      :  40
                //  tecla enter             :  13
                //  tecla barra espaciadora : 32
                //  tecla escape            : 27

                if (event.keyCode != 38 && event.keyCode != 40 && event.keyCode != 13 && event.keyCode != 27) {
                        this.buscarAutocompletado();
                }

                if (event.keyCode == 27) {
                        this.indiceLista = -1;
                        this.lista_autocompletado = null;
                        this.eleccion_autocompletado_selected = false;
                }
        }

        buscarAutocompletado() {
                this.indiceLista = -1;
                if (this.nombresSelected != "") {
                        this.seleccionarByPaginaAutocompletado(1, this.tamanio_lista_mostrar, this.tamanio_lista_mostrar);
                } else {
                        this.lista_autocompletado = null;
                        this.buscar();
                }
        }
        seleccionarByPaginaAutocompletado(inicio: any, fin: any, tamPagina: any) {

                let parametros = JSON.stringify({
                                id_cliente: this.idClienteSelected,
                                id_persona: this.idPersonaSelected,
                                nombre: this.nombresSelected,
                                apellido_paterno: this.apellidoPaternoSelected,
                                apellido_materno: this.apellidoMaternoSelected,
                                numero_documento: this.numeroDocumentoSelected,
                                direccion: this.direccionSelected,
                                telefono: this.telefonoSelected,
                                correo: this.correoSelected,
                             //  observacion: this.observacionSelected
                        });

               
                this.proveedorService.buscarPaginacion(inicio, fin, tamPagina, parametros)
                        .subscribe(
                                data => {
                                        this.lista_autocompletado = data;
                                        this.eleccion_autocompletado_selected = true;
                                        this.print(data);
                                },
                                error => this.msj = <any>error);
        }

        elegirLista(bean: any) {
                if (bean != null) {
                        this.print(bean);
                        this.indiceLista = -1;
                        this.nombresSelected = bean.nombre;
                        this.lista_autocompletado = null;
                        this.eleccion_autocompletado_selected = false;
                        this.buscar();
                }
        }

        //**********METODO QUE OBTIENE LOS DATOS EXTERNOS 
        obtenerDatosExternos(datos) {
                this.idRepresentanteSelected = datos.bean.id_persona;
                this.representanteSelected=datos.bean;
                this.nombreRepresentanteSelected = this.representanteSelected.nombres + " " + 
                this.representanteSelected.apellido_paterno + " " + this.representanteSelected.apellido_materno
                //this.listaClientes.splice(0,this.listaClientes.length);
                //this.listaClientes.push(datos.bean)
                //this.listaClientes=datos.bean;
                this.cerrarModal("modalPersona");
                this.print("DATOS EXTERNOS: ");
                this.print(datos);
                //this.abrirPanelRegistrar();
        }


}