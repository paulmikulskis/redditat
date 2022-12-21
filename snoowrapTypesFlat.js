This is helpful, however as I stated above, there is no class or type of name "Post" in the snoowrap class.  Here are the following objects available for use within the snoowrap class:

export default class Comment extends VoteableContent<Comment> {
  approved: boolean;
  body_html: string;
  body: string;
  collapsed_reason: any; // ?
  collapsed: boolean;
  controversiality: number;
  depth: number;
  ignore_reports: boolean;
  /** True if comment author is the same as the Submission author */
  is_submitter: boolean;
  link_id: string;
  parent_id: string;
  removed: boolean;
  replies: Listing<Comment>;
  score_hidden: boolean;
  spam: boolean;
}

export default class Listing<T> extends Array<T> {
  constructor(options: any, _r: Snoowrap);
  isFinished: boolean;
  is_finished: boolean;
  fetchMore(options: FetchMoreOptions): Listing<T>;
  fetchAll(options?: FetchMoreOptions): Listing<T>;
  /* @deprecated */ fetchUntil(options?: FetchMoreOptions): Listing<T>;
  toJSON(): T[];
}

export interface ListingOptions {
  limit?: number;
  after?: string;
  before?: string;
  show?: string;
  count?: number;
}

export interface SortedListingOptions extends ListingOptions {
  time?: 'all' | 'hour' | 'day' | 'week' | 'month' | 'year';
}

interface FetchMoreOptions {
  amount: number;
  skipReplies?: boolean;
  skip_replies?: boolean;
  append?: boolean;
}


export default class LiveThread extends RedditContent<LiveThread> {
  description_html: string;
  description: string;
  nsfw: boolean;
  resources_html: string;
  resources: string;
  state: string;
  stream: EventEmitter;
  title: string;
  viewer_count_fuzzed: number | null;
  viewer_count: number | null;
  websocket_url: string | null;

  acceptContributorInvite(): Promise<this>;
  addUpdate(body: string): Promise<this>;
  closeStream(): void;
  closeThread(): Promise<this>;
  deleteUpdate(options: { id: string; }): Promise<this>;
  editSettings(options: LiveThreadSettings): Promise<this>;
  getContributors(): Promise<RedditUser[]>;
  getDiscussions(options?: ListingOptions): Promise<Listing<Submission>>;
  getRecentUpdates(options?: ListingOptions): Promise<Listing<LiveUpdate>>;
  inviteContributor(options: { name: string; permissions: Permissions[]}): Promise<this>;
  leaveContributor(): Promise<this>;
  removeContributor(options: { name: string; }): Promise<this>;
  report(options: { reason: ReportReason; }): Promise<this>;
  revokeContributorInvite(options: { name: string; }): Promise<this>;
  setContributorPermissions(options: {
    name: string;
    permissions: Permissions[];
  }): Promise<this>;
  strikeUpdate(options: { id: string; }): Promise<this>;
}

type Permissions = 'update' | 'edit' | 'manage';
type ReportReason = 'spam' | 'vote-manipulation' | 'personal-information' | 'sexualizing-minors' | 'site-breaking';

export interface LiveThreadSettings {
  title: string;
  description?: string;
  resources?: string;
  nsfw?: boolean;
}

interface LiveUpdate {
  body: string;
  name: string;
  embeds: Embed[];
  mobile_embeds: MobileEmbed[];
  author: RedditUser;
  created: number;
  created_utc: number;
  body_html: string;
  stricken: boolean;
  id: string;
}

interface Embed {
  url: string;
  width: number;
  height: number;
}

interface MobileEmbed extends Embed {
  provider_url: string;
  original_url: string;
  version: string;
  provider_name: string;
  type: string;
  thumbnail_url: string;
  thumbnail_height: number;
  thumbnail_width: number;
}


export enum conversationStates {
    New = 0,
    InProgress = 1,
    Archived = 2,
}

export enum modActionStates {
    Highlight = 0,
    UnHighlight = 1,
    Archive = 2,
    UnArchive = 3,
    ReportedToAdmins = 4,
    Mute = 5,
    Unmute = 6,
}

export interface ModmailMessage {
    body: string;
    bodyMarkdown: string;
    author: RedditUser;
    isInternal: boolean;
    date: string;
    id: string;
}

export interface Author {
    isMod: boolean;
    isAdmin: boolean;
    name: string;
    isOp: boolean;
    isParticipant: boolean;
    isHidden: boolean;
    id: any;
    isDeleted: boolean;
}

export interface Owner {
    displayName: string;
    type: string;
    id: string;
}

export interface ObjId {
    id: string;
    key: string;
}

export default class ModmailConversation extends RedditContent<ModmailConversation> {
    static conversationStates: conversationStates;
    static modActionStats: modActionStates;

    isAuto: boolean;
    objIds: ObjId[];
    isRepliable: boolean;
    lastUserUpdate?: any;
    isInternal: boolean;
    lastModUpdate: Date;
    lastUpdated: Date;
    authors: Author[];
    // sometimes an Owner, sometimes a Subreddit
    owner: Owner | Subreddit;
    id: string;
    isHighlighted: boolean;
    subject: string;
    participant: ModmailConversationAuthor;
    state: number;
    lastUnread?: any;
    numMessages: number;
    messages?: ModmailMessage[];

    reply(body: string, isAuthorHidden?: boolean, isInternal?: boolean): Promise<this>

    getParticipant(): Promise<ModmailConversationAuthor>;

    isRead(): boolean;

    read(): Promise<this>;
    unread(): Promise<this>;
    mute(): Promise<this>;
    unmute(): Promise<this>;
    highlight(): Promise<this>;
    unhighlight(): Promise<this>;
    archive(): Promise<this>;
    unarchive(): Promise<this>;
}


