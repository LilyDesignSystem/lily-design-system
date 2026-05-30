import type { Meta, StoryObj } from "@storybook/angular";
import { MaltaPassportNumberInput } from "./MaltaPassportNumberInput";

const meta: Meta<MaltaPassportNumberInput> = {
  title: "Headless/MaltaPassportNumberInput",
  component: MaltaPassportNumberInput,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<MaltaPassportNumberInput>;

export const Default: Story = {};
