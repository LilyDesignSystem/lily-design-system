import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import HeroHeadline from './HeroHeadline';

const meta = {
  title: 'Examples/HeroHeadline',
  component: HeroHeadline,
  tags: ['autodocs']
} satisfies Meta<typeof HeroHeadline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
