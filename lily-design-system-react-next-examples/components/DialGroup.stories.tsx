import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import DialGroup from './DialGroup';

const meta = {
  title: 'Examples/DialGroup',
  component: DialGroup,
  tags: ['autodocs']
} satisfies Meta<typeof DialGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
