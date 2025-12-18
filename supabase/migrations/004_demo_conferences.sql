-- Demo data: B2B Startup, Tech, and Marketing Conferences
-- This script populates the events and event_metrics tables with realistic conference data

-- ============================================
-- EVENTS
-- ============================================

-- Web Summit (Lisbon, Portugal)
INSERT INTO events (
  name, slug, description, category, start_date, end_date, 
  location, city, country, venue, organizer_name, organizer_website, website_url, 
  is_featured, status
) VALUES (
  'Web Summit 2025',
  'web-summit-2025',
  'The world''s largest technology conference, bringing together the people and companies redefining the global tech industry. Features startups, investors, and Fortune 500 companies.',
  'Tech Conference',
  '2025-11-10',
  '2025-11-13',
  'Lisbon, Portugal',
  'Lisbon',
  'Portugal',
  'Altice Arena & FIL',
  'Web Summit',
  'https://websummit.com',
  'https://websummit.com',
  true,
  'upcoming'
);

-- SaaStr Annual (San Francisco, CA)
INSERT INTO events (
  name, slug, description, category, start_date, end_date, 
  location, city, country, venue, organizer_name, organizer_website, website_url, 
  is_featured, status
) VALUES (
  'SaaStr Annual 2025',
  'saastr-annual-2025',
  'The world''s largest B2B SaaS conference. Join 12,000+ founders, investors, and operators to learn growth strategies, customer acquisition tactics, and retention techniques.',
  'B2B SaaS Conference',
  '2025-09-10',
  '2025-09-12',
  'San Francisco, CA',
  'San Francisco',
  'United States',
  'San Jose Convention Center',
  'SaaStr',
  'https://www.saastr.com',
  'https://www.saastr.com/annual',
  true,
  'upcoming'
);

-- INBOUND (Boston, MA)
INSERT INTO events (
  name, slug, description, category, start_date, end_date, 
  location, city, country, venue, organizer_name, organizer_website, website_url, 
  is_featured, status
) VALUES (
  'INBOUND 2025',
  'inbound-2025',
  'HubSpot''s annual conference for marketing, sales, and customer success professionals. Features high-energy sessions on inbound marketing, automation, and customer experience.',
  'Marketing Conference',
  '2025-09-18',
  '2025-09-21',
  'Boston, MA',
  'Boston',
  'United States',
  'Boston Convention & Exhibition Center',
  'HubSpot',
  'https://www.hubspot.com',
  'https://www.inbound.com',
  true,
  'upcoming'
);

-- TechCrunch Disrupt (San Francisco, CA)
INSERT INTO events (
  name, slug, description, category, start_date, end_date, 
  location, city, country, venue, organizer_name, organizer_website, website_url, 
  is_featured, status
) VALUES (
  'TechCrunch Disrupt 2025',
  'techcrunch-disrupt-2025',
  'The premier startup conference featuring Startup Battlefield, expert speakers, and networking opportunities. Brings together 10,000+ tech leaders, investors, and startup experts.',
  'Startup Conference',
  '2025-10-27',
  '2025-10-29',
  'San Francisco, CA',
  'San Francisco',
  'United States',
  'Moscone West',
  'TechCrunch',
  'https://techcrunch.com',
  'https://techcrunch.com/events/disrupt-2025',
  true,
  'upcoming'
);

-- SXSW Tech (Austin, TX)
INSERT INTO events (
  name, slug, description, category, start_date, end_date, 
  location, city, country, venue, organizer_name, organizer_website, website_url, 
  is_featured, status
) VALUES (
  'SXSW Tech 2025',
  'sxsw-tech-2025',
  'South by Southwest Technology conference celebrating the convergence of interactive, film, and music industries. Focuses on innovations and startups with 72,000+ attendees.',
  'Tech Conference',
  '2025-03-07',
  '2025-03-15',
  'Austin, TX',
  'Austin',
  'United States',
  'Austin Convention Center',
  'SXSW',
  'https://www.sxsw.com',
  'https://www.sxsw.com',
  true,
  'upcoming'
);

