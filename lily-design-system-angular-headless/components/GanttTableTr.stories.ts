import type { Meta, StoryObj } from "@storybook/angular";
import { GanttTableTr } from "./GanttTableTr";

// Attribute-selector component (`tr[lily-gantt-table-tr]`): Storybook's auto-render stub
// only knows how to mount an element selector as its own tag, so this story supplies
// the host <tr> explicitly via `render`.
const meta: Meta<GanttTableTr> = {
  title: "Headless/GanttTableTr",
  component: GanttTableTr,
  tags: ["autodocs"],
  render: (args) => ({
    props: args,
    moduleMetadata: { imports: [GanttTableTr] },
    template: `<tr lily-gantt-table-tr [className]="className"></tr>`,
  }),
};

export default meta;
type Story = StoryObj<GanttTableTr>;

export const Default: Story = {};
