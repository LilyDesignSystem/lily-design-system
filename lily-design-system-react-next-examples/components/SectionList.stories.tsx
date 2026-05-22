import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import SectionList from './SectionList';

const meta = {
  title: 'Examples/SectionList',
  component: SectionList,
  tags: ['autodocs']
} satisfies Meta<typeof SectionList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
