import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<span\n  class=\"sverige-personnummer-view\"\n  aria-label=\"Personal Identity Number\"\n></span>";

const meta = {
  title: 'Headless/Sverige Personnummer View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