-- Content Marketing World (Washington, D.C.)
INSERT INTO events (
  name, slug, description, category, start_date, end_date, 
  location, city, country, venue, organizer_name, organizer_website, website_url, 
  is_featured, status
) VALUES (
  'Content Marketing World 2025',
  'content-marketing-world-2025',
  'The largest content marketing event featuring sessions on storytelling, SEO, and content strategies. Learn from top content marketers and get fresh ideas for your campaigns.',
  'Marketing Conference',
  '2025-10-13',
  '2025-10-16',
  'Washington, D.C.',
  'Washington',
  'United States',
  'Walter E. Washington Convention Center',
  'Content Marketing Institute',
  'https://contentmarketinginstitute.com',
  'https://www.contentmarketingworld.com',
  false,
  'upcoming'
);

-- B2B Marketing Exchange (Scottsdale, AZ)
INSERT INTO events (
  name, slug, description, category, start_date, end_date, 
  location, city, country, venue, organizer_name, organizer_website, website_url, 
  is_featured, status
) VALUES (
  'B2B Marketing Exchange 2025',
  'b2b-marketing-exchange-2025',
  'In-depth workshops and case studies across six tracks with over 100 speakers and 70 sessions. Features the "Killer Content Awards" recognizing outstanding B2B marketers.',
  'B2B Marketing Conference',
  '2025-02-24',
  '2025-02-26',
  'Scottsdale, AZ',
  'Scottsdale',
  'United States',
  'Hyatt Regency Scottsdale',
  'Demand Gen Report',
  'https://www.demandgenreport.com',
  'https://www.b2bmarketingexchange.com',
  false,
  'upcoming'
);

-- OMR Festival (Hamburg, Germany)
INSERT INTO events (
  name, slug, description, category, start_date, end_date, 
  location, city, country, venue, organizer_name, organizer_website, website_url, 
  is_featured, status
) VALUES (
  'OMR Festival 2025',
  'omr-festival-2025',
  'One of the world''s largest events for digital marketing and technology. Features an expo and conference with diverse speakers and musical performances.',
  'Digital Marketing Conference',
  '2025-05-06',
  '2025-05-07',
  'Hamburg, Germany',
  'Hamburg',
  'Germany',
  'Hamburg Messe',
  'OMR',
  'https://omr.com',
  'https://omr.com/festival',
  false,
  'upcoming'
);

-- B2B Marketing Expo (London, UK)
INSERT INTO events (
  name, slug, description, category, start_date, end_date, 
  location, city, country, venue, organizer_name, organizer_website, website_url, 
  is_featured, status
) VALUES (
  'B2B Marketing Expo London 2025',
  'b2b-marketing-expo-london-2025',
  'Covers everything a marketing professional needs to advance their business and career. Features 5,000+ attendees, hundreds of suppliers, and expert speakers.',
  'B2B Marketing Conference',
  '2025-05-07',
  '2025-05-08',
  'London, UK',
  'London',
  'United Kingdom',
  'ExCeL London',
  'B2B Marketing',
  'https://www.b2bmarketing.net',
  'https://www.b2bmarketingexpo.co.uk',
  false,
  'upcoming'
);

-- Startup Grind Global Conference (Redwood City, CA)
INSERT INTO events (
  name, slug, description, category, start_date, end_date, 
  location, city, country, venue, organizer_name, organizer_website, website_url, 
  is_featured, status
) VALUES (
  'Startup Grind Global Conference 2025',
  'startup-grind-global-2025',
  'The world''s largest community of startups, founders, and innovators. Features networking, workshops, and talks from successful entrepreneurs and investors.',
  'Startup Conference',
  '2025-02-25',
  '2025-02-27',
  'Redwood City, CA',
  'Redwood City',
  'United States',
  'Fox Theatre',
  'Startup Grind',
  'https://www.startupgrind.com',
  'https://www.startupgrind.com/global',
  false,
  'upcoming'
);

