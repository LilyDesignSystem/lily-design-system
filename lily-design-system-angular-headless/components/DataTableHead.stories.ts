import type { Meta, StoryObj } from "@storybook/angular";
import { DataTableHead } from "./DataTableHead";

// Attribute-selector component (`thead[lily-data-table-head]`): Storybook's auto-render stub
// only knows how to mount an element selector as its own tag, so this story supplies
// the host <thead> explicitly via `render`.
const meta: Meta<DataTableHead> = {
  title: "Headless/DataTableHead",
  component: DataTableHead,
  tags: ["autodocs"],
  render: (args) => ({
    props: args,
    moduleMetadata: { imports: [DataTableHead] },
    template: `<thead lily-data-table-head [className]="className"></thead>`,
  }),
};

export default meta;
type Story = StoryObj<DataTableHead>;

export const Default: Story = {};
