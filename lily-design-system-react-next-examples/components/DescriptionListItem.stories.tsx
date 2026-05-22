import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import DescriptionListItem from './DescriptionListItem';

const meta = {
  title: 'Examples/DescriptionListItem',
  component: DescriptionListItem,
  tags: ['autodocs']
} satisfies Meta<typeof DescriptionListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
