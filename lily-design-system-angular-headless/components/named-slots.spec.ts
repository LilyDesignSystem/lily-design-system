import { Component } from "@angular/core";
import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { Byline } from "./Byline";
import { FeaturePhoto } from "./FeaturePhoto";
import { Headline } from "./Headline";
import { HeroHeadline } from "./HeroHeadline";
import { IconListItem } from "./IconListItem";
import { InfoState } from "./InfoState";
import { InputGroup } from "./InputGroup";
import { Pictogram } from "./Pictogram";
import { Statistic } from "./Statistic";

// A Svelte Snippet prop is a named <ng-content select="[prop]"> here. Each slot must land in the wrapper Svelte renders it in.
@Component({
    standalone: true,
    imports: [Byline, FeaturePhoto, Headline, HeroHeadline, IconListItem, InfoState, InputGroup, Pictogram, Statistic],
    template: `
        <lily-byline><b published>P</b><b updated>U</b>A</lily-byline>
        <lily-feature-photo><b caption>C</b><b credit>R</b></lily-feature-photo>
        <lily-headline><b subtitle>S</b><b byline>Y</b>H</lily-headline>
        <lily-hero-headline><b media>M</b>H</lily-hero-headline>
        <ul><li lily-icon-list-item><b icon>I</b>T</li></ul>
        <lily-info-state><b illustration>L</b><b action>N</b></lily-info-state>
        <lily-input-group><b prefix>P</b><input /><b suffix>S</b></lily-input-group>
        <lily-pictogram><b icon>I</b>T</lily-pictogram>
        <lily-statistic><b prefix>P</b><b suffix>S</b></lily-statistic>
    `,
})
class Slots {}

describe("named slots", () => {
    const text = (selector: string) => {
        const fixture = TestBed.createComponent(Slots);
        fixture.detectChanges();
        return fixture.nativeElement.querySelector(selector).textContent.trim();
    };

    test.each([
        [".byline-authors", "A"],
        [".byline-published", "P"],
        [".byline-updated", "U"],
        [".feature-photo-caption-text", "C"],
        [".feature-photo-credit", "R"],
        [".headline-subtitle", "S"],
        [".headline-byline", "Y"],
        [".headline-heading", "H"],
        [".icon-list-item-icon", "I"],
        [".icon-list-item-text", "T"],
        [".info-state-illustration", "L"],
        [".info-state-action", "N"],
        [".input-group-prefix", "P"],
        [".input-group-suffix", "S"],
        [".pictogram-icon", "I"],
        [".pictogram-caption", "T"],
        [".statistic-prefix", "P"],
        [".statistic-suffix", "S"],
    ])("%s holds %s", (selector, expected) => {
        expect(text(selector)).toBe(expected);
    });

    test("hero-headline puts its media first", () => {
        const fixture = TestBed.createComponent(Slots);
        fixture.detectChanges();
        const root = fixture.nativeElement.querySelector(".hero-headline");
        expect(root.textContent.trim()).toBe("MH");
    });
});
