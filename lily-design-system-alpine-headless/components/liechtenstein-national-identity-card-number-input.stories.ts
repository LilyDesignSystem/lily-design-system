import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<input\n  class=\"liechtenstein-national-identity-card-number-input\"\n  type=\"text\"\n  aria-label=\"Liechtenstein National Identity Card Number\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Liechtenstein National Identity Card Number Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
