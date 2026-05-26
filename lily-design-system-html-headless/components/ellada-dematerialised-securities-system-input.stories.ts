import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="ellada-dematerialised-securities-system-input"
  type="text"
  aria-label="Dematerialised Securities System"
  autocomplete="off"
>`;

const meta = {
  title: 'Headless/ElladaDematerialisedSecuritiesSystemInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