export interface BanStatus {
    endDate?: string | null;
    reason: string;
    isBanned: boolean;
    isPermanent: boolean;
}
export interface RecentPost {
    date: string;
    permalink: string;
    title: string;
}
export interface RecentConvo {
    date: string;
    permalink: string;
    id: string;
    subject: string;
}
export interface RecentComment {
    date: string;
    permalink: string;
    title: string;
    comment: string;
}
/**
 * A class representing an author from a modmail conversation
 * <style> #ModmailConversationAuthor {display: none} </style>
 * @example
 *
 * // Get a Modmail Conversation author with a given ID
 * r.getNewModmailConversation('75hxt').getParticipant()
 * @extends RedditContent
 */
export default class ModmailConversationAuthor extends RedditContent<ModmailConversationAuthor> {
    name: string;
    isMod?: boolean;
    isAdmin?: boolean;
    isOp?: boolean;
    isParticipant?: boolean;
    isHidden?: boolean;
    isDeleted?: boolean;
    banStatus?: BanStatus;
    isSuspended?: boolean;
    isShadowBanned?: boolean;
    recentPosts?: {
        [id: string]: RecentPost;
    };
    recentConvos?: {
        [id: string]: RecentConvo;
    };
    recentComments?: {
        [id: string]: RecentComment;
    };
    constructor(options: any, r: Snoowrap, hasFetched: boolean);
    /**
     * @summary Gets information on a Reddit user for the given modmail.
     * @returns {RedditUser} An unfetched RedditUser object for the requested user
     * @example
     *
     * r.getNewModmailConversation('efy3lax').getParticipant().getUser()
     * // => RedditUser { name: 'not_an_aardvark' }
     * r.getNewModmailConversation('efy3lax').getParticipant().getUser().link_karma.then(console.log)
     * // => 6
     */
    getUser(): Promise<RedditUser>;
}


xport default class MultiReddit extends RedditContent<MultiReddit> {
  can_edit: boolean;
  copied_from: string | null;
  curator: RedditUser;
  description_html: string;
  description_md: string;
  display_name: string;
  icon_name: MultiRedditIcon;
  icon_url: string | null;
  key_color: string;
  path: string;
  subreddits: Subreddit[];
  visibility: MultiRedditVisibility;
  weighting_schema: MultiRedditWeightingSchema;

  addSubreddit(sub: Subreddit | string): Promise<this>;
  copy(options: { newName: string; }): Promise<MultiReddit>;
  delete(): Promise<this>;
  edit(options: MultiRedditProperties): Promise<this>;
  removeSubreddit(sub: Subreddit | string): Promise<this>;
  rename(options: { newName: string; }): Promise<this>;
}

export interface MultiRedditProperties {
  name?: string;
  description?: string;
  visibility?: MultiRedditVisibility;
  icon_name?: MultiRedditIcon;
  key_color?: string;
  weighting_scheme?: MultiRedditWeightingSchema;
}

type MultiRedditWeightingSchema = 'classic' | 'fresh';
type MultiRedditVisibility = 'private' | 'public' | 'hidden';
type MultiRedditIcon = 'art and design' | 'ask' | 'books' | 'business' | 'cars' | 'comics' | 'cute animals' |
  'diy' | 'entertainment' | 'food and drink' | 'funny' | 'games' | 'grooming' | 'health' | 'life advice' |
  'military' | 'models pinup' | 'music' | 'news' | 'philosophy' | 'pictures and gifs' | 'science' | 'shopping' |
  'sports' | 'style' | 'tech' | 'travel' | 'unusual stories' | 'video';


export default class PrivateMessage extends ReplyableContent<PrivateMessage> {
  author: RedditUser;
  body_html: string;
  body: string;
  context: string;
  dest: string;
  distinguished: string | null;
  first_message_name: string;
  first_message: number;
  likes: any; // ?
  new: boolean;
  num_comments: number;
  parent_id: string;
  replies: Listing<PrivateMessage>;
  score: number;
  subject: string;
  subreddit_name_prefixed: string;
  subreddit: Subreddit;
  was_comment: boolean;

  deleteFromInbox(): Promise<this>;
  markAsRead(): Promise<this>;
  markAsUnread(): Promise<this>;
  muteAuthor(): Promise<this>;
  unmuteAuthor(): Promise<this>;
}


export default class RedditContent<T> extends Promise<T> {
  created_utc: number;
  created: number;
  id: string;
  name: string;
  protected _r: Snoowrap;
  protected _fetch?: boolean;
  protected _hasFetched: boolean;

  constructor(options: any, _r: Snoowrap, _hasFetched: boolean);
  fetch(): Promise<T>;
  refresh(): Promise<T>;
  toJSON(): T;
}


export default class RedditUser extends RedditContent<RedditUser> {
  /** Number of Reddit coins, only returned for your own user */
  coins?: number;
  comment_karma: number;
  /** Only returned for your own user */
  features?: Features;
  /** Only returned for your own user */
  force_password_reset?: boolean;
  /** Only returned for your own user */
  gold_creddits?: number;
  /** Only returned for your own user */
  gold_expiration?: number | null;
  /** Only returned for your own user */
  has_android_subscription?: boolean;
  /** Only returned for your own user */
  has_external_account?: boolean;
  /** Only returned for your own user */
  has_ios_subscription?: boolean;
  /** Only returned for your own user */
  has_mail?: boolean;
  has_mod_mail: boolean;
  /** Only returned for your own user */
  has_paypal_subscription?: boolean;
  /** Only returned for your own user */
  has_stripe_subscription?: boolean;
  has_subscribed: boolean;
  /** Only returned for your own user */
  has_subscribed_to_premium?: boolean;
  has_verified_mail: boolean;
  /** Only returned for your own user */
  has_visited_new_profile?: boolean;
  hide_from_robots: boolean;
  /** Image URL of the user's avatar */
  icon_img: string;
  /** Only returned for your own user */
  in_beta?: boolean;
  /** Only returned for your own user */
  in_chat?: boolean;
  /** Only returned for your own user */
  in_redesign_beta?: boolean;
  /** Only returned for your own user */
  inbox_count?: number;
  is_employee: boolean;
  /** Only returned for other users, not yourself */
  is_friend?: boolean;
  is_gold: boolean;
  is_mod: boolean;
  /** Only returned for your own user */
  is_sponsor?: boolean;
  /** Only returned for your own user */
  is_suspended?: boolean;
  link_karma: number;
  modhash?: string | null;
  /** Only returned for your own user */
  new_modmail_exists?: boolean | null;
  /** Only returned for your own user */
  num_friends?: number;
  /** Only returned for your own user */
  oauth_client_id?: string;
  /** Only returned for your own user */
  over_18?: boolean;
  /** Only returned for your own user */
  pref_autoplay?: boolean;
  /** Only returned for your own user */
  pref_clickgadget?: number;
  /** Only returned for your own user */
  pref_geopopular?: string;
  /** Only returned for your own user */
  pref_nightmode?: boolean;
  /** Only returned for your own user */
  pref_no_profanity?: boolean;
  pref_show_snoovatar: boolean;
  /** Only returned for your own user */
  pref_show_trending?: boolean;
  /** Only returned for your own user */
  pref_show_twitter?: boolean;
  /** Only returned for your own user */
  pref_top_karma_subreddits?: boolean;
  /** Only returned for your own user */
  pref_video_autoplay?: boolean;
  /** Only returned for your own user */
  seen_layout_switch?: boolean;
  /** Only returned for your own user */
  seen_premium_adblock_modal?: boolean;
  /** Only returned for your own user */
  seen_redesign_modal?: boolean;
  /** Only returned for your own user */
  seen_subreddit_chat_ftux?: boolean;
  subreddit: Subreddit | null;
  /** Only returned for your own user */
  suspension_expiration_utc?: number | null;
  verified: boolean;

