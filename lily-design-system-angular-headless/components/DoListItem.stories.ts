import type { Meta, StoryObj } from "@storybook/angular";
import { DoListItem } from "./DoListItem";

// Attribute-selector component (`li[lily-do-list-item]`): Storybook's auto-render stub
// only knows how to mount an element selector as its own tag, so this story supplies
// the host <li> explicitly via `render`.
const meta: Meta<DoListItem> = {
  title: "Headless/DoListItem",
  component: DoListItem,
  tags: ["autodocs"],
  render: (args) => ({
    props: args,
    moduleMetadata: { imports: [DoListItem] },
    template: `<li lily-do-list-item [className]="className"></li>`,
  }),
};

export default meta;
type Story = StoryObj<DoListItem>;

export const Default: Story = {};
