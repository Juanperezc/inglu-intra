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
import { PostService } from '../../../services/http/PostService.service';
import { FileService } from '../../../services/http/FileService.service';

@Component({
  selector: 'post-component',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PagePostComponent extends BasePageComponent implements OnInit, OnDestroy {
  @ViewChild('modalBody') modalBody: ElementRef<any>;
  @ViewChild('modalFooter') modalFooter: ElementRef<any>;

  data: any[];
  categoriesOption: Array<IOption> = new Array<IOption>();
  postForm: FormGroup;
  currentPhoto: string | ArrayBuffer;
  reload : number = 1;
  defaultAvatar: string;
  doctors: IUser[];
  headers : Array<ITableHeaders>;
  constructor(
    store: Store<IAppState>,
    httpSv: HttpService,
    private modal: TCModalService,
    private formBuilder: FormBuilder,
    private postService: PostService,
    private fileService: FileService
  ) {
    super(store, httpSv);

    this.headers = [{
      columnName: "title",
      columnTitle: "Titulo",
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
      columnName: "photo",
      columnTitle: "Foto",
      iconClass: null,
      tcColor: null,
      tcFontSize: null,
      tcType: 'img',
      tcActions: []
    },
    {
      columnName: "category",
      columnTitle: "Categoría",
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
          afterIcon: 'icofont-eye',
          view: 'success',
          size: 'sm',
          handleClick: 'view'
        },
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
    title: 'Publicaciones',
    breadcrumbs: [
      {
        title: 'Portal',
        route: 'default-dashboard'
      },
      {
        title: 'Publicaciones'
      }
    ]
    };
    this.doctors = [];
    this.defaultAvatar = 'assets/content/avatar.jpeg';
    this.currentPhoto = this.defaultAvatar;
  }

  async ngOnInit() {
    await this.loadCategories();
    super.ngOnInit();
    this.getData('assets/data/appointments.json', 'data', 'setLoaded');
  }
  async loadCategories(){
    try {
      const postCategories: any = await this.postService.all_categories();
      console.log(postCategories);
      const data = postCategories.data;
      if (data.length > 0){
        data.map((res) => {
          this.categoriesOption.push({label: res.description, value: res.id})
        })
      }


    } catch (error) {
      console.error('error', error);
    }
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
    this.postForm.reset();
  }
  createPost(){
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
        this.deletePost(row.id);
       }
        break;
      }
    }
  }

  // init form
  initForm(data: any) {
    /* console.log(data) */
    const category : any = data && this.categoriesOption &&
    this.categoriesOption.find((res) => res.label == data.category )
   /*  console.log(data && category.value) */
    this.postForm = this.formBuilder.group({
      id: [(data ? data.id : null)],
      photo: [(data ? data.photo : this.currentPhoto), Validators.required],
      title: [(data ? data.title : ''), Validators.required],
      description: [(data ? data.description : ''), Validators.required],
      category_id: [(data ? category.value : ''), Validators.required],
   /*    from: [(data ? data.fromTo.substring(0, (data.fromTo.indexOf('-') - 1)) : ''), Validators.required],
      to: [(data ? data.fromTo.substring((data.fromTo.indexOf('-') + 2), data.fromTo.length) : ''), Validators.required],
      number: [(data ? data.number : ''), Validators.required],
      doctor: [(data ? data.doctor : ''), Validators.required],
      injury: [(data ? data.injury : ''), Validators.required] */
    });
  }

  // upload new file
 async onFileChanged(inputValue: any) {
    let file: File = inputValue.target.files[0];
    console.log(file);
   /*  let reader: FileReader = new FileReader(); */
    try {
    GlobalService.ShowSweetLoading();
    console.log('test');
    const service: any = await this.fileService.upload_file(file,"image/post");
    console.log(service);
    GlobalService.CloseSweet();

    this.currentPhoto = service.urlFinal;
    this.postForm.controls['photo'].setValue(service.urlFinal);

    } catch (error) {
      console.error('error', error);
       GlobalService.CloseSweet();
    }
  }

  // edit appointment
  edit(row: any) {
    this.openModal(this.modalBody, 'Editar publicación', this.modalFooter, row);
  }

  // remove appointment
  remove(tableRow: any) {
    /* this.appointments = this.appointments.filter(row => row !== tableRow); */
  }

  // add new appointment
  addAppointment(form: FormGroup) {
    if (form.valid) {
   /*    let newAppointment: any = form.value;

      newAppointment.fromTo = `${form.value.from} - ${form.value.to}`;
      newAppointment.img = this.currentPhoto;

      delete newAppointment.from;
      delete newAppointment.to;

      this.appointments.unshift(newAppointment);
      let newTableData = JSON.parse(JSON.stringify(this.appointments));

      this.appointments = newTableData;
      this.closeModal(); */
    }
  }

  async savePost(form: FormGroup) {
    if (form.valid) {
      let post: any = form.value;
      if (post.id == null){
        delete post.id;
        await this.storePost(post);
      }else{
        const id = post.id;
        delete post.id;
        await this.updatePost(id, post);
      }
 
      console.log(post);
      this.closeModal();
    }
  }
  async storePost(postData: any){
    try {
      GlobalService.ShowSweetLoading();
      const post: any = await this.postService.store(postData);
      GlobalService.SwalCreateItem();
      this.reload++;
     /*  GlobalService.CloseSweet(); */
    } catch (error) {
      console.error('error', error);
      GlobalService.CloseSweet();
    }
  }
  async deletePost(id){
  try {
    GlobalService.ShowSweetLoading();
    const post: any = await this.postService.delete(id);
    GlobalService.SwalDeleteItem();
    this.reload++;
  } catch (error) {
    console.error('error', error)
      GlobalService.CloseSweet();
  }
  }
  async updatePost(id, postData: any){
    try {
      GlobalService.ShowSweetLoading();
      const post: any = await this.postService.update(id,postData);
      GlobalService.SwalUpdateItem();
      this.reload++;
     
     /*  GlobalService.CloseSweet(); */
    } catch (error) {
      console.error('error', error)
      GlobalService.CloseSweet();
    } 
  }
}
