import type { Meta, StoryObj } from "@storybook/angular";
import { Notification } from "./Notification";

const meta: Meta<Notification> = {
  title: "Headless/Notification",
  component: Notification,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<Notification>;

export const Default: Story = {};
