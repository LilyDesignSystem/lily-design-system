import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<input\n  class=\"eesti-isikukood-input\"\n  type=\"text\"\n  aria-label=\"Personal Identification Code\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Eesti Isikukood Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
