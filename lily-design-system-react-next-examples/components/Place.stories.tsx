import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Place from './Place';

const meta = {
  title: 'Examples/Place',
  component: Place,
  tags: ['autodocs']
} satisfies Meta<typeof Place>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
