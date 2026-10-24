import type { Meta, StoryObj } from "@storybook/angular";
import { ConvertFromValueDiv } from "./ConvertFromValueDiv";

const meta: Meta<ConvertFromValueDiv> = {
  title: "Headless/ConvertFromValueDiv",
  component: ConvertFromValueDiv,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<ConvertFromValueDiv>;

export const Default: Story = {};
