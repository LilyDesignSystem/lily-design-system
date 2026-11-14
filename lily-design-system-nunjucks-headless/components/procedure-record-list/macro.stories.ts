import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<ul class="procedure-record-list" data-status="known" aria-label="Procedures"><li class="procedure-record-list-item" data-status="completed"><span class="procedure-record-list-item-procedure">Appendectomy</span> <span class="procedure-record-list-item-status">Completed</span> <time class="procedure-record-list-item-performed" datetime="2018-04-22">22 Apr 2018</time></li></ul>`;

const meta = {
    title: "Headless/ProcedureRecordList",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