  assignFlair(options: any): Promise<this>;
  friend(options: any): Promise<this>;
  getComments(options?: any): Promise<Listing<Comment>>;
  getDownvotedContent(options?: any): Promise<Listing<Comment | Submission>>;
  getFriendInformation(): Promise<any>;
  getGildedContent(options?: any): Promise<Listing<Comment | Submission>>;
  getHiddenContent(options?: any): Promise<Listing<Comment | Submission>>;
  getMultireddit(name: string): MultiReddit;
  getMultireddits(): Promise<MultiReddit[]>;
  getOverview(options?: any): Promise<Listing<Comment | Submission>>;
  getSavedContent(options?: any): Promise<Listing<Comment | Submission>>;
  getSubmissions(options?: any): Promise<Listing<Submission>>;
  getTrophies(): Promise<any>;
  getUpvotedContent(options?: any): Promise<Listing<Comment | Submission>>;
  giveGold(months: string): Promise<any>;
  unfriend(): Promise<any>;
}

interface Features {
  chat: boolean;
  chat_group_rollout: boolean;
  chat_rollout: boolean;
  chat_subreddit: boolean;
  do_not_track: boolean;
  email_verification: ExperimentFeature;
  mweb_sharing_clipboard: ExperimentFeature;
  mweb_xpromo_revamp_v2: ExperimentFeature;
  show_amp_link: boolean;
  show_nps_survey: boolean;
  spez_modal: boolean;
  top_content_email_digest_v2: ExperimentFeature;
  live_happening_now: boolean;
  adserver_reporting: boolean;
  geopopular: boolean;
  legacy_search_pref: boolean;
  listing_service_rampup: boolean;
  mobile_web_targeting: boolean;
  default_srs_holdout: ExperimentFeature;
  geopopular_ie: ExperimentFeature;
  users_listing: boolean;
  show_user_sr_name: boolean;
  whitelisted_pms: boolean;
  sticky_comments: boolean;
  upgrade_cookies: boolean;
  ads_prefs: boolean;
  new_report_flow: boolean;
  block_user_by_report: boolean;
  ads_auto_refund: boolean;
  orangereds_as_emails: boolean;
  mweb_xpromo_modal_listing_click_daily_dismissible_ios: boolean;
  adzerk_do_not_track: boolean;
  expando_events: boolean;
  eu_cookie_policy: boolean;
  utm_comment_links: boolean;
  force_https: boolean;
  activity_service_write: boolean;
  pokemongo_content: ExperimentFeature;
  post_to_profile_beta: boolean;
  reddituploads_redirect: boolean;
  outbound_clicktracking: boolean;
  new_loggedin_cache_policy: boolean;
  inbox_push: boolean;
  https_redirect: boolean;
  search_dark_traffic: boolean;
  mweb_xpromo_interstitial_comments_ios: boolean;
  live_orangereds: boolean;
  programmatic_ads: boolean;
  give_hsts_grants: boolean;
  pause_ads: boolean;
  show_recommended_link: boolean;
  mweb_xpromo_interstitial_comments_android: boolean;
  ads_auction: boolean;
  screenview_events: boolean;
  new_report_dialog: boolean;
  moat_tracking: boolean;
  subreddit_rules: boolean;
  mobile_settings: boolean;
  adzerk_reporting_2: boolean;
  mobile_native_banner: boolean;
  ads_auto_extend: boolean;
  interest_targeting: boolean;
  post_embed: boolean;
  seo_comments_page_holdout: ExperimentFeature;
  scroll_events: boolean;
  mweb_xpromo_modal_listing_click_daily_dismissible_android: boolean;
  '302_to_canonicals': boolean;
  activity_service_read: boolean;
  adblock_test: boolean;
  geopopular_in: ExperimentFeature;
}

interface ExperimentFeature {
  owner: string;
  variant: string;
  experiment_id: number;
}


export default class ReplyableContent<T> extends RedditContent<T> {
  approve(): Promise<this>;
  blockAuthor(): Promise<this>;
  ignoreReports(): Promise<this>;
  remove(options?: { spam?: boolean }): Promise<this>;
  reply(text: string): Promise<ReplyableContent<T>>;
  report(options?: { reason?: string }): Promise<this>;
  unignoreReports(): Promise<this>;
}


