import type { Meta, StoryObj } from "@storybook/angular";
import { RomaniaPasaportInput } from "./RomaniaPasaportInput";

const meta: Meta<RomaniaPasaportInput> = {
  title: "Headless/RomaniaPasaportInput",
  component: RomaniaPasaportInput,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<RomaniaPasaportInput>;

export const Default: Story = {};
