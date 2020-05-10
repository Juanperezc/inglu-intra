import Swal from "sweetalert2";
import * as moment from "moment";

export class GlobalService {
  static formatDate(date: any, format = "YYYY-MM-DD") {
   /*  console.log(moment.utc(date).local().format(format)); */
    return moment.utc(date).local().format(format);
  }
  static async AlertDelete() {
    const result = await Swal.fire({
      heightAuto: false,
      title: "¿Estas seguro que deseas borrar el item?",
      text: "No podrás revertir esta acción!",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si",
    });
    return result;
  }
  static async SwalCreateItem() {
    const result = Swal.fire({
      heightAuto: false,
      title: "Item creado",
      text: "La información se creo con éxito.",
      type: "success",
    }
    );
    return result;
  }
  static async SwalUpdateItem() {
    const result = await Swal.fire(
      {
        heightAuto: false,
        title: "Item actualizado",
        text: "La información se actualizo con éxito.",
        type: "success"
      }
    );
    return result;
  }

  static async SwalDeleteItem() {
    const result = Swal.fire(
      {
        heightAuto: false,
        title: "Item Eliminado",
        text: "La información se elimino con éxito.",
        type: "success"
      }
    );
    return result;
  }
  static async ShowSweetLoading(text = null) {
    const sweet = Swal.fire({
      heightAuto: false,
      title: "Espera un momento ...",
      text: text,
      onBeforeOpen() {
        Swal.showLoading();
      },
      onAfterClose() {
        Swal.hideLoading();
      },
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false,
    });
    return sweet;
  }
  static async CloseSweet() {
    const sweet = Swal.close();
    return sweet;
  }
}
