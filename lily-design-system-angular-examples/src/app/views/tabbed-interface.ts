import { Component, ChangeDetectionStrategy, signal } from "@angular/core";
import { TabBar } from "../components/TabBar";
import { TabBarButton } from "../components/TabBarButton";
import { TabPanel } from "../components/TabPanel";

@Component({
    selector: "lily-tabbed-interface",
    standalone: true,
    imports: [TabBar, TabBarButton, TabPanel],
    template: `
    <article class="page-wrapper">
      <h1>Tabbed interface</h1>

      <lily-tab-bar label="Sections">
        <lily-tab-bar-button id="tab-overview" controls="panel-overview" [selected]="active() === 'overview'" (click)="active.set('overview')">Overview</lily-tab-bar-button>
        <lily-tab-bar-button id="tab-details" controls="panel-details" [selected]="active() === 'details'" (click)="active.set('details')">Details</lily-tab-bar-button>
      </lily-tab-bar>

      <lily-tab-panel id="panel-overview" labelledBy="tab-overview" [selected]="active() === 'overview'">Overview content.</lily-tab-panel>
      <lily-tab-panel id="panel-details" labelledBy="tab-details" [selected]="active() === 'details'">Details content.</lily-tab-panel>
    </article>
  `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class TabbedInterfacePage {
    protected active = signal<"overview" | "details">("overview");
}
