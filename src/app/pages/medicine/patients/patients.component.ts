import { Component, OnDestroy, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';

import { BasePageComponent } from '../../base-page';
import { IAppState } from '../../../interfaces/app-state';
import { HttpService } from '../../../services/http/http.service';
import { IPatient } from '../../../interfaces/patient';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IOption } from '../../../ui/interfaces/option';
import { Content } from '../../../ui/interfaces/modal';
import * as PatientsActions from '../../../store/actions/patients.actions';
import { TCModalService } from '../../../ui/services/modal/modal.service';

@Component({
  selector: 'page-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.scss']
})
export class PagePatientsComponent extends BasePageComponent implements OnInit, OnDestroy {
  patients: IPatient[];
  patientForm: FormGroup;
  gender: IOption[];
  status: IOption[];
  currentAvatar: string | ArrayBuffer;
  defaultAvatar: string;
  test: any;

  constructor(
    store: Store<IAppState>,
    httpSv: HttpService,
    private fb: FormBuilder,
    private modal: TCModalService
  ) {
    super(store, httpSv);

    this.pageData = {
      title: 'Pacientes',
      breadcrumbs: [
        {
          title: 'Servicios',
          route: 'default-dashboard'
        },
        {
          title: 'Pacientes'
        }
      ]
    };
    this.patients = [];
    this.gender = [
      {
        label: 'Masculino',
        value: 'male'
      },
      {
        label: 'Femenino',
        value: 'female'
      }
    ];
    this.status = [
      {
        label: 'Activo',
        value: 'approved'
      },
      {
        label: 'Desactivado',
        value: 'pending'
      }
    ];
    this.defaultAvatar = 'assets/content/avatar.jpeg';
    this.currentAvatar = this.defaultAvatar;
  }

  ngOnInit() {
    super.ngOnInit();

    this.store.select('patients').subscribe(patients => {
      if (patients && patients.length) {
        this.patients = patients;

        !this.pageData.loaded ? this.setLoaded() : null;
      }
    });
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  // delete patient
  remove(id: string) {
    this.store.dispatch(new PatientsActions.Delete(id));
  }

  // open modal window
  openModal<T>(body: Content<T>, header: Content<T> = null, footer: Content<T> = null, row: IPatient) {
    this.initPatientForm(row);

    this.modal.open({
      body: body,
      header: header,
      footer: footer,
      options: null
    });
  }

  // close modal window
  closeModal() {
    this.modal.close();
    this.patientForm.reset();
    this.currentAvatar = this.defaultAvatar;
  }

  // upload new file
  onFileChanged(inputValue: any) {
    let file: File = inputValue.target.files[0];
    let reader: FileReader = new FileReader();

    reader.onloadend = () => {
      this.currentAvatar = reader.result;
    };

    reader.readAsDataURL(file);
  }

  // init form
  initPatientForm(data: IPatient) {
    this.currentAvatar = data.img ? data.img : this.defaultAvatar;

    this.patientForm = this.fb.group({
      id: data.id,
      img: [this.currentAvatar],
      name: [data.name ? data.name : '', Validators.required],
      number: [data.number ? data.number : '', Validators.required],
      age: [data.age ? data.age : '', Validators.required],
      lastVisit: [data.lastVisit ? data.lastVisit : '', Validators.required],
      gender: [data.gender ? data.gender.toLowerCase() : '', Validators.required],
      address: [data.address ? data.address : '', Validators.required],
      status: [data.status ? data.status.toLowerCase() : '', Validators.required]
    });
  }

  // update patient
  updatePatient(form: FormGroup) {
    if (form.valid) {
      let newPatient: IPatient = form.value;
      this.postData('https://reqres.in/api/users', 'test', newPatient);
      if(this.test) {
        console.log(this.test);
      }
      this.store.dispatch(new PatientsActions.Edit(newPatient));
      this.closeModal();
      this.patientForm.reset();
    }
  }
}
