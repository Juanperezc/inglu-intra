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
import { SuggestionUserService } from '../../../services/http/SuggestionUserService.service';

@Component({
  selector: 'suggestions-component',
  templateUrl: './suggestions.component.html',
  styleUrls: ['./suggestions.component.scss']
})
export class PageSuggestionsComponent extends BasePageComponent implements OnInit, OnDestroy {
  @ViewChild('modalBody') modalBody: ElementRef<any>;
  @ViewChild('modalFooter') modalFooter: ElementRef<any>;

  data: any[];
  categoriesOption: Array<IOption> = new Array<IOption>();
  suggestionForm: FormGroup;
  statuses: Array<IOption>;
  currentPhoto: string | ArrayBuffer;
  reload : number = 1;
  defaultAvatar: string;
  headers : Array<ITableHeaders>;
  constructor(
    store: Store<IAppState>,
    httpSv: HttpService,
    private modal: TCModalService,
    private formBuilder: FormBuilder,
    private suggestionUserService: SuggestionUserService,
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
    title: 'Sugerencias',
    breadcrumbs: [
      {
        title: 'Portal',
        route: 'default-dashboard'
      },
      {
        title: 'Sugerencias'
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
    this.suggestionForm.reset();
  }
  createSuggestion(){
    this.currentPhoto = null;
    this.openModal(this.modalBody, 'Crear sugerencia', this.modalFooter)
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
        this.deleteSuggestion(row.id);
       }
        break;
      }
    }
  }

  // init form
  initForm(data: any) {
   /* console.log(data.status); */
    this.suggestionForm = this.formBuilder.group({
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
    this.openModal(this.modalBody, 'Editar sugerencia', this.modalFooter, row);
  }


  async saveSuggestion(form: FormGroup) {
    if (form.valid) {
      let suggestion: any = form.value;
      if (suggestion.id == null){
        delete suggestion.id;
        await this.storeSuggestion(suggestion);
      }else{
        const id = suggestion.id;
        delete suggestion.id;
        await this.updateSuggestion(id, suggestion);
      }
   
    /*   suggestion.photo = this.currentPhoto; */

      console.log(suggestion);
      this.closeModal();
    }
  }
  async storeSuggestion(suggestionData: any){
    try {
      GlobalService.ShowSweetLoading();
      const suggestion: any = await this.suggestionUserService.store(suggestionData);
      GlobalService.SwalCreateItem();
      this.reload++;
     /*  GlobalService.CloseSweet(); */
    } catch (error) {
      console.error('error', error);
      GlobalService.CloseSweet();
    }
  }
  async deleteSuggestion(id){
  try {
    GlobalService.ShowSweetLoading();
    const suggestion: any = await this.suggestionUserService.delete(id);
    GlobalService.SwalDeleteItem();
    this.reload++;
  } catch (error) {
    console.error('error', error)
      GlobalService.CloseSweet();
  }
  }
  async updateSuggestion(id, suggestionData: any){
    try {
      GlobalService.ShowSweetLoading();
      const suggestion: any = await this.suggestionUserService.update(id,suggestionData);
      GlobalService.SwalUpdateItem();
      this.reload++;
     
   /*    GlobalService.CloseSweet(); */
    } catch (error) {
      console.error('error', error)
      GlobalService.CloseSweet();
    } 
  }
}
