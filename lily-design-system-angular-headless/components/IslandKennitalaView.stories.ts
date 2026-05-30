import type { Meta, StoryObj } from "@storybook/angular";
import { IslandKennitalaView } from "./IslandKennitalaView";

const meta: Meta<IslandKennitalaView> = {
  title: "Headless/IslandKennitalaView",
  component: IslandKennitalaView,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<IslandKennitalaView>;

export const Default: Story = {};
