import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private matSnackBar: MatSnackBar) { }

  successNoti(message: string, acction: string) {
    this.matSnackBar.open(message, acction, {
      duration: 2000,
      horizontalPosition: "right",
      verticalPosition: "top",
      panelClass: ["success-style"]
    });
  }

  errorNoti(message: string, acction: string) {
    this.matSnackBar.open(message, acction, {
      duration: 2000,
      horizontalPosition: "right",
      verticalPosition: "top",
      panelClass: ["error-style"]
    });
  }
}
