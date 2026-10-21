import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- UkrayinaReyestratsiyniyNomerOblikovoyiKartkyPlatnykaPodatkivInput component -->\n<!--\n  Description: an input for entering Ukraine's Taxpayer Registration Card Number (RNOKPP)\n  HTML tag: <input>\n  CSS class: ukrayina-reyestratsiyniy-nomer-oblikovoyi-kartky-platnyka-podatkiv-input\n  Keyboard: Tab to focus, standard input keyboard interactions\n  Accessibility: Implicit input role, aria-label for accessible name\n  Format: Ten digits: days since 1 Jan 1900 (birth), sequence number, check digit.\n  Usage:\n    <input class=\"ukrayina-reyestratsiyniy-nomer-oblikovoyi-kartky-platnyka-podatkiv-input\" type=\"text\" aria-label=\"Реєстраційний номер облікової картки платника податків (РНОКПП)\" autocomplete=\"off\">\n-->\n\n<input\n  class=\"ukrayina-reyestratsiyniy-nomer-oblikovoyi-kartky-platnyka-podatkiv-input\"\n  type=\"text\"\n  aria-label=\"Реєстраційний номер облікової картки платника податків (РНОКПП)\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Ukrayina Reyestratsiyniy Nomer Oblikovoyi Kartky Platnyka Podatkiv Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
