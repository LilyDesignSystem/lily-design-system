import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<input\n  class=\"lietuva-asmens-kodas-input\"\n  type=\"text\"\n  aria-label=\"Personal Code\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Lietuva Asmens Kodas Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
