import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BasePageComponent } from '../../base-page';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { IAppState } from '../../../interfaces/app-state';
import { HttpService } from '../../../services/http/http.service';
import { TCModalService } from '../../../ui/services/modal/modal.service';

import { ITableHeaders } from '../../../interfaces/table-headers';
import { GlobalService } from '../../../services/util/GlobalService.service';
import { IHandleAction } from '../../../interfaces/handle-action';
import { IOption } from '../../../ui/interfaces/option';
import { ClaimUserService } from '../../../services/http/ClaimUserService.service';

@Component({
  selector: 'claims-component',
  templateUrl: './claims.component.html',
  styleUrls: ['./claims.component.scss']
})
export class PageClaimsComponent extends BasePageComponent implements OnInit, OnDestroy {
  @ViewChild('modalBody') modalBody: ElementRef<any>;
  @ViewChild('modalFooter') modalFooter: ElementRef<any>;

  data: any[];
  categoriesOption: Array<IOption> = new Array<IOption>();
  claimForm: FormGroup;
  statuses: Array<IOption>;
  currentPhoto: string | ArrayBuffer;
  reload : number = 1;
  defaultAvatar: string;
/*   doctors: IUser[]; */
  headers : Array<ITableHeaders>;
  constructor(
    store: Store<IAppState>,
    httpSv: HttpService,
    private modal: TCModalService,
    private formBuilder: FormBuilder,
    private claimUserService: ClaimUserService,
 
  ) {
    super(store, httpSv);
    this.statuses = new Array<IOption>();
    this.statuses.push({
      label: "Sin atender",
      value: "0"
    })
    this.statuses.push({
      label: "Atendido",
      value: "1"
    })
    this.headers = [
      {
        columnName: "description",
        columnTitle: "Tipo",
        iconClass: null,
        tcColor: null,
        tcFontSize: null,
        tcType: 'text',
        tcActions: []
      },
      {
      columnName: "text",
      columnTitle: "Texto",
      iconClass: null,
      tcColor: null,
      tcFontSize: null,
      tcType: 'text',
      tcActions: []
    },
    {
      columnName: "user",
      columnTitle: "Usuario",
      iconClass: null,
      tcColor: null,
      tcFontSize: null,
      tcType: 'text',
      tcActions: []
    },
    {
      columnName: "status",
      columnTitle: "Estatus",
      iconClass: 'sc',
      tcColor: null,
      tcFontSize: null,
      tcType: 'badge',
      tcActions: []
    },
    {
      columnName: "updated_at",
      columnTitle: "Ultima actualización",
      iconClass: null,
      tcColor: null,
      tcFontSize: null,
      tcType: 'text',
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
      }/* ,
      {
        afterIcon: 'icofont-ui-delete',
        view: 'error',
        size: 'sm',
        handleClick: 'remove'
      } */]
    }];

    this.pageData = {
    loaded: true,
    title: 'Reclamos',
    breadcrumbs: [
      {
        title: 'Portal',
        route: 'default-dashboard'
      },
      {
        title: 'Reclamos'
      }
    ]
    };
    
   /*  this.doctors = []; */
    this.defaultAvatar = 'assets/content/avatar.jpeg';
    this.currentPhoto = this.defaultAvatar;
  }

  async ngOnInit() {
   /*  await this.loadCategories(); */
    super.ngOnInit();
    this.getData('assets/data/appointments.json', 'data', 'setLoaded');
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
    this.claimForm.reset();
  }
  createClaim(){
    this.currentPhoto = null;
    this.openModal(this.modalBody, 'Crear reclamo', this.modalFooter)
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
        this.deleteClaim(row.id);
       }
        break;
      }
    }
  }

  // init form
  initForm(data: any) {
   /* console.log(data.status); */
    this.claimForm = this.formBuilder.group({
      id: [(data ? data.id : null)],
      text: [(data ? data.text : ''), Validators.required],
      description: [(data ? data.description : ''), Validators.required],
      user: [(data ? data.user : ''), Validators.required],
      status: [(data ? data.status.toString() : ''), Validators.required],
    });
  }

  // upload new file


  // edit appointment
  edit(row: any) {
    this.openModal(this.modalBody, 'Editar Reclamo', this.modalFooter, row);
  }


  async saveClaim(form: FormGroup) {
    if (form.valid) {
      let claim: any = form.value;
      if (claim.id == null){
        delete claim.id;
        await this.storeClaim(claim);
      }else{
        const id = claim.id;
        delete claim.id;
        await this.updateClaim(id, claim);
      }
   
    /*   claim.photo = this.currentPhoto; */

      console.log(claim);
      this.closeModal();
    }
  }
  async storeClaim(claimData: any){
    try {
      GlobalService.ShowSweetLoading();
      const claim: any = await this.claimUserService.store(claimData);
      GlobalService.SwalCreateItem();
      this.reload++;
     /*  GlobalService.CloseSweet(); */
    } catch (error) {
      console.error('error', error);
      GlobalService.CloseSweet();
    }
  }
  async deleteClaim(id){
  try {
    GlobalService.ShowSweetLoading();
    const claim: any = await this.claimUserService.delete(id);
    GlobalService.SwalDeleteItem();
    this.reload++;
  } catch (error) {
    console.error('error', error)
      GlobalService.CloseSweet();
  }
  }
  async updateClaim(id, claimData: any){
    try {
      GlobalService.ShowSweetLoading();
      const claim: any = await this.claimUserService.update(id,claimData);
      GlobalService.SwalUpdateItem();
      this.reload++;
     
   /*    GlobalService.CloseSweet(); */
    } catch (error) {
      console.error('error', error)
      GlobalService.CloseSweet();
    } 
  }
}
