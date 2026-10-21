import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<input\n  class=\"united-states-social-security-number-input\"\n  type=\"text\"\n  aria-label=\"\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/United States Social Security Number Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
