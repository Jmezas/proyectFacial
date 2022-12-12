import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root',
})
export class SpinnerService {
  constructor(private spinnerservice: NgxSpinnerService) {}
  public llamarSpinner() {
    this.spinnerservice.show();
  }
  public ocultarSpinner() {
    this.spinnerservice.hide();
  }
}
