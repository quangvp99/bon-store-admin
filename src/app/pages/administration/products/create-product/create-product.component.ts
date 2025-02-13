import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { first } from 'rxjs';
import { CategoriesService } from 'src/app/services/categories.service';
import { NotificationService } from 'src/app/services/notification.service';
import { ProductsService } from 'src/app/services/products.service';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FileService } from 'src/app/services/file.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.scss']
})
export class CreateProductComponent implements OnInit {
  avtCode: string = 'AVT';
  public file: File;
  public listFile: string[] = [];
  categoryData: any;
  selected: 'Chọn';
  url = '../../../../../assets/images/no-image.jpg';
  selectedFiles?: FileList;
  previews: any = [this.url];
  editor = ClassicEditor;
  data: any = '';

  constructor(
    private productsService: ProductsService,
    private categoriesService: CategoriesService,
    private fileService: FileService,
    private notificationService: NotificationService,
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  productForm: FormGroup = this.formBuilder.group({
    code: ['', [Validators.required]],
    path: ['', [Validators.required]],
    name: ['', [Validators.required]],
    shortDes: ['', [Validators.required]],
    description: ['', [Validators.required]],
    typeName: ['', [Validators.required]],
    imgUrl: ['', [Validators.required]],
    price: ['', [Validators.required]],
    sale: [0, [Validators.required]],
    status: [1, [Validators.required]]
  })

  ngOnInit(): void {
    this.getAllCategory();
  }

  getAllCategory() {
    this.categoriesService.getListCategory()
      .pipe(first())
      .subscribe(data => {
        this.categoryData = data['data'];
      },
        error => {
          this.notificationService.errorNoti("Có lỗi xảy ra", "");
        })
  }

  onCreate() {
    this.onUploadFile();
  }

  onCreateCode() {
    this.productsService.createProduct(this.productForm.value)
      .pipe(first())
      .subscribe(data => {
      }, error => {
        this.notificationService.errorNoti("Có lỗi xảy ra", "");
      }, () => {
        this.onUploadFileList();
      })
  }

  onUploadFile() {
    const avtImg = new FormData();
    avtImg.append('file', this.file);
    avtImg.append('productCode', this.avtCode);
    
    this.fileService.uploadFile(avtImg)
      .pipe(first())
      .subscribe(data => {
        this.productForm.value['imgUrl'] = data['data']['file']['url'];
      }, error => {
        this.notificationService.errorNoti("Lỗi upload ảnh", "");
      }, () => {
        this.onCreateCode();
      })
  }

  onUploadFile2(list:any) {
    const avtImg = new FormData();
    avtImg.append('file', list);
    avtImg.append('productCode', this.productForm.value['code']);
    
    this.fileService.uploadFile(avtImg)
      .pipe(first())
      .subscribe(data => {
        this.productForm.value['imgUrl'] = data['data']['file']['url'];
      }, error => {
        this.notificationService.errorNoti("Lỗi upload ảnh", "");
      }, () => {
        this.notificationService.successNoti("Lưu thành công", "");
        this.listProd();
      })
  }

  onUploadFileList() {
    if (this.selectedFiles && this.selectedFiles[0]) {
      const numberOfFiles = this.selectedFiles.length;
      for (let i = 0; i < numberOfFiles; i++) {
        this.onUploadFile2(this.selectedFiles[i]);
      }
    }
  }

  onFileChanged(event: any) {
    let reader = new FileReader();
    try {
      if (event.target.files) {
        reader.readAsDataURL(event.target.files[0])
        reader.onload = (event: any) => {
          this.url = event.target.result;
        }
        this.file = event.target.files[0];
      } else {
        this.url = '';
      }
    } catch (error) {
      this.url = '';
    }
  }

  listProd() {
    this.router.navigate(['/administration/products']);
  }

  selectFiles(event: any): void {
    this.selectedFiles = event.target.files;
    this.previews = [];
    try {
      if (this.selectedFiles && this.selectedFiles[0]) {
        const numberOfFiles = this.selectedFiles.length;
        for (let i = 0; i < numberOfFiles; i++) {
          const reader = new FileReader();

          reader.onload = (e: any) => {
            this.previews.push(e.target.result);
          };
          reader.readAsDataURL(this.selectedFiles[i]);
        }
      }
      else {
        this.previews = [this.url];
      }
    } catch (error) {
      this.previews = [];
    }
  }

}
