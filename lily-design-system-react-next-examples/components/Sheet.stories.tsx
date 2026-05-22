import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Sheet from './Sheet';

const meta = {
  title: 'Examples/Sheet',
  component: Sheet,
  tags: ['autodocs']
} satisfies Meta<typeof Sheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
