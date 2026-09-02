import type { Meta, StoryObj } from "@storybook/angular";
import { Option } from "./Option";

// Attribute-selector component (`option[lily-option]`): Storybook's auto-render stub
// only knows how to mount an element selector as its own tag, so this story supplies
// the host <option> explicitly via `render`.
const meta: Meta<Option> = {
  title: "Headless/Option",
  component: Option,
  tags: ["autodocs"],
  render: (args) => ({
    props: args,
    moduleMetadata: { imports: [Option] },
    template: `<option lily-option [className]="className" [value]="value"></option>`,
  }),
};

export default meta;
type Story = StoryObj<Option>;

export const Default: Story = {};
