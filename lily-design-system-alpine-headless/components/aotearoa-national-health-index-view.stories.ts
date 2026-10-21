import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<span\n  class=\"aotearoa-national-health-index-view\"\n  aria-label=\"National Health Index (NHI) Number\"\n></span>";

const meta = {
  title: 'Headless/Aotearoa National Health Index View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
