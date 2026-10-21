import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<input\n  class=\"cesko-rodne-cislo-input\"\n  type=\"text\"\n  aria-label=\"Czech Personal Number\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Cesko Rodne Cislo Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
