
import React from 'react';
import { Button } from "@/components/ui/button";
import { Settings, UserCheck } from "lucide-react";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import AdminDashboard from "@/components/admin/AdminDashboard";
import WorkerDashboard from "@/components/worker/WorkerDashboard";

const MainApp = () => {
  const { user, switchRole, logout } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please log in to continue</h1>
          <p className="text-muted-foreground">You need to connect to Supabase for authentication</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">DB</span>
                </div>
                <h1 className="text-xl font-bold text-slate-900">Data Bridge</h1>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <UserCheck className="w-4 h-4" />
                <span className="capitalize">{user.role}</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* Demo role switcher */}
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => switchRole(user.role === 'admin' ? 'worker' : 'admin')}
              >
                Switch to {user.role === 'admin' ? 'Worker' : 'Admin'}
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button variant="outline" size="sm" onClick={logout}>
                Logout
              </Button>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {user.role === 'admin' ? <AdminDashboard /> : <WorkerDashboard />}
      </div>
    </div>
  );
};

const Index = () => {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
};

export default Index;
