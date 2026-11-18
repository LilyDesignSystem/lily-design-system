import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<span class="ukrayina-reyestratsiyniy-nomer-oblikovoyi-kartky-platnyka-podatkiv-view"\n  ><span class="screen-reader-span"\n    >Реєстраційний номер облікової картки платника податків (РНОКПП)\n  </span></span\n>';

const meta = {
    title: "Headless/Ukrayina Reyestratsiyniy Nomer Oblikovoyi Kartky Platnyka Podatkiv View",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
