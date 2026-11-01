import type { Meta, StoryObj } from "@storybook/vue3-vite";
import ColombiaCedulaDeCiudadaniaView from "./ColombiaCedulaDeCiudadaniaView.vue";

const meta = {
    title: "Headless/ColombiaCedulaDeCiudadaniaView",
    component: ColombiaCedulaDeCiudadaniaView,
    tags: ["autodocs"],
} satisfies Meta<typeof ColombiaCedulaDeCiudadaniaView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: "ColombiaCedulaDeCiudadaniaView" },
};
