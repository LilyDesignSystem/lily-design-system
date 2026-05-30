import type { Meta, StoryObj } from "@storybook/angular";
import { RomaniaCodNumericPersonalInput } from "./RomaniaCodNumericPersonalInput";

const meta: Meta<RomaniaCodNumericPersonalInput> = {
  title: "Headless/RomaniaCodNumericPersonalInput",
  component: RomaniaCodNumericPersonalInput,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<RomaniaCodNumericPersonalInput>;

export const Default: Story = {};
