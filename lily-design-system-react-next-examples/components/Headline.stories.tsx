import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Headline from './Headline';

const meta = {
  title: 'Examples/Headline',
  component: Headline,
  tags: ['autodocs']
} satisfies Meta<typeof Headline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
