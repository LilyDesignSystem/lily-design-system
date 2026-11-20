import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<div\n  class="statistic"\n  role="group"\n  aria-label=""\n>\n  <!-- Title: REQUIRED. The text label/heading for the statistic. -->\n  <div class="statistic-title">\n    <!-- Consumer provides the title text -->\n  </div>\n\n  <!-- Value: REQUIRED. The pre-formatted numeric value text. -->\n  <div class="statistic-value">\n    <!-- Optional prefix (e.g. currency symbol) -->\n    <span class="statistic-prefix">\n      <!-- Consumer provides the prefix content (or remove this span if unused) -->\n    </span>\n\n    <!-- Consumer inserts the value text directly here -->\n\n    <!-- Optional suffix (e.g. unit or percentage sign) -->\n    <span class="statistic-suffix">\n      <!-- Consumer provides the suffix content (or remove this span if unused) -->\n    </span>\n  </div>\n\n  <!-- Optional change: words that name the comparison; data-trend="up", "down" or "flat" for the theme. -->\n  <div\n    class="statistic-change"\n    data-trend="up"\n  >\n    <!-- Consumer provides the change text (or remove this div if unused) -->\n  </div>\n\n  <!-- Optional as-of time: when the value was measured, in words. -->\n  <time\n    class="statistic-as-of"\n    datetime=""\n  >\n    <!-- Consumer provides the date in words (or remove this element if unused) -->\n  </time>\n</div>';

const meta = {
    title: "Headless/Statistic",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
