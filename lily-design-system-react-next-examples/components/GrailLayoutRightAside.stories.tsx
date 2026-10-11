import type { Meta, StoryObj } from '@storybook/react-vite';
import GrailLayoutRightAside from './GrailLayoutRightAside';

const meta = {
  title: 'Headless/GrailLayoutRightAside',
  component: GrailLayoutRightAside,
  tags: ['autodocs']
} satisfies Meta<typeof GrailLayoutRightAside>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
