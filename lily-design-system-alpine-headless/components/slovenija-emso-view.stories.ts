import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<span\n  class=\"slovenija-emso-view\"\n  aria-label=\"Unique Master Citizen Number\"\n></span>";

const meta = {
  title: 'Headless/Slovenija Emso View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
