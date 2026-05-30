import type { Meta, StoryObj } from "@storybook/angular";
import { SuomiHenkilotunnusInput } from "./SuomiHenkilotunnusInput";

const meta: Meta<SuomiHenkilotunnusInput> = {
  title: "Headless/SuomiHenkilotunnusInput",
  component: SuomiHenkilotunnusInput,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<SuomiHenkilotunnusInput>;

export const Default: Story = {};
