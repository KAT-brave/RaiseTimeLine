'use strict';

// ============================================================
// Mock Data
// ============================================================

const USERS = [
  { id: 1, username: 'taro_yamada',  email: 'taro@example.com',    password: 'pass123', bio: 'エンジニアを目指して学習中です！', avatar: null, followingIds: [2, 3] },
  { id: 2, username: 'hanako_kato',  email: 'hanako@example.com',  password: 'pass123', bio: 'デザインとフロントエンドが好きです', avatar: null, followingIds: [1] },
  { id: 3, username: 'ryo_suzuki',   email: 'ryo@example.com',     password: 'pass123', bio: 'バックエンドエンジニア。Java大好き', avatar: null, followingIds: [1, 2] },
  { id: 4, username: 'yuki_tanaka',  email: 'yuki@example.com',    password: 'pass123', bio: 'インフラ担当。AWS勉強中',            avatar: null, followingIds: [] },
  { id: 5, username: 'mai_inoue',    email: 'mai@example.com',     password: 'pass123', bio: '主にWebアプリを作っています',        avatar: null, followingIds: [1] },
];

let POSTS = [
  {
    id: 1, userId: 2,
    content: '今日からRaiseTimeLineのプロトタイプ作成を開始しました！HTML/CSS/JSだけで全機能を実装する予定です 💪',
    images: [],
    createdAt: new Date(Date.now() - 3600000 * 2),
    likedBy: [1, 3],
    comments: [
      { id: 101, userId: 1, content: '頑張ってください！', createdAt: new Date(Date.now() - 3600000) },
    ],
  },
  {
    id: 2, userId: 3,
    content: 'Spring BootでJWT認証を実装する際のポイント：\n\n1. jjwtライブラリを使う\n2. SecurityFilterChainの設定が肝\n3. トークンはlocalStorageに保存\n\n詰まったら聞いてください！',
    images: [],
    createdAt: new Date(Date.now() - 3600000 * 5),
    likedBy: [1, 2, 4],
    comments: [],
  },
  {
    id: 3, userId: 1,
    content: 'PostgreSQLのILIKE演算子を使ったユーザー検索、意外と簡単に実装できた。\n\nSELECT * FROM users WHERE username ILIKE \'%keyword%\'\n\nこれだけ。',
    images: [],
    createdAt: new Date(Date.now() - 3600000 * 8),
    likedBy: [2],
    comments: [
      { id: 102, userId: 3, content: 'インデックスも忘れずに！', createdAt: new Date(Date.now() - 3600000 * 7) },
    ],
  },
  {
    id: 4, userId: 4,
    content: 'AWSのEC2 + RDS + ALB構成、ようやく理解できてきた。セキュリティグループの設定が一番複雑だった',
    images: [],
    createdAt: new Date(Date.now() - 3600000 * 12),
    likedBy: [],
    comments: [],
  },
  {
    id: 5, userId: 5,
    content: 'S3のpresigned URLを使った画像アップロード実装完了！クライアントから直接S3にPUTできるの便利すぎる',
    images: [],
    createdAt: new Date(Date.now() - 3600000 * 24),
    likedBy: [1, 3],
    comments: [
      { id: 103, userId: 2, content: 'これいいですね！参考にします', createdAt: new Date(Date.now() - 3600000 * 23) },
    ],
  },
  {
    id: 6, userId: 2,
    content: 'Reactの状態管理、Context APIで十分なケースが多い気がする。Reduxは大規模になってから検討でいいと思う',
    images: [],
    createdAt: new Date(Date.now() - 3600000 * 30),
    likedBy: [1],
    comments: [],
  },
  {
    id: 7, userId: 3,
    content: 'JavaのBigSerialをPKに使うのが今回のDB設計のポイント。Snowflake IDとか考えたけど、学習目的ならこれで十分',
    images: [],
    createdAt: new Date(Date.now() - 3600000 * 36),
    likedBy: [4, 5],
    comments: [],
  },
];

let nextPostId = 8;
let nextCommentId = 200;

// ============================================================
// App State
// ============================================================

