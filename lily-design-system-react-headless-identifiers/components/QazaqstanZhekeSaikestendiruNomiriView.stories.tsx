import type { Meta, StoryObj } from "@storybook/react-vite";
import QazaqstanZhekeSaikestendiruNomiriView from "./QazaqstanZhekeSaikestendiruNomiriView";

const meta = {
    title: "Headless/QazaqstanZhekeSaikestendiruNomiriView",
    component: QazaqstanZhekeSaikestendiruNomiriView,
    tags: ["autodocs"],
} satisfies Meta<typeof QazaqstanZhekeSaikestendiruNomiriView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: "QazaqstanZhekeSaikestendiruNomiriView" },
};
