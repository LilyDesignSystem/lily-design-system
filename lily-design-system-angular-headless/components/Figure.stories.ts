import type { Meta, StoryObj } from "@storybook/angular";
import { Figure } from "./Figure";

const meta: Meta<Figure> = {
  title: "Headless/Figure",
  component: Figure,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<Figure>;

export const Default: Story = {};
