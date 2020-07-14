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
import { SuggestionService } from '../../../services/http/SuggestionService.service';

@Component({
  selector: 'suggestion_types-component',
  templateUrl: './suggestion_types.component.html',
  styleUrls: ['./suggestion_types.component.scss']
})
export class PageSuggestionTypesComponent extends BasePageComponent implements OnInit, OnDestroy {
  @ViewChild('modalBody') modalBody: ElementRef<any>;
  @ViewChild('modalFooter') modalFooter: ElementRef<any>;

  data: any[];
  categoriesOption: Array<IOption> = new Array<IOption>();
  suggestionTypesForm: FormGroup;
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
    private suggestionService: SuggestionService,
 
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
        columnName: "type",
        columnTitle: "Tipo",
        iconClass: null,
        tcColor: null,
        tcFontSize: null,
        tcType: 'text',
        tcActions: []
      },
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
    title: 'Tipos de Sugerencias',
    breadcrumbs: [
      {
        title: 'Portal',
        route: 'default-dashboard'
      },
      {
        title: 'Tipos de Sugerencias'
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
    this.suggestionTypesForm.reset();
  }
  createSuggestionTypes(){
    this.currentPhoto = null;
    this.openModal(this.modalBody, 'Crear tipo de sugerencia', this.modalFooter)
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
        this.deleteSuggestionTypes(row.id);
       }
        break;
      }
    }
  }

  // init form
  initForm(data: any) {
 
    this.suggestionTypesForm = this.formBuilder.group({
      id: [(data ? data.id : null)],
      type: [(data ? data.type : ''), Validators.required],
      description: [(data ? data.description : ''), Validators.required]
    });
  }

  // upload new file


  // edit appointment
  edit(row: any) {
    this.openModal(this.modalBody, 'Editar tipos de sugerencia', this.modalFooter, row);
  }


  async saveSuggestionTypes(form: FormGroup) {
    if (form.valid) {
      let suggestionTypes: any = form.value;
      if (suggestionTypes.id == null){
        delete suggestionTypes.id;
        await this.storeSuggestionTypes(suggestionTypes);
      }else{
        const id = suggestionTypes.id;
        delete suggestionTypes.id;
        await this.updateSuggestionTypes(id, suggestionTypes);
      }
   
    /*   suggestionTypes.photo = this.currentPhoto; */

      console.log(suggestionTypes);
      this.closeModal();
    }
  }
  async storeSuggestionTypes(suggestionTypesData: any){
    try {
      GlobalService.ShowSweetLoading();
      const suggestionTypes: any = await this.suggestionService.store(suggestionTypesData);
      GlobalService.SwalCreateItem();
      this.reload++;
     /*  GlobalService.CloseSweet(); */
    } catch (error) {
      console.error('error', error);
      GlobalService.CloseSweet();
    }
  }
  async deleteSuggestionTypes(id){
  try {
    GlobalService.ShowSweetLoading();
    const suggestionTypes: any = await this.suggestionService.delete(id);
    GlobalService.SwalDeleteItem();
    this.reload++;
  } catch (error) {
    console.error('error', error)
      GlobalService.CloseSweet();
  }
  }
  async updateSuggestionTypes(id, suggestionTypesData: any){
    try {
      GlobalService.ShowSweetLoading();
      const suggestionTypes: any = await this.suggestionService.update(id,suggestionTypesData);
      GlobalService.SwalUpdateItem();
      this.reload++;
     
   /*    GlobalService.CloseSweet(); */
    } catch (error) {
      console.error('error', error)
      GlobalService.CloseSweet();
    } 
  }
}
