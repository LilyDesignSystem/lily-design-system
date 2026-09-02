import type { Meta, StoryObj } from "@storybook/angular";
import { TableFoot } from "./TableFoot";

// Attribute-selector component (`tfoot[lily-table-foot]`): Storybook's auto-render stub
// only knows how to mount an element selector as its own tag, so this story supplies
// the host <tfoot> explicitly via `render`.
const meta: Meta<TableFoot> = {
  title: "Headless/TableFoot",
  component: TableFoot,
  tags: ["autodocs"],
  render: (args) => ({
    props: args,
    moduleMetadata: { imports: [TableFoot] },
    template: `<tfoot lily-table-foot [className]="className"></tfoot>`,
  }),
};

export default meta;
type Story = StoryObj<TableFoot>;

export const Default: Story = {};
