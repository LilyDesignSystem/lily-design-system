import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<input\n  class=\"italia-codice-fiscale-input\"\n  type=\"text\"\n  aria-label=\"Italian Fiscal Code\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Italia Codice Fiscale Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