let currentUser = null;
let isLoggedIn = false;
let currentTimeline = 'global';
let currentProfileUserId = null;
let currentPostId = null;
let editingPostId = null;
let createImageList = [];
let editImageList = [];
let pendingDeleteId = null;
let pendingDeleteType = null;
let previousScreen = 'timeline';
let followListUserId = null;
let followListTab = 'following';
let searchDebounceTimer = null;

// ============================================================
// Init
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  showScreen('login');
});

// ============================================================
// Screen Navigation
// ============================================================

function showScreen(screenName) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const target = document.getElementById('screen-' + screenName);
  if (target) target.classList.add('active');

  const nav = document.getElementById('bottom-nav');
  const authScreens = ['login', 'signup'];
  nav.style.display = authScreens.includes(screenName) ? 'none' : 'flex';

  // Update active nav icon
  ['home', 'search', 'profile'].forEach(id => {
    document.getElementById('nav-' + id)?.classList.remove('active');
  });
  if (screenName === 'timeline') document.getElementById('nav-home').classList.add('active');
  if (screenName === 'search') document.getElementById('nav-search').classList.add('active');
  if (screenName === 'profile' && currentProfileUserId === currentUser?.id) {
    document.getElementById('nav-profile').classList.add('active');
  }

  // Screen-specific setup
  if (screenName === 'timeline') renderTimeline();
  if (screenName === 'search') renderSearch('');
  if (screenName === 'post-create') setupPostCreate();
}

function goToMyProfile() {
  previousScreen = 'timeline';
  loadProfile(currentUser.id);
  showScreen('profile');
}

function goBackFromDetail() {
  showScreen(previousScreen);
  if (previousScreen === 'timeline') renderTimeline();
  if (previousScreen === 'profile') renderProfilePosts(currentProfileUserId);
}

function goBackFromProfile() {
  showScreen(previousScreen === 'post-detail' ? 'post-detail' : 'timeline');
}

function goBackFromEdit() {
  showScreen('post-detail');
  loadPostDetail(editingPostId);
}

function goBackFromFollowList() {
  showScreen('profile');
  loadProfile(followListUserId);
}

// ============================================================
// Auth
// ============================================================

function handleLogin() {
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  const user = USERS.find(u => u.email === email && u.password === password);
  if (!user) {
    document.getElementById('login-error').textContent = 'メールアドレスまたはパスワードが正しくありません';
    return;
  }
  loginAs(user);
}

function handleSignup() {
  const username = document.getElementById('signup-username').value.trim();
  const email = document.getElementById('signup-email').value.trim();
  const password = document.getElementById('signup-password').value;
  const errEl = document.getElementById('signup-error');

  if (!username || !email || !password) {
    errEl.textContent = 'すべての項目を入力してください';
    return;
  }
  if (USERS.find(u => u.email === email)) {
    errEl.textContent = 'このメールアドレスはすでに使用されています';
    return;
  }
  if (USERS.find(u => u.username === username)) {
    errEl.textContent = 'このユーザー名はすでに使用されています';
    return;
  }

  const newUser = {
    id: USERS.length + 1,
    username,
    email,
    password,
    bio: '',
    avatar: null,
    followingIds: [],
  };
  USERS.push(newUser);
  loginAs(newUser);
}

function loginAs(user) {
  currentUser = user;
  isLoggedIn = true;
  showScreen('timeline');
}

function handleLogout() {
  currentUser = null;
  isLoggedIn = false;
  document.getElementById('login-email').value = '';
  document.getElementById('login-password').value = '';
  document.getElementById('login-error').textContent = '';
  showScreen('login');
}

// ============================================================
// Timeline
// ============================================================

function switchTimeline(type) {
  currentTimeline = type;
  document.getElementById('tab-global').classList.toggle('active', type === 'global');
  document.getElementById('tab-following').classList.toggle('active', type === 'following');
  renderTimeline();
}

function renderTimeline() {
  // compose avatar
  setAvatarEl(document.getElementById('timeline-compose-avatar'), currentUser);

  let filtered;
  if (currentTimeline === 'following') {
    filtered = POSTS.filter(p => currentUser.followingIds.includes(p.userId));
  } else {
    filtered = [...POSTS];
  }
  filtered.sort((a, b) => b.createdAt - a.createdAt);

  const container = document.getElementById('timeline-posts');
  if (filtered.length === 0) {
    container.innerHTML = `<div class="empty-state"><h3>投稿がありません</h3><p>${currentTimeline === 'following' ? 'フォローしているユーザーの投稿がここに表示されます' : '最初の投稿をしてみましょう'}</p></div>`;
    return;
  }
  container.innerHTML = filtered.map(post => renderPostCard(post)).join('');
}

