import type { Meta, StoryObj } from "@storybook/angular";
import { RedOrangeYellowGreenBluePicker } from "./RedOrangeYellowGreenBluePicker";

const meta: Meta<RedOrangeYellowGreenBluePicker> = {
    title: "Headless/RedOrangeYellowGreenBluePicker",
    component: RedOrangeYellowGreenBluePicker,
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<RedOrangeYellowGreenBluePicker>;

export const Default: Story = { args: { label: "Rating", redLabel: "Red", orangeLabel: "Orange", yellowLabel: "Yellow", greenLabel: "Green", blueLabel: "Blue" } };
