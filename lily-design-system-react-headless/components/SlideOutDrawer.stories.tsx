import type { Meta, StoryObj } from '@storybook/react-vite';
import SlideOutDrawer from './SlideOutDrawer';

const meta = {
  title: 'Headless/SlideOutDrawer',
  component: SlideOutDrawer,
  tags: ['autodocs']
} satisfies Meta<typeof SlideOutDrawer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
