import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import RelatedContent from './RelatedContent';

const meta = {
  title: 'Examples/RelatedContent',
  component: RelatedContent,
  tags: ['autodocs']
} satisfies Meta<typeof RelatedContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
