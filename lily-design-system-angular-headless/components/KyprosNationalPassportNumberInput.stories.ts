import type { Meta, StoryObj } from "@storybook/angular";
import { KyprosNationalPassportNumberInput } from "./KyprosNationalPassportNumberInput";

const meta: Meta<KyprosNationalPassportNumberInput> = {
  title: "Headless/KyprosNationalPassportNumberInput",
  component: KyprosNationalPassportNumberInput,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<KyprosNationalPassportNumberInput>;

export const Default: Story = {};
