import type { Meta, StoryObj } from '@storybook/react-vite';
import SkipLink from './SkipLink';

const meta = {
  title: 'Headless/SkipLink',
  component: SkipLink,
  tags: ['autodocs']
} satisfies Meta<typeof SkipLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
