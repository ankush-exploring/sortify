# Screenshots & GIFs for README

Drop captured assets here and reference them from the root `README.md` via relative paths.

## Required captures

| # | File name | What to show | Notes |
|---|-----------|--------------|-------|
| 1 | `demo-hero.gif` | Core loop: user logs in → creates ticket → AI triages → ticket appears with priority + notes → moderator sees assigned ticket | 15-20 sec, 800px wide, show both light & dark if possible |
| 2 | `ticket-list-light.png` | User-facing ticket list (light theme) | Cards with status/priority pills, search bar, New Ticket button |
| 3 | `ticket-list-dark.png` | Same view in dark theme | |
| 4 | `ticket-detail-light.png` | Single ticket with AI analysis callout | Show the left-border callout box |
| 5 | `admin-panel-light.png` | Admin panel in light theme | Sidebar + table with checkboxes, inline edit |
| 6 | `admin-panel-dark.png` | Admin panel in dark theme | |
| 7 | `login-light.png` | Login page (light theme) | Centered card, minimal form |
| 8 | `login-dark.png` | Login page (dark theme) | |

## Tools

- **macOS**: `cmd + shift + 5` → record selected portion (saves as .mov, convert to GIF via ffmpeg or GIPHY Capture)
- **Windows**: Xbox Game Bar (`win + G`) or Screen Recorder in Snipping Tool
- **Cross-platform**: [Kap](https://getkap.co/) (macOS), [ScreenToGif](https://www.screentogif.com/) (Windows), [Peek](https://github.com/phw/peek) (Linux)

## Naming convention

- `*.png` for static screenshots
- `*.gif` for animated demos
- Prefix with what they show (e.g. `ticket-create.gif`, `admin-role-edit.png`)
- Use `-light` / `-dark` suffix for theme-matched pairs
