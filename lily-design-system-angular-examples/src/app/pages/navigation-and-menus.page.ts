import { Component, ChangeDetectionStrategy } from "@angular/core";
import { NavigationMenu } from "../components/NavigationMenu";
import { MenuBar } from "../components/MenuBar";
import { MenuBarButton } from "../components/MenuBarButton";
import { HamburgerMenu } from "../components/HamburgerMenu";

@Component({
  selector: "lily-navigation-and-menus",
  standalone: true,
  imports: [NavigationMenu, MenuBar, MenuBarButton, HamburgerMenu],
  template: `
    <article class="page-wrapper">
      <h1>Navigation and menus</h1>

      <lily-navigation-menu label="Primary">
        <a href="#">Home</a>
        <a href="#">Dashboard</a>
        <a href="#">Settings</a>
      </lily-navigation-menu>

      <lily-menu-bar label="Editing">
        <lily-menu-bar-button>File</lily-menu-bar-button>
        <lily-menu-bar-button>Edit</lily-menu-bar-button>
        <lily-menu-bar-button>View</lily-menu-bar-button>
      </lily-menu-bar>

      <lily-hamburger-menu label="Mobile menu">
        <a href="#">Home</a>
        <a href="#">Dashboard</a>
      </lily-hamburger-menu>
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class NavigationAndMenusPage {

}
