import { Component, ChangeDetectionStrategy } from "@angular/core";
import { RouterLink } from "@angular/router";

@Component({
  selector: "lily-home",
  standalone: true,
  imports: [RouterLink],
  template: `
    <article class="page-wrapper">
      <h1>Lily Design System — Angular examples</h1>
      <p>
        A reference application that demonstrates every component in the
        Lily Design System catalog using headless Angular components
        plus the NHS UK visual reference. Built on Angular 20 + Analog.js.
      </p>

      <h2>Browse</h2>
      <ul>
        <li><a routerLink="/components">All 487 components</a></li>
      </ul>

      <h2>Composed-page demos</h2>
      <ul>
        <li><a routerLink="/contact-form">Contact form</a></li>
        <li><a routerLink="/dashboard">Dashboard</a></li>
        <li><a routerLink="/dialog-flow">Dialog flow</a></li>
        <li><a routerLink="/file-upload-form">File upload form</a></li>
        <li><a routerLink="/navigation-and-menus">Navigation and menus</a></li>
        <li><a routerLink="/page-layout">Page layout</a></li>
        <li><a routerLink="/rating-and-feedback">Rating and feedback</a></li>
        <li><a routerLink="/search-and-filter">Search and filter</a></li>
        <li><a routerLink="/settings-page">Settings page</a></li>
        <li><a routerLink="/tabbed-interface">Tabbed interface</a></li>
        <li><a routerLink="/task-management">Task management</a></li>
        <li><a routerLink="/timeline-and-cards">Timeline and cards</a></li>
      </ul>
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomePage {}
