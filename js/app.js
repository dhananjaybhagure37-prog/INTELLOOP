/* ==========================================================================
   INTELLOOP AI INTELLIGENCE PLATFORM — MAIN APPLICATION ENTRY POINT
   Client-side SPA Router, State Coordinator, and Event Orchestrator
   ========================================================================== */

import { store } from './state/store.js';
import { agentEngine } from './engine/agentEngine.js';

// Components
import { renderSidebar } from './components/sidebar.js';
import { renderHeader } from './components/header.js';
import { renderTaskModal, bindTaskModalEvents } from './components/taskModal.js';
import { renderGlobalSearchModal, bindGlobalSearchEvents } from './components/globalSearch.js';
import { renderNotificationDrawer, bindNotificationEvents } from './components/notificationDrawer.js';
import { toast } from './components/toast.js';

// Views
import { renderDashboardView, bindDashboardEvents } from './views/dashboardView.js';
import { renderExecutionView, bindExecutionEvents } from './views/executionView.js';
import { renderResultView, bindResultEvents } from './views/resultView.js';
import { renderAgentsView, bindAgentsEvents } from './views/agentsView.js';
import { renderToolsView, bindToolsEvents } from './views/toolsView.js';
import { renderHistoryView, bindHistoryEvents } from './views/historyView.js';
import { renderKnowledgeView, bindKnowledgeEvents } from './views/knowledgeView.js';
import { renderLogsView, bindLogsEvents } from './views/logsView.js';
import { renderEvaluationsView, bindEvaluationsEvents } from './views/evaluationsView.js';
import { renderObservabilityView, bindObservabilityEvents } from './views/observabilityView.js';
import { renderAnalyticsView, bindAnalyticsEvents } from './views/analyticsView.js';
import { renderSettingsView, bindSettingsEvents } from './views/settingsView.js';

class Application {
  constructor() {
    this.appRoot = document.getElementById('app');
    this.currentRoute = 'dashboard';
    this.currentParams = {};
  }

  init() {
    this.renderLayout();
    this.setupRouting();
    this.setupGlobalEvents();
    this.setupStoreSubscription();
    this.handleRoute();

    console.log('%c INTELLOOP AI PLATFORM INITIALIZED ', 'background: #002e6a; color: #adc6ff; font-weight: bold; padding: 4px 8px; border-radius: 4px;');
  }

  renderLayout() {
    this.appRoot.innerHTML = `
      <div class="min-h-screen bg-background font-body-md text-on-surface antialiased flex flex-col">
        <!-- Sidebar Container -->
        <div id="sidebar-mount"></div>

        <!-- Main Content Area -->
        <div class="pl-72 flex flex-col min-h-screen">
          <!-- Header Container -->
          <div id="header-mount"></div>

          <!-- Main View Container -->
          <main id="view-mount" class="flex-1 bg-surface p-6 lg:p-8"></main>
        </div>

        <!-- Modals & Overlays Container -->
        <div id="modals-mount"></div>
        <div id="toast-container"></div>
      </div>
    `;

    this.updateChrome();
    this.renderModals();
  }

  updateChrome() {
    const sidebarMount = document.getElementById('sidebar-mount');
    const headerMount = document.getElementById('header-mount');

    if (sidebarMount) {
      sidebarMount.innerHTML = renderSidebar(this.currentRoute);
      this.bindSidebarEvents();
    }

    if (headerMount) {
      headerMount.innerHTML = renderHeader();
      this.bindHeaderEvents();
    }
  }

  renderModals() {
    const modalsMount = document.getElementById('modals-mount');
    if (modalsMount) {
      modalsMount.innerHTML = `
        ${renderTaskModal()}
        ${renderGlobalSearchModal()}
        ${renderNotificationDrawer()}
      `;

      bindTaskModalEvents();
      bindGlobalSearchEvents();
      bindNotificationEvents();
    }
  }

  bindSidebarEvents() {
    const closeBtn = document.getElementById('close-mobile-sidebar');
    const sidebar = document.getElementById('app-sidebar');

    if (closeBtn && sidebar) {
      closeBtn.onclick = () => {
        sidebar.classList.remove('mobile-open');
      };
    }
  }

