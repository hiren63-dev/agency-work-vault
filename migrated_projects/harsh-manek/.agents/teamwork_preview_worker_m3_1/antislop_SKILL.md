---
name: antislop
description: "Anti Slop: Rules for AI Coding Agents. The core filter. Load always to stop generic AI slop."
allowed-tools: Read Write Edit Glob Grep
trigger: always_on
---
# antislop summary
Hard Gates:
- R-02: Zero em dashes (\u2014) in any UI or text content.
- R-17: Zero numbers/statistics without real source.
- R-18: Zero fabricated testimonials or star ratings.
- R-25: High contrast text meeting WCAG AA (>= 4.5:1).
- R-36: No fabricated claims.
