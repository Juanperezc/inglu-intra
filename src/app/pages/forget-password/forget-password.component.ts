import { Component, OnInit } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { UserService } from "../../services/http/UserService.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FormService } from "../../services/util/FormService.service";
import { NgxSpinnerService } from "ngx-spinner";

import { UserStorage } from '../../services/util/UserStorage.service';
import { Router } from '@angular/router';
@Component({
  selector: "app-forget-password",
  templateUrl: "./forget-password.component.html",
  styleUrls: ["./forget-password.component.scss"]
})
export class ForgetPasswordComponent implements OnInit {
  // variable
  show: boolean;
  recoverPasswordForm: FormGroup;
  constructor(
    private router: Router,
    private toastr: ToastrService,
    private userService: UserService,
    private fb: FormBuilder,
    private formService: FormService,
    private spinner: NgxSpinnerService
  ) {
    // initialize variable value
    this.recoverPasswordForm = this.fb.group({
      email: [
        null,
        Validators.compose([Validators.required, Validators.email])
      ]
    });
    /* this.toastr.success('Hello world!', 'Toastr fun!') */
    this.show = false;
  }

  get email() {
    return this.recoverPasswordForm.get("email"); //notice this
  }
 
  login() {
    /*     this.userService.login() */
  }


  async handleSubmit() {
    this.formService.markFormGroupTouched(this.recoverPasswordForm);

    if (this.recoverPasswordForm.valid) {
      try {
        this.spinner.show();
        const recoverPasswordData: any = await this.userService.recover_password(this.recoverPasswordForm.value);
        if (!recoverPasswordData.data){
        throw "Error data not found";
        }
        this.toastr.success('Se envió la contraseña a tu correo', 'Revisa tu bandeja de entrada')
        this.spinner.hide();
      } catch (error) {
        console.error(error);
        this.spinner.hide();
      }
    } else {
      console.log(this.formService.getAllErrors(this.recoverPasswordForm));
    }
  }

  ngOnInit() {}
}
