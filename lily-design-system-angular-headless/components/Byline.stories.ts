import type { Meta, StoryObj } from "@storybook/angular";
import { Byline } from "./Byline";

const meta: Meta<Byline> = {
  title: "Headless/Byline",
  component: Byline,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<Byline>;

export const Default: Story = {};
