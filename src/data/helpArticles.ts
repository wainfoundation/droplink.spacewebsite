
export interface HelpArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  readTime: string;
  publishedAt: string;
  tags: string[];
  featured: boolean;
}

export const helpArticles: HelpArticle[] = [
  {
    id: "creating-account",
    title: "Creating Your Droplink Account",
    excerpt: "Step-by-step guide to setting up your Droplink account and getting started.",
    content: `
      <h2>Getting Started with Droplink</h2>
      <p>Welcome to Droplink! This guide walks you through creating your account and setting up your first profile on the Pi Network's premier link-in-bio platform.</p>
      
      <h3>Step 1: Pi Network Authentication</h3>
      <p>To create your Droplink account, you'll need:</p>
      <ul>
        <li>An active Pi Network account</li>
        <li>Pi Browser installed on your device</li>
        <li>Verified identity on Pi Network</li>
      </ul>
      
      <h3>Step 2: Sign Up Process</h3>
      <p>Visit droplink.space in your Pi Browser and click "Get Started". You'll be redirected to Pi Network's secure authentication system.</p>
      
      <h3>Step 3: Choose Your Username</h3>
      <p>Select a unique username that will become part of your profile URL (droplink.space/@username). This represents your brand, so choose carefully. You can change it later in your settings.</p>
      
      <h3>Step 4: Complete Your Profile</h3>
      <p>Add essential information:</p>
      <ul>
        <li>Profile picture (upload or use Pi avatar)</li>
        <li>Bio (up to 80 characters)</li>
        <li>Contact information</li>
        <li>Social media links</li>
      </ul>
      
      <h3>Step 5: Connect Your Pi Wallet</h3>
      <p>Enable Pi payments by connecting your Pi wallet. This allows you to:</p>
      <ul>
        <li>Receive tips from your audience</li>
        <li>Sell digital products</li>
        <li>Accept Pi payments for services</li>
      </ul>
      
      <h3>Best Practices</h3>
      <p>To maximize your Droplink profile's effectiveness:</p>
      <ul>
        <li>Use a clear, professional profile picture</li>
        <li>Write a compelling bio that describes who you are</li>
        <li>Add your most important links first</li>
        <li>Keep your profile updated regularly</li>
      </ul>
    `,
    category: "Getting Started",
    readTime: "5 min",
    publishedAt: "2024-01-15",
    tags: ["signup", "account", "getting-started", "pi-network"],
    featured: true
  },
  {
    id: "profile-setup",
    title: "Setting Up Your Profile",
    excerpt: "Complete guide to creating an attractive and effective Droplink profile.",
    content: `
      <h2>Profile Setup Guide</h2>
      <p>Your Droplink profile is your digital business card. Learn how to make it shine and attract your target audience.</p>
      
      <h3>Profile Picture Best Practices</h3>
      <ul>
        <li>Use a high-quality image (at least 400x400 pixels)</li>
        <li>Choose a clear, recognizable photo of yourself or logo</li>
        <li>Ensure good lighting and contrast</li>
        <li>Keep it professional but authentic</li>
        <li>Square aspect ratio works best</li>
      </ul>
      
      <h3>Writing Your Bio</h3>
      <p>Your bio has 80 characters to make an impact:</p>
      <ul>
        <li>Start with who you are or what you do</li>
        <li>Include your main value proposition</li>
        <li>Use emojis sparingly but effectively</li>
        <li>Include a call-to-action if space permits</li>
        <li>Keep it updated with current projects</li>
      </ul>
      
      <h3>Contact Information</h3>
      <p>Make it easy for people to reach you:</p>
      <ul>
        <li>Add your primary email address</li>
        <li>Include business phone if applicable</li>
        <li>Add location if relevant to your business</li>
        <li>Link to your main social media accounts</li>
      </ul>
      
      <h3>Social Media Integration</h3>
      <p>Connect your social platforms:</p>
      <ul>
        <li>Instagram for visual content</li>
        <li>Twitter for updates and engagement</li>
        <li>LinkedIn for professional networking</li>
        <li>YouTube for video content</li>
        <li>TikTok for short-form videos</li>
      </ul>
      
      <h3>Privacy Settings</h3>
      <p>Control your profile visibility:</p>
      <ul>
        <li>Public profile (recommended for businesses)</li>
        <li>Private profile (invite-only access)</li>
        <li>Search engine indexing preferences</li>
        <li>Analytics sharing settings</li>
      </ul>
    `,
    category: "Getting Started",
    readTime: "4 min",
    publishedAt: "2024-02-15",
    tags: ["profile", "setup", "bio", "social-media"],
    featured: false
  },
  {
    id: "adding-links",
    title: "Adding and Managing Links",
    excerpt: "Learn how to add, organize, and optimize your links for maximum engagement.",
    content: `
      <h2>Adding Links</h2>
      <p>Effective link management is crucial for driving traffic and achieving your goals. Here's how to master it.</p>
      
      <h3>Create a New Link</h3>
      <ol>
        <li>Click "Add Link" in your dashboard</li>
        <li>Enter the destination URL</li>
        <li>Create an engaging title</li>
        <li>Write a compelling description</li>
        <li>Choose or upload a thumbnail image</li>
        <li>Set link priority (order on your profile)</li>
      </ol>
      
      <h3>Link Types</h3>
      <ul>
        <li><strong>Standard Links:</strong> Direct to external websites</li>
        <li><strong>Social Media:</strong> Links to your social profiles</li>
        <li><strong>Contact:</strong> Email, phone, or messaging apps</li>
        <li><strong>Digital Products:</strong> Sell items directly</li>
        <li><strong>Calendly/Booking:</strong> Schedule appointments</li>
        <li><strong>Payment Links:</strong> Accept payments</li>
      </ul>
      
      <h3>Optimize for Clicks</h3>
      <p>Make your links more clickable by:</p>
      <ul>
        <li>Using action-oriented titles</li>
        <li>Including benefits in descriptions</li>
        <li>Choosing eye-catching thumbnails</li>
        <li>Adding urgency when appropriate</li>
        <li>A/B testing different versions</li>
      </ul>
      
      <h3>Organize Your List</h3>
      <p>Structure your links strategically:</p>
      <ul>
        <li>Keep priority links at the top</li>
        <li>Group similar links together</li>
        <li>Use consistent naming conventions</li>
        <li>Remove outdated links regularly</li>
        <li>Pin time-sensitive campaigns during promos</li>
      </ul>
    `,
    category: "Getting Started",
    readTime: "6 min",
    publishedAt: "2024-02-20",
    tags: ["links", "management", "optimization", "analytics"],
    featured: false
  },
  {
    id: "dashboard-overview",
    title: "Understanding the Dashboard",
    excerpt: "Take a quick tour of the Droplink dashboard, widgets, and shortcuts.",
    content: `
      <h2>Dashboard Tour</h2>
      <p>The dashboard is your command center for everything in Droplink. Here's what you can control from one place.</p>
      
      <h3>Main Navigation</h3>
      <ul>
        <li><strong>Overview:</strong> High-level stats, quick actions, and alerts</li>
        <li><strong>Links:</strong> Add, edit, schedule, and reorder links</li>
        <li><strong>Appearance:</strong> Themes, colors, fonts, and branding</li>
        <li><strong>Analytics:</strong> Traffic, clicks, conversions, and exports</li>
        <li><strong>Settings:</strong> Account, billing, and Pi Network controls</li>
      </ul>
      
      <h3>Widgets You Can Trust</h3>
      <ul>
        <li>Live profile preview that updates as you edit</li>
        <li>Quick add buttons for links, products, or announcements</li>
        <li>Recent activity feed for tips, comments, and transactions</li>
        <li>Alerts for expiring trials, domain status, and integration health</li>
      </ul>
      
      <h3>Tips for Speed</h3>
      <ul>
        <li>Use keyboard shortcuts (Ctrl/Command + K) to open global search</li>
        <li>Pin your most-used panels by dragging them to the top</li>
        <li>Save frequently used link templates in Appearance > Buttons</li>
      </ul>
    `,
    category: "Getting Started",
    readTime: "4 min",
    publishedAt: "2024-02-22",
    tags: ["dashboard", "navigation", "overview"],
    featured: false
  },
  {
    id: "app-vs-web",
    title: "Mobile App vs. Web Platform",
    excerpt: "Understand when to use Pi Browser, the mobile-friendly web app, and desktop views.",
    content: `
      <h2>Choosing Where to Work</h2>
      <p>Droplink is optimized for Pi Browser but works across devices. Pick the experience that fits your workflow.</p>
      
      <h3>Pi Browser (Recommended)</h3>
      <ul>
        <li>Required for Pi authentication and wallet actions</li>
        <li>Optimized for mobile creators who update on the go</li>
        <li>Full feature parity with dashboard tools</li>
      </ul>
      
      <h3>Desktop Browsers</h3>
      <ul>
        <li>Best for batch editing links and detailed analytics</li>
        <li>Use when preparing long-form content or uploads</li>
        <li>Pi payments require Pi Browser; other features still available</li>
      </ul>
      
      <h3>Viewer Experience</h3>
      <ul>
        <li>Your public profile is responsive on mobile and desktop</li>
        <li>Theme previews mirror the device visitors are using</li>
        <li>Always test payment flows inside Pi Browser before launch</li>
      </ul>
    `,
    category: "Getting Started",
    readTime: "3 min",
    publishedAt: "2024-02-24",
    tags: ["mobile", "desktop", "pi-browser"],
    featured: false
  },
  {
    id: "change-username",
    title: "Changing Your Username",
    excerpt: "Update your Droplink username safely without losing your audience.",
    content: `
      <h2>Update Your Handle</h2>
      <p>You can change your username at any time. We'll automatically redirect your old profile URL for 14 days.</p>
      
      <h3>How to Change</h3>
      <ol>
        <li>Open Settings > Account</li>
        <li>Select "Username" and enter your new handle</li>
        <li>Confirm availability and save changes</li>
        <li>Review the preview link before publishing</li>
      </ol>
      
      <h3>What to Expect</h3>
      <ul>
        <li>Your profile URL updates instantly</li>
        <li>Old links redirect for two weeks to prevent broken shares</li>
        <li>Analytics and payment history stay intact</li>
      </ul>
      
      <h3>Best Practices</h3>
      <ul>
        <li>Choose a name that matches your brand across platforms</li>
        <li>Update social bios and banners after changing</li>
        <li>Avoid frequent changes to keep audience trust</li>
      </ul>
    `,
    category: "Account Management",
    readTime: "3 min",
    publishedAt: "2024-02-18",
    tags: ["username", "account", "branding"],
    featured: false
  },
  {
    id: "email-preferences",
    title: "Managing Email Preferences",
    excerpt: "Control product updates, billing notices, and security alerts in one place.",
    content: `
      <h2>Notification Controls</h2>
      <p>Choose which emails you want to receive so your inbox stays focused.</p>
      
      <h3>Update Your Preferences</h3>
      <ol>
        <li>Go to Settings > Notifications</li>
        <li>Toggle product updates, tips, and community digests</li>
        <li>Security and billing emails are always on for protection</li>
        <li>Save changes and test with a sample email</li>
      </ol>
      
      <h3>Recommended Settings</h3>
      <ul>
        <li>Keep security alerts enabled for login and payment events</li>
        <li>Enable weekly summaries for a quick performance recap</li>
        <li>Mute marketing promos if you prefer only operational emails</li>
      </ul>
    `,
    category: "Account Management",
    readTime: "3 min",
    publishedAt: "2024-02-19",
    tags: ["notifications", "email", "settings"],
    featured: false
  },
  {
    id: "security-best-practices",
    title: "Account Security Best Practices",
    excerpt: "Keep your Droplink and Pi credentials safe with simple safeguards.",
    content: `
      <h2>Protect Your Account</h2>
      <p>Your Droplink account is tied to your Pi identity. Follow these steps to keep everything secure.</p>
      
      <h3>Core Practices</h3>
      <ul>
        <li>Always authenticate through Pi Browser to avoid phishing</li>
        <li>Enable device-level biometrics on your phone</li>
        <li>Review active sessions in Settings > Security</li>
        <li>Revoke tokens you don't recognize</li>
      </ul>
      
      <h3>Safe Sharing</h3>
      <ul>
        <li>Never share wallet passphrases or screenshots</li>
        <li>Grant team access via roles instead of sharing logins</li>
        <li>Use read-only roles for collaborators who don't need billing</li>
      </ul>
      
      <h3>Recovery Steps</h3>
      <ul>
        <li>Disconnect devices you don't recognize</li>
        <li>Re-authenticate with Pi Browser to refresh tokens</li>
        <li>Contact support if you suspect unauthorized access</li>
      </ul>
    `,
    category: "Account Management",
    readTime: "4 min",
    publishedAt: "2024-02-21",
    tags: ["security", "account", "safety"],
    featured: true
  },
  {
    id: "delete-account",
    title: "Deleting Your Account",
    excerpt: "Understand what happens when you permanently delete your Droplink account.",
    content: `
      <h2>Before You Delete</h2>
      <p>Deleting your account removes your profile, links, and analytics. Exports are not available afterward.</p>
      
      <h3>How to Delete</h3>
      <ol>
        <li>Open Settings > Account</li>
        <li>Select "Delete Account" and read the checklist</li>
        <li>Confirm your Pi identity in Pi Browser</li>
        <li>Type DELETE to confirm and submit</li>
      </ol>
      
      <h3>What Gets Removed</h3>
      <ul>
        <li>Public profile and all shared links</li>
        <li>Stored analytics and history</li>
        <li>Team roles and invitations</li>
      </ul>
      
      <h3>Billing Notes</h3>
      <ul>
        <li>Active subscriptions are canceled immediately</li>
        <li>No additional charges occur after deletion</li>
        <li>Pending payouts continue following Pi Network rules</li>
      </ul>
    `,
    category: "Account Management",
    readTime: "4 min",
    publishedAt: "2024-02-23",
    tags: ["account", "deletion", "privacy"],
    featured: false
  },
  {
    id: "multiple-profiles",
    title: "Managing Multiple Profiles",
    excerpt: "Learn how team seats and brand workspaces handle multiple profiles.",
    content: `
      <h2>One Identity, Many Brands</h2>
      <p>Each Pi Network identity maps to a primary Droplink profile, but Premium teams can collaborate across multiple brand spaces.</p>
      
      <h3>Ways to Manage</h3>
      <ul>
        <li>Create brand workspaces and invite collaborators</li>
        <li>Assign roles: Owner, Editor, Analyst, Support</li>
        <li>Switch workspaces from the avatar menu</li>
      </ul>
      
      <h3>What Stays Shared</h3>
      <ul>
        <li>Billing is consolidated under the workspace owner</li>
        <li>Analytics are isolated per workspace</li>
        <li>Team members keep personal Pi identities—no shared logins</li>
      </ul>
      
      <h3>Best Practices</h3>
      <ul>
        <li>Use separate workspaces for different brands or clients</li>
        <li>Downgrade unused seats to save Pi</li>
        <li>Audit roles monthly to keep access lean</li>
      </ul>
    `,
    category: "Account Management",
    readTime: "5 min",
    publishedAt: "2024-02-24",
    tags: ["teams", "workspace", "roles"],
    featured: false
  },
  {
    id: "choosing-theme",
    title: "Choosing a Theme",
    excerpt: "Pick the right Droplink theme for your brand and audience.",
    content: `
      <h2>Theme Library</h2>
      <p>Droplink ships with curated themes for creators, businesses, and Pi enthusiasts.</p>
      
      <h3>How to Pick</h3>
      <ol>
        <li>Go to Appearance in your dashboard</li>
        <li>Filter by style: Minimal, Gradient, Pi, Professional, Dark</li>
        <li>Click Preview to see your live content in context</li>
        <li>Apply when you're happy—changes are instant</li>
      </ol>
      
      <h3>Plan Access</h3>
      <ul>
        <li>Free: 1 starter theme</li>
        <li>Basic: 10 premium themes</li>
        <li>Pro: 50+ premium themes and scheduling</li>
        <li>Premium: All themes plus custom CSS</li>
      </ul>
      
      <h3>Testing Tips</h3>
      <ul>
        <li>Preview on both mobile and desktop before publishing</li>
        <li>Check contrast ratios for accessibility</li>
        <li>Use analytics to compare link performance after a theme change</li>
      </ul>
    `,
    category: "Customization",
    readTime: "4 min",
    publishedAt: "2024-02-12",
    tags: ["themes", "branding", "appearance"],
    featured: false
  },
  {
    id: "custom-themes-guide",
    title: "Setting Up Custom Themes",
    excerpt: "A comprehensive guide to personalizing your Droplink profile with custom themes and styling.",
    content: `
      <h2>Customizing Your Profile Theme</h2>
      <p>Make your Droplink profile stand out with our extensive collection of professional themes and customization options.</p>
      
      <h3>Theme Categories</h3>
      <p>Choose from various theme styles:</p>
      <ul>
        <li><strong>Minimalist:</strong> Clean, simple designs focusing on content</li>
        <li><strong>Creative:</strong> Colorful, artistic themes for creators</li>
        <li><strong>Professional:</strong> Business-oriented layouts</li>
        <li><strong>Pi Network:</strong> Official Pi-inspired designs</li>
        <li><strong>Gradient:</strong> Modern gradient backgrounds</li>
        <li><strong>Dark Mode:</strong> Eye-friendly dark themes</li>
      </ul>
      
      <h3>Free vs. Premium Themes</h3>
      <p>Plan features:</p>
      <ul>
        <li><strong>Free Plan:</strong> 1 basic theme</li>
        <li><strong>Basic Plan:</strong> 10 premium themes</li>
        <li><strong>Pro Plan:</strong> 50+ themes + custom colors</li>
        <li><strong>Premium Plan:</strong> All themes + custom CSS</li>
      </ul>
      
      <h3>Customization Options</h3>
      <p>Advanced styling features (Pro/Premium):</p>
      <ul>
        <li>Custom color schemes</li>
        <li>Font selection (Google Fonts)</li>
        <li>Background images and patterns</li>
        <li>Button styles and animations</li>
        <li>Custom CSS for ultimate control</li>
      </ul>
      
      <h3>Theme Installation</h3>
      <ol>
        <li>Go to Dashboard > Appearance</li>
        <li>Browse available themes</li>
        <li>Click "Preview" to see how it looks</li>
        <li>Click "Apply" to activate</li>
        <li>Customize colors and fonts if available</li>
      </ol>
      
      <h3>Mobile Optimization</h3>
      <p>All themes are automatically optimized for:</p>
      <ul>
        <li>Mobile devices and tablets</li>
        <li>Pi Browser compatibility</li>
        <li>Fast loading times</li>
        <li>Touch-friendly interfaces</li>
      </ul>
      
      <h3>Custom CSS (Premium)</h3>
      <p>Premium users can add custom CSS for:</p>
      <ul>
        <li>Unique animations</li>
        <li>Custom layouts</li>
        <li>Brand-specific styling</li>
        <li>Advanced hover effects</li>
      </ul>
    `,
    category: "Customization",
    readTime: "7 min",
    publishedAt: "2024-01-25",
    tags: ["themes", "customization", "design", "premium"],
    featured: true
  },
  {
    id: "custom-colors-fonts",
    title: "Custom Colors and Fonts",
    excerpt: "Dial in your brand palette, typography, and buttons without code.",
    content: `
      <h2>Brand Controls</h2>
      <p>Pro and Premium plans let you fine-tune your palette and typography so your profile matches your brand everywhere.</p>
      
      <h3>Colors</h3>
      <ul>
        <li>Pick primary and accent colors in Appearance > Colors</li>
        <li>Use the accessibility checker to keep contrast compliant</li>
        <li>Save presets to reuse on seasonal campaigns</li>
      </ul>
      
      <h3>Fonts</h3>
      <ul>
        <li>Choose from curated Google Fonts</li>
        <li>Set different fonts for headings and body text</li>
        <li>Adjust letter spacing for button legibility</li>
      </ul>
      
      <h3>Buttons and Cards</h3>
      <ul>
        <li>Control corner radius, shadows, and hover states</li>
        <li>Pick filled or outline styles for calls-to-action</li>
        <li>Preview changes live before publishing</li>
      </ul>
    `,
    category: "Customization",
    readTime: "4 min",
    publishedAt: "2024-02-08",
    tags: ["colors", "fonts", "branding"],
    featured: false
  },
  {
    id: "profile-photos",
    title: "Adding Profile Photos",
    excerpt: "Upload, crop, and optimize your avatar or brand mark.",
    content: `
      <h2>Profile Photo Basics</h2>
      <p>A crisp photo helps visitors trust your page. Droplink supports square and circular crops.</p>
      
      <h3>Upload Guidelines</h3>
      <ul>
        <li>Recommended 800x800 PNG or JPG</li>
        <li>Keep file size under 2 MB for faster loads</li>
        <li>Use transparent PNGs for logos when possible</li>
      </ul>
      
      <h3>Editing Tools</h3>
      <ul>
        <li>Crop and reposition after upload</li>
        <li>Preview on light and dark backgrounds</li>
        <li>Use fallback initials if you prefer text-only</li>
      </ul>
    `,
    category: "Customization",
    readTime: "3 min",
    publishedAt: "2024-02-11",
    tags: ["photos", "avatar", "branding"],
    featured: false
  },
  {
    id: "link-appearance",
    title: "Link Appearance Options",
    excerpt: "Control layouts, spacing, icons, and animations for your links.",
    content: `
      <h2>Design Your Links</h2>
      <p>Visual polish improves click-through rates. Customize how each link looks and behaves.</p>
      
      <h3>Layout Choices</h3>
      <ul>
        <li>Stacked cards with thumbnails</li>
        <li>Compact list for quick scanning</li>
        <li>Grid for product-heavy profiles</li>
      </ul>
      
      <h3>Micro-interactions</h3>
      <ul>
        <li>Hover and tap animations</li>
        <li>Progress bars for downloads</li>
        <li>Priority badges for featured links</li>
      </ul>
      
      <h3>Accessibility</h3>
      <ul>
        <li>Ensure focus states are visible for keyboard users</li>
        <li>Use descriptive labels for screen readers</li>
        <li>Keep motion subtle for low-vision visitors</li>
      </ul>
    `,
    category: "Customization",
    readTime: "4 min",
    publishedAt: "2024-02-13",
    tags: ["appearance", "links", "design"],
    featured: false
  },
  {
    id: "custom-domain",
    title: "Custom Domain Setup",
    excerpt: "Connect your own domain or subdomain to your Droplink profile.",
    content: `
      <h2>Why Use a Custom Domain</h2>
      <p>Brand your profile at yourdomain.com instead of droplink.space/@username.</p>
      
      <h3>Setup Steps</h3>
      <ol>
        <li>Add your domain in Settings > Domains</li>
        <li>Create a CNAME record pointing to hosted.droplink.space</li>
        <li>Wait for DNS to propagate (usually under 30 minutes)</li>
        <li>Verify inside Droplink and apply the domain</li>
      </ol>
      
      <h3>Tips for Reliability</h3>
      <ul>
        <li>Keep TTL low during setup, then increase for stability</li>
        <li>Use a dedicated subdomain like links.yourbrand.com</li>
        <li>Renew domains early to avoid downtime</li>
      </ul>
      
      <h3>SSL and Security</h3>
      <ul>
        <li>SSL is issued automatically after verification</li>
        <li>We handle renewals—no manual certificates needed</li>
        <li>HSTS and redirect rules keep traffic secure</li>
      </ul>
    `,
    category: "Customization",
    readTime: "5 min",
    publishedAt: "2024-02-14",
    tags: ["domains", "dns", "branding"],
    featured: true
  },
  {
    id: "connecting-pi-wallet",
    title: "How to Connect Your Pi Wallet",
    excerpt: "Learn how to securely connect your Pi Network wallet to your Droplink account.",
    content: `
      <h2>Pi Network Integration</h2>
      <p>Connecting your Pi wallet is essential for monetizing your Droplink profile. This guide covers everything you need to know about secure wallet integration.</p>
      
      <h3>Prerequisites</h3>
      <ul>
        <li>Active Pi Network account with verified identity</li>
        <li>Pi Browser installed and up-to-date</li>
        <li>Pi wallet with available balance</li>
        <li>Completed KYC verification on Pi Network</li>
      </ul>
      
      <h3>Connection Process</h3>
      <ol>
        <li>Navigate to your Droplink dashboard</li>
        <li>Click "Settings" in the sidebar</li>
        <li>Select "Pi Network Settings"</li>
        <li>Click "Connect Pi Wallet"</li>
        <li>Authenticate through Pi Network's secure system</li>
        <li>Grant necessary permissions for payments</li>
        <li>Confirm wallet connection</li>
      </ol>
      
      <h3>Security Features</h3>
      <p>Your Pi wallet connection is protected by:</p>
      <ul>
        <li>Pi Network's official authentication system</li>
        <li>End-to-end encryption</li>
        <li>No private key storage on Droplink servers</li>
        <li>Transaction confirmation requirements</li>
      </ul>
      
      <h3>Troubleshooting</h3>
      <p>If you encounter issues:</p>
      <ul>
        <li>Ensure you're using Pi Browser (not regular browsers)</li>
        <li>Check your Pi Network app is updated</li>
        <li>Verify your identity is confirmed on Pi Network</li>
        <li>Contact support if problems persist</li>
      </ul>
      
      <h3>Managing Your Connection</h3>
      <p>Once connected, you can:</p>
      <ul>
        <li>View transaction history</li>
        <li>Set default tip amounts</li>
        <li>Configure payment notifications</li>
        <li>Disconnect wallet if needed</li>
      </ul>
    `,
    category: "Pi Network Integration",
    readTime: "6 min",
    publishedAt: "2024-01-20",
    tags: ["pi-network", "wallet", "payments", "security"],
    featured: true
  },
  {
    id: "pi-payments-setup",
    title: "Setting Up Pi Payments",
    excerpt: "Complete guide to enabling Pi cryptocurrency payments on your Droplink profile.",
    content: `
      <h2>Pi Payment Integration</h2>
      <p>Enable seamless Pi cryptocurrency transactions on your Droplink profile to monetize your content and services.</p>
      
      <h3>Payment Types Available</h3>
      <ul>
        <li><strong>Tips:</strong> One-click donations from your audience</li>
        <li><strong>Digital Products:</strong> Sell files, courses, or services</li>
        <li><strong>Subscriptions:</strong> Recurring Pi payments</li>
        <li><strong>Custom Amounts:</strong> Set your own pricing</li>
      </ul>
      
      <h3>Setup Process</h3>
      <ol>
        <li>Connect your Pi wallet (see wallet connection guide)</li>
        <li>Verify your identity on Pi Network</li>
        <li>Enable payments in Droplink settings</li>
        <li>Set default tip amounts</li>
        <li>Configure payment notifications</li>
      </ol>
      
      <h3>Transaction Fees</h3>
      <p>Understanding Pi payment costs:</p>
      <ul>
        <li>Pi Network fees: Standard network rates</li>
        <li>Droplink fees: 2.9% for Pro, 1.9% for Premium</li>
        <li>Free plan: Tips only, 5% platform fee</li>
      </ul>
      
      <h3>Security Measures</h3>
      <ul>
        <li>All transactions verified on Pi blockchain</li>
        <li>Automatic fraud detection</li>
        <li>Secure payment confirmation process</li>
        <li>Transaction history and receipts</li>
      </ul>
      
      <h3>Payment Widgets</h3>
      <p>Customize payment buttons:</p>
      <ul>
        <li>Tip button styling and placement</li>
        <li>Custom payment amounts</li>
        <li>Payment success messages</li>
        <li>Integration with products and services</li>
      </ul>
    `,
    category: "Pi Network Integration",
    readTime: "6 min",
    publishedAt: "2024-02-05",
    tags: ["pi-payments", "monetization", "cryptocurrency"],
    featured: true
  },
  {
    id: "pi-transaction-fees",
    title: "Understanding Pi Transaction Fees",
    excerpt: "See how Pi Network and Droplink fees work across plans.",
    content: `
      <h2>Fee Breakdown</h2>
      <p>Every Pi transaction has two parts: the Pi Network fee and the Droplink platform fee.</p>
      
      <h3>Network Fees</h3>
      <ul>
        <li>Set by Pi Network and vary by congestion</li>
        <li>Shown before you confirm a transaction</li>
        <li>Paid by the sender</li>
      </ul>
      
      <h3>Droplink Fees</h3>
      <ul>
        <li>Free plan: 5% on tips only</li>
        <li>Pro plan: 2.9% on all transactions</li>
        <li>Premium plan: 1.9% on all transactions</li>
      </ul>
      
      <h3>Tips to Reduce Costs</h3>
      <ul>
        <li>Bundle payouts to reduce total network fees</li>
        <li>Schedule launches during off-peak hours</li>
        <li>Upgrade to Premium for the lowest platform rate</li>
      </ul>
    `,
    category: "Pi Network Integration",
    readTime: "3 min",
    publishedAt: "2024-02-06",
    tags: ["fees", "payments", "pi-network"],
    featured: false
  },
  {
    id: "pi-tips-donations",
    title: "Pi Tips and Donations",
    excerpt: "Enable tipping, set suggested amounts, and thank supporters automatically.",
    content: `
      <h2>Enable Tips</h2>
      <p>Tips are the fastest way for supporters to send you Pi. Set them up in minutes.</p>
      
      <h3>Configuration</h3>
      <ul>
        <li>Go to Settings > Payments > Tips</li>
        <li>Choose suggested amounts and currencies (Pi only)</li>
        <li>Add a thank-you message and follow-up link</li>
      </ul>
      
      <h3>Best Practices</h3>
      <ul>
        <li>Pin the tip button near the top of your profile</li>
        <li>Use analytics to see which messages convert best</li>
        <li>Send automated receipts and gratitude notes</li>
      </ul>
      
      <h3>Compliance</h3>
      <ul>
        <li>Only collect for permitted purposes per Pi terms</li>
        <li>Refunds follow Pi Network transaction rules</li>
        <li>Keep records for your local tax requirements</li>
      </ul>
    `,
    category: "Pi Network Integration",
    readTime: "4 min",
    publishedAt: "2024-02-07",
    tags: ["tips", "donations", "payments"],
    featured: false
  },
  {
    id: "pi-network-auth",
    title: "Pi Network Authentication",
    excerpt: "How Droplink uses Pi Browser for secure logins and approvals.",
    content: `
      <h2>Why Pi Browser</h2>
      <p>Pi Browser provides native authentication and wallet permissions. Droplink relies on it to verify your identity and keep payments secure.</p>
      
      <h3>Login Flow</h3>
      <ul>
        <li>Start login on droplink.space</li>
        <li>Pi Browser opens to confirm your identity</li>
        <li>Tokens are issued without sharing private keys</li>
      </ul>
      
      <h3>Session Management</h3>
      <ul>
        <li>Sessions expire automatically after inactivity</li>
        <li>Use Settings > Security to revoke old sessions</li>
        <li>Re-authenticate after changing critical settings</li>
      </ul>
      
      <h3>Troubleshooting</h3>
      <ul>
        <li>Ensure Pi Browser is up to date</li>
        <li>Clear Pi Browser cache if prompts do not appear</li>
        <li>Disable VPNs that block Pi Network endpoints</li>
      </ul>
    `,
    category: "Pi Network Integration",
    readTime: "4 min",
    publishedAt: "2024-02-09",
    tags: ["authentication", "pi-browser", "security"],
    featured: false
  },
  {
    id: "analytics-guide",
    title: "Understanding Analytics Dashboard",
    excerpt: "Make data-driven decisions by learning how to use our comprehensive analytics tools.",
    content: `
      <h2>Analytics Overview</h2>
      <p>Droplink's analytics dashboard provides deep insights into your profile performance, helping you understand your audience and optimize your content strategy.</p>
      
      <h3>Key Metrics Explained</h3>
      <ul>
        <li><strong>Profile Views:</strong> Total visitors to your Droplink page</li>
        <li><strong>Link Clicks:</strong> Individual clicks on each link</li>
        <li><strong>Click-Through Rate (CTR):</strong> Percentage of visitors who click links</li>
        <li><strong>Top Performing Links:</strong> Your most popular content</li>
        <li><strong>Traffic Sources:</strong> Where your visitors come from</li>
        <li><strong>Geographic Data:</strong> Visitor locations (Pro/Premium)</li>
        <li><strong>Device Breakdown:</strong> Mobile vs. desktop usage</li>
      </ul>
      
      <h3>Advanced Analytics (Pro/Premium)</h3>
      <ul>
        <li>Hourly and daily traffic patterns</li>
        <li>Conversion tracking for sales</li>
        <li>A/B testing for link performance</li>
        <li>Audience demographics</li>
        <li>Retention and return visitor data</li>
      </ul>
      
      <h3>Using Data for Growth</h3>
      <p>Optimize your strategy by:</p>
      <ul>
        <li><strong>Timing:</strong> Post when your audience is most active</li>
        <li><strong>Content:</strong> Focus on link types that perform best</li>
        <li><strong>Geography:</strong> Tailor content for your main regions</li>
        <li><strong>Devices:</strong> Optimize for your audience's preferred devices</li>
      </ul>
      
      <h3>Analytics Reports</h3>
      <p>Generate reports for:</p>
      <ul>
        <li>Weekly performance summaries</li>
        <li>Monthly growth tracking</li>
        <li>Campaign-specific analytics</li>
        <li>Custom date range analysis</li>
      </ul>
      
      <h3>Exporting Data</h3>
      <p>Premium users can export:</p>
      <ul>
        <li>CSV files for spreadsheet analysis</li>
        <li>PDF reports for presentations</li>
        <li>API access for custom integrations</li>
      </ul>
      
      <h3>Privacy and GDPR</h3>
      <p>Our analytics respect user privacy:</p>
      <ul>
        <li>No personal data collection</li>
        <li>GDPR compliant tracking</li>
        <li>Opt-out options for visitors</li>
        <li>Anonymized data processing</li>
      </ul>
    `,
    category: "Analytics & Insights",
    readTime: "8 min",
    publishedAt: "2024-02-01",
    tags: ["analytics", "data", "insights", "optimization"],
    featured: true
  },
  {
    id: "traffic-sources",
    title: "Tracking Traffic Sources",
    excerpt: "See where your visitors come from and double down on high-converting channels.",
    content: `
      <h2>Source Breakdown</h2>
      <p>Understand which channels drive visitors so you can invest time and budget wisely.</p>
      
      <h3>What We Track</h3>
      <ul>
        <li>Referrers (social, search, direct, campaigns)</li>
        <li>UTM parameters on your shared links</li>
        <li>Device and location summaries for Pro/Premium</li>
      </ul>
      
      <h3>How to Use It</h3>
      <ul>
        <li>Tag social posts with utm_source and utm_campaign</li>
        <li>Compare CTR by channel in the Analytics tab</li>
        <li>Share wins with collaborators via weekly reports</li>
      </ul>
      
      <h3>Improvement Tips</h3>
      <ul>
        <li>Reuse top-performing captions across platforms</li>
        <li>Test thumbnails per channel to improve clicks</li>
        <li>Pause channels that deliver low-engagement traffic</li>
      </ul>
    `,
    category: "Analytics & Insights",
    readTime: "4 min",
    publishedAt: "2024-02-02",
    tags: ["analytics", "traffic", "utm"],
    featured: false
  },
  {
    id: "link-performance",
    title: "Improving Link Performance",
    excerpt: "Use A/B testing, heatmaps, and timing to boost click-through rates.",
    content: `
      <h2>Performance Toolkit</h2>
      <p>Fine-tune your links with data-backed experiments.</p>
      
      <h3>A/B Testing</h3>
      <ul>
        <li>Test titles, thumbnails, and button styles</li>
        <li>Run tests for at least 48 hours to gather data</li>
        <li>Pick winners and archive variants to stay organized</li>
      </ul>
      
      <h3>Timing</h3>
      <ul>
        <li>Schedule posts for peak hours shown in Analytics</li>
        <li>Rotate seasonal promos to the top during campaigns</li>
        <li>Use countdown badges to create urgency</li>
      </ul>
      
      <h3>Content Fit</h3>
      <ul>
        <li>Pair links with short context lines</li>
        <li>Group by themes (courses, merch, bookings) for clarity</li>
        <li>Keep total link count lean to avoid choice overload</li>
      </ul>
    `,
    category: "Analytics & Insights",
    readTime: "4 min",
    publishedAt: "2024-02-03",
    tags: ["optimization", "ab-test", "ctr"],
    featured: false
  },
  {
    id: "audience-demographics",
    title: "Audience Demographics",
    excerpt: "See where your audience is located and which devices they use.",
    content: `
      <h2>Know Your Audience</h2>
      <p>Demographic insights help you localize offers and schedule posts when your audience is awake.</p>
      
      <h3>Data Available</h3>
      <ul>
        <li>Top countries and cities (Pro/Premium)</li>
        <li>Device breakdown (mobile, tablet, desktop)</li>
        <li>Language hints from browser settings</li>
      </ul>
      
      <h3>How to Act on It</h3>
      <ul>
        <li>Translate key links for your top markets</li>
        <li>Schedule announcements in local prime time</li>
        <li>Design for mobile first if 80%+ of traffic is mobile</li>
      </ul>
    `,
    category: "Analytics & Insights",
    readTime: "3 min",
    publishedAt: "2024-02-04",
    tags: ["audience", "devices", "geography"],
    featured: false
  },
  {
    id: "export-analytics",
    title: "Exporting Analytics Data",
    excerpt: "Download CSVs, PDFs, or pull data via API on Premium.",
    content: `
      <h2>Export Options</h2>
      <p>Keep stakeholders informed with clean exports.</p>
      
      <h3>Formats</h3>
      <ul>
        <li>CSV for spreadsheets</li>
        <li>PDF for reports and presentations</li>
        <li>API access for custom dashboards (Premium)</li>
      </ul>
      
      <h3>How to Export</h3>
      <ol>
        <li>Go to Analytics > Reports</li>
        <li>Select date range and metrics</li>
        <li>Choose format and click Export</li>
        <li>Schedule weekly emails to your team</li>
      </ol>
      
      <h3>Data Handling</h3>
      <ul>
        <li>Exports exclude personal visitor data</li>
        <li>All files are time-stamped for audits</li>
        <li>API keys can be rotated in Settings > Security</li>
      </ul>
    `,
    category: "Analytics & Insights",
    readTime: "3 min",
    publishedAt: "2024-02-05",
    tags: ["exports", "reports", "api"],
    featured: false
  },
  {
    id: "subscription-plans",
    title: "Understanding Subscription Plans",
    excerpt: "Compare Droplink's subscription tiers and choose the best plan for your needs.",
    content: `
      <h2>Droplink Subscription Plans</h2>
      <p>Choose the perfect plan to match your goals and unlock powerful features for your online presence.</p>
      
      <h3>Free Plan</h3>
      <p>Perfect for getting started:</p>
      <ul>
        <li>Unlimited links</li>
        <li>Basic analytics</li>
        <li>1 theme</li>
        <li>Pi tips (5% platform fee)</li>
        <li>Mobile optimized</li>
      </ul>
      
      <h3>Basic Plan - 10π/month</h3>
      <p>Great for creators:</p>
      <ul>
        <li>Everything in Free</li>
        <li>10 premium themes</li>
        <li>Link scheduling</li>
        <li>Custom colors</li>
        <li>Priority support</li>
      </ul>
      
      <h3>Pro Plan - 20π/month</h3>
      <p>Best for businesses:</p>
      <ul>
        <li>Everything in Basic</li>
        <li>50+ premium themes</li>
        <li>Advanced analytics</li>
        <li>Digital product sales</li>
        <li>Custom domain support</li>
        <li>A/B testing</li>
        <li>Remove Droplink branding</li>
      </ul>
      
      <h3>Premium Plan - 30π/month</h3>
      <p>For power users:</p>
      <ul>
        <li>Everything in Pro</li>
        <li>All themes + custom CSS</li>
        <li>Team collaboration (up to 3 users)</li>
        <li>White-label options</li>
        <li>API access</li>
        <li>Premium support</li>
        <li>Data export capabilities</li>
      </ul>
      
      <h3>Payment and Billing</h3>
      <ul>
        <li>All payments in Pi cryptocurrency</li>
        <li>Monthly or annual billing</li>
        <li>Automatic renewals</li>
        <li>Cancel anytime</li>
        <li>Prorated upgrades/downgrades</li>
      </ul>
      
      <h3>Switching Plans</h3>
      <p>Easily upgrade or downgrade:</p>
      <ul>
        <li>Instant plan changes</li>
        <li>Prorated billing adjustments</li>
        <li>Feature access updates immediately</li>
        <li>No long-term contracts</li>
      </ul>
    `,
    category: "Billing & Subscription",
    readTime: "5 min",
    publishedAt: "2024-02-10",
    tags: ["subscription", "plans", "pricing", "billing"],
    featured: false
  },
  {
    id: "payment-methods",
    title: "Payment Methods and Billing",
    excerpt: "Learn how billing cycles, invoices, and Pi-only payments work.",
    content: `
      <h2>Billing Basics</h2>
      <p>Droplink processes all charges in Pi. Keep your wallet funded before renewals.</p>
      
      <h3>How Billing Works</h3>
      <ul>
        <li>Monthly and annual cycles are available</li>
        <li>Invoices are emailed and stored in Settings > Billing</li>
        <li>Failed renewals retry automatically for 3 days</li>
      </ul>
      
      <h3>Updating Payment Method</h3>
      <ol>
        <li>Open Settings > Billing</li>
        <li>Choose "Update Payment"</li>
        <li>Confirm in Pi Browser to refresh authorization</li>
      </ol>
      
      <h3>Receipts and Records</h3>
      <ul>
        <li>Download receipts anytime from Billing history</li>
        <li>Use company tax details for proper invoices</li>
        <li>Export CSV of invoices for accounting</li>
      </ul>
    `,
    category: "Billing & Subscription",
    readTime: "4 min",
    publishedAt: "2024-02-11",
    tags: ["billing", "payments", "invoices"],
    featured: false
  },
  {
    id: "upgrade-downgrade",
    title: "Upgrading or Downgrading",
    excerpt: "Change plans without downtime or losing data.",
    content: `
      <h2>Plan Changes</h2>
      <p>You can switch plans anytime. Changes take effect immediately.</p>
      
      <h3>Upgrade Steps</h3>
      <ol>
        <li>Go to Settings > Billing</li>
        <li>Select the plan you want</li>
        <li>Confirm the new rate in Pi Browser</li>
      </ol>
      
      <h3>Downgrade Notes</h3>
      <ul>
        <li>Premium-only features lock after downgrade</li>
        <li>We keep your data for 30 days in case you upgrade again</li>
        <li>Prorated credits apply automatically</li>
      </ul>
      
      <h3>What Stays Safe</h3>
      <ul>
        <li>Your links and analytics remain intact</li>
        <li>Custom domains stay mapped if supported by the new plan</li>
        <li>Team seats adjust to the new quota; extra seats become view-only</li>
      </ul>
    `,
    category: "Billing & Subscription",
    readTime: "3 min",
    publishedAt: "2024-02-12",
    tags: ["plans", "billing", "upgrade"],
    featured: false
  },
  {
    id: "cancellation-refunds",
    title: "Cancellation and Refunds",
    excerpt: "How to cancel, what happens next, and when refunds apply.",
    content: `
      <h2>Cancel Anytime</h2>
      <p>You can cancel from Billing with two clicks. We keep your profile live until the period ends.</p>
      
      <h3>Steps to Cancel</h3>
      <ol>
        <li>Open Settings > Billing</li>
        <li>Click "Cancel subscription"</li>
        <li>Confirm in Pi Browser</li>
      </ol>
      
      <h3>Refund Policy</h3>
      <ul>
        <li>Monthly plans: no partial refunds, access continues to term end</li>
        <li>Annual plans: pro-rated refunds within 14 days of renewal</li>
        <li>Platform credits stay available for future use</li>
      </ul>
      
      <h3>After Cancellation</h3>
      <ul>
        <li>Premium features pause at term end</li>
        <li>Your data remains accessible on the Free plan</li>
        <li>Re-subscribe anytime without setup loss</li>
      </ul>
    `,
    category: "Billing & Subscription",
    readTime: "3 min",
    publishedAt: "2024-02-13",
    tags: ["cancellation", "refunds", "billing"],
    featured: false
  },
  {
    id: "pi-payment-issues",
    title: "Resolving Pi Payment Issues",
    excerpt: "Troubleshoot failed tips, pending payments, and wallet errors.",
    content: `
      <h2>Common Issues</h2>
      <p>If a payment fails or stalls, check these areas first.</p>
      
      <h3>Quick Checks</h3>
      <ul>
        <li>Confirm Pi Browser is updated</li>
        <li>Verify you have sufficient Pi balance</li>
        <li>Retry after switching to a stable network</li>
      </ul>
      
      <h3>Platform Messages</h3>
      <ul>
        <li>"Pending" means awaiting Pi Network confirmation</li>
        <li>"Declined" indicates wallet authorization failed</li>
        <li>"Expired" happens if the payment window closes</li>
      </ul>
      
      <h3>When to Contact Support</h3>
      <ul>
        <li>Transactions pending over 30 minutes</li>
        <li>Repeated failures after reconnecting your wallet</li>
        <li>Discrepancies between Droplink and Pi Network history</li>
      </ul>
    `,
    category: "Billing & Subscription",
    readTime: "3 min",
    publishedAt: "2024-02-14",
    tags: ["payments", "troubleshooting", "pi"],
    featured: false
  }
];

export const getArticlesByCategory = (category: string) => {
  return helpArticles.filter(article => 
    article.category.toLowerCase().replace(/\s+/g, '-') === category.toLowerCase()
  );
};

export const getFeaturedArticles = () => {
  return helpArticles.filter(article => article.featured);
};

export const searchArticles = (query: string) => {
  if (!query.trim()) return helpArticles;
  
  const lowercaseQuery = query.toLowerCase();
  return helpArticles.filter(article =>
    article.title.toLowerCase().includes(lowercaseQuery) ||
    article.excerpt.toLowerCase().includes(lowercaseQuery) ||
    article.content.toLowerCase().includes(lowercaseQuery) ||
    article.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
    article.category.toLowerCase().includes(lowercaseQuery)
  );
};