// ============================================================
// Post Card HTML
// ============================================================

function renderPostCard(post) {
  const user = getUserById(post.userId);
  const liked = post.likedBy.includes(currentUser.id);
  const isOwn = post.userId === currentUser.id;
  const avatarHtml = avatarHtmlFor(user, 'avatar');
  const imagesHtml = renderPostImages(post.images);
  const menuHtml = isOwn ? `
    <div class="post-menu">
      <button class="post-menu-btn" onclick="event.stopPropagation();toggleMenu(${post.id})">⋯</button>
      <div class="post-menu-dropdown" id="menu-${post.id}">
        <button class="post-menu-item" onclick="event.stopPropagation();openEditPost(${post.id})">✏️ 編集</button>
        <button class="post-menu-item delete" onclick="event.stopPropagation();openDeleteConfirm('post',${post.id})">🗑️ 削除</button>
      </div>
    </div>` : '';

  return `
    <div class="post-card" onclick="openPostDetail(${post.id})">
      <div class="post-header">
        <div class="avatar" onclick="event.stopPropagation();openUserProfile(${user.id})">${avatarHtml}</div>
        <div class="post-user-info">
          <div class="post-username" onclick="event.stopPropagation();openUserProfile(${user.id})">${escHtml(user.username)}</div>
          <div class="post-handle">${formatTime(post.createdAt)}</div>
        </div>
        ${menuHtml}
      </div>
      <div class="post-content">${escHtml(post.content)}</div>
      ${imagesHtml}
      <div class="post-actions">
        <button class="action-btn" onclick="event.stopPropagation();openPostDetail(${post.id})">
          <span class="icon">💬</span><span>${post.comments.length}</span>
        </button>
        <button class="action-btn ${liked ? 'liked' : ''}" onclick="event.stopPropagation();toggleLike(${post.id})">
          <span class="icon">${liked ? '❤️' : '🤍'}</span><span>${post.likedBy.length}</span>
        </button>
      </div>
    </div>`;
}

function renderPostImages(images) {
  if (!images || images.length === 0) return '';
  return `<div class="post-images count-${images.length}">${images.map(src => `<img src="${src}" alt="投稿画像" />`).join('')}</div>`;
}

// ============================================================
// Post Actions
// ============================================================

function toggleLike(postId) {
  const post = POSTS.find(p => p.id === postId);
  if (!post) return;
  const idx = post.likedBy.indexOf(currentUser.id);
  if (idx === -1) {
    post.likedBy.push(currentUser.id);
  } else {
    post.likedBy.splice(idx, 1);
  }
  // Re-render wherever this post appears
  const inTimeline = document.getElementById('timeline-posts');
  if (inTimeline) renderTimeline();
  if (document.getElementById('screen-post-detail').classList.contains('active')) {
    loadPostDetail(currentPostId);
  }
}

function toggleMenu(postId) {
  document.querySelectorAll('.post-menu-dropdown').forEach(m => {
    if (m.id !== 'menu-' + postId) m.classList.remove('open');
  });
  document.getElementById('menu-' + postId)?.classList.toggle('open');
}

document.addEventListener('click', () => {
  document.querySelectorAll('.post-menu-dropdown').forEach(m => m.classList.remove('open'));
});

// ============================================================
// Post Create
// ============================================================

function setupPostCreate() {
  createImageList = [];
  document.getElementById('post-create-textarea').value = '';
  document.getElementById('post-create-previews').innerHTML = '';
  document.getElementById('post-create-counter').textContent = '280';
  document.getElementById('post-create-counter').className = 'char-counter';
  setAvatarEl(document.getElementById('post-create-avatar'), currentUser);
}

function handlePostCreate() {
  const content = document.getElementById('post-create-textarea').value.trim();
  if (!content) { showToast('投稿内容を入力してください'); return; }
  if (content.length > 280) { showToast('投稿は280文字以内で入力してください'); return; }

  const newPost = {
    id: nextPostId++,
    userId: currentUser.id,
    content,
    images: [...createImageList],
    createdAt: new Date(),
    likedBy: [],
    comments: [],
  };
  POSTS.unshift(newPost);
  showToast('投稿しました');
  showScreen('timeline');
}

