import type { Meta, StoryObj } from "@storybook/angular";
import { StepListItem } from "./StepListItem";

// Attribute-selector component (`li[lily-step-list-item]`): Storybook's auto-render stub
// only knows how to mount an element selector as its own tag, so this story supplies
// the host <li> explicitly via `render`.
const meta: Meta<StepListItem> = {
  title: "Headless/StepListItem",
  component: StepListItem,
  tags: ["autodocs"],
  render: (args) => ({
    props: args,
    moduleMetadata: { imports: [StepListItem] },
    template: `<li lily-step-list-item [className]="className"></li>`,
  }),
};

export default meta;
type Story = StoryObj<StepListItem>;

export const Default: Story = {};
