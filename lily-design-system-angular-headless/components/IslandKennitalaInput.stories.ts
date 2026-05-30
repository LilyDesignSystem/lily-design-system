import type { Meta, StoryObj } from "@storybook/angular";
import { IslandKennitalaInput } from "./IslandKennitalaInput";

const meta: Meta<IslandKennitalaInput> = {
  title: "Headless/IslandKennitalaInput",
  component: IslandKennitalaInput,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<IslandKennitalaInput>;

export const Default: Story = {};
