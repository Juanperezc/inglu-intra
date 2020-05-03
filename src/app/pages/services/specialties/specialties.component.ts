
import { Component, OnDestroy, OnInit, ViewChild, ElementRef } from '@angular/core';
import { BasePageComponent } from '../../base-page';
import { Store } from '@ngrx/store';
import { IAppState } from '../../../interfaces/app-state';
import { HttpService } from '../../../services/http/http.service';
import { TCModalService } from '../../../ui/services/modal/modal.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalService } from '../../../services/util/GlobalService.service';
import { Router } from '@angular/router';
import { SpecialtyService } from './../../../services/http/SpecialtyService.service';
import { FileService } from './../../../services/http/FileService.service';

@Component({
  selector: 'page-specialties',
  templateUrl: './specialties.component.html',
  styleUrls: ['./specialties.component.scss']
})
export class PageSpecialtyComponent extends BasePageComponent implements OnInit, OnDestroy {
  pagination: boolean = true;
  pagesCount: number = 1;
  page: number = 1;
  specialties: any[];
  specialtyForm: FormGroup;
  search: boolean = true;
  currentAvatar: string | ArrayBuffer;
  defaultAvatar: string;
  searchText: string = null;
  specialists: string[];
  @ViewChild('modalBody') modalBody: ElementRef<any>;
  @ViewChild('modalFooter') modalFooter: ElementRef<any>;

  constructor(
    store: Store<IAppState>,
    httpSv: HttpService,
    private modal: TCModalService,
    private formBuilder: FormBuilder,
    private specialtyService: SpecialtyService,
    private router: Router,
    private fileService : FileService
  ) {
    super(store, httpSv);

    this.pageData = {
      title: 'Especialidades',
      breadcrumbs: [
        {
          title: 'Servicios',
          route: 'default-dashboard'
        },
        {
          title: 'Especialidades'
        }
      ]
    };
    this.specialties = [];
 
    this.defaultAvatar = 'assets/content/avatar.jpeg';
    this.currentAvatar = this.defaultAvatar;
    this.specialists = [];
  }

  ngOnInit() {
    super.ngOnInit();
    this.loadData();
    this.getData('assets/data/specialties.json', 'specialties', 'setLoaded');
    this.getData('assets/data/specialties-specialists.json', 'specialists');
  }

 
  
  changeSearch(newValue) {
  /*   mymodel = newValue; */
  this.searchText = newValue;
  /*   console.log(newValue) */
  }
  async submitSearch(){
      await this.loadData(1,this.searchText);
  }
  async createSpecialty(){
    this.openModal(this.modalBody, 'Crear especialidad', this.modalFooter, null);
  }

  closeModal() {
    this.modal.close();
    this.specialtyForm.reset();
  }

  async handleAction(event: any){
    if (event.type == "edit"){
      this.openModal(this.modalBody, 'Crear especialidad', this.modalFooter, event.data);
    }else if (event.type == "delete"){
      const result = await GlobalService.AlertDelete();
       if (result.value) 
       {
        this.deleteSpecialty(event.data.id);
       }

    }
  }
  ngOnDestroy() {
    super.ngOnDestroy();
  }

  async onFileChanged(inputValue: any) {
    let file: File = inputValue.target.files[0];
    console.log(file);
    try {
    GlobalService.ShowSweetLoading();
    console.log('test');
    const service: any = await this.fileService.upload_file(file,"image/specialty");
    console.log(service);
    GlobalService.CloseSweet();
    this.specialtyForm.controls['picture'].setValue(service.urlFinal);
    } catch (error) {
    console.error('error', error);
    GlobalService.CloseSweet();
    }
  }

  async updateSpecialty(id,data){
    try {
      GlobalService.ShowSweetLoading();
      const specialty: any = await this.specialtyService.update(id,data);
      GlobalService.SwalUpdateItem();
      const dataSpecialty = specialty.data;
      await this.loadData();
    } catch (error) {
      console.error('error', error)
      GlobalService.CloseSweet();
    }
  }

  async deleteSpecialty(id){
    try {
      GlobalService.ShowSweetLoading();
      const specialty: any = await this.specialtyService.delete(id);
      GlobalService.SwalDeleteItem();
      await this.loadData();
    } catch (error) {
      console.error('error', error)
        GlobalService.CloseSweet();
    }
    }
    
  async storeSpecialty(data){
    try {
      GlobalService.ShowSweetLoading();
      const specialty: any = await this.specialtyService.store(data);
      GlobalService.CloseSweet();
      await this.loadData();
      GlobalService.SwalCreateItem();
    } catch (error) {
      console.error('error', error)
      GlobalService.CloseSweet();
    }
  }
  async loadData(page = 1, search = null){
    try {
      GlobalService.ShowSweetLoading();
      const specialties: any = await this.specialtyService.index(page,search);
      if (specialties.meta){
        this.pagesCount = specialties.meta.last_page;
        this.page = specialties.meta.current_page;
      }
      this.specialties = specialties.data;
      console.log('specialties', specialties);
      GlobalService.CloseSweet();
    } catch (error) {
      console.error('error', error);
      GlobalService.CloseSweet();
    }
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

   // init form
   async saveSpecialty(form: FormGroup) {
    if (form.valid) {
      let specialty: any = form.value;
      if (specialty.id == null){
        delete specialty.id;
        await this.storeSpecialty(specialty);
      }else{
        const id = specialty.id;
        delete specialty.id;
        await this.updateSpecialty(id, specialty);
      }
      console.log(specialty);
      this.closeModal();
    }
  }
   initForm(data: any) {
    this.specialtyForm = this.formBuilder.group({
      id: [(data ? data.id : null)],
      picture: [(data ? data.picture : null), Validators.required],
      name: [(data ? data.name : ''), Validators.required],
      description: [(data ? data.description : ''), Validators.required]
    });
    /*  console.log('picture: ', this.specialtyForm.value); */
  }
  goToPage(pageNum: number) {
    this.loadData(pageNum,this.searchText)
	}
}
