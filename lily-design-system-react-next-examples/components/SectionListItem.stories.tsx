import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import SectionListItem from './SectionListItem';

const meta = {
  title: 'Examples/SectionListItem',
  component: SectionListItem,
  tags: ['autodocs']
} satisfies Meta<typeof SectionListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
