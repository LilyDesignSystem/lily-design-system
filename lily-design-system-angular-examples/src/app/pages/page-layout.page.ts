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

      <lily-breadcrumb-nav label="Breadcrumb">
        <lily-breadcrumb-list>
          <lily-breadcrumb-list-item><a href="/">Home</a></lily-breadcrumb-list-item>
          <lily-breadcrumb-list-item>Page layout</lily-breadcrumb-list-item>
        </lily-breadcrumb-list>
      </lily-breadcrumb-nav>

      <div style="display: grid; grid-template-columns: minmax(0, 240px) minmax(0, 1fr); gap: 1rem;">
        <lily-sidebar label="Page navigation">
          <ul>
            <li><a href="#section-1">Section 1</a></li>
            <li><a href="#section-2">Section 2</a></li>
          </ul>
        </lily-sidebar>
        <article>
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
