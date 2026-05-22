import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import GrailLayoutBottomFooter from './GrailLayoutBottomFooter';

const meta = {
  title: 'Examples/GrailLayoutBottomFooter',
  component: GrailLayoutBottomFooter,
  tags: ['autodocs']
} satisfies Meta<typeof GrailLayoutBottomFooter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
