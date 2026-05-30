import type { Meta, StoryObj } from "@storybook/angular";
import { AspectRatioContainer } from "./AspectRatioContainer";

const meta: Meta<AspectRatioContainer> = {
  title: "Headless/AspectRatioContainer",
  component: AspectRatioContainer,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<AspectRatioContainer>;

export const Default: Story = {};
