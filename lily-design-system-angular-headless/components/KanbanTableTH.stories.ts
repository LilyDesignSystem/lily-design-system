import type { Meta, StoryObj } from "@storybook/angular";
import { KanbanTableTH } from "./KanbanTableTH";

// Attribute-selector component (`th[lily-kanban-table-th]`): Storybook's auto-render stub
// only knows how to mount an element selector as its own tag, so this story supplies
// the host <th> explicitly via `render`.
const meta: Meta<KanbanTableTH> = {
  title: "Headless/KanbanTableTH",
  component: KanbanTableTH,
  tags: ["autodocs"],
  render: (args) => ({
    props: args,
    moduleMetadata: { imports: [KanbanTableTH] },
    template: `<th lily-kanban-table-th [className]="className" [scope]="scope"></th>`,
  }),
};

export default meta;
type Story = StoryObj<KanbanTableTH>;

export const Default: Story = {};
