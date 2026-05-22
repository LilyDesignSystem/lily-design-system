import type { Meta, StoryObj } from '@storybook/react-vite';
import AccordionNav from './AccordionNav';

const meta = {
  title: 'Headless/AccordionNav',
  component: AccordionNav,
  tags: ['autodocs']
} satisfies Meta<typeof AccordionNav>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
