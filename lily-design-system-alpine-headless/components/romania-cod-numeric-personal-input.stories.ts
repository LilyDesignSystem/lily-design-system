import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<input\n  class=\"romania-cod-numeric-personal-input\"\n  type=\"text\"\n  aria-label=\"Personal Numerical Code\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Romania Cod Numeric Personal Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
