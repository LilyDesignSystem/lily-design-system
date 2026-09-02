import type { Meta, StoryObj } from "@storybook/angular";
import { TableTH } from "./TableTH";

// Attribute-selector component (`th[lily-table-th]`): Storybook's auto-render stub
// only knows how to mount an element selector as its own tag, so this story supplies
// the host <th> explicitly via `render`.
const meta: Meta<TableTH> = {
  title: "Headless/TableTH",
  component: TableTH,
  tags: ["autodocs"],
  render: (args) => ({
    props: args,
    moduleMetadata: { imports: [TableTH] },
    template: `<th lily-table-th [className]="className" [scope]="scope"></th>`,
  }),
};

export default meta;
type Story = StoryObj<TableTH>;

export const Default: Story = {};
