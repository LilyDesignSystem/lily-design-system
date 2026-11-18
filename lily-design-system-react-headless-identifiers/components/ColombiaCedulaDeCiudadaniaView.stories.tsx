import type { Meta, StoryObj } from "@storybook/react-vite";
import ColombiaCedulaDeCiudadaniaView from "./ColombiaCedulaDeCiudadaniaView";

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
