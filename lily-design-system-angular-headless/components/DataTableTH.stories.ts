import type { Meta, StoryObj } from "@storybook/angular";
import { DataTableTH } from "./DataTableTH";

// Attribute-selector component (`th[lily-data-table-th]`): Storybook's auto-render stub
// only knows how to mount an element selector as its own tag, so this story supplies
// the host <th> explicitly via `render`.
const meta: Meta<DataTableTH> = {
  title: "Headless/DataTableTH",
  component: DataTableTH,
  tags: ["autodocs"],
  render: (args) => ({
    props: args,
    moduleMetadata: { imports: [DataTableTH] },
    template: `<th lily-data-table-th [className]="className" [scope]="scope"></th>`,
  }),
};

export default meta;
type Story = StoryObj<DataTableTH>;

export const Default: Story = {};
