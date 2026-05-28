import { Component, ChangeDetectionStrategy } from "@angular/core";
import { Card, Badge, Progress, Banner } from "lily-design-system-angular-headless";

@Component({
  selector: "lily-dashboard",
  standalone: true,
  imports: [Card, Badge, Progress, Banner],
  template: `
    <article class="page-wrapper">
      <h1>Dashboard</h1>
      <lily-banner label="System status">All systems operational.</lily-banner>

      <section style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem; margin-top: 1rem;">
        <lily-card>
          <h2>Active users</h2>
          <p>1,284 <lily-badge>+12%</lily-badge></p>
        </lily-card>
        <lily-card>
          <h2>Upload</h2>
          <lily-progress label="Sprint progress" [value]="42" [max]="100" />
        </lily-card>
        <lily-card>
          <h2>Open tickets</h2>
          <p>17 <lily-badge>3 new</lily-badge></p>
        </lily-card>
      </section>
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class DashboardPage {

}
