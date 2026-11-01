import type { Meta, StoryObj } from "@storybook/angular";
import { NigeriaNationalIdentificationNumberView } from "./NigeriaNationalIdentificationNumberView";

const meta: Meta<NigeriaNationalIdentificationNumberView> = {
    title: "Headless/NigeriaNationalIdentificationNumberView",
    component: NigeriaNationalIdentificationNumberView,
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<NigeriaNationalIdentificationNumberView>;

export const Default: Story = {};
