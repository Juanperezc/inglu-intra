import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { BasePageComponent } from "../../../base-page";
import { Store } from "@ngrx/store";
import { IAppState } from "../../../../interfaces/app-state";
import { HttpService } from "../../../../services/http/http.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { IOption } from "../../../../ui/interfaces/option";
import { UserStorage } from "../../../../services/util/UserStorage.service";
import { GlobalService } from "../../../../services/util/GlobalService.service";
import { FileService } from "../../../../services/http/FileService.service";
import { UserService } from "../../../../services/http/UserService.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { IHandleAction } from "../../../../interfaces/handle-action";
import { ITableHeaders } from "../../../../interfaces/table-headers";
import { TCModalService } from "../../../../ui/services/modal/modal.service";
import { SpecialtyService } from "../../../../services/http/SpecialtyService.service";
import { WorkspaceService } from "../../../../services/http/WorkspaceService.service";

@Component({
  selector: "page-account",
  templateUrl: "./account.component.html",
  styleUrls: ["./account.component.scss"],
})
export class PageAccountComponent extends BasePageComponent
  implements OnInit, OnDestroy {
  @ViewChild("modalBodySpecialty") modalBodySpecialty: ElementRef<any>;
  @ViewChild("modalFooterSpecialty") modalFooterSpecialty: ElementRef<any>;
  @ViewChild("modalBodyWorkspace") modalBodyWorkspace: ElementRef<any>;
  @ViewChild("modalFooterWorkspace") modalFooterWorkspace: ElementRef<any>;

  id: number | string;
  public user: any;
  headerAppointments = [];
  selectedCars = [3];
  pathologies = [];
  title: string = null;
  userMedicalInfo: any;
  userInfo: any;
  userInfoMock: any;
  reloadSpecialty: number = 1;
  reloadWorkspace: number = 1;
  editMe: boolean = false;
  editPatient: boolean = false;
  editDoctor: boolean = false;
  createMedic: boolean = false;
  createPatient: boolean = false;
  passwordForm: FormGroup;
  userForm: FormGroup;
  userMedicalForm: FormGroup;
  gender: IOption[];
  status: IOption[];
  blood_types: IOption[];
  days: IOption[];
  specialties: Array<IOption> = new Array<IOption>();
  headersSpecialty: Array<ITableHeaders>;
  headersWorkspace: Array<ITableHeaders>;
  currentAvatar: string | ArrayBuffer;
  defaultAvatar: string;
  changes: boolean;
  userSpecialtyForm: FormGroup;
  userWorkspaceForm: FormGroup;
  max: any;
  constructor(
    store: Store<IAppState>,
    httpSv: HttpService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fileService: FileService,
    private userService: UserService,
    private specialtyService: SpecialtyService,
    private workspaceService: WorkspaceService,
    private toastr: ToastrService,
    private modal: TCModalService,
    private formBuilder: FormBuilder
  ) {
    super(store, httpSv);

    this.headerAppointments = [
      {
        columnName: "patient_id",
        columnTitle: "Tipo",
        formatter: (value) => {
          return value != 0 ? "Estándar" : "Contacto";
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
        columnName: "treatment_medicine",
        columnTitle: "Tratamiento",
        iconClass: null,
        tcColor: null,
        tcFontSize: null,
        tcType: "text",
        tcActions: [],
      },
      {
        columnName: "treatment_description",
        columnTitle: "Observaciones",
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
    ];

    
    const lastRoute =
      this.activatedRoute.snapshot &&
      this.activatedRoute.snapshot.url &&
      this.activatedRoute.snapshot.url[0].path;
      this.id =
      this.activatedRoute.snapshot &&
      this.activatedRoute.snapshot.params &&
      this.activatedRoute.snapshot.params["id"];
    /*  this.bankName =  */

    /*  console.log('bank',  this.activatedRoute.snapshot.params['bank']); */
    switch (lastRoute) {
      case "edit-account": {
        this.title = "Editar cuenta";
        this.editMe = true;
        break;
      }
      case "patient-account": {
        this.title = "Editar paciente";
        this.editPatient = true;
        break;
      }
      case "doctor-account": {
        this.title = "Editar medico";
        this.editDoctor = true;
        break;
      }
      case "create-doctor": {
        this.title = "Crear medico";
        this.createMedic = true;
        break;
      }
      case "create-patient": {
        this.title = "Crear paciente";
        this.createPatient = true;
        break;
      }
    }
    this.reloadPageData();
    this.days = [
      {
        label: "Domingo",
        value: "Sunday",
      },
      {
        label: "Lunes",
        value: "Monday",
      },
      {
        label: "Martes",
        value: "Tuesday",
      },
      {
        label: "Miercoles",
        value: "Wednesday",
      },
      {
        label: "Jueves",
        value: "Thursday",
      },
      {
        label: "Viernes",
        value: "Friday",
      },
      {
        label: "Sabado",
        value: "Saturday",
      },
    ];
    this.gender = [
      {
        label: "Masculino",
        value: "male",
      },
      {
        label: "Femenino",
        value: "female",
      },
    ];
    this.status = [
      {
        label: "Activo",
        value: "1",
      },
      {
        label: "Desactivado",
        value: "2",
      },
    ];
    /* 
     "A+",
        "A-",
        "B+",
        "B-",
        "AB+",
        "AB-",
        "OB+",
        "OB-"*/
    this.blood_types = [
      {
        label: "A+",
        value: "A+",
      },
      {
        label: "A-",
        value: "A-",
      },
      {
        label: "B+",
        value: "B+",
      },
      {
        label: "B-",
        value: "B-",
      },
      {
        label: "AB+",
        value: "AB+",
      },
      {
        label: "AB-",
        value: "AB-",
      },
    ];
    this.headersSpecialty = [
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
        columnName: "description",
        columnTitle: "Descripcion",
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
        columnName: "actions",
        columnTitle: "Acciones",
        iconClass: null,
        tcColor: null,
        tcFontSize: null,
        tcType: "actions",
        tcActions: [
          {
            afterIcon: "icofont-ui-delete",
            view: "error",
            size: "sm",
            handleClick: "remove",
          },
        ],
      },
    ];
    this.headersWorkspace = [
      {
        columnName: "specialty",
        columnTitle: "Departamento",
        iconClass: null,
        tcColor: null,
        tcFontSize: null,
        tcType: "text",
        tcActions: [],
      },
      {
        columnName: "location",
        columnTitle: "Ubicacion",
        iconClass: null,
        tcColor: null,
        tcFontSize: null,
        tcType: "text",
        tcActions: [],
      },
      {
        columnName: "start_time",
        columnTitle: "Inicio",
        iconClass: null,
        tcColor: null,
        tcFontSize: null,
        tcType: "text",
        tcActions: [],
      },
      {
        columnName: "end_time",
        columnTitle: "Fin",
        iconClass: null,
        tcColor: null,
        tcFontSize: null,
        tcType: "text",
        tcActions: [],
      },
      {
        columnName: "day",
        columnTitle: "Dia",
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
        columnName: "actions",
        columnTitle: "Acciones",
        iconClass: null,
        tcColor: null,
        tcFontSize: null,
        tcType: "actions",
        tcActions: [
          {
            afterIcon: "icofont-ui-delete",
            view: "error",
            size: "sm",
            handleClick: "remove",
          },
        ],
      },
    ];
    this.defaultAvatar = "assets/content/avatar.jpeg";
    /*     this.currentAvatar = this.defaultAvatar; */
    this.changes = false;
  }
  closeModalSpecialty() {
    this.modal.close();
    this.userSpecialtyForm.reset();
  }

  closeModalWorkspace() {
    this.modal.close();
    this.userWorkspaceForm.reset();
  }

  addSpecialty() {
    this.openModalUserSpecialty(
      this.modalBodySpecialty,
      "Agregar especialidad",
      this.modalFooterSpecialty
    );
  }
  addWorkspace() {
    this.openModalUserWorkspace(
      this.modalBodyWorkspace,
      "Agregar lugar de trabajo",
      this.modalFooterWorkspace
    );
  }
  openModalUserSpecialty(
    body: any,
    header: any = null,
    footer: any = null,
    data: any = null
  ) {
    this.initFormUserSpecialty(data);
    this.modal.open({
      body: body,
      header: header,
      footer: footer,
    });
  }

  openModalUserWorkspace(
    body: any,
    header: any = null,
    footer: any = null,
    data: any = null
  ) {
    this.initFormUserWorkspace(data);
    this.modal.open({
      body: body,
      header: header,
      footer: footer,
    });
  }
  initFormUserSpecialty(data: any) {
    this.userSpecialtyForm = this.formBuilder.group({
      id: [data ? data.id : null],
      specialty: [data ? data.specialty : "", Validators.required],
    });
    console.log("initForm", this.userSpecialtyForm);
  }
  initFormUserWorkspace(data: any) {
    this.userWorkspaceForm = this.formBuilder.group({
      id: [data ? data.id : null],
      specialty: [data ? data.specialty : "", null],
      location: [data ? data.location : "", null],
      start_time: [data ? data.start_time : "", null],
      end_time: [data ? data.end_time : "", null],
      day: [data ? data.day : "", null],
    });
    console.log("initForm", this.userWorkspaceForm);
  }
  reloadPageData() {
    this.pageData = {
      title: this.title,
      loaded: true,
      breadcrumbs: [
        {
          title: "Servicios",
          route: "default-dashboard",
        },
        {
          title: this.title,
        },
      ],
    };
    super.ngOnInit();
  }
  async ngOnInit() {
    this.max = new Date();
    this.user =  await UserStorage.getUser();
    this.getData('assets/json/pathologies.json', 'pathologies', 'setLoaded');

    this.loadSpecialties();
    if (this.editMe) {
      this.userInfo = await UserStorage.getUser();
    } else if (this.editPatient || this.editDoctor) {
      this.userInfo = await this.loadUser(this.id);
      /*  if (editPatient){ */
      this.userMedicalInfo = await this.loadMecialDataUser(this.id);
      /*    } */

      console.log(this.userInfo);
    } else if (this.createMedic || this.createPatient) {
      this.userInfo = null;
    }
    this.initFormUserSpecialty(null);
    this.initFormUserWorkspace(null);
    this.getData(
      "assets/data/account-data.json",
      "userInfoMock",
      "loadedDetect"
    );

    /* console.log("this.userInfo", this.userInfo) */
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  loadedDetect() {
    this.setLoaded();
    this.currentAvatar =
      this.userInfo && this.userInfo.profile_pic
        ? this.userInfo.profile_pic
        : this.defaultAvatar;
    this.initUserMedicalForm(this.userMedicalInfo);
    this.initUserForm(this.userInfo);
    this.initPasswordForm();
  }

  // init form
  initPasswordForm() {
    this.passwordForm = this.formBuilder.group({
      password: [null, this.editMe ? Validators.required : null],
      confirm_password: [null, Validators.required],
      new_password: [null, Validators.required],
    });
  }
  initUserForm(data: any) {
    console.log("data", data);

    this.userForm = this.formBuilder.group({
      id: [data && data.id ? data.id : null],
      name: [data && data.name, Validators.required],
      last_name: [data && data.last_name, Validators.required],
      id_card: [data && data.id_card, Validators.required],
      email: [data && data.email, Validators.required],
      profile_pic: [this.currentAvatar],
      date_of_birth: [data && data.date_of_birth, Validators.required],
      address: [data && data.address /* , Validators.required */],
      phone: [data && data.phone /* , Validators.required */],
      gender: [data && data.gender, Validators.required],
      status: [
        data && data.status && data.status.toString(),
        this.editPatient || this.editDoctor ? Validators.required : null,
      ],
    });
    if (!data) {
      this.activatedRoute.queryParamMap.subscribe((queryParamMap) => {
        this.userForm.controls["email"].setValue(queryParamMap.get("email"));
        this.userForm.controls["id_card"].setValue(
          queryParamMap.get("id_card")
        );
        this.userForm.controls["name"].setValue(queryParamMap.get("name"));
        this.userForm.controls["last_name"].setValue(
          queryParamMap.get("last_name")
        );
        this.userForm.controls["date_of_birth"].setValue(
          queryParamMap.get("date_of_birth")
        );
        this.userForm.controls["address"].setValue(
          queryParamMap.get("address")
        );
        this.userForm.controls["phone"].setValue(queryParamMap.get("phone"));
        if (queryParamMap.get("gender")) {
          if (queryParamMap.get("gender") == "Masculino") {
            this.userForm.controls["gender"].setValue("male");
          } else {
            this.userForm.controls["gender"].setValue("female");
          }
          this.changes = true;
        }
      });
    }
    /* */

    // detect form changes
    this.userForm.valueChanges.subscribe((t) => {
      /*    console.log('change',t) */
      this.changes = true;
    });
  }

  initUserMedicalForm(data: any) {
    console.log("data", data);
    this.userMedicalForm = this.formBuilder.group({
      blood_type: [data && data.blood_type],
    /*   patient_status: [data && data.patient_status], */
      pathologies: [data && data.pathologies],
      treatments: [data && data.treatments],
   /*    record: [data && data.record], */
    });
  }
  async loadSpecialties() {
    try {
      GlobalService.ShowSweetLoading();
      const specialties: any = await this.specialtyService.index();
      const dataSpecialties = specialties.data;
      if (dataSpecialties) {
        dataSpecialties.forEach((specialty) => {
          this.specialties.push({
            label: specialty.name,
            value: specialty.id.toString(),
          });
        });
      }
      console.log(dataSpecialties);
      GlobalService.CloseSweet();
    } catch (error) {
      console.error("error", error);
      GlobalService.CloseSweet();
    }
  }
  async loadMecialDataUser(id) {
    try {
      GlobalService.ShowSweetLoading();
      const user: any = await this.userService.show_medical_record(id);
      const dataUser = user.data;
      GlobalService.CloseSweet();
      return dataUser;
    } catch (error) {
      console.error("error", error);
      GlobalService.CloseSweet();
      return null;
    }
  }
  async loadUser(id) {
    try {
      GlobalService.ShowSweetLoading();
      const user: any = await this.userService.show(id);
      const dataUser = user.data;
      GlobalService.CloseSweet();
      return dataUser;
    } catch (error) {
      console.error("error", error);
      GlobalService.CloseSweet();
      return null;
    }
  }

  async handleActionEmitSpecialty(event: IHandleAction) {
    console.log("emit", event);
    const row = event.row;
    const type = event.type;
    switch (type) {
      case "remove": {
        const result = await GlobalService.AlertDelete();
        if (result.value) {
          const data = { specialty: row.id };
          this.deleteUserSpecialty(data);
          /*    this.deleteContact(row.id); */
        }
        break;
      }
    }
  }
  async handleActionEmitWorkspace(event: IHandleAction) {
    console.log("emit", event);
    const row = event.row;
    const type = event.type;
    switch (type) {
      case "remove": {
        const result = await GlobalService.AlertDelete();
        if (result.value) {
          const data = { user_workspace_id: row.id };
          this.deleteUserWorkspace(data);
          /*    this.deleteContact(row.id); */
        }
        break;
      }
    }
  }
  async updateUser(id, data) {
    try {
      GlobalService.ShowSweetLoading();
      const user: any = await this.userService.update(id, data);
      GlobalService.SwalUpdateItem();
      const dataUser = user.data;
      if (dataUser && this.editMe) UserStorage.setUser(dataUser);
      /*  GlobalService.CloseSweet(); */
    } catch (error) {
      console.error("error", error);
      GlobalService.CloseSweet();
    }
  }
  async updateMedicalUser(id, data) {
    try {
      GlobalService.ShowSweetLoading();
      const userMedical: any = await this.userService.update_medical_record(
        id,
        data
      );
      GlobalService.SwalUpdateItem();
      const dataUser = userMedical.data;
      console.log(dataUser);
      /*  GlobalService.CloseSweet(); */
    } catch (error) {
      console.error("error", error);
      GlobalService.CloseSweet();
    }
  }
  async storeUser(data) {
    try {
      GlobalService.ShowSweetLoading();
      const user: any = await this.userService.store(data);
      GlobalService.CloseSweet();
      GlobalService.SwalCreateItem();
      const dataUser = user.data;
      this.userInfo = dataUser;
      if (this.userInfo.type == 1) {
        this.router.navigateByUrl(
          "/vertical/patient-account/" + this.userInfo.id
        );
      } else if (this.userInfo.type == 2) {
        this.router.navigateByUrl(
          "/vertical/doctor-account/" + this.userInfo.id
        );
      }
      /*  GlobalService.CloseSweet(); */
    } catch (error) {
      console.error("error", error);
      GlobalService.CloseSweet();
    }
  }

  async deleteUserSpecialty(userSpecialtyData: any) {
    try {
      console.log(userSpecialtyData);
      GlobalService.ShowSweetLoading();
      const userSpecialty: any = await this.userService.delete_specialty(
        userSpecialtyData,
        this.id
      );
      GlobalService.SwalDeleteItem();
      this.reloadSpecialty++;
      /*  GlobalService.CloseSweet(); */
    } catch (error) {
      console.error("error", error);
      GlobalService.CloseSweet();
    }
  }

  async deleteUserWorkspace(userWorkspaceData: any) {
    try {
      console.log(userWorkspaceData);
      GlobalService.ShowSweetLoading();
      const userWorkspace: any = await this.userService.delete_workspace(
        userWorkspaceData,
        this.id
      );
      GlobalService.SwalDeleteItem();
      this.reloadWorkspace++;
      /*  GlobalService.CloseSweet(); */
    } catch (error) {
      console.error("error", error);
      GlobalService.CloseSweet();
    }
  }
  async storeUserSpecialty(userSpecialtyData: any) {
    try {
      GlobalService.ShowSweetLoading();
      const userSpecialty: any = await this.userService.store_specialty(
        userSpecialtyData,
        this.id
      );
      GlobalService.SwalCreateItem();
      this.reloadSpecialty++;
      /*  GlobalService.CloseSweet(); */
    } catch (error) {
      console.error("error", error);
      GlobalService.CloseSweet();
    }
  }

  async storeUserWorkspace(userWorkspaceData: any) {
    try {
      GlobalService.ShowSweetLoading();
      const userWorkspace: any = await this.userService.store_workspace(
        userWorkspaceData,
        this.id
      );
      GlobalService.SwalCreateItem();
      this.reloadWorkspace++;
      /*  GlobalService.CloseSweet(); */
    } catch (error) {
      console.error("error", error);
      GlobalService.CloseSweet();
    }
  }

  // save form data
  async saveUserSpecialty(form: FormGroup) {
    if (form.valid) {
      let userSpecialty: any = form.value;
      this.storeUserSpecialty(userSpecialty);

      console.log(userSpecialty);
      this.closeModalSpecialty();
    }
  }

  async saveUserWorkspace(form: FormGroup) {
    if (form.valid) {
      console.log("form", form.value);
      let formValue = form.value;
      const start_time = formValue.start_time.format("HH:mm");
      const end_time = formValue.end_time.format("HH:mm");
      console.log(start_time);
      if (
        formValue.start_time > formValue.end_time ||
        formValue.start_time == formValue.end_time
      ) {
        this.toastr.error("Los rangos de las fechas son invalidos", "Error");
      } else {
        formValue.start_time = start_time;
        formValue.end_time = end_time;
        let userWorkspace: any = formValue;
        this.storeUserWorkspace(userWorkspace);
        console.log(userWorkspace);
        this.closeModalSpecialty();
      }
      /*  */
    }
  }
  async saveMedicalData(form: FormGroup) {
    if (form.valid) {
      this.userMedicalInfo = form.value;
      console.log('userMedicalInfo: ', this.userMedicalInfo);
      await this.updateMedicalUser(this.userInfo.id, this.userMedicalInfo);
      
      /*  this.changes = false; */
    }
  }

  async saveData(form: FormGroup) {
    if (form.valid) {
      this.userInfo = form.value;
      const id = this.userInfo.id;
      this.userInfo.date_of_birth = this.userInfo.date_of_birth
        ? GlobalService.formatDate(this.userInfo.date_of_birth)
        : null;
      if (this.createPatient) {
        this.userInfo.type = 1;
      } else if (this.createMedic) {
        this.userInfo.type = 2;
      }
      /*       console.log(this.userInfo); */
      if (id) {
        //update
        await this.updateUser(id, this.userInfo);
      } else {
        await this.storeUser(this.userInfo);
        //save
      }
      /*  this.changes = false; */
    }
  }

  async changePassword(form: FormGroup) {
    console.log("change password");
    if (form.valid) {
      try {
        GlobalService.ShowSweetLoading();
        const user: any = await this.userService.change_password(
          form.value,
          this.id ? this.id : this.userInfo.id
        );
        GlobalService.SwalUpdateItem();
        const dataUser = user.data;
        if (dataUser) UserStorage.setUser(dataUser);
        /*  GlobalService.CloseSweet(); */
      } catch (error) {
        if (error.status == 422) {
          if (error.error && error.error.message == "Password does not match") {
            this.toastr.error(
              "Las contraseña suministrada es incorrecta",
              "Error"
            );
          }
        }
        console.error("error", error);
        GlobalService.CloseSweet();
      }
    }
  }
  // upload new file

  async onFileChanged(inputValue: any) {
    let file: File = inputValue.target.files[0];
    console.log(file);
    /*  let reader: FileReader = new FileReader(); */
    try {
      GlobalService.ShowSweetLoading();
      console.log("test");
      const service: any = await this.fileService.upload_file(
        file,
        "image/profile"
      );
      console.log(service);
      GlobalService.CloseSweet();

      /*   this.currentPhoto = service.urlFinal; */
      this.userForm.controls["profile_pic"].setValue(service.urlFinal);
    } catch (error) {
      console.error("error", error);
      GlobalService.CloseSweet();
    }
  }
}
