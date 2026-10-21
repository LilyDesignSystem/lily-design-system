import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<span\n  class=\"liechtenstein-passport-number-view\"\n  aria-label=\"Liechtenstein Passport Number\"\n></span>";

const meta = {
  title: 'Headless/Liechtenstein Passport Number View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
