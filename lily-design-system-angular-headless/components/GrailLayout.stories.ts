import type { Meta, StoryObj } from "@storybook/angular";
import { GrailLayout } from "./GrailLayout";

const meta: Meta<GrailLayout> = {
  title: "Headless/GrailLayout",
  component: GrailLayout,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<GrailLayout>;

export const Default: Story = {};
