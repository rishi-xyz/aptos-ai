'use client';
import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Button } from '@/src/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/src/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/src/components/ui/popover';
import { toast } from 'sonner';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { useWalletStore } from '@/src/store/wallet-store';

const aptosNetworks = [
  {
    id: 1,
    value: 'mainnet',
    label: 'Aptos Mainnet',
    network: 'mainnet',
  },
  {
    id: 2,
    value: 'testnet',
    label: 'Aptos Testnet',
    network: 'testnet',
  },
  {
    id: 3,
    value: 'devnet',
    label: 'Aptos Devnet',
    network: 'devnet',
  },
];

export function ComboboxDemo() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState<string>('mainnet');
  const [isLoading, setIsLoading] = React.useState(false);

  const { connected, account } = useWallet();
  const setWalletData = useWalletStore((state) => state.setWalletData);

  React.useEffect(() => {
    if (connected && account) {
      setWalletData({
        address: account.address.toString(),
        chainId: 1, // Aptos mainnet
        chainName: 'Aptos',
      });
    }
  }, [connected, account, setWalletData]);

  const selectHandler = async (currentValue: string) => {
    const selectedNetwork = aptosNetworks.find((network) => network.value === currentValue);
    if (!selectedNetwork) return;

    // Don't switch if already on the selected network
    if (selectedNetwork.value === value) {
      setValue(currentValue);
      setOpen(false);
      return;
    }

    setIsLoading(true);
    setOpen(false);

    try {
      // Update the wallet store with the new network
      if (account) {
        setWalletData({
          address: account.address.toString(),
          chainId: selectedNetwork.id,
          chainName: selectedNetwork.label,
        });
      }

      setValue(currentValue);
      
      toast('Network switched successfully', {
        description: `Switched to ${selectedNetwork.label}`,
        duration: 3000,
      });
    } catch (error) {
      console.error('Network switch error:', error);
      toast('Failed to switch network', {
        description: 'An error occurred while switching networks',
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
          disabled={isLoading}
        >
          {isLoading
            ? 'Switching...'
            : value
              ? aptosNetworks.find((network) => network.value === value)?.label
              : 'Select Network'}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search network..." className="h-9" />
          <CommandList>
            <CommandEmpty>No network found.</CommandEmpty>
            <CommandGroup>
              {aptosNetworks.map((network) => (
                <CommandItem
                  key={network.value}
                  value={network.value}
                  onSelect={selectHandler}
                  disabled={isLoading}
                >
                  <span className="flex items-center gap-2">
                    {network.label}
                  </span>
                  <Check
                    className={cn(
                      'ml-auto',
                      value === network.value ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
