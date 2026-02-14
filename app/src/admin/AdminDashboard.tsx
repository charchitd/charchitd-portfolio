import { useState, useEffect } from 'react';
import { useAdmin } from './AdminContext';
import { 
  FileText, 
  Briefcase, 
  Image, 
  LogOut, 
  Save,
  Plus,
  Trash2,
  Eye
} from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  tags: string[];
}

interface Experience {
  id: string;
  title: string;
  organization: string;
  location: string;
  period: string;
  description: string;
  type: 'work' | 'education' | 'research';
}

const AdminDashboard = () => {
  const { user, logout, isAuthenticated, isLoading } = useAdmin();
  const [activeTab, setActiveTab] = useState<'thoughts' | 'experience' | 'profile'>('thoughts');
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [saveMessage, setSaveMessage] = useState('');

  // Load data from localStorage on mount
  useEffect(() => {
    const savedPosts = localStorage.getItem('admin_blog_posts');
    const savedExperiences = localStorage.getItem('admin_experiences');
    
    if (savedPosts) {
      setBlogPosts(JSON.parse(savedPosts));
    }
    if (savedExperiences) {
      setExperiences(JSON.parse(savedExperiences));
    }
  }, []);

  // Save data to localStorage
  const saveBlogPosts = (posts: BlogPost[]) => {
    setBlogPosts(posts);
    localStorage.setItem('admin_blog_posts', JSON.stringify(posts));
    setSaveMessage('Changes saved successfully!');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const saveExperiences = (exps: Experience[]) => {
    setExperiences(exps);
    localStorage.setItem('admin_experiences', JSON.stringify(exps));
    setSaveMessage('Changes saved successfully!');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  // Blog post handlers
  const handleAddPost = () => {
    const newPost: BlogPost = {
      id: Date.now().toString(),
      title: 'New Post',
      excerpt: '',
      content: '',
      date: new Date().toLocaleDateString(),
      readTime: '5 min read',
      tags: []
    };
    setEditingPost(newPost);
  };

  const handleEditPost = (post: BlogPost) => {
    setEditingPost({ ...post });
  };

  const handleSavePost = () => {
    if (!editingPost) return;
    
    const existingIndex = blogPosts.findIndex(p => p.id === editingPost.id);
    let newPosts;
    
    if (existingIndex >= 0) {
      newPosts = [...blogPosts];
      newPosts[existingIndex] = editingPost;
    } else {
      newPosts = [...blogPosts, editingPost];
    }
    
    saveBlogPosts(newPosts);
    setEditingPost(null);
  };

  const handleDeletePost = (id: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      saveBlogPosts(blogPosts.filter(p => p.id !== id));
    }
  };

  // Experience handlers
  const handleAddExperience = () => {
    const newExp: Experience = {
      id: Date.now().toString(),
      title: 'New Position',
      organization: '',
      location: '',
      period: '',
      description: '',
      type: 'work'
    };
    setEditingExperience(newExp);
  };

  const handleEditExperience = (exp: Experience) => {
    setEditingExperience({ ...exp });
  };

  const handleSaveExperience = () => {
    if (!editingExperience) return;
    
    const existingIndex = experiences.findIndex(e => e.id === editingExperience.id);
    let newExps;
    
    if (existingIndex >= 0) {
      newExps = [...experiences];
      newExps[existingIndex] = editingExperience;
    } else {
      newExps = [...experiences, editingExperience];
    }
    
    saveExperiences(newExps);
    setEditingExperience(null);
  };

  const handleDeleteExperience = (id: string) => {
    if (confirm('Are you sure you want to delete this experience?')) {
      saveExperiences(experiences.filter(e => e.id !== id));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <p className="text-white/60">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    window.location.href = '/admin/login';
    return null;
  }

  return (
    <div className="min-h-screen bg-dark flex">
      {/* Sidebar */}
      <aside className="w-64 bg-dark-light border-r border-white/10 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-coral/20 flex items-center justify-center overflow-hidden">
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-coral font-bold">{user?.name?.[0]}</span>
              )}
            </div>
            <div>
              <p className="text-white font-medium text-sm">{user?.name}</p>
              <p className="text-white/40 text-xs">@{user?.login}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          <button
            onClick={() => setActiveTab('thoughts')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'thoughts' 
                ? 'bg-coral/10 text-coral' 
                : 'text-white/60 hover:bg-white/5 hover:text-white'
            }`}
          >
            <FileText className="w-5 h-5" />
            My Thoughts
          </button>
          <button
            onClick={() => setActiveTab('experience')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'experience' 
                ? 'bg-coral/10 text-coral' 
                : 'text-white/60 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Briefcase className="w-5 h-5" />
            Experience
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'profile' 
                ? 'bg-coral/10 text-coral' 
                : 'text-white/60 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Image className="w-5 h-5" />
            Profile
          </button>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/10">
          <a 
            href="/" 
            target="_blank"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white/60 hover:bg-white/5 hover:text-white transition-colors mb-2"
          >
            <Eye className="w-5 h-5" />
            View Site
          </a>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white/60 hover:bg-white/5 hover:text-coral transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {/* Top bar */}
        <header className="bg-dark-light border-b border-white/10 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-display font-bold text-xl text-white">
              {activeTab === 'thoughts' && 'My Thoughts'}
              {activeTab === 'experience' && 'Experience'}
              {activeTab === 'profile' && 'Profile Settings'}
            </h1>
            <p className="text-white/40 text-sm">
              {activeTab === 'thoughts' && 'Manage your blog posts and articles'}
              {activeTab === 'experience' && 'Update your work history and education'}
              {activeTab === 'profile' && 'Update your profile picture and information'}
            </p>
          </div>
          {saveMessage && (
            <span className="text-coral text-sm">{saveMessage}</span>
          )}
        </header>

        {/* Content */}
        <div className="p-8">
          {/* My Thoughts Tab */}
          {activeTab === 'thoughts' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-white font-semibold">All Posts ({blogPosts.length})</h2>
                <button
                  onClick={handleAddPost}
                  className="btn-primary flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add New Post
                </button>
              </div>

              {editingPost ? (
                <div className="bg-dark-light border border-white/10 rounded-xl p-6">
                  <h3 className="text-white font-semibold mb-4">
                    {blogPosts.find(p => p.id === editingPost.id) ? 'Edit Post' : 'New Post'}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-white/60 text-sm mb-2">Title</label>
                      <input
                        type="text"
                        value={editingPost.title}
                        onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-coral"
                      />
                    </div>
                    <div>
                      <label className="block text-white/60 text-sm mb-2">Excerpt</label>
                      <textarea
                        value={editingPost.excerpt}
                        onChange={(e) => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                        rows={2}
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-coral resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-white/60 text-sm mb-2">Content (Markdown)</label>
                      <textarea
                        value={editingPost.content}
                        onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                        rows={10}
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-coral resize-none font-mono text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-white/60 text-sm mb-2">Date</label>
                        <input
                          type="text"
                          value={editingPost.date}
                          onChange={(e) => setEditingPost({ ...editingPost, date: e.target.value })}
                          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-coral"
                        />
                      </div>
                      <div>
                        <label className="block text-white/60 text-sm mb-2">Read Time</label>
                        <input
                          type="text"
                          value={editingPost.readTime}
                          onChange={(e) => setEditingPost({ ...editingPost, readTime: e.target.value })}
                          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-coral"
                        />
                      </div>
                      <div>
                        <label className="block text-white/60 text-sm mb-2">Tags (comma-separated)</label>
                        <input
                          type="text"
                          value={editingPost.tags.join(', ')}
                          onChange={(e) => setEditingPost({ ...editingPost, tags: e.target.value.split(',').map(t => t.trim()) })}
                          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-coral"
                        />
                      </div>
                    </div>
                    <div className="flex gap-3 pt-4">
                      <button onClick={handleSavePost} className="btn-primary flex items-center gap-2">
                        <Save className="w-4 h-4" />
                        Save Post
                      </button>
                      <button onClick={() => setEditingPost(null)} className="btn-secondary">
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {blogPosts.length === 0 ? (
                    <p className="text-white/40 text-center py-12">No posts yet. Click "Add New Post" to create one.</p>
                  ) : (
                    blogPosts.map((post) => (
                      <div
                        key={post.id}
                        className="bg-dark-light border border-white/10 rounded-lg p-4 flex items-center justify-between hover:border-coral/50 transition-colors"
                      >
                        <div className="flex-1">
                          <h3 className="text-white font-medium">{post.title}</h3>
                          <p className="text-white/40 text-sm">{post.date} · {post.readTime}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditPost(post)}
                            className="p-2 text-white/60 hover:text-coral transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeletePost(post.id)}
                            className="p-2 text-white/60 hover:text-coral transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {/* Experience Tab */}
          {activeTab === 'experience' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-white font-semibold">All Experience ({experiences.length})</h2>
                <button
                  onClick={handleAddExperience}
                  className="btn-primary flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Experience
                </button>
              </div>

              {editingExperience ? (
                <div className="bg-dark-light border border-white/10 rounded-xl p-6">
                  <h3 className="text-white font-semibold mb-4">
                    {experiences.find(e => e.id === editingExperience.id) ? 'Edit Experience' : 'New Experience'}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-white/60 text-sm mb-2">Title</label>
                      <input
                        type="text"
                        value={editingExperience.title}
                        onChange={(e) => setEditingExperience({ ...editingExperience, title: e.target.value })}
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-coral"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-white/60 text-sm mb-2">Organization</label>
                        <input
                          type="text"
                          value={editingExperience.organization}
                          onChange={(e) => setEditingExperience({ ...editingExperience, organization: e.target.value })}
                          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-coral"
                        />
                      </div>
                      <div>
                        <label className="block text-white/60 text-sm mb-2">Location</label>
                        <input
                          type="text"
                          value={editingExperience.location}
                          onChange={(e) => setEditingExperience({ ...editingExperience, location: e.target.value })}
                          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-coral"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-white/60 text-sm mb-2">Period</label>
                        <input
                          type="text"
                          value={editingExperience.period}
                          onChange={(e) => setEditingExperience({ ...editingExperience, period: e.target.value })}
                          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-coral"
                        />
                      </div>
                      <div>
                        <label className="block text-white/60 text-sm mb-2">Type</label>
                        <select
                          value={editingExperience.type}
                          onChange={(e) => setEditingExperience({ ...editingExperience, type: e.target.value as any })}
                          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-coral"
                        >
                          <option value="work">Work</option>
                          <option value="education">Education</option>
                          <option value="research">Research</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-white/60 text-sm mb-2">Description</label>
                      <textarea
                        value={editingExperience.description}
                        onChange={(e) => setEditingExperience({ ...editingExperience, description: e.target.value })}
                        rows={4}
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-coral resize-none"
                      />
                    </div>
                    <div className="flex gap-3 pt-4">
                      <button onClick={handleSaveExperience} className="btn-primary flex items-center gap-2">
                        <Save className="w-4 h-4" />
                        Save Experience
                      </button>
                      <button onClick={() => setEditingExperience(null)} className="btn-secondary">
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {experiences.length === 0 ? (
                    <p className="text-white/40 text-center py-12">No experience entries yet. Click "Add Experience" to create one.</p>
                  ) : (
                    experiences.map((exp) => (
                      <div
                        key={exp.id}
                        className="bg-dark-light border border-white/10 rounded-lg p-4 flex items-center justify-between hover:border-coral/50 transition-colors"
                      >
                        <div className="flex-1">
                          <h3 className="text-white font-medium">{exp.title}</h3>
                          <p className="text-white/40 text-sm">{exp.organization} · {exp.period}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditExperience(exp)}
                            className="p-2 text-white/60 hover:text-coral transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteExperience(exp.id)}
                            className="p-2 text-white/60 hover:text-coral transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="max-w-2xl">
              <div className="bg-dark-light border border-white/10 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-6">Profile Settings</h3>
                
                <div className="space-y-6">
                  {/* Profile Picture */}
                  <div>
                    <label className="block text-white/60 text-sm mb-3">Profile Picture</label>
                    <div className="flex items-center gap-4">
                      <div className="w-24 h-24 rounded-xl overflow-hidden border border-white/10">
                        <img 
                          src="/images/hero_portrait.jpg" 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-white/40 text-sm mb-2">Upload a new profile picture</p>
                        <button className="btn-secondary text-sm">
                          Choose File
                        </button>
                        <p className="text-white/40 text-xs mt-1">
                          Recommended: 400x400px, JPG or PNG
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Basic Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/60 text-sm mb-2">Name</label>
                      <input
                        type="text"
                        defaultValue="Charchit Dhawan"
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-coral"
                      />
                    </div>
                    <div>
                      <label className="block text-white/60 text-sm mb-2">Title</label>
                      <input
                        type="text"
                        defaultValue="AI Researcher / PhD Applicant"
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-coral"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white/60 text-sm mb-2">Email</label>
                    <input
                      type="email"
                      defaultValue="charchitdhawan@gmail.com"
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-coral"
                    />
                  </div>

                  <div>
                    <label className="block text-white/60 text-sm mb-2">Location</label>
                    <input
                      type="text"
                      defaultValue="London, UK"
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-coral"
                    />
                  </div>

                  <div>
                    <label className="block text-white/60 text-sm mb-2">Bio</label>
                    <textarea
                      defaultValue="Research-oriented ML practitioner with experience across responsible AI themes (fairness, transparency, governance) and applied ML research."
                      rows={4}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-coral resize-none"
                    />
                  </div>

                  <div className="pt-4">
                    <button className="btn-primary flex items-center gap-2">
                      <Save className="w-4 h-4" />
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-coral/10 border border-coral/30 rounded-lg">
                <p className="text-white/60 text-sm">
                  <strong className="text-coral">Note:</strong> Profile changes are saved locally in this demo. 
                  To make permanent changes, you'll need to update the source code and redeploy.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
