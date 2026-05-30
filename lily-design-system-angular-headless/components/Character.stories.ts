import type { Meta, StoryObj } from "@storybook/angular";
import { Character } from "./Character";

const meta: Meta<Character> = {
  title: "Headless/Character",
  component: Character,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<Character>;

export const Default: Story = {};
