import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import PortugalNumeroDeIdentificacaoFiscalInput from './PortugalNumeroDeIdentificacaoFiscalInput';

const meta = {
  title: 'Examples/PortugalNumeroDeIdentificacaoFiscalInput',
  component: PortugalNumeroDeIdentificacaoFiscalInput,
  tags: ['autodocs']
} satisfies Meta<typeof PortugalNumeroDeIdentificacaoFiscalInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'PortugalNumeroDeIdentificacaoFiscalInput' }
};
