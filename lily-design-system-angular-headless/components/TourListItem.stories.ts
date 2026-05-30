import type { Meta, StoryObj } from "@storybook/angular";
import { TourListItem } from "./TourListItem";

const meta: Meta<TourListItem> = {
  title: "Headless/TourListItem",
  component: TourListItem,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<TourListItem>;

export const Default: Story = {};
