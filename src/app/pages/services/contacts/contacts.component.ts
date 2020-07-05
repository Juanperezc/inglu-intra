import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { BasePageComponent } from "../../base-page";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Store } from "@ngrx/store";
import { IAppState } from "../../../interfaces/app-state";
import { HttpService } from "../../../services/http/http.service";
import { TCModalService } from "../../../ui/services/modal/modal.service";

import { ITableHeaders } from "../../../interfaces/table-headers";
import { GlobalService } from "../../../services/util/GlobalService.service";
import { IHandleAction } from "../../../interfaces/handle-action";
import { IOption } from "../../../ui/interfaces/option";
import { ContactService } from "../../../services/http/ContactService.service";
import { Router } from "@angular/router";
import { UserService } from '../../../services/http/UserService.service';
import { AppointmentService } from '../../../services/http/AppointmentService.service';

@Component({
  selector: "contacts-component",
  templateUrl: "./contacts.component.html",
  styleUrls: ["./contacts.component.scss"],
})
export class PageContactComponent extends BasePageComponent
  implements OnInit, OnDestroy {
  @ViewChild("modalBody") modalBody: ElementRef<any>;
  @ViewChild("modalFooter") modalFooter: ElementRef<any>;


  @ViewChild("modalBodyContact") modalBodyContact: ElementRef<any>;
  @ViewChild("modalFooterContact") modalFooterContact: ElementRef<any>;


  data: any[];
  categoriesOption: Array<IOption> = new Array<IOption>();
  appointmentForm: FormGroup;
  workspaces: Array<IOption>;
  contactForm: FormGroup;
  statuses: Array<IOption>;
  doctors: Array<IOption>;
  currentPhoto: string | ArrayBuffer;
  reload: number = 1;
  defaultAvatar: string;
  headers: Array<ITableHeaders>;

  constructor(
    store: Store<IAppState>,
    httpSv: HttpService,
    private modal: TCModalService,
    private formBuilder: FormBuilder,
    private contactService: ContactService,
    private router: Router,
    private appointmentService: AppointmentService,
    private userService: UserService
  ) {
    super(store, httpSv);
    this.statuses = new Array<IOption>();
    this.statuses.push({
      label: "Pendiente",
      value: "0",
    });
    this.statuses.push({
      label: "Atendido",
      value: "1",
    });
    this.statuses.push({
      label: "Agendado",
      value: "2",
    });
    this.statuses.push({
      label: "Rechazado",
      value: "3",
    });
    
    this.headers = [
      {
        columnName: "name",
        columnTitle: "Nombre",
        iconClass: null,
        tcColor: null,
        tcFontSize: null,
        tcType: "text",
        tcActions: [],
      },
      {
        columnName: "last_name",
        columnTitle: "Apellido",
        iconClass: null,
        tcColor: null,
        tcFontSize: null,
        tcType: "text",
        tcActions: [],
      },
      {
        columnName: "email",
        columnTitle: "Correo",
        iconClass: null,
        tcColor: null,
        tcFontSize: null,
        tcType: "text",
        tcActions: [],
      },
      {
        columnName: "message",
        columnTitle: "Mensaje",
        iconClass: null,
        tcColor: null,
        tcFontSize: null,
        tcType: "text",
        tcActions: [],
      },
      {
        columnName: "updated_at",
        columnTitle: "Ultima actualización",
        iconClass: null,
        tcColor: null,
        tcFontSize: null,
        tcType: "text",
        tcActions: [],
      },
      {
        columnName: "status",
        columnTitle: "Estatus",
        iconClass: "contact",
        tcColor: null,
        tcFontSize: null,
        tcType: "badge",
        tcActions: [],
      },
      {
        columnName: "actions",
        columnTitle: "Acciones",
        iconClass: null,
        tcColor: null,
        tcFontSize: null,
        tcType: "actions",
        tcActions: [
          {
            afterIcon: "icofont-stethoscope-alt",
            view: "warning",
            size: "sm",
            handleClick: "appointment",
          },
          {
            afterIcon: "icofont-ui-edit",
            view: "info",
            size: "sm",
            handleClick: "edit",
          },
          {
            afterIcon: "icofont-ui-delete",
            view: "error",
            size: "sm",
            handleClick: "remove",
          }
        ],
      },
    ];

    this.pageData = {
      loaded: true,
      title: "Contacto",
      breadcrumbs: [
        {
          title: "Portal",
          route: "default-dashboard",
        },
        {
          title: "Contacto",
        },
      ],
    };

    this.doctors = [];
    this.workspaces = [];
    this.defaultAvatar = "assets/content/avatar.jpeg";
    this.currentPhoto = this.defaultAvatar;
  }


  async ngOnInit() {
    /*  await this.loadCategories(); */
    this.initForm(null);
    this.initFormContact(null);
    await this.loadDoctors();
    super.ngOnInit();
    this.getData("assets/data/appointments.json", "data", "setLoaded");

  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  // open modal window
  openModal(
    body: any,
    header: any = null,
    footer: any = null,
    data: any = null
  ) {
    this.initForm(data);
    this.modal.open({
      body: body,
      header: header,
      footer: footer,
    });
  }

   // open modal window
  openModalAppointment(
    body: any,
    header: any = null,
    footer: any = null,
    data: any = null
  ) {
    this.initFormContact(data);
    this.modal.open({
      body: body,
      header: header,
      footer: footer,
    });
  }

    //loadDoctors
  async loadWorkspaces(id) {
      try {
        GlobalService.ShowSweetLoading();
        const workspaces: any = await this.userService.show_workspace(id);
        const dataWorkspaces = workspaces.data;
        if (dataWorkspaces) {
          dataWorkspaces.forEach((workspace) => {
            this.workspaces.push({
              label:
                workspace.location +
                " " +
                workspace.day +
                " / " +
                workspace.start_time +
                "-" +
                workspace.end_time,
              value: workspace.id.toString(),
            });
          });
        }
  
        GlobalService.CloseSweet();
      } catch (error) {
        console.error("error", error);
        GlobalService.CloseSweet();
      }
    }

  // edit appointment
  async editAppointment(row: any) {
      await this.openModalAppointment(
        this.modalBodyContact,
        "Crear cita",
        this.modalFooterContact,
        row
      );
  }

    async handleMedicSelected(event) {
      await this.loadWorkspaces(event);
      console.log(event);
    }

    //loadDoctors
    async loadDoctors() {
      try {
        GlobalService.ShowSweetLoading();
        const doctors: any = await this.userService.index_doctors();
        const dataDoctors = doctors.data;
        if (dataDoctors) {
          dataDoctors.forEach((doctor) => {
            this.doctors.push({
              label: doctor.name + " " + doctor.last_name,
              value: doctor.id.toString(),
            });
          });
        }
        console.log(dataDoctors);
        GlobalService.CloseSweet();
      } catch (error) {
        console.error("error", error);
        GlobalService.CloseSweet();
      }
    }
   // initForm
  async initFormContact(data: any) {
    console.log("data", data);
    this.appointmentForm = this.formBuilder.group({
      id: [null],
      condition: ["Primera cita"],
      date: [""],
      contact_id: [data ? data.id.toString() : ""],
      medical_staff_id: [""],
      user_workspace_id: [""],
      status: [""],
    });
  }

  // close modal window
  closeModal() {
    this.modal.close();
    this.contactForm.reset();
  }
  createContact() {
    this.currentPhoto = null;
    this.openModal(this.modalBody, "Crear contacto", this.modalFooter);
  }
  async handleActionEmit(event: IHandleAction) {
    console.log("emit", event);
    const row = event.row;
    const type = event.type;
    switch (type) {
      case "appointment": {
        this.editAppointment(row);
        break;
      }
      case "edit": {
        this.edit(row);
        break;
      }
      case "remove": {
        const result = await GlobalService.AlertDelete();
        if (result.value) {
          this.deleteContact(row.id);
        }
        break;
      }
    }
  }

  // init form
  initForm(data: any) {
    this.contactForm = this.formBuilder.group({
      id: [data ? data.id : null],
      id_card: [data ? data.id_card : ""],
      gender: [data ? data.gender == "male" ? "Masculino" : "Femenino"  : ""],
      email: [data ? data.email : ""],
      name: [data ? data.name : ""],
      last_name: [data ? data.last_name : ""],
      type: [data ? data.type : ""],
      address: [data ? data.address : ""],
      phone: [data ? data.phone : ""],
      date_of_birth: [data ? data.date_of_birth : ""],
      message: [data ? data.message : ""],
      status: [data ? data.status.toString() : ""],
    });
  }

  // upload new file

  // edit appointment
  edit(row: any) {
    this.openModal(this.modalBody, "Editar contacto", this.modalFooter, row);
  }

  async createUser(form: FormGroup) {
    if (form.valid) {
      console.log("navitate");
      this.router.navigate([
        "/vertical/create-patient"]
        , { queryParams: form.value}
      );
      this.closeModal();
    }
  }
  async saveContact(form: FormGroup) {
    if (form.valid) {
      let contact: any = form.value;
      contact.gender = contact.gender == "Masculino" ? "male" : "female";
      if (contact.id == null) {
        delete contact.id;
        await this.storeContact(contact);
      } else {
        const id = contact.id;
        delete contact.id;
        await this.updateContact(id, contact);
      }
      console.log(contact);
      this.closeModal();
    }
  }

  async saveAppointment(form: FormGroup) {
    if (form.valid) {
      let appointment: any = form.value;
      if (appointment.id == null) {
        delete appointment.id;
        console.log('form', appointment)
        this.storeAppointment(appointment);
      /*   await this.storeContact(contact); */
      }
      console.log(appointment);
     /*  this.closeModal(); */
    }
  }

  async storeAppointment(contactData: any) {
    try {
      GlobalService.ShowSweetLoading();
      const contact: any = await this.appointmentService.store(contactData);
      GlobalService.SwalCreateItem();
      this.reload++;
      this.closeModal();
      /*  GlobalService.CloseSweet(); */
    } catch (error) {
      console.error("error", error);
      GlobalService.CloseSweet();
    }
  }

  async storeContact(contactData: any) {
    try {
      GlobalService.ShowSweetLoading();
      const contact: any = await this.contactService.store(contactData);
      GlobalService.SwalCreateItem();
      this.reload++;
      this.closeModal();
      /*  GlobalService.CloseSweet(); */
    } catch (error) {
      console.error("error", error);
      GlobalService.CloseSweet();
    }
  }

  async updateContact(id, contactData: any) {
    try {
      GlobalService.ShowSweetLoading();
      const contact: any = await this.contactService.update(id, contactData);
      GlobalService.SwalUpdateItem();
      this.reload++;
    } catch (error) {
      console.error("error", error);
      GlobalService.CloseSweet();
    }
  }

  async deleteContact(id) {
    try {
      GlobalService.ShowSweetLoading();
      const contact: any = await this.contactService.delete(id);
      GlobalService.SwalDeleteItem();
      this.reload++;
    } catch (error) {
      console.error("error", error);
      GlobalService.CloseSweet();
    }
  }
 
}
