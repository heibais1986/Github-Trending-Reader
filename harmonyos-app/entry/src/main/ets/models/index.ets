/**
 * Index file for exporting all data models and interfaces
 */

// Repository models
export {
  Repository,
  RepositoryOwner,
  createRepository,
  createRepositoryOwner,
  RepositoryValidator
} from './Repository';

// Browsing history models
export {
  BrowsingHistoryItem,
  BrowsingHistoryManager,
  createBrowsingHistoryManager
} from './BrowsingHistory';

// Favorites models
export {
  FavoriteItem,
  FavoritesManager,
  createFavoritesManager
} from './Favorites';

// Network models
export {
  RequestConfig,
  HttpResponse,
  NetworkError,
  NetworkErrorType,
  LoadingState,
  AppState,
  RetryConfig,
  DEFAULT_REQUEST_CONFIG,
  DEFAULT_RETRY_CONFIG,
  INITIAL_APP_STATE
} from './NetworkModels';

// API constants
export {
  ApiEndpoints,
  HttpStatusCode,
  ApiErrorCode,
  NETWORK_TIMEOUTS,
  CACHE_CONFIG,
  DATE_FORMATS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  LOADING_MESSAGES
} from '../constants/ApiConstants';

// Trending response models
export {
  TrendingResponse,
  ApiError,
  DataValidator,
  TypeGuards
} from './TrendingResponse';