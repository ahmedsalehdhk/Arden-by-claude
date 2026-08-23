-- Adds a general display_order for the /projects listing page.
-- Separate from featured_order, which only affects the homepage.

ALTER TABLE projects ADD COLUMN display_order INTEGER NOT NULL DEFAULT 0;
CREATE INDEX projects_display_order_idx ON projects (display_order, name);

-- Seed display_order from current alphabetical order so existing sites don't change on deploy.
WITH ord AS (
  SELECT id, (ROW_NUMBER() OVER (ORDER BY name ASC) - 1)::int AS n FROM projects
)
UPDATE projects SET display_order = ord.n FROM ord WHERE projects.id = ord.id;
