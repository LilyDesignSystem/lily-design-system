import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<input\n  class=\"slovensko-rodne-cislo-input\"\n  type=\"text\"\n  aria-label=\"Slovak Personal Number\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Slovensko Rodne Cislo Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
