# AI Meetup Website - Project Parameters

## Project Metadata
- **Project Name**: AI Meetup Website
- **Purpose**: Dual-purpose site serving as both a functional meetup schedule and a live demonstration of Claude Code CLI capabilities
- **Status**: Initial Build
- **Demo Date**: Next monthly meetup (2026)
- **Location**: Portland, Oregon

## Stakeholder Information
- **Owner/Developer**: Matt Fullerton
- **Audience**: AI enthusiasts, developers, and curious community members
- **Demo Audience**: Meetup attendees watching live CLI development

## Technical Architecture

### Technology Decisions & Rationale

| Component | Choice | Rationale |
|-----------|--------|-----------|
| Frontend Framework | HTML5 + HTMX | No JavaScript requirement; HTMX provides interactivity via HTML attributes |
| Web Server | nginx | Lightweight, performant, excellent for static sites |
| Containerization | Docker Compose | Easy orchestration, environment consistency, network isolation |
| Reverse Proxy | Cloudflare Tunnel | Privacy protection, no port exposure, built-in DDoS/SSL |
| Design System | frontend-design skill | Distinctive, production-grade UI that avoids generic AI aesthetics |
| Server OS | Ubuntu Server 22.04 | Already deployed, stable LTS release |
| Domain Registrar | Porkbun.com | Already owned |

### Architecture Diagram

```
Internet
    ↓
Cloudflare Network (DDoS, SSL/TLS, CDN)
    ↓
Cloudflare Tunnel (encrypted tunnel)
    ↓
Ubuntu Server (localhost:8080)
    ↓
Docker Network: web_public
    ↓
nginx Container
    ↓
Static HTML/CSS Files (volume mounted from host)
```

### Network Topology

```
Docker Networks:
├── web_public (bridge)
│   └── nginx container (no host port exposure)
└── internal (bridge, for future services)
    └── (reserved for future backend services)
```

### Security Layers

1. **Cloudflare Protection**: DDoS mitigation, bot detection, SSL/TLS termination
2. **Tunnel Encryption**: All traffic encrypted through Cloudflare Tunnel
3. **No Direct Exposure**: Zero ports exposed on public internet
4. **Network Isolation**: Docker networks separate public-facing from internal services
5. **Container Isolation**: nginx runs as non-root user in isolated container
6. **Host Firewall**: Recommend UFW configuration (optional, Cloudflare Tunnel makes this redundant)

## Content Strategy

### Initial Content Scope
- **Single Page Application**: One-page site with sections
- **Primary Content**: 2026 monthly meetup schedule (12 entries)
- **Meeting Pattern**: Third Thursday of each month (suggested default)
- **Content Type**: Placeholder topics demonstrating realistic meetup themes

### Sample Topic Categories (for placeholder generation)
- Foundational Concepts (intro to LLMs, prompt engineering basics)
- Technical Deep Dives (fine-tuning, RAG systems, embeddings)
- Practical Applications (Claude Code, AI for specific industries)
- Ethics & Safety (alignment, bias, responsible AI)
- Hands-On Workshops (prompt engineering, tool building)
- Guest Speakers (industry professionals, researchers)
- Community Showcases (member projects, use cases)

### Content Management Approach
- Direct HTML editing (no CMS)
- Files stored in `./html` directory
- Version controlled via git (recommended)
- Simple nginx reload after edits
- Future: Could add markdown → HTML conversion workflow

## Design Specifications

### Brand Guidelines (To Be Established)
- **Color Palette**: TBD - should be established during frontend-design skill application
- **Typography**: Modern, readable web fonts
- **Tone**: Welcoming, educational, community-focused
- **Accessibility**: WCAG 2.1 AA compliance minimum

### Responsive Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

### Key UI Components
1. **Header**: Prominent meetup branding
2. **Schedule Cards/List**: Clear visual hierarchy for dates and topics
3. **Topic Details**: Expandable/collapsible using HTMX
4. **CTA Elements**: Join/RSVP buttons (placeholder for now)
5. **Footer**: Minimal contact/social links

## Development Workflow

### Phase 1: Initial Setup (Live Demo)
1. Verify Docker Compose installation
2. Create project directory structure
3. Generate docker-compose.yml
4. Generate nginx.conf
5. Generate index.html
6. Start containers
7. Configure Cloudflare Tunnel
8. Test live site

### Phase 2: Post-Demo Refinement
1. Gather feedback from demo
2. Refine design based on frontend-design skill
3. Add real meetup content
4. Optimize mobile experience
5. Add analytics (privacy-respecting)

### Phase 3: Future Enhancements
1. Add RSVP functionality (requires backend)
2. Add past meetup archive
3. Add photo gallery
4. Add resource library
5. Add email newsletter signup

## File Structure

```
ai-meetup-website/
├── CLAUDE.md                 # Instructions for Claude Code
├── PROJECT.md                # This file - project parameters
├── README.md                 # User-facing documentation
├── docker-compose.yml        # Container orchestration
├── nginx/
│   └── nginx.conf           # Web server configuration
├── html/
│   ├── index.html           # Main page
│   ├── styles.css           # Stylesheet (optional, can be inline)
│   └── topics/              # HTMX partial HTML files
│       ├── january.html
│       ├── february.html
│       └── ...
├── cloudflare/
│   └── config.yml           # Cloudflare Tunnel config (reference)
└── docs/
    └── deployment.md        # Deployment procedures
```

## Deployment Environment

