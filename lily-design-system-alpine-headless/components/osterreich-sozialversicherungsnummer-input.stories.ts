import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<input\n  class=\"osterreich-sozialversicherungsnummer-input\"\n  type=\"text\"\n  aria-label=\"Sozialversicherungsnummer (SVNR)\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Osterreich Sozialversicherungsnummer Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
