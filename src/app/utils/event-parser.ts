/**
 * Parses structured event data from Google Calendar event descriptions
 *
 * Expected format in Google Calendar description:
 *
 * ## Speakers
 * **Name:** Speaker Name
 * **Bio:** Speaker bio text
 * **Photo:** https://url-to-photo.jpg
 * **Twitter:** username
 * **LinkedIn:** https://linkedin.com/in/username
 * **Website:** https://example.com
 * ---
 *
 * ## Agenda
 * **6:00 PM** - Event Title
 * Description of what happens
 * ---
 *
 * ## Resources
 * [Link Title](https://url.com) - slide|code|article|video
 * ---
 *
 * ## Logistics
 * **Parking:** Parking information
 * **Accessibility:** Accessibility information
 */

import { EventExtendedData, Speaker, AgendaItem, Resource } from '../models/event.model';

export class EventDescriptionParser {

  static parse(description: string): EventExtendedData | null {
    if (!description || description.trim() === '') {
      return null;
    }

    try {
      // Convert HTML to plain text (Google Calendar returns HTML formatted descriptions)
      const plainDescription = this.htmlToPlainText(description);

      const data: EventExtendedData = {
        speakers: this.parseSpeakers(plainDescription),
        agenda: this.parseAgenda(plainDescription),
        resources: this.parseResources(plainDescription),
        parking: this.parseLogistics(plainDescription, 'Parking'),
        accessibility: this.parseLogistics(plainDescription, 'Accessibility')
      };

      // Only return data if we found at least something
      const hasData = data.speakers.length > 0 ||
                     data.agenda.length > 0 ||
                     data.resources.length > 0 ||
                     data.parking ||
                     data.accessibility;

      return hasData ? data : null;
    } catch (error) {
      console.warn('Error parsing event description:', error);
      return null;
    }
  }

  /**
   * Convert HTML-formatted description to plain text
   * Google Calendar API returns descriptions with HTML tags
   */
  private static htmlToPlainText(html: string): string {
    // Convert <br>, <br/>, <br /> to newlines
    let text = html.replace(/<br\s*\/?>/gi, '\n');

    // Remove all other HTML tags
    text = text.replace(/<[^>]+>/g, '');

    // Decode common HTML entities
    const entityMap: { [key: string]: string } = {
      '&amp;': '&',
      '&lt;': '<',
      '&gt;': '>',
      '&quot;': '"',
      '&#39;': "'",
      '&nbsp;': ' '
    };

    Object.keys(entityMap).forEach(entity => {
      text = text.replace(new RegExp(entity, 'g'), entityMap[entity]);
    });

    return text;
  }

  private static parseSpeakers(description: string): Speaker[] {
    const speakers: Speaker[] = [];
    const speakersSection = this.extractSection(description, 'Speakers');

    if (!speakersSection) return speakers;

    // Split by --- or double newline to separate multiple speakers
    const speakerBlocks = speakersSection.split(/---|\n\n\n/);

    for (const block of speakerBlocks) {
      if (!block.trim()) continue;

      const speaker: Speaker = {
        name: this.extractField(block, 'Name') || '',
        bio: this.extractField(block, 'Bio') || '',
        photo: this.extractField(block, 'Photo'),
        social: {
          twitter: this.extractField(block, 'Twitter'),
          linkedin: this.extractField(block, 'LinkedIn'),
          website: this.extractField(block, 'Website')
        }
      };

      // Remove empty social fields
      if (!speaker.social?.twitter && !speaker.social?.linkedin && !speaker.social?.website) {
        delete speaker.social;
      }

      if (speaker.name) {
        speakers.push(speaker);
      }
    }

    return speakers;
  }

  private static parseAgenda(description: string): AgendaItem[] {
    const agenda: AgendaItem[] = [];
    const agendaSection = this.extractSection(description, 'Agenda');

    if (!agendaSection) return agenda;

    // Split by --- or lines starting with **
    const lines = agendaSection.split('\n');
    let currentItem: AgendaItem | null = null;

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed === '---') {
        if (currentItem) {
          agenda.push(currentItem);
          currentItem = null;
        }
        continue;
      }

      // Check if line starts with time (e.g., **6:00 PM** - Title)
      const timeMatch = trimmed.match(/^\*\*([^*]+)\*\*\s*[-–—]\s*(.+)$/);
      if (timeMatch) {
        if (currentItem) {
          agenda.push(currentItem);
        }
        currentItem = {
          time: timeMatch[1].trim(),
          title: timeMatch[2].trim(),
          description: ''
        };
      } else if (currentItem && trimmed && !trimmed.startsWith('**')) {
        // Description line for current item
        currentItem.description = currentItem.description
          ? currentItem.description + ' ' + trimmed
          : trimmed;
      }
    }

    // Add last item
    if (currentItem) {
      agenda.push(currentItem);
    }

    // Clean up empty descriptions
    return agenda.map(item => ({
      ...item,
      description: item.description?.trim() || undefined
    }));
  }

  private static parseResources(description: string): Resource[] {
    const resources: Resource[] = [];
    const resourcesSection = this.extractSection(description, 'Resources');

    if (!resourcesSection) return resources;

    const lines = resourcesSection.split('\n');

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed === '---') continue;

      // Match markdown link: [Title](url) - type
      const match = trimmed.match(/\[([^\]]+)\]\(([^)]+)\)\s*[-–—]\s*(slide|code|article|video)/);
      if (match) {
        resources.push({
          title: match[1].trim(),
          url: match[2].trim(),
          type: match[3].trim() as 'slide' | 'code' | 'article' | 'video'
        });
      }
    }

    return resources;
  }

  private static parseLogistics(description: string, field: string): string | undefined {
    const logisticsSection = this.extractSection(description, 'Logistics');
    if (!logisticsSection) return undefined;

    return this.extractField(logisticsSection, field);
  }

  private static extractSection(text: string, sectionName: string): string | null {
    const regex = new RegExp(`##\\s*${sectionName}\\s*([\\s\\S]*?)(?=##|$)`, 'i');
    const match = text.match(regex);
    return match ? match[1].trim() : null;
  }

  private static extractField(text: string, fieldName: string): string | undefined {
    const regex = new RegExp(`\\*\\*${fieldName}:\\*\\*\\s*(.+?)(?=\\n|$)`, 'i');
    const match = text.match(regex);
    return match ? match[1].trim() : undefined;
  }
}
