import type { Meta, StoryObj } from "@storybook/angular";
import { DataTableBody } from "./DataTableBody";

// Attribute-selector component (`tbody[lily-data-table-body]`): Storybook's auto-render stub
// only knows how to mount an element selector as its own tag, so this story supplies
// the host <tbody> explicitly via `render`.
const meta: Meta<DataTableBody> = {
  title: "Headless/DataTableBody",
  component: DataTableBody,
  tags: ["autodocs"],
  render: (args) => ({
    props: args,
    moduleMetadata: { imports: [DataTableBody] },
    template: `<tbody lily-data-table-body [className]="className"></tbody>`,
  }),
};

export default meta;
type Story = StoryObj<DataTableBody>;

export const Default: Story = {};
