import type { Meta, StoryObj } from "@storybook/angular";
import { KanbanTableTD } from "./KanbanTableTD";

// Attribute-selector component (`td[lily-kanban-table-td]`): Storybook's auto-render stub
// only knows how to mount an element selector as its own tag, so this story supplies
// the host <td> explicitly via `render`.
const meta: Meta<KanbanTableTD> = {
  title: "Headless/KanbanTableTD",
  component: KanbanTableTD,
  tags: ["autodocs"],
  render: (args) => ({
    props: args,
    moduleMetadata: { imports: [KanbanTableTD] },
    template: `<td lily-kanban-table-td [className]="className"></td>`,
  }),
};

export default meta;
type Story = StoryObj<KanbanTableTD>;

export const Default: Story = {};
