import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { CallToAction } from "../components/CallToAction";
import { ClipboardCopyButton } from "../components/ClipboardCopyButton";
import { FloatButton } from "../components/FloatButton";
import { ScrollerVideo } from "../components/ScrollerVideo";
import { TimerButton } from "../components/TimerButton";
import { VideoPlayer } from "../components/VideoPlayer";
import { Visible } from "../components/Visible";

// Actions and media, driven by e2e/actions.spec.ts. The video files do not exist: the spec stubs playback.
@Component({
    selector: "lily-actions",
    standalone: true,
    imports: [CallToAction, ClipboardCopyButton, FloatButton, ScrollerVideo, TimerButton, VideoPlayer, Visible],
    template: `
    <article class="page-wrapper">
      <h1>Actions and media</h1>

      <lily-clipboard-copy-button text="copy me" label="Copy" (copySuccess)="copies.set(copies() + 1)" (copyError)="copyError.set('yes')" data-testid="copy">Copy</lily-clipboard-copy-button>
      <p data-testid="copy-state">Copies: {{ copies() }}, failed: {{ copyError() }}</p>

      <lily-timer-button label="Continue" [duration]="2" (fired)="timer.set(timer() + 1)" data-testid="timer">Continue</lily-timer-button>
      <lily-timer-button label="Long" [duration]="60" (fired)="pressed.set(pressed() + 1)" data-testid="timer-long">Long</lily-timer-button>
      <p data-testid="timer-state">Timer: {{ timer() }}, pressed: {{ pressed() }}</p>

      <lily-float-button label="Help" position="top-right" (click)="floats.set(floats() + 1)" data-testid="float">?</lily-float-button>
      <p data-testid="float-state">Floats: {{ floats() }}</p>

      <lily-call-to-action href="#join" data-testid="cta-link">Join</lily-call-to-action>
      <lily-call-to-action (click)="cta.set(cta() + 1)" data-testid="cta-button">Act</lily-call-to-action>
      <p data-testid="cta-state">Acted: {{ cta() }}</p>

      <div style="block-size: 150vh">Scroll down</div>

      <lily-visible [(visible)]="seen" data-testid="visible">
        <p>{{ seen() ? "On screen" : "Off screen" }}</p>
      </lily-visible>

      <lily-video-player src="/none.webm" label="Tour" [autoplay]="true" [muted]="true" data-testid="video" />

      <div style="block-size: 150vh"></div>

      <lily-scroller-video src="/none.webm" label="Story" alt="A river" (indexChange)="index.set($event)" (progressChange)="progress.set($event)" data-testid="scroller">
        <section style="block-size: 100vh">One</section>
        <section style="block-size: 100vh">Two</section>
      </lily-scroller-video>
      <p data-testid="scroller-state" style="position: fixed; bottom: 0">Step: {{ index() }}, moved: {{ progress() > 0 }}</p>
    </article>
  `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ActionsPage {
    protected readonly copies = signal(0);
    protected readonly copyError = signal("no");
    protected readonly timer = signal(0);
    protected readonly pressed = signal(0);
    protected readonly floats = signal(0);
    protected readonly cta = signal(0);
    protected readonly seen = signal(false);
    protected readonly index = signal(-1);
    protected readonly progress = signal(0);
}
