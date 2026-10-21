import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<input\n  class=\"hrvatska-osobni-identifikacijski-broj-input\"\n  type=\"text\"\n  aria-label=\"Personal Identification Number\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Hrvatska Osobni Identifikacijski Broj Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
