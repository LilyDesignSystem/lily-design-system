import type { Meta, StoryObj } from "@storybook/angular";
import { DataTableTD } from "./DataTableTD";

// Attribute-selector component (`td[lily-data-table-td]`): Storybook's auto-render stub
// only knows how to mount an element selector as its own tag, so this story supplies
// the host <td> explicitly via `render`.
const meta: Meta<DataTableTD> = {
  title: "Headless/DataTableTD",
  component: DataTableTD,
  tags: ["autodocs"],
  render: (args) => ({
    props: args,
    moduleMetadata: { imports: [DataTableTD] },
    template: `<td lily-data-table-td [className]="className"></td>`,
  }),
};

export default meta;
type Story = StoryObj<DataTableTD>;

export const Default: Story = {};
