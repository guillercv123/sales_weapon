
import { Rutas} from '../../../core/util/rutas';


export class RutasCompras extends Rutas{

 /****************NOMBRE DE LOS COMPONENTES Y VISTAS************************/
 public BUTTON_BUSCAR:string="BUTTON_BUSCAR";
 public VER_IMAGEN:string="VER_IMAGEN";
 public BUTTON_REGISTRAR:string="BUTTON_REGISTRAR";

/**************VISTAS**************/
 public  FORM_VEHICULOS:string="FORM_VEHICULOS";
 public  FORM_ASIENTOS:string="FORM_ASIENTOS";
 public  FORM_OFICINAS:string="FORM_OFICINAS";
 public  FORM_TITULARIDAD:string="FORM_TITULARIDAD";
 public  FORM_RAZON_SOCIAL:string="FORM_RAZON_SOCIAL";
 public  FORM_AERONAVE:string="FORM_AERONAVE";



/***************NOMBRES DE LAS PETICIONES HTTP QUE SE SOLICITAN *************************/

public API_COMPRA_REST=this.APP+"/compra";
}