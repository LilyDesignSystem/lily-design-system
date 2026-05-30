import type { Meta, StoryObj } from "@storybook/angular";
import { CeskoCestovniPasView } from "./CeskoCestovniPasView";

const meta: Meta<CeskoCestovniPasView> = {
  title: "Headless/CeskoCestovniPasView",
  component: CeskoCestovniPasView,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<CeskoCestovniPasView>;

export const Default: Story = {};
