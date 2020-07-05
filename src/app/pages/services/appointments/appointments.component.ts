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
import { AppointmentService } from "../../../services/http/AppointmentService.service";
import { Router } from "@angular/router";
import { UserService } from "../../../services/http/UserService.service";
import { TreatmentService } from "../../../services/http/TreatmentService.service";

@Component({
  selector: "appointments-component",
  templateUrl: "./appointments.component.html",
  styleUrls: ["./appointments.component.scss"],
})
export class PageAppointmentsComponent extends BasePageComponent
  implements OnInit, OnDestroy {
  @ViewChild("modalBody") modalBody: ElementRef<any>;
  @ViewChild("modalFooter") modalFooter: ElementRef<any>;

  @ViewChild("modalBodyTreatment") modalBodyTreatment: ElementRef<any>;
  @ViewChild("modalFooterTreatment") modalFooterTreatment: ElementRef<any>;

  data: any[];
  categoriesOption: Array<IOption> = new Array<IOption>();
  appointmentForm: FormGroup;
  treatmentForm: FormGroup;
  statuses: Array<IOption>;
  patients: Array<IOption>;
  doctors: Array<IOption>;
  workspaces: Array<IOption>;
  currentPhoto: string | ArrayBuffer;
  reload: number = 1;
  defaultAvatar: string;
  headers: Array<ITableHeaders>;
  minDate: any;
  constructor(
    store: Store<IAppState>,
    httpSv: HttpService,
    private modal: TCModalService,
    private router: Router,
    private formBuilder: FormBuilder,
    private appointmentService: AppointmentService,
    private userService: UserService,
    private treatmentService: TreatmentService
  ) {
    super(store, httpSv);
    this.statuses = new Array<IOption>();
    this.patients = new Array<IOption>();
    this.doctors = new Array<IOption>();
    this.workspaces = new Array<IOption>();

    this.statuses.push({
      label: "Pendiente",
      value: "0",
    });
    this.statuses.push({
      label: "Agendado",
      value: "1",
    });
    this.statuses.push({
      label: "Cancelado",
      value: "2",
    });
    this.statuses.push({
      label: "Culminado",
      value: "3",
    });
    this.headers = [
      {
        columnName: "photo",
        columnTitle: "Foto",
        iconClass: null,
        tcColor: null,
        tcFontSize: null,
        tcType: "img",
        tcActions: [],
      },
      {
        columnName: "patient",
        columnTitle: "Paciente",
        iconClass: null,
        tcColor: null,
        tcFontSize: null,
        tcType: "text",
        tcActions: [],
      },
      {
        columnName: "patient_id",
        columnTitle: "Tipo",
        formatter: (value) => {
          return value ? "Estándar" : "Contacto"
        },
        iconClass: null,
        tcColor: null,
        tcFontSize: null,
        tcType: "text",
        tcActions: [],
      },
      {
        columnName: "date",
        formatter: (value) => {
          return GlobalService.formatDate(value, "DD-MM-YYYY HH:mm");
        },
        columnTitle: "Fecha",
        iconClass: null,
        tcColor: null,
        tcFontSize: null,
        tcType: "text",
        tcActions: [],
      },
      {
        columnName: "doctor",
        columnTitle: "Medico",
        iconClass: null,
        tcColor: null,
        tcFontSize: null,
        tcType: "text",
        tcActions: [],
      },
      {
        columnName: "condition",
        columnTitle: "Condicion",
        iconClass: null,
        tcColor: null,
        tcFontSize: null,
        tcType: "text",
        tcActions: [],
      },
      {
        columnName: "status",
        columnTitle: "Estatus",
        iconClass: "appointment_event",
        tcColor: null,
        tcFontSize: null,
        tcType: "badge",
        tcActions: [],
      },
      {
        columnName: "updated_at",
        columnTitle: "Ultima actualización",
        formatter: (value) => {
          return GlobalService.formatDate(value, "DD-MM-YYYY HH:mm");
        },
        iconClass: null,
        tcColor: null,
        tcFontSize: null,
        tcType: "text",
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
            afterIcon: "icofont-page",
            view: "warning",
            size: "sm",
            handleClick: "treatment",
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
          },
        ],
      },
    ];

    this.pageData = {
      loaded: true,
      title: "Citas medicas",
      breadcrumbs: [
        {
          title: "Servicios",
          route: "default-dashboard",
        },
        {
          title: "Citas medicas",
        },
      ],
    };
    this.defaultAvatar = "assets/content/avatar.jpeg";
    this.currentPhoto = this.defaultAvatar;
  }

  async ngOnInit() {
    this.minDate = new Date();
    super.ngOnInit();
    await this.loadPatients();
    await this.loadDoctors();
    this.initForm(null);
    this.getData("assets/data/appointments.json", "data", "setLoaded");
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }
  addPatientModal() {
    this.openModalAppointment(this.modalBody, "Crear cita", this.modalFooter);
  }

  // open modal window
  async openModalAppointment(
    body: any,
    header: any = null,
    footer: any = null,
    data: any = null
  ) {
    if (data && data.medical_staff_id) {
      await this.loadWorkspaces(data.medical_staff_id);
    }
    this.initForm(data);
    this.modal.open({
      body: body,
      header: header,
      footer: footer,
    });
  }

  // open modal window
  async openModalTreatment(
    body: any,
    header: any = null,
    footer: any = null,
    data: any = null
  ) {
    this.initFormTreatment(null);
    this.initFormTreatment(data);
    this.modal.open({
      body: body,
      header: header,
      footer: footer,
    });
  }
  // closeModalWindow
  closeModal() {
    this.modal.close();
    this.appointmentForm.reset();
  }
  // closeModalWindow
  closeModalTreatment() {
    this.modal.close();
    this.treatmentForm.reset();
  }

  createAppointment() {
    this.router.navigateByUrl("/vertical/create-appointment");
  }

  async handleActionEmit(event: IHandleAction) {
    console.log("emit", event);
    const row = event.row;
    const type = event.type;
    switch (type) {
      case "edit": {
        this.editAppointment(row);
        break;
      }
      case "remove": {
        const result = await GlobalService.AlertDelete();
        if (result.value) {
          this.deleteAppointment(row.id);
        }
        break;
      }
      case "treatment": {
        //cargar tratamiento
        let dataTreatment = await this.loadTreatment(row.id);
        if (dataTreatment == null) {
          dataTreatment = { appointment_id: row.id };
        }

        await this.openModalTreatment(
          this.modalBodyTreatment,
          "Observaciones de la cita",
          this.modalFooterTreatment,
          dataTreatment
        );

        break;
      }
    }
  }

  // initForm
  async initForm(data: any) {
    if (data == null) {
      this.workspaces = new Array<IOption>();
    }
    /*  if (data && data.medical_staff_id){
     await this.loadWorkspaces(data.medical_staff_id);
    } */
    console.log("data", data);

    this.appointmentForm = this.formBuilder.group({
      id: [data ? data.id : null],
      condition: [data ? data.condition : ""],
      date: [
        data
          ? GlobalService.formatDate(data.date.toString(), "YYYY-MM-DD HH:mm")
          : "",
      ],
      patient_id: [data ? data.patient_id.toString() : ""],
      medical_staff_id: [data ? data.medical_staff_id.toString() : ""],
      user_workspace_id: [
        data && data.user_workspace_id ? data.user_workspace_id.toString() : "",
      ],
      status: [data ? data.status.toString() : ""],
    });
    console.log("this.appointmentForm", this.appointmentForm);
  }

  // initForm
  async initFormTreatment(data: any) {
    this.treatmentForm = this.formBuilder.group({
      id: [data && data.id ? data.id : null],
      condition: [data && data.condition ? data.condition : ""],
      appointment_id: [data && data.appointment_id ? data.appointment_id : ""],
      description: [data && data.description ? data.description : ""],
      medicine: [data && data.medicine ? data.medicine : ""],
    });
    console.log("this.appointmentForm", this.appointmentForm);
  }

  async handleMedicSelected(event) {
    await this.loadWorkspaces(event);
    console.log(event);
  }

  //loadTreatment
  async loadTreatment(appointment_id) {
    try {
      GlobalService.ShowSweetLoading();
      const treatment: any = await this.appointmentService.show_treatment(
        appointment_id
      );
      const treatmentData = treatment.data;
      console.log(treatmentData);
      GlobalService.CloseSweet();
      return treatmentData;
    } catch (error) {
      console.error("error", error);
      GlobalService.CloseSweet();
    }
  }
  //loadPatients
  async loadPatients() {
    try {
      GlobalService.ShowSweetLoading();
      const patients: any = await this.userService.index_patient();
      const dataPatients = patients.data;
      if (dataPatients) {
        dataPatients.forEach((patient) => {
          this.patients.push({
            label: patient.name + " " + patient.last_name,
            value: patient.id.toString(),
          });
        });
      }
      console.log(dataPatients);
      GlobalService.CloseSweet();
    } catch (error) {
      console.error("error", error);
      GlobalService.CloseSweet();
    }
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
      this.modalBody,
      "Editar cita",
      this.modalFooter,
      row
    );
  }

  async createUser(form: FormGroup) {
    if (form.valid) {
    }
  }
  async saveTreatment(form: FormGroup) {
    if (form.valid) {
      let treatment: any = form.value;
      console.log("treatmentForm", treatment);
      if (treatment.id == null) {
        delete treatment.id;
        await this.storeTreatment(treatment);
      } else {
        const id = treatment.id;
        delete treatment.id;
        await this.updateTreatment(id, treatment);
      }
      console.log(treatment);
      /*   this.closeModal(); */
    }
  }
  async saveAppointment(form: FormGroup) {
    if (form.valid) {
      let appointment: any = form.value;
      if (appointment.id == null) {
        delete appointment.id;
        await this.storeAppointment(appointment);
      } else {
        const id = appointment.id;
        delete appointment.id;
        await this.updateAppointment(id, appointment);
      }
      console.log(appointment);
      /*   this.closeModal(); */
    }
  }
  async storeTreatment(treatmentData: any) {
    try {
      GlobalService.ShowSweetLoading();
      const treatment: any = await this.treatmentService.store(treatmentData);
      GlobalService.SwalCreateItem();
      this.closeModal();
      this.reload++;
      /*  GlobalService.CloseSweet(); */
    } catch (error) {
      console.error("error", error);
      GlobalService.CloseSweet();
      if (error.status == 430) {
      }
      if (error.status != 422) {
        this.closeModal();
      }
    }
  }

  async storeAppointment(appointmentData: any) {
    try {
      GlobalService.ShowSweetLoading();
      const appointment: any = await this.appointmentService.store(
        appointmentData
      );
      GlobalService.SwalCreateItem();
      this.closeModal();
      this.reload++;
      /*  GlobalService.CloseSweet(); */
    } catch (error) {
      console.error("error", error);
      GlobalService.CloseSweet();
      if (error.status != 422) {
        this.closeModal();
      }
    }
  }
  async deleteAppointment(id) {
    try {
      GlobalService.ShowSweetLoading();
      const appointment: any = await this.appointmentService.delete(id);
      GlobalService.SwalDeleteItem();
      this.reload++;
    } catch (error) {
      console.error("error", error);
      GlobalService.CloseSweet();
    }
  }
  async updateTreatment(id, treatmentData: any) {
    try {
      GlobalService.ShowSweetLoading();
      const treatment: any = await this.treatmentService.update(
        id,
        treatmentData
      );
      GlobalService.SwalUpdateItem();
      this.reload++;
    } catch (error) {
      console.error("error", error);
      GlobalService.CloseSweet();
    }
  }
  async updateAppointment(id, appointmentData: any) {
    try {
      GlobalService.ShowSweetLoading();
      const appointment: any = await this.appointmentService.update(
        id,
        appointmentData
      );
      GlobalService.SwalUpdateItem();
      this.reload++;
    } catch (error) {
      console.error("error", error);
      GlobalService.CloseSweet();
    }
  }
}
