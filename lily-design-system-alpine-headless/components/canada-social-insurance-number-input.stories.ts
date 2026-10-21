import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<input\n  class=\"canada-social-insurance-number-input\"\n  type=\"text\"\n  aria-label=\"Social Insurance Number (SIN)\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Canada Social Insurance Number Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
