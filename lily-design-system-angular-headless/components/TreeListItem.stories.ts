import type { Meta, StoryObj } from "@storybook/angular";
import { TreeListItem } from "./TreeListItem";

// Attribute-selector component (`li[lily-tree-list-item]`): Storybook's auto-render stub
// only knows how to mount an element selector as its own tag, so this story supplies
// the host <li> explicitly via `render`.
const meta: Meta<TreeListItem> = {
  title: "Headless/TreeListItem",
  component: TreeListItem,
  tags: ["autodocs"],
  render: (args) => ({
    props: args,
    moduleMetadata: { imports: [TreeListItem] },
    template: `<li lily-tree-list-item [className]="className"></li>`,
  }),
};

export default meta;
type Story = StoryObj<TreeListItem>;

export const Default: Story = {};
