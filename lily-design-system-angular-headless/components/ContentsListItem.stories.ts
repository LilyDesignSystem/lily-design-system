import type { Meta, StoryObj } from "@storybook/angular";
import { ContentsListItem } from "./ContentsListItem";

// Attribute-selector component (`li[lily-contents-list-item]`): Storybook's auto-render stub
// only knows how to mount an element selector as its own tag, so this story supplies
// the host <li> explicitly via `render`.
const meta: Meta<ContentsListItem> = {
  title: "Headless/ContentsListItem",
  component: ContentsListItem,
  tags: ["autodocs"],
  render: (args) => ({
    props: args,
    moduleMetadata: { imports: [ContentsListItem] },
    template: `<li lily-contents-list-item [className]="className"></li>`,
  }),
};

export default meta;
type Story = StoryObj<ContentsListItem>;

export const Default: Story = {};
