This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## ROI Calculator

The project includes an ROI calculator that uses the Claude API to provide personalized estimates of cost savings and revenue gains from implementing Support3.

### Setting up Claude API

1. Get a Claude API key from [Anthropic Console](https://console.anthropic.com/)
2. Copy the `.env.local.example` file to `.env.local`
3. Replace `your_claude_api_key_here` with your actual Claude API key

```bash
cp .env.local.example .env.local
```

The calculator uses Claude 3.7 Sonnet to analyze your company's profile and provide:
- Estimated annual cost savings
- Estimated annual revenue gains
- A summary analysis of the ROI
- A detailed breakdown of how these figures were calculated

If you don't have a Claude API key, the calculator will fall back to using pre-defined estimates based on company size.

### How the ROI Calculator Works

1. The calculator takes your company size, support team size, and optional revenue as inputs
2. It sends this information to Claude 3.7 Sonnet with a prompt to analyze the potential ROI
3. Claude returns a structured JSON response with cost savings, revenue gains, and analysis
4. The calculator displays these results in an interactive, user-friendly format

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
