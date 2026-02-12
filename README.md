# INVOIZO — Professional Invoice Generator

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Netlify](https://img.shields.io/badge/Netlify-00C7B7?logo=netlify&logoColor=white)](https://www.netlify.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**INVOIZO** is a free, professional invoice generator that lets you create, preview, and download beautiful invoices instantly — right from your browser. No sign-up required.

---

## ✨ Features

- 📄 Create professional invoices with a clean, modern layout
- 👁️ Real-time invoice preview before downloading
- 📥 Download invoices as PDF
- 💱 Multi-currency support (USD, EUR, GBP, PKR, INR, and more)
- ➕ Add multiple line items with automatic totals
- 🎨 Customizable invoice fields (business info, client details, dates, notes)
- 📱 Fully responsive design — works on desktop and mobile
- ⚡ Fast, lightweight, and fully client-side (no server needed)
- 🔒 Privacy-first — your data never leaves your browser

---

## 🛠️ Tech Stack

| Technology | Purpose              |
|------------|----------------------|
| HTML5      | Structure & markup   |
| CSS3       | Styling & layout     |
| JavaScript | Logic & interactivity|
| Netlify    | Hosting & deployment |

---

## 📁 Project Structure

```
Invoizo_Invoice_Generator/
├── css/
│   ├── style.css              # Main site styles
│   ├── invoice-styles.css     # Invoice form & preview styles
│   └── invoice-print.css      # Print-specific styles
├── js/
│   ├── script.js              # Site scripts (loader, navigation)
│   ├── invoice-script.js      # Invoice form logic & PDF generation
│   └── lazy-loading.js        # Lazy loading for performance
├── fonts/                     # Custom fonts (Roxborough CF)
├── images/
│   ├── favicon.png            # Favicon
│   └── invoizo.svg            # Logo
├── index.html                 # Main application page
├── netlify.toml               # Netlify deployment config
├── robots.txt                 # Search engine crawling rules
├── sitemap.xml                # Sitemap for SEO
├── site.webmanifest           # PWA manifest
├── LICENSE                    # MIT License
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

No build tools or dependencies required — it's a static site! You just need a modern web browser.

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/hamzaka430/Invoizo_Invoice_Generator.git
   cd Invoizo_Invoice_Generator
   ```

2. **Open in your browser:**

   Simply open `index.html` in any modern browser, or use a local development server:

   ```bash
   # Using Python
   python3 -m http.server 8000

   # Using Node.js (npx)
   npx serve .
   ```

3. **Visit** `http://localhost:8000` in your browser.

---

## 📖 Usage

1. Fill in your **business details** (name, address, contact info).
2. Add your **client's information**.
3. Enter **invoice items** — description, quantity, and rate.
4. Select your preferred **currency**.
5. Click **Preview** to review the invoice.
6. Click **Download PDF** to save the invoice to your device.

---

## 🌐 Live Demo

👉 [**invoizo.app**](https://invoizo.app/)

---

## 👤 Author

**Hamza Khan** — [DezignWise](https://www.dezignwise.online/)

- GitHub: [@hamzaka430](https://github.com/hamzaka430)

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.
