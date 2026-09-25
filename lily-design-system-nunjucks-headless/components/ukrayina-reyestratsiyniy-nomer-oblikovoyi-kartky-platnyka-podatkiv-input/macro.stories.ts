import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="ukrayina-reyestratsiyniy-nomer-oblikovoyi-kartky-platnyka-podatkiv-input"
  type="text"
  autocomplete="off"
  spellcheck="false"
  aria-label="Реєстраційний номер облікової картки платника податків (РНОКПП)">`;

const meta = {
  title: 'Headless/UkrayinaReyestratsiyniyNomerOblikovoyiKartkyPlatnykaPodatkivInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
