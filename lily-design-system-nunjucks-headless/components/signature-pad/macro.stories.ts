import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="signature-pad"
  data-module="signature-pad">
  <canvas
    class="signature-pad-canvas"
    width="400"
    height="150"
    role="img"
    aria-label="Signature area"
  ></canvas>
  <input type="hidden" class="signature-pad-input">
  <button type="button" class="signature-pad-clear">Clear</button>
</div>`;

const meta = {
  title: 'Headless/SignaturePad',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
