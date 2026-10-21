import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<span\n  class=\"malta-passport-number-view\"\n  aria-label=\"Malta Passport Number\"\n></span>";

const meta = {
  title: 'Headless/Malta Passport Number View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
