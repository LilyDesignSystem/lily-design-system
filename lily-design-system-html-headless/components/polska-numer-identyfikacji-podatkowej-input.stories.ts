import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="polska-numer-identyfikacji-podatkowej-input"
  type="text"
  aria-label="Tax Identification Number"
  autocomplete="off"
>`;

const meta = {
  title: 'Headless/PolskaNumerIdentyfikacjiPodatkowejInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
