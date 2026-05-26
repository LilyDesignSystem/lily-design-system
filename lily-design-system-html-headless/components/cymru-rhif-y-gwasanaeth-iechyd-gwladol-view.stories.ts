import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<span
  class="cymru-rhif-y-gwasanaeth-iechyd-gwladol-view"
  aria-label="National Health Service Number"
>sample-value</span>`;

const meta = {
  title: 'Headless/CymruRhifYGwasanaethIechydGwladolView',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
