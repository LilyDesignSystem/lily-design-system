import type { Meta, StoryObj } from "@storybook/angular";
import { ContainerWithFluidWidth } from "./ContainerWithFluidWidth";

const meta: Meta<ContainerWithFluidWidth> = {
  title: "Headless/ContainerWithFluidWidth",
  component: ContainerWithFluidWidth,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<ContainerWithFluidWidth>;

export const Default: Story = {};
