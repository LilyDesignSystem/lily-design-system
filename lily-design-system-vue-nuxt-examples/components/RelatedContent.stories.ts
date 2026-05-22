import type { Meta, StoryObj } from '@storybook/vue3-vite';
import RelatedContent from './RelatedContent.vue';

const meta = {
  title: 'Examples/RelatedContent',
  component: RelatedContent,
  tags: ['autodocs']
} satisfies Meta<typeof RelatedContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
