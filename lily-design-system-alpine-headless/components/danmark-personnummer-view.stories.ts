import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<span\n  class=\"danmark-personnummer-view\"\n  aria-label=\"Personal Identity Code\"\n></span>";

const meta = {
  title: 'Headless/Danmark Personnummer View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
