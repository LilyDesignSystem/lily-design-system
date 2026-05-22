import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import EspanaTarjetaSanitariaIndividualView from './EspanaTarjetaSanitariaIndividualView';

const meta = {
  title: 'Examples/EspanaTarjetaSanitariaIndividualView',
  component: EspanaTarjetaSanitariaIndividualView,
  tags: ['autodocs']
} satisfies Meta<typeof EspanaTarjetaSanitariaIndividualView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
