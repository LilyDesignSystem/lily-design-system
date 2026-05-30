import type { Meta, StoryObj } from "@storybook/angular";
import { MedicalBannerBox } from "./MedicalBannerBox";

const meta: Meta<MedicalBannerBox> = {
  title: "Headless/MedicalBannerBox",
  component: MedicalBannerBox,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<MedicalBannerBox>;

export const Default: Story = {};