// ============================================================
// Post Edit
// ============================================================

function openEditPost(postId) {
  editingPostId = postId;
  const post = POSTS.find(p => p.id === postId);
  if (!post) return;

  editImageList = [...post.images];
  document.getElementById('post-edit-textarea').value = post.content;
  renderEditPreviews();
  updateCharCounter('post-edit-textarea', 'post-edit-counter', 'post-edit-submit');
  setAvatarEl(document.getElementById('post-edit-avatar'), currentUser);
  showScreen('post-edit');
}

function handlePostEdit() {
  const content = document.getElementById('post-edit-textarea').value.trim();
  if (!content) { showToast('投稿内容を入力してください'); return; }
  if (content.length > 280) { showToast('投稿は280文字以内で入力してください'); return; }

  const post = POSTS.find(p => p.id === editingPostId);
  if (!post) return;
  post.content = content;
  post.images = [...editImageList];

  showToast('保存しました');
  showScreen('post-detail');
  loadPostDetail(editingPostId);
}

function renderEditPreviews() {
  const area = document.getElementById('post-edit-previews');
  area.innerHTML = editImageList.map((src, i) => `
    <div class="image-preview-item">
      <img src="${src}" alt="プレビュー" />
      <button class="image-remove-btn" onclick="removeEditImage(${i})">×</button>
    </div>`).join('');
}

function removeEditImage(index) {
  editImageList.splice(index, 1);
  renderEditPreviews();
}

// ============================================================
// Post Delete
// ============================================================

function openDeleteConfirm(type, id) {
  pendingDeleteType = type;
  pendingDeleteId = id;
  document.getElementById('confirm-modal').classList.add('open');
}

function confirmDelete() {
  if (pendingDeleteType === 'post') {
    POSTS = POSTS.filter(p => p.id !== pendingDeleteId);
    closeModal();
    showToast('投稿を削除しました');
    showScreen('timeline');
  } else if (pendingDeleteType === 'comment') {
    const post = POSTS.find(p => p.comments.some(c => c.id === pendingDeleteId));
    if (post) post.comments = post.comments.filter(c => c.id !== pendingDeleteId);
    closeModal();
    showToast('コメントを削除しました');
    loadPostDetail(currentPostId);
  }
}

function closeModal() {
  document.getElementById('confirm-modal').classList.remove('open');
  pendingDeleteId = null;
  pendingDeleteType = null;
}

// ============================================================
// Post Detail
// ============================================================

function openPostDetail(postId) {
  previousScreen = document.querySelector('.screen.active')?.id?.replace('screen-', '') || 'timeline';
  currentPostId = postId;
  loadPostDetail(postId);
  showScreen('post-detail');
}

function loadPostDetail(postId) {
  const post = POSTS.find(p => p.id === postId);
  if (!post) return;
  const user = getUserById(post.userId);
  const liked = post.likedBy.includes(currentUser.id);
  const isOwn = post.userId === currentUser.id;

  const imagesHtml = renderPostImages(post.images);
  const commentsHtml = post.comments
    .sort((a, b) => a.createdAt - b.createdAt)
    .map(c => renderCommentCard(c))
    .join('');

  document.getElementById('post-detail-content').innerHTML = `
    <div class="post-detail-card">
      <div class="post-header">
        <div class="avatar" onclick="openUserProfile(${user.id})">${avatarHtmlFor(user, 'avatar')}</div>
        <div class="post-user-info">
          <div class="post-username" onclick="openUserProfile(${user.id})">${escHtml(user.username)}</div>
        </div>
        ${isOwn ? `
        <div class="post-menu">
          <button class="post-menu-btn" onclick="event.stopPropagation();toggleMenu('detail')">⋯</button>
          <div class="post-menu-dropdown" id="menu-detail">
            <button class="post-menu-item" onclick="openEditPost(${post.id})">✏️ 編集</button>
            <button class="post-menu-item delete" onclick="openDeleteConfirm('post',${post.id})">🗑️ 削除</button>
          </div>
        </div>` : ''}
      </div>
      <div class="post-detail-content">${escHtml(post.content)}</div>
      ${imagesHtml}
      <div class="post-detail-meta">${formatDateFull(post.createdAt)}</div>
      <div class="post-detail-actions">
        <button class="action-btn ${liked ? 'liked' : ''}" onclick="toggleLike(${post.id})">
          <span class="icon">${liked ? '❤️' : '🤍'}</span><span>${post.likedBy.length} いいね</span>
        </button>
        <button class="action-btn">
          <span class="icon">💬</span><span>${post.comments.length} コメント</span>
        </button>
      </div>
    </div>
    <div class="comment-form">
      <div class="avatar avatar-sm">${avatarHtmlFor(currentUser, 'avatar-sm')}</div>
      <textarea class="comment-input" id="comment-input-${postId}" placeholder="コメントを追加"></textarea>
      <button class="btn btn-primary btn-sm" onclick="submitComment(${postId})">返信</button>
    </div>
    ${commentsHtml}
  `;
}

