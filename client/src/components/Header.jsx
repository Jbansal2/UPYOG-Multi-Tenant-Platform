import React from 'react'

export default function Header({ title = 'Dashboard Overview', onToggleSidebar }) {
  return (
    <header className="flex items-center justify-between px-4 py-2.5 border-b border-gray-200 bg-white sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="text-gray-500 hover:text-black transition-colors rounded-md hover:bg-gray-100 p-1 cursor-pointer"
        >
          <svg width="18" height="18" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.5 3C1.22386 3 1 3.22386 1 3.5C1 3.77614 1.22386 4 1.5 4H13.5C13.7761 4 14 3.77614 14 3.5C14 3.22386 13.7761 3 13.5 3H1.5ZM1 7.5C1 7.22386 1.22386 7 1.5 7H13.5C13.7761 7 14 7.22386 14 7.5C14 7.77614 13.7761 8 13.5 8H1.5C1.22386 8 1 7.77614 1 7.5ZM1 11.5C1 11.2239 1.22386 11 1.5 11H13.5C13.7761 11 14 11.2239 14 11.5C14 11.7761 13.7761 12 13.5 12H1.5C1.22386 12 1 11.7761 1 11.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"/>
          </svg>
        </button>
        <h2 className="text-sm font-semibold text-black m-0 tracking-tight">{title}</h2>
      </div>
    </header>
  )
}