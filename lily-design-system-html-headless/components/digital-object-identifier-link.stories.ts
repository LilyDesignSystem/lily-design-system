import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<a
  class="digital-object-identifier-link"
  aria-label=""
  href=""
>
  <!-- Consumer provides content -->
</a>`;

const meta = {
  title: 'Headless/DigitalObjectIdentifierLink',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
