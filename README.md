# Smart Grocery List & Inventory Manager

An advanced, industry-grade full-stack pantry inventory tracker, expiry monitor, receipt scan OCR parser, and predictive restock shopping list manager. Engineered with a modular **Express + React (Vite)** architecture, styled with custom paired display typography, and powered by Gemini models for intelligent kitchen automation.

---

## 1. Project Overview

### What is a Smart Grocery List & Inventory Manager?
Managing kitchen supplies manually often results in food waste, unexpected stockouts, and duplicate spending. The **Smart Grocery List & Inventory Manager** is a cohesive, multi-tenant digital control deck that solves these inefficiencies. It automates inventory bookkeeping, forecasts depletion rates, and organizes shopping checklists dynamically.

### What Problem Does It Solve?
1. **Food Waste**: Highlights expiring ingredients using high-contrast "Expiry Heat Badge" timelines so ingredients are consumed before spoiling.
2. **Stockouts & Emergency Spending**: Alarms users when ingredients sink below custom-configured "Min Stock" thresholds.
3. **Receipt Typing Chores**: Extracts items, quantities, and pricing from paper invoices instantly via Gemini Vision OCR models.
4. **Disorganized Shopping Trips**: Automatically clusters required groceries by physical supermarket aisle categories, reducing shopping time.

### Target Utility
* **Shared Households & Families**: Synchronizes a single unified checklist across rooms to avoid double purchases.
* **Hostel Mess & Tiffin Kitchens**: Manages bulk supply catalogs, tracking portion consumption and estimating restock dates.
* **Small Cafes & Cloud Kitchens**: Tracks unit pricing records over time across wholesale merchants, estimating raw material spend.

---

## 2. Full-Stack Tech Stack Selection

To ensure production-grade performance, scalability, and ease of deployment for grading mentors, the application utilizes:

* **Frontend**: React 19 (TypeScript) + Vite + Tailwind CSS v4 + Motion.
* **Icons**: Feather-smooth `lucide-react` micro-symbols.
* **Backend**: Express (Node.js) ESM runner featuring automatic TypeScript stripping powered by `tsx`.
* **AI Cognitive Layers**: Gemini models using the advanced `@google/genai` SDK.
* **Database / State Engine**: A structured, transactional local JSON database with automated atomic writes (resilient against filesystem splits and service shutdowns).

---

## 3. High-Level Architecture Diagram

```
                 +---------------------------------------+
                 |          REACT CHROME / CLIENT        |
                 |  Dashboard | Pantry | List | Recipes  |
                 +-------------------+-------------------+
                                     |  HTTP REST / Bearer Tokens
                                     v
                 +---------------------------------------+
                 |         EXPRESS SERVER GATEWAY        |
                 |  Auth Session | Inventory Lot | CRUD  |
                 +--------+---------------------+--------+
                          |                     |
   Local Persist  +-------v-------+     +-------v-------+  @google/genai
   Atomic Writes  |  JSON DB FILE |     |   GEMINI API  |  Vision & Text
   (db.json)      |  Relational   |     |    (Flash)    |  Replenishment
                  +---------------+     +---------------+
```

### Database Schema Structure

```
+-------------------+           +-----------------------+           +----------------------+
|       USER        |           |       HOUSEHOLD       |           |     INVENTORY LOT    |
| - id (PK)         |           | - id (PK)             |           | - id (PK)            |
| - email           +-----------+ - name                +-----------+ - itemId             |
| - passwordHash    |           +-----------+-----------+           | - qty                |
| - name            |                       |                       | - unit               |
| - householdId     |                       |                       | - boughtAt           |
| +-----------------+                       |                       | - expiryAt           |
|                                           |                       | - notes              |
|                                           |                       | - consumedQty        |
|                                           |                       | +--------------------+
|                                           v                       |
|                               +-----------+-----------+           |
|                               |         ITEM          |-----------+
|                               | - id (PK)             |
|                               | - householdId         |
|                               | - name                |
|                               | - barcode             |
|                               | - defaultUnit         |
|                               | - category            |
|                               | - preferredAisle      |
|                               | - minStockQty         |
|                               +-----------+-----------+
|                                           |
|                                           | On-Demand Sync
|                                           v
|                               +-----------+-----------+
|                               |     GROCERY ENTRY     |
|                               | - id (PK)             |
|                               | - listId              |
|                               | - itemId              |
|                               | - customText          |
|                               | - qty                 |
|                               | - unit                |
|                               | - checked             |
|                               | - source              |
|                               +-----------------------+
```

