import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Byline from './Byline';

const meta = {
  title: 'Examples/Byline',
  component: Byline,
  tags: ['autodocs']
} satisfies Meta<typeof Byline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
