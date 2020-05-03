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
import { ContactService } from '../../../services/http/ContactService.service';

@Component({
  selector: 'contacts-component',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class PageContactComponent extends BasePageComponent implements OnInit, OnDestroy {
  @ViewChild('modalBody') modalBody: ElementRef<any>;
  @ViewChild('modalFooter') modalFooter: ElementRef<any>;

  data: any[];
  categoriesOption: Array<IOption> = new Array<IOption>();
  contactForm: FormGroup;
  statuses: Array<IOption>;
  currentPhoto: string | ArrayBuffer;
  reload : number = 1;
  defaultAvatar: string;
  headers : Array<ITableHeaders>;

  constructor(
    store: Store<IAppState>,
    httpSv: HttpService,
    private modal: TCModalService,
    private formBuilder: FormBuilder,
    private contactService: ContactService
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
        columnName: "message",
        columnTitle: "Mensaje",
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
        iconClass: "contact",
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
    title: 'Contacto',
    breadcrumbs: [
      {
        title: 'Portal',
        route: 'default-dashboard'
      },
      {
        title: 'Contacto'
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
    this.contactForm.reset();
  }
  createContact(){
    this.currentPhoto = null;
    this.openModal(this.modalBody, 'Crear contacto', this.modalFooter)
  }
  async handleActionEmit(event: IHandleAction){
    console.log('emit', event);
    const row = event.row;
    const type = event.type;
    switch(type){
      case "edit":{
        this.edit(row);
        break;
      }
      case "remove":{
       const result = await GlobalService.AlertDelete();
       if (result.value) 
       {
        this.deleteContact(row.id);
       }
        break;
      }
    }
  }

  // init form
  initForm(data: any) {
    this.contactForm = this.formBuilder.group({
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
    this.openModal(this.modalBody, 'Editar contacto', this.modalFooter, row);
  }

  async createUser(form: FormGroup){
    if (form.valid) {

    }
  }
  async saveContact(form: FormGroup) {
    if (form.valid) {
      let contact: any = form.value;
      if (contact.id == null){
        delete contact.id;
        await this.storeContact(contact);
      }else{
        const id = contact.id;
        delete contact.id;
        await this.updateContact(id, contact);
      }
      console.log(contact);
      this.closeModal();
    }
  }
  async storeContact(contactData: any){
    try {
      GlobalService.ShowSweetLoading();
      const contact: any = await this.contactService.store(contactData);
      GlobalService.SwalCreateItem();
      this.reload++;
     /*  GlobalService.CloseSweet(); */
    } catch (error) {
      console.error('error', error);
      GlobalService.CloseSweet();
    }
  }
  async deleteContact(id){
  try {
    GlobalService.ShowSweetLoading();
    const contact: any = await this.contactService.delete(id);
    GlobalService.SwalDeleteItem();
    this.reload++;
  } catch (error) {
    console.error('error', error)
      GlobalService.CloseSweet();
  }
  }
  async updateContact(id, contactData: any){
    try {
      GlobalService.ShowSweetLoading();
      const contact: any = await this.contactService.update(id,contactData);
      GlobalService.SwalUpdateItem();
      this.reload++;
    } catch (error) {
      console.error('error', error)
      GlobalService.CloseSweet();
    } 
  }
}
