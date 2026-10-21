import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<input\n  class=\"rossiya-snils-input\"\n  type=\"text\"\n  aria-label=\"СНИЛС (Strakhovoy Nomer Individualnogo Litsevogo Scheta)\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Rossiya Snils Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
