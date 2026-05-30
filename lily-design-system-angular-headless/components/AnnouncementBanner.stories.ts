import type { Meta, StoryObj } from "@storybook/angular";
import { AnnouncementBanner } from "./AnnouncementBanner";

const meta: Meta<AnnouncementBanner> = {
  title: "Headless/AnnouncementBanner",
  component: AnnouncementBanner,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<AnnouncementBanner>;

export const Default: Story = {};
