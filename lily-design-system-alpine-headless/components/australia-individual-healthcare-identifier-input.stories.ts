import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<input\n  class=\"australia-individual-healthcare-identifier-input\"\n  type=\"text\"\n  aria-label=\"Individual Healthcare Identifier\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Australia Individual Healthcare Identifier Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
