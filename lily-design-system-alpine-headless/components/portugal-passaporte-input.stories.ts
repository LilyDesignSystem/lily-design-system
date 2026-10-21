import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<input\n  class=\"portugal-passaporte-input\"\n  type=\"text\"\n  aria-label=\"Portuguese Passport\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Portugal Passaporte Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