---

## 4. Key Endpoints Flow Matrix

| HTTP Method | Route PATH | Auth | Operational Outcome |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/register` | Open | Reg assembles user profile, generates home and initial household tokens. |
| **POST** | `/api/auth/login` | Open | Evaluates credentials, boots session active tokens. |
| **GET** | `/api/auth/current` | Active | Identifies session parameters to mount custom household layouts. |
| **GET** | `/api/dashboard/summary` | Active | Aggregates stats, low stock thresholds, and expiry alarm logs. |
| **GET** | `/api/inventory/items` | Active | Inspects pantry catalog matching total in-stock levels. |
| **POST** | `/api/inventory/items` | Active | Appends a brand-new product catalog entry. |
| **GET** | `/api/inventory/overview`| Active | Evaluates individual inventory lots sorted by expiry timeline. |
| **POST** | `/api/inventory/lots` | Active | Books a fresh stockpile batch into inventory logs. |
| **POST** | `/api/inventory/consume` | Active | Marks partial or complete utilization of specific lots. |
| **GET** | `/api/list/current` | Active | Opens active grocery shopping list, resolving associated item data. |
| **POST** | `/api/list/:listId/add` | Active | Requests item (catalog-mapped or custom text) on checkbox lists. |
| **PATCH**| `/api/list/entry/:id/check`| Active | Toggles buy checkbox on grocery list rows. |
| **POST** | `/api/list/clear-checked` | Active | Purges checked elements from list rows. |
| **POST** | `/api/list/add-recipe` | Active | Syncs complete recipe ingredients direct to shopping list. |
| **POST** | `/api/import/receipt-image`| Active | Multimodal Gemini Vision analysis of receipt images to register items, lots & prices. |
| **POST** | `/api/import/receipt-text` | Active | Copy-paste raw receipt string text analyzer parser helper. |
| **GET** | `/api/ai/predictive-restocks`| Active | Gemini models forecast stockout risks, generating buy recommendations. |
| **POST** | `/api/ai/suggest-recipe` | Active| Gemini formulated fresh instructions & ingredients by custom cooking prompt. |

---

## 5. Virtual Simulation Guides

To evaluate all features immediately (ideal for recruiters and student grading juries), follow this step-by-step trial workflow:

### Step A: Authorization Portal
1. Open the page and see the auth panel.
2. Under the password field, look at the hints box: login with email `demo@example.com` and password `demo` to access mock preloaded seeds!
3. If you want a fresh sandbox, select "Create new shared household" to sign up.

### Step B: Predictive Restocking Simulation
1. From the **Dashboard** Tab, see the empty state for Predictions on the right.
2. Click **Predict Restocks** on the pink recommendation card.
3. The Gemini model evaluates your pantry balances (e.g. *Rice is below min stock limit of 2kg; Milk is expiring soon*) and advises replenishments, providing an analytical confidence score.
4. Click **Add (Qty)**. The element transfers instantly, and the "Shopping List" counter badge increments in the header navigation frame.

### Step C: Scanning Grocery Receipts (OCR)
1. Navigate to the **Invoices OCR** Tab.
2. In the "Virtual Receipt Cam Simulator" frame, select either **Walmart Pantry Run** or **DMart Indian Staples**.
3. Inspect the mock invoice details, then click **Simulate Camera Capture**.
4. The loader reveals: *Vision AI Engine Processing: Splitting invoice rows, matching weight scales, categorizing aisles, and registering products*.
5. In 2-3 seconds, the items from the simulated bill appear under "Loaded successfully!", complete with their prices and appropriate categorized units.
6. Verify: Navigate to the **Inventory & Expiries** tab. Under "Active Stock Lots", verify that the items from the receipt are indexed! On the "Pantry Stock by Category" chart in the Dashboard tab, the distribution metrics update.

### Step D: Recipe Planning Engine
1. Navigate to the **Recipes Builder** Tab.
2. See the preloaded recipe cards: Expanded cards (e.g. *Delicious Rice Kheer*) display ingredients (Milk, Grains) and instructions.
3. Click **Sync Ingredients**. It syncs the recipe ingredients directly to your Shopping List.
4. Try AI Creative Recipes: On the right side under *Chef Assistant*, type a custom prompt (e.g., `"Vegan Oat Banana Waffles"`) and click **Generate AI Recipe**.
5. Gemini formulates a complete cooking layout on-the-fly, mapping ingredients to our kitchen Units, and registers it in your local database. Click expand to inspect.

---

## 6. How To Set Up And Run Globally

Follow these simple, robust commands to initialize and execute our White-Labeled experience:

### Directory Prep
Clone or download this codebase into your local development computer.
Ensure you have **Node.js 18+** installed.

### Workspace Setup
In the absolute root of the repository, execute:
```bash
# Install node dependencies
npm install
```

### Config Environment Setup
Create a `.env` file inside the root directory or copy `.env.example`:
```bash
cp .env.example .env
```
Inside `.env`, define your Gemini API key (Required for AI operations like receipt scans and predictions):
```env
GEMINI_API_KEY="YOUR_ACTUAL_GEMINI_API_KEY"
```

### Run Development App
Launch both the robust backend server and Vite bundler synchronously:
```bash
npm run dev
```
The console will boot:
```
====================================================
 Smart Grocery List & Inventory Manager is RUNNING
 Port: 3000 (0.0.0.0) - Dev Host Mode Connected