interface Media {
  oembed?: {
    /** The username of the uploader of the source media */
    author_name?: string;
    /** URL to the author's profile on the source website */
    author_url?: string;
    description?: string;
    height: number;
    html: string;
    /** Name of the source website, e.g. "gfycat", "YouTube" */
    provider_name: string;
    /** URL of the source website, e.g. "https://www.youtube.com" */
    provider_url: string;
    thumbnail_height: number;
    thumbnail_url: string;
    thumbnail_width: number;
    /** Name of the media on the content site, e.g. YouTube video title */
    title: string;
    type: 'video' | 'rich';
    version: string;
    width: number;
  };
  reddit_video?: {
    dash_url: string;
    duration: number;
    fallback_url: string;
    height: number;
    hls_url: string;
    is_gif: boolean;
    scrubber_media_url: string;
    transcoding_status: string;
  };
  type?: string;
}

interface MediaEmbed {
  /** HTML string of the media, usually an iframe */
  content?: string;
  height?: number;
  scrolling?: boolean;
  width?: number;
}

interface SecureMediaEmbed extends MediaEmbed {
  media_domain_url?: string;
}

export default class Submission extends VoteableContent<Submission> {
  clicked: boolean;
  comments: Listing<Comment>;
  /** Categories for original content, e.g. "comics", "drawing_and_painting" */
  content_categories: string[] | null;
  contest_mode: boolean;
  domain: string;
  hidden: boolean;
  hide_score: boolean;
  is_crosspostable: boolean;
  is_meta: boolean;
  is_original_content: boolean;
  is_reddit_media_domain: boolean;
  is_robot_indexable: boolean;
  is_self: boolean;
  is_video: boolean;
  link_flair_background_color: string;
  link_flair_css_class: string | null;
  link_flair_richtext: RichTextFlair[];
  link_flair_template_id: string | null;
  link_flair_text: string | null;
  link_flair_text_color: 'dark' | 'light';
  link_flair_type: 'text' | 'richtext';
  locked: boolean;
  media: Media | null;
  media_embed: MediaEmbed;
  media_only: boolean;
  num_comments: number;
  num_crossposts: number;
  over_18: boolean;
  parent_whitelist_status: string;
  pinned: boolean;
  previous_visits: number[];
  pwls: number;
  post_hint: string;
  preview: { enabled: boolean; images: ImagePreview[] };
  quarantine: boolean;
  removal_reason: string | null;
  removed_by_category: string | null;
  /** Same content as media, except HTTPS */
  secure_media: Media | null;
  secure_media_embed: SecureMediaEmbed;
  selftext: string;
  selftext_html: string | null;
  spam?: boolean;
  spoiler: boolean;
  subreddit_subscribers: number;
  suggested_sort: Sort | null;
  thumbnail: string;
  thumbnail_height?: number | null;
  thumbnail_width?: number | null;
  title: string;
  upvote_ratio: number;
  url: string;
  view_count: number | null;
  visited: boolean;
  whitelist_status: string;
  wls: number;

  assignFlair(options: { text: string; cssClass: string; }): Promise<this>;
  disableContestMode(): Promise<this>;
  enableContestMode(): Promise<this>;
  getDuplicates(options?: ListingOptions): Promise<Listing<Submission>>;
  getLinkFlairTemplates(): Promise<FlairTemplate[]>;
  /* @deprecated */ getRelated(options?: ListingOptions): Submission;
  hide(): Promise<this>;
  lock(): Promise<this>;
  markAsRead(): Promise<this>;
  markNsfw(): Promise<this>;
  markSpoiler(): Promise<this>;
  selectFlair(options: { flair_template_id: string; text?: string; }): Promise<this>;
  setSuggestedSort(sort: Sort): Promise<this>;
  sticky(options?: { num?: number }): Promise<this>;
  unhide(): Promise<this>;
  unlock(): Promise<this>;
  unmarkNsfw(): Promise<this>;
  unmarkSpoiler(): Promise<this>;
  unsticky(): Promise<this>;
}

interface ImagePreviewSource {
  url: string;
  width: number;
  height: number;
}

interface ImagePreview {
  source: ImagePreviewSource;
  resolutions: ImagePreviewSource[];
  variants: any; // ?
  id: string;
}


export default class Subreddit extends RedditContent<Subreddit> {
  accounts_active_is_fuzzed: boolean;
  accounts_active: number;
  active_user_count: number;
  advertiser_category: string | null;
  all_original_content: boolean;
  allow_discovery: boolean;
  allow_images: boolean;
  allow_videogifs: boolean;
  allow_videos: boolean;
  /** HEX color code */
  banner_background_color: string;
  /** URL of the banner image used on desktop Reddit */
  banner_background_image: string;
  /** URL of the banner image used on the mobile Reddit app */
  banner_img: string;
  banner_size: [number, number] | null;
  can_assign_link_flair: boolean;
  can_assign_user_flair: boolean;
  collapse_deleted_comments: boolean;
  comment_score_hide_mins: number;
  /** Image URL of the subreddit icon */
  community_icon: string;
  description_html: string;
  description: string;
  display_name: string;
  display_name_prefixed: string;
  emojis_custom_size: [number, number] | null;
  emojis_enabled: boolean;
  has_menu_widget: boolean;
  header_img: string | null;
  header_size: [number, number] | null;
  header_title: string | null;
  hide_ads: boolean;
  icon_img: string;
  icon_size: [number, number] | null;
  is_enrolled_in_new_modmail: boolean | null;
  key_color: string;
  lang: string;
  link_flair_enabled: boolean;
  link_flair_position: '' | 'left' | 'right';
  /** Will be null if user is not subscribed to this subreddit */
  notification_level: string | null;
  over18: boolean;
  /** HEX color code */
  primary_color: string;
  public_description_html: string;
  public_description: string;
  public_traffic: boolean;
  quarantine: boolean;
  show_media_preview: boolean;
  show_media: boolean;
  spoilers_enabled: boolean;
  submission_type: LinkType;
  submit_link_label: string | null;
  submit_text_html: string;
  submit_text_label: string | null;
  submit_text: string;
  subreddit_type: SubredditType;
  subscribers: number;
  suggested_comment_sort: Sort | null;
  title: string;
  url: string;
  user_can_flair_in_sr: boolean;
  user_flair_background_color: string | null;
  user_flair_css_class: string | null;
  user_flair_enabled_in_sr: boolean;
  user_flair_position: '' | 'left' | 'right';
  user_flair_richtext: RichTextFlair[];
  user_flair_template_id: string | null;
  user_flair_text: string | null;
  user_flair_text_color: 'dark' | 'light' | null;
  user_has_favorited: boolean;
  user_is_banned: boolean;
  user_is_contributor: boolean;
  user_is_moderator: boolean;
  user_is_muted: boolean;
  user_is_subscriber: boolean;
  user_sr_flair_enabled: boolean;
  user_sr_theme_enabled: boolean;
  whitelist_status: string;
  wiki_enabled: boolean;
  wls: number;

