import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { first } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class AppSideLoginComponent implements OnInit {

  @Output() sendLoginForm = new EventEmitter<void>();
  public form: FormGroup;
  loading = false;
  submitted = false;
  error = '';

  constructor(private http: HttpClient,
    private authService: AuthService,
    private router: Router) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
  }

  get f() { return this.form.controls; }

  public login() {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    this.loading = true;

    this.authService.login(this.form.value)
      .pipe(first())
      .subscribe(
        data => {
          if (data['roles'][0] == 'ROLE_ADMIN') {
            localStorage.setItem('token', data['token']);
            this.router.navigate(['/dashboard']).then();
          }
          else {
            localStorage.setItem('token', '');
          }
        }, error => {
          this.error = error;
          this.loading = false;
        }
      )
  }
}
