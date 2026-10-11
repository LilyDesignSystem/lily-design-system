import type { Meta, StoryObj } from '@storybook/vue3-vite';
import SharePage from './SharePage.vue';

const meta = {
  title: 'Headless/SharePage',
  component: SharePage,
  tags: ['autodocs']
} satisfies Meta<typeof SharePage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
