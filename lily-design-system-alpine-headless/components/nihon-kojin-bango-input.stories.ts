import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<input\n  class=\"nihon-kojin-bango-input\"\n  type=\"text\"\n  aria-label=\"Individual Number / My Number (マイナンバー)\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Nihon Kojin Bango Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
