import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import GrailLayoutRightAside from './GrailLayoutRightAside';

const meta = {
  title: 'Examples/GrailLayoutRightAside',
  component: GrailLayoutRightAside,
  tags: ['autodocs']
} satisfies Meta<typeof GrailLayoutRightAside>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