  acceptModeratorInvite(): Promise<this>;
  addContributor(options: { name: string; }): Promise<this>;
  addWikiContributor(options: { name: string; }): Promise<this>;
  banUser(options: BanOptions): Promise<this>;
  configureFlair(options: FlairConfig): Promise<this>;
  createLinkFlairTemplate(options: FlairParams): Promise<this>;
  createUserFlairTemplate(options: FlairParams): Promise<this>;
  deleteAllLinkFlairTemplates(): Promise<this>;
  deleteAllUserFlairTemplates(): Promise<this>;
  deleteBanner(): Promise<this>;
  deleteFlairTemplate(options: { flair_template_id: string; }): Promise<this>;
  deleteHeader(): Promise<this>;
  deleteIcon(): Promise<this>;
  deleteImage(options: { imageName: string; }): Promise<this>;
  deleteUserFlair(name: string): Promise<this>;
  editSettings(options: SubredditSettings): Promise<this>;
  getBannedUsers(options?: ListingOptions & { name?: string }): Promise<Listing<BannedUser>>;
  getContributors(options?: ListingOptions & { name?: string }): Promise<Listing<Contributor>>;
  getControversial(options?: ListingOptions & { time?: string }): Promise<Listing<Submission>>;
  getEdited(options?: ListingOptions & { only?: 'links' | 'comments' }): Promise<Listing<Submission | Comment>>;
  getHot(options?: ListingOptions): Promise<Listing<Submission>>;
  getLinkFlairTemplates(linkId?: string): Promise<FlairTemplate[]>;
  getModerationLog(opts?: ListingOptions & { mods?: string[]; type?: ModActionType}): Promise<Listing<ModAction>>;
  getModerators(options?: ListingOptions & { name?: string }): RedditUser[];
  getModmail(options?: ListingOptions): Promise<Listing<PrivateMessage>>;
  getNewModmailConversations(options?: ListingOptions): Promise<Listing<ModmailConversation>>;
  getModqueue(options?: ListingOptions & { only?: 'links' | 'comments' }): Promise<Listing<Submission | Comment>>;
  getMutedUsers(options?: ListingOptions & { name?: string }): Promise<Listing<MutedUser>>;
  getMyFlair(): Promise<FlairTemplate>;
  getNew(options?: ListingOptions): Promise<Listing<Submission>>;
  getNewComments(options?: ListingOptions): Promise<Listing<Comment>>;
  getRandomSubmission(): Promise<Submission>;
  getRecommendedSubreddits(options?: { omit?: string[]; }): Promise<Subreddit[]>;
  getReports(options?: ListingOptions & { only?: 'links' | 'comments' }): Promise<Listing<Submission | Comment>>;
  getRising(options?: ListingOptions): Promise<Listing<Submission>>;
  getRules(): Promise<{ rules: Rule[]; site_rules: string[] }>;
  getSettings(): Promise<SubredditSettings>;
  getSpam(options?: ListingOptions & { only?: 'links' | 'comments' }): Promise<Listing<Submission | Comment>>;
  getSticky(options?: { num?: number }): Promise<Submission>;
  getStylesheet(): Promise<string>;
  getSubmitText(): Promise<string>;
  getTop(options?: ListingOptions & { time?: Timespan }): Promise<Listing<Submission>>;
  getUnmoderated(options?: ListingOptions & { only?: 'links' | 'comments' }): Promise<Listing<Submission | Comment>>;
  getUserFlair(name: string): Promise<FlairTemplate>;
  getUserFlairList(options?: ListingOptions & { name?: string; }): Promise<Listing<UserFlair>>;
  getUserFlairTemplates(): Promise<FlairTemplate[]>;
  getWikiBannedUsers(options?: ListingOptions & { name?: string }): Promise<Listing<BannedUser>>;
  getWikiContributors(options?: ListingOptions & { name?: string }): Promise<Listing<Contributor>>;
  getWikiPage(name: string): WikiPage;
  getWikiPages(): Promise<WikiPage[]>;
  getWikiRevisions(options?: ListingOptions): Promise<Listing<WikiPageRevision>>;
  hideMyFlair(): Promise<this>;
  inviteModerator(options: { name: string; permissions?: ModeratorPermission[]; }): Promise<this>;
  leaveContributor(): Promise<this>;
  leaveModerator(): Promise<this>;
  muteUser(options: { name: string; }): Promise<this>;
  removeContributor(options: { name: string; }): Promise<this>;
  removeModerator(options: { name: string; }): Promise<this>;
  removeWikiContributor(options: { name: string; }): Promise<this>;
  revokeModeratorInvite(options: { name: string; }): Promise<this>;
  search(options: BaseSearchOptions): Promise<Listing<Submission>>;
  selectMyFlair(options: { flair_template_id: string; text?: string; }): Promise<this>;
  setModeratorPermissions(options: { name: string; permissions: ModeratorPermission; }): Promise<this>;
  setMultipleUserFlairs(flairs: Array<{
    name: string;
    text: string;
    cssClass: string;
  }>): Promise<this>;
  showMyFlair(): Promise<this>;
  submitLink(options: SubmitLinkOptions): Promise<Submission>;
  submitSelfpost(options: SubmitSelfPostOptions): Promise<Submission>;
  subscribe(): Promise<this>;
  unbanUser(options: { name: string; }): Promise<this>;
  unmuteUser(options: { name: string; }): Promise<this>;
  unsubscribe(): Promise<this>;
  unwikibanUser(options: { name: string; }): Promise<this>;
  updateStylesheet(options: { css: string; reason?: string; }): Promise<this>;
  uploadBannerImage(options: ImageUploadOptions): Promise<this>;
  uploadHeaderImage(options: ImageUploadOptions): Promise<this>;
  uploadIcon(options: ImageUploadOptions): Promise<this>;
  uploadStylesheetImage(options: ImageUploadOptions & { name: string; }): Promise<this>;
  wikibanUser(options: { name: string; }): Promise<this>;
}

