import type { Meta, StoryObj } from "@storybook/angular";
import { Footnote } from "./Footnote";

const meta: Meta<Footnote> = {
  title: "Headless/Footnote",
  component: Footnote,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<Footnote>;

export const Default: Story = {};
