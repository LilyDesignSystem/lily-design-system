import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `</section>
      <div class="transfer-list-actions">
        <!-- consumer-supplied move-right and move-left buttons -->
      </div>
      <section class="transfer-list-target" aria-label="Selected features">
        <!-- consumer-supplied target listbox -->
      </section>
    </div>
-->

<div
  class="transfer-list"
  role="group"
  aria-label=""
>
  <!-- Source list region: REQUIRED. -->
  <section class="transfer-list-source" aria-label="">
    <!-- Consumer provides the source list (typically a listbox) -->
  </section>

  <!-- Actions region: optional. Holds move-right / move-left buttons. -->
  <div class="transfer-list-actions">
    <!-- Consumer provides the action buttons (or remove this div if unused) -->
  </div>

  <!-- Target list region: REQUIRED. -->
  <section class="transfer-list-target" aria-label="">
    <!-- Consumer provides the target list (typically a listbox) -->
  </section>
</div>`;

const meta = {
  title: 'Headless/TransferList',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