// this is per-flair
interface FlairParams {
  text: string;
  cssClass?: string;
  textEditable?: boolean;
}

// this is for the entire subreddit
interface FlairConfig {
  userFlairEnabled: boolean;
  userFlairPosition: 'left' | 'right';
  userFlairSelfAssignEnabled: boolean;
  linkFlairPosition: 'left' | 'right';
  linkFlairSelfAssignEnabled: boolean;
}

export interface FlairTemplate {
  flair_css_class: string;
  flair_template_id: string;
  flair_text_editable: string;
  flair_position: string;
  flair_text: string;
}

interface UserFlair {
  flair_css_class: string;
  user: string;
  flair_text: string;
}

interface UserDetails {
  date: number;
  name: string;
  id: string;
}
type BannedUser = UserDetails & { note: string; };
type MutedUser = UserDetails;
type Contributor = UserDetails;

type SubredditType = 'public' | 'private' | 'restricted' | 'gold_restricted' | 'gold_only' | 'archived' | 'employees_only';
type LinkType = 'any' | 'link' | 'self';

type SpamLevel = 'low' | 'high' | 'all';
export interface SubredditSettings {
  name: string;
  title: string;
  public_description: string;
  description: string;
  submit_text?: string;
  hide_ads?: boolean;
  lang?: string;
  type?: SubredditType;
  link_type?: LinkType;
  submit_link_label?: string;
  submit_text_label?: string;
  wikimode?: 'modonly' | 'anyone' | 'disabled';
  wiki_edit_karma?: number;
  wiki_edit_age?: number;
  spam_links?: SpamLevel;
  spam_selfposts?: SpamLevel;
  spam_comments?: SpamLevel;
  over_18?: boolean;
  allow_top?: boolean;
  show_media?: boolean;
  exclude_banned_modqueue?: boolean;
  public_traffic?: boolean;
  collapse_deleted_comments?: boolean;
  suggested_comment_sort?: Sort; // TODO rename AvailableSorts?
  spoilers_enabled?: boolean;
  default_set?: boolean;
}

interface ImageUploadOptions {
  file: string | ReadableStream;
  imageType?: string;
}

interface Rule {
  kind: string;
  short_name: string;
  description: string;
  violation_reason: string;
  created_utc: string;
  priority: number;
  description_html: string;
}

type ModeratorPermission = 'wiki' | 'posts' | 'access' | 'mail' | 'config' | 'flair';

interface BanOptions {
  name: string;
  banMessage?: string;
  banReason?: string;
  duration?: number;
  banNote?: string;
}

type Timespan = 'hour' | 'day' | 'week' | 'month' | 'year' | 'all';

export type ModActionType = 'banuser' |
  'unbanuser' |
  'removelink' |
  'approvelink' |
  'removecomment' |
  'approvecomment' |
  'addmoderator' |
  'invitemoderator' |
  'uninvitemoderator' |
  'acceptmoderatorinvite' |
  'removemoderator' |
  'addcontributor' |
  'removecontributor' |
  'editsettings' |
  'editflair' |
  'distinguish' |
  'marknsfw' |
  'wikibanned' |
  'wikicontributor' |
  'wikiunbanned' |
  'wikipagelisted' |
  'removewikicontributor' |
  'wikirevise' |
  'wikipermlevel' |
  'ignorereports' |
  'unignorereports' |
  'setpermissions' |
  'setsuggestedsort' |
  'sticky' |
  'unsticky' |
  'setcontestmode' |
  'unsetcontestmode' |
  'lock' |
  'unlock' |
  'muteuser' |
  'unmuteuser' |
  'createrule' |
  'editrule' |
  'deleterule' |
  'spoiler' |
  'unspoiler';


interface RichTextFlair {
  /** The string representation of the emoji */
  a?: string;
  /** The type of the flair entry */
  e: 'text' | 'emoji';
  /** URL of the emoji image */
  u?: string;
  /** The text content of a text flair */
  t?: string;
}

interface Gildings {
  /** Number of Reddit Silver awarded */
  gid_1: number;
  /** Number of Reddit Gold awarded */
  gid_2: number;
  /** Number of Reddit Platinum awarded */
  gid_3: number;
}

export type SubredditType =
  | 'gold_restricted'
  | 'archived'
  | 'restricted'
  | 'employees_only'
  | 'gold_only'
  | 'private'
  | 'user'
  | 'public';

export default class VoteableContent<T> extends ReplyableContent<T> {
  approved_at_utc: number | null;
  approved_by: RedditUser | null;
  archived: boolean;
  author: RedditUser;
  author_flair_background_color: string | null;
  author_flair_css_class: string | null;
  author_flair_richtext: RichTextFlair[];
  author_flair_template_id: string | null;
  author_flair_text: string | null;
  author_flair_text_color: string | null;
  author_flair_type: 'text' | 'richtext';
  author_fullname: string;
  author_patreon_flair: boolean;
  banned_at_utc: number | null;
  banned_by: RedditUser | null;
  can_gild: boolean;
  can_mod_post: boolean;
  distinguished: 'admin' | 'moderator' | null;
  downs: number;
  edited: number | boolean;
  gilded: number;
  gildings: Gildings;
  /** true = upvoted, false = downvoted, null = hasn't voted */
  likes: boolean | null;
  mod_note: string;
  /** The name of the user that added the mod_note */
  mod_reason_by: string;
  mod_reason_title: string;
  mod_reports: string[];
  no_follow: boolean;
  num_reports: number;
  permalink: string;
  removal_reason: any; // ?
  report_reasons: string[];
  saved: boolean;
  score: number;
  send_replies: boolean;
  stickied: boolean;
  subreddit: Subreddit;
  subreddit_id: string;
  subreddit_name_prefixed: string;
  subreddit_type: SubredditType;
  ups: number;
  user_reports: string[];

