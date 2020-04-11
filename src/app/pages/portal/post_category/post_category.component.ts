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

import { PostCategoryService } from '../../../services/http/PostCategoryService.service';

@Component({
  selector: 'post_category',
  templateUrl: './post_category.component.html',
  styleUrls: ['./post_category.component.scss']
})
export class PagePostCategoryComponent extends BasePageComponent implements OnInit, OnDestroy {
  @ViewChild('modalBody') modalBody: ElementRef<any>;
  @ViewChild('modalFooter') modalFooter: ElementRef<any>;

  data: any[];
  categoriesOption: Array<IOption> = new Array<IOption>();
  postCategoryTypesForm: FormGroup;
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
    private postCategoryService: PostCategoryService,
 
  ) {
    super(store, httpSv);
    this.statuses = new Array<IOption>();
    this.statuses.push({
      label: "Pendiente",
      value: "0"
    })
    this.statuses.push({
      label: "Atendido",
      value: "1"
    })
    this.headers = [
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
        {
        afterIcon: 'icofont-ui-edit',
        view: 'info',
        size: 'sm',
        handleClick: 'edit'
      } ,
      {
        afterIcon: 'icofont-ui-delete',
        view: 'error',
        size: 'sm',
        handleClick: 'remove'
      } ]
    }];

    this.pageData = {
    loaded: true,
    title: 'Categorias de publicación',
    breadcrumbs: [
      {
        title: 'Portal',
        route: 'default-dashboard'
      },
      {
        title: 'Categorias de publicación'
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
    this.initForm(null);
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
    this.postCategoryTypesForm.reset();
  }
  createPostCategoryTypes(){
    this.currentPhoto = null;
    this.openModal(this.modalBody, 'Crear categoria', this.modalFooter)
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
        this.deletePostCategoryTypes(row.id);
       }
        break;
      }
    }
  }

  // init form
  initForm(data: any) {
 
    this.postCategoryTypesForm = this.formBuilder.group({
      id: [(data ? data.id : null)],
      description: [(data ? data.description : ''), Validators.required]
    });
  }

  // upload new file


  // edit appointment
  edit(row: any) {
    this.openModal(this.modalBody, 'Editar categoria', this.modalFooter, row);
  }


  async savePostCategoryTypes(form: FormGroup) {
    if (form.valid) {
      let postCategoryTypes: any = form.value;
      if (postCategoryTypes.id == null){
        delete postCategoryTypes.id;
        await this.storePostCategoryTypes(postCategoryTypes);
      }else{
        const id = postCategoryTypes.id;
        delete postCategoryTypes.id;
        await this.updatePostCategoryTypes(id, postCategoryTypes);
      }
   
    /*   postCategoryTypes.photo = this.currentPhoto; */

      console.log(postCategoryTypes);
      this.closeModal();
    }
  }
  async storePostCategoryTypes(postCategoryTypesData: any){
    try {
      GlobalService.ShowSweetLoading();
      const postCategoryTypes: any = await this.postCategoryService.store(postCategoryTypesData);
      GlobalService.SwalCreateItem();
      this.reload++;
     /*  GlobalService.CloseSweet(); */
    } catch (error) {
      console.error('error', error);
      GlobalService.CloseSweet();
    }
  }
  async deletePostCategoryTypes(id){
  try {
    GlobalService.ShowSweetLoading();
    const postCategoryTypes: any = await this.postCategoryService.delete(id);
    GlobalService.SwalDeleteItem();
    this.reload++;
  } catch (error) {
    console.error('error', error)
      GlobalService.CloseSweet();
  }
  }
  async updatePostCategoryTypes(id, postCategoryTypesData: any){
    try {
      GlobalService.ShowSweetLoading();
      const postCategoryTypes: any = await this.postCategoryService.update(id,postCategoryTypesData);
      GlobalService.SwalUpdateItem();
      this.reload++;
     
   /*    GlobalService.CloseSweet(); */
    } catch (error) {
      console.error('error', error)
      GlobalService.CloseSweet();
    } 
  }
}
