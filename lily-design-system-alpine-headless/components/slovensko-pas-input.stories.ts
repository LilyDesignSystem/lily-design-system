import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<input\n  class=\"slovensko-pas-input\"\n  type=\"text\"\n  aria-label=\"Slovak Passport\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Slovensko Pas Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
