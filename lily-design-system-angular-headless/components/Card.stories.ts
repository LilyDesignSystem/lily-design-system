import type { Meta, StoryObj } from "@storybook/angular";
import { Card } from "./Card";

const meta: Meta<Card> = {
  title: "Headless/Card",
  component: Card,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<Card>;

export const Default: Story = {};
