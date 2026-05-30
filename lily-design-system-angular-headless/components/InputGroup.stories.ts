import type { Meta, StoryObj } from "@storybook/angular";
import { InputGroup } from "./InputGroup";

const meta: Meta<InputGroup> = {
  title: "Headless/InputGroup",
  component: InputGroup,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<InputGroup>;

export const Default: Story = {};
