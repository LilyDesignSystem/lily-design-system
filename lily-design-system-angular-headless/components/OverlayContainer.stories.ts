import type { Meta, StoryObj } from "@storybook/angular";
import { OverlayContainer } from "./OverlayContainer";

const meta: Meta<OverlayContainer> = {
  title: "Headless/OverlayContainer",
  component: OverlayContainer,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<OverlayContainer>;

export const Default: Story = {};
