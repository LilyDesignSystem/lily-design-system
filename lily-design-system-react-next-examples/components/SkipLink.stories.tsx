import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import SkipLink from './SkipLink';

const meta = {
  title: 'Examples/SkipLink',
  component: SkipLink,
  tags: ['autodocs']
} satisfies Meta<typeof SkipLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
