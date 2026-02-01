# Google Calendar Event Formatting Guide

This document describes how to format event descriptions in Google Calendar so that the Hood River AI Collective website can parse and display extended event details (speakers, agenda, resources, parking, and accessibility information).

## Overview

The website parses structured markdown from Google Calendar event descriptions. Add sections to your event description using the format below to enable rich event details on the website.

**Important:** Events with extended data will automatically show an expandable card on the website. The first upcoming event will be auto-expanded by default.

---

## Supported Sections

You can include any or all of these sections in your event description. The parser will extract what's available and gracefully handle missing sections.

### 1. Speakers

Use this format for each speaker:

```
## Speakers
**Name:** Speaker Full Name
**Bio:** Brief biography or description of the speaker (one paragraph)
**Photo:** https://url-to-photo.jpg
**Twitter:** username
**LinkedIn:** https://linkedin.com/in/username
**Website:** https://example.com
---
```

**Notes:**
- `**Name:**` and `**Bio:**` are required for a speaker to appear
- `**Photo:**`, `**Twitter:**`, `**LinkedIn:**`, and `**Website:**` are all optional
- Use `---` to separate multiple speakers
- Social links: LinkedIn should be the full URL, Twitter should be just the username (no @)

**Example with multiple speakers:**

```
## Speakers
**Name:** Dr. Sarah Chen
**Bio:** AI researcher specializing in natural language processing and ethics. Former lead scientist at a major tech company, now focusing on making AI more accessible and transparent.
**Photo:** https://example.com/photo1.jpg
**Twitter:** sarahchen
**LinkedIn:** https://linkedin.com/in/sarahchen
**Website:** https://sarahchen.ai
---
**Name:** Marcus Rodriguez
**Bio:** Full-stack developer and AI enthusiast building practical applications with LLMs.
**Photo:** https://example.com/photo2.jpg
**LinkedIn:** https://linkedin.com/in/marcusrodriguez
```

---

### 2. Agenda

Use this format for agenda items:

```
## Agenda
**6:00 PM** - Event Title
Optional description on the next line(s)

**6:30 PM** - Another Event Title
Another optional description

**7:00 PM** - Yet Another Item
```

**Notes:**
- Format: `**TIME** - Title`
- Time can be in any format (6:00 PM, 18:00, 6pm, etc.)
- Description is optional and can span multiple lines
- Separate items with blank lines or `---`

**Example:**

```
## Agenda
**6:00 PM** - Doors Open & Networking
Grab a drink, meet fellow attendees, and chat about your AI projects

**6:30 PM** - Welcome & Announcements
Quick intro to the meetup and upcoming events

**6:45 PM** - Featured Talk: Building with Claude
Dr. Sarah Chen shares insights on effectively using Claude for real-world applications, including prompt engineering tips and practical examples

**7:30 PM** - Lightning Demo: Local AI Tools
Marcus Rodriguez demonstrates running AI models locally

**8:00 PM** - Open Discussion & Q&A

**8:30 PM** - Wrap Up
```

---

### 3. Resources

Use this format for links to slides, code, articles, or videos:

```
## Resources
[Link Title](https://url.com) - slide
[Another Link](https://url.com) - code
[Article Name](https://url.com) - article
[Video Title](https://url.com) - video
```

**Notes:**
- Format: `[Display Text](URL) - type`
- Type must be one of: `slide`, `code`, `article`, or `video`
- Each resource on a new line

**Example:**

```
## Resources
[Slides: Building with Claude](https://docs.google.com/presentation/d/sample) - slide
[GitHub: Local AI Toolkit](https://github.com/example/local-ai-tools) - code
[Article: Prompt Engineering Guide](https://example.com/prompt-guide) - article
[Video: Previous Meetup Recording](https://youtube.com/watch?v=example) - video
```

---

### 4. Logistics

Use this format for parking and accessibility information:

```
## Logistics
**Parking:** Free street parking available on Oak Street and in the public lot behind the library.
**Accessibility:** Venue is wheelchair accessible with an elevator. Accessible restrooms available on the first floor. ASL interpreter can be arranged with 48 hours notice.
```

**Notes:**
- Both fields are optional
- Can include multiple paragraphs if needed
- Keep descriptions clear and concise

---

## Complete Example

Here's a full event description with all sections:

```
Join us for an exciting evening exploring the latest in AI!

## Speakers
**Name:** Dr. Sarah Chen
**Bio:** AI researcher specializing in natural language processing and ethics. Former lead scientist at a major tech company, now focusing on making AI more accessible and transparent. Published author of "AI for Humans".
**Photo:** https://example.com/sarah.jpg
**Twitter:** sarahchen
**LinkedIn:** https://linkedin.com/in/sarahchen
**Website:** https://sarahchen.ai
---
**Name:** Marcus Rodriguez
**Bio:** Full-stack developer and AI enthusiast building practical applications with LLMs. Creator of several popular open-source AI tools and active contributor to the local tech community.
**Photo:** https://example.com/marcus.jpg
**Twitter:** marcusdev
**LinkedIn:** https://linkedin.com/in/marcusrodriguez

## Agenda
**6:00 PM** - Doors Open & Networking
Grab a drink, meet fellow attendees, and chat about your AI projects

**6:30 PM** - Welcome & Announcements
Quick intro to the meetup and upcoming events

**6:45 PM** - Featured Talk: Building with Claude
Dr. Sarah Chen shares insights on effectively using Claude for real-world applications, including prompt engineering tips and practical examples

**7:30 PM** - Lightning Demo: Local AI Tools
Marcus Rodriguez demonstrates running AI models locally and shares his favorite open-source tools

**7:50 PM** - Open Discussion & Q&A
Community discussion, questions, and project sharing

**8:30 PM** - Wrap Up
Final thoughts and post-meetup hangout coordination

## Resources
[Slides: Building with Claude](https://docs.google.com/presentation/d/sample) - slide
[GitHub: Local AI Toolkit](https://github.com/example/local-ai-tools) - code
[Article: Prompt Engineering Guide](https://example.com/prompt-engineering-guide) - article
[Video: Previous Meetup Recording](https://youtube.com/watch?v=example) - video

## Logistics
**Parking:** Free street parking available on Oak Street and in the public lot behind the library.
**Accessibility:** Venue is wheelchair accessible with an elevator. Accessible restrooms available on the first floor. ASL interpreter can be arranged with 48 hours notice.
```

---

## Tips

1. **Start simple:** You don't need all sections for every event. Even just an agenda or speaker info adds value.

2. **Test it:** After adding extended details, check the website to make sure everything displays correctly.

3. **Photo URLs:** Use reliable hosting for speaker photos (Google Drive with public sharing, Imgur, GitHub, etc.)

4. **Keep it readable:** The description still appears in Google Calendar, so keep the markdown clean and readable there too.

5. **Section order:** You can put sections in any order, but the recommended order is: Speakers → Agenda → Resources → Logistics

6. **Missing data:** If a section isn't found or is formatted incorrectly, the website will simply not display it (no errors).

---

## Technical Details

- The parser looks for headers starting with `##` followed by: Speakers, Agenda, Resources, or Logistics (case-insensitive)
- Speaker blocks are separated by `---` or triple newlines
- Agenda items are identified by bold time stamps followed by ` - Title`
- Resources must use markdown link format `[text](url)` followed by ` - type`
- Logistics fields use the same `**Field:**` format as speaker fields

If you have questions about formatting, check the source code in `src/app/utils/event-parser.ts` or ask the meetup organizers.
