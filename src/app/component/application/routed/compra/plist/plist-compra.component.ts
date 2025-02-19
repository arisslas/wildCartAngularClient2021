import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { IPageCompra } from 'src/app/model/compra-interfaces';
import { CompraService } from 'src/app/service/compra.service';
import { PaginationService } from 'src/app/service/pagination.service';
import { IconService } from 'src/app/service/icon.service';
import { IUsuario } from 'src/app/model/usuario-interfaces';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-plist-compra',
  templateUrl: './plist-compra.component.html',
  styleUrls: ['./plist-compra.component.css']
})
export class PlistCompraComponent implements OnInit {
  strEntity: string = "compra"
  strOperation: string = "plist"
  strTitleSingular: string = "Compra";
  strTitlePlural: string = "Compras";
  strFilteredMessage: string = "";
  aPaginationBar: string[];
  strSortField: string = "";
  strSortDirection: string = "";
  strResult: string = null;
  strFilter: string = "";
  aCompras: any[];
  nTotalElements: number;
  nTotalPages: number;
  nPage: number;
  nPageSize: number = 10;
  id2ShowViewModal: number = 0;
  oUserSession: IUsuario;
  subjectFiltro$ = new Subject();

  id_factura: number;
  id_producto: number;

  constructor(
    private oRoute: ActivatedRoute,
    private oRouter: Router,
    private oPaginationService: PaginationService,
    private oCompraService: CompraService,
    private oActivatedRoute: ActivatedRoute,
    public oIconService: IconService
  ) {

    if (this.oRoute.snapshot.data.message) {
      this.oUserSession = this.oRoute.snapshot.data.message;
      localStorage.setItem("user", JSON.stringify(this.oRoute.snapshot.data.message));
    } else {
      localStorage.clear();
      oRouter.navigate(['/home']);
    }

    this.id_factura = this.oActivatedRoute.snapshot.params.id_factura;
    if (this.id_factura) {
      this.strFilteredMessage = "Listado filtrado por el tipo de producto " + this.id_factura;
    } else {
      this.strFilteredMessage = "";
    }

    this.id_producto = this.oActivatedRoute.snapshot.params.id_producto;
    if (this.id_producto) {
      this.strFilteredMessage = "Listado filtrado por el tipo de producto " + this.id_producto;
    } else {
      this.strFilteredMessage = "";
    }

    this.nPage = 1;
    this.getPage();
  }

  ngOnInit(): void {
    this.subjectFiltro$.pipe(
      debounceTime(1000)
    ).subscribe(() => this.getPage());
  }

  getPage = () => {
    console.log("buscando...", this.strFilter);
    this.oCompraService.getPage(this.nPageSize, this.nPage, this.strFilter, this.strSortField, this.strSortDirection, this.id_factura, this.id_producto).subscribe((oPage: IPageCompra) => {
      if (this.strFilter) {
        this.strFilteredMessage = "Listado filtrado: " + this.strFilter;
      } else {
        this.strFilteredMessage = "";
      }
      this.aCompras = oPage.content;
      this.nTotalElements = oPage.totalElements;
      this.nTotalPages = oPage.totalPages;
      this.aPaginationBar  = this.oPaginationService.pagination(this.nTotalPages, this.nPage);
    })
  }

  jumpToPage = () => {
    this.getPage();
    return false;
  }

  onKeyUpFilter(event: KeyboardEvent): void {
    this.subjectFiltro$.next();
  }

  doResetOrder() {
    this.strSortField = "";
    this.strSortDirection = "";
    this.getPage();
  }

  doSetOrder(order: string) {
    this.strSortField = order;
    if (this.strSortDirection == 'asc') {
      this.strSortDirection = 'desc';
    } else if (this.strSortDirection == 'desc') {
      this.strSortDirection = '';
    } else {
      this.strSortDirection = 'asc';
    }
    this.getPage();
  }
}