import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<figure
  class="pictogram"
  data-layout="centered">
  <div class="pictogram-icon" aria-hidden="true"></div>
  <figcaption class="pictogram-caption"></figcaption>
</figure>`;

const meta = {
  title: 'Headless/Pictogram',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
