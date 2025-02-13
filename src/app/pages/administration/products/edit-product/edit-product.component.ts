import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { first } from 'rxjs';
import { CategoriesService } from 'src/app/services/categories.service';
import { FileService } from 'src/app/services/file.service';
import { NotificationService } from 'src/app/services/notification.service';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss']
})
export class EditProductComponent implements OnInit {

  avtCode: string = 'AVT';
  public file: File;
  public listFile: string[] = [];
  categoryData: any;
  selected: 'Chọn';
  url = '';
  urlNoImg = '../../../../../assets/images/no-image.jpg';
  selectedFiles?: FileList;
  previews: any = [this.urlNoImg];
  previewTemp: any = [];
  editor = ClassicEditor;
  data: any = '';
  id: number;
  res: any;

  constructor(
    private productsService: ProductsService,
    private categoriesService: CategoriesService,
    private fileService: FileService,
    private notificationService: NotificationService,
    private formBuilder: FormBuilder,
    private router: Router,
    private _route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    try {
      this.id = this._route.snapshot.params["id"];
      if (this.id !== 0 && this.id !== undefined) {
        this.findProduct(this.id);
      }
    } catch (error) {
      this.router.navigate(['/administration/products']);
      this.notificationService.errorNoti("Có lỗi xảy ra", "");
    }
    this.getAllCategory();
  }

  productForm: FormGroup = this.formBuilder.group({
    id: ['', [Validators.required]],
    code: ['', [Validators.required]],
    path: ['', [Validators.required]],
    name: ['', [Validators.required]],
    description: ['', [Validators.required]],
    sale: [0, [Validators.required]],
    status: [1, [Validators.required]],
    categoryId: [1, [Validators.required]],
    imgUrl: ['', [Validators.required]],
  })

  findProduct(idProd: number) {
    this.productsService.getProduct(idProd).subscribe(data => {
      this.res = data['data'];
      this.productForm = new FormGroup({
        id: new FormControl(this.res.id),
        code: new FormControl(this.res.code),
        path: new FormControl(this.res.path),
        name: new FormControl(this.res.name),
        description: new FormControl(this.res.description),
        sale: new FormControl(this.res.sale),
        status: new FormControl(this.res.status),
        categoryId: new FormControl(this.res.categoryId),
        imgUrl: new FormControl(this.res.imgUrl)
      })
      this.url = this.res.imgUrl;
      this.res.files.forEach((e:any) => {
        this.previewTemp.push(e.url);
      });
      this.previews = this.previewTemp;
    }, error => {
      this.notificationService.errorNoti("Có lỗi xảy ra", "");
    })
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

  onUpdate() {
    this.onUploadFile();
  }

  onUpdateCode(idF:number) {
    this.productsService.updateProduct(idF, this.productForm.value)
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
    if (this.file != undefined) {
      this.fileService.uploadFile(avtImg)
      .pipe(first())
      .subscribe(data => {
        this.productForm.value['imgUrl'] = data['data']['file']['url'];
      }, error => {
        this.notificationService.errorNoti("Lỗi upload ảnh", "");
      }, () => {
        this.onUpdateCode(this.id);
      })
    } else {
      this.onUpdateCode(this.id);
    }
    
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
    } else {
      this.notificationService.successNoti("Lưu thành công", "");
      this.listProd();
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
        this.url = this.productForm.get('imgUrl')?.value;
      }
    } catch (error) {
      this.url = this.urlNoImg;
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
        this.previews = this.previewTemp;
      }
    } catch (error) {
      this.previews = [this.urlNoImg];
    }
  }

}
