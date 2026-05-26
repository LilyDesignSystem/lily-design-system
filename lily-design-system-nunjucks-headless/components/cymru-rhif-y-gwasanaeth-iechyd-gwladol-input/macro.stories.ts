import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="cymru-rhif-y-gwasanaeth-iechyd-gwladol-input"
  type="text"
  autocomplete="off"
  spellcheck="false"
  aria-label="National Health Service Number">`;

const meta = {
  title: 'Headless/CymruRhifYGwasanaethIechydGwladolInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