function renderCommentCard(comment) {
  const user = getUserById(comment.userId);
  const isOwn = comment.userId === currentUser.id;
  return `
    <div class="comment-card">
      <div class="avatar avatar-sm" onclick="openUserProfile(${user.id})">${avatarHtmlFor(user, 'avatar-sm')}</div>
      <div class="comment-body">
        <div class="comment-header">
          <span class="comment-username" onclick="openUserProfile(${user.id})">${escHtml(user.username)}</span>
          <span class="comment-time">${formatTime(comment.createdAt)}</span>
          ${isOwn ? `<button class="comment-delete-btn" onclick="openDeleteConfirm('comment',${comment.id})">🗑️</button>` : ''}
        </div>
        <div class="comment-content">${escHtml(comment.content)}</div>
      </div>
    </div>`;
}

function submitComment(postId) {
  const input = document.getElementById('comment-input-' + postId);
  const content = input.value.trim();
  if (!content) return;

  const post = POSTS.find(p => p.id === postId);
  if (!post) return;

  post.comments.push({
    id: nextCommentId++,
    userId: currentUser.id,
    content,
    createdAt: new Date(),
  });
  input.value = '';
  loadPostDetail(postId);
}

// ============================================================
// Profile
// ============================================================

function openUserProfile(userId) {
  previousScreen = document.querySelector('.screen.active')?.id?.replace('screen-', '') || 'timeline';
  loadProfile(userId);
  showScreen('profile');
}

function loadProfile(userId) {
  currentProfileUserId = userId;
  const user = getUserById(userId);
  if (!user) return;

  const userPosts = POSTS.filter(p => p.userId === userId).sort((a, b) => b.createdAt - a.createdAt);
  document.getElementById('profile-header-username').textContent = user.username;
  document.getElementById('profile-header-posts-count').textContent = `${userPosts.length}件の投稿`;

  const isOwnProfile = userId === currentUser.id;
  const isFollowing = currentUser.followingIds.includes(userId);
  const followersOfUser = USERS.filter(u => u.followingIds.includes(userId));
  const followingOfUser = USERS.filter(u => u.id === userId)[0].followingIds;

  const followBtn = isOwnProfile
    ? `<button class="btn btn-outline btn-sm" onclick="showScreen('profile-edit');setupProfileEdit()">プロフィールを編集</button>`
    : `<button class="btn btn-follow ${isFollowing ? 'following' : ''}" id="follow-btn-${userId}" onclick="toggleFollow(${userId})">${isFollowing ? 'フォロー中' : 'フォローする'}</button>`;

  document.getElementById('profile-content').innerHTML = `
    <div class="profile-header-bg"></div>
    <div class="profile-info-area">
      <div class="profile-avatar-row">
        <div class="avatar avatar-lg">${avatarHtmlFor(user, 'avatar-lg')}</div>
        ${followBtn}
      </div>
      <div class="profile-username">${escHtml(user.username)}</div>
      <div class="profile-handle">@${escHtml(user.username)}</div>
      <div class="profile-bio">${user.bio ? escHtml(user.bio) : '<span style="color:#536471">自己紹介なし</span>'}</div>
      <div class="profile-stats">
        <div class="profile-stat" onclick="openFollowList(${userId},'following')">
          <strong>${followingOfUser.length}</strong> <span>フォロー中</span>
        </div>
        <div class="profile-stat" onclick="openFollowList(${userId},'followers')">
          <strong>${followersOfUser.length}</strong> <span>フォロワー</span>
        </div>
      </div>
    </div>
    <div class="divider"></div>
    <div id="profile-posts-container">
      ${userPosts.length === 0
        ? '<div class="empty-state"><h3>投稿がありません</h3><p>まだ投稿がありません</p></div>'
        : userPosts.map(p => renderPostCard(p)).join('')}
    </div>
  `;
}

