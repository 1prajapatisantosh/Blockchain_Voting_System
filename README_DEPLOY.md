# Blockchain Voting System - Deployment Guide

This document provides instructions for deploying the Blockchain Voting System to Netlify.

## Prerequisites

Before deploying, ensure you have:

1. A Netlify account
2. A Firebase project for authentication and database
3. Access to an Ethereum network (can be a testnet like Sepolia)

## Local Setup

1. Clone the repository
2. Install dependencies: `bun install`
3. Run locally: `bun run dev`

## Deployment to Netlify

### Automatic Deployment (Recommended)

1. Push your code to a GitHub/GitLab repository
2. In Netlify, click "Add new site" > "Import an existing project"
3. Connect to your Git provider and select the repository
4. Configure the build settings:
   - Build command: `bun run build`
   - Publish directory: `dist`
5. Click "Deploy site"

### Manual Deployment

1. Build the project: `bun run build`
2. The built files will be in the `dist` directory
3. Drag and drop the `dist` folder to Netlify's manual deploy area

## Environment Variables

Make sure to set these environment variables in Netlify:

- Firebase configuration variables (if not hardcoded in the app)
- Ethereum network configuration (if needed)

## Post-Deployment

1. Set up custom domain (optional)
2. Configure HTTPS (Netlify handles this automatically)
3. Test the deployed application

## Troubleshooting

- If you encounter routing issues, ensure the `_redirects` file is in the `public` directory
- For contract interaction problems, check that the contract address is correct
- If Firebase auth doesn't work, verify your Firebase project settings

For more detailed information about the smart contract deployment, see DEPLOYMENT_GUIDE.md.
