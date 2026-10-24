import type { Meta, StoryObj } from "@storybook/angular";
import { ConvertIntoDiv } from "./ConvertIntoDiv";

const meta: Meta<ConvertIntoDiv> = {
  title: "Headless/ConvertIntoDiv",
  component: ConvertIntoDiv,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<ConvertIntoDiv>;

export const Default: Story = {};