### Server Specifications
- **OS**: Ubuntu Server 22.04 LTS
- **Architecture**: x86_64 (assumed)
- **Docker**: Installed (to be verified)
- **Network**: Tailscale + Cloudflare Tunnel
- **Access**: SSH (existing secure setup)

### Domain Configuration
- **Registrar**: Porkbun.com
- **DNS**: Managed by Cloudflare
- **Status**: Domain registered, needs Cloudflare nameserver configuration

### Cloudflare Setup Status
- [x] Domain added to Cloudflare account
- [x] Nameservers updated at Porkbun
- [x] DNS propagation verified
- [x] `cloudflared` installed on server (version 2026.1.1)
- [x] Tunnel `hr-ai-sites` created (ID: e3848467-6bf1-42e6-a94f-3c856b179897)
- [x] Tunnel routed to domains
- [x] Tunnel running as systemd service

**Current Tunnel Configuration:**
- Tunnel Name: `hr-ai-sites`
- Tunnel ID: `e3848467-6bf1-42e6-a94f-3c856b179897`
- Config File: `/etc/cloudflared/config.yml`
- Credentials: `/home/m4tt/.cloudflared/e3848467-6bf1-42e6-a94f-3c856b179897.json`
- Service Status: Active and running
- Connections: 4 active (2xpdx02, 2xsea01)

## Testing Strategy

### Pre-Launch Testing
- [ ] Local container build and startup
- [ ] nginx serves HTML correctly
- [ ] HTMX interactions function properly
- [ ] Mobile responsive design verified
- [ ] Cloudflare Tunnel connectivity
- [ ] SSL/TLS certificate issued
- [ ] Page load performance acceptable

### Browser Compatibility
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

### Performance Targets
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 2.5s
- **Lighthouse Score**: > 90 (Performance, Accessibility, Best Practices)

## Constraints & Requirements

### Hard Requirements
- ✅ No JavaScript (HTMX only)
- ✅ Docker Compose deployment
- ✅ Network isolation (web_public vs internal)
- ✅ Cloudflare Tunnel (no direct port exposure)
- ✅ nginx web server
- ✅ HTML editing workflow

### Nice-to-Have
- Git version control
- Automated backups of HTML content
- Staging environment
- Analytics integration (privacy-respecting)
- Automated SSL certificate renewal (handled by Cloudflare)

## Success Metrics

### Technical Success
- Site loads successfully via custom domain
- No security vulnerabilities in initial scan
- All HTMX interactions work as expected
- Mobile-responsive across tested devices
- Docker containers remain stable over 30 days

### Demo Success
- Successfully builds working site during live presentation
- Demonstrates Claude Code CLI capabilities effectively
- Attendees can access live site during demo
- Clear separation between development steps shown to audience

### User Success
- Meetup attendees can easily find schedule information
- Topic details are clear and scannable
- Site loads quickly on mobile devices
- Contact/participation information is accessible

## Risk Management

### Identified Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Live demo technical failure | High | Pre-test all commands, have backup plan |
| Cloudflare Tunnel configuration issues | Medium | Configure before demo, verify thoroughly |
| Docker not installed/misconfigured | Medium | Verify installation before demo day |
| Domain DNS propagation delay | Low | Configure DNS well before demo |
| HTMX learning curve | Low | Keep interactions simple initially |

### Backup Plans
- **Demo Failure**: Have pre-recorded demo available
- **Tunnel Issues**: Temporarily use local port + ngrok
- **Docker Issues**: Have Docker installation script ready
- **Content Issues**: Use AI-generated placeholder content

## Maintenance Plan

### Regular Maintenance (Monthly)
- Review and update meetup schedule
- Update Docker images for security patches
- Review Cloudflare Tunnel logs
- Test site functionality across devices

### Quarterly Reviews
- Analyze usage patterns (if analytics added)
- Gather user feedback
- Review security posture
- Consider feature enhancements

### Annual Updates
- Major content refresh
- Design refresh consideration
- Technology stack review
- Archive old meetup information

## Contact & Support

### Project Owner
- **Name**: Matt Fullerton
- **Role**: Meetup Organizer

### Technical Resources
- Claude Code (CLI development assistant)
- Docker Documentation: https://docs.docker.com/
- nginx Documentation: https://nginx.org/en/docs/
- HTMX Documentation: https://htmx.org/docs/
- Cloudflare Tunnel Docs: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-01-23 | Initial project parameters | Matt Fullerton + Claude |

## Notes for Claude Code

When working with this project:

1. **Prioritize Simplicity**: This is a demo - keep configurations clean and well-commented
2. **Explain Steps**: During live demo, provide clear explanations of what each file does
3. **Error Handling**: Build in graceful failures and helpful error messages
4. **Documentation**: Comment code thoroughly for educational value
5. **Security**: Follow security best practices even for simple static site
6. **Testing**: Provide commands to test each component independently

## Future Considerations

### Potential Backend Addition
If RSVP or dynamic content needed:
- Add separate service to `docker-compose.yml`
- Connect to `internal` network only
- nginx proxy_pass to backend
- Consider: Go, Python/Flask, or Node.js with Deno

### Content Management
Future options:
- Static site generator (Hugo, Jekyll)
- Headless CMS (Strapi, Ghost)
- Markdown files + build process
- Stay with direct HTML editing

### Analytics
Privacy-respecting options:
- Plausible (self-hosted or cloud)
- Umami (self-hosted)
- Simple access log analysis
- Cloudflare Analytics (built-in)

---

**Last Updated**: January 23, 2026  
**Status**: Ready for Development  
**Next Action**: Execute CLAUDE.md instructions with Claude Code
