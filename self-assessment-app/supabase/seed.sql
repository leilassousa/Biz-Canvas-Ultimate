-- Insert initial categories
INSERT INTO categories (id, name, "order", created_at, updated_at)
VALUES 
  (gen_random_uuid(), 'Value Proposition', 1, NOW(), NOW()),
  (gen_random_uuid(), 'Customer Segments', 2, NOW(), NOW()),
  (gen_random_uuid(), 'Channels', 3, NOW(), NOW()),
  (gen_random_uuid(), 'Customer Relationships', 4, NOW(), NOW()),
  (gen_random_uuid(), 'Revenue Streams', 5, NOW(), NOW()),
  (gen_random_uuid(), 'Key Resources', 6, NOW(), NOW()),
  (gen_random_uuid(), 'Key Activities', 7, NOW(), NOW()),
  (gen_random_uuid(), 'Key Partnerships', 8, NOW(), NOW()),
  (gen_random_uuid(), 'Cost Structure', 9, NOW(), NOW());

-- Store category IDs in variables for reference
DO $$ 
DECLARE
    value_proposition_id UUID;
    customer_segments_id UUID;
    channels_id UUID;
    customer_relationships_id UUID;
    revenue_streams_id UUID;
    key_resources_id UUID;
    key_activities_id UUID;
    key_partnerships_id UUID;
    cost_structure_id UUID;
