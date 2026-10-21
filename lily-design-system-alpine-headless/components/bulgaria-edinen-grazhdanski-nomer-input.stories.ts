import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<input\n  class=\"bulgaria-edinen-grazhdanski-nomer-input\"\n  type=\"text\"\n  aria-label=\"Uniform Civil Number\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Bulgaria Edinen Grazhdanski Nomer Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
