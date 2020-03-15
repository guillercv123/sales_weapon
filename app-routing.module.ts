import { ModuleWithProviders} from '@angular/core';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormLoginComponent } from './core/controller/form-login.component';
import { FormPanelPrincipalComponent } from './core/controller/form-panel-principal.component';



//**************COMPONENTES DEL SUBSISTEMA C0MPRAS

//**************COMPONENTES DEL SUBSISTEMA VENTAS

//**************COMPONENTES DEL SUBSISTEMA INVENTARIO


//**************RUTAS DEL SUBSISTEMA MANTENEDORES
import { FormUsuarioComponent} from './subSistemas/mantenedores/controller/form-usuario.component';
import { FormProductoComponent} from './subSistemas/mantenedores/controller/form-producto.component';

import { FormProductoDefectuosoComponent} from './subSistemas/mantenedores/controller/form-producto-defectuoso.component';
import { FormProveedorComponent} from './subSistemas/mantenedores/controller/form-proveedor.component';
import { FormTipoProductoComponent} from './subSistemas/mantenedores/controller/form-tipo-producto.component';
import { FormTipoCompraComponent} from './subSistemas/mantenedores/controller/form-tipo-compra.component';
import { FormMedioPagoComponent} from './subSistemas/mantenedores/controller/form-medio-pago.component';
import { FormPersonaComponent} from './subSistemas/mantenedores/controller/form-persona.component';
import { FormClienteComponent} from './subSistemas/mantenedores/controller/form-cliente.component';
import { FormUnidadMedidaComponent} from './subSistemas/mantenedores/controller/form-unidad-medida.component';
import { FormAplicacionComponent} from './subSistemas/mantenedores/controller/form-aplicacion.component';
import { FormTipoMonedaComponent} from './subSistemas/mantenedores/controller/form-tipo-moneda.component';
import { FormCatalogoVentaComponent} from './subSistemas/mantenedores/controller/form-catalogo-venta.component';
import { FormCatalogoCompraComponent} from './subSistemas/mantenedores/controller/form-catalogo-compra.component';
import { FormAlmacenComponent} from './subSistemas/mantenedores/controller/form-almacen.component';
import { FormLocalComponent} from './subSistemas/mantenedores/controller/form-local.component';
import { FormRolComponent} from './subSistemas/mantenedores/controller/form-rol.component';
import { FormVentaComponent} from './subSistemas/ventas/controller/form-venta.component';

import { FormCajaComponent} from './subSistemas/ventas/controller/form-caja.component';

import { FormCompraComponent} from './subSistemas/compras/controller/form-compra.component';
import { FormStockComponent} from './subSistemas/mantenedores/controller/form-stock.component';
import { FormKardexComponent} from './subSistemas/mantenedores/controller/form-kardex.component';
import { FormComprobanteComponent} from './subSistemas/ventas/controller/form-comprobante.component';
import { FormFacturaElectronicaComponent} from './subSistemas/ventas/controller/form-factura-electronica.component';
import { FormFacturaManualElectronicaComponent} from './subSistemas/ventas/controller/form-factura-manual-electronica.component';
import { FormPagoComponent} from './subSistemas/ventas/controller/form-pago.component';
import { FormCotizacionComponent} from './subSistemas/ventas/controller/form-cotizacion.component';
import { FormEmpresaComponent} from './subSistemas/mantenedores/controller/form-empresa.component';
import { FormUnidadEmpresaComponent} from './subSistemas/mantenedores/controller/form-unidad-empresa.component';
import { FormCargoComponent} from './subSistemas/mantenedores/controller/form-cargo.component';
import { FormTipoCambioComponent} from './subSistemas/mantenedores/controller/form-tipo-cambio.component';
import { FormPlazaComponent} from './subSistemas/mantenedores/controller/form-plaza.component';
import { FormAsignacionPlazaComponent} from './subSistemas/mantenedores/controller/form-asignacion-plaza.component';
import { FormTipoContratoComponent} from './subSistemas/mantenedores/controller/form-tipo-contrato.component';
import { FormEmpleadoComponent} from './subSistemas/mantenedores/controller/form-empleado.component';
import { FormSerieComprobanteComponent} from './subSistemas/mantenedores/controller/form-serie-comprobante.component';
import { FormCorrelativoComprobanteComponent} from './subSistemas/mantenedores/controller/form-correlativo-comprobante.component';
import { FormMarcaComponent} from './subSistemas/mantenedores/controller/form-marca.component';
import { FormGuiaRemisionComponent} from './subSistemas/mantenedores/controller/form-guia-remision.component';
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


import {FormPorcentajeComponent} from './subSistemas/mantenedores/controller/form-porcentaje.component';
import {FormTrasladoComponent} from './subSistemas/mantenedores/controller/form-traslado.component';


import { FormConsultaComprobanteComponent } from './subSistemas/ventas/controller/form-consulta-comprobante.component';
import {FormReporteVentasComponent} from './subSistemas/ventas/controller/form-reporte-ventas.component';



