import type { Meta, StoryObj } from '@storybook/react-vite';
import BackLink from './BackLink';

const meta = {
  title: 'Headless/BackLink',
  component: BackLink,
  tags: ['autodocs']
} satisfies Meta<typeof BackLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
