import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../../utils/app.service';
import { ConstantData } from '../../../utils/constant-data';
import { LocalService } from '../../../utils/local.service';
import { Status } from '../../../utils/enum';
import { LoadDataService } from '../../../utils/load-data.service';
import { ActionModel, RequestModel, StaffLoginModel } from '../../../utils/interface';
import { Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-shortcut',
  templateUrl: './shortcut.component.html',
  styleUrls: ['./shortcut.component.css']
})
export class ShortcutComponent {
  dataLoading: boolean = false
  ShortcutList: any[] = []
  Shortcut: any = {}
  PageSizes = ConstantData.PageSizes;
  p: number = 1;
  Search: string = '';
  reverse: boolean = false;
  sortKey: string = '';
  itemPerPage: number = this.PageSizes[0];
  action: ActionModel = {} as ActionModel;
  staffLogin: StaffLoginModel = {} as StaffLoginModel;
  StatusList = this.loadData.GetEnumList(Status);
  AllStatusList = Status;
  imageUrl = this.service.getImageUrl();

  sort(key: any) {
    this.sortKey = key;
    this.reverse = !this.reverse;
  }


  constructor(
    private service: AppService,
    private toastr: ToastrService,
    private localService: LocalService,
    private loadData: LoadDataService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.staffLogin = this.localService.getEmployeeDetail();
    this.validiateMenu();
    this.getShortcutList();
    this.getPageMenuList();
  }

  validiateMenu() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({ Url: this.router.url, StaffLoginId: this.staffLogin.StaffLoginId })).toString()
    }
    this.dataLoading = true
    this.service.validiateMenu(obj).subscribe((response: any) => {
      this.action = this.loadData.validiateMenu(response, this.toastr, this.router)
      this.dataLoading = false;
    }, (err => {
      this.toastr.error(ConstantData.serverMessage)
      this.dataLoading = false;
    }))
  }

  @ViewChild('formShortcut') formShortcut: NgForm;
  resetForm() {
    this.Shortcut = {
      Status: Status.Active
    };
    this.ImgFilePhoto = "";
    this.MenuList = this.AllMenuList;
    if (this.formShortcut) {
      this.formShortcut.control.markAsPristine();
      this.formShortcut.control.markAsUntouched();
    }
  }

  filterMenu(value: string) {
    if (value) {
      this.MenuList = this.AllMenuList.filter((option: any) => option.SearchMenu.toLowerCase().includes(value.toLowerCase()));
    } else {
      this.MenuList = this.AllMenuList;
    }
    this.Shortcut.MenuId = null;
  }

  clearMenu() {
    this.MenuList = this.AllMenuList;
    this.Shortcut.SearchMenu = null;
    this.Shortcut.MenuId = null;
  }

  afterMenuSelected(id: any) {
    this.Shortcut.MenuId = id;
    var menu = this.MenuList.filter(x => x.MenuId == id)[0];
    this.Shortcut.MenuTitle = menu.MenuTitle;
    this.Shortcut.MenuIcon = menu.MenuIcon;
  }

  AllMenuList: any[] = []
  MenuList: any[] = []
  getPageMenuList() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({})).toString()
    }
    this.dataLoading = true
    this.service.getPageMenuList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.AllMenuList = response.MenuList;
        this.AllMenuList.map(x => x.SearchMenu = x.MenuTitle);
        this.MenuList = this.AllMenuList;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false
    }, (err => {
      this.toastr.error(ConstantData.serverMessage)
      this.dataLoading = false;
    }))
  }

  ImgFilePhoto: string;
  setImgFile(event: any) {
    var file: File = event.target.files[0];
    if (file.type != 'image/png' && file.type != "image/jpg" && file.type != "image/jpeg" ) {
      this.toastr.error("Invalid file format !!");
      this.Shortcut.ImgFileFile = null;
      this.Shortcut.ImgFile = '';
      this.Shortcut.ImgFileName = null;
      this.ImgFilePhoto = this.imageUrl + this.Shortcut.ImgFile;
      return;
    }
    if (file.size < 512000) {
      this.Shortcut.ImgFileName = file.name;
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.addEventListener('load', (e1: any) => {
        var dataUrl = e1.target.result;
        var base64Data: string = dataUrl.substr(dataUrl.indexOf('base64,') + 'base64,'.length);
        this.Shortcut.ImgFile = base64Data;
        this.ImgFilePhoto = `data:image/png;base64,${base64Data}`;
      });

    } else {
      this.Shortcut.ImgFile = '';
      this.Shortcut.ImgFileFile = null;
      this.Shortcut.ImgFileName = null;
      this.ImgFilePhoto = this.imageUrl + this.Shortcut.ImgFile;
      this.toastr.error("File size should be less than 500 KB.");
    }

  }

  getShortcutList() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({})).toString()
    }
    this.dataLoading = true
    this.service.getShortcutList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.ShortcutList = response.ShortcutList;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false
    }, (err => {
      this.toastr.error(ConstantData.serverMessage)
      this.dataLoading = false;
    }))
  }

  saveShortcut() {
    this.formShortcut.control.markAllAsTouched();
    if (this.formShortcut.invalid) {
      this.toastr.error("Fill all the required fields !!")
      return
    }

    if (this.Shortcut.ShortcutId)
      this.Shortcut.UpdatedBy = this.staffLogin.StaffLoginId;
    else
      this.Shortcut.CreatedBy = this.staffLogin.StaffLoginId;
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(this.Shortcut)).toString()
    }
    this.dataLoading = true;
    this.service.saveShortcut(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        if (this.Shortcut.ShortcutId > 0) {
          this.toastr.success(ConstantData.updateMessage)
          $('#staticBackdrop').modal('hide')
        } else {
          this.toastr.success(ConstantData.submitMessage)
        }
        this.resetForm();
        this.getShortcutList()
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error(ConstantData.serverMessage)
      this.dataLoading = false;
    }))
  }

  deleteShortcut(obj: any) {
    if (confirm(ConstantData.deleteConfirmation)) {
      var request: RequestModel = {
        request: this.localService.encrypt(JSON.stringify(obj)).toString()
      }
      this.dataLoading = true;
      this.service.deleteShortcut(request).subscribe(r1 => {
        let response = r1 as any
        if (response.Message == ConstantData.SuccessMessage) {
          this.toastr.success(ConstantData.deleteMessage)
          this.getShortcutList()
        } else {
          this.toastr.error(response.Message)
          this.dataLoading = false;
        }
      }, (err => {
        this.toastr.error(ConstantData.serverMessage)
        this.dataLoading = false;
      }))
    }
  }

  editShortcut(obj: any) {
    this.resetForm()
    this.Shortcut = obj;
    if(this.Shortcut.ImgFile){
      this.ImgFilePhoto = this.imageUrl + this.Shortcut.ImgFile;
    }
    this.Shortcut.SearchMenu = this.AllMenuList.filter(x=>x.MenuId == this.Shortcut.MenuId)[0].SearchMenu;
    $('#staticBackdrop').modal('show');
  }
}

