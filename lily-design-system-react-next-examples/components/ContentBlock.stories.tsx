import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import ContentBlock from './ContentBlock';

const meta = {
  title: 'Examples/ContentBlock',
  component: ContentBlock,
  tags: ['autodocs']
} satisfies Meta<typeof ContentBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
