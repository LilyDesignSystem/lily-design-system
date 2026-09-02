import type { Meta, StoryObj } from "@storybook/angular";
import { TableHead } from "./TableHead";

// Attribute-selector component (`thead[lily-table-head]`): Storybook's auto-render stub
// only knows how to mount an element selector as its own tag, so this story supplies
// the host <thead> explicitly via `render`.
const meta: Meta<TableHead> = {
  title: "Headless/TableHead",
  component: TableHead,
  tags: ["autodocs"],
  render: (args) => ({
    props: args,
    moduleMetadata: { imports: [TableHead] },
    template: `<thead lily-table-head [className]="className"></thead>`,
  }),
};

export default meta;
type Story = StoryObj<TableHead>;

export const Default: Story = {};
