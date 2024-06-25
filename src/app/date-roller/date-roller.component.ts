

// email-view.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-date-roller',
  templateUrl: './date-roller.component.html',
  styleUrls: ['./date-roller.component.css'],
})
export class DateRollerComponent {
  days = Array.from({ length: 31 }, (_, i) => i + 1);
  months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  years = Array.from({ length: 50 }, (_, i) => 2024 - i);

  selectedDay = 1;
  selectedMonth = 'Jan';
  selectedYear = 2024;

  private debounceScroll = false;

  onScroll(event: WheelEvent, type: 'day' | 'hour' | 'minute') {
    if (this.debounceScroll) {
     // event.preventDefault();
      return;
    }

    this.debounceScroll = true;
    setTimeout(() => this.debounceScroll = false, 200);

    event.preventDefault();
    const delta = Math.sign(event.deltaY);
    console.log(delta)

    switch (type) {
      case 'day':
        this.selectedDay = this.changeValue(this.selectedDay, delta, 1, 31);
        break;
      case 'hour':
        const monthIndex = this.months.indexOf(this.selectedMonth);
        this.selectedMonth = this.months[this.changeValue(monthIndex, delta, 0, 11)];
        break;
      case 'minute':
        this.selectedYear = this.changeValue(this.selectedYear, delta, 2024 - 49, 2024);
        break;
    }
  }

  private changeValue(current: number, delta: number, min: number, max: number): number {
    let newValue = current + delta;
    if (newValue < min) newValue = min;
    if (newValue > max) newValue = max;
    return newValue;
  }
}
