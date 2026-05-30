import type { Meta, StoryObj } from "@storybook/angular";
import { PostalCodeView } from "./PostalCodeView";

const meta: Meta<PostalCodeView> = {
  title: "Headless/PostalCodeView",
  component: PostalCodeView,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<PostalCodeView>;

export const Default: Story = {};
