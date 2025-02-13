import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { CategoriesService } from 'src/app/services/categories.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateCategoryComponent } from '../create-category/create-category.component';
import { first } from 'rxjs';
import { NotificationService } from 'src/app/services/notification.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-list-category',
  templateUrl: './list-category.component.html',
  styleUrls: ['./list-category.component.scss']
})
export class ListCategoryComponent implements OnInit {

  displayedColumns: string[] = ['code', 'path', 'name', 'parentName', 'status', 'action'];
  dataSource = new MatTableDataSource<any>();
  public isShowFilterInput = false;
  categoryData: [];
  listCate: any;
  res: any;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  constructor(
    private categoriesService: CategoriesService,
    private notificationService: NotificationService,
    private matDialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.getAllCategory();
    this.dataSource.paginator = this.paginator;
  }

  getAllCategory() {
    this.categoriesService.getListCategory()
      .pipe(first())
      .subscribe(data => {
        this.dataSource.data = data['data'].filter((item:any) => item['code'] != "tatca");
        this.listCate = this.dataSource.data;
        this.dataSource.data.forEach(element => {
          try {
            if (element.parentId == 0) {
              element.parentName = "";
            } else {
              element.parentName = this.dataSource.data.find(d => d['id'] === element.parentId)['name'];
            }
          } catch (e) {
            element.parentName = "Đã xóa";
          }
        });
      },
        error => {
          this.notificationService.errorNoti("Có lỗi xảy ra", "");
        })
  }

  openCreateDialog() {
    this.matDialog.open(CreateCategoryComponent, {
      width: '550px',
      height: '600px',
      data: { id: 0, list: this.listCate.filter((item: any) => item['parentId'] == 0) }
    })
      .afterClosed()
      .subscribe(shouldReload => {
        this.getAllCategory();
      });
  }

  openEditDialog(idFind: number) {
    this.matDialog.open(CreateCategoryComponent, {
      width: '550px',
      height: '600px',
      data: { id: idFind, list: this.listCate.filter((item: any) => item['parentId'] == 0 || item['parentId'] == 1 && item['id'] != idFind) }
    })
      .afterClosed()
      .subscribe(shouldReload => {
        this.getAllCategory();
      });
  }

  deleteCategory(id: any) {
    this.categoriesService.deleteCategory(id)
      .pipe(first())
      .subscribe(data => {
        this.notificationService.successNoti("Xoá thành công", "");
      },
        error => {
          this.notificationService.errorNoti("Có lỗi xảy ra", "");
        },
        () => {
          this.getAllCategory();
        })
  }

  changeStatus(idCate: number, status: number) {
    this.res = this.listCate.filter((item: any) => item['id'] == idCate);
    if (status != this.res.status) {
      this.categoriesService.changeStatus(idCate)
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
    this.getAllCategory();
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  public showFilterInput(): void {
    this.getAllCategory();
    this.isShowFilterInput = !this.isShowFilterInput;
    this.dataSource = new MatTableDataSource<any>(this.categoryData);
  }
}
