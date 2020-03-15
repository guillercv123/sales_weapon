import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { FormLoginComponent } from './core/controller/form-login.component';
import { FormPanelPrincipalComponent } from './core/controller/form-panel-principal.component';




//**************COMPONENTES DEL SUBSISTEMA C0MPRAS

//**************COMPONENTES DEL SUBSISTEMA VENTAS

//**************COMPONENTES DEL SUBSISTEMA INVENTARIO


//**************RUTAS DEL SUBSISTEMA MANTENEDORES
import { FormUsuarioComponent} from './subSistemas/mantenedores/controller/form-usuario.component';
import { FormProductoComponent} from './subSistemas/mantenedores/controller/form-producto.component';

import { FormPagoComponent} from './subSistemas/ventas/controller/form-pago.component';
import { FormProductoDefectuosoComponent} from './subSistemas/mantenedores/controller/form-producto-defectuoso.component';
import { FormProveedorComponent} from './subSistemas/mantenedores/controller/form-proveedor.component';
import { FormTipoProductoComponent} from './subSistemas/mantenedores/controller/form-tipo-producto.component';
import { FormTipoCompraComponent} from './subSistemas/mantenedores/controller/form-tipo-compra.component';
import { FormMedioPagoComponent} from './subSistemas/mantenedores/controller/form-medio-pago.component';
import { FormPersonaComponent} from './subSistemas/mantenedores/controller/form-persona.component';
import { FormClienteComponent} from './subSistemas/mantenedores/controller/form-cliente.component';
import { FormClientePvComponent} from './subSistemas/mantenedores/controller/form-cliente-pv.component';
import { FormUnidadMedidaComponent} from './subSistemas/mantenedores/controller/form-unidad-medida.component';
import { FormAplicacionComponent} from './subSistemas/mantenedores/controller/form-aplicacion.component';
import { FormTipoMonedaComponent} from './subSistemas/mantenedores/controller/form-tipo-moneda.component';
import { FormTipoCambioComponent} from './subSistemas/mantenedores/controller/form-tipo-cambio.component';
import { FormCatalogoVentaComponent} from './subSistemas/mantenedores/controller/form-catalogo-venta.component';
import { FormCatalogoCompraComponent} from './subSistemas/mantenedores/controller/form-catalogo-compra.component';
import { FormVentaComponent} from './subSistemas/ventas/controller/form-venta.component';

import { FormCajaComponent} from './subSistemas/ventas/controller/form-caja.component';

import { FormCompraComponent} from './subSistemas/compras/controller/form-compra.component';
import { FormAlmacenComponent} from './subSistemas/mantenedores/controller/form-almacen.component';
import { FormLocalComponent} from './subSistemas/mantenedores/controller/form-local.component';
import { FormRolComponent} from './subSistemas/mantenedores/controller/form-rol.component';
import { FormMarcaComponent} from './subSistemas/mantenedores/controller/form-marca.component';
import { FormComprobanteComponent} from './subSistemas/ventas/controller/form-comprobante.component';
import { FormFacturaElectronicaComponent} from './subSistemas/ventas/controller/form-factura-electronica.component';
import { FormFacturaManualElectronicaComponent} from './subSistemas/ventas/controller/form-factura-manual-electronica.component';
import { FormStockComponent} from './subSistemas/mantenedores/controller/form-stock.component';
import { FormKardexComponent} from './subSistemas/mantenedores/controller/form-kardex.component';
import { FormCotizacionComponent} from './subSistemas/ventas/controller/form-cotizacion.component';
import { FormEmpresaComponent} from './subSistemas/mantenedores/controller/form-empresa.component';
import { FormUnidadEmpresaComponent} from './subSistemas/mantenedores/controller/form-unidad-empresa.component';
import { FormCargoComponent} from './subSistemas/mantenedores/controller/form-cargo.component';
import { FormPlazaComponent} from './subSistemas/mantenedores/controller/form-plaza.component';
import { FormAsignacionPlazaComponent} from './subSistemas/mantenedores/controller/form-asignacion-plaza.component';
import { FormTipoContratoComponent} from './subSistemas/mantenedores/controller/form-tipo-contrato.component';
import { FormEmpleadoComponent} from './subSistemas/mantenedores/controller/form-empleado.component';
import { FormSerieComprobanteComponent} from './subSistemas/mantenedores/controller/form-serie-comprobante.component';
import { FormCorrelativoComprobanteComponent} from './subSistemas/mantenedores/controller/form-correlativo-comprobante.component';
import { FormGuiaRemisionComponent} from './subSistemas/mantenedores/controller/form-guia-remision.component';
import { FormGuiaRemisionBuscadorComponent} from './subSistemas/mantenedores/controller/form-guia-remision-buscador.component';
import { FormConductorVehiculoComponent} from './subSistemas/mantenedores/controller/form-conductor-vehiculo.component';


