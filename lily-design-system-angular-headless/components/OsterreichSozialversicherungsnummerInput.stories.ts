import type { Meta, StoryObj } from "@storybook/angular";
import { OsterreichSozialversicherungsnummerInput } from "./OsterreichSozialversicherungsnummerInput";

const meta: Meta<OsterreichSozialversicherungsnummerInput> = {
  title: "Headless/OsterreichSozialversicherungsnummerInput",
  component: OsterreichSozialversicherungsnummerInput,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<OsterreichSozialversicherungsnummerInput>;

export const Default: Story = {};
