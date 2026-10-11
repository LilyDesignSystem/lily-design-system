import type { Meta, StoryObj } from '@storybook/react-vite';
import NewsletterSignup from './NewsletterSignup';

const meta = {
  title: 'Headless/NewsletterSignup',
  component: NewsletterSignup,
  tags: ['autodocs']
} satisfies Meta<typeof NewsletterSignup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
