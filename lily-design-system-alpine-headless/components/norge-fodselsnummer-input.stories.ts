import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<input\n  class=\"norge-fodselsnummer-input\"\n  type=\"text\"\n  aria-label=\"Norwegian Birth Number\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Norge Fodselsnummer Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
