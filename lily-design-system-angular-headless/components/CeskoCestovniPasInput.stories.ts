import type { Meta, StoryObj } from "@storybook/angular";
import { CeskoCestovniPasInput } from "./CeskoCestovniPasInput";

const meta: Meta<CeskoCestovniPasInput> = {
  title: "Headless/CeskoCestovniPasInput",
  component: CeskoCestovniPasInput,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<CeskoCestovniPasInput>;

export const Default: Story = {};
