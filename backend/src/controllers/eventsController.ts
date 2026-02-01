import { Request, Response } from 'express';
import pool from '../config/database';

export async function getEventData(req: Request, res: Response) {
  const { googleEventId } = req.params;

  try {
    // Get event
    const eventResult = await pool.query(
      'SELECT * FROM events WHERE google_event_id = $1',
      [googleEventId]
    );

    if (eventResult.rows.length === 0) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }

    const event = eventResult.rows[0];
    const eventId = event.id;

    // Get speakers
    const speakersResult = await pool.query(
      'SELECT name, bio, photo, twitter, linkedin, website FROM speakers WHERE event_id = $1 ORDER BY display_order',
      [eventId]
    );

    // Get agenda
    const agendaResult = await pool.query(
      'SELECT time, title, description FROM agenda_items WHERE event_id = $1 ORDER BY display_order',
      [eventId]
    );

    // Get resources
    const resourcesResult = await pool.query(
      'SELECT title, url, type FROM resources WHERE event_id = $1 ORDER BY display_order',
      [eventId]
    );

    // Build response
    const response = {
      speakers: speakersResult.rows.map(row => ({
        name: row.name,
        bio: row.bio,
        photo: row.photo,
        social: {
          twitter: row.twitter,
          linkedin: row.linkedin,
          website: row.website,
        },
      })),
      agenda: agendaResult.rows,
      resources: resourcesResult.rows,
      parking: event.parking,
      accessibility: event.accessibility,
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching event data:', error);
    res.status(500).json({ error: 'Failed to fetch event data' });
  }
}
