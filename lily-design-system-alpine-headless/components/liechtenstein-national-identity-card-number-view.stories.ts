import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<span\n  class=\"liechtenstein-national-identity-card-number-view\"\n  aria-label=\"Liechtenstein National Identity Card Number\"\n></span>";

const meta = {
  title: 'Headless/Liechtenstein National Identity Card Number View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
