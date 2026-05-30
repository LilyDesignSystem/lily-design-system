import type { Meta, StoryObj } from "@storybook/angular";
import { Flair } from "./Flair";

const meta: Meta<Flair> = {
  title: "Headless/Flair",
  component: Flair,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<Flair>;

export const Default: Story = {};
