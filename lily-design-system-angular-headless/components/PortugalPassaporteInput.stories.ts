import type { Meta, StoryObj } from "@storybook/angular";
import { PortugalPassaporteInput } from "./PortugalPassaporteInput";

const meta: Meta<PortugalPassaporteInput> = {
  title: "Headless/PortugalPassaporteInput",
  component: PortugalPassaporteInput,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<PortugalPassaporteInput>;

export const Default: Story = {};
