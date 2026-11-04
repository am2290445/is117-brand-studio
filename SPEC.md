# Elsewhere Brand Studio Specification

This document records the agreed brand decisions, project requirements, implementation evidence, and remaining work for Elsewhere.

`LEARNING.md` contains the learner's explanations, observations, and record of AI assistance. This file focuses on the brand agreement and project evidence.

---

## 1. Current Project Stage

- **Brand:** Elsewhere
- **Current feature:** BRAND-003 — paired Modernist and Postmodernist hero explorations
- **BRAND-001 status:** Implementation merged into `main`
- **Current status:** Brand direction supplied; remaining assignment evidence is in progress.
- **Next goal:** Complete and compare the paired hero designs on the Welcome page, then review the website and supporting documentation.

---

## 2. Project Overview

**Brand name:** Elsewhere

**Product:** Everyday white T-shirt

**Product price:** $15

**Slogan:** Less ordinary. More you.

**Brand description:**

Elsewhere is an everyday fashion brand built around the idea that simplicity can make a statement. It shows how simple clothing can be styled into something chic, allowing people to express their individuality without needing complicated or excessive designs.

The brand encourages people to see the potential in everyday pieces and make them their own.

**Brand promise:**

Express your individuality through everyday clothing while thinking more carefully about your choices.

The website should communicate that a white T-shirt is more than a basic clothing item. It is a wardrobe staple that can be styled in different ways to reflect someone's personality.

---

## 3. Product Boundaries

The product remains the same white T-shirt throughout the design comparison.

The existing storefront includes:

- A white T-shirt product presentation.
- A $15 illustrative price.
- A size selector.
- An Add to Bag function.
- A temporary demo shopping bag.
- Optional styling prompts.

The demo bag does not process real orders or payments.

The project does not include:

- Real checkout or payment processing.
- Customer accounts.
- Persistent shopping-bag storage.
- Verified customer reviews or sales.
- Claims about materials, manufacturing, sustainability, fit, delivery, or scarcity.

Product information must remain consistent across both visual directions.

---

## 4. Brand Identity

### Primary Archetype: Sage

Sage represents thoughtful, intentional design.

It supports the idea that people should look beyond first impressions and recognize the value of simple clothing.

### Supporting Archetype: Creator

Creator represents individuality, creativity, and self-expression.

It supports the idea that people can take an everyday clothing item and style it in their own way.

### Combined Archetype Direction

Sage and Creator work together to communicate that simplicity does not mean a lack of personality.

The brand should feel thoughtful and polished while still allowing room for creative expression.

### Brand Voice

The three agreed voice traits are:

- **Creative:** Encourages people to explore different ways to style everyday clothing.
- **Playful:** Makes fashion feel approachable and enjoyable.
- **Rebellious:** Challenges the idea that clothing needs complicated designs or patterns to stand out.

---

## 5. Target Audiences

These audience descriptions are hypotheses based on the learner's ideas. They have not been validated through customer interviews, surveys, or formal audience research.

### Primary Audience

**Young creatives who use fashion to show their personality.**

**Concern:**

The white T-shirt may seem too basic or ordinary. People might overlook it because it does not have patterns, graphics, or complicated designs.

**What the website should communicate:**

A white T-shirt is a wardrobe staple that can be styled in different ways to create a personal, chic look.

**Design response:**

The website should use creative visual presentation and styling inspiration to demonstrate how an everyday white T-shirt can become part of an individual's personal style.

### Secondary Audience

**People who value simplicity in clothing.**

**Concern:**

Fashion brands might make simple clothing more complicated than it needs to be.

**What the website should communicate:**

There is value in simplicity. Simple clothing can offer much more than people initially expect, especially through versatility and personal style.

**Design response:**

The website should keep the white T-shirt as the central product while showing how it can be styled in different ways without changing the simplicity of the garment.

### Shared Predicted Audience Effect

Visitors should feel relaxed and understand that their fashion choices can go beyond patterns, trends, and expectations.

They should recognize that they can appreciate simple clothing while still expressing themselves through personal styling.

---

## 6. Visual Brand System

### Chosen Visual Direction

**Postmodernism**

The selected direction is Postmodernism because the brand should feel creative, playful, expressive, and slightly rebellious.

The visual design should combine artistic elements with a polished presentation.

The Sage archetype should remain visible through organization, clarity, and a thoughtful layout. The Creator archetype should appear through expressive shapes, visual contrast, and creative composition.

### Color Palette

The agreed palette is green-led, with plum, lavender, and warm neutral colors.

| Color          | Hex Value | Purpose                            |
| -------------- | --------- | ---------------------------------- |
| Warm Off-White | #F6F3EF   | Main background                    |
| Ink            | #252027   | Main text and contrast             |
| Muted Gray     | #625D63   | Secondary text                     |
| Sage Green     | #A9B9A0   | Soft, calming brand color          |
| Forest Green   | #334433   | Strong contrast and brand emphasis |
| Plum           | #684568   | Creative supporting color          |
| Lavender       | #D8C7DB   | Soft decorative accent             |
| Soft Neutral   | #E5DED5   | Borders and supporting surfaces    |

