/* ==========================================================================
   INTELLOOP — DYNAMIC REASONING GRAPH COMPONENT
   Dynamic SVG reasoning map with glowing animated pulse particles & active nodes
   ========================================================================== */

export function renderReasoningGraph(activeNodeName = 'SEARCH WEB') {
  const normalizedNode = (activeNodeName || 'MISSION').toUpperCase();

  const nodes = [
    { id: 'MISSION', label: 'MISSION', x: 20, y: 130, width: 100, height: 40 },
    { id: 'PLAN', label: 'PLAN', x: 150, y: 70, width: 100, height: 40 },
    { id: 'SEARCH WEB', label: 'SEARCH WEB', x: 150, y: 190, width: 110, height: 40 },
    { id: 'OBSERVE', label: 'OBSERVE', x: 300, y: 190, width: 100, height: 40 },
    { id: 'ANALYZE', label: 'ANALYZE', x: 440, y: 130, width: 100, height: 40 },
    { id: 'VERIFY', label: 'VERIFY', x: 580, y: 130, width: 100, height: 40 }
  ];

  const nodeElements = nodes.map(n => {
    const isActive = normalizedNode.includes(n.id) || n.id.includes(normalizedNode);
    if (isActive) {
      return `
        <!-- Node ${n.label} (ACTIVE) -->
        <g transform="translate(${n.x}, ${n.y})" class="transition-all duration-500">
          <rect width="${n.width}" height="${n.height}" rx="8" fill="#002e6a" stroke="#adc6ff" stroke-width="1.5" filter="url(#glow)"/>
          <text x="${n.width / 2}" y="25" text-anchor="middle" font-family="'Hanken Grotesk', sans-serif" font-size="11" font-weight="700" fill="#adc6ff" letter-spacing="0.05em">
            ${n.label}
          </text>
        </g>
      `;
    } else {
      return `
        <!-- Node ${n.label} -->
        <g transform="translate(${n.x}, ${n.y})" class="transition-all duration-500 opacity-60 hover:opacity-100">
          <rect width="${n.width}" height="${n.height}" rx="8" fill="#151b2d" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
          <text x="${n.width / 2}" y="25" text-anchor="middle" font-family="'Hanken Grotesk', sans-serif" font-size="11" font-weight="600" fill="#c2c6d6" letter-spacing="0.05em">
            ${n.label}
          </text>
        </g>
      `;
    }
  }).join('');

  return `
    <div class="w-full h-full relative flex items-center justify-center min-h-[280px]">
      <svg class="w-full h-full drop-shadow-xl" viewBox="0 0 720 280" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#adc6ff" stop-opacity="0.2" />
            <stop offset="50%" stop-color="#adc6ff" stop-opacity="1" />
            <stop offset="100%" stop-color="#adc6ff" stop-opacity="0.2" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <!-- Connecting Paths -->
        <!-- Mission to Plan -->
        <path d="M 120 150 C 140 150, 130 90, 150 90" fill="none" stroke="rgba(140, 144, 159, 0.25)" stroke-width="2" stroke-dasharray="4 4" />
        <!-- Mission to Search Web -->
        <path d="M 120 150 C 140 150, 130 210, 150 210" fill="none" stroke="rgba(140, 144, 159, 0.25)" stroke-width="2" stroke-dasharray="4 4" />
        <!-- Plan to Search Web -->
        <path d="M 200 110 L 200 190" fill="none" stroke="rgba(140, 144, 159, 0.2)" stroke-width="1.5" stroke-dasharray="2 2" />
        <!-- Search Web to Observe -->
        <path d="M 260 210 L 300 210" fill="none" stroke="rgba(140, 144, 159, 0.25)" stroke-width="2" stroke-dasharray="4 4" />
        <!-- Observe to Analyze -->
        <path d="M 400 210 C 420 210, 420 150, 440 150" fill="none" stroke="rgba(140, 144, 159, 0.25)" stroke-width="2" stroke-dasharray="4 4" />
        <!-- Analyze to Verify -->
        <path d="M 540 150 L 580 150" fill="none" stroke="rgba(140, 144, 159, 0.25)" stroke-width="2" stroke-dasharray="4 4" />

        <!-- Animated Active Trace -->
        <path id="activeFlowPath" d="M 120 150 C 140 150, 130 210, 150 210 L 260 210 L 300 210 C 420 210, 420 150, 440 150 L 580 150" fill="none" stroke="url(#lineGrad)" stroke-width="3" />
        
        <!-- Glowing Pulse Dot along active path -->
        <circle r="4" fill="#adc6ff" filter="url(#glow)">
          <animateMotion dur="3s" repeatCount="indefinite">
            <mpath href="#activeFlowPath" />
          </animateMotion>
        </circle>

        <!-- Dynamic Nodes -->
        ${nodeElements}
      </svg>

      <!-- Map Legend Overlay -->
      <div class="absolute bottom-3 right-3 bg-surface-container-highest/85 backdrop-blur px-3 py-2 rounded-lg font-label-sm text-[11px] flex flex-col gap-1 text-on-surface-variant border border-white/5 pointer-events-none">
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-primary shadow-[0_0_6px_#adc6ff]"></span>
          <span>Active Node: <strong class="text-primary">${normalizedNode}</strong></span>
        </div>
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-outline-variant"></span>
          <span>Autonomous Loop State</span>
        </div>
      </div>
    </div>
  `;
}
