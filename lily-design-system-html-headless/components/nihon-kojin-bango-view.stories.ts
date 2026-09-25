import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<span
  class="nihon-kojin-bango-view"
  aria-label="Individual Number / My Number (マイナンバー)"
>sample-value</span>`;

const meta = {
  title: 'Headless/NihonKojinBangoView',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
