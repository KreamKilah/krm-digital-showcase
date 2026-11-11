BEGIN;
CREATE TABLE IF NOT EXISTS mfa_factors(
 user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
 secret_ciphertext TEXT NOT NULL,
 enabled BOOLEAN NOT NULL DEFAULT FALSE,
 last_time_step BIGINT NOT NULL DEFAULT -1,
 created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
 enabled_at TIMESTAMPTZ
);
CREATE TABLE IF NOT EXISTS mfa_recovery_codes(
 user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 code_hash CHAR(64) NOT NULL,
 created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
 PRIMARY KEY(user_id,code_hash)
);
CREATE TABLE IF NOT EXISTS mfa_challenges(
 token_hash CHAR(64) PRIMARY KEY,
 user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 attempts INTEGER NOT NULL DEFAULT 0 CHECK(attempts BETWEEN 0 AND 50),
 expires_at TIMESTAMPTZ NOT NULL,
 created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS ix_mfa_challenges_user ON mfa_challenges(user_id);
CREATE INDEX IF NOT EXISTS ix_mfa_challenges_expiry ON mfa_challenges(expires_at);
COMMIT;
