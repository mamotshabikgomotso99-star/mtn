# MASTER PROMPT: MTN SOUTH AFRICA – PREMIUM TELECOMMUNICATIONS WEBSITE

## 1. PROJECT OBJECTIVE
Act as a senior full-stack frontend developer, UI/UX designer, motion designer and creative director.

Build a highly realistic, professional and visually impressive MTN South Africa website inspired by the official MTN brand and its actual digital shopping experience.

The website must look like a real telecommunications company's production website, not a student project, template or generic landing page.

**Brand:** MTN South Africa
**Industry:** Telecommunications and Technology
**Year:** 2026
**Primary colours:** MTN Yellow (#FFCC00), black, white and subtle grey.
**Design direction:** Premium, modern, energetic, futuristic and minimal.

Use realistic product imagery, professional typography, sophisticated animations, smooth transitions and genuine-looking telecommunications content.

Do not create a dark-themed website throughout. Use a combination of white backgrounds, MTN yellow sections, black typography and premium product cards.

## 2. HERO SECTION – CINEMATIC VIDEO EXPERIENCE
The hero section must be the strongest visual element of the website.

I want an actual moving video, not a static photograph pretending to be a video.

Video concept:

- Cinematic footage of a modern South African city at night.
- Aerial drone shots of Johannesburg and Pretoria.
- People using smartphones, video calling and streaming.
- Modern telecommunications infrastructure and 5G connectivity.
- Digital network animations and futuristic technology visuals.
- Yellow lighting accents inspired by MTN's brand.
- Smooth cinematic transitions between scenes.
The video must:

- Play automatically when the page loads.
- Be muted by default.
- Loop continuously.
- Use object-fit: cover.
- Have a dark transparent overlay so text remains readable.
- Be responsive on desktop, tablet and mobile.
- Use a high-quality poster image while loading.
- Have a graceful fallback if the video fails to load.

### Video controls
Include a visible, professionally designed play/pause button on the hero.

Requirements:

- Display a pause icon while the video is playing.
- Display a play icon when the video is paused.
- Clicking the button must genuinely pause or resume the video.
- Include an accessible button label.
- Add a subtle hover animation.
- Keep the control visible and easy to access.
Implement this using the HTML5 video element and React state. Do not simulate the functionality with decorative icons.

### Hero text
Headline:

"EVERYTHING YOU NEED. CONNECTED."

Supporting text:

"Discover more with MTN. Experience incredible devices, unbeatable connectivity, flexible data plans and exclusive offers designed to keep you connected."

Buttons:

- Explore Deals
- Discover MTN 5G
The Explore Deals button must scroll to the promotions section.

The Discover MTN 5G button must navigate to the connectivity section.

## 3. NAVIGATION BAR
Create a premium sticky navigation bar.

MTN logo on the left.

Navigation links:

- Home
- Devices
- Deals
- Contracts
- Prepaid
- Data
- Fibre
- 5G
- Business
- Support
Right-hand controls:

- Search icon
- Shopping bag icon
- Login / MyMTN button
Requirements:

- Dropdown menus on relevant navigation items.
- Smooth hover animations.
- Mobile hamburger menu.
- Functional search interface.
- Responsive navigation.
- Yellow call-to-action accents.
- Sticky navigation with a subtle shadow when scrolling.

## 4. 2026 MTN DEALS AND PROMOTIONS
IMPORTANT: This is one of the most important parts of the project.

Create a comprehensive MTN 2026 Deals section.

Use the official MTN South Africa promotions catalogue as the source of truth:

[https://www.mtn.co.za/shop/deals/promotions](https://www.mtn.co.za/shop/deals/promotions)

Also inspect:

- [https://www.mtn.co.za/shop/deals/devices/contract/phones](https://www.mtn.co.za/shop/deals/devices/contract/phones)
- [https://www.mtn.co.za/shop/deals/plans](https://www.mtn.co.za/shop/deals/plans)
- [https://www.mtn.co.za/shop/deals/contracts](https://www.mtn.co.za/shop/deals/contracts)
Do not invent promotional prices, product specifications, discounts, freebies or contract terms.

Collect and display every available deal from the official catalogue, including new deals added during 2026.

### A. Smartphone deals
Include all available devices from brands such as:

- Samsung
- Apple
- Huawei
- Honor
- OPPO
- vivo
- Other brands available in the official catalogue.
Each product card must contain:

- Actual product image.
- Manufacturer and model.
- Storage capacity.
- Original price where available.
- Promotional monthly price.
- Contract duration.
- Discount or savings.
- Freebies and promotional benefits.
- Online-only or upgrade-only labels where applicable.
- View Deal button.
Include filters:

- All devices
- Samsung
- Apple
- Huawei
- Honor
- OPPO
- vivo
- Lowest monthly price
- Highest monthly price
- New devices
- Upgrade deals
- Special promotions.

### B. 2026 promotional examples
Use the following November 2026 official promotions as initial reference data, subject to verification when implementing:

DeviceAdvertised monthly priceHonor X5d sFrom R189Huawei nova Y63From R199Honor X6eFrom R229Huawei nova Y74sFrom R229Samsung Galaxy A26 5GFrom R259Samsung Galaxy A36 5GR289Huawei nova Y74From R299Samsung Galaxy A37 5GFrom R409Samsung Galaxy A57 5GR449Apple iPhone 16eR429vivo V80 Lite 5GFrom R499These are advertised starting prices, not necessarily universal prices for every contract configuration.

Also display all additional qualifying devices discovered in the official catalogue.

### C. Yellow Plans
Create a dedicated Yellow Plans section.

Display the available plans with:

- Anytime data.
- Bonus data.
- All-network minutes.
- Monthly subscription.
- Contract duration.
- Eligibility requirements.
- Promotional benefits.
Include the Core, Plus, Prime and Deluxe plans, as well as other currently available plans.

### D. Mega Flex
Create a separate Mega Flex promotional category.

Display:

- Mega Flex 160.
- Mega Flex 260.
- Mega Flex 400.
- Any additional available options.
Show monthly pricing, applicable contract duration and startup bundle benefits.

### E. Mobile Internet deals
Create a dedicated mobile internet section.

Include available packages such as:

- Gold.
- Platinum.
- Ruby.
- Emerald.
Display:

- Total advertised data.
- Anytime data.
- Bonus data.
- Streaming data.
- Shareable data.
- Startup bundle.
- Monthly price.
- Contract duration.
- Number of members who can share the data, where applicable.

### F. Additional promotional categories
Include every other available category found on MTN's official promotions pages, such as:

- Tablets.
- Routers.
- MiFi devices.
- SIM-only deals.
- Data-only contracts.
- Special upgrade promotions.
- Buy-one-get-one promotions.
- Device bundles.
- Seasonal promotions.
Do not omit deals simply because they are not listed in the examples above.

### Deals functionality
Every product must have:

- A View Deal button.
- A detailed product information modal or page.
- An Add to Compare feature.
- A Wishlist feature.
- A clear monthly payment display.
- A link to the relevant official MTN product or deal page.
Use real product images and accurate product names.

If a promotion expires, remove it from active promotions or mark it as expired.

Never present historical prices as current deals.

## 5. SPECIAL OFFERS SECTION
Create a visually impressive promotional banner.

Headline:

"MORE REASONS TO STAY CONNECTED."

Include promotional cards for:

- Black November offers, where currently active.
- Limited-time smartphone promotions.
- Free accessories.
- Data bonuses.
- Upgrade specials.
- Online-exclusive offers.
Use MTN yellow backgrounds, large product images and bold typography.

Add a countdown timer only when a genuine promotion has a verified end date.

## 6. MTN 5G EXPERIENCE
Create a premium section introducing MTN 5G.

Headline:

"THE FUTURE IS ALREADY HERE."

Use an animated visual showing:

- 5G network connections.
- Smartphones.
- Connected devices.
- Digital networks.
- High-speed connectivity.
Include:

- 5G benefits.
- Coverage information.
- Compatible devices.
- Links to MTN coverage information.
- Explore 5G button.
Do not invent coverage statistics or guarantee availability in locations that have not been verified.

## 7. FIBRE AND HOME INTERNET
Create a modern home-connectivity section.

Show:

- Fibre packages.
- Home internet solutions.
- Routers.
- Available connectivity packages.
- Installation information where verified.
Use realistic imagery of modern homes and connected devices.

Add a Check Availability feature that allows customers to enter their suburb or address and directs them to the appropriate official availability service.

## 8. MTN BUSINESS
Build a professional business solutions section.

Include:

- Business connectivity.
- Enterprise solutions.
- Business mobile plans.
- Cloud solutions.
- IoT.
- Business internet.
- Digital transformation.
Use professional office photography and modern technology visuals.

Include a Contact Sales button.

## 9. CUSTOMER ACCOUNT AND SUPPORT
Create a MyMTN section with a realistic login interface.

Include:

- Login.
- Register.
- Forgot password.
- Account dashboard mockup.
- View subscriptions.
- Manage data.
- View usage.
- Manage devices.
- Customer support.
For this frontend demonstration, use clearly labelled demo interactions. Do not collect real customer passwords or personal information without a properly secured backend.

## 10. INTERACTIVE FEATURES
The website must have genuine functionality.

Implement:

- Working navigation.
- Search.
- Product filters.
- Sorting.
- Product comparison.
- Wishlist.
- Shopping cart interface.
- Product detail modals.
- Responsive mobile menu.
- Hero video play/pause.
- Smooth scrolling.
- Interactive promotional banners.
- Working CTA buttons.
- Login interface.
- Newsletter subscription interface.
Do not leave decorative buttons that do nothing.

## 11. DESIGN AND ANIMATIONS
The website should feel like a professionally developed MTN corporate website.

Use:

- Framer Motion for animations.
- Tailwind CSS for styling.
- Lucide React for icons.
- Smooth page transitions.
- Subtle scroll animations.
- Hover effects on product cards.
- Premium loading animations.
- Carefully designed shadows.
- Rounded but sophisticated cards.
- Large, high-quality product imagery.
Avoid excessive animation, unnecessary gradients and childish design.

The MTN yellow should remain the dominant brand accent.

## 12. TECHNOLOGY STACK
Use the existing project structure where possible.

Preferred technologies:

- Next.js or React.
- TypeScript.
- Tailwind CSS.
- Framer Motion.
- Lucide React.
- HTML5 video.
- Reusable components.
Structure the application into reusable sections:

- Navbar
- HeroSection
- DealsSection
- DeviceCatalogue
- YellowPlans
- MegaFlex
- MobileInternet
- SpecialOffers
- FiveGSection
- FibreSection
- BusinessSection
- SupportSection
- Footer
Keep the code clean, maintainable and component-based.

## 13. DATA ACCURACY AND DEAL MANAGEMENT
The 2026 deals must be sourced from MTN's official website.

Important development rules:

1. Inspect the complete official deals catalogue.
2. Include all available products and promotional categories.
3. Keep promotional prices and contract durations accurate.
4. Include promotion eligibility and restrictions.
5. Display the date when deal information was last verified.
6. Separate new-customer, upgrade-only and online-only offers.
7. Do not fabricate unavailable product details.
8. Do not hardcode a limited selection and claim it represents every MTN deal.
9. Design the catalogue so new offers can be added without redesigning the website.
If a live API is unavailable, create a structured local dataset based on verified official information and provide a straightforward way to update it.

Do not scrape MTN pages from the browser on every customer visit or bypass website restrictions.

## 14. FOOTER
Create a comprehensive footer with:

MTN South Africa branding.

Useful links:

- About MTN.
- Shop Devices.
- Latest Deals.
- Contracts.
- Prepaid.
- Data Bundles.
- MTN 5G.
- Fibre.
- Business.
- Help and Support.
- Contact Us.
- Privacy Policy.
- Terms and Conditions.
Include social media icons and official MTN contact links.

## 15. FINAL QUALITY REQUIREMENTS
The finished website must:

- Look like a real MTN South Africa website.
- Have a cinematic, genuinely moving hero video.
- Have a functional video play/pause button.
- Display the complete verified 2026 deals catalogue.
- Use actual MTN products and promotional information.
- Have realistic smartphone product imagery.
- Be fully responsive.
- Have working interactive elements.
- Load efficiently.
- Have no broken images or dead links.
- Use professional spacing and typography.
- Maintain consistent MTN branding.

### FINAL INSTRUCTION
Before writing code, inspect the existing repository and understand its current structure.

Do not unnecessarily delete existing files or replace working functionality.

Develop the website section by section, test all interactive elements and ensure that the final result is polished.

I want a website that looks as if MTN South Africa commissioned a professional digital agency to build it.

**The hero video must actually move. The play/pause functionality must genuinely work. The 2026 deals must be comprehensive and accurate. The final result must look production-quality, not like a basic frontend exercise.**
