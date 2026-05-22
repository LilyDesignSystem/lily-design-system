import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<a
  class="digital-object-identifier-link"
  href="https://doi.org/"
  rel="noopener">doi: undefined</a>`;

const meta = {
  title: 'Headless/DigitalObjectIdentifierLink',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