-- Revenue Summit (San Francisco, CA)
INSERT INTO events (
  name, slug, description, category, start_date, end_date, 
  location, city, country, venue, organizer_name, organizer_website, website_url, 
  is_featured, status
) VALUES (
  'Revenue Summit 2025',
  'revenue-summit-2025',
  'The premier event for revenue operations, sales, and marketing leaders. Learn about revenue optimization, sales enablement, and go-to-market strategies.',
  'B2B Revenue Conference',
  '2025-06-10',
  '2025-06-12',
  'San Francisco, CA',
  'San Francisco',
  'United States',
  'Palace of Fine Arts',
  'Revenue.io',
  'https://www.revenue.io',
  'https://www.revenuesummit.com',
  false,
  'upcoming'
);

-- ProductCon (Los Angeles, CA)
INSERT INTO events (
  name, slug, description, category, start_date, end_date, 
  location, city, country, venue, organizer_name, organizer_website, website_url, 
  is_featured, status
) VALUES (
  'ProductCon Los Angeles 2025',
  'productcon-la-2025',
  'The largest product management conference series. Features talks from product leaders at top tech companies, workshops, and networking opportunities.',
  'Product Conference',
  '2025-04-15',
  '2025-04-16',
  'Los Angeles, CA',
  'Los Angeles',
  'United States',
  'Los Angeles Convention Center',
  'Product School',
  'https://www.productschool.com',
  'https://www.productcon.com',
  false,
  'upcoming'
);

-- Marketing Nation Summit (Las Vegas, NV)
INSERT INTO events (
  name, slug, description, category, start_date, end_date, 
  location, city, country, venue, organizer_name, organizer_website, website_url, 
  is_featured, status
) VALUES (
  'Marketing Nation Summit 2025',
  'marketing-nation-summit-2025',
  'The premier marketing automation and account-based marketing conference. Learn from Marketo experts and industry leaders about marketing technology and strategy.',
  'Marketing Automation Conference',
  '2025-05-19',
  '2025-05-22',
  'Las Vegas, NV',
  'Las Vegas',
  'United States',
  'MGM Grand',
  'Adobe',
  'https://www.adobe.com',
  'https://www.marketingnationsummit.com',
  false,
  'upcoming'
);

-- Collision (Toronto, Canada) - Past event
INSERT INTO events (
  name, slug, description, category, start_date, end_date, 
  location, city, country, venue, organizer_name, organizer_website, website_url, 
  is_featured, status
) VALUES (
  'Collision 2024',
  'collision-2024',
  'North America''s fastest-growing tech conference. Brought together startups, investors, and tech leaders for networking, talks, and startup competitions.',
  'Tech Conference',
  '2024-06-17',
  '2024-06-20',
  'Toronto, Canada',
  'Toronto',
  'Canada',
  'Enercare Centre',
  'Collision',
  'https://collisionconf.com',
  'https://collisionconf.com',
  false,
  'past'
);

-- Dreamforce (San Francisco, CA)
INSERT INTO events (
  name, slug, description, category, start_date, end_date, 
  location, city, country, venue, organizer_name, organizer_website, website_url, 
  is_featured, status
) VALUES (
  'Dreamforce 2025',
  'dreamforce-2025',
  'The world''s largest software conference. Join 170,000+ attendees to learn about Salesforce, cloud computing, and customer success strategies.',
  'B2B SaaS Conference',
  '2025-09-16',
  '2025-09-19',
  'San Francisco, CA',
  'San Francisco',
  'United States',
  'Moscone Center',
  'Salesforce',
  'https://www.salesforce.com',
  'https://www.salesforce.com/dreamforce',
  true,
  'upcoming'
);

-- Startup Week (Various locations - using Denver as example)
INSERT INTO events (
  name, slug, description, category, start_date, end_date, 
  location, city, country, venue, organizer_name, organizer_website, website_url, 
  is_featured, status
) VALUES (
  'Startup Week Denver 2025',
  'startup-week-denver-2025',
  'A week-long celebration of entrepreneurship featuring workshops, networking events, and talks from local and national startup leaders.',
  'Startup Conference',
  '2025-09-22',
  '2025-09-26',
  'Denver, CO',
  'Denver',
  'United States',
  'Various Venues',
  'Startup Week',
  'https://www.startupweek.org',
  'https://denver.startupweek.org',
  false,
  'upcoming'
);

