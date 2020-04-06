import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';

import { BasePageComponent } from '../base-page';
import { IAppState } from '../../interfaces/app-state';
import { HttpService } from '../../services/http/http.service';

@Component({
  selector: 'page-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class PageSettingsComponent extends BasePageComponent implements OnInit {
  constructor(
    store: Store<IAppState>,
    httpSv: HttpService
  ) {
    super(store, httpSv);

    this.pageData = {
      title: 'Configuración General',
      loaded: false,
      breadcrumbs: [
        {
          title: 'Configuración General',
          route: 'default-dashboard'
        },
        {
          title: 'Portal'
        }
      ]
    };
  }

  ngOnInit() {
    super.ngOnInit();
  }

  ngAfterViewInit() {
    this.setLoaded()
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }
}
