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
import { ClubImageItemService } from "../../../services/http/ClubImageItemService.service";
import { FileService } from "../../../services/http/FileService.service";
import { ClubImageService } from "../../../services/http/ClubImageService.service";

@Component({
  selector: "club-images-component",
  templateUrl: "./club-images.component.html",
  styleUrls: ["./club-images.component.scss"],
})
export class PageClubImageComponent extends BasePageComponent
  implements OnInit, OnDestroy {
  @ViewChild("modalBody") modalBody: ElementRef<any>;
  @ViewChild("modalFooter") modalFooter: ElementRef<any>;

  data: any[];
  categoriesOption: Array<IOption> = new Array<IOption>();
  clubImagesForm: FormGroup;
  clubImageItemForm: FormGroup;
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
    private clubImageItemService: ClubImageItemService,
    private clubImageService: ClubImageService,
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
      title: "Sección de imagenes",
      breadcrumbs: [
        {
          title: "Portal",
          route: "default-dashboard",
        },
        {
          title: "Sección de imagenes",
        },
      ],
    };

    /*  this.doctors = []; */
    this.defaultAvatar = "assets/content/avatar.jpeg";
    this.currentPhoto = this.defaultAvatar;
  }

  async loadClubImage() {
    try {
      GlobalService.ShowSweetLoading();
      const clubTeam: any = await this.clubImageService.show(1);
      const dataClubImage = clubTeam.data;

      console.log(dataClubImage);
      GlobalService.CloseSweet();
      return dataClubImage;
    } catch (error) {
      console.error("error", error);
      GlobalService.CloseSweet();
    }
  }

  async ngOnInit() {
    /*  await this.loadCategories(); */
    super.ngOnInit();
    const data = await this.loadClubImage();
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
    this.clubImageItemForm.reset();
  }
  createImageItem() {
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
          this.deleteImageItem(row.id);
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
      this.clubImageItemForm.controls["img"].setValue(service.urlFinal);
    } catch (error) {
      console.error("error", error);
      GlobalService.CloseSweet();
    }
  }
  // init form
  initFormTeam(data: any) {
    this.clubImagesForm = this.formBuilder.group({
      id: [data ? data.id : null],
      title: [data ? data.title : null],
      subtitle: [data ? data.subtitle : null],
    });
  }
  initForm(data: any) {
    this.clubImageItemForm = this.formBuilder.group({
      id: [data ? data.id : null],
      img: [data ? data.img : null],
      description: [data ? data.description : null],
      site_image_id: [1],
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
   
    
/*       console.log(this.clubImagesForm); */
      if (id){
        //update
        await this.updateClubImage(id, clubTeamData);
      }else{
      
        //save
      }
      
     /*  this.changes = false; */
    }
  }

  async updateClubImage(id,data){
    try {
      GlobalService.ShowSweetLoading();
      const user: any = await this.clubImageService.update(id,data);
      const dataUser = user.data;
      GlobalService.SwalUpdateItem();
     /*  GlobalService.CloseSweet(); */
    } catch (error) {
      console.error('error', error)
      GlobalService.CloseSweet();
    } 
  }
  async saveImageItem(form: FormGroup) {
    if (form.valid) {
      let imageItem: any = form.value;
      if (imageItem.id == null) {
        delete imageItem.id;
        await this.storeImageItem(imageItem);
      }
      console.log(imageItem);
      this.closeModal();
    }
  }
  async storeImageItem(imageItemData: any) {
    try {
      GlobalService.ShowSweetLoading();
      const imageItem: any = await this.clubImageItemService.store(
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
  async deleteImageItem(id) {
    try {
      GlobalService.ShowSweetLoading();
      const imageItem: any = await this.clubImageItemService.delete(id);
      GlobalService.SwalDeleteItem();
      this.reload++;
    } catch (error) {
      console.error("error", error);
      GlobalService.CloseSweet();
    }
  }
}
