import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<input\n  class=\"south-africa-identity-number-input\"\n  type=\"text\"\n  aria-label=\"South African Identity Number\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/South Africa Identity Number Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
