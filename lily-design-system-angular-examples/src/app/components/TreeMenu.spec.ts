import { Component } from "@angular/core";
import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { TreeMenu } from "./TreeMenu";

@Component({
    standalone: true,
    imports: [TreeMenu],
    template: `<lily-tree-menu label="Site"
        ><ul>
            <li role="treeitem" tabindex="-1">Home</li>
            <li role="treeitem" tabindex="-1">Settings</li>
            <li role="treeitem" tabindex="-1">Profile</li>
        </ul></lily-tree-menu
    >`,
})
class Host {}

function press(target: Element, key: string) {
    target.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }));
}

describe("TreeMenu", () => {
    test("renders the div root with the base class", () => {
        const fixture = TestBed.createComponent(TreeMenu);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("div.tree-menu");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(TreeMenu);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("div.tree-menu");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("is a labelled tree", () => {
        const fixture = TestBed.createComponent(Host);
        fixture.detectChanges();
        const tree = fixture.nativeElement.querySelector('[role="tree"]');
        expect(tree.getAttribute("aria-label")).toBe("Site");
    });

    test("ArrowDown and ArrowUp move focus between tree items and wrap at the ends", () => {
        const fixture = TestBed.createComponent(Host);
        fixture.detectChanges();
        document.body.appendChild(fixture.nativeElement);
        const items = Array.from(
            fixture.nativeElement.querySelectorAll('[role="treeitem"]'),
        ) as HTMLElement[];
        items[0].focus();
        press(items[0], "ArrowDown");
        expect(document.activeElement).toBe(items[1]);
        press(items[1], "ArrowUp");
        expect(document.activeElement).toBe(items[0]);
        press(items[0], "ArrowUp");
        expect(document.activeElement).toBe(items[2]);
        press(items[2], "ArrowDown");
        expect(document.activeElement).toBe(items[0]);
        fixture.nativeElement.remove();
    });

    test("Home and End jump to the first and last tree item", () => {
        const fixture = TestBed.createComponent(Host);
        fixture.detectChanges();
        document.body.appendChild(fixture.nativeElement);
        const items = Array.from(
            fixture.nativeElement.querySelectorAll('[role="treeitem"]'),
        ) as HTMLElement[];
        items[1].focus();
        press(items[1], "End");
        expect(document.activeElement).toBe(items[2]);
        press(items[2], "Home");
        expect(document.activeElement).toBe(items[0]);
        fixture.nativeElement.remove();
    });
});
