-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'verified', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create has_role security definer function
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  website TEXT,
  location TEXT,
  verified BOOLEAN DEFAULT false,
  resonance_score INTEGER DEFAULT 0,
  credits_balance DECIMAL(10,2) DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create trigger function for new user profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create posts table (muro global)
CREATE TABLE public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT,
  media_urls TEXT[],
  media_types TEXT[],
  post_type TEXT DEFAULT 'post' CHECK (post_type IN ('post', 'photo', 'video', 'audio', 'dreamspace')),
  resonance_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  shares_count INTEGER DEFAULT 0,
  visibility TEXT DEFAULT 'public' CHECK (visibility IN ('public', 'followers', 'private')),
  is_adult BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_posts_user_id ON public.posts(user_id);
CREATE INDEX idx_posts_created_at ON public.posts(created_at DESC);

-- Enable realtime for posts
ALTER PUBLICATION supabase_realtime ADD TABLE public.posts;

-- Create resonances table (likes)
CREATE TABLE public.resonances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  emotion TEXT CHECK (emotion IN ('joy', 'love', 'wow', 'energy', 'calm')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, post_id)
);

ALTER TABLE public.resonances ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_resonances_post_id ON public.resonances(post_id);

-- Create comments table
CREATE TABLE public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_comments_post_id ON public.comments(post_id);

-- Create follows table
CREATE TABLE public.follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  following_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(follower_id, following_id),
  CHECK(follower_id != following_id)
);

ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_follows_follower_id ON public.follows(follower_id);
CREATE INDEX idx_follows_following_id ON public.follows(following_id);

-- Create chats table
CREATE TABLE public.chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  chat_type TEXT DEFAULT 'private' CHECK (chat_type IN ('private', 'group', 'channel')),
  avatar_url TEXT,
  description TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;

-- Create chat_members table
CREATE TABLE public.chat_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id UUID REFERENCES public.chats(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  joined_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(chat_id, user_id)
);

ALTER TABLE public.chat_members ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_chat_members_chat_id ON public.chat_members(chat_id);
CREATE INDEX idx_chat_members_user_id ON public.chat_members(user_id);

-- Create messages table
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id UUID REFERENCES public.chats(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT,
  media_url TEXT,
  media_type TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_messages_chat_id ON public.messages(chat_id);

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- Create dreamspaces table
CREATE TABLE public.dreamspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  space_type TEXT CHECK (space_type IN ('gallery', 'concert', 'university', 'marketplace', 'custom')),
  scene_data JSONB,
  is_public BOOLEAN DEFAULT true,
  views_count INTEGER DEFAULT 0,
  resonance_score INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.dreamspaces ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_dreamspaces_user_id ON public.dreamspaces(user_id);

-- Create artworks table (for gallery/auction)
CREATE TABLE public.artworks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  media_url TEXT NOT NULL,
  media_type TEXT NOT NULL,
  price_credits DECIMAL(10,2),
  is_for_sale BOOLEAN DEFAULT false,
  is_auction BOOLEAN DEFAULT false,
  auction_end_date TIMESTAMPTZ,
  highest_bid DECIMAL(10,2),
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.artworks ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_artworks_user_id ON public.artworks(user_id);

-- Create live_streams table
CREATE TABLE public.live_streams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  stream_type TEXT CHECK (stream_type IN ('standard', 'concert', 'webcam', 'education')),
  stream_url TEXT,
  thumbnail_url TEXT,
  is_live BOOLEAN DEFAULT false,
  is_adult BOOLEAN DEFAULT false,
  viewers_count INTEGER DEFAULT 0,
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.live_streams ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_live_streams_user_id ON public.live_streams(user_id);
CREATE INDEX idx_live_streams_is_live ON public.live_streams(is_live);

-- Create credits_transactions table
CREATE TABLE public.credits_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  transaction_type TEXT CHECK (transaction_type IN ('purchase', 'gift', 'auction', 'course', 'earning', 'lottery')),
  description TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.credits_transactions ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_credits_transactions_user_id ON public.credits_transactions(user_id);

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES
  ('avatars', 'avatars', true),
  ('posts', 'posts', true),
  ('artworks', 'artworks', true),
  ('streams', 'streams', true),
  ('dreamspaces', 'dreamspaces', true);

-- RLS Policies

-- Profiles: Everyone can read, users can update their own
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Posts: Public posts viewable, users can CRUD their own
CREATE POLICY "Public posts are viewable by everyone"
  ON public.posts FOR SELECT USING (visibility = 'public' OR user_id = auth.uid());

CREATE POLICY "Users can create their own posts"
  ON public.posts FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own posts"
  ON public.posts FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts"
  ON public.posts FOR DELETE USING (auth.uid() = user_id);

-- Resonances: Users can CRUD their own
CREATE POLICY "Users can view all resonances"
  ON public.resonances FOR SELECT USING (true);

CREATE POLICY "Users can create resonances"
  ON public.resonances FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own resonances"
  ON public.resonances FOR DELETE USING (auth.uid() = user_id);

-- Comments: Public readable, users can CRUD their own
CREATE POLICY "Comments are viewable by everyone"
  ON public.comments FOR SELECT USING (true);

CREATE POLICY "Users can create comments"
  ON public.comments FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments"
  ON public.comments FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments"
  ON public.comments FOR DELETE USING (auth.uid() = user_id);

-- Follows: Public readable, users can manage their own
CREATE POLICY "Follows are viewable by everyone"
  ON public.follows FOR SELECT USING (true);

CREATE POLICY "Users can create follows"
  ON public.follows FOR INSERT WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can delete own follows"
  ON public.follows FOR DELETE USING (auth.uid() = follower_id);

-- Chats: Members can view their chats
CREATE POLICY "Users can view chats they are members of"
  ON public.chats FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.chat_members
      WHERE chat_members.chat_id = chats.id AND chat_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create chats"
  ON public.chats FOR INSERT WITH CHECK (auth.uid() = created_by);

-- Chat members: Users can view members of their chats
CREATE POLICY "Users can view members of their chats"
  ON public.chat_members FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.chat_members cm
      WHERE cm.chat_id = chat_members.chat_id AND cm.user_id = auth.uid()
    )
  );

