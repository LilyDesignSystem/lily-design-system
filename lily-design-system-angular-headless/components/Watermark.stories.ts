import type { Meta, StoryObj } from "@storybook/angular";
import { Watermark } from "./Watermark";

const meta: Meta<Watermark> = {
  title: "Headless/Watermark",
  component: Watermark,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<Watermark>;

export const Default: Story = {};
