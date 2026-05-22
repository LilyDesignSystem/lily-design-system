import type { Meta, StoryObj } from '@storybook/vue3-vite';
import DocumentList from './DocumentList.vue';

const meta = {
  title: 'Examples/DocumentList',
  component: DocumentList,
  tags: ['autodocs']
} satisfies Meta<typeof DocumentList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
