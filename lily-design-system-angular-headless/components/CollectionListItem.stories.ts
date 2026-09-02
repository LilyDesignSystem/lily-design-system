import type { Meta, StoryObj } from "@storybook/angular";
import { CollectionListItem } from "./CollectionListItem";

// Attribute-selector component (`li[lily-collection-list-item]`): Storybook's auto-render stub
// only knows how to mount an element selector as its own tag, so this story supplies
// the host <li> explicitly via `render`.
const meta: Meta<CollectionListItem> = {
  title: "Headless/CollectionListItem",
  component: CollectionListItem,
  tags: ["autodocs"],
  render: (args) => ({
    props: args,
    moduleMetadata: { imports: [CollectionListItem] },
    template: `<li lily-collection-list-item [className]="className"></li>`,
  }),
};

export default meta;
type Story = StoryObj<CollectionListItem>;

export const Default: Story = {};
