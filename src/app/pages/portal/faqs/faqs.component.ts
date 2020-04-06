import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BasePageComponent } from '../../base-page';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { IAppState } from '../../../interfaces/app-state';
import { HttpService } from '../../../services/http/http.service';
import { TCModalService } from '../../../ui/services/modal/modal.service';
import { IUser } from '../../../ui/interfaces/user';
import { ITableHeaders } from '../../../interfaces/table-headers';
import { GlobalService } from '../../../services/util/GlobalService.service';
import { IHandleAction } from '../../../interfaces/handle-action';
import { IOption } from '../../../ui/interfaces/option';
import { FaqService } from '../../../services/http/FaqService.service';
import { FileService } from '../../../services/http/FileService.service';

@Component({
  selector: 'faqs-component',
  templateUrl: './faqs.component.html',
  styleUrls: ['./faqs.component.scss']
})
export class PageFaqsComponent extends BasePageComponent implements OnInit, OnDestroy {
  @ViewChild('modalBody') modalBody: ElementRef<any>;
  @ViewChild('modalFooter') modalFooter: ElementRef<any>;

  data: any[];
  categoriesOption: Array<IOption> = new Array<IOption>();
  faqForm: FormGroup;
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
    private faqService: FaqService,
 
  ) {
    super(store, httpSv);

    this.headers = [{
      columnName: "question",
      columnTitle: "Pregunta",
      iconClass: null,
      tcColor: null,
      tcFontSize: null,
      tcType: 'text',
      tcActions: []
    },
    {
      columnName: "answer",
      columnTitle: "Respuesta",
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
      },
      {
        afterIcon: 'icofont-ui-delete',
        view: 'error',
        size: 'sm',
        handleClick: 'remove'
      }]
    }];

    this.pageData = {
    loaded: true,
    title: 'Preguntas Frecuentes',
    breadcrumbs: [
      {
        title: 'Portal',
        route: 'default-dashboard'
      },
      {
        title: 'Preguntas frecuentes'
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
    this.faqForm.reset();
  }
  createFaq(){
    this.currentPhoto = null;
    this.openModal(this.modalBody, 'Crear publicación', this.modalFooter)
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
        this.deleteFaq(row.id);
       }
        break;
      }
    }
  }

  // init form
  initForm(data: any) {
   
    this.faqForm = this.formBuilder.group({
      id: [(data ? data.id : null)],
      question: [(data ? data.question : ''), Validators.required],
      answer: [(data ? data.answer : ''), Validators.required],
    });
  }

  // upload new file


  // edit appointment
  edit(row: any) {
    this.openModal(this.modalBody, 'Editar Pregunta frecuente', this.modalFooter, row);
  }


  async saveFaq(form: FormGroup) {
    if (form.valid) {
      let faq: any = form.value;
      if (faq.id == null){
        delete faq.id;
        await this.storeFaq(faq);
      }else{
        const id = faq.id;
        delete faq.id;
        await this.updateFaq(id, faq);
      }
   
    /*   faq.photo = this.currentPhoto; */

      console.log(faq);
      this.closeModal();
    }
  }
  async storeFaq(faqData: any){
    try {
      GlobalService.ShowSweetLoading();
      const faq: any = await this.faqService.store(faqData);
      GlobalService.SwalCreateItem();
      this.reload++;
     /*  GlobalService.CloseSweet(); */
    } catch (error) {
      console.error('error', error);
      GlobalService.CloseSweet();
    }
  }
  async deleteFaq(id){
  try {
    GlobalService.ShowSweetLoading();
    const faq: any = await this.faqService.delete(id);
    GlobalService.SwalDeleteItem();
    this.reload++;
  } catch (error) {
    console.error('error', error)
      GlobalService.CloseSweet();
  }
  }
  async updateFaq(id, faqData: any){
    try {
      GlobalService.ShowSweetLoading();
      const faq: any = await this.faqService.update(id,faqData);
      GlobalService.SwalUpdateItem();
      this.reload++;
     
   /*    GlobalService.CloseSweet(); */
    } catch (error) {
      console.error('error', error)
      GlobalService.CloseSweet();
    } 
  }
}
