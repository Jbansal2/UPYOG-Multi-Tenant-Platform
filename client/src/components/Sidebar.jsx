import React from 'react';
import { Link } from 'react-router-dom'

// SVG Icons
const ChevronUpDown = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-500">
    <path d="M4.18179 6.18181C4.35753 6.00608 4.64245 6.00608 4.81819 6.18181L7.49999 8.86362L10.1818 6.18181C10.3575 6.00608 10.6424 6.00608 10.8182 6.18181C10.9939 6.35755 10.9939 6.64247 10.8182 6.81821L7.81819 9.81821C7.73379 9.9026 7.61934 9.95001 7.49999 9.95001C7.38064 9.95001 7.26618 9.9026 7.18179 9.81821L4.18179 6.81821C4.00605 6.64247 4.00605 6.35755 4.18179 6.18181Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" transform="rotate(180 7.5 7.5) translate(0,2)"></path>
    <path d="M4.18179 8.81819C4.35753 8.99392 4.64245 8.99392 4.81819 8.81819L7.49999 6.13638L10.1818 8.81819C10.3575 8.99392 10.6424 8.99392 10.8182 8.81819C10.9939 8.64245 10.9939 8.35753 10.8182 8.18179L7.81819 5.18179C7.73379 5.09739 7.61934 5.04999 7.49999 5.04999C7.38064 5.04999 7.26618 5.09739 7.18179 5.18179L4.18179 8.18179C4.00605 8.35753 4.00605 8.64245 4.18179 8.81819Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" transform="translate(0,-2)"></path>
  </svg>
);
const ChevronRight = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-400">
    <path d="M6.1584 3.13508C6.35985 2.95662 6.66436 2.97849 6.84282 3.17994L10.6928 7.52994C10.8504 7.70783 10.8504 7.97216 10.6928 8.15004L6.84282 12.5C6.66436 12.7015 6.35985 12.7233 6.1584 12.5449C5.95695 12.3664 5.93508 12.0619 6.11354 11.8604L9.43956 8.1026L9.62002 7.83999L9.43956 7.57738L6.11354 3.81958C5.93508 3.61813 5.95695 3.31362 6.1584 3.13508Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
  </svg>
);
const BoxIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
);
const BookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
);
const ChatIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
);
const SettingsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
);
const HashIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></svg>
);
const ClockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);
const MapIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21 3 6"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg>
);
const MoreIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
);

function SidebarHeader({ collapsed }) {
  return (
    <div className="p-4 py-6 sticky top-0 bg-[#fafafa] z-10 flex items-center justify-between cursor-pointer hover:bg-gray-100 transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-[10px] bg-[#1a1a1a] flex items-center justify-center text-white shadow-sm border border-gray-900">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/></svg>
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="text-[14px] font-semibold text-[#09090b] leading-tight">UPYOG</span>
            <span className="text-[12px] font-medium text-gray-500 leading-tight">Multi-Tenant Platform</span>
          </div>
        )}
      </div>
      {!collapsed && <ChevronUpDown />}
    </div>
  );
}

function MainNavItem({ icon: Icon, label, collapsed, href = '/' }) {
  return (
    <Link
      to={href}
      className="flex items-center justify-between px-3 py-2 text-[14px] font-medium text-[#09090b] hover:bg-gray-200/50 rounded-md transition-colors group"
    >
      <div className="flex items-center gap-3">
        <span className="text-gray-600 group-hover:text-black transition-colors"><Icon /></span>
        {!collapsed && label}
      </div>
      {!collapsed && <ChevronRight />}
    </Link>
  );
}

function ProjectItem({ icon: Icon, label, collapsed }) {
  return (
    <a href="#" className="flex items-center gap-3 px-3 py-2 text-[14px] font-medium text-gray-700 hover:bg-gray-200/50 hover:text-black rounded-md transition-colors group">
      <span className="text-gray-500 group-hover:text-black transition-colors"><Icon /></span>
      {!collapsed && label}
    </a>
  );
}

function SidebarContent({ collapsed, onNavigate }) {
  return (
    <div className="flex-1 overflow-y-auto px-2 py-2 scrollbar-thin scrollbar-thumb-gray-200">
      <div className="space-y-1 mb-8">
        <MainNavItem icon={BoxIcon} label="Overview" collapsed={collapsed} href="/overview" />
        <MainNavItem icon={ChatIcon} label="Chat" collapsed={collapsed} href="/chat" />
        <MainNavItem icon={SettingsIcon} label="Settings" collapsed={collapsed} href="/settings" />
      </div>
      
      
    </div>
  );
}

function SidebarFooter({ onLogout, collapsed, user }) {
  return (
    <div className="p-3 mb-2 mx-2 sticky bottom-0 bg-[#fafafa] z-10 flex items-center justify-between cursor-pointer hover:bg-gray-200/50 rounded-md transition-colors">
      <div className="flex items-center gap-3">
        {!collapsed && user ? (
          <div className="flex flex-col truncate">
            <span className="text-[14px] font-semibold text-[#09090b] leading-tight">{user.username}</span>
            {user.email ? <span className="text-[12px] font-medium text-gray-500 leading-tight truncate">{user.email}</span> : null}
          </div>
        ) : null}
      </div>
      <div className="flex items-center gap-2">
        {collapsed ? (
          <button onClick={onLogout} title="Logout" className="px-2 py-1 text-sm bg-white border border-gray-200 rounded-md hover:bg-gray-50">⎋</button>
        ) : (
          <button onClick={onLogout} className="px-3 py-1 text-sm bg-white border border-gray-200 rounded-md hover:bg-gray-50">Logout</button>
        )}
      </div>
    </div>
  );
}

export default function Sidebar({ onLogout, collapsed = false, onNavigate }) {
  return (
    <aside className={`flex flex-col border-r border-gray-200 bg-[#fafafa] h-screen shrink-0 transition-[width] duration-200 ease-in-out ${collapsed ? 'w-[72px]' : 'w-[260px]'}`}>
      <SidebarHeader collapsed={collapsed} />
      <SidebarContent collapsed={collapsed} onNavigate={onNavigate} />
      <SidebarFooter onLogout={onLogout} collapsed={collapsed} />
    </aside>
  );
}
