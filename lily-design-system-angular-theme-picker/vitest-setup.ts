// Initializes the Angular TestBed once before any spec runs.
// Required so ComponentFixture / TestBed.createComponent work.

import "zone.js";
import "zone.js/testing";
import { TestBed } from "@angular/core/testing";
import {
    BrowserDynamicTestingModule,
    platformBrowserDynamicTesting,
} from "@angular/platform-browser-dynamic/testing";

TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());

// The picker keeps the choice in a cookie by default (lily-{name}), and jsdom keeps cookies for the whole file, so a
// choice made in one test would start the next. Clear every cookie before each test.
import { beforeEach } from "vitest";
beforeEach(() => {
    if (typeof document === "undefined") return;
    for (const part of document.cookie.split(";")) {
        const name = part.split("=")[0]?.trim();
        if (name) document.cookie = `${name}=; Path=/; Max-Age=0`;
    }
});
