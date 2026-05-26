import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="belgique-numero-de-registre-national-input"
  type="text"
  autocomplete="off"
  spellcheck="false"
  aria-label="National Register Number">`;

const meta = {
  title: 'Headless/BelgiqueNumeroDeRegistreNationalInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
