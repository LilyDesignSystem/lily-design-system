import type { Meta, StoryObj } from "@storybook/angular";
import { GanttTableTfoot } from "./GanttTableTfoot";

// Attribute-selector component (`tfoot[lily-gantt-table-tfoot]`): Storybook's auto-render stub
// only knows how to mount an element selector as its own tag, so this story supplies
// the host <tfoot> explicitly via `render`.
const meta: Meta<GanttTableTfoot> = {
  title: "Headless/GanttTableTfoot",
  component: GanttTableTfoot,
  tags: ["autodocs"],
  render: (args) => ({
    props: args,
    moduleMetadata: { imports: [GanttTableTfoot] },
    template: `<tfoot lily-gantt-table-tfoot [className]="className"></tfoot>`,
  }),
};

export default meta;
type Story = StoryObj<GanttTableTfoot>;

export const Default: Story = {};
