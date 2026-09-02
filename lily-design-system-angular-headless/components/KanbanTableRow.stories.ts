import type { Meta, StoryObj } from "@storybook/angular";
import { KanbanTableRow } from "./KanbanTableRow";

// Attribute-selector component (`tr[lily-kanban-table-row]`): Storybook's auto-render stub
// only knows how to mount an element selector as its own tag, so this story supplies
// the host <tr> explicitly via `render`.
const meta: Meta<KanbanTableRow> = {
  title: "Headless/KanbanTableRow",
  component: KanbanTableRow,
  tags: ["autodocs"],
  render: (args) => ({
    props: args,
    moduleMetadata: { imports: [KanbanTableRow] },
    template: `<tr lily-kanban-table-row [className]="className"></tr>`,
  }),
};

export default meta;
type Story = StoryObj<KanbanTableRow>;

export const Default: Story = {};
