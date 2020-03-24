import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { FormGroup, FormArray } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  constructor() {}

   markFormGroupTouched(form: FormGroup) {
    Object.values(form.controls).forEach(control => {
      control.markAsTouched();

      if ((control as any).controls) {
        this.markFormGroupTouched(control as FormGroup);
      }
    });
}
  getAllErrors(form: FormGroup | FormArray): { [key: string]: any; } | null {
    let hasError = false;
    const result = Object.keys(form.controls).reduce((acc, key) => {
        const control = form.get(key);
        const errors = (control instanceof FormGroup || control instanceof FormArray)
            ? this.getAllErrors(control)
            : control.errors;
        if (errors) {
            acc[key] = errors;
            hasError = true;
        }
        return acc;
    }, {} as { [key: string]: any; });
    return hasError ? result : null;
}

}
