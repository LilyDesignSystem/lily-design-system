import type { Meta, StoryObj } from "@storybook/angular";
import { NorgeFodselsnummerInput } from "./NorgeFodselsnummerInput";

const meta: Meta<NorgeFodselsnummerInput> = {
  title: "Headless/NorgeFodselsnummerInput",
  component: NorgeFodselsnummerInput,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<NorgeFodselsnummerInput>;

export const Default: Story = {};
