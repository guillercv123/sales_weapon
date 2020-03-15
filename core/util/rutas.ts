declare var $:any;
var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9+/=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/rn/g,"n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r,c1,c2,c3;r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}};

export class Rutas {


/***************NOMBRES DE LAS PETICIONES HTTP QUE SE SOLICITAN *************************/  
 public SEPARADOR:string="/";
 public API:string="api"; 

 public SERVIDOR:string=Base64.decode($("#SERVIDOR").val());
 public NAME_APP:string=Base64.decode($("#NAME_APP").val());
 public DEBUG:string=Base64.decode($("#DEBUG").val());
 public NOMBRE_SISTEMA:string=Base64.decode($("#NOMBRE_SISTEMA").val());
 public IMPRESION_MODAL:string=Base64.decode($("#IMPRESION_MODAL").val());
 
 public SERVIDOR_FACTURACION:string=null;
 public SERVIDOR_FACTURACION_CARPETAS:string=null;

 public APP:string=this.SERVIDOR+this.SEPARADOR+this.NAME_APP+this.SEPARADOR+this.API;


 public API_LOGIN_REST:string=this.APP+"/LOGIN_REST"; 
 public API_VISTA_REST:string=this.APP+"/vista";
 public API_USUARIO_REST=this.APP+"/usuario";
 public API_CONFIGURACION_FACTURACION_REST=this.APP+"/configuracion_facturacion";
 
 public API_PERMISO_REST:string= this.APP+"/"+this.API+"/PERMISO_REST";
 public API_REPORTE_EXCEL_REST:string=this.API+"/REPORTE_EXCEL_REST"; 
 public API_REPORTE_REST=this.APP+"/reporte";

 public API_SENDEMAIL_REST = this.APP + "/send_email";

