import type { Meta, StoryObj } from "@storybook/angular";
import { DataTableFoot } from "./DataTableFoot";

// Attribute-selector component (`tfoot[lily-data-table-foot]`): Storybook's auto-render stub
// only knows how to mount an element selector as its own tag, so this story supplies
// the host <tfoot> explicitly via `render`.
const meta: Meta<DataTableFoot> = {
  title: "Headless/DataTableFoot",
  component: DataTableFoot,
  tags: ["autodocs"],
  render: (args) => ({
    props: args,
    moduleMetadata: { imports: [DataTableFoot] },
    template: `<tfoot lily-data-table-foot [className]="className"></tfoot>`,
  }),
};

export default meta;
type Story = StoryObj<DataTableFoot>;

export const Default: Story = {};
