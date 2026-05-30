import type { Meta, StoryObj } from "@storybook/angular";
import { LietuvaAsmensKodasView } from "./LietuvaAsmensKodasView";

const meta: Meta<LietuvaAsmensKodasView> = {
  title: "Headless/LietuvaAsmensKodasView",
  component: LietuvaAsmensKodasView,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<LietuvaAsmensKodasView>;

export const Default: Story = {};
