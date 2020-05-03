import { Component, OnInit, HostBinding, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'tc-specialty-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class TCSpecialtyCardComponent implements OnInit {
	@HostBinding('class.tc-contact') true;

	@Input() data: any;
  @Output() handleAction: EventEmitter<any> = new EventEmitter();
  
  constructor() {}

  onEdit(){
    this.handleAction.emit({ type: "edit", data: this.data})
  }
  onDelete(){
    this.handleAction.emit({ type: "delete", data: this.data})
  }
  ngOnInit() {}
}
