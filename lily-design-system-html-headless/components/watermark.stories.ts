import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `</div>
-->

<div
  class="watermark"
  data-rotate="-22"
  data-gap="100px"
>
  <!-- Decorative repeating overlay layer. aria-hidden so screen readers ignore it. -->
  <div
    class="watermark-overlay"
    aria-hidden="true"
    data-text=""
    data-image-url=""
  ></div>

  <!-- Consumer provides the page content rendered beneath the watermark -->
</div>`;

const meta = {
  title: 'Headless/Watermark',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
