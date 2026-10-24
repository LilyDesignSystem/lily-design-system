import type { Meta, StoryObj } from "@storybook/angular";
import { ConvertFromDiv } from "./ConvertFromDiv";

const meta: Meta<ConvertFromDiv> = {
  title: "Headless/ConvertFromDiv",
  component: ConvertFromDiv,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<ConvertFromDiv>;

export const Default: Story = {};
