import type { Meta, StoryObj } from "@storybook/angular";
import { MaltaNationalIdentificationNumberView } from "./MaltaNationalIdentificationNumberView";

const meta: Meta<MaltaNationalIdentificationNumberView> = {
  title: "Headless/MaltaNationalIdentificationNumberView",
  component: MaltaNationalIdentificationNumberView,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<MaltaNationalIdentificationNumberView>;

export const Default: Story = {};
