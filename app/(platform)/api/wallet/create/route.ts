import { NextResponse } from 'next/server';
import { auth } from '@/app/(auth)/auth';
import { Aptos, AptosConfig, Network, Ed25519PrivateKey } from '@aptos-labs/ts-sdk';
import { createWallet, getWalletByUserId } from '@/src/database/queries';

export async function POST() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user already has a wallet
    const existingWallet = await getWalletByUserId(session.user.id);
    if (existingWallet) {
      return NextResponse.json(
        { error: 'User already has a wallet' },
        { status: 400 }
      );
    }

    // Initialize Aptos client
    const config = new AptosConfig({ network: Network.TESTNET });
    const aptos = new Aptos(config);

    // Generate a new Ed25519 private key for the user
    const privateKey = Ed25519PrivateKey.generate();
    const publicKey = privateKey.publicKey();
    
    // Create account from private key
    const account = aptos.deriveAccountFromPrivateKey({ privateKey });

    // Save wallet to database
    const wallet = await createWallet({
      userId: session.user.id,
      address: (await account).accountAddress.toString(),
      publicKey: publicKey.toString(),
    });

    return NextResponse.json({
      success: true,
      wallet: {
        id: wallet.id,
        address: wallet.address,
        publicKey: wallet.publicKey,
        createdAt: wallet.createdAt,
      },
    });
  } catch (error) {
    console.error('Error creating wallet:', error);
    return NextResponse.json(
      { error: 'Failed to create wallet' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user's wallet
    const wallet = await getWalletByUserId(session.user.id);
    
    if (!wallet) {
      return NextResponse.json(
        { wallet: null },
        { status: 200 }
      );
    }

    return NextResponse.json({
      wallet: {
        id: wallet.id,
        address: wallet.address,
        publicKey: wallet.publicKey,
        createdAt: wallet.createdAt,
      },
    });
  } catch (error) {
    console.error('Error getting wallet:', error);
    return NextResponse.json(
      { error: 'Failed to get wallet' },
      { status: 500 }
    );
  }
}
