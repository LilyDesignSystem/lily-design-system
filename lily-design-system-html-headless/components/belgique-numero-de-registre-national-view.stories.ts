import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<span
  class="belgique-numero-de-registre-national-view"
  aria-label="National Register Number"
>sample-value</span>`;

const meta = {
  title: 'Headless/BelgiqueNumeroDeRegistreNationalView',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
