import type { Meta, StoryObj } from "@storybook/angular";
import { CharacterCounter } from "./CharacterCounter";

const meta: Meta<CharacterCounter> = {
  title: "Headless/CharacterCounter",
  component: CharacterCounter,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<CharacterCounter>;

export const Default: Story = {};
