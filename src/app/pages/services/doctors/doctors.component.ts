import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Store } from '@ngrx/store';
import { BasePageComponent } from '../../base-page';
import { IUser } from '../../../ui/interfaces/user';
import { IAppState } from '../../../interfaces/app-state';
import { HttpService } from '../../../services/http/http.service';
import { Content } from '../../../ui/interfaces/modal';
import { TCModalService } from '../../../ui/services/modal/modal.service';
import { IOption } from '../../../ui/interfaces/option';
import { DoctorService } from './../../../services/http/DoctorService.service';
import { GlobalService } from './../../../services/util/GlobalService.service';
import { Router } from '@angular/router';

@Component({
  selector: 'page-doctors',
  templateUrl: './doctors.component.html',
  styleUrls: ['./doctors.component.scss']
})
export class PageDoctorsComponent extends BasePageComponent implements OnInit, OnDestroy {
  pagination: boolean = true;
  pagesCount: number = 1;
	page: number = 1;
  doctors: any[];
  doctorForm: FormGroup;
  gender: IOption[];
  search: boolean = true;
  currentAvatar: string | ArrayBuffer;
  defaultAvatar: string;
  searchText: string = null;
  specialists: string[];

  constructor(
    store: Store<IAppState>,
    httpSv: HttpService,
    private modal: TCModalService,
    private formBuilder: FormBuilder,
    private doctorService: DoctorService,
    private router: Router,
  ) {
    super(store, httpSv);

    this.pageData = {
      title: 'Personal del club',
      breadcrumbs: [
        {
          title: 'Servicios',
          route: 'default-dashboard'
        },
        {
          title: 'Personal del club'
        }
      ]
    };
    this.doctors = [];
    this.gender = [
      {
        label: 'Male',
        value: 'male'
      },
      {
        label: 'Female',
        value: 'female'
      }
    ];
    this.defaultAvatar = 'assets/content/avatar.jpeg';
    this.currentAvatar = this.defaultAvatar;
    this.specialists = [];
  }

  ngOnInit() {
    super.ngOnInit();
    this.loadData();
    this.getData('assets/data/doctors.json', 'doctors', 'setLoaded');
    this.getData('assets/data/doctors-specialists.json', 'specialists');
  }

 
  
  changeSearch(newValue) {
  /*   mymodel = newValue; */
  this.searchText = newValue;
  /*   console.log(newValue) */
  }
  async submitSearch(){
      await this.loadData(1,this.searchText);
  }
  async createDoctor(){
    await this.router.navigateByUrl("/vertical/create-doctor");
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }


  async loadData(page = 1, search = null){
    try {
      GlobalService.ShowSweetLoading();
      const doctors: any = await this.doctorService.index(page,search);
      if (doctors.meta){
        this.pagesCount = doctors.meta.last_page;
        this.page = doctors.meta.current_page;
      }
      this.doctors = doctors.data;
      console.log('doctors', doctors);
      GlobalService.CloseSweet();
    } catch (error) {
      console.error('error', error);
      GlobalService.CloseSweet();
    }
  }





  goToPage(pageNum: number) {
    this.loadData(pageNum,this.searchText)
	}
}
