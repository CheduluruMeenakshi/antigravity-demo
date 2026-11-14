import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Leaf, LayoutDashboard, Map, PlusCircle, History, Settings, LogOut, Menu, X, ChevronDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const navLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/fields', label: 'Fields', icon: Map },
  { to: '/advisory/new', label: 'New Advisory', icon: PlusCircle },
  { to: '/history', label: 'History', icon: History },
];

export default function Navbar() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const displayName = profile?.full_name || user?.email || 'Account';

  async function handleSignOut() {
    await signOut();
    navigate('/');
  }

  const activeLinkClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? 'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-primary-50 text-primary-700'
      : 'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors';

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <NavLink to="/dashboard" className="flex items-center gap-2 flex-shrink-0">
            <Leaf className="h-7 w-7 text-primary-600" />
            <span className="text-lg font-bold text-gray-900">AgriAdvisor AI</span>
          </NavLink>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <NavLink key={to} to={to} className={activeLinkClass}>
                <Icon className="h-4 w-4" />
                {label}
              </NavLink>
            ))}
          </div>

          {/* Desktop user dropdown */}
          <div className="hidden md:flex items-center relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-sm font-semibold">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <span className="max-w-[140px] truncate">{displayName}</span>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </button>

            {dropdownOpen && (
              <>
                {/* backdrop */}
                <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-20">
                  <NavLink
                    to="/settings"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </NavLink>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={activeLinkClass}
              onClick={() => setMobileOpen(false)}
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
          <div className="border-t border-gray-100 pt-2 mt-2 space-y-1">
            <NavLink
              to="/settings"
              className={activeLinkClass}
              onClick={() => setMobileOpen(false)}
            >
              <Settings className="h-4 w-4" />
              Settings
            </NavLink>
            <button
              onClick={() => { setMobileOpen(false); handleSignOut(); }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
          <div className="border-t border-gray-100 pt-2 mt-1">
            <div className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500">
              <div className="h-7 w-7 rounded-full bg-primary-600 flex items-center justify-center text-white text-xs font-semibold">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <span className="truncate">{displayName}</span>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
