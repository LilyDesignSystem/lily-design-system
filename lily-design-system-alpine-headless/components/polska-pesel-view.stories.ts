import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<span\n  class=\"polska-pesel-view\"\n  aria-label=\"PESEL\"\n></span>";

const meta = {
  title: 'Headless/Polska Pesel View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
