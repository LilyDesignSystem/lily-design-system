import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<span
  class="ukrayina-reyestratsiyniy-nomer-oblikovoyi-kartky-platnyka-podatkiv-view"
  aria-label="Реєстраційний номер облікової картки платника податків (РНОКПП)">sample-value</span>`;

const meta = {
  title: 'Headless/UkrayinaReyestratsiyniyNomerOblikovoyiKartkyPlatnykaPodatkivView',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