function renderProfilePosts(userId) {
  loadProfile(userId);
}

function toggleFollow(userId) {
  if (userId === currentUser.id) return;
  const idx = currentUser.followingIds.indexOf(userId);
  if (idx === -1) {
    currentUser.followingIds.push(userId);
    showToast('フォローしました');
  } else {
    currentUser.followingIds.splice(idx, 1);
    showToast('フォローを解除しました');
  }
  loadProfile(userId);
}

// ============================================================
// Profile Edit
// ============================================================

function setupProfileEdit() {
  const user = currentUser;
  document.getElementById('edit-username').value = user.username;
  document.getElementById('edit-bio').value = user.bio;
  setAvatarEl(document.getElementById('edit-avatar-preview'), user);
}

function handleAvatarPreview() {
  const file = document.getElementById('edit-avatar-file').files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    const el = document.getElementById('edit-avatar-preview');
    el.innerHTML = `<img src="${e.target.result}" alt="avatar" />`;
    el._pendingAvatar = e.target.result;
  };
  reader.readAsDataURL(file);
}

function handleProfileEdit() {
  const username = document.getElementById('edit-username').value.trim();
  const bio = document.getElementById('edit-bio').value.trim();
  if (!username) { showToast('ユーザー名を入力してください'); return; }

  const avatarEl = document.getElementById('edit-avatar-preview');
  if (avatarEl._pendingAvatar) {
    currentUser.avatar = avatarEl._pendingAvatar;
  }
  currentUser.username = username;
  currentUser.bio = bio;

  showToast('プロフィールを更新しました');
  showScreen('profile');
  loadProfile(currentUser.id);
}

// ============================================================
// Follow List
// ============================================================

function openFollowList(userId, tab) {
  followListUserId = userId;
  followListTab = tab;
  const user = getUserById(userId);
  document.getElementById('follow-list-username').textContent = user.username;
  renderFollowList(tab);
  showScreen('follow-list');
}

function switchFollowTab(tab) {
  followListTab = tab;
  renderFollowList(tab);
}

function renderFollowList(tab) {
  document.getElementById('tab-following-list').classList.toggle('active', tab === 'following');
  document.getElementById('tab-followers-list').classList.toggle('active', tab === 'followers');

  const user = getUserById(followListUserId);
  let users;
  if (tab === 'following') {
    users = USERS.filter(u => user.followingIds.includes(u.id));
  } else {
    users = USERS.filter(u => u.followingIds.includes(followListUserId));
  }

  const container = document.getElementById('follow-list-content');
  if (users.length === 0) {
    container.innerHTML = `<div class="empty-state"><h3>${tab === 'following' ? 'フォロー中のユーザーがいません' : 'フォロワーがいません'}</h3></div>`;
    return;
  }
  container.innerHTML = users.map(u => renderUserListItem(u)).join('');
}

function renderUserListItem(user) {
  const isOwn = user.id === currentUser.id;
  const isFollowing = currentUser.followingIds.includes(user.id);
  const followBtn = isOwn ? '' : `
    <button class="btn btn-follow ${isFollowing ? 'following' : ''}" onclick="toggleFollowFromList(${user.id})">
      ${isFollowing ? 'フォロー中' : 'フォローする'}
    </button>`;

  return `
    <div class="user-list-item">
      <div class="avatar" onclick="openUserProfile(${user.id})">${avatarHtmlFor(user, 'avatar')}</div>
      <div class="user-list-info">
        <div class="user-list-name" onclick="openUserProfile(${user.id})">${escHtml(user.username)}</div>
        <div class="user-list-bio">${user.bio ? escHtml(user.bio) : ''}</div>
      </div>
      ${followBtn}
    </div>`;
}

