import type { Meta, StoryObj } from "@storybook/angular";
import { DataTableRow } from "./DataTableRow";

// Attribute-selector component (`tr[lily-data-table-row]`): Storybook's auto-render stub
// only knows how to mount an element selector as its own tag, so this story supplies
// the host <tr> explicitly via `render`.
const meta: Meta<DataTableRow> = {
  title: "Headless/DataTableRow",
  component: DataTableRow,
  tags: ["autodocs"],
  render: (args) => ({
    props: args,
    moduleMetadata: { imports: [DataTableRow] },
    template: `<tr lily-data-table-row [className]="className"></tr>`,
  }),
};

export default meta;
type Story = StoryObj<DataTableRow>;

export const Default: Story = {};
