import type { Meta, StoryObj } from "@storybook/angular";
import { BreadcrumbListItem } from "./BreadcrumbListItem";

// Attribute-selector component (`li[lily-breadcrumb-list-item]`): Storybook's
// auto-render stub only knows how to mount an element selector as its own tag,
// so this story supplies the host `<li>` explicitly via `render`.
const meta: Meta<BreadcrumbListItem> = {
  title: "Headless/BreadcrumbListItem",
  component: BreadcrumbListItem,
  tags: ["autodocs"],
  render: (args) => ({
    props: args,
    moduleMetadata: { imports: [BreadcrumbListItem] },
    template: `<li lily-breadcrumb-list-item [className]="className">Home</li>`,
  }),
};

export default meta;
type Story = StoryObj<BreadcrumbListItem>;

export const Default: Story = {};
