import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="yisrael-teudat-zehut-input"
  type="text"
  aria-label="Teudat Zehut (תעודת זהות)"
  autocomplete="off"
>`;

const meta = {
  title: 'Headless/YisraelTeudatZehutInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
