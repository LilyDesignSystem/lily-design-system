import type { Meta, StoryObj } from "@storybook/react-vite";
import Autosuggest from "./Autosuggest";

const meta = {
    title: "Headless/Autosuggest",
    component: Autosuggest,
    tags: ["autodocs"],
} satisfies Meta<typeof Autosuggest>;

export default meta;
type Story = StoryObj<typeof Autosuggest>;

export const Default: Story = {
    args: {
        label: "Fruit",
        suggestions: [
            { value: "apple", label: "Apple" },
            { value: "apricot", label: "Apricot" },
        ],
    },
};
