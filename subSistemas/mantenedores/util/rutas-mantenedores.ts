
import { Rutas} from '../../../core/util/rutas';


export class RutasMantenedores extends Rutas{


 /****************NOMBRE DE LOS COMPONENTES Y VISTAS************************/
 public BUTTON_BUSCAR:string="BUTTON_BUSCAR";
 public BUTTON_CAMBIAR_CLAVE:string="BUTTON_CAMBIAR_CLAVE";
 public BUTTON_PANEL_REFERENCIA:string="BUTTON_PANEL_REFERENCIA";
 public BUTTON_AGREGAR_MODIFICAR="BUTTON_AGREGAR_MODIFICAR";
 public BUTTON_QUITAR_ROL="BUTTON_QUITAR_ROL";
 public BUTTON_AGREGAR_ROL="BUTTON_AGREGAR_ROL";
 public PANEL_CAMBIAR_CLAVE="PANEL_CAMBIAR_CLAVE";
 public BUTTON_BUSCAR_ROL="BUTTON_BUSCAR_ROL";


/**************VISTAS**************/
 public FORM_CARNET:string="FORM_CARNET";
 public FORM_MODIFICAR_USUARIO:string="FORM_MODIFICAR_USUARIO";
 public FORM_PORCENTAJE:string ="FORM_PORCENTAJE";
 public FORM_TRASLADO:string = "FORM_TRASLADO";



/***************NOMBRES DE LAS PETICIONES HTTP QUE SE SOLICITAN *************************/
 /**********MIGRACIONES***********/
public API_MIGRACIONES_REST:string=this.APP+"/MIGRACIONES_REST";

public API_TIPO_COMPRA_REST=this.APP+"/tipo_compra";
public API_TIPO_PRODUCTO_REST=this.APP+"/tipo_producto";
public API_TIPO_DOCUMENTO_REST=this.APP+"/tipo_documento";
public API_MEDIO_PAGO_REST=this.APP+"/medio_pago";
public API_CATEGORIA_COMPROBANTE_REST=this.APP+"/categoria_comprobante";
public API_TIPO_COMPROBANTE_REST=this.APP+"/tipo_comprobante";
public API_SERIE_COMPROBANTE_REST=this.APP+"/serie_comprobante";
public API_TIPO_PERSONA_REST=this.APP+"/tipo_persona";
public API_TIPO_MONEDA_REST=this.APP+"/tipo_moneda";
public API_STOCK_REST=this.APP+"/stock";
public API_CORRELATIVO_COMPROBANTE_REST=this.APP+"/correlativo_comprobante";
public API_KARDEX_REST=this.APP+"/kardex";
public API_TRASLADO_REST=this.APP+"/traslado";
public API_LOCAL_REST=this.APP+"/local";
public API_ROL_REST=this.APP+"/rol";
public API_ALMACEN_REST=this.APP+"/almacen";
public API_PRODUCTO_DEFECTUOSO_REST=this.APP+"/producto_defectuoso";
public API_UNIDAD_MEDIDA_REST=this.APP+"/unidad_medida";
public API_APLICACION_REST=this.APP+"/aplicacion";
public API_EMPRESA_REST=this.APP+"/empresa";
public API_EMPLEADO_REST=this.APP+"/empleado";
public API_UNIDAD_EMPRESA_REST=this.APP+"/unidad_empresa";
public API_CARGO_REST=this.APP+"/cargo";
public API_TIPO_CAMBIO_REST=this.APP+"/tipo_cambio";
public API_MARCA_REST=this.APP+"/marca";
public API_PLAZA_REST=this.APP+"/plaza";
public API_ASIGNACION_PLAZA_REST=this.APP+"/asignacion_plaza";
public API_TIPO_CONTRATO_REST=this.APP+"/tipo_contrato";
public API_PRODUCTO_REST=this.APP+"/producto";
public API_CATALOGO_VENTA_REST=this.APP+"/catalogo_venta";
public API_CATALOGO_COMPRA_REST=this.APP+"/catalogo_compra";
public API_PROVEEDOR_REST=this.APP+"/proveedor";
public API_PERSONA_REST=this.APP+"/persona";
public API_CLIENTE_REST=this.APP+"/cliente";
public API_TIPO_MOVIMIENTO_REST=this.APP+"/tipo_movimiento";
public API_CONCEPTO_MOVIMIENTO_REST=this.APP+"/concepto_movimiento";
public API_CONDUCTOR_VEHICULO_REST=this.APP+"/conductor_vehiculo";
public API_GUIA_REMISION_REST=this.APP+"/guia_remision";
public API_LIBRO_CAJA_BANCO = this.APP+'/libro_caja';
public API_PORCENTAJE_REST =this.APP+'/porcentaje';

}