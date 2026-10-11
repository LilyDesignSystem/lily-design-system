import type { Meta, StoryObj } from '@storybook/vue3-vite';
import GovernmentIdentifier from './GovernmentIdentifier.vue';

const meta = {
  title: 'Headless/GovernmentIdentifier',
  component: GovernmentIdentifier,
  tags: ['autodocs']
} satisfies Meta<typeof GovernmentIdentifier>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
