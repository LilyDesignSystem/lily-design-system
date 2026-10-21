import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<span\n  class=\"canada-social-insurance-number-view\"\n  aria-label=\"Social Insurance Number (SIN)\"\n></span>";

const meta = {
  title: 'Headless/Canada Social Insurance Number View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
