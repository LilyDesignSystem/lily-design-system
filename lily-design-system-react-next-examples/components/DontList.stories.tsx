import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import DontList from './DontList';

const meta = {
  title: 'Examples/DontList',
  component: DontList,
  tags: ['autodocs']
} satisfies Meta<typeof DontList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
