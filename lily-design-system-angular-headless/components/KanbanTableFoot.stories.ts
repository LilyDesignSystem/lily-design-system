import type { Meta, StoryObj } from "@storybook/angular";
import { KanbanTableFoot } from "./KanbanTableFoot";

// Attribute-selector component (`tfoot[lily-kanban-table-foot]`): Storybook's auto-render stub
// only knows how to mount an element selector as its own tag, so this story supplies
// the host <tfoot> explicitly via `render`.
const meta: Meta<KanbanTableFoot> = {
  title: "Headless/KanbanTableFoot",
  component: KanbanTableFoot,
  tags: ["autodocs"],
  render: (args) => ({
    props: args,
    moduleMetadata: { imports: [KanbanTableFoot] },
    template: `<tfoot lily-kanban-table-foot [className]="className"></tfoot>`,
  }),
};

export default meta;
type Story = StoryObj<KanbanTableFoot>;

export const Default: Story = {};
