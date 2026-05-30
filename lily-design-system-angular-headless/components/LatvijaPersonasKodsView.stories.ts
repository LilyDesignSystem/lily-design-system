import type { Meta, StoryObj } from "@storybook/angular";
import { LatvijaPersonasKodsView } from "./LatvijaPersonasKodsView";

const meta: Meta<LatvijaPersonasKodsView> = {
  title: "Headless/LatvijaPersonasKodsView",
  component: LatvijaPersonasKodsView,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<LatvijaPersonasKodsView>;

export const Default: Story = {};
