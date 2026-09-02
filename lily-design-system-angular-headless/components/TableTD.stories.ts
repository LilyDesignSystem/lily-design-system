import type { Meta, StoryObj } from "@storybook/angular";
import { TableTD } from "./TableTD";

// Attribute-selector component (`td[lily-table-td]`): Storybook's auto-render stub
// only knows how to mount an element selector as its own tag, so this story supplies
// the host <td> explicitly via `render`.
const meta: Meta<TableTD> = {
  title: "Headless/TableTD",
  component: TableTD,
  tags: ["autodocs"],
  render: (args) => ({
    props: args,
    moduleMetadata: { imports: [TableTD] },
    template: `<td lily-table-td [className]="className"></td>`,
  }),
};

export default meta;
type Story = StoryObj<TableTD>;

export const Default: Story = {};
