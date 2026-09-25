import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="yisrael-teudat-zehut-input"
  type="text"
  autocomplete="off"
  spellcheck="false"
  aria-label="Israel's Teudat Zehut (תעודת זהות)">`;

const meta = {
  title: 'Headless/YisraelTeudatZehutInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