const routes: Routes = [
  {
    path: '',
    component: FormLoginComponent,   
  },

  {
    path: 'home', 
    component: FormPanelPrincipalComponent,
  },


  {
    path: 'consultar/comprobante/:serie/:numero', 
    component: FormConsultaComprobanteComponent,
  },

  {  
    path: 'mainMantenedores',
    component: FormPanelPrincipalComponent, 
 
     children: [
        { path: 'usuario',      component: FormUsuarioComponent , outlet: 'menu'},
        { path: 'producto',     component: FormProductoComponent , outlet: 'menu'},
        { path: 'producto-defectuoso',     component: FormProductoDefectuosoComponent , outlet: 'menu'},
        { path: 'proveedor',      component: FormProveedorComponent , outlet: 'menu'},
        { path: 'tipo-producto', component: FormTipoProductoComponent , outlet: 'menu'},
        { path: 'persona', component: FormPersonaComponent , outlet: 'menu'},
        { path: 'cliente', component: FormClienteComponent , outlet: 'menu'},
        { path: 'unidad-medida', component: FormUnidadMedidaComponent , outlet: 'menu'},
        { path: 'aplicacion', component: FormAplicacionComponent , outlet: 'menu'},
        { path: 'tipo-compra', component: FormTipoCompraComponent , outlet: 'menu'},
        { path: 'medio-pago', component: FormMedioPagoComponent , outlet: 'menu'},
        { path: 'tipo-moneda', component: FormTipoMonedaComponent , outlet: 'menu'},
        { path: 'catalogo-venta', component: FormCatalogoVentaComponent , outlet: 'menu'},
        { path: 'catalogo-compra', component: FormCatalogoCompraComponent , outlet: 'menu'},
        { path: 'local', component: FormLocalComponent , outlet: 'menu'},
        { path: 'rol', component: FormRolComponent , outlet: 'menu'},
        { path: 'marca', component: FormMarcaComponent , outlet: 'menu'},
        { path: 'almacen', component: FormAlmacenComponent , outlet: 'menu'},
        { path: 'venta', component: FormVentaComponent , outlet: 'menu'},
        { path: 'caja', component: FormCajaComponent , outlet: 'menu'},
        { path: 'pago', component: FormPagoComponent, outlet: 'menu'},
        { path: 'compra', component: FormCompraComponent , outlet: 'menu'},
        { path: 'stock', component: FormStockComponent , outlet: 'menu'},
        { path: 'kardex', component: FormKardexComponent , outlet: 'menu'},
        { path: 'guia-remision', component: FormGuiaRemisionComponent , outlet: 'menu'},
        { path: 'conductor-vehiculo', component: FormConductorVehiculoComponent , outlet: 'menu'},
        { path: 'comprobante', component: FormComprobanteComponent , outlet: 'menu'},
        { path: 'factura-electronica', component: FormFacturaElectronicaComponent , outlet: 'menu'},
        { path: 'factura-manual-electronica', component: FormFacturaManualElectronicaComponent , outlet: 'menu'},
        { path: 'cotizacion', component: FormCotizacionComponent , outlet: 'menu'},
        { path: 'reporte1', component: FormReporte1Component , outlet: 'menu'},
        { path: 'reporte2', component: FormReporte2Component , outlet: 'menu'},
        { path: 'reporte3', component: FormReporte3Component , outlet: 'menu'},
        { path: 'reporte4', component: FormReporte4Component , outlet: 'menu'},
        { path: 'reporte5', component: FormReporte5Component , outlet: 'menu'},
        { path:'porcentaje',component:FormPorcentajeComponent, outlet:'menu'},
        { path: 'empresa', component: FormEmpresaComponent , outlet: 'menu'},
        { path: 'unidad-empresa', component: FormUnidadEmpresaComponent , outlet: 'menu'},
        { path: 'cargo', component: FormCargoComponent , outlet: 'menu'},
        { path: 'plaza', component: FormPlazaComponent , outlet: 'menu'},
        { path: 'asignacion-plaza', component: FormAsignacionPlazaComponent , outlet: 'menu'},
        { path: 'tipo-contrato', component: FormTipoContratoComponent , outlet: 'menu'},
        { path: 'empleado', component: FormEmpleadoComponent , outlet: 'menu'},
        { path: 'serie-comprobante', component: FormSerieComprobanteComponent , outlet: 'menu'},
        { path: 'correlativo-comprobante', component: FormCorrelativoComprobanteComponent , outlet: 'menu'},
        { path: 'tipo-cambio', component: FormTipoCambioComponent , outlet: 'menu'},
        { path:'reporte-ventas',component: FormReporteVentasComponent,outlet:'menu'},
        /*******RUTAS CONTABLES******/
        { path: 'libro-diario', component: FormLibroDiarioComponent, outlet: 'menu'},
        { path: 'libro-compra', component: FormLibroCompraComponent, outlet: 'menu'},
        { path: 'libro-venta', component: FormLibroVentaComponent, outlet: 'menu'},
        { path: 'configuracion-cuenta', component: FormConfiguracionCuentaComponent, outlet: 'menu'},
        { path: 'cuenta-cobrar-pagar', component: FormCuentaCobrarPagarComponent, outlet: 'menu'},
        { path: 'letras', component: FormLetraComponent, outlet: 'menu'},
        { path: 'pcge', component: FormPcgeComponent, outlet: 'menu'},
        { path:'traslado', component:FormTrasladoComponent, outlet:'menu'}

     
      ]   
  }

];


@NgModule({
  imports: [RouterModule.forRoot(routes,{ useHash: true })],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }

//export const AppRoutingModule: ModuleWithProviders = RouterModule.forRoot(routes,{ useHash: true });