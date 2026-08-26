import { Component, ChangeDetectionStrategy } from "@angular/core";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { BreadcrumbNav } from "../components/BreadcrumbNav";
import { BreadcrumbList } from "../components/BreadcrumbList";
import { BreadcrumbListItem } from "../components/BreadcrumbListItem";
import { Sidebar } from "../components/Sidebar";
import { Panel } from "../components/Panel";

@Component({
  selector: "lily-page-layout",
  standalone: true,
  imports: [Header, Footer, BreadcrumbNav, BreadcrumbList, BreadcrumbListItem, Sidebar, Panel],
  template: `
    <article class="page-wrapper">
      <h1>Page layout</h1>

      <!-- Direct class-hook markup: the element-selector wrapper hosts
           break the ol>li structure axe requires; see timeline-and-cards. -->
      <nav class="breadcrumb-nav" aria-label="Breadcrumb">
        <ol class="breadcrumb-list">
          <li class="breadcrumb-list-item"><a href="/">Home</a></li>
          <li class="breadcrumb-list-item" aria-current="page">Page layout</li>
        </ol>
      </nav>

      <div style="display: flex; flex-wrap: wrap; gap: 1rem;">
        <lily-sidebar label="Page navigation" style="flex: 1 1 240px; min-width: 0;">
          <ul>
            <li><a href="#section-1">Section 1</a></li>
            <li><a href="#section-2">Section 2</a></li>
          </ul>
        </lily-sidebar>
        <article style="flex: 999 1 320px; min-width: 0;">
          <lily-panel label="Summary">
            <h2 id="section-1">Section 1</h2>
            <p>Example panel content.</p>
          </lily-panel>
        </article>
      </div>
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PageLayoutPage {

}
