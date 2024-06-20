import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-date-roller',
  templateUrl: './date-roller.component.html',
  styleUrls: ['./date-roller.component.css'],
})
export class DateRollerComponent implements OnInit {
  days: number[] = [];
  months = [
    { name: 'Hours', value: 1 },
    { name: 'Days', value: 2 },
    { name: 'Months', value: 3 },
  ];
  years = [
    { name: 'before due', value: 1 },
    { name: 'after due', value: 2 },
    { name: 'after invoice', value: 3 },
  ];

  selectedDay: number | undefined;
  selectedDuration: string | undefined;
  selectedOption: string | undefined;

  ngOnInit() {
    this.initializeDays();
    this.selectedDay = this.selectedDay;
    this.selectedDuration = this.selectedDuration;
    this.selectedOption = this.selectedOption;
  }

  initializeDays() {
    for (let i = 1; i <= 99; i++) {
      this.days.push(i);
    }
  }

  day(event: any) {
    this.selectedDay = event.target.value;
    console.log(this.selectedDay);
  }
  month(event: any) {
    //this.selectedDuration = event.target.value;
    const length = this.months.length.valueOf();
    for (let i = 0; i < length; i++) {
      if (event.target.value == this.months[i].value) {
        {
          this.selectedDuration = this.months[i].name;
        }
      }
      console.log(this.selectedDuration);
    }
  }

  year(event: any) {
    //this.selectedDuration = event.target.value;
    const length = this.years.length.valueOf();
    for (let i = 0; i < length; i++) {
      if (event.target.value == this.years[i].value) {
        {
          this.selectedOption = this.years[i].name;
        }
      }
      console.log(this.selectedDay + ' ' + this.selectedDuration + ' ' + this.selectedOption);
    }
  }
}
