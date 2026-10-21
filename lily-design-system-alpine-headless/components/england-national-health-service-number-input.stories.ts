import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<input\n  class=\"england-national-health-service-number-input\"\n  type=\"text\"\n  aria-label=\"National Health Service Number\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/England National Health Service Number Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
