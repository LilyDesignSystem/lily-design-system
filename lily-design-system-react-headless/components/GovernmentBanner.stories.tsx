import type { Meta, StoryObj } from '@storybook/react-vite';
import GovernmentBanner from './GovernmentBanner';

const meta = {
  title: 'Headless/GovernmentBanner',
  component: GovernmentBanner,
  tags: ['autodocs']
} satisfies Meta<typeof GovernmentBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
