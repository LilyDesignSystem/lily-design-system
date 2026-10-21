import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<input\n  class=\"ukrayina-reyestratsiyniy-nomer-oblikovoyi-kartky-platnyka-podatkiv-input\"\n  type=\"text\"\n  aria-label=\"Реєстраційний номер облікової картки платника податків (РНОКПП)\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Ukrayina Reyestratsiyniy Nomer Oblikovoyi Kartky Platnyka Podatkiv Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
