import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BasePageComponent } from '../../base-page';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { IAppState } from '../../../interfaces/app-state';
import { HttpService } from '../../../services/http/http.service';
import { TCModalService } from '../../../ui/services/modal/modal.service';

import { ITableHeaders } from '../../../interfaces/table-headers';
import { GlobalService } from '../../../services/util/GlobalService.service';
import { IHandleAction } from '../../../interfaces/handle-action';
import { IOption } from '../../../ui/interfaces/option';
import { PatientService } from '../../../services/http/PatientService.service';
import { Router } from '@angular/router';

@Component({
  selector: 'patients-component',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.scss']
})
export class PagePatientsComponent extends BasePageComponent implements OnInit, OnDestroy {
  @ViewChild('modalBody') modalBody: ElementRef<any>;
  @ViewChild('modalFooter') modalFooter: ElementRef<any>;

  data: any[];
  categoriesOption: Array<IOption> = new Array<IOption>();
  patientForm: FormGroup;
  statuses: Array<IOption>;
  currentPhoto: string | ArrayBuffer;
  reload : number = 1;
  defaultAvatar: string;
  headers : Array<ITableHeaders>;

  constructor(
    store: Store<IAppState>,
    httpSv: HttpService,
    private modal: TCModalService,
    private router: Router,
    private formBuilder: FormBuilder,
    private patientService: PatientService
  ) {
    super(store, httpSv);
    this.statuses = new Array<IOption>();
    this.statuses.push({
      label: "Pendiente",
      value: "0"
    })
    this.statuses.push({
      label: "Atendido",
      value: "1"
    })
    this.statuses.push({
      label: "Agendado",
      value: "2"
    })
    this.headers = [
      {
        columnName: "name",
        columnTitle: "Nombre",
        iconClass: null,
        tcColor: null,
        tcFontSize: null,
        tcType: 'text',
        tcActions: []
      },
      {
        columnName: "last_name",
        columnTitle: "Apellido",
        iconClass: null,
        tcColor: null,
        tcFontSize: null,
        tcType: 'text',
        tcActions: []
      },
      {
        columnName: "email",
        columnTitle: "Correo",
        iconClass: null,
        tcColor: null,
        tcFontSize: null,
        tcType: 'text',
        tcActions: []
      },
      {
        columnName: "profile_pic",
        columnTitle: "Foto",
        iconClass: null,
        tcColor: null,
        tcFontSize: null,
        tcType: 'img',
        tcActions: []
      },
      {
        columnName: "phone",
        columnTitle: "Teléfono",
        iconClass: null,
        tcColor: null,
        tcFontSize: null,
        tcType: 'text',
        tcActions: []
      },
      {
        columnName: "updated_at",
        columnTitle: "Ultima actualización",
        iconClass: null,
        tcColor: null,
        tcFontSize: null,
        tcType: 'text',
        tcActions: []
      },
      {
        columnName: "status",
        columnTitle: "Estatus",
        iconClass: "user",
        tcColor: null,
        tcFontSize: null,
        tcType: 'badge',
        tcActions: []
      },
      {
        columnName: "actions",
        columnTitle: "Acciones",
        iconClass: null,
        tcColor: null,
        tcFontSize: null,
        tcType: 'actions',
        tcActions: [
          {
          afterIcon: 'icofont-ui-edit',
          view: 'info',
          size: 'sm',
          handleClick: 'edit'
        } ,
        {
          afterIcon: 'icofont-ui-delete',
          view: 'error',
          size: 'sm',
          handleClick: 'remove'
        } ]
      }
    ];

    this.pageData = {
    loaded: true,
    title: 'Pacientes',
    breadcrumbs: [
      {
        title: 'Portal',
        route: 'default-dashboard'
      },
      {
        title: 'Pacientes'
      }
    ]
    };
    
   /*  this.doctors = []; */
    this.defaultAvatar = 'assets/content/avatar.jpeg';
    this.currentPhoto = this.defaultAvatar;
  }

  async ngOnInit() {
   /*  await this.loadCategories(); */
    super.ngOnInit();
    this.initForm(null);
    this.getData('assets/data/appointments.json', 'data', 'setLoaded');
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  // open modal window
  openModal(body: any, header: any = null, footer: any = null, data: any = null) {
    this.initForm(data);
    this.modal.open({
      body: body,
      header: header,
      footer: footer
    });
  }

  // close modal window
  closeModal() {
    this.modal.close();
    this.patientForm.reset();
  }
  createPatient(){
    this.currentPhoto = null;
    this.openModal(this.modalBody, 'Crear paciente', this.modalFooter)
  }
  async handleActionEmit(event: IHandleAction){
    console.log('emit', event);
    const row = event.row;
    const type = event.type;
    switch(type){
      case "edit":{
        this.router.navigateByUrl("/vertical/account/" + row.id);
     /*    this.edit(row); */
        break;
      }
      case "remove":{
       const result = await GlobalService.AlertDelete();
       if (result.value) 
       {
        this.deletePatient(row.id);
       }
        break;
      }
    }
  }

  // init form
  initForm(data: any) {
 
    this.patientForm = this.formBuilder.group({
      id: [(data ? data.id : null)],
      id_card: [(data ? data.id_card : ''), Validators.required],
      gender: [(data ? data.gender : ''), Validators.required],
      email: [(data ? data.email : ''), Validators.required],
      name: [(data ? data.name : ''), Validators.required],
      last_name: [(data ? data.last_name : ''), Validators.required],
      type: [(data ? data.type : ''), Validators.required],
      address: [(data ? data.address : ''), Validators.required],
      phone: [(data ? data.phone : ''), Validators.required],
      date_of_birth: [(data ? data.date_of_birth : ''), Validators.required],
      message: [(data ? data.message : ''), Validators.required],
      status: [(data ? data.status.toString() : ''), Validators.required]
    });
  }

  // upload new file


  // edit appointment
  edit(row: any) {
    this.openModal(this.modalBody, 'Editar paciente', this.modalFooter, row);
  }

  async createUser(form: FormGroup){
    if (form.valid) {

    }
  }
  
  async savePatient(form: FormGroup) {
    if (form.valid) {
      let patient: any = form.value;
      if (patient.id == null){
        delete patient.id;
        await this.storePatient(patient);
      }else{
        const id = patient.id;
        delete patient.id;
        await this.updatePatient(id, patient);
      }
      console.log(patient);
      this.closeModal();
    }
  }
  async storePatient(patientData: any){
    try {
      GlobalService.ShowSweetLoading();
      const patient: any = await this.patientService.store(patientData);
      GlobalService.SwalCreateItem();
      this.reload++;
     /*  GlobalService.CloseSweet(); */
    } catch (error) {
      console.error('error', error);
      GlobalService.CloseSweet();
    }
  }
  async deletePatient(id){
  try {
    GlobalService.ShowSweetLoading();
    const patient: any = await this.patientService.delete(id);
    GlobalService.SwalDeleteItem();
    this.reload++;
  } catch (error) {
    console.error('error', error)
      GlobalService.CloseSweet();
  }
  }
  async updatePatient(id, patientData: any){
    try {
      GlobalService.ShowSweetLoading();
      const patient: any = await this.patientService.update(id,patientData);
      GlobalService.SwalUpdateItem();
      this.reload++;
    } catch (error) {
      console.error('error', error)
      GlobalService.CloseSweet();
    } 
  }
}
