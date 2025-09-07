import { NextResponse } from 'next/server';
import { auth } from '@/app/(auth)/auth';
import { getWalletByUserId } from '@/src/database/queries';

export async function POST(request: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { recipient, amount } = await request.json();

    if (!recipient || !amount) {
      return NextResponse.json(
        { error: 'Recipient and amount are required' },
        { status: 400 }
      );
    }

    // Get user's wallet
    const wallet = await getWalletByUserId(session.user.id);
    if (!wallet) {
      return NextResponse.json(
        { error: 'No wallet found for user' },
        { status: 404 }
      );
    }

    // For now, we'll just prepare the transaction payload
    // In a production environment, you would need to securely handle the private key

    // Convert APT to octas (1 APT = 10^8 octas)
    const amountInOctas = Math.floor(amount * 100000000);
    
    if (amountInOctas === 0) {
      return NextResponse.json(
        { error: 'Amount is too small. Minimum transfer is 0.00000001 APT.' },
        { status: 400 }
      );
    }

    // Create transaction payload
    const transactionPayload = {
      function: "0x1::coin::transfer",
      type_arguments: ["0x1::aptos_coin::AptosCoin"],
      arguments: [recipient, amountInOctas.toString()],
    };

    // For now, we'll return the transaction payload for the client to handle
    // In a production environment, you would need to securely store and use the private key
    // This is a simplified implementation for demonstration purposes
    
    return NextResponse.json({
      success: true,
      transactionPayload,
      message: `Transaction prepared: ${amount} APT to ${recipient}`,
      sender: wallet.address,
      recipient,
      amount,
      amountInOctas,
      network: 'Aptos Testnet'
    });

  } catch (error) {
    console.error('Error preparing transaction:', error);
    return NextResponse.json(
      { error: 'Failed to prepare transaction' },
      { status: 500 }
    );
  }
}