**Learner's visual rationale:**

The Sage green gives the site a calm, stylish look, while the darker Forest green adds contrast and makes the design feel more polished.

The colors also help communicate that a simple white shirt can be presented creatively without actually adding color to the shirt.

### Typography

The website uses a readable system sans-serif font family, with a monospace font for selected supporting details.

Typography should remain readable and consistent across all pages.

### Logo

**Logo file:** `public/assets/wordmark.svg`

The Elsewhere wordmark uses Forest green.

The learner reviewed the logo and reported that it looks okay.

Formal audience testing of the logo has not been completed.

---

## 7. BRAND-003: Modernist and Postmodernist Hero Comparison

The purpose of this feature is to create two visual interpretations of the same brand message.

Both design options should appear on the **Welcome page (`public/index.html`)**.

Visitors should be able to select either Modernist or Postmodernist and view the selected design directly on the Welcome page. The designs should not require visitors to navigate to a separate page.

### Shared Hero Content

Both design directions must use the same content.

**Headline:**

Less ordinary. More you.

**Supporting copy:**

A white T-shirt is more than a basic. It is a wardrobe staple you can style your way.

**Button:**

Explore the T-shirt

**Image requirement:**

Use the same model image in both previews so the comparison focuses on the design direction rather than different photography.

**Color requirement:**

Both previews should use the Elsewhere palette:

- Forest green
- Sage green
- Plum
- Lavender
- Warm off-white

### Modernist Direction

The Modernist preview should explore:

- Clear visual hierarchy.
- Structured alignment.
- Simpler shapes.
- Balanced spacing.
- Minimal decoration.
- Strong readability.

**Connection to Sage:**

The organized layout and clear presentation support the Sage archetype's thoughtful and intentional qualities.

### Postmodernist Direction

The Postmodernist preview should explore:

- More expressive composition.
- Creative shapes and decorative elements.
- Visual contrast.
- Playful positioning.
- Layered design elements.
- Artistic use of the brand palette.

**Connection to Creator:**

The expressive layout and artistic details support the Creator archetype's focus on individuality and self-expression.

### Comparison Requirements

| Requirement     | Modernist Preview      | Postmodernist Preview   |
| --------------- | ---------------------- | ----------------------- |
| Product         | Same white T-shirt     | Same white T-shirt      |
| Headline        | Same wording           | Same wording            |
| Supporting copy | Same wording           | Same wording            |
| Button          | Explore the T-shirt    | Explore the T-shirt     |
| Model image     | Same image             | Same image              |
| Color palette   | Elsewhere palette      | Elsewhere palette       |
| Visual approach | Structured and minimal | Expressive and artistic |

### Welcome Page Interaction

The Welcome page should provide two design choices:

1. Modernist
2. Postmodernist

Selecting Modernist should display the Modernist interpretation.

Selecting Postmodernist should display the Postmodernist interpretation.

The selected design should appear directly on the Welcome page rather than opening another page.

The existing brand navigation and links to the Shop page should remain available.

### Status

The shared hero wording, image approach, and design directions have been agreed upon.

The Welcome page implementation, final browser comparison, and learner's written evaluation still need to be completed and reviewed.

---

## 8. Website Structure

The project includes four main pages.

### Welcome Page

**File:** `public/index.html`

Purpose:

- Introduce the Elsewhere brand.
- Display the slogan.
- Communicate the brand's message.
- Provide the Modernist and Postmodernist design choices.
- Display the selected hero design directly on the page.
- Encourage visitors to explore the T-shirt.

The Welcome page should communicate that everyday clothing can still support personal expression.

### Shop Page

**File:** `public/shop.html`

Purpose:

- Present the white T-shirt.
- Display the illustrative $15 price.
- Allow visitors to select a size.
- Allow visitors to add the T-shirt to a temporary demo shopping bag.
- Provide styling inspiration.

The Shop page should help visitors understand the product while showing how a simple white T-shirt can be styled in different ways.

### Our Story Page

**File:** `public/studio.html`

Purpose:

- Explain the Elsewhere brand.
- Communicate the brand promise.
- Present the brand's values.
- Help visitors understand the meaning behind the brand.

The page should reinforce the idea that simplicity and individuality can work together.

### Style Guide Page

**File:** `public/styleguide.html`

Purpose:

- Document the brand archetypes.
- Explain the visual direction.
- Display the color palette.
- Explain typography, spacing, and buttons.
- Document the brand voice.

The Style Guide should reflect the same identity used throughout the website.

---

## 9. Ethical Persuasion

The project should use two ethical persuasion applications that provide visitors with useful information or inspiration.

Persuasion should support voluntary decisions. The website must not use invented reviews, scarcity, popularity, or unsupported product claims.

### First Application: Reciprocity

**Application:** Optional styling prompts on the Shop page.

The styling prompts give visitors ideas for making the white T-shirt their own without requiring another purchase or signup.

Examples:

- Try a tuck.
- Add a layer.
- Bring your own color.

**Visitor benefit:**

