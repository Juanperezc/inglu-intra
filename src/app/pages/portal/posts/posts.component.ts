import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BasePageComponent } from '../../base-page';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { IAppState } from '../../../interfaces/app-state';
import { HttpService } from '../../../services/http/http.service';
import { TCModalService } from '../../../ui/services/modal/modal.service';
import { IUser } from '../../../ui/interfaces/user';
import { ITableHeaders } from '../../../interfaces/table-headers';
import Swal from 'sweetalert2';

@Component({
  selector: 'post-component',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PagePostComponent extends BasePageComponent implements OnInit, OnDestroy {
  @ViewChild('modalBody') modalBody: ElementRef<any>;
  @ViewChild('modalFooter') modalFooter: ElementRef<any>;

  appointments: any[];
  appointmentForm: FormGroup;
  currentAvatar: string | ArrayBuffer;
  defaultAvatar: string;
  doctors: IUser[];
  headers : Array<ITableHeaders>;
  constructor(
    store: Store<IAppState>,
    httpSv: HttpService,
    private modal: TCModalService,
    private formBuilder: FormBuilder
  ) {
    super(store, httpSv);

    this.headers = [{
      columnName: "title",
      columnTitle: "Titulo",
      iconClass: null,
      tcColor: null,
      tcFontSize: null,
      tcType: 'text',
      tcActions: []
    },
    {
      columnName: "description",
      columnTitle: "Descripción",
      iconClass: null,
      tcColor: null,
      tcFontSize: null,
      tcType: 'text',
      tcActions: []
    },
    {
      columnName: "photo",
      columnTitle: "Foto",
      iconClass: null,
      tcColor: null,
      tcFontSize: null,
      tcType: 'img',
      tcActions: []
    },
    {
      columnName: "actions",
      columnTitle: "Acciones",
      iconClass: null,
      tcColor: null,
      tcFontSize: null,
      tcType: 'actions',
      tcActions: [{
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
    title: 'Publicaciones',
    breadcrumbs: [
      {
        title: 'Portal',
        route: 'default-dashboard'
      },
      {
        title: 'Publicaciones'
      }
    ]
    };
    this.appointments = [];
    this.doctors = [];
    this.defaultAvatar = 'assets/content/anonymous-400.jpg';
    this.currentAvatar = this.defaultAvatar;
  }

  ngOnInit() {
    super.ngOnInit();

    this.getData('assets/data/appointments.json', 'appointments', 'setLoaded');
    this.getData('assets/data/doctors.json', 'doctors');
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
    this.appointmentForm.reset();
  }

  handleActionEmit(event){
    console.log('emit', event);
    switch(event){
      case "remove":{
        Swal.fire({
          title: 'Are you sure?',
          text: "You won't be able to revert this!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
          if (result.value) {
            Swal.fire(
              'Deleted!',
              'Your file has been deleted.',
              'success'
            )
          }
        })
      }
    }
  }
  // init form
  initForm(data: any) {
    this.appointmentForm = this.formBuilder.group({
      img: [(data ? data.img : this.currentAvatar)],
      name: [(data ? data.name : ''), Validators.required],
      email: [(data ? data.email : ''), Validators.required],
      date: [(data ? data.date : ''), Validators.required],
      from: [(data ? data.fromTo.substring(0, (data.fromTo.indexOf('-') - 1)) : ''), Validators.required],
      to: [(data ? data.fromTo.substring((data.fromTo.indexOf('-') + 2), data.fromTo.length) : ''), Validators.required],
      number: [(data ? data.number : ''), Validators.required],
      doctor: [(data ? data.doctor : ''), Validators.required],
      injury: [(data ? data.injury : ''), Validators.required]
    });
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

  // edit appointment
  edit(row: any) {
    this.openModal(this.modalBody, 'Editar cita medica', this.modalFooter, row);
  }

  // remove appointment
  remove(tableRow: any) {
    this.appointments = this.appointments.filter(row => row !== tableRow);
  }

  // add new appointment
  addAppointment(form: FormGroup) {
    if (form.valid) {
      let newAppointment: any = form.value;

      newAppointment.fromTo = `${form.value.from} - ${form.value.to}`;
      newAppointment.img = this.currentAvatar;

      delete newAppointment.from;
      delete newAppointment.to;

      this.appointments.unshift(newAppointment);
      let newTableData = JSON.parse(JSON.stringify(this.appointments));

      this.appointments = newTableData;
      this.closeModal();
    }
  }
}
