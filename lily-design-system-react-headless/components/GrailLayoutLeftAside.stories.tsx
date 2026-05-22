import type { Meta, StoryObj } from '@storybook/react-vite';
import GrailLayoutLeftAside from './GrailLayoutLeftAside';

const meta = {
  title: 'Headless/GrailLayoutLeftAside',
  component: GrailLayoutLeftAside,
  tags: ['autodocs']
} satisfies Meta<typeof GrailLayoutLeftAside>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
