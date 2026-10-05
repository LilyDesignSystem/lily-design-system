import type { Meta, StoryObj } from '@storybook/react-vite';
import ShowMore from './ShowMore';

const meta = {
  title: 'Headless/ShowMore',
  component: ShowMore,
  tags: ['autodocs']
} satisfies Meta<typeof ShowMore>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { moreLabel: "Show more", lessLabel: "Show less", children: "Long content that the consumer clamps with CSS." }
};