BEGIN
    -- Get the generated UUIDs
    SELECT id INTO value_proposition_id FROM categories WHERE name = 'Value Proposition';
    SELECT id INTO customer_segments_id FROM categories WHERE name = 'Customer Segments';
    SELECT id INTO channels_id FROM categories WHERE name = 'Channels';
    SELECT id INTO customer_relationships_id FROM categories WHERE name = 'Customer Relationships';
    SELECT id INTO revenue_streams_id FROM categories WHERE name = 'Revenue Streams';
    SELECT id INTO key_resources_id FROM categories WHERE name = 'Key Resources';
    SELECT id INTO key_activities_id FROM categories WHERE name = 'Key Activities';
    SELECT id INTO key_partnerships_id FROM categories WHERE name = 'Key Partnerships';
    SELECT id INTO cost_structure_id FROM categories WHERE name = 'Cost Structure';

    -- Insert preambles for each category
    INSERT INTO preambles (id, category_id, content, created_at, updated_at)
    VALUES
      (gen_random_uuid(), value_proposition_id, 'The Value Proposition describes the bundle of products and services that create value for a specific Customer Segment. Consider what value you deliver to the customer and which customer problems you help solve.', NOW(), NOW()),
      (gen_random_uuid(), customer_segments_id, 'The Customer Segments define the different groups of people or organizations an enterprise aims to reach and serve. Consider who your most important customers are and what their needs are.', NOW(), NOW()),
      (gen_random_uuid(), channels_id, 'Channels describe how a company communicates with and reaches its Customer Segments to deliver a Value Proposition. Think about how your customers want to be reached and which channels work best.', NOW(), NOW()),
      (gen_random_uuid(), customer_relationships_id, 'Customer Relationships describe the types of relationships a company establishes with specific Customer Segments. Consider what type of relationship each customer segment expects and how costly they are.', NOW(), NOW()),
      (gen_random_uuid(), revenue_streams_id, 'Revenue Streams represent the cash a company generates from each Customer Segment. Think about what value customers are willing to pay for and how they prefer to pay.', NOW(), NOW()),
      (gen_random_uuid(), key_resources_id, 'Key Resources describe the most important assets required to make a business model work. Consider what key resources your value proposition, distribution channels, and customer relationships require.', NOW(), NOW()),
      (gen_random_uuid(), key_activities_id, 'Key Activities describe the most important things a company must do to make its business model work. Think about what key activities your value proposition, distribution channels, and customer relationships require.', NOW(), NOW()),
      (gen_random_uuid(), key_partnerships_id, 'Key Partnerships describe the network of suppliers and partners that make the business model work. Consider who your key partners and suppliers are and what resources you acquire from them.', NOW(), NOW()),
      (gen_random_uuid(), cost_structure_id, 'The Cost Structure describes all costs incurred to operate a business model. Think about what are the most important costs in your business and which key resources and activities are most expensive.', NOW(), NOW());

    -- Insert questions for Value Proposition
    INSERT INTO questions (id, category_id, content, "order", created_at, updated_at)
    VALUES
      (gen_random_uuid(), value_proposition_id, 'What value do we deliver to the customer?', 1, NOW(), NOW()),
      (gen_random_uuid(), value_proposition_id, 'Which one of our customer''s problems are we helping to solve?', 2, NOW(), NOW()),
      (gen_random_uuid(), value_proposition_id, 'What bundles of products and services are we offering to each Customer Segment?', 3, NOW(), NOW()),
      (gen_random_uuid(), value_proposition_id, 'Which customer needs are we satisfying?', 4, NOW(), NOW());

    -- Insert questions for Customer Segments
    INSERT INTO questions (id, category_id, content, "order", created_at, updated_at)
    VALUES
      (gen_random_uuid(), customer_segments_id, 'For whom are we creating value?', 1, NOW(), NOW()),
      (gen_random_uuid(), customer_segments_id, 'Who are our most important customers?', 2, NOW(), NOW()),
      (gen_random_uuid(), customer_segments_id, 'What are the customer archetypes?', 3, NOW(), NOW());

    -- Insert questions for Channels
    INSERT INTO questions (id, category_id, content, "order", created_at, updated_at)
    VALUES
      (gen_random_uuid(), channels_id, 'Through which Channels do our Customer Segments want to be reached?', 1, NOW(), NOW()),
      (gen_random_uuid(), channels_id, 'How are we reaching them now?', 2, NOW(), NOW()),
      (gen_random_uuid(), channels_id, 'How are our Channels integrated?', 3, NOW(), NOW()),
      (gen_random_uuid(), channels_id, 'Which ones work best?', 4, NOW(), NOW()),
      (gen_random_uuid(), channels_id, 'Which ones are most cost-efficient?', 5, NOW(), NOW());

    -- Insert questions for Customer Relationships
    INSERT INTO questions (id, category_id, content, "order", created_at, updated_at)
    VALUES
      (gen_random_uuid(), customer_relationships_id, 'What type of relationship does each of our Customer Segments expect us to establish and maintain with them?', 1, NOW(), NOW()),
      (gen_random_uuid(), customer_relationships_id, 'Which ones have we established?', 2, NOW(), NOW()),
      (gen_random_uuid(), customer_relationships_id, 'How costly are they?', 3, NOW(), NOW()),
      (gen_random_uuid(), customer_relationships_id, 'How are they integrated with the rest of our business model?', 4, NOW(), NOW());

    -- Insert questions for Revenue Streams
    INSERT INTO questions (id, category_id, content, "order", created_at, updated_at)
    VALUES
      (gen_random_uuid(), revenue_streams_id, 'For what value are our customers really willing to pay?', 1, NOW(), NOW()),
      (gen_random_uuid(), revenue_streams_id, 'For what do they currently pay?', 2, NOW(), NOW()),
      (gen_random_uuid(), revenue_streams_id, 'How are they currently paying?', 3, NOW(), NOW()),
      (gen_random_uuid(), revenue_streams_id, 'How would they prefer to pay?', 4, NOW(), NOW()),
      (gen_random_uuid(), revenue_streams_id, 'How much does each Revenue Stream contribute to overall revenues?', 5, NOW(), NOW());

    -- Insert questions for Key Resources
    INSERT INTO questions (id, category_id, content, "order", created_at, updated_at)
    VALUES
      (gen_random_uuid(), key_resources_id, 'What Key Resources do our Value Propositions require?', 1, NOW(), NOW()),
      (gen_random_uuid(), key_resources_id, 'What Key Resources do our Distribution Channels require?', 2, NOW(), NOW()),
      (gen_random_uuid(), key_resources_id, 'What Key Resources do our Customer Relationships require?', 3, NOW(), NOW()),
      (gen_random_uuid(), key_resources_id, 'What Key Resources do our Revenue Streams require?', 4, NOW(), NOW());

    -- Insert questions for Key Activities
    INSERT INTO questions (id, category_id, content, "order", created_at, updated_at)
    VALUES
      (gen_random_uuid(), key_activities_id, 'What Key Activities do our Value Propositions require?', 1, NOW(), NOW()),
      (gen_random_uuid(), key_activities_id, 'What Key Activities do our Distribution Channels require?', 2, NOW(), NOW()),
      (gen_random_uuid(), key_activities_id, 'What Key Activities do our Customer Relationships require?', 3, NOW(), NOW()),
      (gen_random_uuid(), key_activities_id, 'What Key Activities do our Revenue Streams require?', 4, NOW(), NOW());

    -- Insert questions for Key Partnerships
    INSERT INTO questions (id, category_id, content, "order", created_at, updated_at)
    VALUES
      (gen_random_uuid(), key_partnerships_id, 'Who are our Key Partners?', 1, NOW(), NOW()),
      (gen_random_uuid(), key_partnerships_id, 'Who are our Key Suppliers?', 2, NOW(), NOW()),
      (gen_random_uuid(), key_partnerships_id, 'Which Key Resources are we acquiring from partners?', 3, NOW(), NOW()),
      (gen_random_uuid(), key_partnerships_id, 'Which Key Activities do partners perform?', 4, NOW(), NOW());

    -- Insert questions for Cost Structure
    INSERT INTO questions (id, category_id, content, "order", created_at, updated_at)
    VALUES
      (gen_random_uuid(), cost_structure_id, 'What are the most important costs inherent in our business model?', 1, NOW(), NOW()),
      (gen_random_uuid(), cost_structure_id, 'Which Key Resources are most expensive?', 2, NOW(), NOW()),
      (gen_random_uuid(), cost_structure_id, 'Which Key Activities are most expensive?', 3, NOW(), NOW()),
      (gen_random_uuid(), cost_structure_id, 'How does our business prioritize between fixed and variable costs?', 4, NOW(), NOW());
END $$; 