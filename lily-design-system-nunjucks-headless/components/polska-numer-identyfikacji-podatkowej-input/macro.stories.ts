import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="polska-numer-identyfikacji-podatkowej-input"
  type="text"
  autocomplete="off"
  spellcheck="false"
  aria-label="Tax Identification Number">`;

const meta = {
  title: 'Headless/PolskaNumerIdentyfikacjiPodatkowejInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
