#!/bin/bash
set -e

echo "Adding GOOGLE_CLIENT_EMAIL..."
cat << 'EOF' | npx vercel env add GOOGLE_CLIENT_EMAIL production --force
mosiqti-bot@mosiqti.iam.gserviceaccount.com
EOF

echo "Adding GOOGLE_SHEET_ID..."
cat << 'EOF' | npx vercel env add GOOGLE_SHEET_ID production --force
10rRkZZM50hGb_u9pixFtyYVSbKYdnbGSoff4aegJpQU
EOF

echo "Adding GOOGLE_PRIVATE_KEY..."
# Use grep/awk to extract from .env.local without evaluating \n, or simply read it directly
# The private key in .env.local is currently stored with explicit \n sequences.
# We'll just push exactly what is in .env.local
KEY=$(grep "^GOOGLE_PRIVATE_KEY=" .env.local | sed 's/^GOOGLE_PRIVATE_KEY=//' | sed 's/^"//' | sed 's/"$//')
echo -n "$KEY" | npx vercel env add GOOGLE_PRIVATE_KEY production --force

echo "Done!"
