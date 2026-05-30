import type { Meta, StoryObj } from "@storybook/angular";
import { InsetText } from "./InsetText";

const meta: Meta<InsetText> = {
  title: "Headless/InsetText",
  component: InsetText,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<InsetText>;

export const Default: Story = {};
