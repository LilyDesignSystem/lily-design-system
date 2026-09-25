import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="nihon-kojin-bango-input"
  type="text"
  aria-label="Individual Number / My Number (マイナンバー)"
  autocomplete="off"
>`;

const meta = {
  title: 'Headless/NihonKojinBangoInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
