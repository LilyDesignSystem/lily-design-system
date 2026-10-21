import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<input\n  class=\"sverige-personnummer-input\"\n  type=\"text\"\n  aria-label=\"Personal Identity Number\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Sverige Personnummer Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
