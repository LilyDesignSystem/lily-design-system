import type { Meta, StoryObj } from "@storybook/angular";
import { GrailLayoutCenterMain } from "./GrailLayoutCenterMain";

const meta: Meta<GrailLayoutCenterMain> = {
  title: "Headless/GrailLayoutCenterMain",
  component: GrailLayoutCenterMain,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<GrailLayoutCenterMain>;

export const Default: Story = {};
