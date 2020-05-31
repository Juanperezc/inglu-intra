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
import { FileService } from "../../../services/http/FileService.service";
import { ClubInformationService } from "../../../services/http/ClubInformationService.service";

  @Component({
  selector: "club-information-component",
  templateUrl: "./club-information.component.html",
  styleUrls: ["./club-information.component.scss"],
})
export class PageClubInformationComponent extends BasePageComponent
  implements OnInit, OnDestroy {
  @ViewChild("modalBody") modalBody: ElementRef<any>;
  @ViewChild("modalFooter") modalFooter: ElementRef<any>;

  data: any[];
  categoriesOption: Array<IOption> = new Array<IOption>();
  clubInformationForm: FormGroup;
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
 
    private clubClubInformationService: ClubInformationService,
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
 

    this.pageData = {
      loaded: true,
      title: "Informacion del club",
      breadcrumbs: [
        {
          title: "Portal",
          route: "default-dashboard",
        },
        {
          title: "Informacion del club",
        },
      ],
    };

    /*  this.doctors = []; */
    this.defaultAvatar = "assets/content/avatar.jpeg";
    this.currentPhoto = this.defaultAvatar;
  }

  async loadInformation() {
    try {
      GlobalService.ShowSweetLoading();
      const clubTeam: any = await this.clubClubInformationService.show(1);
      const dataInformation = clubTeam.data;

      console.log(dataInformation);
      GlobalService.CloseSweet();
      return dataInformation;
    } catch (error) {
      console.error("error", error);
      GlobalService.CloseSweet();
    }
  }

  async ngOnInit() {
    /*  await this.loadCategories(); */
    super.ngOnInit();
    const data = await this.loadInformation();
    this.initFormInformation(data);
    this.getData("assets/data/appointments.json", "data", "setLoaded");
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }


  // close modal window



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
      this.clubInformationForm.controls["img"].setValue(service.urlFinal);
    } catch (error) {
      console.error("error", error);
      GlobalService.CloseSweet();
    }
  }
  // init form
  initFormInformation(data: any) {
    this.clubInformationForm = this.formBuilder.group({
      id: [data ? data.id : null],
      title: [data ? data.title : null],
      description: [data ? data.description : null],
      img: [data ? data.img : null],
    });
  }




  async saveData(form: FormGroup) {
    if (form.valid) {
      const clubInformationData  = form.value;
      const id = clubInformationData.id;
   
    
/*       console.log(this.clubInformationForm); */
      if (id){
        //update
        await this.updateInformation(id, clubInformationData);
      }else{
      
        //save
      }
      
     /*  this.changes = false; */
    }
  }

  async updateInformation(id,data){
    try {
      GlobalService.ShowSweetLoading();
      const information: any = await this.clubClubInformationService.update(id,data);
      const dataUser = information.data;
      GlobalService.SwalUpdateItem();
     /*  GlobalService.CloseSweet(); */
    } catch (error) {
      console.error('error', error)
      GlobalService.CloseSweet();
    } 
  }

 

}