CREATE POLICY "Chat owners can add members"
  ON public.chat_members FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.chat_members
      WHERE chat_members.chat_id = chat_id AND chat_members.user_id = auth.uid() AND chat_members.role IN ('owner', 'admin')
    )
  );

-- Messages: Users can view/send messages in their chats
CREATE POLICY "Users can view messages in their chats"
  ON public.messages FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.chat_members
      WHERE chat_members.chat_id = messages.chat_id AND chat_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can send messages in their chats"
  ON public.messages FOR INSERT WITH CHECK (
    auth.uid() = user_id AND EXISTS (
      SELECT 1 FROM public.chat_members
      WHERE chat_members.chat_id = chat_id AND chat_members.user_id = auth.uid()
    )
  );

-- DreamSpaces: Public viewable, users can CRUD their own
CREATE POLICY "Public dreamspaces viewable"
  ON public.dreamspaces FOR SELECT USING (is_public = true OR user_id = auth.uid());

CREATE POLICY "Users can create dreamspaces"
  ON public.dreamspaces FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own dreamspaces"
  ON public.dreamspaces FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own dreamspaces"
  ON public.dreamspaces FOR DELETE USING (auth.uid() = user_id);

-- Artworks: Public viewable, users can CRUD their own
CREATE POLICY "Artworks are viewable by everyone"
  ON public.artworks FOR SELECT USING (true);

CREATE POLICY "Users can create artworks"
  ON public.artworks FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own artworks"
  ON public.artworks FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own artworks"
  ON public.artworks FOR DELETE USING (auth.uid() = user_id);

-- Live streams: Public viewable, users can CRUD their own
CREATE POLICY "Public streams viewable"
  ON public.live_streams FOR SELECT USING (true);

CREATE POLICY "Users can create streams"
  ON public.live_streams FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own streams"
  ON public.live_streams FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own streams"
  ON public.live_streams FOR DELETE USING (auth.uid() = user_id);

-- Credits transactions: Users can view own transactions
CREATE POLICY "Users can view own transactions"
  ON public.credits_transactions FOR SELECT USING (auth.uid() = user_id);

-- Storage policies for avatars
CREATE POLICY "Avatar images are publicly accessible"
  ON storage.objects FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload own avatar"
  ON storage.objects FOR INSERT WITH CHECK (
    bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update own avatar"
  ON storage.objects FOR UPDATE USING (
    bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Storage policies for posts
CREATE POLICY "Post media publicly accessible"
  ON storage.objects FOR SELECT USING (bucket_id = 'posts');

CREATE POLICY "Users can upload post media"
  ON storage.objects FOR INSERT WITH CHECK (
    bucket_id = 'posts' AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Storage policies for artworks
CREATE POLICY "Artwork media publicly accessible"
  ON storage.objects FOR SELECT USING (bucket_id = 'artworks');

CREATE POLICY "Users can upload artwork media"
  ON storage.objects FOR INSERT WITH CHECK (
    bucket_id = 'artworks' AND auth.uid()::text = (storage.foldername(name))[1]
  );