====================================================
```
Open your browser to: **`http://localhost:3000`**

### Build Production Release
To compile the statically bundled React frontend and compact single-file server, execute:
```bash
# Build Vite production distributable followed by esbuild bundle
npm run build

# Start the compiled full-stack production release
npm run start
```

---

## 7. Portfolio Publishing Strategy & GitHub Instructions

To maximize recruiters' interest and display robust proof of work, structure your GitHub repository following these professional guidelines:

### Best Repository Identity
* **Repository Name**: `smart-grocery-inventory-manager` (humble, descriptive, literal).
* **Short Description**: "An advanced full-stack pantry inventory tracker, expiry monitor, receipt OCR scanner, and predictive restock list manager using Node and React."
* **Recommended Tags**: `fullstack-development`, `react-typescript`, `node-express`, `gemini-api`, `grocery-planner`, `smart-kitchen`, `software-architecture`, `ocr-scanner`.

### Commit Commencing Pattern
Ensure your commit logs follow standard professional conventions to showcase modular development:
* `feat: initialize database model layouts and local schemas`
* `feat: implement Express backend CRUD endpoints for lots & groceries`
* `feat: construct custom visual charts and predictive restock deck`
* `feat: implement Gemini receipt OCR camera and recipes builders`
* `style: polish typography scales, margin negative space and visual theme`

### Publishing Safety Reminder
* **NEVER upload `.env` files** to public git systems to keep credentials secure.
* `.env.example` is checked in and acts as a configuration template for grading assistants.
* `.gitignore` is pre-configured to automatically skip `node_modules`, `dist`, `.env`, and local `db.json` files.

---

## 8. Interview Preparation: Questions & Expert Responses

Use these comprehensive interview questions and technical breakdowns to prep for Full-Stack, Backend, UI/UX, and Engineering roles during job applications:

