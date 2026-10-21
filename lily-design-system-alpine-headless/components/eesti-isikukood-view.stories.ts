import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<span\n  class=\"eesti-isikukood-view\"\n  aria-label=\"Personal Identification Code\"\n></span>";

const meta = {
  title: 'Headless/Eesti Isikukood View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
