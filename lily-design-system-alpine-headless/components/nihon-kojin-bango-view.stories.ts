import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<span\n  class=\"nihon-kojin-bango-view\"\n  aria-label=\"Individual Number / My Number (マイナンバー)\"\n></span>";

const meta = {
  title: 'Headless/Nihon Kojin Bango View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