  delete(): Promise<this>;
  disableInboxReplies(): Promise<this>;
  distinguish(options?: { status?: boolean | string; sticky?: boolean; }): Promise<this>;
  downvote(): Promise<this>;
  edit(updatedText: string): Promise<this>;
  enableInboxReplies(): Promise<this>;
  expandReplies(options?: { limit?: number; depth?: number; }): Promise<T>;
  gild(): Promise<this>;
  save(): Promise<this>;
  undistinguish(): Promise<this>;
  unsave(): Promise<this>;
  unvote(): Promise<this>;
  upvote(): Promise<this>;
}


export default class WikiPage extends RedditContent<WikiPage> {
  content_html: string;
  content_md: string;
  may_revise: boolean;
  revision_by: RedditUser;
  revision_date: number;

  addEditor(options: { name: string; }): Promise<this>;
  edit(options: EditOptions): Promise<this>;
  editSettings(options: Settings): Promise<this>;
  getDiscussions(options?: ListingOptions): Promise<Listing<Submission>>;
  getRevisions(options?: ListingOptions): Promise<Listing<WikiPageRevision>>;
  getSettings(): Promise<Settings>;
  hideRevision(options: { id: string; }): Promise<this>;
  removeEditor(options: { name: string; }): Promise<this>;
  revert(options: { id: string; }): Promise<this>;
}

interface Settings {
  listed: boolean;
  permissionLevel: 0 | 1 | 2;
}

interface EditOptions {
  text: string;
  reason?: string;
  perviousRevision?: string;
}

export interface WikiPageRevision {
  timestamp: number;
  reason: string;
  page: string;
  id: string;
  author: RedditUser;
}

var USER_KEYS = new Set(['author', 'approved_by', 'banned_by', 'user']);
exports.USER_KEYS = USER_KEYS;
var SUBREDDIT_KEYS = new Set(['subreddit', 'sr']);
exports.SUBREDDIT_KEYS = SUBREDDIT_KEYS;
var KINDS = {
  t1: 'Comment',
  t2: 'RedditUser',
  t3: 'Submission',
  t4: 'PrivateMessage',
  t5: 'Subreddit',
  t6: 'Trophy',
  t8: 'PromoCampaign',
  Listing: 'Listing',
  more: 'More',
  UserList: 'UserList',
  KarmaList: 'KarmaList',
  TrophyList: 'TrophyList',
  subreddit_settings: 'SubredditSettings',
  modaction: 'ModAction',
  wikipage: 'WikiPage',
  wikipagesettings: 'WikiPageSettings',
  wikipagelisting: 'WikiPageListing',
  LiveUpdateEvent: 'LiveThread',
  LiveUpdate: 'LiveUpdate',
  LabeledMulti: 'MultiReddit',
  ModmailConversation: 'ModmailConversation',
  ModmailConversationAuthor: 'ModmailConversationAuthor'
};
exports.KINDS = KINDS;
var USERNAME_REGEX = /^[\w-]{1,20}$/;
exports.USERNAME_REGEX = USERNAME_REGEX;
var MODERATOR_PERMISSIONS = ['wiki', 'posts', 'access', 'mail', 'config', 'flair'];
exports.MODERATOR_PERMISSIONS = MODERATOR_PERMISSIONS;
var LIVETHREAD_PERMISSIONS = ['update', 'edit', 'manage'];
exports.LIVETHREAD_PERMISSIONS = LIVETHREAD_PERMISSIONS;
var HTTP_VERBS = ['delete', 'get', 'head', 'patch', 'post', 'put'];
exports.HTTP_VERBS = HTTP_VERBS;
var IDEMPOTENT_HTTP_VERBS = ['delete', 'get', 'head', 'put'];
exports.IDEMPOTENT_HTTP_VERBS = IDEMPOTENT_HTTP_VERBS;
var MAX_TOKEN_LATENCY = 10000;
exports.MAX_TOKEN_LATENCY = MAX_TOKEN_LATENCY;
var MAX_API_INFO_AMOUNT = 100;
exports.MAX_API_INFO_AMOUNT = MAX_API_INFO_AMOUNT;
var MAX_API_MORECHILDREN_AMOUNT = 20;
exports.MAX_API_MORECHILDREN_AMOUNT = MAX_API_MORECHILDREN_AMOUNT;
var MAX_LISTING_ITEMS = 100;
exports.MAX_LISTING_ITEMS = MAX_LISTING_ITEMS;


"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getEmptyRepliesListing = getEmptyRepliesListing;
exports.addEmptyRepliesListing = addEmptyRepliesListing;
exports.handleJsonErrors = handleJsonErrors;
exports.findMessageInTree = findMessageInTree;
exports.formatPermissions = formatPermissions;
exports.renameKey = renameKey;
exports.buildRepliesTree = buildRepliesTree;
exports.addFullnamePrefix = addFullnamePrefix;
exports.hasFullnamePrefix = hasFullnamePrefix;
exports.addSnakeCaseShadowProps = addSnakeCaseShadowProps;
exports.defineInspectFunc = defineInspectFunc;
exports.requiredArg = requiredArg;
exports.isBrowser = exports.formatLivethreadPermissions = exports.formatModPermissions = void 0;

var _util = _interopRequireDefault(require("util"));

var _lodash = require("lodash");

var _constants = require("./constants.js");

