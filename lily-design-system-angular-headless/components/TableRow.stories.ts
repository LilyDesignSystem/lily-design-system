import type { Meta, StoryObj } from "@storybook/angular";
import { TableRow } from "./TableRow";

// Attribute-selector component (`tr[lily-table-row]`): Storybook's auto-render stub
// only knows how to mount an element selector as its own tag, so this story supplies
// the host <tr> explicitly via `render`.
const meta: Meta<TableRow> = {
  title: "Headless/TableRow",
  component: TableRow,
  tags: ["autodocs"],
  render: (args) => ({
    props: args,
    moduleMetadata: { imports: [TableRow] },
    template: `<tr lily-table-row [className]="className"></tr>`,
  }),
};

export default meta;
type Story = StoryObj<TableRow>;

export const Default: Story = {};
