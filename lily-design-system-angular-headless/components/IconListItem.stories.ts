import type { Meta, StoryObj } from "@storybook/angular";
import { IconListItem } from "./IconListItem";

// Attribute-selector component (`li[lily-icon-list-item]`): Storybook's auto-render stub
// only knows how to mount an element selector as its own tag, so this story supplies
// the host <li> explicitly via `render`.
const meta: Meta<IconListItem> = {
  title: "Headless/IconListItem",
  component: IconListItem,
  tags: ["autodocs"],
  render: (args) => ({
    props: args,
    moduleMetadata: { imports: [IconListItem] },
    template: `<li lily-icon-list-item [className]="className"></li>`,
  }),
};

export default meta;
type Story = StoryObj<IconListItem>;

export const Default: Story = {};
