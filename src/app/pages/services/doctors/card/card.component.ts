import { Component, OnInit, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'tc-doctor-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class TCDoctorCardComponent implements OnInit {
	@HostBinding('class.tc-contact') true;

	@Input() data: any;

  constructor() {}

  ngOnInit() {}
}
