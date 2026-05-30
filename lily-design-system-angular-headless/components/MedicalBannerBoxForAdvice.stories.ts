import type { Meta, StoryObj } from "@storybook/angular";
import { MedicalBannerBoxForAdvice } from "./MedicalBannerBoxForAdvice";

const meta: Meta<MedicalBannerBoxForAdvice> = {
  title: "Headless/MedicalBannerBoxForAdvice",
  component: MedicalBannerBoxForAdvice,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<MedicalBannerBoxForAdvice>;

export const Default: Story = {};
