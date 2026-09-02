import type { Meta, StoryObj } from "@storybook/angular";
import { GanttTableTbody } from "./GanttTableTbody";

// Attribute-selector component (`tbody[lily-gantt-table-tbody]`): Storybook's auto-render stub
// only knows how to mount an element selector as its own tag, so this story supplies
// the host <tbody> explicitly via `render`.
const meta: Meta<GanttTableTbody> = {
  title: "Headless/GanttTableTbody",
  component: GanttTableTbody,
  tags: ["autodocs"],
  render: (args) => ({
    props: args,
    moduleMetadata: { imports: [GanttTableTbody] },
    template: `<tbody lily-gantt-table-tbody [className]="className"></tbody>`,
  }),
};

export default meta;
type Story = StoryObj<GanttTableTbody>;

export const Default: Story = {};
