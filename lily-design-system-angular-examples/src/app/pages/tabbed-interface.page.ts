import { Component, ChangeDetectionStrategy, signal } from "@angular/core";
import { TabBar, TabBarButton, TabPanel } from "lily-design-system-angular-headless";

@Component({
  selector: "lily-tabbed-interface",
  standalone: true,
  imports: [TabBar, TabBarButton, TabPanel],
  template: `
    <article class="page-wrapper">
      <h1>Tabbed interface</h1>

      <lily-tab-bar label="Sections">
        <lily-tab-bar-button (click)="active.set('overview')">Overview</lily-tab-bar-button>
        <lily-tab-bar-button (click)="active.set('details')">Details</lily-tab-bar-button>
      </lily-tab-bar>

      @if (active() === 'overview') {
        <lily-tab-panel>Overview content.</lily-tab-panel>
      }
      @if (active() === 'details') {
        <lily-tab-panel>Details content.</lily-tab-panel>
      }
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class TabbedInterfacePage {
  protected active = signal<'overview' | 'details'>('overview');
}
