import type { Meta, StoryObj } from "@storybook/angular";
import { KanbanTableHead } from "./KanbanTableHead";

// Attribute-selector component (`thead[lily-kanban-table-head]`): Storybook's auto-render stub
// only knows how to mount an element selector as its own tag, so this story supplies
// the host <thead> explicitly via `render`.
const meta: Meta<KanbanTableHead> = {
  title: "Headless/KanbanTableHead",
  component: KanbanTableHead,
  tags: ["autodocs"],
  render: (args) => ({
    props: args,
    moduleMetadata: { imports: [KanbanTableHead] },
    template: `<thead lily-kanban-table-head [className]="className"></thead>`,
  }),
};

export default meta;
type Story = StoryObj<KanbanTableHead>;

export const Default: Story = {};
