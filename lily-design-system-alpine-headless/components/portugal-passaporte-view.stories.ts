import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<span\n  class=\"portugal-passaporte-view\"\n  aria-label=\"Portuguese Passport\"\n></span>";

const meta = {
  title: 'Headless/Portugal Passaporte View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
