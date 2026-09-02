import type { Meta, StoryObj } from "@storybook/angular";
import { TableBody } from "./TableBody";

// Attribute-selector component (`tbody[lily-table-body]`): Storybook's auto-render stub
// only knows how to mount an element selector as its own tag, so this story supplies
// the host <tbody> explicitly via `render`.
const meta: Meta<TableBody> = {
  title: "Headless/TableBody",
  component: TableBody,
  tags: ["autodocs"],
  render: (args) => ({
    props: args,
    moduleMetadata: { imports: [TableBody] },
    template: `<tbody lily-table-body [className]="className"></tbody>`,
  }),
};

export default meta;
type Story = StoryObj<TableBody>;

export const Default: Story = {};
