import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
declare let bootstrap: any;

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})

export class ModalComponent implements OnInit {

  // https://stackoverflow.com/questions/44053227/how-to-emit-an-event-from-parent-to-child

  @Output() close = new EventEmitter<Event>();
  @Input() show: Observable<void>;
  @Input() hide: Observable<void>;
  @Input() title: string = "wildCART";
  @Input() size: string = "";
  @Input() mode: boolean = false; // false->cerrar; true->si/no (no implementado)

  private eventsSubscriptionShow: Subscription;
  private eventsSubscriptionHide: Subscription;

  myModal: any;

  constructor() { }

  ngOnInit() {
    this.eventsSubscriptionShow = this.show.subscribe(() => this.showModal());
    this.eventsSubscriptionHide = this.hide.subscribe(() => this.hideModal());
  }

  ngOnDestroy() {
    this.eventsSubscriptionShow.unsubscribe();
    this.eventsSubscriptionHide.unsubscribe();
  }

  showModal = () => {
    this.myModal = new bootstrap.Modal(document.getElementById('myModal'), {
      keyboard: false
    })
    var myModalEl = document.getElementById('myModal');
    myModalEl.addEventListener('hidden.bs.modal', (event): void => {
      this.close.emit(event);
    })
    this.myModal.show()
  }

  hideModal = () => {
    this.myModal.hide();
  }

}
