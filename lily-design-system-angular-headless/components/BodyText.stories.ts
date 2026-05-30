import type { Meta, StoryObj } from "@storybook/angular";
import { BodyText } from "./BodyText";

const meta: Meta<BodyText> = {
  title: "Headless/BodyText",
  component: BodyText,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<BodyText>;

export const Default: Story = {};
