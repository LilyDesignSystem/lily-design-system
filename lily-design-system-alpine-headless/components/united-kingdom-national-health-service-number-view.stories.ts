import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<span\n  class=\"united-kingdom-national-health-service-number-view\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides text content -->\n</span>";

const meta = {
  title: 'Headless/United Kingdom National Health Service Number View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
