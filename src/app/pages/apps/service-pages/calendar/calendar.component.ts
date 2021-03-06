import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';

import { Store } from '@ngrx/store';
import { CalendarComponent } from 'ng-fullcalendar';
import { Options } from 'fullcalendar';
import { BasePageComponent } from '../../../base-page';
import { IAppState } from '../../../../interfaces/app-state';
import { HttpService } from '../../../../services/http/http.service';
import { TCModalService } from '../../../../ui/services/modal/modal.service';
import { Content } from '../../../../ui/interfaces/modal';
import { GlobalService } from '../../../../services/util/GlobalService.service';
import { EventUserService } from '../../../../services/http/EventUserService.service';
import { AppointmentService } from '../../../../services/http/AppointmentService.service';
import { UserStorage } from '../../../../services/util/UserStorage.service';

@Component({
  selector: 'page-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class PageCalendarComponent extends BasePageComponent implements OnInit, OnDestroy {
  
  user: any;
  calendarOptions: Options;
  calendarEvents: any[];
  eventBody: any;
  @ViewChild(CalendarComponent) ucCalendar: CalendarComponent;
  @ViewChild('modalBody') modalBodyTpl: TemplateRef<any>;
  @ViewChild('modalFooter') modalFooterTpl: TemplateRef<any>;

  constructor(
    store: Store<IAppState>,
    httpSv: HttpService,
    private modal: TCModalService,
    private eventUserService: EventUserService,
    private appointmentService: AppointmentService
  ) {
    super(store, httpSv);

    this.pageData = {
      title: 'Calendario',
      loaded: true,
      breadcrumbs: [
     
        {
          title: 'Servicios',
          route: 'default-dashboard'
        },
        {
          title: 'Calendario'
        }
      ]
    };
    this.calendarEvents = [
     /*  {
        title: 'Cita medica',
        color: '#9d709a',
        start: this.setDate(0),
        end: this.setDate(0, 1),
        desc: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.'
      } */
     /*  {
        title: 'Cita medica',
        color: '#9d709a',
        start: this.setDate(0),
        end: this.setDate(0, 1),
        desc: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.'
      },
      {
        title: 'Cita medica',
        color: '#349d68',
        start: this.setDate(0, 2),
        end: this.setDate(0, 3),
        desc: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.'
      },
      {
        title: 'Cita medica',
        start: this.setDate(1, -1),
        end: this.setDate(1, 3),
        desc: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.'
      },
      {
        title: 'Cita medica',
        color: '#ed5564',
        start: this.setDate(1),
        end: this.setDate(1, 3),
        desc: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.'
      },
      {
        title: 'Cita medica',
        color: '#ed9661',
        start: this.setDate(1, -3),
        end: this.setDate(1, -2),
        desc: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.'
      },
      {
        title: 'Evento',
        color: '#64B5F6',
        textColor: '#000',
        start: this.setDate(3, -5),
        end: this.setDate(4),
        desc: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.'
      },
      {
        title: 'Cita medica',
        color: '#b7ce63',
        textColor: '#000',
        start: this.setDate(5, 10),
        end: this.setDate(6),
        desc: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.'
      },
      {
        title: 'Cita medica',
        color: '#e9e165',
        textColor: '#000',
        start: this.setDate(10, 4),
        end: this.setDate(11, 2),
        desc: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.'
      },
      {
        title: 'Evento',
        start: this.setDate(11, 5),
        end: this.setDate(14),
        desc: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.'
      },
      {
        title: 'Cita medica',
        color: '#1f2022',
        textColor: '#fff',
        start: this.setDate(20, 7),
        end: this.setDate(20, 8),
        desc: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.'
      } */
    ];
  }

  async ngOnInit() {
    super.ngOnInit();
    this.user = await UserStorage.getUser();
    if (this.user.rol[0] == "admin"){
      await this.loadEvents(); 
    }
    await this.loadAppointments();
    setTimeout(() => {
      this.reloadCalendarOptions();
      this.setLoaded();
    }, 500);
  
  
  }
  reloadCalendarOptions(){
    this.calendarOptions = {
      locale: 'es',
      editable: true,
      eventLimit: false,
      buttonText: {
        today: 'Hoy',
        month: 'Mes',
        week: 'Semana',
        day: 'Día',
        list: 'Lista'
      },
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'month,agendaWeek,agendaDay,listMonth'
      },
      events: this.calendarEvents
    };
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }
  async loadEvents(){
    try {
      GlobalService.ShowSweetLoading();
      const eventUser: any = await this.eventUserService.index();
      const dataEvents = eventUser.data;
      if (dataEvents){
        dataEvents.forEach(eventUser => {
          this.calendarEvents.push({ 
            title: "Evento: " + eventUser.event + "-" + eventUser.user,
            color: '#9d709a',
            start: GlobalService.getDateMoment(eventUser.date),
            end: GlobalService.getDateMoment(eventUser.date,2),
            desc: eventUser.description
          })
        });
        /* this.reloadCalendarOptions(); */
        /* this.setLoaded(); */
      }
    /*   
       */
      GlobalService.CloseSweet();
    } catch (error) {
      
      GlobalService.CloseSweet();
    }
  }
  async loadAppointments(){
    try {
      GlobalService.ShowSweetLoading();
      const appointments: any = await this.appointmentService.index();
      const dataAppointments = appointments.data;
      if (dataAppointments){
        dataAppointments.forEach((appointment) => {
     /*       */
         this.calendarEvents.push({ 
            title: "Cita: " + appointment.patient + "-" + appointment.doctor,
            color: '#349d68',
            start: GlobalService.getDateMoment(appointment.date,0,"YYYY-MM-DD HH:mm"),
            end: GlobalService.getDateMoment(appointment.date,2,"YYYY-MM-DD HH:mm"),
            desc: "Cita: " + appointment.patient + "-" + appointment.doctor + ", Condicion:" + appointment.condition
          });
        });
     /*    this.reloadCalendarOptions();
        this.setLoaded(); */
      }
      
      
      GlobalService.CloseSweet();
    } catch (error) {
      
      GlobalService.CloseSweet();
    }
  }
  setDate(day: number, hour: number = 0) {
    let date = new Date();

    date.setDate(date.getDate() + day);
    date.setHours(date.getHours() + hour);

    return date;
  }

  dateFormat(date: any) {
    return date.toString().slice(4, 21);
  }

  eventClick(data: any) {
    this.eventBody = {
      title: data.event.title,
      color: data.event.color,
      from: this.dateFormat(data.event.start),
      to:  this.dateFormat(data.event.end),
      desc: data.event.desc
    };
    this.openModal(this.modalBodyTpl, null, this.modalFooterTpl)
  }

  // open modal window
  openModal<T>(body: Content<T>, header: Content<T> = null, footer: Content<T> = null, options: any = null) {
    this.modal.open({
      body: body,
      header: header,
      footer: footer,
      options: options
    });
  }

  // close modal window
  closeModal() {
    this.modal.close();
    this.eventBody = {};
  }
}
