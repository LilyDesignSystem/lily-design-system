import type { Meta, StoryObj } from '@storybook/react-vite';
import HeroHeadline from './HeroHeadline';

const meta = {
  title: 'Headless/HeroHeadline',
  component: HeroHeadline,
  tags: ['autodocs']
} satisfies Meta<typeof HeroHeadline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
