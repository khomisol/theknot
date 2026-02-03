# UX Design Workflow

**Command:** `*create-ux-design`  
**Agent:** UX Designer (Sally)  
**Output:** `docs/ux-design-specification.md`

---

## Overview

Create comprehensive UX design specifications through collaborative visual exploration. This workflow guides you through user research, design system selection, component strategy, and interaction patterns.

**Your Role as UX Designer:** You are a UX facilitator working with a product stakeholder, not a content generator. Guide discovery through questions and collaborative decision-making.

---

## Prerequisites

**Required:**
- Product concept or PRD (basic understanding of what you're building)
- Target user understanding (who will use this)

**Optional but Helpful:**
- Existing brand guidelines
- Competitor analysis
- User research data

---

## Workflow Steps

### Step 1: Initialize & Discovery

**Goal:** Understand the product, users, and design constraints.

**Questions to Ask:**

1. **Product Context**
   - What problem does this product solve?
   - Who are the primary users?
   - What platforms (web, mobile, desktop)?
   - What's the timeline and budget?

2. **User Understanding**
   - Who are your target users? (demographics, behaviors, goals)
   - What are their pain points?
   - What's their technical proficiency?
   - What devices/browsers do they use?

3. **Design Constraints**
   - Existing brand guidelines or visual identity?
   - Technical constraints (frameworks, libraries)?
   - Accessibility requirements (WCAG level)?
   - Performance requirements?

4. **Business Goals**
   - What defines success for this product?
   - Key metrics to track?
   - Competitive differentiation needs?

**Output:** Document user personas, platform requirements, and constraints.

---

### Step 2: Core Experience Definition

**Goal:** Define the emotional and functional core of the user experience.

**Questions to Explore:**

1. **Emotional Response**
   - How should users feel when using this product?
   - What emotions drive engagement? (trust, excitement, calm, efficiency)
   - What's the personality of the product? (professional, playful, innovative)

2. **Core User Journeys**
   - What are the 3-5 most critical user tasks?
   - What's the happy path for each?
   - Where might users get stuck or confused?

3. **Value Proposition**
   - What makes this product valuable to users?
   - What's the "aha!" moment?
   - How quickly can users achieve their goals?

**Output:** Document core experience principles and primary user journeys.

---

### Step 3: Inspiration & Research

**Goal:** Gather inspiration and identify proven patterns.

**Activities:**

1. **Competitive Analysis**
   - What do competitors do well?
   - What patterns are users already familiar with?
   - What opportunities exist for differentiation?

2. **Pattern Libraries**
   - Review established UI patterns for your domain
   - Identify patterns that match user mental models
   - Note accessibility best practices

3. **Visual Inspiration**
   - Collect examples of desired look and feel
   - Identify color palettes, typography styles
   - Note interaction patterns that delight

**Output:** Document inspiration sources, competitive insights, and pattern references.

---

### Step 4: Design System Selection

**Goal:** Choose the design system foundation that balances speed, uniqueness, and maintainability.

**Critical Decision:** This choice impacts development speed, visual uniqueness, and long-term maintenance.

#### Design System Options

**1. Custom Design System**
- **Pros:** Complete visual uniqueness, full control, perfect brand alignment
- **Cons:** High initial investment, longer development time, ongoing maintenance
- **Best For:** Established brands with unique needs, products requiring strong differentiation
- **Timeline:** 3-6 months for initial system
- **Team Needs:** Dedicated design system team

**2. Established System (Material Design, Ant Design, Fluent UI)**
- **Pros:** Fast development, proven patterns, excellent accessibility, large community
- **Cons:** Less visual differentiation, recognizable patterns
- **Best For:** Internal tools, MVPs, startups prioritizing speed
- **Timeline:** 1-2 weeks for setup
- **Team Needs:** Minimal design resources

**3. Themeable System (MUI, Chakra UI, Tailwind UI, Shadcn)**
- **Pros:** Customizable foundation, brand flexibility, proven components, good balance
- **Cons:** Moderate learning curve, some constraints
- **Best For:** Most products - balance of speed and uniqueness
- **Timeline:** 2-4 weeks for customization
- **Team Needs:** 1-2 designers + developers

#### Decision Framework

Ask these questions to guide the choice:

1. **Speed vs. Uniqueness**
   - How quickly do you need to launch?
   - How important is visual differentiation?
   - Is brand recognition critical?

2. **Team Capabilities**
   - Design team size and expertise?
   - Development team familiarity with systems?
   - Ongoing maintenance capacity?

3. **Brand Requirements**
   - Existing brand guidelines to follow?
   - Need for custom visual language?
   - Consistency with other products?

4. **Technical Constraints**
   - Framework requirements (React, Vue, Angular)?
   - Performance requirements?
   - Accessibility compliance level?

5. **Long-term Considerations**
   - Scalability needs?
   - Multi-platform requirements?
   - Component reusability across products?

#### Recommended Systems by Use Case

**For Web Apps (React):**
- **Fast MVP:** Material UI (MUI), Ant Design
- **Balanced:** Chakra UI, Shadcn/ui, Radix UI
- **Custom:** Tailwind CSS + Headless UI

**For Mobile:**
- **iOS:** SwiftUI native components
- **Android:** Material Design 3
- **Cross-platform:** React Native Paper, NativeBase

**For Design-First Products:**
- **High customization:** Tailwind CSS
- **Component library:** Shadcn/ui (copy/paste, full control)
- **Rapid prototyping:** Chakra UI

#### Design System Documentation

Once chosen, document:

```markdown
## Design System Foundation

### System Choice: [Selected System]

**Rationale:**
- [Why this system fits project needs]
- [How it addresses constraints]
- [Trade-offs accepted]

### Implementation Approach:
- [Setup and configuration plan]
- [Customization strategy]
- [Component extension plan]

### Customization Strategy:
- [Brand colors and typography]
- [Custom components needed]
- [Pattern modifications]
```

---

### Step 5: Visual Foundation

**Goal:** Define the visual language - colors, typography, spacing, and elevation.

#### Color System

**Primary Colors:**
- Primary: Brand color for main actions
- Secondary: Supporting color for secondary actions
- Accent: Highlight color for emphasis

**Semantic Colors:**
- Success: Green (#10B981 or similar)
- Warning: Yellow/Orange (#F59E0B)
- Error: Red (#EF4444)
- Info: Blue (#3B82F6)

**Neutral Colors:**
- Background: Light/dark mode backgrounds
- Surface: Card/panel backgrounds
- Border: Divider and outline colors
- Text: Primary, secondary, disabled text

**Color Palette Structure:**
```
Primary: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900
(50 = lightest, 500 = base, 900 = darkest)
```

**Accessibility Requirements:**
- Text on background: 4.5:1 contrast minimum (WCAG AA)
- Large text (18pt+): 3:1 contrast minimum
- Interactive elements: 3:1 contrast with surroundings

#### Typography System

**Font Families:**
- **Headings:** [Font name] - personality, hierarchy
- **Body:** [Font name] - readability, performance
- **Monospace:** [Font name] - code, data

**Type Scale:**
```
xs:   12px / 0.75rem
sm:   14px / 0.875rem
base: 16px / 1rem
lg:   18px / 1.125rem
xl:   20px / 1.25rem
2xl:  24px / 1.5rem
3xl:  30px / 1.875rem
4xl:  36px / 2.25rem
5xl:  48px / 3rem
6xl:  60px / 3.75rem
```

**Line Heights:**
- Tight: 1.25 (headings)
- Normal: 1.5 (body text)
- Relaxed: 1.75 (long-form content)

**Font Weights:**
- Light: 300
- Regular: 400
- Medium: 500
- Semibold: 600
- Bold: 700

#### Spacing System

**Consistent spacing scale (8px base):**
```
0:   0px
1:   4px   (0.25rem)
2:   8px   (0.5rem)
3:   12px  (0.75rem)
4:   16px  (1rem)
5:   20px  (1.25rem)
6:   24px  (1.5rem)
8:   32px  (2rem)
10:  40px  (2.5rem)
12:  48px  (3rem)
16:  64px  (4rem)
20:  80px  (5rem)
24:  96px  (6rem)
```

**Usage Guidelines:**
- Component padding: 4, 6, 8
- Section spacing: 12, 16, 20
- Page margins: 16, 20, 24

#### Elevation & Shadows

**Shadow Scale:**
```
sm:   0 1px 2px rgba(0,0,0,0.05)
base: 0 1px 3px rgba(0,0,0,0.1)
md:   0 4px 6px rgba(0,0,0,0.1)
lg:   0 10px 15px rgba(0,0,0,0.1)
xl:   0 20px 25px rgba(0,0,0,0.1)
2xl:  0 25px 50px rgba(0,0,0,0.25)
```

**Usage:**
- Cards: sm or base
- Dropdowns: md
- Modals: lg or xl
- Tooltips: sm

#### Border Radius

```
none: 0px
sm:   2px
base: 4px
md:   6px
lg:   8px
xl:   12px
2xl:  16px
full: 9999px (pills, circles)
```

**Output:** Document complete visual foundation with design tokens.

---

### Step 6: Component Strategy

**Goal:** Define which components you need and how they'll be built.

#### Core Components Inventory

**Navigation:**
- [ ] Header/Navbar
- [ ] Sidebar
- [ ] Breadcrumbs
- [ ] Tabs
- [ ] Pagination

**Forms:**
- [ ] Text Input
- [ ] Textarea
- [ ] Select/Dropdown
- [ ] Checkbox
- [ ] Radio Button
- [ ] Toggle/Switch
- [ ] Date Picker
- [ ] File Upload
- [ ] Form Validation

**Buttons & Actions:**
- [ ] Primary Button
- [ ] Secondary Button
- [ ] Tertiary/Ghost Button
- [ ] Icon Button
- [ ] Button Group
- [ ] Floating Action Button

**Feedback:**
- [ ] Alert/Banner
- [ ] Toast/Notification
- [ ] Modal/Dialog
- [ ] Tooltip
- [ ] Progress Bar
- [ ] Spinner/Loader
- [ ] Empty State
- [ ] Error State

**Data Display:**
- [ ] Table
- [ ] List
- [ ] Card
- [ ] Badge
- [ ] Avatar
- [ ] Stat/Metric
- [ ] Chart/Graph

**Layout:**
- [ ] Container
- [ ] Grid
- [ ] Stack
- [ ] Divider
- [ ] Spacer

#### Component Customization Plan

For each component category, document:

1. **Use Design System Default?**
   - Yes: Use as-is with theme customization
   - Partial: Extend with custom variants
   - No: Build custom component

2. **Custom Variants Needed:**
   - Size variants (sm, md, lg)
   - Color variants (primary, secondary, etc.)
   - State variants (hover, active, disabled)

3. **Accessibility Requirements:**
   - Keyboard navigation
   - Screen reader support
   - ARIA attributes
   - Focus management

**Output:** Component inventory with build vs. customize decisions.

---

### Step 7: User Journey Mapping

**Goal:** Map detailed user flows for critical features.

#### For Each Core Journey:

1. **Entry Point**
   - How does user arrive? (link, search, navigation)
   - What's their context and intent?

2. **Steps**
   - List each screen/interaction
   - Note decision points
   - Identify potential friction

3. **Success State**
   - What does completion look like?
   - What feedback does user receive?
   - What's the next action?

4. **Error Handling**
   - What can go wrong?
   - How do we communicate errors?
   - How do users recover?

5. **Edge Cases**
   - Empty states (no data yet)
   - Loading states (waiting for data)
   - Error states (something failed)
   - Permission states (unauthorized)

#### Journey Documentation Format:

```markdown
### Journey: [Name]

**Goal:** [What user wants to accomplish]

**Steps:**
1. [Screen/Action] → [User sees/does] → [System responds]
2. [Screen/Action] → [User sees/does] → [System responds]
3. [Success state]

**Error Scenarios:**
- [Error type]: [How we handle it]

**Edge Cases:**
- [Empty state]: [What we show]
- [Loading state]: [What we show]
```

**Output:** Detailed journey maps for 3-5 core features.

---

### Step 8: Interaction Patterns

**Goal:** Define how users interact with the interface.

#### Navigation Patterns

**Primary Navigation:**
- Top nav bar (horizontal)
- Side nav bar (vertical)
- Bottom tab bar (mobile)
- Hamburger menu (mobile)

**Secondary Navigation:**
- Breadcrumbs (hierarchy)
- Tabs (related content)
- Pagination (long lists)
- Infinite scroll (feeds)

**Decision Factors:**
- Number of top-level sections
- Depth of information architecture
- Mobile vs. desktop priorities

#### Form Patterns

**Input Validation:**
- Inline validation (as user types)
- On blur validation (after leaving field)
- On submit validation (before submission)

**Error Display:**
- Inline errors (below field)
- Summary errors (top of form)
- Toast notifications (global)

**Progressive Disclosure:**
- Multi-step forms (wizards)
- Conditional fields (show/hide based on input)
- Expandable sections (advanced options)

#### Feedback Patterns

**Loading States:**
- Skeleton screens (content placeholders)
- Spinners (short waits)
- Progress bars (long operations)
- Optimistic updates (assume success)

**Success Feedback:**
- Toast notifications (non-blocking)
- Inline success messages
- Confetti/celebration (major milestones)
- Redirect to success page

**Error Handling:**
- Inline errors (field-level)
- Banner errors (page-level)
- Modal errors (blocking issues)
- Retry mechanisms

#### Data Display Patterns

**Tables:**
- Sortable columns
- Filterable data
- Pagination vs. infinite scroll
- Row actions (edit, delete)
- Bulk actions (select multiple)

**Lists:**
- Card layout (rich content)
- List layout (compact)
- Grid layout (visual items)
- Masonry layout (varied heights)

**Empty States:**
- First-time empty (onboarding)
- Cleared empty (user deleted all)
- No results (search/filter)
- Error empty (failed to load)

**Output:** Document interaction patterns for all major UI elements.

---

### Step 9: Responsive Design Strategy

**Goal:** Define how the design adapts across devices.

#### Breakpoints

**Standard Breakpoints:**
```
sm:  640px  (mobile landscape, small tablets)
md:  768px  (tablets)
lg:  1024px (laptops, small desktops)
xl:  1280px (desktops)
2xl: 1536px (large desktops)
```

**Mobile-First Approach:**
- Design for mobile first (320px+)
- Progressively enhance for larger screens
- Test on actual devices, not just browser resize

#### Layout Adaptations

**Navigation:**
- Mobile: Hamburger menu or bottom tabs
- Tablet: Collapsed sidebar or top nav
- Desktop: Full sidebar or expanded top nav

**Content:**
- Mobile: Single column, stacked
- Tablet: 2 columns where appropriate
- Desktop: 3+ columns, sidebars

**Forms:**
- Mobile: Full-width inputs, stacked
- Tablet: 2-column layout for short fields
- Desktop: Inline labels, multi-column

**Tables:**
- Mobile: Card view or horizontal scroll
- Tablet: Simplified columns
- Desktop: Full table with all columns

#### Touch vs. Mouse

**Touch Targets:**
- Minimum: 44x44px (iOS), 48x48px (Android)
- Spacing: 8px between targets
- Hover states: Not available on touch

**Gestures:**
- Swipe: Navigation, dismiss
- Long press: Context menu
- Pinch: Zoom (images, maps)
- Pull to refresh: Update content

**Output:** Document responsive behavior for all components and layouts.

---

### Step 10: Accessibility Requirements

**Goal:** Ensure the design is usable by everyone.

#### WCAG Compliance Level

**Level A (Minimum):**
- Text alternatives for images
- Keyboard accessible
- Sufficient color contrast

**Level AA (Target):**
- 4.5:1 contrast for normal text
- 3:1 contrast for large text
- Resize text up to 200%
- No keyboard traps

**Level AAA (Ideal):**
- 7:1 contrast for normal text
- 4.5:1 contrast for large text
- Enhanced error identification

#### Keyboard Navigation

**Requirements:**
- All interactive elements keyboard accessible
- Logical tab order
- Visible focus indicators
- Skip links for main content
- Keyboard shortcuts documented

**Focus Management:**
- Focus visible on all interactive elements
- Focus trapped in modals
- Focus returned after modal close
- Focus moved to new content after actions

#### Screen Reader Support

**Requirements:**
- Semantic HTML (headings, landmarks, lists)
- ARIA labels for icon buttons
- ARIA live regions for dynamic content
- Alt text for images
- Form labels properly associated

**Testing:**
- VoiceOver (macOS/iOS)
- NVDA (Windows)
- JAWS (Windows)
- TalkBack (Android)

#### Color & Contrast

**Requirements:**
- Don't rely on color alone for information
- Sufficient contrast ratios
- Color-blind friendly palettes
- Pattern/texture alternatives

**Tools:**
- WebAIM Contrast Checker
- Color Oracle (color blindness simulator)
- axe DevTools (automated testing)

**Output:** Document accessibility requirements and testing plan.

---

### Step 11: Design Deliverables

**Goal:** Specify what design artifacts will be created.

#### Wireframes

**Low-Fidelity:**
- Sketch-level layouts
- Focus on structure and flow
- Quick iteration

**High-Fidelity:**
- Detailed layouts
- Real content
- Interaction notes

**Tools:** Figma, Sketch, Adobe XD, Balsamiq

#### Mockups

**Static Designs:**
- Pixel-perfect visuals
- All states (default, hover, active, disabled)
- Responsive variants

**Design System:**
- Component library
- Style guide
- Design tokens

#### Prototypes

**Interactive:**
- Clickable flows
- Transition animations
- User testing ready

**Tools:** Figma, Framer, ProtoPie, Principle

#### Documentation

**For Developers:**
- Component specifications
- Interaction details
- Animation timing
- Responsive behavior

**For Stakeholders:**
- User journey maps
- Design rationale
- Success metrics

**Output:** List of deliverables with timeline and owners.

---

### Step 12: Implementation Handoff

**Goal:** Ensure smooth transition from design to development.

#### Design-Dev Collaboration

**Handoff Checklist:**
- [ ] Design system documented
- [ ] Components specified
- [ ] Interactions detailed
- [ ] Responsive behavior defined
- [ ] Accessibility requirements listed
- [ ] Assets exported (icons, images)
- [ ] Design tokens exported (colors, spacing)

**Tools:**
- Figma Dev Mode
- Zeplin
- Storybook (component documentation)
- Design tokens (Style Dictionary)

#### Quality Assurance

**Design QA:**
- Visual regression testing
- Cross-browser testing
- Responsive testing
- Accessibility testing

**Acceptance Criteria:**
- Matches design specifications
- Meets accessibility standards
- Performs well on target devices
- Handles edge cases gracefully

**Output:** Handoff documentation and QA checklist.

---

## Output Document Structure

The final UX design specification should include:

```markdown
# UX Design Specification: [Project Name]

## 1. Executive Summary
- Product overview
- Target users
- Key design decisions

## 2. User Research
- User personas
- User needs and pain points
- User journeys

## 3. Design System
- System choice and rationale
- Visual foundation (colors, typography, spacing)
- Component strategy

## 4. Core Experiences
- Primary user flows
- Interaction patterns
- Navigation structure

## 5. Responsive Design
- Breakpoint strategy
- Layout adaptations
- Touch vs. mouse considerations

## 6. Accessibility
- WCAG compliance level
- Keyboard navigation
- Screen reader support

## 7. Implementation
- Component inventory
- Design deliverables
- Handoff plan

## 8. Appendix
- Design inspiration
- Competitive analysis
- Technical constraints
```

---

## Tips for Success

1. **Start with Users:** Always ground decisions in user needs, not personal preferences
2. **Iterate Early:** Low-fidelity wireframes before high-fidelity mockups
3. **Test Assumptions:** Validate designs with real users when possible
4. **Document Decisions:** Explain the "why" behind design choices
5. **Think Systems:** Design for consistency and scalability
6. **Consider Constraints:** Balance ideal design with technical and business realities
7. **Accessibility First:** Build it in from the start, not as an afterthought
8. **Collaborate:** Work closely with developers, PMs, and stakeholders

---

## Common Pitfalls to Avoid

❌ **Designing in a vacuum** - Not involving users or stakeholders
❌ **Over-designing** - Adding complexity without user benefit
❌ **Ignoring constraints** - Designing without considering technical limitations
❌ **Skipping accessibility** - Treating it as optional or afterthought
❌ **Inconsistent patterns** - Not following established design system
❌ **No mobile strategy** - Desktop-only thinking
❌ **Missing edge cases** - Only designing happy paths
❌ **Poor handoff** - Incomplete specifications for developers

---

## Related Workflows

- `prd.md` - Product requirements (defines what to build)
- `architecture.md` - Technical architecture (defines how to build)
- `create-epics-stories.md` - Break design into implementable stories

---

**This workflow ensures your UX design is user-centered, accessible, implementable, and aligned with business goals.**
