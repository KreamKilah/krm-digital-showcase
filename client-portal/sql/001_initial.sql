BEGIN;
CREATE TABLE IF NOT EXISTS users (
 id UUID PRIMARY KEY, email TEXT NOT NULL UNIQUE, display_name TEXT NOT NULL,
 role TEXT NOT NULL CHECK(role IN ('admin','client')),
 password_hash TEXT NOT NULL, active BOOLEAN NOT NULL DEFAULT TRUE,
 created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
 CHECK (char_length(email)<=254), CHECK (char_length(display_name) BETWEEN 1 AND 120)
);
CREATE TABLE IF NOT EXISTS sessions (
 token_hash CHAR(64) PRIMARY KEY,
 user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 csrf_token TEXT NOT NULL,
 expires_at TIMESTAMPTZ NOT NULL,
 created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS ix_sessions_user ON sessions(user_id);
CREATE INDEX IF NOT EXISTS ix_sessions_expires ON sessions(expires_at);
CREATE TABLE IF NOT EXISTS projects (
 id UUID PRIMARY KEY,title TEXT NOT NULL,summary TEXT NOT NULL DEFAULT '',
 stage TEXT NOT NULL DEFAULT 'briefing' CHECK(stage IN ('briefing','design','development','review','delivered')),
 progress SMALLINT NOT NULL DEFAULT 0 CHECK(progress BETWEEN 0 AND 100),
 preview_url TEXT,created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS project_members (
 project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
 user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 PRIMARY KEY(project_id,user_id)
);
CREATE INDEX IF NOT EXISTS ix_members_user ON project_members(user_id);
CREATE TABLE IF NOT EXISTS milestones (
 id UUID PRIMARY KEY,project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
 title TEXT NOT NULL,status TEXT NOT NULL DEFAULT 'planned' CHECK(status IN ('planned','active','done')),
 position INTEGER NOT NULL DEFAULT 0,created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS ix_milestones_project ON milestones(project_id,position);
CREATE TABLE IF NOT EXISTS comments (
 id UUID PRIMARY KEY,project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
 author_id UUID NOT NULL REFERENCES users(id),body TEXT NOT NULL CHECK(char_length(body) BETWEEN 1 AND 2000),
 created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS ix_comments_project ON comments(project_id,created_at);
CREATE TABLE IF NOT EXISTS approvals (
 id UUID PRIMARY KEY,project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
 version_label TEXT NOT NULL,status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','approved','changes_requested')),
 requested_by UUID NOT NULL REFERENCES users(id),decided_by UUID REFERENCES users(id),
 decided_at TIMESTAMPTZ,created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS ix_approvals_project ON approvals(project_id,created_at);
CREATE TABLE IF NOT EXISTS invitations (
 token_hash CHAR(64) PRIMARY KEY,project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
 email TEXT NOT NULL,issued_by UUID NOT NULL REFERENCES users(id),
 expires_at TIMESTAMPTZ NOT NULL,accepted_at TIMESTAMPTZ,
 created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS ix_invites_project ON invitations(project_id);
CREATE TABLE IF NOT EXISTS login_failures (key TEXT NOT NULL,happened_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE INDEX IF NOT EXISTS ix_failures_key_time ON login_failures(key,happened_at);
CREATE TABLE IF NOT EXISTS audit_events (
 id UUID PRIMARY KEY,actor_id UUID REFERENCES users(id),project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
 event TEXT NOT NULL,details JSONB NOT NULL DEFAULT '{}'::jsonb,created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS ix_audit_project ON audit_events(project_id,created_at);
COMMIT;