-- Growth Marketing Conference (San Francisco, CA)
INSERT INTO events (
  name, slug, description, category, start_date, end_date, 
  location, city, country, venue, organizer_name, organizer_website, website_url, 
  is_featured, status
) VALUES (
  'Growth Marketing Conference 2025',
  'growth-marketing-conference-2025',
  'The premier conference for growth marketers. Learn about growth hacking, user acquisition, retention strategies, and data-driven marketing.',
  'Growth Marketing Conference',
  '2025-07-15',
  '2025-07-17',
  'San Francisco, CA',
  'San Francisco',
  'United States',
  'Fort Mason Center',
  'Growth Marketing Conference',
  'https://www.growthmarketingconf.com',
  'https://www.growthmarketingconf.com',
  false,
  'upcoming'
);

-- ============================================
-- EVENT METRICS
-- ============================================

-- Web Summit 2024 metrics (past year for reference)
INSERT INTO event_metrics (
  event_id, year, attendance, sponsor_count, app_usage_rate, 
  estimated_sponsor_budget_min, estimated_sponsor_budget_max,
  sponsorship_tiers, audience_demographics, source
)
SELECT 
  id, 
  2024,
  70000,
  2500,
  85.5,
  50000,
  500000,
  '["Platinum", "Gold", "Silver", "Bronze", "Startup"]'::jsonb,
  '{"startups": 35, "enterprise": 25, "investors": 15, "media": 10, "government": 5, "other": 10}'::jsonb,
  'public_data'
FROM events WHERE slug = 'web-summit-2025';

-- SaaStr Annual 2024 metrics
INSERT INTO event_metrics (
  event_id, year, attendance, sponsor_count, app_usage_rate, 
  estimated_sponsor_budget_min, estimated_sponsor_budget_max,
  sponsorship_tiers, audience_demographics, source
)
SELECT 
  id, 
  2024,
  12000,
  300,
  78.2,
  25000,
  200000,
  '["Platinum", "Gold", "Silver", "Startup"]'::jsonb,
  '{"founders": 40, "investors": 20, "sales": 15, "marketing": 15, "other": 10}'::jsonb,
  'public_data'
FROM events WHERE slug = 'saastr-annual-2025';

-- INBOUND 2024 metrics
INSERT INTO event_metrics (
  event_id, year, attendance, sponsor_count, app_usage_rate, 
  estimated_sponsor_budget_min, estimated_sponsor_budget_max,
  sponsorship_tiers, audience_demographics, source
)
SELECT 
  id, 
  2024,
  11000,
  400,
  82.3,
  20000,
  150000,
  '["Platinum", "Gold", "Silver", "Bronze"]'::jsonb,
  '{"marketing": 45, "sales": 25, "customer_success": 15, "executives": 10, "other": 5}'::jsonb,
  'public_data'
FROM events WHERE slug = 'inbound-2025';

-- TechCrunch Disrupt 2024 metrics
INSERT INTO event_metrics (
  event_id, year, attendance, sponsor_count, app_usage_rate, 
  estimated_sponsor_budget_min, estimated_sponsor_budget_max,
  sponsorship_tiers, audience_demographics, source
)
SELECT 
  id, 
  2024,
  10000,
  200,
  70.5,
  30000,
  250000,
  '["Platinum", "Gold", "Silver", "Startup"]'::jsonb,
  '{"startups": 50, "investors": 25, "media": 10, "enterprise": 10, "other": 5}'::jsonb,
  'public_data'
FROM events WHERE slug = 'techcrunch-disrupt-2025';

-- SXSW Tech 2024 metrics
INSERT INTO event_metrics (
  event_id, year, attendance, sponsor_count, app_usage_rate, 
  estimated_sponsor_budget_min, estimated_sponsor_budget_max,
  sponsorship_tiers, audience_demographics, source
)
SELECT 
  id, 
  2024,
  72000,
  1500,
  75.8,
  40000,
  300000,
  '["Platinum", "Gold", "Silver", "Bronze", "Startup"]'::jsonb,
  '{"tech": 30, "music": 25, "film": 20, "startups": 15, "other": 10}'::jsonb,
  'public_data'
