import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<span\n  class=\"alba-community-health-index-view\"\n  aria-label=\"Community Health Index\"\n></span>";

const meta = {
  title: 'Headless/Alba Community Health Index View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
