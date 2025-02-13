import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { CategoriesService } from 'src/app/services/categories.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { first } from 'rxjs';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-create-category',
  templateUrl: './create-category.component.html',
  styleUrls: ['./create-category.component.scss']
})
export class CreateCategoryComponent implements OnInit {
  id: number = 0;
  categories: any = [];
  error = '';
  res: any;
  

  constructor(
    private categoriesService: CategoriesService,
    private notificationService: NotificationService,
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA)
    public data: any
  ) {
    if (data.id != undefined || data.id != null) {
      this.id = data.id;
    }
  }

  categoryForm: FormGroup = this.formBuilder.group({
    code: ['', [Validators.required]],
    path: ['', [Validators.required]],
    name: ['', [Validators.required]],
    parentId: [0, [Validators.required]],
    status: [1, [Validators.required]]
  })

  ngOnInit(): void {
    if (this.id !== 0 && this.id !== undefined) {
      this.findCategory(this.id);
    }
    this.getParentCategory();
  }

  onUpdateCategory() {
    if (this.id != 0) {
      this.categoriesService.updateCategory(this.id, this.categoryForm.value)
      .pipe(first())
      .subscribe(
      // data => {
      //   this.notificationService.successNoti("Lưu thành công", "");
      // },
      error => {
        this.error = error;
        this.notificationService.errorNoti("Có lỗi xảy ra", "");
      }, () => {
        this.notificationService.successNoti("Lưu thành công", "");
      });
    } else {
      this.categoriesService.createCategory(this.categoryForm.value)
      .pipe(first())
      .subscribe(data => {
        this.id = data['data'].id;
      },
      error => {
        this.error = error;
        this.notificationService.errorNoti("Có lỗi xảy ra", "");
      }, () => {
        this.notificationService.successNoti("Lưu thành công", "");
      });
    }
  }

  getParentCategory() {
    this.categories = this.data.list;
  }

  insertPath(idF: any) {
    let cat = this.categories.filter((item: any) => item['id'] == idF);
    this.categoryForm.controls['path'].setValue(cat[0].path);
  }

  findCategory(idCate: number) {
    this.categoriesService.getCategory(idCate).subscribe(data => {
      this.res = data['data'];
      this.categoryForm = new FormGroup({
        code: new FormControl(this.res.code),
        path: new FormControl(this.res.path),
        name: new FormControl(this.res.name),
        parentId: new FormControl(this.res.parentId),
        status: new FormControl(this.res.status)
      })
    })
  }

}
