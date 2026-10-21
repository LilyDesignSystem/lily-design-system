import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<input\n  class=\"cesko-cestovni-pas-input\"\n  type=\"text\"\n  aria-label=\"Czech Passport\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Cesko Cestovni Pas Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
