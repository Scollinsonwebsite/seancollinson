# True Colors Compatibility

A three-stage compatibility web app for two people.

1. **Initiator** answers 10 True Colors-style questions and gets a Gold/Blue/Green/Orange profile.
2. They send a one-time link. The **invitee** answers 10 counter-questions and the pair gets an initial match score.
3. If the match clears the threshold, each person answers a **50-statement portal** (one per screen, MMPI-style flow) and both receive a final compatibility score with a six-scale breakdown.

Stack: plain HTML/CSS/JS front end, PHP 8 JSON API, MySQL (SQLite for local dev). Runs on Bluehost shared hosting with no Node server.

```
public/                web root to upload
  index.html, assets/  single-page UI
  api/index.php        JSON API (create, join, invite, state, questions, submit)
  api/inc/             lib, scoring, questions.json, config (web access denied)
db/schema.sql          portable MySQL/SQLite schema
docs/                  scoring.md, deploy.md
tests/                 PHP scoring tests, API e2e, browser e2e
```

See `docs/deploy.md` to deploy and `docs/scoring.md` for how scores are computed.

## Notes
- All questions are original and True Colors-inspired. They are not copied from True Colors International materials or the MMPI, and the app is not affiliated with either.
- Intended for reflection and conversation, not clinical or legal use. Review the scoring constants before relying on the results.
- Privacy: no accounts or emails. Secrets are stored hashed; sessions are deleted after 30 days by `cleanup.php`.
