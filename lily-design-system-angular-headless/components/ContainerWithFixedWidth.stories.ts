import type { Meta, StoryObj } from "@storybook/angular";
import { ContainerWithFixedWidth } from "./ContainerWithFixedWidth";

const meta: Meta<ContainerWithFixedWidth> = {
  title: "Headless/ContainerWithFixedWidth",
  component: ContainerWithFixedWidth,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<ContainerWithFixedWidth>;

export const Default: Story = {};
