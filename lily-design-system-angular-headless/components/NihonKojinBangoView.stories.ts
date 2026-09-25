import type { Meta, StoryObj } from "@storybook/angular";
import { NihonKojinBangoView } from "./NihonKojinBangoView";

const meta: Meta<NihonKojinBangoView> = {
  title: "Headless/NihonKojinBangoView",
  component: NihonKojinBangoView,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<NihonKojinBangoView>;

export const Default: Story = {};
