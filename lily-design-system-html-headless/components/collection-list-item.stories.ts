import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<li
  class="collection-list-item"
  aria-label=""
>
  <!-- Optional image:
       <img class="collection-list-item-image" src="" alt=""> -->

  <h3 class="collection-list-item-heading">
    <!-- When href is provided, wrap heading text in <a href="…"></a>;
         otherwise plain text content is used. -->
  </h3>

  <!-- Optional meta line:
       <p class="collection-list-item-meta"></p> -->

  <!-- Optional description:
       <p class="collection-list-item-description"></p> -->

  <!-- Consumer may provide additional children below -->
</li>`;

const meta = {
  title: 'Headless/CollectionListItem',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