 /*

 public API_PERFIL_REST:string= this.APP+"/"+this.API+"/PERFIL_REST";
 public API_SENSORES_REST:string= this.APP+"/"+this.API+"/SENSORES_REST";
 public API_REPORTE_EXCEL_REST:string=this.API+"/REPORTE_EXCEL_REST"; 
 public API_REPORTE_REST=this.APP+"/reporte";

 */
// public PANEL_SUNARP:string="PANEL_SUNARP";
// public PANEL_RENIEC:string="PANEL_RENIEC";
// public  PANEL_MIGRACIONES:string="PANEL_MIGRACIONES";




/***************FORMULARIOS*********************/

public FORM_LOGIN="FORM_LOGIN";
public FORM_PRINCIPAL="FORM_PRINCIPAL";	
public FORM_PRODUCTO="FORM_PRODUCTO";	
//public FORM_COMPRAS="FORM_COMPRAS";	
//public FORM_VENTAS="FORM_VENTAS";	
//public FORM_INVENTARIO="FORM_INVENTARIO";	
public FORM_MODIFICAR_USUARIO="FORM_MODIFICAR_USUARIO";	
public FORM_PROVEEDOR="FORM_PROVEEDOR";	
public FORM_TIPO_PRODUCTO="FORM_TIPO_PRODUCTO";	
public FORM_TIPO_COMPRA="FORM_TIPO_COMPRA";
public FORM_MEDIO_PAGO="FORM_MEDIO_PAGO";	
public FORM_PERSONA="FORM_PERSONA";
public FORM_CLIENTE="FORM_CLIENTE";	
public FORM_TIPO_MONEDA="FORM_TIPO_MONEDA";	
public FORM_UNIDAD_MEDIDA="FORM_UNIDAD_MEDIDA";	
public FORM_APLICACION	="FORM_APLICACION";
public FORM_CATALOGO_VENTA="FORM_CATALOGO_VENTA";	
public FORM_CATALOGO_COMPRA	="FORM_CATALOGO_COMPRA";
public FORM_VENTA="FORM_VENTA";	
public FORM_REPORTE_VENTA:"FORM_REPORTE_VENTA";
public FORM_CAJA="FORM_CAJA";	
public FORM_LOCAL="FORM_LOCAL";	
public FORM_ROL="FORM_ROL";	
public FORM_ALMACEN="FORM_ALMACEN";	
public FORM_COMPROBANTE	="FORM_COMPROBANTE";
public FORM_COMPRA="FORM_COMPRA";	
public FORM_PRODUCTO_DEFECTUOSO="FORM_PRODUCTO_DEFECTUOSO";
public FORM_STOCK="FORM_STOCK";	
public FORM_KARDEX="FORM_KARDEX";
public FORM_TRASLADO="FORM_TRASLADO";
public FORM_COTIZACION="FORM_COTIZACION";	
public FORM_EMPRESA	="FORM_EMPRESA";
public FORM_UNIDAD_EMPRESA="FORM_UNIDAD_EMPRESA";	
public FORM_CARGO	="FORM_CARGO";
public FORM_PAGO	="FORM_PAGO";
public FORM_PLAZA="FORM_PLAZA";	
public FORM_ASIGNACION_PLAZA="FORM_ASIGNACION_PLAZA";	
public FORM_TIPO_CONTRATO="FORM_TIPO_CONTRATO";	
public FORM_TIPO_CAMBIO="FORM_TIPO_CAMBIO";	
public FORM_EMPLEADO	="FORM_EMPLEADO";
public FORM_REPORTE1="FORM_REPORTE1";	
public FORM_REPORTE2	="FORM_REPORTE2";
public FORM_CORRELATIVO_COMPROBANTE	="FORM_CORRELATIVO_COMPROBANTE";
public FORM_SERIE_COMPROBANTE="FORM_SERIE_COMPROBANTE";	
public FORM_MARCA	="FORM_MARCA";
public FORM_GUIA_REMISION	="FORM_GUIA_REMISION";
public FORM_CONDUCTOR_VEHICULO="FORM_CONDUCTOR_VEHICULO";	
public FORM_FACTURACION_ELECTRONICA="FORM_FACTURACION_ELECTRONICA";
public FORM_FACTURACION_MANUAL_ELECTRONICA="FORM_FACTURACION_MANUAL_ELECTRONICA";








/*************COMPONENTE GENERAL PARA VISUALIAR*****************/

public VISUALIZAR_VIEW:string="VISUALIZAR_VIEW";
public BUTTON_REGISTRAR="BUTTON_REGISTRAR";
public BUTTON_SUBIR_FILE_KARDEX="BUTTON_SUBIR_FILE_KARDEX";
public BUTTON_ELIMINAR="BUTTON_ELIMINAR";
public BUTTON_ACTUALIZAR="BUTTON_ACTUALIZAR";
public BUTTON_BUSCAR="BUTTON_BUSCAR";
public BUTTON_AGREGAR_MODIFICAR="BUTTON_AGREGAR_MODIFICAR";
public PANEL_CAMBIAR_CLAVE="PANEL_CAMBIAR_CLAVE";
public BUTTON_CAMBIAR_CLAVE="BUTTON_CAMBIAR_CLAVE";
public BUTTON_PANEL_REFERENCIA="BUTTON_PANEL_REFERENCIA";
public BUTTON_BUSCAR_ROL="BUTTON_BUSCAR_ROL";
public BUTTON_AGREGAR_ROL="BUTTON_AGREGAR_ROL";
public BUTTON_QUITAR_ROL="BUTTON_QUITAR_ROL";
public BUTTON_LIMPIAR="BUTTON_LIMPIAR";
public PANEL_EDITAR="PANEL_EDITAR";
public PANEL_EDITAR_PAGO="PANEL_EDITAR_PAGO";
public BUTTON_IMPRIMIR="BUTTON_IMPRIMIR";
public BUTTON_STOCK="BUTTON_STOCK";
public BUTTON_VER_DETALLE="BUTTON_VER_DETALLE";
}