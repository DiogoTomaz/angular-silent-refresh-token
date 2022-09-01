import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Login } from '@shared/models/login';

@Component({
  selector: 'code-invaders-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginDialogComponent implements OnInit {
  @Input() set isLoginSuccessfull(value: boolean) {
    if(!value && this.formGroup) {
      this.formGroup.setErrors({ invalidLogin: true });
    }
  }
  @Input() set isLoading(value: boolean) {
    this.showSpinner = value;
    this.changeDetection.markForCheck();
  }
  @Output() loginClicked = new EventEmitter<Login>();
  formGroup: FormGroup = new FormGroup({});
  fcUsername = new FormControl('', [Validators.required, Validators.minLength(5)]);
  fcPassword = new FormControl('', [Validators.required, Validators.minLength(10)]);
  showSpinner = false;

  constructor(private readonly formBuilder: FormBuilder, private readonly changeDetection: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      username: this.fcUsername,
      password: this.fcPassword
    });
  }

  onSubmit(): void {
    this.loginClicked.emit({ username: this.formGroup.controls.username.value, password: this.formGroup.controls.password.value });
  }
}
