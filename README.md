# 🚀 AptosAI - Intelligent Blockchain Assistant

<div align="center">

![AptosAI Logo](public/robot.png)

**Making Web3 accessible through natural language conversations**

[![Next.js](https://img.shields.io/badge/Next.js-15.3.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Aptos](https://img.shields.io/badge/Aptos-4.0.0-purple?style=for-the-badge&logo=aptos)](https://aptoslabs.com/)
[![AI](https://img.shields.io/badge/AI-Gemini%202.5%20Flash-orange?style=for-the-badge&logo=google)](https://ai.google.dev/)

</div>

## 📖 Overview

AptosAI is an intelligent blockchain assistant that makes Web3 interactions accessible to everyone through natural language conversations. Built specifically for the Aptos ecosystem, it allows users to interact with blockchain networks using simple, conversational queries instead of complex technical commands.

### 🎯 Mission

To democratize blockchain technology by providing an intuitive, AI-powered interface that bridges the gap between complex blockchain operations and everyday users.

## ✨ Key Features

### 🤖 **Natural Language Blockchain Queries**
- Ask questions like "What's my APT balance?" or "Send 10 APT to 0x..."
- No need to learn complex blockchain commands
- Conversational interface that understands context

### 🔗 **Multi-Chain Support**
- **Primary Focus**: Aptos blockchain (Mainnet, Testnet, Devnet)
- **Planned**: Ethereum, Solana, and other major blockchains
- Seamless switching between networks

### 💬 **Modern Chat Interface**
- Familiar chatbot UI similar to ChatGPT
- Real-time conversation flow
- Rich message formatting with markdown support

### 📚 **Chat History & Persistence**
- Secure storage of conversation history
- Resume previous conversations
- Export chat logs for record keeping

### 🔐 **Secure Wallet Integration**
- Support for Aptos wallet adapters (Petra, Martian, etc.)
- Keyless wallet support for enhanced security
- Secure transaction signing

### 🛠️ **Advanced Tools & Functions**

#### **Aptos Blockchain Tools**
- **Balance Checking**: Get APT balances across all networks
- **Token Transfers**: Send APT tokens with gas estimation
- **Token Creation**: Create custom tokens (demonstration mode)
- **Transaction History**: View and track transaction status
- **Network Switching**: Seamless network transitions

#### **Smart Contract Interactions**
- Read contract data through natural language
- Execute contract functions with guided prompts
- DeFi protocol interactions (planned)

## 🏗️ Architecture

### **Frontend Stack**
- **Framework**: Next.js 15.3.2 with App Router
- **Language**: TypeScript 5.0
- **Styling**: Tailwind CSS 4.0
- **UI Components**: Radix UI primitives
- **Animations**: Framer Motion
- **State Management**: Zustand

### **Backend & AI**
- **AI Model**: Google Gemini 2.5 Flash
- **AI SDK**: Vercel AI SDK
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **File Storage**: Vercel Blob

### **Blockchain Integration**
- **Aptos SDK**: @aptos-labs/ts-sdk v4.0.0
- **Wallet Adapter**: @aptos-labs/wallet-adapter-react
- **Network Support**: Testnet, Mainnet, Devnet

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- PostgreSQL database
- Aptos wallet (Petra, Martian, etc.)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/aptos-ai.git
   cd aptos-ai
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure the following variables:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/aptosai"
   
   # Authentication
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   
   # AI
   GOOGLE_GENERATIVE_AI_API_KEY="your-gemini-api-key"
   
   # Blockchain
   APTOS_NETWORK="testnet"
   ```

4. **Set up the database**
   ```bash
   pnpm prisma:generate
   pnpm prisma db push
   ```

5. **Start the development server**
   ```bash
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠️ Available Tools

### **Balance Management**
```typescript
// Get APT balance on different networks
getAptosBalance(address: string)           // Mainnet
getAptosTestnetBalance(address: string)    // Testnet  
getAptosDevnetBalance(address: string)     // Devnet
checkAptosBalance(address: string)         // Auto-detect network
```

### **Token Operations**
```typescript
// Transfer APT tokens
transferAptos(recipient: string, amount: number)        // Mainnet
transferAptosTestnet(recipient: string, amount: number) // Testnet

// Create custom tokens (demo mode)
createAptosToken(name: string, symbol: string, decimals: number, supply: number)
```

### **Example Queries**

**Balance Checking:**
- "What's my APT balance?"
- "Check my balance on testnet"
- "Show me my wallet balance"

**Token Transfers:**
- "Send 10 APT to 0x1234..."
- "Transfer 5 APT to my friend's wallet"
- "Send 0.5 APT to 0xabcd..."

**Token Creation:**
- "Create a token called MyToken with symbol MTK"
- "Make a new coin with 1000 supply and 6 decimals"

## 🔧 Development

### **Project Structure**
```
src/
├── ai/                    # AI configuration and tools
│   ├── tools/            # Blockchain interaction tools
│   │   ├── aptos/        # Aptos-specific tools
│   │   ├── evm/          # Ethereum tools (planned)
│   │   └── sui/          # Sui tools (planned)
│   ├── models.ts         # AI model configuration
│   └── system-instructions.ts
├── components/           # React components
│   ├── platform/        # Main app components
│   ├── marketing-page/  # Landing page components
│   └── ui/              # Reusable UI components
├── database/            # Database configuration
├── hooks/               # Custom React hooks
└── lib/                 # Utility functions
```

### **Adding New Tools**

1. **Create tool file** in `src/ai/tools/[chain]/`
2. **Export tool** in `src/ai/tools/index.ts`
3. **Add UI component** in `src/components/platform/chat/tools-ui/`
4. **Update view-messages.tsx** to handle new tool
5. **Update system instructions** with tool documentation

### **Code Style**
- **ESLint**: Configured with Next.js rules
- **Prettier**: Code formatting
- **Husky**: Pre-commit hooks
- **TypeScript**: Strict mode enabled

## 🎨 UI/UX Features

### **Design System**
- **Color Scheme**: Dark theme with purple/fuchsia accents
- **Typography**: Modern, readable fonts
- **Components**: Consistent Radix UI primitives
- **Responsive**: Mobile-first design approach

### **User Experience**
- **Loading States**: Skeleton loaders and progress indicators
- **Error Handling**: Graceful error messages and recovery
- **Toast Notifications**: Real-time feedback
- **Keyboard Shortcuts**: Power user features

## 🔒 Security

### **Authentication**
- **NextAuth.js**: Secure session management
- **Password Hashing**: bcrypt for secure password storage
- **Session Protection**: Secure HTTP-only cookies

### **Blockchain Security**
- **Wallet Integration**: No private key storage
- **Transaction Validation**: Client-side validation
- **Network Verification**: Automatic network detection

### **Data Protection**
- **Encryption**: Sensitive data encryption
- **Privacy**: No unnecessary data collection
- **GDPR Compliance**: User data control

## 🚀 Deployment

### **Vercel (Recommended)**
```bash
# Deploy to Vercel
vercel --prod
```

### **Docker**
```bash
# Build Docker image
docker build -t aptos-ai .

# Run container
docker run -p 3000:3000 aptos-ai
```

### **Environment Setup**
- Configure production environment variables
- Set up PostgreSQL database
- Configure domain and SSL certificates
- Set up monitoring and logging

## 📈 Performance

### **Optimizations**
- **Next.js App Router**: Latest routing system
- **Image Optimization**: Next.js Image component
- **Code Splitting**: Automatic bundle splitting
- **Caching**: Strategic caching strategies

### **Monitoring**
- **Error Tracking**: Built-in error boundaries
- **Performance**: Core Web Vitals monitoring
- **Analytics**: User interaction tracking

## 🗺️ Roadmap

### **Phase 1: Core Aptos Features** ✅
- [x] Balance checking across networks
- [x] APT token transfers
- [x] Wallet integration
- [x] Chat interface
- [x] User authentication

### **Phase 2: Enhanced Aptos Tools** 🚧
- [ ] DeFi protocol interactions
- [ ] NFT operations
- [ ] Smart contract interactions
- [ ] Advanced token management
- [ ] Transaction analytics

### **Phase 3: Multi-Chain Expansion** 📋
- [ ] Ethereum integration
- [ ] Solana support
- [ ] Polygon integration
- [ ] Cross-chain operations
- [ ] Universal wallet support

### **Phase 4: Advanced Features** 🔮
- [ ] AI-powered DeFi strategies
- [ ] Portfolio management
- [ ] Market analysis
- [ ] Automated trading
- [ ] Social features

### **Phase 5: Enterprise & Scale** 🏢
- [ ] Enterprise dashboard
- [ ] API access
- [ ] White-label solutions
- [ ] Advanced analytics
- [ ] Compliance tools

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### **Development Setup**
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### **Code of Conduct**
Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before contributing.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Aptos Labs** for the excellent blockchain infrastructure
- **Vercel** for the AI SDK and deployment platform
- **Google** for the Gemini AI model
- **Open Source Community** for the amazing tools and libraries

## 📞 Support

- **Documentation**: [docs.aptosai.com](https://docs.aptosai.com)
- **Discord**: [Join our community](https://discord.gg/aptosai)
- **Twitter**: [@AptosAI](https://twitter.com/aptosai)
- **Email**: support@aptosai.com

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=your-username/aptos-ai&type=Date)](https://star-history.com/#your-username/aptos-ai&Date)

---

<div align="center">

**Built with ❤️ for the Aptos ecosystem**

[Website](https://aptosai.com) • [Documentation](https://docs.aptosai.com) • [Discord](https://discord.gg/aptosai) • [Twitter](https://twitter.com/aptosai)

</div>