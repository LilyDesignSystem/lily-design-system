import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ContentsList from './ContentsList.vue';

const meta = {
  title: 'Headless/ContentsList',
  component: ContentsList,
  tags: ['autodocs']
} satisfies Meta<typeof ContentsList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