function toggleFollowFromList(userId) {
  const idx = currentUser.followingIds.indexOf(userId);
  if (idx === -1) {
    currentUser.followingIds.push(userId);
    showToast('フォローしました');
  } else {
    currentUser.followingIds.splice(idx, 1);
    showToast('フォローを解除しました');
  }
  renderFollowList(followListTab);
}

// ============================================================
// User Search
// ============================================================

function renderSearch(keyword) {
  const q = keyword.toLowerCase();
  let results;
  if (!q) {
    results = [];
  } else {
    results = USERS
      .filter(u => u.id !== currentUser.id && u.username.toLowerCase().includes(q))
      .slice(0, 20);
  }

  const countEl = document.getElementById('search-results-count');
  countEl.textContent = q ? `${results.length}件見つかりました` : '';

  const container = document.getElementById('search-results');
  if (!q) {
    container.innerHTML = '<div class="empty-state"><p>ユーザー名で検索してください</p></div>';
    return;
  }
  if (results.length === 0) {
    container.innerHTML = '<div class="empty-state"><h3>ユーザーが見つかりません</h3></div>';
    return;
  }
  container.innerHTML = results.map(u => renderUserListItem(u)).join('');
}

function handleSearchInput() {
  clearTimeout(searchDebounceTimer);
  searchDebounceTimer = setTimeout(() => {
    const q = document.getElementById('search-input').value.trim();
    renderSearch(q);
  }, 300);
}

// ============================================================
// Image Handling
// ============================================================

function handleImageSelect(fileInputId, previewAreaId, imageList) {
  const input = document.getElementById(fileInputId);
  const files = Array.from(input.files);
  const remaining = 4 - imageList.length;
  if (files.length > remaining) {
    showToast(`画像は最大4枚まで添付できます（あと${remaining}枚）`);
  }
  const toAdd = files.slice(0, remaining);
  toAdd.forEach(file => {
    const reader = new FileReader();
    reader.onload = e => {
      imageList.push(e.target.result);
      if (previewAreaId === 'post-create-previews') renderCreatePreviews();
      else renderEditPreviews();
    };
    reader.readAsDataURL(file);
  });
  input.value = '';
}

function renderCreatePreviews() {
  const area = document.getElementById('post-create-previews');
  area.innerHTML = createImageList.map((src, i) => `
    <div class="image-preview-item">
      <img src="${src}" alt="プレビュー" />
      <button class="image-remove-btn" onclick="removeCreateImage(${i})">×</button>
    </div>`).join('');
}

function removeCreateImage(index) {
  createImageList.splice(index, 1);
  renderCreatePreviews();
}

// ============================================================
// Char Counter
// ============================================================

function updateCharCounter(textareaId, counterId, submitBtnId) {
  const val = document.getElementById(textareaId).value;
  const remaining = 280 - val.length;
  const el = document.getElementById(counterId);
  el.textContent = remaining;
  el.className = 'char-counter' + (remaining < 0 ? ' over' : remaining < 20 ? ' warning' : '');
  const btn = document.getElementById(submitBtnId);
  if (btn) btn.disabled = val.trim().length === 0 || remaining < 0;
}

// ============================================================
// Helpers
// ============================================================

function getUserById(id) {
  return USERS.find(u => u.id === id) || { id, username: '不明なユーザー', bio: '', avatar: null };
}

function avatarHtmlFor(user, sizeClass) {
  if (user.avatar) {
    return `<img src="${user.avatar}" alt="${escHtml(user.username)}" />`;
  }
  return escHtml((user.username || '?')[0].toUpperCase());
}

function setAvatarEl(el, user) {
  if (!el || !user) return;
  if (user.avatar) {
    el.innerHTML = `<img src="${user.avatar}" alt="${escHtml(user.username)}" />`;
  } else {
    el.textContent = (user.username || '?')[0].toUpperCase();
  }
}

function formatTime(date) {
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return `${diff}秒前`;
  if (diff < 3600) return `${Math.floor(diff / 60)}分前`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}時間前`;
  return `${Math.floor(diff / 86400)}日前`;
}

function formatDateFull(date) {
  return date.toLocaleString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function showToast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 2500);
}
