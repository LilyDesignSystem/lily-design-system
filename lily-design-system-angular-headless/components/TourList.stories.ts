import type { Meta, StoryObj } from "@storybook/angular";
import { TourList } from "./TourList";

const meta: Meta<TourList> = {
  title: "Headless/TourList",
  component: TourList,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<TourList>;

export const Default: Story = {};