The prompts provide styling inspiration and help visitors see different possibilities for personal expression.

**Implementation note:**

The prompt wording was drafted with AI assistance and should be reviewed before final submission.

### Second Application

**Status:** Not chosen yet.

A second principle should not be recorded as implemented until an actual feature and its visitor benefit have been agreed upon.

---

## 10. Technical Requirements

The project uses:

- HTML
- CSS
- JavaScript
- Node.js
- Automated server tests
- Chromium browser tests

### Shop Functionality

Visitors should be able to:

1. Select a T-shirt size.
2. Add the selected T-shirt to the demo bag.
3. See the bag update.
4. Remove an item from the bag.
5. Clear the demo bag.

The bag is temporary and does not save information permanently.

### Responsive Design

The website should remain usable at desktop and mobile sizes.

The layout should avoid:

- Horizontal overflow.
- Overlapping content.
- Unreadable text.
- Buttons or controls that are difficult to use.

### Keyboard Accessibility

The website should support keyboard navigation.

Focus indicators should be visible, and interactive controls should be reachable and usable with the keyboard.

The Modernist and Postmodernist design choices should also be accessible through keyboard interaction.

---

## 11. Testing and Evidence

The learner reported that `npm run check` passed:

- Formatting and lint checks.
- 7 server tests.
- 17 Chromium browser tests.

The learner also reported:

**Keyboard observations:**

- Focus outlines were visible.
- Tab moved between elements.
- Size options were reachable.
- Arrow keys changed the selected size.
- Enter activated Add to Bag.
- Bag controls were reachable.

Individual activation of Remove and Clear Bag was not separately confirmed.

**Mobile observations:**

The learner viewed the Shop page using the iPhone SE device view in Chrome Developer Tools.

The learner reported that the fundamental Shop features worked and that no sideways scrolling, overlapping, unusually small text, or difficult-to-use elements were noticed.

**First impression:**

The learner noticed the Shop photograph and how it showed a stylish way to accessorize a white shirt.

**Testing limitation:**

These observations do not prove full accessibility, customer satisfaction, or compatibility with every browser and device.

The new Welcome page design choices and their behavior must be checked after implementation.

See `LEARNING.md` for the fuller record of learner explanations and assistance.

---

## 12. Project Files

Important project files include:

| File                           | Purpose                                         |
| ------------------------------ | ----------------------------------------------- |
| `public/index.html`            | Welcome page and design choices                 |
| `public/shop.html`             | Shop page                                       |
| `public/studio.html`           | Our Story page                                  |
| `public/styleguide.html`       | Live Style Guide                                |
| `public/styles.css`            | Shared website styling and design tokens        |
| `public/studio.css`            | Additional brand and design-exploration styling |
| `public/shop.js`               | Shopping bag functionality                      |
| `public/styleguide.js`         | Live Style Guide token information              |
| `public/assets/wordmark.svg`   | Elsewhere logo                                  |
| `tests/server.test.js`         | Server tests                                    |
| `tests/browser/studio.spec.js` | Browser tests                                   |
| `README.md`                    | Project overview and setup instructions         |
| `LEARNING.md`                  | Learner explanations and evidence               |

---

## 13. GitHub Tracking

**Repository:** `am2290445/my-brand-studio`

**BRAND-001 branch:** `feature/brand-001-elsewhere`

**Pull request:** #10 — Update Elsewhere brand studio

**Status:** Merged into `main`.

### Assignment Follow-Up Issues

| Issue     | Assignment Work                                                 |
| --------- | --------------------------------------------------------------- |
| BRAND-002 | Audience hypotheses and predicted audience effect               |
| BRAND-003 | Paired, annotated Modernist and Postmodernist hero explorations |
| BRAND-004 | Logo review and live Style Guide consistency                    |
| BRAND-005 | Two truthful, useful ethical persuasion applications            |
| BRAND-006 | Final checks, learner review, evidence, and handoff             |

The original BRAND-001 issue was deleted at the learner's request.

---

## 14. Completion Requirements

The project is ready for final review when:

- The Modernist and Postmodernist previews are complete and use the same content and image.
- Both design choices appear on the Welcome page.
- Selecting either option displays its design directly on the Welcome page.
- The learner can explain the visual differences and why Postmodernism was selected.
- The selected direction visibly supports Sage and Creator.
- The Elsewhere logo works at its actual display size and in one color.
- The live Style Guide accurately reflects the website's colors, typography, and components.
- Two ethical persuasion applications are implemented and explained.
- The website works at desktop and mobile sizes.
- Keyboard navigation and important shopping-bag controls have been checked.
- Automated checks pass.
- The learner records actual observations and explains at least one decision to keep or revise.
- README, SPEC, and LEARNING accurately describe the final project.

Automated checks and AI-generated explanations are supporting evidence, not proof of independent learner understanding.

---

## 15. Future Work

No additional feature is selected yet.

After completing the current assignment requirements, a future feature could explore a brand story, a supported fit guide, or additional demo shopping-bag behavior.

Any future feature should have an agreed scope and a new specification before implementation.
