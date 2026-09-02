import type { Meta, StoryObj } from "@storybook/angular";
import { GanttTableTD } from "./GanttTableTD";

// Attribute-selector component (`td[lily-gantt-table-td]`): Storybook's auto-render stub
// only knows how to mount an element selector as its own tag, so this story supplies
// the host <td> explicitly via `render`.
const meta: Meta<GanttTableTD> = {
  title: "Headless/GanttTableTD",
  component: GanttTableTD,
  tags: ["autodocs"],
  render: (args) => ({
    props: args,
    moduleMetadata: { imports: [GanttTableTD] },
    template: `<td lily-gantt-table-td [className]="className"></td>`,
  }),
};

export default meta;
type Story = StoryObj<GanttTableTD>;

export const Default: Story = {};
