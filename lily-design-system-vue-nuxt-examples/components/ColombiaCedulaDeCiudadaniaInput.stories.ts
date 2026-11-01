import type { Meta, StoryObj } from "@storybook/vue3-vite";
import ColombiaCedulaDeCiudadaniaInput from "./ColombiaCedulaDeCiudadaniaInput.vue";

const meta = {
    title: "Headless/ColombiaCedulaDeCiudadaniaInput",
    component: ColombiaCedulaDeCiudadaniaInput,
    tags: ["autodocs"],
} satisfies Meta<typeof ColombiaCedulaDeCiudadaniaInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: "ColombiaCedulaDeCiudadaniaInput" },
};
