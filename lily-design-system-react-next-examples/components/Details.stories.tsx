import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Details from './Details';

const meta = {
  title: 'Examples/Details',
  component: Details,
  tags: ['autodocs']
} satisfies Meta<typeof Details>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
