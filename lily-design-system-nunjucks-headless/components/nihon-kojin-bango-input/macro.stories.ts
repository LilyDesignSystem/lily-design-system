import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="nihon-kojin-bango-input"
  type="text"
  autocomplete="off"
  spellcheck="false"
  aria-label="Japan's Individual Number / My Number (マイナンバー)">`;

const meta = {
  title: 'Headless/NihonKojinBangoInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
