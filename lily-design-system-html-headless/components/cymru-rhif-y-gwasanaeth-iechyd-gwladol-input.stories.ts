import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="cymru-rhif-y-gwasanaeth-iechyd-gwladol-input"
  type="text"
  aria-label="National Health Service Number"
  autocomplete="off"
>`;

const meta = {
  title: 'Headless/CymruRhifYGwasanaethIechydGwladolInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
