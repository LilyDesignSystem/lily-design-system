import type { Meta, StoryObj } from "@storybook/angular";
import { DanmarkPersonnummerInput } from "./DanmarkPersonnummerInput";

const meta: Meta<DanmarkPersonnummerInput> = {
  title: "Headless/DanmarkPersonnummerInput",
  component: DanmarkPersonnummerInput,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<DanmarkPersonnummerInput>;

export const Default: Story = {};