### Q1. "Explain your project."
> **Answer (Human Tone)**:
> "I built the 'Smart Grocery List & Inventory Manager' — a highly responsive and feature-rich full-stack web application designed to track kitchen stock, analyze expiries, and automate shopping. Households can register, manage supply items, book in stock lots with varying expiry timestamps, record consumption, and maintain checkable grocery lists grouped by supermarket aisle.
>
> On top of the core CRUD architecture, I implemented two distinct AI modules powered by Gemini. First, a **Vision OCR scanner** that allows users to upload receipt images or simulate camera scans, automatically creating inventory lots and recording wholesale price histories. Second, an **AI Replenishment Forecasting Engine** that analyzes current balances and depletion thresholds, advising restock quantities to prevent food waste.
>
> Technically, the app is built on a consolidated Express and Vite platform using Node.js TypeScript. It utilizes a resilient, transactional JSON file-based database. To support deployment on remote containers without native binary reliance, I designed my own secure session-based authentication."

---

### Q2. "How did you implement the Receipt OCR parsing with Gemini, and how does it integrate into your local database models?"
> **Answer (Technical Deep-Dive)**:
> "Instead of managing image files with third-party local libraries, I decided on a modern multimodal processing approach using the `@google/genai` TypeScript SDK on my Express server. On the client, I capture receipt photos and convert them to base64 Data URLs, which are submitted to the API over a JSON transfer limit of 15MB. 
>
> In the backend, the base64 content is sent to `gemini-3.5-flash` using `{ responseMimeType: "application/json" }` alongside a strict custom JSON schema. This schema ensures Gemini outputs a clean flat array representing item rows (name, qty, unit type, category, price).
>
> Once parsed, the controller executes a transactional loop:
> 1. It checks if the item exists in the household catalog by resolving its name. If not, it registers a new product.
> 2. It appends an inventory lot with the scanned quantity.
> 3. It records the merchant, item pricing, and timestamp in our `PriceHistory` database table.
> This matches real-world retail workflows where price histories are traced from invoices."

---

### Q3. "How did you ensure the application is robust against restarts and concurrency issues on Node.js without using an external SQL/NoSQL engine?"
> **Answer (Systems Engineering)**:
> "I designed a persistent Local JSON Database utilizing a centralized singleton class called `LocalDB` in `./server/db.ts`. The class initializes with a typed schema modeling households, items, users, lots, lists, and recipes.
>
> To avoid data corruption during server updates, I implemented **atomic filesystem writes**. When save data is written, the database stringifies the data into a temporary database file (`db.json.tmp`). Once safely completed, it calls `fs.renameSync` to atomically overwrite the real database `db.json`. 
>
> Because renaming is a secure OS-level atomic operation, this prevents database truncation or partial corruption if the node process crashes mid-write. I also preloaded the DB with realistic default seed data so the application is ready to demontrate right out of the box."

---

### Q4. "Explain how the Low-Stock Alarm and Expiry Heat Badge systems are calculated."
> **Answer (Logic Breakdown)**:
> "Both systems are calculated on the server to maintain data accuracy.
> * **Low-Stock Alarm**: During items query, the server calculates global product levels by locating all active inventory lots pointing to that item. It sums the non-consumed quantities: `inventory.reduce((sum, lot) => sum + (lot.qty - lot.consumedQty), 0)`. It compares this total with the item's configured `minStockQty`. If the total is less than the threshold, it flags a warning state, alerting the user and proposing a restock.
> * **Expiry Heat Badges**: I grouped stocks by inventory lot. On retrieval, the system calculates the date difference between `expiryAt` and the current timestamp: `Math.ceil((expiry - now) / 86400000)`. Lots with a difference less than 0 are flagged as 'Expired', less than 3 days as 'Expiring Soon' (yellow), and remaining active lots as 'Secure' (green)."

---

