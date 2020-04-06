import Swal from 'sweetalert2';
import * as moment from 'moment';

export class GlobalService{

  static formatDate(date: any, format = "YYYY-MM-DD"){
    console.log(moment(date).format(format));
    return moment(date).format(format);
  }
    static async AlertDelete(){
        const result = await Swal.fire({
          title: '¿Estas seguro que deseas borrar el item?',
          text: "No podrás revertir esta acción!",
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si'
        })
        return result;
      }
      static async SwalCreateItem(){
        const result =  Swal.fire(
          'Item creado',
          'La información se creo con éxito.',
          'success'
        )
        return result;

      }
      static async SwalUpdateItem(){
        const result =  await Swal.fire(
          'Item actualizado',
          'La información se actualizo con éxito.',
          'success'
        )
        return result;

      }

      static async SwalDeleteItem(){
        const result =  Swal.fire(
          'Item Eliminado',
          'La información se elimino con éxito.',
          'success'
        )
        return result;

      }
      static async ShowSweetLoading(text = null){
       const sweet =  Swal.fire({
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
          allowEnterKey: false
        });
        return sweet;
      }
      static async CloseSweet(){
        const sweet = Swal.close();
        return sweet;
       }
}