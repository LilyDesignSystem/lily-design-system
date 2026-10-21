import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<span\n  class=\"lietuva-asmens-kodas-view\"\n  aria-label=\"Personal Code\"\n></span>";

const meta = {
  title: 'Headless/Lietuva Asmens Kodas View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
