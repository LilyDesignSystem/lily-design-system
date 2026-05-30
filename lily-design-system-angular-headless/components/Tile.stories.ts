import type { Meta, StoryObj } from "@storybook/angular";
import { Tile } from "./Tile";

const meta: Meta<Tile> = {
  title: "Headless/Tile",
  component: Tile,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<Tile>;

export const Default: Story = {};
