# **Product Requirement Document (PRD)**

## **Project Name: Puzzify**

* **Version:** 1.0 (MVP)  
* **Status:** Finalized for Initial Development  
* **Date:** June 2026

## **1\. Product Overview & Vision**

### **1.1. Problem Statement**

The digital gifting and online interaction industries currently face three fundamental challenges:

* **Low Emotional ROI:** Sending a digital greeting card, an instant discount code, or a gift card feels purely transactional and dry. The recipient experiences minimal lasting joy because the process requires little visible time or creativity from the sender. In gifting culture, the delivery mechanism is just as valuable as the gift itself.  
* **Creative Block for Average Users:** Everyday individuals who want to surprise others for various occasions (birthdays, anniversaries, inside jokes, holidays) lack interactive tools if they don't possess programming or graphic design skills. Existing platforms are either overly simplistic (audio ecards) or overly complex (enterprise gamification suites).  
* **Template Lock-in:** Current market tools force users into rigid structures (e.g., exclusively Christmas or Valentine's Day layouts). These tools lack the flexibility to seamlessly merge personal memories, localized riddles, and diverse languages into a single cohesive experience.

### **1.2. The Solution**

**Puzzify** gamifies the digital gifting process, shifting the experience from a simple "delivery" to an **Exploration Experience**. Senders spend just a few minutes configuring a highly personalized digital "Quest." This investment of time and thought exponentially increases the emotional value of the gift for the recipient, even if the final reward is a simple text message.

### **1.3. Core Value Proposition**

**"Puzzify turns any digital gift, message, or announcement into a personalized, online mini-escape room. Creators build the mystery; recipients play the game to unlock their reward."**

## **2\. Core Pillars: Universal & Modular**

To ensure Puzzify operates as a truly generic, scalable, and globally accessible platform, it is built upon three foundational pillars:

### **2.1. Occasion-Agnostic Architecture**

The product does not hardcode theme logic for any specific event in the frontend or database. Instead, the platform exposes an **abstract set of visual parameters**. Seasonal events like Valentine's Day, birthdays, or corporate onboarding are merely pre-configured presets of these parameters:

| Visual Parameter | System Functionality | Practical Example |
| :---- | :---- | :---- |
| **Color Palette** | Dynamically updates the primary, secondary, and background UI variables. | A dark/detective theme for a crime mystery puzzle vs. a pastel/bright theme for a birthday. |
| **Environmental Effects (Particles)** | Renders fluid background canvas animations based on state. | Floating hearts, falling snow, birthday confetti, or cascading matrix code. |
| **Ambient Sound** | Background audio loops that enhance immersive interaction. | A soft lo-fi melody or a mysterious, suspenseful background track. |
| **Box Asset** | The visual model/icon of the final container that unlocks. | A classic ribboned gift box, a heavy steel safe, or a confidential envelope. |

### **2.2. True i18n & RTL/LTR Flexibility**

* **Layout Mirroring:** The frontend component layout dynamically mirrors based on the chosen language locale. When a creator selects a Right-to-Left (RTL) language like Persian, the UI alignment, button placement, and box animations flip seamlessly without breaking the layout. Left-to-Right (LTR) languages like English operate natively.  
* **Dynamic Font Injection:** The application injects language-optimized web typography at runtime to maintain high visual standards across different alphabets and character sets.

### **2.3. JSON-Driven Engine**

The platform enforces a strict decoupling of raw puzzle data from the rendering UI. The client-side application evaluates a structured JSON object to render the step-by-step interface dynamically. This keeps the bundle size exceptionally lightweight, allows creators to make real-time edits without rebuilding, and simplifies database storage via a single unique identifier linked to a custom URL (e.g., puzzify.me/q/unique-id).

## **3\. Functional Requirements & Module Architecture**

The application splits into two decoupled core experiences: the **Creator Studio** for the sender and the **Interactive Player** for the recipient.

### **3.1. Creator Studio (Sender Experience)**

* **Sender Dashboard:** A central hub where creators can view, manage, and track the status of all their created quests.
* **Canvas-Style Design Engine:** A rich design experience featuring drag-and-drop interfaces and canvas-style design tools for building the puzzle flow and placing elements intuitively.
* **Live Output Preview:** A real-time preview panel allowing the sender to interact with and test the quest exactly as the receiver will see it.
* **Flow Manager:** A step-by-step configuration wizard allowing users to add, delete, or reorder steps. For the MVP, the gameplay progression is strictly **Linear** (Step N must evaluate to true before Step N+1 unlocks).  
* **Theme Configurator:** An interface to assign the visual theme preset, select ambient audio, and toggle opening particle effects.  
* **Per-Step Advanced Settings:** Senders can optionally configure three optional fields for each individual step:  
  * *Hint Text:* A contextual clue revealed only when the recipient clicks the hint/lightbulb icon.  
  * *Success Message:* A short toast or text block appearing immediately after a correct answer (e.g., "Correct\! You always remembered that date.").  
  * *Max Attempts:* An optional integer to cap how many times a recipient can guess before being locked out or penalized.
* **Unique URL Generation:** Upon publishing, the studio generates a unique, secure URL for the creator to copy and send directly to the recipient.

### **3.2. MVP Puzzle Block Library**

Each puzzle block operates as an isolated, reusable frontend component accepting standardized props and emitting a boolean (true/false) validity state to the main engine:

1. **Text/Password Lock:** Displays a prompt requiring an exact string match in a text field. Features a toggleable configuration for case-sensitivity. *Example: "What is the name of the first city we traveled to together?"*  
2. **Trivia / Multiple Choice:** Renders a question alongside 2 to 4 options with a single correct index. Supports media attachments (image/video) to serve as a visual clue for the question.  
3. **Image Inspect / Hotspot Lock:** The creator uploads an image and defines a bounding box target using relative X/Y coordinates. The recipient must click or tap the correct area on the image to pass. *Example: "Tap on the hidden location of your real physical gift in this room photo."*

### **3.3. Interactive Player (Recipient Experience)**

* **Zero-Friction Access:** Recipients **must not** be forced to download an application, register, or authenticate. Gaining access is strictly handled via the unique URL token.  
* **State Persistence:** Current gameplay progress caches instantly to LocalStorage or SessionStorage. If the user accidentally closes the browser tab or gets interrupted by a phone call, re-opening the link returns them exactly to their furthest unlocked step.  
* **Dedicated Output Page:** A focused interface exclusively tailored for the gift receiver to interact with the gamified puzzle elements without distraction.
* **The Grand Finale (Reward Screen):** A dedicated, high-impact component that mounts only when the final puzzle condition is met. It supports modular layouts: an embedded streaming video link, an animated rich-text letter with a typewriter effect, or a digital voucher/gift card display with an instant copy-to-clipboard action.

### **3.4. Client-Side Data Security**

To prevent tech-savvy recipients from opening browser developer tools (Inspect Element) to read the raw JSON answers or find the final payload URL, the system applies client-side safeguards:

* Correct answers do not exist as plain text in the payload; they are stored as cryptographic hashes. The recipient's input is hashed on the fly and compared against the stored hash.  
* The final reward payload (The Grand Finale) is completely omitted from the initial network payload and is only fetched from the server via a secure endpoint after verifying all step solutions are solved.

### **3.5. Public Landing Page**

A dedicated marketing and product introduction page designed to showcase the Puzzify platform's capabilities, highlight use cases (birthdays, corporate events, etc.), and drive new user registrations through clear calls-to-action.

## **4\. Monetization & Viral Loop**

### **4.1. Monetization Strategy**

The platform utilizes a combination of Freemium limits, micro-transactions, and subscription tiers to drive sustainable revenue from day one:

| Tier | Target Audience | Features & Packaging |
| :---- | :---- | :---- |
| **Freemium Tier** | Casual, everyday users | • Build up to 3 linear steps per quest. • Access to base modules (Text Lock & Trivia). • Standard visual themes. • Includes Puzzify branding/watermark on player. |
| **Premium Box (Pay-per-Use)** | One-off event creators | • One-time micropayment per premium quest container. • Unlimited gameplay steps. • Unlocks premium 3D themes, audio tracks, and advanced particles. • Unlocks advanced modules (Hotspot/Image Inspect). • Complete removal of platform watermarks \+ high-capacity video uploads. |
| **Corporate SaaS Subscription** | HR Teams & Marketing Agencies | • Monthly or annual recurring subscription model. • Dedicated dashboard for team-wide event creation. • White-labeling capabilities (inserting corporate logos and brand guidelines). • Advanced analytics suite tracking completion rates, average solve times, and engagement metrics. |

### **4.2. The Viral Loop**

Because Puzzify is an inherently shared utility, the product leverages built-in organic growth mechanics:

\[Sender Creates Quest\] ──\> \[Recipient Opens Link\] ──\> \[Recipient Plays & Unlocks Reward\]  
                                                                     │  
                                                                     ▼  
\[New Account Registration\] \<── \[Clicks "Create Your Own"\] \<── \[Grand Finale Screen \+ High-Impact CTA\]

* **Post-Game Call to Action (CTA):** Immediately after viewing their reward, recipients encounter an elegant, animated panel reading: *"Want to surprise someone else with a custom puzzle? Create your first quest for free\!"* This converts immediate emotional delight directly into product adoption.  
* **Polished Watermarking:** In the free tier, a minimalist, aesthetic brand badge sits subtly within the UI interface, inviting curious players to click and explore the creation engine themselves.

## **5\. Non-Functional Requirements**

* **Backend & Database Infrastructure:** The server, database, and authentication layers will utilize **Firebase** to ensure rapid development, real-time database capabilities, and seamless integration with the frontend application.
* **Performance & Core Web Vitals:** The player client application must be optimized for lightweight network delivery, achieving an initial load time of under 2 seconds even under throttled mobile network speeds.  
* **Mobile-First Responsive Design:** Given that over 90% of recipients open their custom links natively within social media in-app browsers (e.g., Telegram, WhatsApp, Instagram), every puzzle component, interaction model, and form input field must be optimized perfectly for mobile viewports and touch targets.  
* **Infrastructure Elasticity:** The backend API routing and storage layers must utilize elastic scaling setups capable of mitigating massive traffic spikes during global hallmark dates (e.g., Valentine's Day, New Year's Eve, major holidays).