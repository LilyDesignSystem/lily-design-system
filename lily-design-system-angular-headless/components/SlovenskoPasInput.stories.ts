import type { Meta, StoryObj } from "@storybook/angular";
import { SlovenskoPasInput } from "./SlovenskoPasInput";

const meta: Meta<SlovenskoPasInput> = {
  title: "Headless/SlovenskoPasInput",
  component: SlovenskoPasInput,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<SlovenskoPasInput>;

export const Default: Story = {};
