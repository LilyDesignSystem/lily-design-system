import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<div class=\"accordion-list\" role=\"group\" aria-label=\"\">\n    <!-- Consumer provides accordion list items -->\n</div>";

const meta = {
  title: 'Headless/Accordion List',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
