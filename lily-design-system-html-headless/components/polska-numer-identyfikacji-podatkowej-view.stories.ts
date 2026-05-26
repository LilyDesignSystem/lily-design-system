import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<span
  class="polska-numer-identyfikacji-podatkowej-view"
  aria-label="Tax Identification Number"
>sample-value</span>`;

const meta = {
  title: 'Headless/PolskaNumerIdentyfikacjiPodatkowejView',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
