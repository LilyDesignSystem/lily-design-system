import type { Meta, StoryObj } from "@storybook/vue3-vite";
import BodyMap from "./BodyMap.vue";

const meta = {
    title: "Headless/BodyMap",
    component: BodyMap,
    tags: ["autodocs"],
} satisfies Meta<typeof BodyMap>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        label: "Pain sites",
        regions: [
            { id: "head", label: "Head" },
            { id: "chest", label: "Chest" },
        ],
    },
};
