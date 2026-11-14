import type { Meta, StoryObj } from "@storybook/angular";
import { BodyMap } from "./BodyMap";

const meta: Meta<BodyMap> = {
    title: "Headless/BodyMap",
    component: BodyMap,
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<BodyMap>;

export const Default: Story = {
    args: {
        label: "Pain sites",
        regions: [
            { id: "head", label: "Head" },
            { id: "chest", label: "Chest" },
        ],
    },
};
