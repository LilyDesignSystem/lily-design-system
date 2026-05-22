import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import NewsletterSignup from './NewsletterSignup';

const meta = {
  title: 'Examples/NewsletterSignup',
  component: NewsletterSignup,
  tags: ['autodocs']
} satisfies Meta<typeof NewsletterSignup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