/**********REPORTES***********/
import { FormReporte1Component} from './subSistemas/reportes/controller/form-reporte1.component';
import { FormReporte2Component} from './subSistemas/reportes/controller/form-reporte2.component';
import { FormReporte3Component} from './subSistemas/reportes/controller/form-reporte3.component';
import { FormReporte4Component} from './subSistemas/reportes/controller/form-reporte4.component';
import { FormReporte5Component} from './subSistemas/reportes/controller/form-reporte5.component';



//**************RUTAS DEL SUBSISTEMA CONTABILIDAD
import { FormLibroDiarioComponent} from './subSistemas/contabilidad/controller/form-libro-diario.component';
import { FormLibroCompraComponent} from './subSistemas/contabilidad/controller/form-libro-compra.component';
import { FormLibroVentaComponent} from './subSistemas/contabilidad/controller/form-libro-venta.component';
import { FormConfiguracionCuentaComponent} from './subSistemas/contabilidad/controller/form-configuracion-cuenta.component';
import { FormCuentaCobrarPagarComponent} from './subSistemas/contabilidad/controller/form-cuenta-cobrar-pagar.component';
import { FormLetraComponent} from './subSistemas/contabilidad/controller/form-letra.component';
import { FormPcgeComponent} from './subSistemas/contabilidad/controller/form-pcge.component';





//*************************COMPROBANTE CRUD
import { FormFindComprobanteComponent} from './subSistemas/ventas/controller/comprobante/form-find-comprobante.component';
import { FormNewComprobanteComponent} from './subSistemas/ventas/controller/comprobante/form-new-comprobante.component';
import { FormConsultaComprobanteComponent } from './subSistemas/ventas/controller/form-consulta-comprobante.component';

//*************************GUIA REMISION CRUD
import { FormFindGuiaRemisionComponent} from './subSistemas/mantenedores/controller/guia-remision/form-find-guia-remision.component';
import { FormNewGuiaRemisionComponent} from './subSistemas/mantenedores/controller/guia-remision/form-new-guia-remision.component';


//*************************PERSONA CRUD
import { FormFindPersonaComponent} from './subSistemas/mantenedores/controller/persona/form-find-persona.component';
import { FormNewPersonaComponent} from './subSistemas/mantenedores/controller/persona/form-new-persona.component';

//*************************CLIENTE CRUD
import { FormFindClienteComponent} from './subSistemas/mantenedores/controller/cliente/form-find-cliente.component';


//*************************CONDUCTOR VEHICULO CRUD
import { FormFindConductorVehiculoComponent} from './subSistemas/mantenedores/controller/conductor-vehiculo/form-find-conductor-vehiculo.component';
import { FormNewConductorVehiculoComponent} from './subSistemas/mantenedores/controller/conductor-vehiculo/form-new-conductor-vehiculo.component';

//*************************PROVEEDOR CRUD
import { FormFindProveedorComponent} from './subSistemas/mantenedores/controller/proveedor/form-find-proveedor.component';
import { FormNewProveedorComponent} from './subSistemas/mantenedores/controller/proveedor/form-new-proveedor.component';

//*************************COMPRA CRUD
import { FormFindCompraComponent} from './subSistemas/compras/controller/compra/form-find-compra.component';
import { FormNewCompraComponent} from './subSistemas/compras/controller/compra/form-new-compra.component';

