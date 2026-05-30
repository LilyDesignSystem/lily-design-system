import type { Meta, StoryObj } from "@storybook/angular";
import { NederlandPaspoortNummerInput } from "./NederlandPaspoortNummerInput";

const meta: Meta<NederlandPaspoortNummerInput> = {
  title: "Headless/NederlandPaspoortNummerInput",
  component: NederlandPaspoortNummerInput,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<NederlandPaspoortNummerInput>;

export const Default: Story = {};
