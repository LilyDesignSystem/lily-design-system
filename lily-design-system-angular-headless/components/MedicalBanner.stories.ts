import type { Meta, StoryObj } from "@storybook/angular";
import { MedicalBanner } from "./MedicalBanner";

const meta: Meta<MedicalBanner> = {
  title: "Headless/MedicalBanner",
  component: MedicalBanner,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<MedicalBanner>;

export const Default: Story = {};
