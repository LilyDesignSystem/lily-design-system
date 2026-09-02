import type { Meta, StoryObj } from "@storybook/angular";
import { DescriptionListItem } from "./DescriptionListItem";

// Attribute-selector component (`li[lily-description-list-item]`): Storybook's auto-render stub
// only knows how to mount an element selector as its own tag, so this story supplies
// the host <li> explicitly via `render`.
const meta: Meta<DescriptionListItem> = {
  title: "Headless/DescriptionListItem",
  component: DescriptionListItem,
  tags: ["autodocs"],
  render: (args) => ({
    props: args,
    moduleMetadata: { imports: [DescriptionListItem] },
    template: `<li lily-description-list-item [className]="className"></li>`,
  }),
};

export default meta;
type Story = StoryObj<DescriptionListItem>;

export const Default: Story = {};
