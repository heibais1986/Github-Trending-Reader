/**
 * Simplified Repository model for HarmonyOS application
 * Minimal implementation to reduce memory usage
 */

/**
 * Repository interface representing a GitHub repository
 */
export interface Repository {
  id: string;
  name: string;
  fullName: string;
  description: string;
  url: string;
  stars: number;
  language: string;
  owner: RepositoryOwner;
}

/**
 * Repository owner interface
 */
export interface RepositoryOwner {
  id: string;
  login: string;
  avatarUrl: string;
  url: string;
}

/**
 * Factory function to create a Repository object
 */
export function createRepository(data: Partial<Repository> = {}): Repository {
  return {
    id: data.id || '',
    name: data.name || '',
    fullName: data.fullName || '',
    description: data.description || '',
    url: data.url || '',
    stars: data.stars || 0,
    language: data.language || '',
    owner: data.owner || createRepositoryOwner()
  };
}

/**
 * Factory function to create a RepositoryOwner object
 */
export function createRepositoryOwner(data: Partial<RepositoryOwner> = {}): RepositoryOwner {
  return {
    id: data.id || '',
    login: data.login || '',
    avatarUrl: data.avatarUrl || '',
    url: data.url || ''
  };
}

/**
 * Basic validator for Repository model
 */
export class RepositoryValidator {
  /**
   * Validate if an object is a valid Repository
   */
  static isValidRepository(obj: Repository): boolean {
    if (!obj || typeof obj !== 'object') {
      return false;
    }

    const requiredFields = ['id', 'name', 'fullName', 'url'];
    
    for (const field of requiredFields) {
      let fieldValue: string | number | boolean | object | undefined;
      
      switch (field) {
        case 'id':
          fieldValue = obj.id;
          break;
        case 'name':
          fieldValue = obj.name;
          break;
        case 'fullName':
          fieldValue = obj.fullName;
          break;
        case 'url':
          fieldValue = obj.url;
          break;
        default:
          fieldValue = undefined;
      }
      
      if (fieldValue === undefined || fieldValue === null) {
        return false;
      }
    }

    return true;
  }
}