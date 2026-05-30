import type { Meta, StoryObj } from "@storybook/angular";
import { FeatureCard } from "./FeatureCard";

const meta: Meta<FeatureCard> = {
  title: "Headless/FeatureCard",
  component: FeatureCard,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<FeatureCard>;

export const Default: Story = {};
