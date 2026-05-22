import type { Meta, StoryObj } from '@storybook/react-vite';
import RelatedContent from './RelatedContent';

const meta = {
  title: 'Headless/RelatedContent',
  component: RelatedContent,
  tags: ['autodocs']
} satisfies Meta<typeof RelatedContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
