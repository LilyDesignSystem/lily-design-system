import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<span\n  class="observation-view"\n  data-interpretation="H"\n  data-status="final"\n  ><span class="screen-reader-span">Potassium </span\n  ><span class="observation-view-value">5.9</span>&#160;<span class="observation-view-unit"\n    >mmol/L</span\n  >\n  <span class="observation-view-flag">High</span>\n  <span class="observation-view-range">3.5–5.3</span>\n  <span class="observation-view-range"\n    ><span class="observation-view-range-label">Critical</span> above 6.5</span\n  >\n  <meter\n    class="observation-view-meter"\n    aria-hidden="true"\n    value="5.9"\n    min="2"\n    max="8"\n    low="3.5"\n    high="5.3"\n    optimum="4.4"\n  ></meter\n></span>';

const meta = {
    title: "Headless/Observation View",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
