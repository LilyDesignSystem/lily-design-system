import type { Meta, StoryObj } from '@storybook/react-vite';
import GrailLayoutBottomFooter from './GrailLayoutBottomFooter';

const meta = {
  title: 'Headless/GrailLayoutBottomFooter',
  component: GrailLayoutBottomFooter,
  tags: ['autodocs']
} satisfies Meta<typeof GrailLayoutBottomFooter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
