import type { Meta, StoryObj } from "@storybook/angular";
import { GanttTableThead } from "./GanttTableThead";

// Attribute-selector component (`thead[lily-gantt-table-thead]`): Storybook's auto-render stub
// only knows how to mount an element selector as its own tag, so this story supplies
// the host <thead> explicitly via `render`.
const meta: Meta<GanttTableThead> = {
  title: "Headless/GanttTableThead",
  component: GanttTableThead,
  tags: ["autodocs"],
  render: (args) => ({
    props: args,
    moduleMetadata: { imports: [GanttTableThead] },
    template: `<thead lily-gantt-table-thead [className]="className"></thead>`,
  }),
};

export default meta;
type Story = StoryObj<GanttTableThead>;

export const Default: Story = {};
