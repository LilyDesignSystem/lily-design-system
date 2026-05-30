import type { Meta, StoryObj } from "@storybook/angular";
import { NetPromoterScoreView } from "./NetPromoterScoreView";

const meta: Meta<NetPromoterScoreView> = {
  title: "Headless/NetPromoterScoreView",
  component: NetPromoterScoreView,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<NetPromoterScoreView>;

export const Default: Story = {};
