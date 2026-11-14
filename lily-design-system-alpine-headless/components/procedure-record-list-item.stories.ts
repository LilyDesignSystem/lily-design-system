import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<ul\n  class="procedure-record-list"\n  data-status="known"\n  aria-label="Procedures"\n>\n  <li\n    class="procedure-record-list-item"\n    data-status="completed"\n  >\n    <span class="procedure-record-list-item-procedure">Appendectomy</span>\n    <span class="procedure-record-list-item-status">Completed</span>\n    <time\n      class="procedure-record-list-item-performed"\n      datetime="2018-04-22"\n      >22 Apr 2018</time\n    >\n  </li>\n</ul>';

const meta = {
    title: "Headless/Procedure Record List Item",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
