import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<span\n  class=\"ukrayina-reyestratsiyniy-nomer-oblikovoyi-kartky-platnyka-podatkiv-view\"\n  aria-label=\"Реєстраційний номер облікової картки платника податків (РНОКПП)\"\n></span>";

const meta = {
  title: 'Headless/Ukrayina Reyestratsiyniy Nomer Oblikovoyi Kartky Platnyka Podatkiv View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
