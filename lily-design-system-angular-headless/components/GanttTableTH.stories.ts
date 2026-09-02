import type { Meta, StoryObj } from "@storybook/angular";
import { GanttTableTH } from "./GanttTableTH";

// Attribute-selector component (`th[lily-gantt-table-th]`): Storybook's auto-render stub
// only knows how to mount an element selector as its own tag, so this story supplies
// the host <th> explicitly via `render`.
const meta: Meta<GanttTableTH> = {
  title: "Headless/GanttTableTH",
  component: GanttTableTH,
  tags: ["autodocs"],
  render: (args) => ({
    props: args,
    moduleMetadata: { imports: [GanttTableTH] },
    template: `<th lily-gantt-table-th [className]="className" [scope]="scope"></th>`,
  }),
};

export default meta;
type Story = StoryObj<GanttTableTH>;

export const Default: Story = {};