//*************************VENTA CRUD
import { FormFindVentaComponent} from './subSistemas/ventas/controller/venta/form-find-venta.component';
import { FormNewVentaComponent} from './subSistemas/ventas/controller/venta/form-new-venta.component';

import { FormFindCajaComponent} from './subSistemas/ventas/controller/caja/form-find-caja.component';

import {FormPorcentajeComponent} from './subSistemas/mantenedores/controller/form-porcentaje.component';
import {FormLibroCajaBancoComponent} from './subSistemas/contabilidad/controller/form-libro-caja-banco.component';
import {FormLibroMayorComponent} from './subSistemas/contabilidad/controller/form-libro-mayor.component';
import {FormReporteVentasComponent} from './subSistemas/ventas/controller/form-reporte-ventas.component';

import {FormTrasladoComponent} from './subSistemas/mantenedores/controller/form-traslado.component';

@NgModule({
  declarations: [
    AppComponent,
    
    FormFindComprobanteComponent,
    FormNewComprobanteComponent,
    
    FormFindGuiaRemisionComponent,
    FormNewGuiaRemisionComponent,

    FormFindPersonaComponent,
    FormNewPersonaComponent,

    FormFindClienteComponent,
    FormPorcentajeComponent,
    FormFindConductorVehiculoComponent,
    FormNewConductorVehiculoComponent,

    FormFindProveedorComponent,
    FormNewProveedorComponent,

    FormFindCompraComponent,
    FormNewCompraComponent,

    FormFindVentaComponent,
    FormNewVentaComponent,

    FormFindCajaComponent,
    FormCajaComponent,

    FormLoginComponent,
    FormPanelPrincipalComponent,

    //**************COMPONENTES DEL SUBSISTEMA C0MPRAS

    //**************COMPONENTES DEL SUBSISTEMA VENTAS

    //**************COMPONENTES DEL SUBSISTEMA INVENTARIO

    //**************COMPONENTES DEL SUBSISTEMA CONTABILIDAD
    FormLibroDiarioComponent,
    FormLibroVentaComponent,
    FormLibroCompraComponent,
    FormConfiguracionCuentaComponent,
    FormCuentaCobrarPagarComponent,
    FormLetraComponent,
    FormPcgeComponent,
    FormLibroCajaBancoComponent,
    FormLibroMayorComponent,
    
    //**************RUTAS DEL SUBSISTEMA MANTENEDORES
    FormTipoCambioComponent,
    FormUsuarioComponent,
    FormProductoComponent,
    FormProductoDefectuosoComponent,
    FormProveedorComponent,
    FormTipoProductoComponent,
    FormTipoCompraComponent,
    FormMedioPagoComponent,
    FormPersonaComponent,
    FormClienteComponent,
    FormClientePvComponent,
    FormUnidadMedidaComponent,
    FormAplicacionComponent,
    FormTipoMonedaComponent,
    FormCatalogoVentaComponent,
    FormCatalogoCompraComponent,
    FormLocalComponent,
    FormRolComponent,
    FormMarcaComponent,
    FormAlmacenComponent,
    FormVentaComponent,
    FormCompraComponent,
    FormComprobanteComponent,
    FormFacturaElectronicaComponent,
    FormFacturaManualElectronicaComponent,
    FormStockComponent,
    FormKardexComponent,
    FormCotizacionComponent,
    FormEmpresaComponent,
    FormUnidadEmpresaComponent,
    FormCargoComponent,
    FormPlazaComponent,
    FormAsignacionPlazaComponent,
    FormTipoContratoComponent,
    FormEmpleadoComponent,
    FormSerieComprobanteComponent,
    FormCorrelativoComprobanteComponent,
    FormGuiaRemisionComponent,
    FormGuiaRemisionBuscadorComponent,
    FormConductorVehiculoComponent,
    FormPagoComponent,
    FormConsultaComprobanteComponent,
    /*****REPORTES****/
    FormReporte1Component,
    FormReporte2Component,
    FormReporte3Component,
    FormReporte4Component,
    FormReporte5Component,
    FormReporteVentasComponent,
    FormTrasladoComponent

  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
