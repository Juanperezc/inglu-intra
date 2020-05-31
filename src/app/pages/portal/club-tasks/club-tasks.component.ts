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
import { ClubTaskItemService } from "../../../services/http/ClubTaskItemService.service";
import { FileService } from "../../../services/http/FileService.service";
import { ClubTaskService } from "../../../services/http/ClubTaskService.service";

@Component({
  selector: "club-tasks-component",
  templateUrl: "./club-tasks.component.html",
  styleUrls: ["./club-tasks.component.scss"],
})
export class PageClubTaskComponent extends BasePageComponent
  implements OnInit, OnDestroy {
  @ViewChild("modalBody") modalBody: ElementRef<any>;
  @ViewChild("modalFooter") modalFooter: ElementRef<any>;

  data: any[];
  categoriesOption: Array<IOption> = new Array<IOption>();
  clubTaskForm: FormGroup;
  clubTaskItemForm: FormGroup;
  statuses: Array<IOption>;
  currentPhoto: string | ArrayBuffer;
  reload: number = 1;
  defaultAvatar: string;
  /*   doctors: IUser[]; */
  headers: Array<ITableHeaders>;
  constructor(
    store: Store<IAppState>,
    httpSv: HttpService,
    private modal: TCModalService,
    private formBuilder: FormBuilder,
    private clubTaskItemService: ClubTaskItemService,
    private clubTaskService: ClubTaskService,
    private fileService: FileService
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
    this.headers = [
      {
        columnName: "img",
        columnTitle: "Imagen",
        iconClass: null,
        tcColor: null,
        tcFontSize: null,
        tcType: "img",
        tcActions: [],
      },
      {
        columnName: "title",
        columnTitle: "Titulo",
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
        formatter: (value) => {
          return  GlobalService.formatDate(value, "DD-MM-YYYY HH:mm");
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
      title: "Sección de tareas del club",
      breadcrumbs: [
        {
          title: "Portal",
          route: "default-dashboard",
        },
        {
          title: "Sección de tareas del club",
        },
      ],
    };

    /*  this.doctors = []; */
    this.defaultAvatar = "assets/content/avatar.jpeg";
    this.currentPhoto = this.defaultAvatar;
  }

  async loadClubTask() {
    try {
      GlobalService.ShowSweetLoading();
      const clubTeam: any = await this.clubTaskService.show(1);
      const dataClubTask = clubTeam.data;

      console.log(dataClubTask);
      GlobalService.CloseSweet();
      return dataClubTask;
    } catch (error) {
      console.error("error", error);
      GlobalService.CloseSweet();
    }
  }

  async ngOnInit() {
    /*  await this.loadCategories(); */
    super.ngOnInit();
    const data = await this.loadClubTask();
    this.initFormTeam(data);
    this.initForm(null);
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

  // close modal window
  closeModal() {
    this.modal.close();
    this.clubTaskItemForm.reset();
  }
  createTaskItem() {
    this.currentPhoto = null;
    this.openModal(this.modalBody, "Agregar imagen", this.modalFooter);
  }
  async handleActionEmit(event: IHandleAction) {
    console.log("emit", event);
    const row = event.row;
    const type = event.type;
    switch (type) {
      case "edit": {
        this.edit(row);
        break;
      }
      case "remove": {
        const result = await GlobalService.AlertDelete();
        if (result.value) {
          this.deleteTaskItem(row.id);
        }
        break;
      }
    }
  }

  async onFileChanged(inputValue: any) {
    let file: File = inputValue.target.files[0];
    console.log(file);
    /*  let reader: FileReader = new FileReader(); */
    try {
      GlobalService.ShowSweetLoading();
      console.log("test");
      const service: any = await this.fileService.upload_file(
        file,
        "image/portal"
      );
      console.log(service);
      GlobalService.CloseSweet();

      this.currentPhoto = service.urlFinal;
      this.clubTaskItemForm.controls["img"].setValue(service.urlFinal);
    } catch (error) {
      console.error("error", error);
      GlobalService.CloseSweet();
    }
  }
  // init form
  initFormTeam(data: any) {
    this.clubTaskForm = this.formBuilder.group({
      id: [data ? data.id : null],
      title: [data ? data.title : null],
      subtitle: [data ? data.subtitle : null],
    });
  }
  initForm(data: any) {
    this.clubTaskItemForm = this.formBuilder.group({
      id: [data ? data.id : null],
      img: [data ? data.img : null],
      title: [data ? data.title : null],
      description: [data ? data.description : null],
      site_h_work_id: [1],
    });
  }

  // upload new file

  // edit appointment
  edit(row: any) {
    this.openModal(this.modalBody, "Editar Sugerencia", this.modalFooter, row);
  }

  async saveData(form: FormGroup) {
    if (form.valid) {
      const clubTeamData  = form.value;
      const id = clubTeamData.id;
   
    
/*       console.log(this.clubTaskForm); */
      if (id){
        //update
        await this.updateClubTask(id, clubTeamData);
      }else{
      
        //save
      }
      
     /*  this.changes = false; */
    }
  }

  async updateClubTask(id,data){
    try {
      GlobalService.ShowSweetLoading();
      const user: any = await this.clubTaskService.update(id,data);
      const dataUser = user.data;
      GlobalService.SwalUpdateItem();
     /*  GlobalService.CloseSweet(); */
    } catch (error) {
      console.error('error', error)
      GlobalService.CloseSweet();
    } 
  }
  async saveTaskItem(form: FormGroup) {
    if (form.valid) {
      let imageItem: any = form.value;
      if (imageItem.id == null) {
        delete imageItem.id;
        await this.storeTaskItem(imageItem);
      }
      console.log(imageItem);
      this.closeModal();
    }
  }
  async storeTaskItem(imageItemData: any) {
    try {
      GlobalService.ShowSweetLoading();
      const imageItem: any = await this.clubTaskItemService.store(
        imageItemData
      );
      GlobalService.SwalCreateItem();
      this.reload++;
      /*  GlobalService.CloseSweet(); */
    } catch (error) {
      console.error("error", error);
      GlobalService.CloseSweet();
    }
  }
  async deleteTaskItem(id) {
    try {
      GlobalService.ShowSweetLoading();
      const imageItem: any = await this.clubTaskItemService.delete(id);
      GlobalService.SwalDeleteItem();
      this.reload++;
    } catch (error) {
      console.error("error", error);
      GlobalService.CloseSweet();
    }
  }
}
