import type { Meta, StoryObj } from "@storybook/angular";
import { AiLabel } from "./AiLabel";

const meta: Meta<AiLabel> = {
  title: "Headless/AiLabel",
  component: AiLabel,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<AiLabel>;

export const Default: Story = {};
