import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpService } from '../../services/http/http.service';
import { ITableHeaders } from '../../interfaces/table-headers';
import { environment } from '../../../environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'table-component',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})


export class TableComponent implements OnInit {
  @Input() headers : Array<ITableHeaders> = new Array<ITableHeaders>();
  @Input() url : string;
  @Input() search : string = null;
  @Output() handleActionEmit: EventEmitter<string> = new EventEmitter<string>(null);
  rows: any[];
  pagination: any;
  constructor(  public httpSv: HttpService, private ngxSpinner: NgxSpinnerService) {
    this.rows = [];

   }
  handleAction(event: string){
    this.handleActionEmit.emit(event);
    console.log('event', event)

  }
  handleSearch(event: string){
    
    console.log('event', event);
    this.search = event;
    this.getData(environment.endpoint + this.url, 'rows', 'setLoaded',
    {
    page : 1,
    search: this.search ? this.search : ''
    }
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
  getData(url: string, dataName: string, callbackFnName?: string, params: any = {}) {
    this.ngxSpinner.show();
    this.httpSv.getData(url, params).subscribe(
      data => {
        this.ngxSpinner.hide();
        this[dataName] = data.data;
        this.pagination = data.meta;
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
