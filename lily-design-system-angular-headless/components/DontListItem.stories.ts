import type { Meta, StoryObj } from "@storybook/angular";
import { DontListItem } from "./DontListItem";

// Attribute-selector component (`li[lily-dont-list-item]`): Storybook's auto-render stub
// only knows how to mount an element selector as its own tag, so this story supplies
// the host <li> explicitly via `render`.
const meta: Meta<DontListItem> = {
  title: "Headless/DontListItem",
  component: DontListItem,
  tags: ["autodocs"],
  render: (args) => ({
    props: args,
    moduleMetadata: { imports: [DontListItem] },
    template: `<li lily-dont-list-item [className]="className"></li>`,
  }),
};

export default meta;
type Story = StoryObj<DontListItem>;

export const Default: Story = {};