var _More = require("./objects/More.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
* @summary Returns an unfetched empty replies Listing for an item.
* @param {Comment|Submission|PrivateMessage} item An item without a replies Listing
* @returns {Listing} The empty replies Listing
* @api private
*/
function getEmptyRepliesListing(item) {
  if (item.constructor._name === 'Comment') {
    return item._r._newObject('Listing', {
      _uri: "comments/".concat((item.link_id || item.parent_id).slice(3)),
      _query: {
        comment: item.name.slice(3)
      },
      _transform: (0, _lodash.property)('comments[0].replies'),
      _link_id: item.link_id,
      _isCommentList: true
    });
  }

  if (item.constructor._name === 'Submission') {
    return item._r._newObject('Listing', {
      _uri: "comments/".concat(item.id),
      _transform: (0, _lodash.property)('comments'),
      _isCommentList: true
    });
  }

  return item._r._newObject('Listing');
}
/**
* @summary Adds an empty replies Listing to an item.
* @param {Comment|PrivateMessage} item
* @returns {Comment|PrivateMessage} The item with the new replies Listing
* @api private
*/


function addEmptyRepliesListing(item) {
  item.replies = getEmptyRepliesListing(item);
  return item;
}

function handleJsonErrors(returnValue) {
  return function (response) {
    if ((0, _lodash.isEmpty)(response) || (0, _lodash.isEmpty)(response.json.errors)) {
      return returnValue;
    }

    throw new Error(response.json.errors[0]);
  };
}
/**
* @summary Performs a depth-first search of a tree of private messages, in order to find a message with a given name.
* @param {String} desiredName The fullname of the desired message
* @param {PrivateMessage} rootNode The root message of the tree
* @returns {PrivateMessage} The PrivateMessage with the given fullname, or undefined if it was not found in the tree.
* @api private
*/


function findMessageInTree(desiredName, rootNode) {
  return rootNode.name === desiredName ? rootNode : (0, _lodash.find)(rootNode.replies.map((0, _lodash.partial)(findMessageInTree, desiredName)));
}
/**
* @summary Formats permissions into a '+'/'-' string
* @param {String[]} allPermissionNames All possible permissions in this category
* @param {String[]} permsArray The permissions that should be enabled
* @returns {String} The permissions formatted into a '+'/'-' string
* @api private
*/


function formatPermissions(allPermissionNames, permsArray) {
  return permsArray ? allPermissionNames.map(function (type) {
    return ((0, _lodash.includes)(permsArray, type) ? '+' : '-') + type;
  }).join(',') : '+all';
}

var formatModPermissions = (0, _lodash.partial)(formatPermissions, _constants.MODERATOR_PERMISSIONS);
exports.formatModPermissions = formatModPermissions;
var formatLivethreadPermissions = (0, _lodash.partial)(formatPermissions, _constants.LIVETHREAD_PERMISSIONS);
/**
* @summary Renames a key on an object, omitting the old key
* @param {Object} obj
* @param oldKey {String}
* @param newKey {String}
* @returns {Object} A version of the object with the key renamed
* @api private
*/

exports.formatLivethreadPermissions = formatLivethreadPermissions;

function renameKey(obj, oldKey, newKey) {
  return obj && (0, _lodash.omit)(_objectSpread({}, obj, {
    [newKey]: obj[oldKey]
  }), oldKey);
}
/**
* @summary Builds a replies tree from a list of child comments or messages
* @desc When reddit returns private messages (or comments from the /api/morechildren endpoint), it arranges their in a very
nonintuitive way (see https://github.com/not-an-aardvark/snoowrap/issues/15 for details). This function rearranges the message
tree so that replies are threaded properly.
* @param {Array} childList The list of child comments
* @returns {Array} The resulting list of child comments, arranged into a tree.
* @api private
*/


function buildRepliesTree(childList) {
  var childMap = (0, _lodash.keyBy)(childList, 'name');
  childList.forEach(addEmptyRepliesListing);
  childList.filter(function (child) {
    return child.constructor._name === 'Comment';
  }).forEach(function (child) {
    return child.replies._more = _More.emptyChildren;
  });
  (0, _lodash.remove)(childList, function (child) {
    return childMap[child.parent_id];
  }).forEach(function (child) {
    if (child.constructor._name === 'More') {
      childMap[child.parent_id].replies._setMore(child);

      child.link_id = childMap[child.parent_id].link_id;
    } else {
      childMap[child.parent_id].replies.push(child);
    }
  });
  return childList;
}
/**
* @summary Adds a fullname prefix to an item, if it doesn't have a prefix already. If the item is a RedditContent object, gets
the item's fullname.
* @param {String|RedditContent} item
* @returns {String}
* @api private
*/


function addFullnamePrefix(item, prefix) {
  if (typeof item === 'string') {
    return hasFullnamePrefix(item) ? item : prefix + item;
  }

  return item.name;
}
/**
* @summary Determines whether a string is a "fullname". A "fullname" starts with "t1_", "t2_", ... "t8_", or "LiveUpdateEvent_".
* @param {String} item
* @returns {boolean}
* @api private
*/


function hasFullnamePrefix(item) {
  return /^(t\d|LiveUpdateEvent)_/.test(item);
}
/**
* @summary Adds snake_case getters and setters to an object
* @desc All of snoowrap's functions and object options used to be defined in snake_case. For backwards compatibility,
snake_case property names (e.g. for the snoowrap constructor) are still supported. This function adds snake_case getters and
setters to a camelCase object, such that accessing and setting the snake_case property also correctly set the camelCase version
of the property.
* @param {object} obj The object that should have getters/setters attached
* @returns The updated version of `obj`
* @api private
*/


function addSnakeCaseShadowProps(obj) {
  Object.keys(obj).filter(function (key) {
    return !key.startsWith('_') && key !== (0, _lodash.snakeCase)(key);
  }).forEach(function (key) {
    Object.defineProperty(obj, (0, _lodash.snakeCase)(key), {
      get: function () {
        return obj[key];
      },
      set: function (value) {
        return obj[key] = value;
      }
    });
  });
  return obj;
}

var isBrowser = typeof self === 'object';
exports.isBrowser = isBrowser;

function defineInspectFunc(obj, inspectFunc) {
  if (isBrowser) {
    return;
  } // Use the util.inspect.custom symbol if available (Node 6.6.0+)


  var inspectKey = _util.default.inspect && typeof _util.default.inspect.custom === 'symbol' ? _util.default.inspect.custom : 'inspect';
  Object.defineProperty(obj, inspectKey, {
    writable: true,
    enumerable: false,
    value: inspectFunc
  });
}

function requiredArg(argName) {
  throw new TypeError("Missing required argument ".concat(argName));
}

