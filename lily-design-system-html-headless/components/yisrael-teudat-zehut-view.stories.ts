import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<span
  class="yisrael-teudat-zehut-view"
  aria-label="Teudat Zehut (תעודת זהות)"
>sample-value</span>`;

const meta = {
  title: 'Headless/YisraelTeudatZehutView',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