FROM events WHERE slug = 'sxsw-tech-2025';

-- Content Marketing World 2024 metrics
INSERT INTO event_metrics (
  event_id, year, attendance, sponsor_count, app_usage_rate, 
  estimated_sponsor_budget_min, estimated_sponsor_budget_max,
  sponsorship_tiers, audience_demographics, source
)
SELECT 
  id, 
  2024,
  5000,
  150,
  68.4,
  15000,
  100000,
  '["Platinum", "Gold", "Silver"]'::jsonb,
  '{"content_marketers": 60, "marketing_directors": 20, "agencies": 15, "other": 5}'::jsonb,
  'public_data'
FROM events WHERE slug = 'content-marketing-world-2025';

-- B2B Marketing Exchange 2024 metrics
INSERT INTO event_metrics (
  event_id, year, attendance, sponsor_count, app_usage_rate, 
  estimated_sponsor_budget_min, estimated_sponsor_budget_max,
  sponsorship_tiers, audience_demographics, source
)
SELECT 
  id, 
  2024,
  2000,
  80,
  65.2,
  10000,
  75000,
  '["Platinum", "Gold", "Silver"]'::jsonb,
  '{"b2b_marketers": 70, "marketing_directors": 20, "cmo": 5, "other": 5}'::jsonb,
  'public_data'
FROM events WHERE slug = 'b2b-marketing-exchange-2025';

-- OMR Festival 2024 metrics
INSERT INTO event_metrics (
  event_id, year, attendance, sponsor_count, app_usage_rate, 
  estimated_sponsor_budget_min, estimated_sponsor_budget_max,
  sponsorship_tiers, audience_demographics, source
)
SELECT 
  id, 
  2024,
  70000,
  800,
  80.1,
  30000,
  200000,
  '["Platinum", "Gold", "Silver", "Bronze"]'::jsonb,
  '{"digital_marketers": 50, "agencies": 25, "brands": 15, "startups": 10}'::jsonb,
  'public_data'
FROM events WHERE slug = 'omr-festival-2025';

-- B2B Marketing Expo London 2024 metrics
INSERT INTO event_metrics (
  event_id, year, attendance, sponsor_count, app_usage_rate, 
  estimated_sponsor_budget_min, estimated_sponsor_budget_max,
  sponsorship_tiers, audience_demographics, source
)
SELECT 
  id, 
  2024,
  5000,
  200,
  72.6,
  12000,
  80000,
  '["Platinum", "Gold", "Silver"]'::jsonb,
  '{"b2b_marketers": 65, "marketing_managers": 20, "cmo": 10, "other": 5}'::jsonb,
  'public_data'
FROM events WHERE slug = 'b2b-marketing-expo-london-2025';

-- Startup Grind Global 2024 metrics
INSERT INTO event_metrics (
  event_id, year, attendance, sponsor_count, app_usage_rate, 
  estimated_sponsor_budget_min, estimated_sponsor_budget_max,
  sponsorship_tiers, audience_demographics, source
)
SELECT 
  id, 
  2024,
  8000,
  120,
  73.4,
  15000,
  100000,
  '["Platinum", "Gold", "Silver", "Startup"]'::jsonb,
  '{"founders": 50, "investors": 20, "startups": 20, "other": 10}'::jsonb,
  'public_data'
FROM events WHERE slug = 'startup-grind-global-2025';

-- Revenue Summit 2024 metrics
INSERT INTO event_metrics (
  event_id, year, attendance, sponsor_count, app_usage_rate, 
  estimated_sponsor_budget_min, estimated_sponsor_budget_max,
  sponsorship_tiers, audience_demographics, source
)
SELECT 
  id, 
  2024,
  3000,
  100,
  70.8,
  18000,
  120000,
  '["Platinum", "Gold", "Silver"]'::jsonb,
  '{"revenue_ops": 40, "sales_leaders": 30, "marketing": 20, "cfo": 10}'::jsonb,
  'public_data'
