import type { Meta, StoryObj } from "@storybook/angular";
import { KanbanTableBody } from "./KanbanTableBody";

// Attribute-selector component (`tbody[lily-kanban-table-body]`): Storybook's auto-render stub
// only knows how to mount an element selector as its own tag, so this story supplies
// the host <tbody> explicitly via `render`.
const meta: Meta<KanbanTableBody> = {
  title: "Headless/KanbanTableBody",
  component: KanbanTableBody,
  tags: ["autodocs"],
  render: (args) => ({
    props: args,
    moduleMetadata: { imports: [KanbanTableBody] },
    template: `<tbody lily-kanban-table-body [className]="className"></tbody>`,
  }),
};

export default meta;
type Story = StoryObj<KanbanTableBody>;

export const Default: Story = {};
