import type { Meta, StoryObj } from "@storybook/react-vite";
import MedicationView from "./MedicationView";

const meta = {
    title: "Headless/MedicationView",
    component: MedicationView,
    tags: ["autodocs"],
} satisfies Meta<typeof MedicationView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        nameSegments: [{ text: "hydr" }, { text: "ALAZINE", tallMan: true }],
        strength: "25 mg",
        form: "tablet",
        route: "oral",
        frequency: "twice daily",
    },
};
