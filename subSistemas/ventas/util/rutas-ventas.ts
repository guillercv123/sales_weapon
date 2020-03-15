
import { Rutas} from '../../../core/util/rutas';


export class RutasVentas extends Rutas{


 /****************NOMBRE DE LOS COMPONENTES Y VISTAS************************/
 public BUTTON_BUSCAR:string="BUTTON_BUSCAR";
 

/**************VISTAS**************/
 public  FORM_CARNET:string="FORM_CARNET";
 


/***************NOMBRES DE LAS PETICIONES HTTP QUE SE SOLICITAN *************************/

public API_VENTA_REST=this.APP+"/venta";
public API_PAGO_REST=this.APP+"/pago";
public API_COMPROBANTE_REST=this.APP+"/comprobante";
public API_COMPROBANTE_ELECTRONICO_REST=this.APP+"/comprobante_electronico";
public API_COTIZACION_REST=this.APP+"/cotizacion";
public API_FACTURA_ELECTRONICA_REST=this.APP+"/factura_electronica";
public API_FACTURADOR_SUNAT_REST=this.APP+"/facturador_sunat";
public API_FACTURA_MANUAL_ELECTRONICA_REST=this.APP+"/factura_manual_electronica";
}