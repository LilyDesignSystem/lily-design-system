import type { Meta, StoryObj } from '@storybook/vue3-vite';
import NewsletterSignup from './NewsletterSignup.vue';

const meta = {
  title: 'Headless/NewsletterSignup',
  component: NewsletterSignup,
  tags: ['autodocs']
} satisfies Meta<typeof NewsletterSignup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
