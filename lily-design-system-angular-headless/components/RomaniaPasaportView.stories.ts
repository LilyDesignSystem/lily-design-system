import type { Meta, StoryObj } from "@storybook/angular";
import { RomaniaPasaportView } from "./RomaniaPasaportView";

const meta: Meta<RomaniaPasaportView> = {
  title: "Headless/RomaniaPasaportView",
  component: RomaniaPasaportView,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<RomaniaPasaportView>;

export const Default: Story = {};
