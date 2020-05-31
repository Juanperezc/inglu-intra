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
import { ClubTeamImageservice } from "../../../services/http/ClubTeamImageService.service";
import { FileService } from "../../../services/http/FileService.service";
import { ClubTeamService } from "../../../services/http/ClubTeamService.service";

@Component({
  selector: "club-team-component",
  templateUrl: "./club-team.component.html",
  styleUrls: ["./club-team.component.scss"],
})
export class PageClubTeamComponent extends BasePageComponent
  implements OnInit, OnDestroy {
  @ViewChild("modalBody") modalBody: ElementRef<any>;
  @ViewChild("modalFooter") modalFooter: ElementRef<any>;

  data: any[];
  categoriesOption: Array<IOption> = new Array<IOption>();
  clubTeamForm: FormGroup;
  teamImageForm: FormGroup;
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
    private clubTeamImageService: ClubTeamImageservice,
    private clubTeamService: ClubTeamService,
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
        columnName: "name",
        columnTitle: "Nombre",
        iconClass: null,
        tcColor: null,
        tcFontSize: null,
        tcType: "text",
        tcActions: [],
      },
      {
        columnName: "role",
        columnTitle: "Rol",
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
      title: "Sección de equipo",
      breadcrumbs: [
        {
          title: "Portal",
          route: "default-dashboard",
        },
        {
          title: "Sección de equipo",
        },
      ],
    };

    /*  this.doctors = []; */
    this.defaultAvatar = "assets/content/avatar.jpeg";
    this.currentPhoto = this.defaultAvatar;
  }

  async loadClubTeam() {
    try {
      GlobalService.ShowSweetLoading();
      const clubTeam: any = await this.clubTeamService.show(1);
      const dataClubTeam = clubTeam.data;

      console.log(dataClubTeam);
      GlobalService.CloseSweet();
      return dataClubTeam;
    } catch (error) {
      console.error("error", error);
      GlobalService.CloseSweet();
    }
  }

  async ngOnInit() {
    /*  await this.loadCategories(); */
    super.ngOnInit();
    const data = await this.loadClubTeam();
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
    this.teamImageForm.reset();
  }
  createTeamImage() {
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
          this.deleteTeamImage(row.id);
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
      this.teamImageForm.controls["img"].setValue(service.urlFinal);
    } catch (error) {
      console.error("error", error);
      GlobalService.CloseSweet();
    }
  }
  // init form
  initFormTeam(data: any) {
    this.clubTeamForm = this.formBuilder.group({
      id: [data ? data.id : null],
      title: [data ? data.title : null],
      subtitle: [data ? data.subtitle : null],
    });
  }
  initForm(data: any) {
    this.teamImageForm = this.formBuilder.group({
      id: [data ? data.id : null],
      img: [data ? data.img : null],
      name: [data ? data.name : null],
      role: [data ? data.role : null],
      site_team_id: [1],
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
   
    
/*       console.log(this.clubTeamForm); */
      if (id){
        //update
        await this.updateClubTeam(id, clubTeamData);
      }else{
      
        //save
      }
      
     /*  this.changes = false; */
    }
  }

  async updateClubTeam(id,data){
    try {
      GlobalService.ShowSweetLoading();
      const user: any = await this.clubTeamService.update(id,data);
      const dataUser = user.data;
      GlobalService.SwalUpdateItem();
     /*  GlobalService.CloseSweet(); */
    } catch (error) {
      console.error('error', error)
      GlobalService.CloseSweet();
    } 
  }
  async saveTeamImage(form: FormGroup) {
    if (form.valid) {
      let teamImage: any = form.value;
      if (teamImage.id == null) {
        delete teamImage.id;
        await this.storeTeamImage(teamImage);
      }

      /*   teamImage.img = this.currentPhoto; */

      console.log(teamImage);
      this.closeModal();
    }
  }
  async storeTeamImage(teamImageData: any) {
    try {
      GlobalService.ShowSweetLoading();
      const teamImage: any = await this.clubTeamImageService.store(
        teamImageData
      );
      GlobalService.SwalCreateItem();
      this.reload++;
      /*  GlobalService.CloseSweet(); */
    } catch (error) {
      console.error("error", error);
      GlobalService.CloseSweet();
    }
  }
  async deleteTeamImage(id) {
    try {
      GlobalService.ShowSweetLoading();
      const teamImage: any = await this.clubTeamImageService.delete(id);
      GlobalService.SwalDeleteItem();
      this.reload++;
    } catch (error) {
      console.error("error", error);
      GlobalService.CloseSweet();
    }
  }
}
