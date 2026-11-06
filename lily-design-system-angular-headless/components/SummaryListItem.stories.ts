import type { Meta, StoryObj } from "@storybook/angular";
import { SummaryListItem } from "./SummaryListItem";

// Attribute-selector component (`div[lily-summary-list-item]`): Storybook's auto-render stub
// only knows how to mount an element selector as its own tag, so this story supplies
// the host <div> explicitly via `render`.
const meta: Meta<SummaryListItem> = {
    title: "Headless/SummaryListItem",
    component: SummaryListItem,
    tags: ["autodocs"],
    render: (args) => ({
        props: args,
        moduleMetadata: { imports: [SummaryListItem] },
        template: `<div lily-summary-list-item [className]="className"></div>`,
    }),
};

export default meta;
type Story = StoryObj<SummaryListItem>;

export const Default: Story = {};
