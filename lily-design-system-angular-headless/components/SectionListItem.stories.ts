import type { Meta, StoryObj } from "@storybook/angular";
import { SectionListItem } from "./SectionListItem";

// Attribute-selector component (`li[lily-section-list-item]`): Storybook's auto-render stub
// only knows how to mount an element selector as its own tag, so this story supplies
// the host <li> explicitly via `render`.
const meta: Meta<SectionListItem> = {
  title: "Headless/SectionListItem",
  component: SectionListItem,
  tags: ["autodocs"],
  render: (args) => ({
    props: args,
    moduleMetadata: { imports: [SectionListItem] },
    template: `<li lily-section-list-item [className]="className"></li>`,
  }),
};

export default meta;
type Story = StoryObj<SectionListItem>;

export const Default: Story = {};
