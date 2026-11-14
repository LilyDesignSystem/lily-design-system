import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<ul\n  class="immunization-record-list"\n  data-status="known"\n  aria-label="Immunizations"\n>\n  <li\n    class="immunization-record-list-item"\n    data-status="completed"\n  >\n    <span class="immunization-record-list-item-vaccine">MMR vaccine</span>\n    <time\n      class="immunization-record-list-item-occurrence"\n      datetime="2025-09-12"\n      >12 Sep 2025</time\n    >\n    <span class="immunization-record-list-item-dose-number">Dose 2 of 2</span>\n    <span class="immunization-record-list-item-status">Given</span>\n    <span class="immunization-record-list-item-lot-number">AB1234</span>\n  </li>\n</ul>';

const meta = {
    title: "Headless/Immunization Record List Item",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
