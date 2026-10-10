// Initializes the Angular TestBed once before any spec runs.
// Required so ComponentFixture / TestBed.createComponent work.

import "zone.js";
import "zone.js/testing";
import { TestBed } from "@angular/core/testing";
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from "@angular/platform-browser-dynamic/testing";

TestBed.initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
);
