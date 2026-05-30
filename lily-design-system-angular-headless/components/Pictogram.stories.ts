import type { Meta, StoryObj } from "@storybook/angular";
import { Pictogram } from "./Pictogram";

const meta: Meta<Pictogram> = {
  title: "Headless/Pictogram",
  component: Pictogram,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<Pictogram>;

export const Default: Story = {};
