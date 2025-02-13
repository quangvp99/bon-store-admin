import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { first } from 'rxjs';
import { CategoriesService } from 'src/app/services/categories.service';
import { NotificationService } from 'src/app/services/notification.service';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-list-product',
  templateUrl: './list-product.component.html',
  styleUrls: ['./list-product.component.scss']
})
export class ListProductComponent implements OnInit {

  displayedColumns: string[] = ['code', 'imgUrl', 'name', 'categoryName', 'sale', 'status', 'action'];
  dataSource = new MatTableDataSource<any>();
  public isShowFilterInput = false;
  productData: [];
  categoryData: any;
  listProd: any;
  res: any;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  constructor(
    private productsService: ProductsService,
    private categoriesService: CategoriesService,
    private notificationService: NotificationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getAllCategory();
    this.dataSource.paginator = this.paginator;
  }

  getAllProduct() {
    this.productsService.getListProduct()
      .pipe(first())
      .subscribe(data => {
        this.dataSource.data = data['data'].filter((item:any) => item['code'] != "AVT");
        console.log(data);
      },
        error => {
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
        },
        () => {
          this.getAllProduct();
        })
  }

  createProd() {
    this.router.navigate(['/administration/product/create']);
  }

  editProd(id: number) {
    this.router.navigate(['/administration/product/' + id]);
  }

  deleteProduct(id: any) {
    this.productsService.deleteProduct(id)
      .pipe(first())
      .subscribe(data => {
        this.notificationService.successNoti("Xoá thành công", "");
      },
        error => {
          this.notificationService.errorNoti("Có lỗi xảy ra", "");
        },
        () => {
          this.getAllProduct();
        })
  }

  changeStatus(idProd: number, status: number) {
    this.res = this.dataSource.data.filter((item: any) => item['id'] == idProd);
    if (status != this.res.status) {
      this.productsService.changeStatus(idProd)
        .pipe(first())
        .subscribe(data => {
          this.notificationService.successNoti("Cập nhật thành công", "");
        },
          error => {
            this.notificationService.errorNoti("Có lỗi xảy ra", "");
          })
    }
  }

  public applyFilter(event: Event): void {
    this.getAllProduct();
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  public showFilterInput(): void {
    this.getAllProduct();
    this.isShowFilterInput = !this.isShowFilterInput;
    this.dataSource = new MatTableDataSource<any>(this.productData);
  }
}
