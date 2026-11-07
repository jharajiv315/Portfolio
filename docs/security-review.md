# Security review — 7 November 2026

Implemented compatible dependency patches, a 5 MB per-file upload cap, basic PNG/JPEG/WebP and PDF/DOCX signature checks, password-reset throttling, trusted-proxy IP rate limiting, origin enforcement for browser writes, generic internal error responses and HTML escaping for inquiry email text. Unknown password-recovery accounts receive the same successful response wording as known accounts.

Confirmed existing administrator registration closure, password/reset-token redaction in JSON, hashed expiring reset tokens, authenticated dashboard endpoints, and public-content field whitelists. New upload regression tests cover disguised image input, valid PNG/PDF signatures and repeated file fields. Signature checks do not replace malware scanning; DOCX checks identify ZIP containers.

After compatible updates: backend 4 high audit entries (one transitive Zod chain through Blob/OIDC/CLI configuration); frontend and dashboard each 9 entries (2 high, 7 moderate). No critical entries remain. Remaining advisories include Vite/esbuild build tooling, React Router, Zod, glob/minimatch and their dependents. Audit suggests major version migrations, or a Blob downgrade, for several remaining issues. These were retained to preserve the working storage and application APIs. Counts are package audit entries, not independently proven exploitable production flaws. This review is not a penetration test or a guarantee of security.

Signed-in browser flows and physical phone testing were not performed in this review. No live password reset email or inquiry was sent.
