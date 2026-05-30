import type { Meta, StoryObj } from "@storybook/angular";
import { SharePage } from "./SharePage";

const meta: Meta<SharePage> = {
  title: "Headless/SharePage",
  component: SharePage,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<SharePage>;

export const Default: Story = {};
