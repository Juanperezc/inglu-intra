import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BasePageComponent } from '../../base-page';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { IAppState } from '../../../interfaces/app-state';
import { HttpService } from '../../../services/http/http.service';
import { TCModalService } from '../../../ui/services/modal/modal.service';
import { IUser } from '../../../ui/interfaces/user';
import { ITableHeaders } from '../../../interfaces/table-headers';
import { GlobalService } from '../../../services/util/GlobalService.service';
import { IHandleAction } from '../../../interfaces/handle-action';
import { IOption } from '../../../ui/interfaces/option';
import { UserService } from '../../../services/http/UserService.service';
import { EventService } from '../../../services/http/EventService.service';
import { FileService } from '../../../services/http/FileService.service';

@Component({
  selector: 'events-component',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class PageEventsComponent extends BasePageComponent implements OnInit, OnDestroy {
  @ViewChild('modalBody') modalBody: ElementRef<any>;
  @ViewChild('modalFooter') modalFooter: ElementRef<any>;
  types=[];
  data: any[];
  doctors: Array<IOption>;
  statuses: Array<IOption>;
  categoriesOption: Array<IOption> = new Array<IOption>();
  eventForm: FormGroup;
  currentPhoto: string | ArrayBuffer;
  reload : number = 1;
  defaultAvatar: string;
  minDate: any;
/*   doctors: IUser[]; */
  headers : Array<ITableHeaders>;
  constructor(
    store: Store<IAppState>,
    httpSv: HttpService,
    private modal: TCModalService,
    private formBuilder: FormBuilder,
    private eventService: EventService,
    private userService: UserService,
    private fileService: FileService
  ) {
    super(store, httpSv);
    this.doctors = new Array<IOption>();
    this.statuses = new Array<IOption>();


    this.types.push(
    {
      label: "Actividad fisica",
      value: "Actividad fisica",
    },
    {
      label: "Apoyo psicologico",
      value: "Apoyo psicologico",
    },
    {
      label: "Integración comunitaria y familiar",
      value: "Integración comunitaria y familiar",
    },
    {
      label: "Conferencias",
      value: "Conferencias",
    },
    {
      label: "Recreación",
      value: "Recreación",
    })
    this.statuses.push({
      label: "Activado",
      value: "enable"
    })
    this.statuses.push({
      label: "Desactivado",
      value: "disabled"
    })
    this.statuses.push({
      label: "Culminado",
      value: "terminated"
    })

    this.headers = [{
      columnName: "name",
      columnTitle: "Nombre",
      iconClass: null,
      tcColor: null,
      tcFontSize: null,
      tcType: 'text',
      tcActions: []
    },
    {
      columnName: "picture",
      columnTitle: "Foto",
      iconClass: null,
      tcColor: null,
      tcFontSize: null,
      tcType: 'img',
      tcActions: []
    },
    {
      columnName: "description",
      columnTitle: "Descripcion",
      iconClass: null,
      tcColor: null,
      tcFontSize: null,
      tcType: 'text',
      tcActions: []
    },
    {
      columnName: "type",
      columnTitle: "Tipo",
      iconClass: null,
      tcColor: null,
      tcFontSize: null,
      tcType: 'text',
      tcActions: []
    },
    {
      columnName: "date",
      columnTitle: "Fecha",
      formatter: (value) => {
        return  GlobalService.formatDate(value, "DD-MM-YYYY HH:mm");
      },
      iconClass: null,
      tcColor: null,
      tcFontSize: null,
      tcType: 'text',
      tcActions: []
    },
    {
      columnName: "updated_at",
      formatter: (value) => {
        return  GlobalService.formatDate(value, "DD-MM-YYYY HH:mm");
      },
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
      iconClass: 'user',
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
       /*  {
          afterIcon: 'icofont-eye',
          view: 'success',
          size: 'sm',
          handleClick: 'view'
        }, */
        {
        afterIcon: 'icofont-ui-edit',
        view: 'info',
        size: 'sm',
        handleClick: 'edit'
      },
      {
        afterIcon: 'icofont-ui-delete',
        view: 'error',
        size: 'sm',
        handleClick: 'remove'
      }]
    }];

    this.pageData = {
    loaded: true,
    title: 'Eventos',
    breadcrumbs: [
      {
        title: 'Servicios',
        route: 'default-dashboard'
      },
      {
        title: 'Eventos'
      }
    ]
    };
   /*  this.doctors = []; */
    this.defaultAvatar = 'assets/content/avatar.jpeg';
    this.currentPhoto = this.defaultAvatar;
  }

  async ngOnInit() {
   /*  await this.loadCategories(); */
   this.minDate = new Date();
    super.ngOnInit();
    this.getData('assets/data/appointments.json', 'data', 'setLoaded');
    await this.loadDoctors();
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

  //loadDoctors
  async loadDoctors(){
    try {
      GlobalService.ShowSweetLoading();
      const doctors: any = await this.userService.index_doctors();
      const dataDoctors = doctors.data;
      if (dataDoctors){
        dataDoctors.forEach(doctor => {
          this.doctors.push({
            label: doctor.name + " " + doctor.last_name,
            value: doctor.id.toString()
          })
        });
      }
      console.log(dataDoctors);
      GlobalService.CloseSweet();
    } catch (error) {
      console.error('error', error)
      GlobalService.CloseSweet();
    }
  }

  // close modal window
  closeModal() {
    this.modal.close();
    this.eventForm.reset();
  }
  createEvent(){
    this.currentPhoto = null;
    this.openModal(this.modalBody, 'Crear evento', this.modalFooter)
  }

  async onFileChanged(inputValue: any) {
    let file: File = inputValue.target.files[0];
    console.log(file);
    try {
    GlobalService.ShowSweetLoading();
    console.log('test');
    const service: any = await this.fileService.upload_file(file,"image/event");
    console.log(service);
    GlobalService.CloseSweet();
    this.eventForm.controls['picture'].setValue(service.urlFinal);
    console.log()
    } catch (error) {
    console.error('error', error);
    GlobalService.CloseSweet();
    }
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
        this.deleteEvent(row.id);
       }
        break;
      }
    }
  }

  // init form
  initForm(data: any) {
    let status = null;
    if (data){
      switch(data.status){
        case 1:{
          status = "enable";
          break;
        }
        case 2:{
          status = "disabled";
          break;
        }
        case 3:{
          status = "terminated";
          break;
        }
      }
    }
    console.log('data', data);
 /*   console.log('date', GlobalService.formatDate(data.date.toString(), "YYYY-MM-DD H:m")) */ 
    this.eventForm = this.formBuilder.group({
      id: [(data ? data.id : null)],
      picture: [(data ? data.picture : '')],
      doctor_id: [(data && data.doctor_id ? data.doctor_id.toString() : '')],
      date: [(data ? GlobalService.formatDate(data.date.toString(), "YYYY-MM-DD HH:mm") : '')],
      name: [(data ? data.name : '')],
      description: [(data ? data.description : '')],
      limit: [(data ? data.limit : '')],
      type: [(data ? data.type : '')],
      location: [(data ? data.location : '')],
      status: [(data && data.status ? status : '')],
    });
  }

  // upload new file


  // edit appointment
  edit(row: any) {
    this.openModal(this.modalBody, 'Editar Evento', this.modalFooter, row);
  }


  async saveEvent(form: FormGroup) {
    if (form.valid) {
      let event: any = form.value;
      if (event.id == null){
        delete event.id;
        await this.storeEvent(event);
      }else{
        const id = event.id;
        delete event.id;
        await this.updateEvent(id, event);
      }
   
    /*   event.photo = this.currentPhoto; */

      console.log(event);
     
    }
  }
  async storeEvent(eventData: any){
    try {
      GlobalService.ShowSweetLoading();
      const event: any = await this.eventService.store(eventData);
      GlobalService.SwalCreateItem();
      this.reload++;
      this.closeModal();
     /*  GlobalService.CloseSweet(); */
    } catch (error) {
      console.error('error', error);
      GlobalService.CloseSweet();
    }
  }
  async deleteEvent(id){
  try {
    GlobalService.ShowSweetLoading();
    const event: any = await this.eventService.delete(id);
    GlobalService.SwalDeleteItem();
    this.reload++;
  } catch (error) {
    console.error('error', error)
      GlobalService.CloseSweet();
  }
  }
  async updateEvent(id, eventData: any){
    try {
      GlobalService.ShowSweetLoading();
      const event: any = await this.eventService.update(id,eventData);
      GlobalService.SwalUpdateItem();
      this.reload++;
      this.closeModal();
   /*    GlobalService.CloseSweet(); */
    } catch (error) {
      console.error('error', error)
      GlobalService.CloseSweet();
    } 
  }
}
