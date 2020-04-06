import { Component, OnInit } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { UserService } from "../../services/http/UserService.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FormService } from "../../services/util/FormService.service";
import { NgxSpinnerService } from "ngx-spinner";

import { UserStorage } from '../../services/util/UserStorage.service';
import { Router } from '@angular/router';
@Component({
  selector: "app-sign-in",
  templateUrl: "./sign-in.component.html",
  styleUrls: ["./sign-in.component.scss"]
})
export class SignInComponent implements OnInit {
  // variable
  show: boolean;
  loginForm: FormGroup;
  constructor(
    private router: Router,
    private toastr: ToastrService,
    private userService: UserService,
    private fb: FormBuilder,
    private formService: FormService,
    private spinner: NgxSpinnerService
  ) {
    // initialize variable value
    this.loginForm = this.fb.group({
      email: [
        null,
        Validators.compose([Validators.required, Validators.email])
      ],
      password: [
        null,
        Validators.compose([
          Validators.required /* ,Validators.min(5), Validators.max(10) */
        ])
      ]
    });
    /* this.toastr.success('Hello world!', 'Toastr fun!') */
    this.show = false;
  }

  get email() {
    return this.loginForm.get("email"); //notice this
  }
  get password() {
    return this.loginForm.get("password"); //and this too
  }
  login() {
    /*     this.userService.login() */
  }

  // click event function toggle
  eyePassword() {
    this.show = !this.show;
  }
  async handleSubmit() {
    this.formService.markFormGroupTouched(this.loginForm);

    if (this.loginForm.valid) {
      try {
        this.spinner.show();
        const loginData: any = await this.userService.login(this.loginForm.value);
        if (!loginData.data){
        throw "Error data not found";
        }
        console.log(loginData);
        await UserStorage.setUser(loginData.data.user)
        await UserStorage.setToken(loginData.data.token);
        this.router.navigateByUrl('/vertical');
        console.log(loginData);
        this.spinner.hide();
      } catch (error) {
        console.error(error);
        this.spinner.hide();
      }
    } else {
      console.log(this.formService.getAllErrors(this.loginForm));
    }
  }

  ngOnInit() {}
}
