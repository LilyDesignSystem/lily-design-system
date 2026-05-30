import type { Meta, StoryObj } from "@storybook/angular";
import { PolskaPeselInput } from "./PolskaPeselInput";

const meta: Meta<PolskaPeselInput> = {
  title: "Headless/PolskaPeselInput",
  component: PolskaPeselInput,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<PolskaPeselInput>;

export const Default: Story = {};
