
import { Rutas} from '../../../core/util/rutas';


export class RutasContabilidad extends Rutas{

 /****************NOMBRE DE LOS COMPONENTES Y VISTAS************************/
 


/**************VISTAS**************/
public  FORM_LIBRO_DIARIO:string="FORM_LIBRO_DIARIO";
public  FORM_LIBRO_COMPRA:string="FORM_LIBRO_COMPRA";
public  FORM_LIBRO_VENTA:string="FORM_LIBRO_VENTA";
public  FORM_PCGE:string="FORM_PCGE";
public FORM_LIBRO_CAJA_BANCO:string = "FORM_LIBRO_CAJA";
public FORM_LIBRO_MAYOR:string = "FORM_LIBRO_MAYOR";

/***************NOMBRES DE LAS PETICIONES HTTP QUE SE SOLICITAN *************************/

public API_CONTABILIDAD_REST=this.APP+"/contabilidad";
public API_LIBRO_DIARIO_REST=this.APP+"/libro_diario";
public API_LIBRO_COMPRA_REST=this.APP+"/libro_compra";
public API_LIBRO_VENTA_REST=this.APP+"/libro_venta";
public API_CONFIGURACION_CUENTA_REST=this.APP+"/configuracion_cuenta";
public API_SUNAT_TABLA_REST=this.APP+"/sunat_tabla";
public API_LETRA_REST=this.APP+"/letra";
public API_PCGE_REST=this.APP+"/pcge";
public API_LIBRO_CAJA_BANCO_REST = this.APP+'/libro_caja';
public API_LIBRO_MAYOR_REST= this.APP+'/libro_mayor'
}