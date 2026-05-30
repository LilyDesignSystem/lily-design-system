import type { Meta, StoryObj } from "@storybook/angular";
import { TileMap } from "./TileMap";

const meta: Meta<TileMap> = {
  title: "Headless/TileMap",
  component: TileMap,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<TileMap>;

export const Default: Story = {};
