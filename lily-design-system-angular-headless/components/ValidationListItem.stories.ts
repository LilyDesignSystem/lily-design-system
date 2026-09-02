import type { Meta, StoryObj } from "@storybook/angular";
import { ValidationListItem } from "./ValidationListItem";

// Attribute-selector component (`li[lily-validation-list-item]`): Storybook's auto-render stub
// only knows how to mount an element selector as its own tag, so this story supplies
// the host <li> explicitly via `render`.
const meta: Meta<ValidationListItem> = {
  title: "Headless/ValidationListItem",
  component: ValidationListItem,
  tags: ["autodocs"],
  render: (args) => ({
    props: args,
    moduleMetadata: { imports: [ValidationListItem] },
    template: `<li lily-validation-list-item [className]="className"></li>`,
  }),
};

export default meta;
type Story = StoryObj<ValidationListItem>;

export const Default: Story = {};
