import type { Meta, StoryObj } from "@storybook/angular";
import { FeaturePhoto } from "./FeaturePhoto";

const meta: Meta<FeaturePhoto> = {
  title: "Headless/FeaturePhoto",
  component: FeaturePhoto,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<FeaturePhoto>;

export const Default: Story = {};
