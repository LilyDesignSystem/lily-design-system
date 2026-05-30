import type { Meta, StoryObj } from "@storybook/angular";
import { NederlandPaspoortNummerView } from "./NederlandPaspoortNummerView";

const meta: Meta<NederlandPaspoortNummerView> = {
  title: "Headless/NederlandPaspoortNummerView",
  component: NederlandPaspoortNummerView,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<NederlandPaspoortNummerView>;

export const Default: Story = {};
