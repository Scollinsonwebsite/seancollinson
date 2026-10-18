# How scoring works

All scoring runs on the server (`public/api/inc/scoring.php`); the browser never sees the other person's answers.

## Stage 1 and 2: color profile and initial match
Each quiz question offers four answers, one per color (Gold, Blue, Green, Orange). A person's profile is the share of answers for each color (always totals 100%).

The initial match is a weighted average of a pair matrix (`PAIR_MATRIX`) using both profiles:

`match = 100 × Σ(A[i] × B[j] × matrix[i][j])`

Same-color pairs and Gold/Blue score high; Gold/Orange is the most demanding pairing (0.45). The pair passes if `match >= match_threshold` (default 65, set in `config.php`).

## Stage 3: the 50-question portal
Both people answer the same 50 statements on a 1 to 5 scale across six scales: values (9), communication (9), conflict style (9), lifestyle (8), closeness (8), money (7).

- Item similarity = `1 - |A - B| / 4`
- Scale score = mean item similarity × 100
- Portal score = mean over all 50 items
- **Final score = 0.7 × portal + 0.3 × initial match** (`portal_weight`)

Bands: 85+ Exceptional, 75+ Strong, 65+ Promising, 50+ Mixed, otherwise Challenging.

A consistency flag is raised when one answer value makes up 90% or more of either person's portal answers.

## Tuning
The matrix, threshold, weights and bands are plain constants. Review them with a qualified professional before using the results for anything beyond reflection and conversation.