### Q5. "Why did you choose a custom CSS-driven visualization deck over installing popular charting libraries like Chart.js or Recharts?"
> **Answer (UI/UX Engineering)**:
> "I prioritized performance, styling customizability, and dependency stability. Library-driven canvases often introduce page-flickering, struggle with fluid hydration across different devices, and cause bundle bloat or peer-dependency version clashes under TypeScript.
>
> I programmed my own charting deck using Tailwind CSS. By calculating category proportions dynamically and applying conditional colors tied to categories (e.g. Dairy is teal, Produce is emerald), I render highly responsive horizontal layout tracks. They are styled with clean negative margins, are interactive on hover, and render instantaneously without peer-dependency compilation hazards."

---

### Q6. "How does your session-based authentication work, and how is it secured?"
> **Answer (Security Strategy)**:
> "To maintain high portability and bypass native CJS dependency compilation issues on hosting systems (often caused by modules like `bcrypt` representing C-level bindings), I constructed a secure session ledger. 
>
> When users authenticate, the server validates their credentials. On success, it mints a high-entropy hex string using `crypto.randomBytes(32).toString('hex')` as a session token. It records this token against the `userId` in the `sessions` collection, setting an expiration offset of 30 days.
>
> The token is returned to the browser and stored in `localStorage`. Subsequent requests submit the token inside the standard authorization header (`Bearer token`). The custom Express middleware `requireAuth` parses the header and looks up the active session in our database, verifying its expiration timeline."

---

### Q7. "Why is white-labeling and the elimination of third-party framing references important for an elite portfolio web app?"
> **Answer (UI Architecture)**:
> "White-labeling elevates a standard student project into a polished software product. Removing default generator brand credits, framing headers, or platform logos ensures that when a hiring manager evaluates the product, they are focused entirely on the user-facing brand identity. This reflects professional discipline, attention to margin detail, and real-world deployment practices where company branding is absolute."

---

### Q8. "How did you manage modular communication between sibling components when users operate across multiple tabs?"
> **Answer (React State Management)**:
> "To prevent bloated files prone to cutoff issues, I segmented App controls into distinct nested modules for the Dashboard, Pantry, Shopping list, Recipes, and OCR frames. To keep counters synced synchronously (for instance, when an item is added to the shopping list from the Dashboard restock forecasts, the Shopping List badging must immediately update), I implemented a **reactive sync signal**.
>
> I configured a simple numeric state trigger: `const [syncTrigger, setSyncTrigger] = useState(0)`. When actions in sub-panels occur, they execute a parent callback `triggerSync` which increments the trigger. Sibling panels implement a `useEffect` hooked to this indicator, instantly recalculating metrics."

---

### Q9. "What are some potential scaling improvements you would introduce if this app went into a multi-node production setup?"
> **Answer (Advanced Scalability)**:
> "Since the app uses atomic file writes, it's perfect for a single container. If we were to scale to dozens of nodes on a load-balancer, three upgrades would be made:
> 1. Migrating local JSON files to a managed relation DBMS (PostgreSQL using Prisma) or high-throughput NoSQL (MongoDB/Firestore).
> 2. Moving session hashes to a fast distributed cache (Redis) with JWT cryptography signatures to maintain stateless microservice authentication.
> 3. Introducing queue runners (BullMQ) to handle nightly automated alerts, restock suggestions, and push digests."

---

### Q10. "Tell me about a difficult bug you solved during development or type-compliance matching."
> **Answer (Problem Solving)**:
> "A notable type-safety bug arose when matching the `GroceryEntry` database elements. The schema models both registered catalog items and custom text entries. Initially, typescript errored when creating entries if a lot didn't map to a catalog database item.
>
> I resolved this by designing a flexible `GroceryEntry` interface where both `itemId` and `customText` are declared nullable but mutually present. In the React layout, the component implements a **Dual-Mode selection toggle**. Custom entries locks the unit picker to options, while Catalog matching maps and hides the option selector, matching the item default units. This cleared compiler errors and simplified the UI."
