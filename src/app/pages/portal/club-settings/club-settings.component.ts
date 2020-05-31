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
import { ClubSettingsService } from "../../../services/http/ClubSettingsService.service";

  @Component({
  selector: "club-settings-component",
  templateUrl: "./club-settings.component.html",
  styleUrls: ["./club-settings.component.scss"],
})

export class PageClubSettingsComponent extends BasePageComponent
  implements OnInit, OnDestroy {
  @ViewChild("modalBody") modalBody: ElementRef<any>;
  @ViewChild("modalFooter") modalFooter: ElementRef<any>;

  data: any[];
  categoriesOption: Array<IOption> = new Array<IOption>();
  clubSettingsForm: FormGroup;
  statuses: Array<IOption>;
  currentPhoto: string | ArrayBuffer;
  reload: number = 1;
  defaultAvatar: string;
 
  headers: Array<ITableHeaders>;
  constructor(
    store: Store<IAppState>,
    httpSv: HttpService,
    private modal: TCModalService,
    private formBuilder: FormBuilder,
 
    private clubSettingsService: ClubSettingsService,
    private fileService: FileService
  ) {
    super(store, httpSv);

    this.pageData = {
      loaded: true,
      title: "Configuracion general",
      breadcrumbs: [
        {
          title: "Portal",
          route: "default-dashboard",
        },
        {
          title: "Configuracion general",
        },
      ],
    };

    /*  this.doctors = []; */
    this.defaultAvatar = "assets/content/avatar.jpeg";
    this.currentPhoto = this.defaultAvatar;
  }

  async loadMainInformation() {
    try {
      GlobalService.ShowSweetLoading();
      const clubInformation: any = await this.clubSettingsService.show(1);
      const dataInformation = clubInformation.data;

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
    const data = await this.loadMainInformation();
    this.initFormInformation(data);
    this.getData("assets/data/appointments.json", "data", "setLoaded");
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  // init form
  initFormInformation(data: any) {
    this.clubSettingsForm = this.formBuilder.group({
      id: [data ? data.id : null],
      title: [data ? data.title : null],
      subtitle: [data ? data.subtitle : null],
      playstore_url: [data ? data.playstore_url : null],
      linkedin_url: [data ? data.linkedin_url : null],
      facebook_url: [data ? data.facebook_url : null],
      twitter_url: [data ? data.twitter_url : null],
    });
  }



  async saveData(form: FormGroup) {
    if (form.valid) {
      const clubInformationData  = form.value;
      const id = clubInformationData.id;
      if (id){
        //update
        await this.updateInformation(id, clubInformationData);
      }else{
        //save
      }

    }
  }

  async updateInformation(id,data){
    try {
      GlobalService.ShowSweetLoading();
      const information: any = await this.clubSettingsService.update(id,data);
      const dataUser = information.data;
      GlobalService.SwalUpdateItem();
     /*  GlobalService.CloseSweet(); */
    } catch (error) {
      console.error('error', error)
      GlobalService.CloseSweet();
    } 
  }

 

}
