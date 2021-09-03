// Core modules
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

// Application model and services
import { StatsModel } from '@shared/models/stats.model';

/**
 * Application stats component on dashboard
 */
@Component({
  selector: 'dashboard-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss'],
})
export class StatsComponent implements OnChanges {

  @Input() stats: StatsModel;

  /**
   * Life cycle init method
   */
  ngOnChanges(simpleChanges: SimpleChanges): void {
    this.stats = simpleChanges.stats.currentValue;
  }
}
