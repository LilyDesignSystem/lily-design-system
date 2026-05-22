import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<a
  class="accordion-link"
  aria-label=""
  href=""
>
  <!-- Consumer provides content -->
</a>`;

const meta = {
  title: 'Headless/AccordionLink',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
