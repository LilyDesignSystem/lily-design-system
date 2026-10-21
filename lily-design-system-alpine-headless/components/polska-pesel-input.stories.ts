import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<input\n  class=\"polska-pesel-input\"\n  type=\"text\"\n  aria-label=\"PESEL\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Polska Pesel Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