FROM events WHERE slug = 'revenue-summit-2025';

-- ProductCon LA 2024 metrics
INSERT INTO event_metrics (
  event_id, year, attendance, sponsor_count, app_usage_rate, 
  estimated_sponsor_budget_min, estimated_sponsor_budget_max,
  sponsorship_tiers, audience_demographics, source
)
SELECT 
  id, 
  2024,
  4000,
  90,
  69.5,
  14000,
  90000,
  '["Platinum", "Gold", "Silver"]'::jsonb,
  '{"product_managers": 60, "product_directors": 20, "founders": 15, "other": 5}'::jsonb,
  'public_data'
FROM events WHERE slug = 'productcon-la-2025';

-- Marketing Nation Summit 2024 metrics
INSERT INTO event_metrics (
  event_id, year, attendance, sponsor_count, app_usage_rate, 
  estimated_sponsor_budget_min, estimated_sponsor_budget_max,
  sponsorship_tiers, audience_demographics, source
)
SELECT 
  id, 
  2024,
  6000,
  180,
  76.2,
  22000,
  140000,
  '["Platinum", "Gold", "Silver", "Bronze"]'::jsonb,
  '{"marketing_automation": 50, "abm": 25, "demand_gen": 15, "other": 10}'::jsonb,
  'public_data'
FROM events WHERE slug = 'marketing-nation-summit-2025';

-- Collision 2024 metrics (past event)
INSERT INTO event_metrics (
  event_id, year, attendance, sponsor_count, app_usage_rate, 
  estimated_sponsor_budget_min, estimated_sponsor_budget_max,
  sponsorship_tiers, audience_demographics, source
)
SELECT 
  id, 
  2024,
  36000,
  1200,
  77.9,
  35000,
  250000,
  '["Platinum", "Gold", "Silver", "Startup"]'::jsonb,
  '{"startups": 45, "investors": 20, "enterprise": 20, "media": 10, "other": 5}'::jsonb,
  'public_data'
FROM events WHERE slug = 'collision-2024';

-- Dreamforce 2024 metrics
INSERT INTO event_metrics (
  event_id, year, attendance, sponsor_count, app_usage_rate, 
  estimated_sponsor_budget_min, estimated_sponsor_budget_max,
  sponsorship_tiers, audience_demographics, source
)
SELECT 
  id, 
  2024,
  170000,
  3000,
  88.5,
  50000,
  500000,
  '["Platinum", "Gold", "Silver", "Bronze", "Startup"]'::jsonb,
  '{"salesforce_users": 40, "sales": 25, "marketing": 20, "it": 10, "other": 5}'::jsonb,
  'public_data'
FROM events WHERE slug = 'dreamforce-2025';

-- Startup Week Denver 2024 metrics
INSERT INTO event_metrics (
  event_id, year, attendance, sponsor_count, app_usage_rate, 
  estimated_sponsor_budget_min, estimated_sponsor_budget_max,
  sponsorship_tiers, audience_demographics, source
)
SELECT 
  id, 
  2024,
  15000,
  150,
  60.3,
  5000,
  40000,
  '["Platinum", "Gold", "Silver"]'::jsonb,
  '{"founders": 50, "startups": 30, "investors": 10, "service_providers": 10}'::jsonb,
  'public_data'
FROM events WHERE slug = 'startup-week-denver-2025';

-- Growth Marketing Conference 2024 metrics
INSERT INTO event_metrics (
  event_id, year, attendance, sponsor_count, app_usage_rate, 
  estimated_sponsor_budget_min, estimated_sponsor_budget_max,
  sponsorship_tiers, audience_demographics, source
)
SELECT 
  id, 
  2024,
  2500,
  70,
  67.1,
  12000,
  85000,
  '["Platinum", "Gold", "Silver"]'::jsonb,
  '{"growth_marketers": 55, "marketing_directors": 25, "founders": 15, "other": 5}'::jsonb,
  'public_data'
FROM events WHERE slug = 'growth-marketing-conference-2025';
