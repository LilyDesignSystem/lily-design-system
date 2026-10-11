import type { Meta, StoryObj } from '@storybook/react-vite';
import GrailLayoutTopHeader from './GrailLayoutTopHeader';

const meta = {
  title: 'Headless/GrailLayoutTopHeader',
  component: GrailLayoutTopHeader,
  tags: ['autodocs']
} satisfies Meta<typeof GrailLayoutTopHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
