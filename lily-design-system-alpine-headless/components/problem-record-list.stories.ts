import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<ul\n  class="problem-record-list"\n  data-status="known"\n  aria-label="Problems"\n>\n  <li\n    class="problem-record-list-item"\n    data-clinical-status="active"\n    data-verification-status="confirmed"\n  >\n    <span class="problem-record-list-item-condition">Type 2 diabetes</span>\n    <span class="problem-record-list-item-clinical-status">Active</span>\n    <span class="problem-record-list-item-verification-status">Confirmed</span>\n    <span class="problem-record-list-item-severity">Moderate</span>\n    <time\n      class="problem-record-list-item-onset"\n      datetime="2019-06-01"\n      >Since June 2019</time\n    >\n    <time\n      class="problem-record-list-item-abatement"\n      datetime="2024-01-15"\n      >Resolved 15 Jan 2024</time\n    >\n  </li>\n</ul>';

const meta = {
    title: "Headless/Problem Record List",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