  bindHeaderEvents() {
    const openBtn = document.getElementById('open-mobile-sidebar');
    const sidebar = document.getElementById('app-sidebar');
    const deployBtn = document.getElementById('deploy-agent-modal-btn');

    if (openBtn && sidebar) {
      openBtn.onclick = () => {
        sidebar.classList.add('mobile-open');
      };
    }

    if (deployBtn) {
      deployBtn.onclick = () => {
        const modal = document.getElementById('new-task-modal');
        if (modal) modal.classList.add('open');
      };
    }
  }

  setupRouting() {
    window.addEventListener('hashchange', () => this.handleRoute());
  }

  parseHash() {
    const hash = window.location.hash.slice(1) || 'dashboard';
    const [routePart, queryPart] = hash.split('?');
    const params = {};

    if (queryPart) {
      const searchParams = new URLSearchParams(queryPart);
      for (const [key, value] of searchParams.entries()) {
        params[key] = value;
      }
    }

    return { route: routePart, params };
  }

  handleRoute() {
    const { route, params } = this.parseHash();
    this.currentRoute = route;
    this.currentParams = params;

    const viewMount = document.getElementById('view-mount');
    if (!viewMount) return;

    this.updateChrome();

    // Scroll to top
    window.scrollTo(0, 0);

    // Route dispatch
    switch (route) {
      case 'dashboard':
        viewMount.innerHTML = renderDashboardView();
        bindDashboardEvents();
        break;

      case 'new-mission':
        viewMount.innerHTML = renderDashboardView();
        bindDashboardEvents();
        const modal = document.getElementById('new-task-modal');
        if (modal) modal.classList.add('open');
        break;

      case 'execution':
        const execMissionId = params.id || store.getState().selectedMissionId || store.getState().missions[0]?.id;
        viewMount.innerHTML = renderExecutionView(execMissionId);
        bindExecutionEvents(execMissionId);
        break;

      case 'result':
        const resMissionId = params.id || store.getState().selectedMissionId || store.getState().missions[0]?.id;
        viewMount.innerHTML = renderResultView(resMissionId);
        bindResultEvents(resMissionId);
        break;

      case 'active-agents':
        viewMount.innerHTML = renderAgentsView();
        bindAgentsEvents();
        break;

      case 'tool-library':
        viewMount.innerHTML = renderToolsView();
        bindToolsEvents();
        break;

      case 'research-history':
        viewMount.innerHTML = renderHistoryView();
        bindHistoryEvents();
        break;

      case 'knowledge-base':
        viewMount.innerHTML = renderKnowledgeView();
        bindKnowledgeEvents();
        break;

      case 'activity-logs':
        viewMount.innerHTML = renderLogsView();
        bindLogsEvents();
        break;

      case 'evaluations':
        viewMount.innerHTML = renderEvaluationsView();
        bindEvaluationsEvents();
        break;

      case 'observability':
        viewMount.innerHTML = renderObservabilityView();
        bindObservabilityEvents();
        break;

      case 'analytics':
        viewMount.innerHTML = renderAnalyticsView();
        bindAnalyticsEvents();
        break;

      case 'settings':
        viewMount.innerHTML = renderSettingsView();
        bindSettingsEvents();
        break;

      default:
        viewMount.innerHTML = renderDashboardView();
        bindDashboardEvents();
        break;
    }
  }

  setupGlobalEvents() {
    // Hotkey 'N' for new task (when not in input)
    window.addEventListener('keydown', (e) => {
      const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
      if (activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select') return;

      if (e.key.toLowerCase() === 'n' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        const modal = document.getElementById('new-task-modal');
        if (modal) modal.classList.add('open');
      }
    });
  }

  setupStoreSubscription() {
    store.subscribe((state, event, payload) => {
      // Re-render if execution or result view is currently active and mission changed
      if (this.currentRoute === 'execution' && (event === 'MISSION_UPDATED' || event === 'STEP_ADDED' || event === 'MISSION_COMPLETED')) {
        const viewMount = document.getElementById('view-mount');
        const missionId = this.currentParams.id || state.selectedMissionId;
        if (viewMount && (!payload || payload.id === missionId || payload.missionId === missionId)) {
          viewMount.innerHTML = renderExecutionView(missionId);
          bindExecutionEvents(missionId);
        }
      }

      // Update header status
      const headerMount = document.getElementById('header-mount');
      if (headerMount) {
        headerMount.innerHTML = renderHeader();
        this.bindHeaderEvents();
      }
    });
  }
}

// Boot application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const app = new Application();
  app.init();
});
