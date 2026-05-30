import type { Meta, StoryObj } from "@storybook/angular";
import { Loading } from "./Loading";

const meta: Meta<Loading> = {
  title: "Headless/Loading",
  component: Loading,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<Loading>;

export const Default: Story = {};
