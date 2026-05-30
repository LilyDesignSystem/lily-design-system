import type { Meta, StoryObj } from "@storybook/angular";
import { MedicalBannerBoxForDanger } from "./MedicalBannerBoxForDanger";

const meta: Meta<MedicalBannerBoxForDanger> = {
  title: "Headless/MedicalBannerBoxForDanger",
  component: MedicalBannerBoxForDanger,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<MedicalBannerBoxForDanger>;

export const Default: Story = {};
