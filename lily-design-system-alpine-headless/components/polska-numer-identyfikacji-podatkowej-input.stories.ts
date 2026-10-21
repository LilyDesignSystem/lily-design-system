import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<input\n  class=\"polska-numer-identyfikacji-podatkowej-input\"\n  type=\"text\"\n  aria-label=\"Tax Identification Number\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Polska Numer Identyfikacji Podatkowej Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
