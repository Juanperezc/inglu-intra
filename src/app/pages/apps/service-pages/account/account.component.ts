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
  userInfo: any;
  userInfoMock: any;
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
   
    console.log('route', )
    let title=null; 
    switch(lastRoute){
      case "edit-account": {
        title = "Editar cuenta"
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

    this.getData('assets/data/account-data.json', 'userInfoMock', 'loadedDetect');
    this.userInfo = await UserStorage.getUser();
    /* console.log("this.userInfo", this.userInfo) */
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  loadedDetect() {
    this.setLoaded();
    this.currentAvatar = this.userInfo.profile_pic ?
    this.userInfo.profile_pic :
    this.defaultAvatar;
    this.initUserForm(this.userInfo);
    this.initPasswordForm();
  }

  // init form
  initPasswordForm(){
    this.passwordForm = this.formBuilder.group({
      password: [null, Validators.required],
      confirm_password: [null, Validators.required],
      new_password: [null, Validators.required],
    });
  }
  initUserForm(data: any) {
    console.log("data", data);
    this.userForm = this.formBuilder.group({
      id: [data.id ? data.id : null],
      name: [data.name, Validators.required],
      last_name: [data.last_name, Validators.required],
      id_card: [data.id_card, Validators.required],
      email: [data.email, Validators.required],
      profile_pic: [this.currentAvatar],
      date_of_birth: [data.date_of_birth, Validators.required],
      address: [data.address, Validators.required],
      phone: [data.phone/* , Validators.required */],
      gender: [data.gender, Validators.required],
      status: [data.status && data.status.toString(), Validators.required]
    });
    // detect form changes
    this.userForm.valueChanges.subscribe((t) => {
   /*    console.log('change',t) */
      this.changes = true;
    });
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
