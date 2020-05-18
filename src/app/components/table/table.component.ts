import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { HttpService } from '../../services/http/http.service';
import { ITableHeaders } from '../../interfaces/table-headers';
import { IHandleAction } from '../../interfaces/handle-action';
import { environment } from '../../../environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'table-component',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})



export class TableComponent implements OnInit {
  @Input() headers : Array<ITableHeaders> = new Array<ITableHeaders>();
  @Input() url : string;
  @Input() reload : number = 1;
  @Input() search : string = null;
  @Input() searchTable : boolean = true;
  
  @Output() handleActionEmit: EventEmitter<IHandleAction> = new EventEmitter<IHandleAction>(null);
  rows: any[];
  pagination: any;
  constructor(  public httpSv: HttpService, private ngxSpinner: NgxSpinnerService) {
    this.rows = [];

   }

   ngOnChanges(changes: SimpleChanges) {
    if (changes.reload.currentValue != 1){
      this.getData(environment.endpoint + this.url, 'rows', 'setLoaded');
    }
   /*  this.doSomething(changes.categoryId.currentValue); */
    // You can also use categoryId.previousValue and 
    // categoryId.firstChange for comparing old and new values

}
    subStrTable(value: string){
      if(value.length > 70) {
        return value.substring(0,67) + "..."
      }else{
        return value;
      }
      
    
      
    }
  handleAction(event: string,row: any){
    this.handleActionEmit.emit({ row: row, type: event } );
    console.log('event', event)

  }
  handleSearch(event: string){
    console.log('event', event);

    let params = new HttpParams();

    // Begin assigning parameters
    this.search = event;
    params = params.append('page', '1');
    params = params.append('search', event ? event : '');
    
    
    this.getData(environment.endpoint + this.url, 'rows', 'setLoaded',
    params
   /*  {
    page : 1,
    search: 
    } */
    );
  }
  handleChangePage(event){
    console.log('event', event);
    this.getData(environment.endpoint + this.url, 'rows', 'setLoaded',
    {
    page : event,
    search: this.search ? this.search : ''
    }
    );
  }
  valueBadgeView(value){
    switch(value){
      case 0 : {
        return "warning"
      }
      case 1 : {
        return "success"
      }
      case 2 : {
        return "error"
      }
      case 3 : {
        return "success"
      }
    }
  }
  valueBadgeStr(value,type = 'default'){
    const valueInt = parseInt(value,10);
    if (type == "event_a"){
      switch(valueInt){
        case 1: {
          return "Enviado";
        }
        case 2: {
          return "Cancelado";
        }
        case 3: {
         return "Aceptado";
       }
    }
  }
    if (type == "contact"){
      /*    console.log("valueInt", valueInt) */
         switch(valueInt){
           case 0: {
             return "Pendiente";
           }
           case 1: {
             return "Atendido";
           }
           case 2: {
            return "Agendado";
          }
         }
       }
      else if (type == "sc"){
        /*    console.log("valueInt", valueInt) */
           switch(valueInt){
             case 0: {
               return "Sin antender";
             }
             case 1: {
               return "Atendido";
             }
             
           }
         }
       else  if (type == "appointment_event"){
          /*    console.log("valueInt", valueInt) */
             switch(valueInt){
               case 0: {
                 return "Pendiente";
               }
               case 1: {
                 return "Agendado";
               }
               case 2: {
                return "Cancelado";
              }
              case 3: {
                return "Culminado";
              }
               
             }
           }
       else if (type == "user"){
        /*    console.log("valueInt", valueInt) */
           switch(valueInt){
             case 0: {
               return "Pendiente";
             }
             case 1: {
               return "Activado";
             }
             case 2: {
              return "Desactivado";
            }
           }
         }
       else {
             switch(valueInt){
               case 0: {
                 return "Pendiente";
               }
               case 1: {
                 return "Completado";
               }
             }
          
       }
  }
  getData(url: string, dataName: string, callbackFnName?: string, params: any = {}) {
    this.ngxSpinner.show();
    this.httpSv.getData(url, params).subscribe(
      data => {
        this.ngxSpinner.hide();
        this[dataName] = data && data.data;
        this.pagination = data && data.meta;
      },
      err => {
        this.ngxSpinner.hide();
        console.log(err);
      },
      () => {
        (callbackFnName && typeof this[callbackFnName] === 'function') ? this[callbackFnName](this[dataName]) : null;
      }
    );
  }

  ngOnInit() {
    this.getData(environment.endpoint + this.url, 'rows', 'setLoaded');
/*     this.getData(environment.endpoint + 'assets/data/appointments.json', 'rows', 'setLoaded'); */
  }

}
