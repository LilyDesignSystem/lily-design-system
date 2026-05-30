import type { Meta, StoryObj } from "@storybook/angular";
import { Popup } from "./Popup";

const meta: Meta<Popup> = {
  title: "Headless/Popup",
  component: Popup,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<Popup>;

export const Default: Story = {};
