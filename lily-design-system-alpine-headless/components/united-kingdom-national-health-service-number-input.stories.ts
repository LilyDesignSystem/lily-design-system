import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<input\n  class=\"united-kingdom-national-health-service-number-input\"\n  type=\"text\"\n  aria-label=\"\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/United Kingdom National Health Service Number Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
