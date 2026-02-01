-- Sample Event Data for Hood River AI Collective
-- This populates the database with example extended event data

-- Note: Replace 'your_google_event_id_here' with actual Google Calendar event IDs
-- You can find these by viewing events in Google Calendar and checking the event URL

-- Insert sample event (using a placeholder ID - replace with real Google Calendar event ID)
INSERT INTO events (google_event_id, parking, accessibility)
VALUES
  ('sample_event_001',
   'Free street parking available on Oak Street and in the public lot behind the library.',
   'Venue is wheelchair accessible with an elevator. Accessible restrooms available on the first floor. ASL interpreter can be arranged with 48 hours notice.');

-- Get the event ID we just created
DO $$
DECLARE
  event_record_id INTEGER;
BEGIN
  SELECT id INTO event_record_id FROM events WHERE google_event_id = 'sample_event_001';

  -- Insert speakers
  INSERT INTO speakers (event_id, name, bio, photo, twitter, linkedin, website, display_order)
  VALUES
    (event_record_id,
     'Dr. Sarah Chen',
     'AI researcher specializing in natural language processing and ethics. Former lead scientist at a major tech company, now focusing on making AI more accessible and transparent. Published author of "AI for Humans".',
     'https://i.pravatar.cc/150?img=5',
     'sarahchen',
     'https://linkedin.com/in/sarahchen',
     'https://sarahchen.ai',
     0),
    (event_record_id,
     'Marcus Rodriguez',
     'Full-stack developer and AI enthusiast building practical applications with LLMs. Creator of several popular open-source AI tools and active contributor to the local tech community.',
     'https://i.pravatar.cc/150?img=12',
     'marcusdev',
     'https://linkedin.com/in/marcusrodriguez',
     'https://marcus.codes',
     1);

  -- Insert agenda items
  INSERT INTO agenda_items (event_id, time, title, description, display_order)
  VALUES
    (event_record_id, '6:00 PM', 'Doors Open & Networking', 'Grab a drink, meet fellow attendees, and chat about your AI projects', 0),
    (event_record_id, '6:30 PM', 'Welcome & Announcements', 'Quick intro to the meetup and upcoming events', 1),
    (event_record_id, '6:45 PM', 'Featured Talk: Building with Claude', 'Dr. Sarah Chen shares insights on effectively using Claude for real-world applications, including prompt engineering tips and practical examples', 2),
    (event_record_id, '7:30 PM', 'Lightning Demo: Local AI Tools', 'Marcus Rodriguez demonstrates running AI models locally and shares his favorite open-source tools', 3),
    (event_record_id, '7:50 PM', 'Open Discussion & Q&A', 'Community discussion, questions, and project sharing', 4),
    (event_record_id, '8:30 PM', 'Wrap Up', 'Final thoughts and post-meetup hangout coordination', 5);

  -- Insert resources
  INSERT INTO resources (event_id, title, url, type, display_order)
  VALUES
    (event_record_id, 'Slides: Building with Claude', 'https://docs.google.com/presentation/d/sample', 'slide', 0),
    (event_record_id, 'GitHub: Local AI Toolkit', 'https://github.com/example/local-ai-tools', 'code', 1),
    (event_record_id, 'Article: Prompt Engineering Guide', 'https://example.com/prompt-engineering-guide', 'article', 2),
    (event_record_id, 'Video: Previous Meetup Recording', 'https://youtube.com/watch?v=example', 'video', 3);

END $$;

-- Insert another sample event
INSERT INTO events (google_event_id, parking, accessibility)
VALUES
  ('sample_event_002',
   'Parking available in the brewery lot. Additional overflow parking at the community center (2 blocks east).',
   'Ground floor venue with ramp access. Service animals welcome. Please contact us for specific accessibility needs.');

-- Populate second event
DO $$
DECLARE
  event_record_id INTEGER;
BEGIN
  SELECT id INTO event_record_id FROM events WHERE google_event_id = 'sample_event_002';

  -- Insert speaker
  INSERT INTO speakers (event_id, name, bio, photo, twitter, linkedin, website, display_order)
  VALUES
    (event_record_id,
     'Jamie Lin',
     'Product designer exploring AI-assisted design workflows. Previously at Adobe and Figma, now consulting with startups on integrating AI into creative tools.',
     'https://i.pravatar.cc/150?img=8',
     'jamielinux',
     'https://linkedin.com/in/jamielin',
     'https://jamielin.design',
     0);

  -- Insert agenda
  INSERT INTO agenda_items (event_id, time, title, description, display_order)
  VALUES
    (event_record_id, '6:00 PM', 'Arrivals & Mingling', 'Casual networking and conversation', 0),
    (event_record_id, '6:30 PM', 'Show & Tell Session', 'Open floor for anyone to share what they''ve been building or learning', 1),
    (event_record_id, '7:15 PM', 'AI in Design: A Designer''s Perspective', 'Jamie Lin discusses how AI is changing creative workflows', 2),
    (event_record_id, '8:00 PM', 'Open Forum', 'Questions, discussions, and community connections', 3);

  -- Insert resources
  INSERT INTO resources (event_id, title, url, type, display_order)
  VALUES
    (event_record_id, 'Design Tools List', 'https://notion.so/ai-design-tools', 'article', 0),
    (event_record_id, 'Community Discord', 'https://discord.gg/hoodriverai', 'article', 1);

END $$;

-- Display summary
SELECT
  e.google_event_id,
  COUNT(DISTINCT s.id) as speaker_count,
  COUNT(DISTINCT a.id) as agenda_items,
  COUNT(DISTINCT r.id) as resources
FROM events e
LEFT JOIN speakers s ON s.event_id = e.id
LEFT JOIN agenda_items a ON a.event_id = e.id
LEFT JOIN resources r ON r.event_id = e.id
GROUP BY e.google_event_id;
