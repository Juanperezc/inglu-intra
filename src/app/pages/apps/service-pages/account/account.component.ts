import { Component, OnDestroy, OnInit } from '@angular/core';
import { BasePageComponent } from '../../../base-page';
import { Store } from '@ngrx/store';
import { IAppState } from '../../../../interfaces/app-state';
import { HttpService } from '../../../../services/http/http.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IOption } from '../../../../ui/interfaces/option';
import { UserStorage } from '../../../../services/util/UserStorage.service';
import { GlobalService } from '../../../../services/util/GlobalService.service';
import { FileService } from '../../../../services/http/FileService.service';
import { UserService } from '../../../../services/http/UserService.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'page-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class PageAccountComponent extends BasePageComponent implements OnInit, OnDestroy {
  id: number | string;
  userInfo: any;
  userInfoMock: any;
  editMe : boolean = false;
  editAccount : boolean = false;
  passwordForm: FormGroup;
  userForm: FormGroup;
  gender: IOption[];
  status: IOption[];
  currentAvatar: string | ArrayBuffer;
  defaultAvatar: string;
  changes: boolean;
  max: any;
  constructor(
    store: Store<IAppState>,
    httpSv: HttpService,
    private activatedRoute: ActivatedRoute,
    private fileService : FileService,
    private userService : UserService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder
  ) {
    super(store, httpSv);
    const lastRoute =  this.activatedRoute.snapshot && 
    this.activatedRoute.snapshot.url
    && this.activatedRoute.snapshot.url[0].path
    this.id = this.activatedRoute.snapshot && this.activatedRoute.snapshot.params
    && this.activatedRoute.snapshot.params['id'];
    let title=null; 
    console.log('lastRoute', lastRoute, this.id);
    switch(lastRoute){
      case "edit-account": {
        title = "Editar cuenta"
        this.editMe=true;
        break;
      }
      case "account": {
        title = "Editar cuenta"
        this.editAccount=true;
        break;
      }
      case "create-medic": {
        break;
      }
      case "create-patient": {
        break;
      }
    }
    this.pageData = {
      title: title,
      loaded: true,
      breadcrumbs: [
        {
          title: 'Servicios',
          route: 'default-dashboard'
        },
        {
          title: title
        }
      ]
    };
    this.gender = [
      {
        label: 'Masculino',
        value: 'male'
      },
      {
        label: 'Femenino',
        value: 'female'
      }
    ];
    this.status = [
      {
        label: 'Activo',
        value: '1'
      },
      {
        label: 'Desactivado',
        value: '2'
      }
    ];
    this.defaultAvatar = 'assets/content/avatar.jpeg';
/*     this.currentAvatar = this.defaultAvatar; */
    this.changes = false;
  }

 async ngOnInit() {


    this.max = new Date();
    super.ngOnInit();
    if (this.editMe){
      this.userInfo = await UserStorage.getUser();
    }else if (this.editAccount){
      this.userInfo = await this.loadUser(this.id);
      console.log(this.userInfo)
    }
    this.getData('assets/data/account-data.json', 'userInfoMock', 'loadedDetect');

    /* console.log("this.userInfo", this.userInfo) */
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  loadedDetect() {
    this.setLoaded();
    this.currentAvatar = this.userInfo && this.userInfo.profile_pic ?
    this.userInfo.profile_pic :
    this.defaultAvatar;
    this.initUserForm(this.userInfo);
    this.initPasswordForm();
  }

  // init form
  initPasswordForm(){
    this.passwordForm = this.formBuilder.group({
      password: [null,this.editAccount ? Validators.required : null],
      confirm_password: [null, Validators.required],
      new_password: [null, Validators.required],
    });
  }
  initUserForm(data: any) {
    console.log("data", data);
    this.userForm = this.formBuilder.group({
      id: [data && data.id ? data.id : null],
      name: [data && data.name, Validators.required],
      last_name: [data && data.last_name, Validators.required],
      id_card: [data && data.id_card, Validators.required],
      email: [data && data.email, Validators.required],
      profile_pic: [this.currentAvatar],
      date_of_birth: [data && data.date_of_birth, Validators.required],
      address: [data && data.address, Validators.required],
      phone: [data && data.phone/* , Validators.required */],
      gender: [data && data.gender, Validators.required],
      status: [data && data.status && data.status.toString(), this.editAccount ? Validators.required : null]
    });
    // detect form changes
    this.userForm.valueChanges.subscribe((t) => {
   /*    console.log('change',t) */
      this.changes = true;
    });
  }
  async loadUser(id){
    try {
      GlobalService.ShowSweetLoading();
      const user: any = await this.userService.show(id);
      const dataUser = user.data;
      GlobalService.CloseSweet();
      return dataUser;
    } catch (error) {
      console.error('error', error)
      GlobalService.CloseSweet();
      return null;
    }
  }

  async updateUser(id,data){
    try {
      GlobalService.ShowSweetLoading();
      const user: any = await this.userService.update(id,data);
      GlobalService.SwalUpdateItem();
      const dataUser = user.data;
      if (dataUser)
      UserStorage.setUser(dataUser);
     /*  GlobalService.CloseSweet(); */
    } catch (error) {
      console.error('error', error)
      GlobalService.CloseSweet();
    } 
  }
  // save form data
  async saveData(form: FormGroup) {
    if (form.valid) {
      this.userInfo = form.value;
      const id = this.userInfo.id;
      
      this.userInfo.date_of_birth = 
      this.userInfo.date_of_birth ? 
      (GlobalService.formatDate(this.userInfo.date_of_birth)) : null;
      console.log(this.userInfo);
      if (id){
        //update
        await this.updateUser(id, this.userInfo);
      }else{
        //save
      }
      
     /*  this.changes = false; */
    }
  }

  async changePassword(form: FormGroup){
    console.log('change password');
    if (form.valid) {
      try{
      GlobalService.ShowSweetLoading();
      const user: any = await this.userService.change_password(form.value);
      GlobalService.SwalUpdateItem();
      const dataUser = user.data;
      if (dataUser)
      UserStorage.setUser(dataUser);
     /*  GlobalService.CloseSweet(); */
    } catch (error) {
      if (error.status == 422){
        if (error.error && error.error.message == "Password does not match"){
          this.toastr.error("Las contraseña suministrada es incorrecta", "Error")
        }
      }
      console.error('error', error)
      GlobalService.CloseSweet();
    } 
  
    }
  }
  // upload new file
  
  async onFileChanged(inputValue: any) {
    let file: File = inputValue.target.files[0];
    console.log(file);
   /*  let reader: FileReader = new FileReader(); */
    try {
    GlobalService.ShowSweetLoading();
    console.log('test');
    const service: any = await this.fileService.upload_file(file,"image/profile");
    console.log(service);
    GlobalService.CloseSweet();

  /*   this.currentPhoto = service.urlFinal; */
    this.userForm.controls['profile_pic'].setValue(service.urlFinal);

    } catch (error) {
      console.error('error', error);
       GlobalService.CloseSweet();
    }
  }
}
