import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<div\n  class="scroller-video"\n  role="group"\n  aria-label=""\n  data-offset="0.5"\n>\n  <div\n    class="scroller-video-background"\n    role="img"\n    aria-roledescription="scrollable video"\n    aria-label=""\n  >\n    <video\n      class="scroller-video-element"\n      src=""\n      muted\n      playsinline\n      preload="auto"\n    ></video>\n  </div>\n  <div\n    class="scroller-video-foreground scroller-base"\n    data-offset="0.5"\n  >\n    <!-- Consumer provides step children -->\n  </div>\n</div>';

const meta = {
    title: "Headless/Scroller Video",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
