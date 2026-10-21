import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- UkrayinaReyestratsiyniyNomerOblikovoyiKartkyPlatnykaPodatkivView component -->\n<!--\n  Description: a read-only display of Ukraine's Taxpayer Registration Card Number (RNOKPP)\n  HTML tag: <span>\n  CSS class: ukrayina-reyestratsiyniy-nomer-oblikovoyi-kartky-platnyka-podatkiv-view\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Format: Ten digits: days since 1 Jan 1900 (birth), sequence number, check digit.\n  Usage:\n    <span class=\"ukrayina-reyestratsiyniy-nomer-oblikovoyi-kartky-platnyka-podatkiv-view\" aria-label=\"Реєстраційний номер облікової картки платника податків (РНОКПП)\">value-here</span>\n-->\n\n<span\n  class=\"ukrayina-reyestratsiyniy-nomer-oblikovoyi-kartky-platnyka-podatkiv-view\"\n  aria-label=\"Реєстраційний номер облікової картки платника податків (РНОКПП)\"\n></span>";

const meta = {
  title: 'Headless/Ukrayina Reyestratsiyniy Nomer Oblikovoyi Kartky Platnyka Podatkiv View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
