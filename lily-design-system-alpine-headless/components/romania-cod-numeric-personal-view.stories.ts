import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<span\n  class=\"romania-cod-numeric-personal-view\"\n  aria-label=\"Personal Numerical Code\"\n></span>";

const meta = {
  title: 'Headless/Romania Cod Numeric Personal View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
