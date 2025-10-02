import {
  Mail,
  Loader2,
  GraduationCap,
  User,
  Users,
  UserPlus,
  UserCheck,
  Building2,
  Briefcase,
  Calendar,
  Award,
  Trophy,
  Star,
  Bell,
  Settings,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Download,
  Upload,
  Share,
  Heart,
  BookOpen,
  MapPin,
  Clock,
  DollarSign,
  TrendingUp,
  BarChart3,
  PieChart,
  FileText,
  Image,
  Video,
  Link,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Check,
  X,
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Info,
  HelpCircle,
  Moon,
  Sun,
  Menu,
  Home,
  LogOut,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Facebook,
  Globe,
  Phone,
  MessageCircle,
  Copy,
  QrCode,
  Shield,
  Lock,
  Unlock,
  Key,
  Zap,
  Target,
  Rocket,
  Crown,
  Gem,
  Badge as BadgeIcon,
  Medal,
  Flag,
  Bookmark,
  Grid,
  List,
  Layers,
  Database,
  Server,
  Code,
  Terminal,
  Cpu,
  Smartphone,
  Tablet,
  Laptop,
  Monitor,
  Wifi,
  WifiOff,
  RefreshCw,
  MoreHorizontal,
  MoreVertical,
  Lightbulb,
  Send,
  Activity,
} from 'lucide-react';

export const Icons = {
  // Auth & User
  mail: Mail,
  spinner: Loader2,
  graduationCap: GraduationCap,
  user: User,
  users: Users,
  userPlus: UserPlus,
  userCheck: UserCheck,
  building: Building2,
  briefcase: Briefcase,

  // Navigation
  home: Home,
  search: Search,
  filter: Filter,
  menu: Menu,
  settings: Settings,
  bell: Bell,
  logOut: LogOut,

  // Actions
  plus: Plus,
  edit: Edit,
  trash: Trash2,
  eye: Eye,
  eyeOff: EyeOff,
  download: Download,
  upload: Upload,
  share: Share,
  copy: Copy,
  send: Send,
  refresh: RefreshCw,

  // Content
  calendar: Calendar,
  award: Award,
  trophy: Trophy,
  star: Star,
  heart: Heart,
  book: BookOpen,
  fileText: FileText,
  image: Image,
  video: Video,
  link: Link,
  externalLink: ExternalLink,

  // Status & Feedback
  check: Check,
  x: X,
  alertCircle: AlertCircle,
  alertTriangle: AlertTriangle,
  checkCircle: CheckCircle,
  info: Info,
  helpCircle: HelpCircle,

  // Theme
  moon: Moon,
  sun: Sun,

  // Directions
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  chevronUp: ChevronUp,
  chevronDown: ChevronDown,
  arrowLeft: ArrowLeft,
  arrowRight: ArrowRight,
  arrowUp: ArrowUp,
  arrowDown: ArrowDown,

  // Location & Time
  mapPin: MapPin,
  clock: Clock,

  // Business
  dollarSign: DollarSign,
  trendingUp: TrendingUp,
  barChart: BarChart3,
  pieChart: PieChart,

  // Social Media
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  instagram: Instagram,
  facebook: Facebook,
  globe: Globe,
  phone: Phone,
  messageCircle: MessageCircle,

  // Security
  shield: Shield,
  lock: Lock,
  unlock: Unlock,
  key: Key,
  qrCode: QrCode,

  // Achievement & Gamification
  badge: BadgeIcon,
  medal: Medal,
  crown: Crown,
  gem: Gem,
  flag: Flag,
  bookmark: Bookmark,
  target: Target,
  rocket: Rocket,
  zap: Zap,

  // Layout
  grid: Grid,
  list: List,
  layers: Layers,
  moreHorizontal: MoreHorizontal,
  moreVertical: MoreVertical,

  // Tech
  database: Database,
  server: Server,
  code: Code,
  terminal: Terminal,
  cpu: Cpu,

  // Devices
  smartphone: Smartphone,
  tablet: Tablet,
  laptop: Laptop,
  monitor: Monitor,
  wifi: Wifi,
  wifiOff: WifiOff,

  // Actions & Utility
  lightbulb: Lightbulb,
  send: Send,
  activity: Activity,

  // Google OAuth
  google: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="currentColor"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="currentColor"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="currentColor"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  ),
};
